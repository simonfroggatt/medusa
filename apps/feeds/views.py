from decimal import Decimal
import html
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import xml.etree.ElementTree as ET
from datetime import datetime
from apps.sites.models import OcStore
from apps.products.models import (
    OcProduct,
    OcProductDescriptionBase,
    OcProductToStore,
    OcTsgProductVariantCore,
    OcTsgProductVariants,
    OcProductImage, OcTsgProductToCategory
)
from apps.pricing.models import OcTsgSizeMaterialCombPrices
from apps.category.models import OcTsgCategoryParent, OcCategory, OcCategoryDescription, OcCategoryDescriptionBase, OcTsgCategory
from apps.symbols.models import OcTsgProductSymbols
from django.conf import settings
from django.db.models import Prefetch
from decimal import Decimal, ROUND_HALF_UP
from html import unescape
import re
import logging
logger = logging.getLogger('apps')
import os

from django.db.models import Case, When, Value, F, OuterRef, Subquery, Min, ExpressionWrapper, DecimalField, Q, Prefetch
from django.db.models.functions import Coalesce


def clean_description(text):
    text = unescape(text)  # Decode any HTML entities like &lt;, &amp;, &quot;, etc.
    text = re.sub(r'<.*?>', '', text)  # Remove any HTML tags
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces/tabs/newlines with a single space
    return text.strip()


