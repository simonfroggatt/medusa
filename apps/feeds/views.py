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
    OcProductImage, OcProductToCategory
)
from apps.category.models import OcTsgCategoryStoreParent, OcCategory, OcCategoryDescription, OcCategoryDescriptionBase, OcCategoryToStore
from apps.symbols.models import OcTsgProductSymbols
from django.conf import settings
from django.db.models import Prefetch
from decimal import Decimal, ROUND_HALF_UP
from html import unescape
import re

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

        gtin_value = variant.get('gtin', '')
        mpn_value = variant.get('mpn', '')

        gtin = ET.SubElement(item, 'g:gtin')
        gtin.text = variant.get('gtin', '')
        
        mpn = ET.SubElement(item, 'g:mpn')
        mpn.text = variant.get('mpn', '')

        if not gtin_value and not mpn_value:
            identifier_exists = ET.SubElement(item, 'g:identifier_exists')
            identifier_exists.text = 'false'
        
        google_product_category = ET.SubElement(item, 'g:google_product_category')
        google_product_category.text = product_data.get('google_product_category', '')

        product_type = ET.SubElement(item, 'g:product_type')
        product_type.text = product_data.get('product_type', '')
        
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
        #get the full category path
        product_category = OcProductToCategory.objects.filter(product=product).first()
        category_path = self._build_category_path(product_category.category_store)
        return category_path

    def _build_category_path(self, starting_category_store: OcCategoryToStore):
        """
        Build a simple 'Parent > Child > Subcategory' path for Google Merchant feed.
        No hrefs, just plain text.
        """
        path_parts = []
        current_store = starting_category_store

        while current_store:
            # Get category name (prefer store name, fallback to base category name)
            cat_name = current_store.adwords_name or \
                       current_store.name or \
                       (
                           current_store.category.categorybasedesc.adwords_name if current_store.category.categorybasedesc else '') or \
                       current_store.category.name

            if cat_name:
                path_parts.append(cat_name)

            # Move to parent category
            parent_link = OcTsgCategoryStoreParent.objects.filter(category_store=current_store).first()
            if not parent_link or parent_link.is_base:
                break

            current_store = parent_link.parent

        # Reverse to build path from top-level to lowest level
        return ' > '.join(reversed(path_parts))

    def _get_category_parent_old(self, category, current_path):
        if not category or not category.category_store:
            return ''

        parent_id = category.category_store.category.parent_id
        if parent_id > 0:
            parent_category = OcTsgCategoryStoreParent.objects.filter(category_store_id=parent_id).first()
            #check that the current path is not empty first
            if category.category_store.adwords_name:
                adwords_title = category.category_store.adwords_name
            else:
                adwords_title = category.category_store.category.categorybasedesc.adwords_name

            if not adwords_title:
                adwords_title = category.category_store.category.name

            if current_path:
                pass_path = f"{adwords_title} > {current_path}"
            else:
                pass_path = f"{adwords_title}"
            return self._get_category_parent(parent_category, pass_path)
        else:
            if current_path:
                return f"{category.category_store.category.name} > {current_path}"
            else:
                return f"{category.category_store.category.name}"

    def _get_category_parent(self, category_store_parent, current_path):
        """
        Recursively build the category path until we reach a base category (is_base=True).
        """
        if not category_store_parent or not category_store_parent.category_store:
            return ''

        # Get the current category's adwords name or fallback to category name
        store_category = category_store_parent.category_store
        if store_category.adwords_name:
            adwords_title = store_category.adwords_name
        else:
            adwords_title = store_category.category.categorybasedesc.adwords_name or store_category.category.name

        # Append current title to path
        if current_path:
            path = f"{adwords_title} > {current_path}"
        else:
            path = adwords_title

        # Stop recursion if this category is marked as a base
        if category_store_parent.is_base:
            return path

        # Recurse up to the parent
        parent_category = OcTsgCategoryStoreParent.objects.filter(category_store=category_store_parent.parent).first()
        return self._get_category_parent(parent_category, path)

    def _get_product_standard(self, product):
        #get the standard for the product
        product_symbols = OcTsgProductSymbols.objects.filter(product=product).first()
        if product_symbols:
            return product_symbols.symbol.standard.title
        else:
            return ''

    def _get_product_data_old(self, store):
        """Get all products and their variants for the store"""
        products = []

        # Get all active products for this store
        store_products = OcProductToStore.objects.filter(
            store=store,
            status=True,
            include_google_merchant=True
        ).select_related(
            'product',
            'product__productdescbase',

        ).prefetch_related(
            'product__corevariants',
            'product__corevariants__storeproductvariants',
            # 'product__corevariants__size_material_combo__product_material',
            'product__productimage',
        )

        for store_product in store_products:
            product = store_product.product
            base_desc = product.productdescbase
            product_standard = self._get_product_standard(product)

            # Skip if product or description is missing
            if not product or not base_desc:
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
            category_path = self._get_product_category(product)
            if not category_path:
                continue

            # final_category = OcProductToCategory.objects.filter(product=product).first().category_store.category.name

            # Base product data
            product_data = {
                'id': f'{store.store_id}-{product.product_id}',
                'title': title,
                'description': desc,
                # 'brand': store.company_name or 'Brand Name',
                'brand': 'Safety Signs and Notices',
                'google_product_category': '5892',
                'store_url': store.url,
                'variants': [],
                # 'product_type': f"Safety Signs > {category_path}",
                'product_type': f"{category_path}",
                # Add custom labels for better ad targeting
                # 'custom_labels': {
                #    'custom_label_0': self._get_price_range_label(product),  # Price range
                #    'custom_label_1': 'bespoke' if product.is_bespoke else 'standard',  # Product type
                #    'custom_label_2': product.bulk_group.group_name if product.bulk_group else '',  # Bulk discount group
                #    'custom_label_3': 'new_arrival' if (datetime.now() - product.date_added).days < 30 else '',  # New arrivals
                #    'custom_label_4': 'bestseller' if product.viewed > 100 else ''  # Popular items
                # }
            }

            # Get all variants for this product
            core_variants = product.corevariants.all().order_by('size_material__price')
            store_variants = core_variant.storeproductvariants.filter(store=store, isdeleted=False)
            index = 0
            for core_variant in core_variants:
                # Get store-specific variant
                store_variant = core_variant.storeproductvariants.filter(store=store, isdeleted=False).first()
                if not store_variant:
                    continue

                # Calculate variant price
                if store_variant.variant_overide_price:
                    base_price = store_variant.variant_overide_price * Decimal(1.20)
                else:
                    base_price = core_variant.size_material.price * Decimal(1.20)

                variant_title = f"{base_desc.name} - {core_variant.size_material.product_size.size_name} - {core_variant.size_material.product_material.material_name}"

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
                if index == 0:
                    is_cheapest = 'cheapest_true'

                # tmp - test
                product_size = core_variant.size_material.product_size
                size_name_adwords = self._get_size_name(product_size)

                # Build variant data
                variant_data = {
                    # 'id': f'{core_variant.prod_variant_core_id}v20',
                    'id': f'{store.store_id}-{product.product_id}-{store_variant.prod_variant_id}',
                    # 'group_id': f'{store.store_id}-{product.product_id}',
                    'group_id': f'{product.product_id}',
                    'title': variant_title,
                    'price': str(base_price),
                    'availability': 'in_stock' if store_variant.prod_var_core.bl_live else 'out_of_stock',
                    'gtin': core_variant.gtin or '',
                    'mpn': core_variant.supplier_code or '',
                    'link': f"{product_link}{'&' if '?' in product_link else '?'}variantid={store_variant.prod_variant_id}",
                    # 'shipping_weight': str(core_variant.shipping_cost) if core_variant.shipping_cost else None,
                    'size': f'{core_variant.size_material.product_size.size_name}',
                    # 'size': size_name_adwords,
                    'material': f'{core_variant.size_material.product_material.material_name}',
                    'condition;': 'new',
                    'product_highlight': product_highlight,
                    # Add remarketing tags
                    'custom_label_0': f"{core_variant.size_material.product_material.material_name}",
                    # 'custom_label_1': f"{core_variant.size_material.product_size.size_name}",
                    'custom_label_1': f'{core_variant.size_material.product_size.size_name}',
                    'custom_label_2': f"{is_cheapest}",
                    'custom_label_3': f"ver20",
                    # 'custom_labels': product_data['custom_labels'].copy()  # Copy base product labels
                }

                # Handle variant images
                # if core_variant.variant_image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{core_variant.variant_image}"
                # elif store_variant.alt_image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{store_variant.alt_image}"
                # elif store_product.image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{store_product.image}"
                # elif product.image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{product.image}"

                variant_data['image_link'] = f"{core_variant.variant_image_url}"

                # Add additional images
                additional_images = []
                product_images = product.productimage.filter(main=False).order_by('sort_order')
                for img in product_images:
                    additional_images.append(f"{store.url}/media/{img.image}")
                if additional_images:
                    variant_data['additional_image_links'] = additional_images

                product_data['variants'].append(variant_data)

                index += 1

            if product_data['variants']:  # Only add products that have valid variants
                products.append(product_data)

        return products

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
            if not product or not base_desc:
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
            category_path = self._get_product_category(product)
            if not category_path:
                continue

            # final_category = OcProductToCategory.objects.filter(product=product).first().category_store.category.name

            # Base product data
            product_data = {
                'id': f'{store.store_id}-{product.product_id}',
                'title': title,
                'description': desc,
                # 'brand': store.company_name or 'Brand Name',
                'brand': 'Safety Signs and Notices',
                'google_product_category': '5892',
                'store_url': store.url,
                'variants': [],
                # 'product_type': f"Safety Signs > {category_path}",
                'product_type': f"{category_path}",
                # Add custom labels for better ad targeting
                # 'custom_labels': {
                #    'custom_label_0': self._get_price_range_label(product),  # Price range
                #    'custom_label_1': 'bespoke' if product.is_bespoke else 'standard',  # Product type
                #    'custom_label_2': product.bulk_group.group_name if product.bulk_group else '',  # Bulk discount group
                #    'custom_label_3': 'new_arrival' if (datetime.now() - product.date_added).days < 30 else '',  # New arrivals
                #    'custom_label_4': 'bestseller' if product.viewed > 100 else ''  # Popular items
                # }
            }

            # Get all variants for this product
            core_variants = product.corevariants.all().order_by('size_material__price')

            index = 0
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

                variant_title = f"{base_desc.name} - {core_variant.size_material.product_size.size_name} - {core_variant.size_material.product_material.material_name}"

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
                if index == 0:
                    is_cheapest = 'cheapest_true'


                # tmp - test
                product_size = core_variant.size_material.product_size
                size_name_adwords = self._get_size_name(product_size)

                # Build variant data
                variant_data = {
                    # 'id': f'{core_variant.prod_variant_core_id}v20',
                    'id': f'{store.store_id}-{product.product_id}-{store_variant.prod_variant_id}',
                    # 'group_id': f'{store.store_id}-{product.product_id}',
                    'group_id': f'{product.product_id}',
                    'title': variant_title,
                    'price': str(base_price),
                    'availability': 'in_stock' if store_variant.prod_var_core.bl_live else 'out_of_stock',
                    'gtin': core_variant.gtin or '',
                    'mpn': core_variant.supplier_code or '',
                    'link': f"{product_link}{'&' if '?' in product_link else '?'}variantid={store_variant.prod_variant_id}",
                    # 'shipping_weight': str(core_variant.shipping_cost) if core_variant.shipping_cost else None,
                    'size': f'{core_variant.size_material.product_size.size_name}',
                    # 'size': size_name_adwords,
                    'material': f'{core_variant.size_material.product_material.material_name}',
                    'condition': 'new',
                    'product_highlight': product_highlight,
                    # Add remarketing tags
                    'custom_label_0': f"{core_variant.size_material.product_material.material_name}",
                    # 'custom_label_1': f"{core_variant.size_material.product_size.size_name}",
                    'custom_label_1': f'{core_variant.size_material.product_size.size_name}',
                    'custom_label_2': f"{is_cheapest}",
                    'custom_label_3': f"ver20",
                    'gtin': core_variant.gtin or '',
                    'mpn': '',
                    # 'custom_labels': product_data['custom_labels'].copy()  # Copy base product labels
                }

                # Handle variant images
                # if core_variant.variant_image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{core_variant.variant_image}"
                # elif store_variant.alt_image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{store_variant.alt_image}"
                # elif store_product.image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{store_product.image}"
                # elif product.image:
                #    variant_data['image_link'] = f"{settings.MEDIA_URL}{product.image}"

                variant_data['image_link'] = f"{core_variant.variant_image_url}"

                # Add additional images
                additional_images = []
                product_images = product.productimage.filter(main=False).order_by('sort_order')
                for img in product_images:
                    additional_images.append(f"{store.url}/media/{img.image}")
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
        
        # Add each product to the feed
        for product_data in products:
            self._add_product_to_channel(channel, product_data)
        
        # Convert to string
        #xml_str = ET.tostring(rss, encoding='unicode', method='xml')
        xml_str = ET.tostring(rss, encoding='utf8', method='xml')

        # Return as XML response with store name in filename
        response = HttpResponse(xml_str, content_type='application/xml')
        response['Content-Disposition'] = f'attachment; filename="{store.name.lower().replace(" ", "_")}_google_merchant_feed.xml"'
        return response