class GoogleMerchantViewSet(viewsets.ViewSet):
    
    def _add_product_to_channel(self, channel, product_data):
        """Helper method to add a product with all required Google Merchant fields"""
        # If product has variants, create separate items for each variant
        variants = product_data.get('variants', [])
        if variants:
            for variant in variants:
                self._add_variant_to_channel(channel, product_data, variant)
        else:
            self._add_single_product_to_channel(channel, product_data)

    def _add_variant_to_channel(self, channel, product_data, variant):
        """Add a product variant as an item in the feed"""
        item = ET.SubElement(channel, 'item')
        
        # Base product fields
        id_elem = ET.SubElement(item, 'g:id')
        id_elem.text = str(variant.get('id'))
        
        title = ET.SubElement(item, 'title')
        title.text = variant.get('title')

        description = ET.SubElement(item, 'description')
        description.text = clean_description(product_data.get('description'))
        
        link = ET.SubElement(item, 'link')
        link.text = html.escape(variant.get('link'), quote=True)

        item_group = ET.SubElement(item, 'g:item_group_id')
        item_group.text = str(variant.get('group_id'))
        
        image_link = ET.SubElement(item, 'g:image_link')
        image_link.text = html.escape(variant.get('image_link'), quote=True)
        
        # Additional variant images
        additional_images = variant.get('additional_image_links', [])
        for img_url in additional_images[:10]:
            additional_image = ET.SubElement(item, 'g:additional_image_link')
            additional_image.text = html.escape(img_url, quote=True)
        
        availability = ET.SubElement(item, 'g:availability')
        availability.text = variant.get('availability', 'in_stock')

        price = ET.SubElement(item, 'g:price')
        price_value = Decimal(variant.get('price')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        price.text = f"{price_value} GBP"

        
        brand = ET.SubElement(item, 'g:brand')
        brand.text = product_data.get('brand')
        
        condition = ET.SubElement(item, 'g:condition')
        condition.text = 'new'

        gtin_value = ''
        #gtin_value = variant.get('gtin', '').strip()
        mpn_value = variant.get('mpn', '').strip()

        if gtin_value:
            gtin = ET.SubElement(item, 'g:gtin')
            gtin.text = gtin_value

        if mpn_value:
            mpn = ET.SubElement(item, 'g:mpn')
            mpn.text = mpn_value

        if not gtin_value and not mpn_value:
            identifier_exists = ET.SubElement(item, 'g:identifier_exists')
            identifier_exists.text = 'false'
        
        google_product_category = ET.SubElement(item, 'g:google_product_category')
        google_product_category.text = product_data.get('google_product_category', '')

        product_type = ET.SubElement(item, 'g:product_type')
        product_type.text = product_data.get('product_type', '')

        shipping = ET.SubElement(item, 'g:shipping')
        country = ET.SubElement(shipping, 'g:country')
        country.text = 'UK'
        service = ET.SubElement(shipping, 'g:service')
        service.text = 'Standard'
        shippingprice = ET.SubElement(shipping, 'g:price')
        price_value = Decimal(variant.get('shipping_cost')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        shippingprice.text = f"{price_value} GBP"




        # Optional fields
        for field, value in variant.items():
            if field in ['color', 'size', 'material', 'pattern','product_highlight'] and value:
                elem = ET.SubElement(item, f'g:{field}')
                elem.text = value


        if variant.get('shipping_weight'):
            weight = ET.SubElement(item, 'g:shipping_weight')
            weight.text = f"{variant['shipping_weight']} kg"
            
        if variant.get('sale_price'):
            sale_price = ET.SubElement(item, 'g:sale_price')
            sale_price.text = f"{variant['sale_price']} GBP"
            
            if variant.get('sale_price_effective_date'):
                sale_date = ET.SubElement(item, 'g:sale_price_effective_date')
                sale_date.text = variant['sale_price_effective_date']


        # Add custom labels for remarketing
        for field, value in variant.items():
            if field in ['custom_label_0', 'custom_label_1', 'custom_label_2', 'custom_label_3', 'custom_label_4'] and value:
                elem = ET.SubElement(item, f'g:{field}')
                elem.text = value

    def _get_product_category(self, product):
        data = dict()

        product_category = OcTsgProductToCategory.objects.filter(product=product, status=True).first()
        # we need to check that this category is active on the site.

        if not product_category or not product_category.category:
            logger.warning(f"Product {product.product_id} does not have a valid category.")
            data['category_path'] = ''
            return data

        if not product_category.category.status:
            logger.warning(f"Product {product.product_id} is in a offline category.")
            data['category_path'] = ''
            return data

        data['category_path'] = self._build_category_path(product_category.category)
        data['google_category'] = product_category.category.google_cat_id
        return data

    def _build_category_path(self, starting_category_store: OcTsgCategory):
        """
        Build a simple 'Parent > Child > Subcategory' path for Google Merchant feed.
        No hrefs, just plain text.
        """
        path_parts = []
        current_store = starting_category_store

        while current_store:
            # Get category name (prefer store name, fallback to base category name)
            #cat_name = current_store.adwords_name or current_store.name
            cat_name = current_store.name
            if cat_name:
                path_parts.append(cat_name)

            # Move to parent category
            parent_link = OcTsgCategoryParent.objects.filter(category=current_store).order_by('sort_order').first()
            if not parent_link or not parent_link.parent:
                break

            current_store = parent_link.parent

        # Reverse to build path from top-level to lowest level
        return ' > '.join(reversed(path_parts))

    def _get_category_parent(self, category_parent, current_path):
        """
        Recursively build the category path until we reach a base category (is_base=True).
        """
        if not category_parent:
            return ''

        # Get the current category's adwords name or fallback to category name
        store_category = category_parent.parent
        #if store_category.adwords_name:
        #    adwords_title = store_category.adwords_name
        #else:
        adwords_title = store_category.name

        # Append current title to path
        if current_path:
            path = f"{adwords_title} > {current_path}"
        else:
            path = adwords_title

        # Stop recursion if this category is marked as a base
        if category_parent is None:
            return path

        # Recurse up to the parent
        parent_category = OcTsgCategoryParent.objects.first().sort_order('sort_order')
        return self._get_category_parent(parent_category, path)

    def _get_product_standard(self, product):
        #get the standard for the product
        product_symbols = OcTsgProductSymbols.objects.filter(product=product).first()
        if product_symbols:
            return product_symbols.symbol.standard.title
        else:
            return ''


    def _get_product_data(self, store):
        """Get all products and their variants for the store"""
        products = []

        store_variants_prefetch = Prefetch(
            'storeproductvariants',
            queryset=OcTsgProductVariants.objects.filter(store=store, isdeleted=False),
            to_attr='filtered_store_variants'
        )

        store_products = OcProductToStore.objects.filter(
            store=store,
            status=True,
            include_google_merchant=True
        ).select_related(
            'product',
            'product__productdescbase',
        ).prefetch_related(
            Prefetch(
                'product__corevariants',
                queryset=OcTsgProductVariantCore.objects.order_by('size_material__price').prefetch_related(
                    store_variants_prefetch)
            ),
            'product__corevariants__size_material',
            'product__corevariants__size_material__product_material',
            'product__corevariants__size_material__product_size',
            'product__productimage',
        )

        for store_product in store_products:
            product = store_product.product
            base_desc = product.productdescbase
            product_standard = self._get_product_standard(product)

            # Skip if product or description is missing
            if not product or not base_desc or not product.status:
                continue

            if store_product.name:
                title = store_product.name
            else:
                title = base_desc.name

            if store_product.description:
                desc = store_product.description
            else:
                desc = base_desc.description

            # need the category
            category_data = self._get_product_category(product)
            if not category_data['category_path']:
                continue

            #check if there is a product_to_store -> google cat set, otherwise get the category one
            if store_product.google_shopping_category:
                google_cat = store_product.google_shopping_category_id
            else:
                google_cat = category_data['google_category']

            # Base product data
            product_data = {
                'id': f'{product.product_id}',
                'title': title,
                'description': desc,
                'brand': f'{store.name}',
                'google_product_category': f'{google_cat}',
                'store_url': store.url,
                'variants': [],
                'product_type': f"{category_data['category_path']}",

            }

            # Get all variants for this product
            core_variants = product.corevariants.all().order_by('size_material__price')

            index = 0
            current_material_id = 0
            for core_variant in core_variants:
                store_variant = next(
                    (sv for sv in getattr(core_variant, 'filtered_store_variants', []) if
                     sv.store_id == store.store_id),
                    None
                )
                if not store_variant:
                    continue

                # Calculate variant price
                if store_variant.variant_overide_price:
                    base_price = store_variant.variant_overide_price * Decimal(1.20)
                else:
                    base_price = core_variant.size_material.price * Decimal(1.20)

                variant_title = f"{title} - {core_variant.size_material.product_size.size_name} - {core_variant.size_material.product_material.material_name}"

                # check the length, if it's more than 150 then print the product id
                if len(variant_title) > 150:
                    print(f"Length Product ID: {product.product_id} = length is {len(variant_title)}")

                store_url = "https://www.safetysignsandnotices.co.uk/"
                if base_desc.clean_url:
                    product_link = f"{store_url}{base_desc.clean_url}"
                else:
                    product_link = f"{store_url}index.php?route=product/product&product_id={product.product_id}"

                product_highlight = ''
                if product_standard:
                    product_highlight = f"Product conforms to {product_standard}"

                is_cheapest = 'cheapest_false'
                if core_variant.size_material.product_material_id != current_material_id:
                    current_material_id = core_variant.size_material.product_material_id
                    if index == 0:
                        is_cheapest = 'cheapest_variant'
                    else:
                        is_cheapest = 'cheapest_material'
                    # then we have a new material here

                if index == 0:
                    is_cheapest = 'cheapest_variant'
                    current_material_id = core_variant.size_material.product_material_id

                # tmp - test
                product_size = core_variant.size_material.product_size
                size_name_adwords = self._get_size_name(product_size)

                shipping_cost = 3.95 * 1.2
                if core_variant.shipping_cost > 0:
                    shipping_cost = core_variant.shipping_cost * Decimal('1.2')

                #have we ecluded it from shopping?
                include_ads = store_product.include_google_ads
                # Build variant data
                variant_data = {
                    # 'id': f'{core_variant.prod_variant_core_id}v20',
                    'id': f'{store_variant.prod_variant_id}',
                    'group_id': f'{product.product_id}',
                    'title': variant_title,
                    'price': str(base_price),
                    'availability': 'in_stock' if store_variant.prod_var_core.bl_live else 'out_of_stock',
                    'gtin': core_variant.gtin or '',
                    'mpn': core_variant.supplier_code or '',
                    'link': f"{product_link}{'&' if '?' in product_link else '?'}variantid={store_variant.prod_variant_id}",
                    'size': f'{core_variant.size_material.product_size.size_name}',
                    'material': f'{core_variant.size_material.product_material.material_name}',
                    'condition': 'new',
                    'product_highlight': product_highlight,
                    'custom_label_0': f"{is_cheapest}",
                    'custom_label_1': f"{core_variant.size_material.product_material.material_name}",
                    'custom_label_2': f'{core_variant.size_material.product_size.size_name}',
                    'custom_label_3': f'{include_ads}',
                    'shipping_cost': str(shipping_cost)
                }

                variant_data['image_link'] = f"{core_variant.variant_image_url}"

                # Add additional images
                additional_images = []
                product_images = product.productimage.filter(main=False).order_by('sort_order')
                for img in product_images:
                    additional_images.append(f"{img.image_url}")
                if additional_images:
                    variant_data['additional_image_links'] = additional_images

                product_data['variants'].append(variant_data)

                index += 1

            if product_data['variants']:  # Only add products that have valid variants
                products.append(product_data)

        return products

    def _get_size_name(self, product_size):
        """Get the size name for a product size"""
        return product_size.size_name

        if product_size.orientation_id == 4:
            size_name = f'{product_size.size_height}mm diameter'
        elif product_size.orientation_id == 5:
            size_name = f'{product_size.size_height}mm triangle'
        else:
            size_name = f'{product_size.size_width}mm x {product_size.size_height}mm'
        return size_name
        
    def _get_price_range_label(self, product):
        """Get price range label for a product"""
        min_price = float('inf')
        max_price = 0
        
        for variant in product.corevariants.all():
            price = variant.supplier_price
            if price:
                min_price = min(min_price, float(price))
                max_price = max(max_price, float(price))
        
        if min_price == float('inf'):
            return ''
            
        # Create price range labels
        if max_price <= 10:
            return 'under_10'
        elif max_price <= 25:
            return '10_to_25'
        elif max_price <= 50:
            return '25_to_50'
        elif max_price <= 100:
            return '50_to_100'
        else:
            return 'over_100'
    
    @action(detail=False, methods=['get'])
    def generate(self, request):
        site_id = request.query_params.get('site_id')
        if not site_id:
            return Response({'error': 'site_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            store = OcStore.objects.get(store_id=site_id)
            if not store.status:
                return Response({'error': 'Store is not active'}, status=status.HTTP_400_BAD_REQUEST)
        except OcStore.DoesNotExist:
            return Response({'error': 'Store not found'}, status=status.HTTP_404_NOT_FOUND)


        # Create the root element
        xmlver = ET.Element('xml')
        xmlver.set('version', '1.0')
        xmlver.set('encoding', 'UTF-8')

        rss = ET.Element('rss')
        rss.set('version', '2.0')
        rss.set('xmlns:g', 'http://base.google.com/ns/1.0')
        
        channel = ET.SubElement(rss, 'channel')
        
        # Add feed metadata using store information
        title = ET.SubElement(channel, 'title')
        title.text = f'{store.name} Product Feed'
        
        description = ET.SubElement(channel, 'description')
        description.text = f'Google Merchant Product Feed for {store.name}'

        store_link = ET.SubElement(channel, 'link')
        store_link.text = store.url

        
        # Get all products for this store
        products = self._get_product_data(store)
        #products = self._get_product_data_mins(store)
        
        # Add each product to the feed
        for product_data in products:
            self._add_product_to_channel(channel, product_data)
        
        # Convert to string

        #xml_str = ET.tostring(rss, encoding='utf8', method='xml')

        # Return as XML response with store name in filename
        #response = HttpResponse(xml_str, content_type='application/xml')
        #response['Content-Disposition'] = f'attachment; filename="{store.name.lower().replace(" ", "_")}_google_merchant_feed.xml"'
        #return response

        # Convert XML to string
        xml_str = ET.tostring(rss, encoding='utf8', method='xml')

        # Define a file path
        logger.info(f"Saving Google Merchant feed for store {store.name} to file.")
        output_dir = os.path.join(settings.BASE_DIR,'logs')  # <-- Change this to wherever you want it
        os.makedirs(output_dir, exist_ok=True)

        filename = f"{store.name.lower().replace(' ', '_')}_google_merchant_feed.xml"
        file_path = os.path.join(output_dir, filename)

        # Write the XML to a file
        with open(file_path, 'wb') as f:
            f.write(xml_str)

        # Optionally return a simple response
        return Response({'success': True, 'message': f'Feed saved to {file_path}'})