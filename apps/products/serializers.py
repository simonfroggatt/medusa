from rest_framework import serializers
from apps.products.models import OcProduct, OcProductDescriptionBase, OcTsgProductVariantCore, \
    OcTsgSizeMaterialComb, OcTsgProductVariants, OcProductToStore, OcProductToCategory, OcProductRelated
from apps.options.models import OcTsgProductVariantOptions, OcTsgProductOption, OcTsgProductOptionValues
from apps.category.models import OcCategoryToStore
from apps.pricing.models import OcTsgSizeMaterialCombPrices
from django.conf import settings
from apps.symbols.models import OcTsgProductSymbols
from apps.options.models import OcTsgProductVariantCoreOptions, OcOptionValues
import os

class ProductSerializer(serializers.ModelSerializer):
    #corevariants = serializers.RelatedField(many=True)
   # corevariants = serializers.ReadOnlyField(source='corevariants.supplier_code')
   # corevariants = serializers.SerializerMethodField()


    # def get_corevariants(self, products):
    #     rtn_code = ""
    #     for variants in products.corevariants.all():
    #         sup_code = str(variants.supplier_code)
    #         sup_code_tmp = "".join(sup_code.split())
    #         rtn_code += "," + sup_code_tmp
    #         variant_code = variants.prodvariants.only('variant_code')
    #         for variants_extra in variant_code:
    #             var_code = str(variants_extra.variant_code)
    #             var_code_tmp = "".join(var_code.split())
    #             rtn_code += "," + var_code_tmp
    #
    #     return  rtn_code

        #return ', '.join([''.join(str(variants.supplier_code).split()) for variants in products.corevariants.only('supplier_code')])
    def get_image_url(self, product):
        return f"{settings.MEDIA_URL}{product.image}"


    class Meta:
        model = OcProduct
        fields = ['product_id', 'model', 'image', 'status', 'image_url']
        depth = 1

# class BaseProductListSerializer(serializers.ModelSerializer):
#     #product = ProductSerializer(required=True)
#     product = ProductSerializer()
#     class Meta:
#         model = Ocproductdescbaseription
#         fields = ['name', 'title', 'description', 'product']
#         depth = 2



#class productdescbaseription(serializers.ModelSerializer):
#    class Meta:
#        model = Ocproductdescbaseription
#        fields = ['name', 'title', 'description']


class ProductDescriptionBase(serializers.ModelSerializer):
    class Meta:
        model = OcProductDescriptionBase
        fields = ['name', 'title', 'description']


class ProductVariantCoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductVariantCore
        fields = ['supplier_code', 'supplier_price']


class ProductToStoreInfoSerializer(serializers.ModelSerializer):
    corevariants = ProductVariantCoreSerializer(many=True, read_only=True)
    productdescbase = ProductDescriptionBase(read_only=True)

    class Meta:
        model = OcProduct
        fields = ['corevariants','model', 'image', 'status', 'productdescbase']
        depth = 1


class ProductListSerializer(serializers.ModelSerializer):
    productdescbase = ProductDescriptionBase(read_only=True)
    corevariants = ProductVariantCoreSerializer(many=True, read_only=True)

    #def get_corevariants(self, products):
    #    return ', '.join(
    #        [''.join(str(variants.supplier_code).split()) for variants in products.corevariants.only('supplier_code')])

    def get_image_url(self, product):
        return f"{settings.MEDIA_URL}{product.image}"


    class Meta:
        model = OcProduct
        #fields = ['product_id', 'model', 'image_url', 'status', 'productdescbase', 'corevariants']
        fields = ['product_id', 'model', 'image_url', 'status','productdescbase', 'corevariants']
        depth = 2


class ProductStoreProductSerializer(serializers.ModelSerializer):
    productdescbase = ProductDescriptionBase(read_only=True)

    class Meta:
        model = OcProduct
        fields = ['model', 'productdescbase']


class SizeMaterialCombSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgSizeMaterialComb
        fields = ['product_size', 'product_material', 'price']
        depth = 2


class CoreVariantSerializer(serializers.ModelSerializer):
    size_material = SizeMaterialCombSerializer(read_only=True)
    class Meta:
        model = OcTsgProductVariantCore
        fields = ['prod_variant_core_id','supplier_code', 'supplier_price', 'variant_image_url', 'gtin', 'bl_live', 'size_material', 'pack_count']
        depth = 3


class ProductVariantSerializer(serializers.ModelSerializer):
    #alt_image_url return variant image filtered by site, if no image return the variant core alt image
    #the variant vore image if blank returns the underlying product image

    store_size_material_price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OcTsgProductVariants
        fields = ['prod_variant_id', 'variant_code', 'variant_overide_price', 'prod_var_core', 'alt_image', 'store',
                  'isdeleted', 'alt_image_url', 'store_size_material_price', 'site_variant_image_url']
        depth = 4

    def get_store_size_material_price(self, obj):
        store_price = OcTsgSizeMaterialCombPrices.objects.filter(size_material_comb=obj.prod_var_core.size_material.id).filter(store_id=obj.store.store_id).values('price').first()
        if store_price:
            return store_price['price']
        else:
            return 0



class StoreProductVariantSerialize(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductVariants
        fields = ['variant_code', 'variant_overide_price']


class StoreCoreProductVariantSerialize(serializers.ModelSerializer):
    size_material = SizeMaterialCombSerializer(read_only=True)
    storeproductvariants = StoreProductVariantSerialize(read_only=True)


    class Meta:
        model = OcTsgProductVariantCore
        fields = ['prod_variant_core_id','supplier_code', 'variant_image_url', 'gtin', 'size_material', 'storeproductvariants']
        depth = 3



class TestProduct(serializers.ModelSerializer):
    class Meta:
        model = OcProduct
        fields = ['product_id', 'model', 'image']


class ProductStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcProductToStore
        fields = [field.name for field in model._meta.fields]
        fields.extend(['image_url'])

        depth = 1


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OcProductToCategory
        fields = '__all__'
        depth = 2

class ProductSymbolSerialzer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductSymbols
        fields = [field.name for field in model._meta.fields]
        fields.extend(['symbol_image_url'])



        depth = 1

class ProductCoreVariantOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductVariantCoreOptions
        fields= '__all__'
        depth = 2


class ProductSiteVariantOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductVariantOptions
        fields= '__all__'
        depth = 2


class RelatedBaseDescriptionSerializer(serializers.ModelSerializer):
    productdescbase = ProductDescriptionBase(read_only=True)
    class Meta:
        model = OcProduct
        fields = ['product_id', 'model', 'image', 'status', 'productdescbase']
        depth = 2


class ProductToStoreRelatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcProductToStore
        fields = ['product', 'store']
        depth = 1


class RelatedSerializer(serializers.ModelSerializer):
    product_desc = serializers.SerializerMethodField(read_only=True)
    product_related_store = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OcProductRelated

        fields = ['id', 'order', 'product_desc', 'product_related_store']
        depth = 2;

    def get_product_desc(self, obj):
       # productdesc = OcProductToStore.objects.select_related('storeproduct').select_related('productdescbysite').filter(pk=obj.related_id).values('storeproduct__image',
        #                                                                                                     'productdescbase__name')
      #  productdesc = OcProduct.objects.select_related('productdescbysite').filter(pk=obj.related_id).values('image','productdescbase__name')

        productdesc = OcProductToStore.objects.select_related('product__productdescbase').filter(pk=obj.related_id).values('product__image', 'product__productdescbase__name')
        return productdesc.first()


    def get_product_related_store(self, obj):
        productstore = OcProductToStore.objects.select_related('store').filter(pk=obj.related_id).values('store__thumb')
        return productstore.first()


class ProductStoreListSerializer(serializers.ModelSerializer):
    product = ProductToStoreInfoSerializer(read_only=True)
   # productdescbase = ProductDescriptionBase(read_only=True)
    corevariants = ProductVariantCoreSerializer(many=True, read_only=True)
    #corevariants = serializers.SerializerMethodField(read_only=True)

    #def get_corevariants(self, product):
     #    qs = OcTsgProductVariantCore.objects.filter(storeproductvariants__store_id=product.store_id, product_id=product.product_id)
    #     serializer = ProductVariantCoreSerializer(instance=qs, many=True, read_only=True)
     #    return serializer.data


    def get_image_url(self, product):
         return #f"{settings.MEDIA_URL}{product.image}"

    class Meta:
        model = OcProductToStore
        #fields = ['product_id', 'name']
        fields = ['id', 'product_id', 'image_url', 'name', 'title', 'description', 'bulk_group', 'corevariants', 'product']
        depth = 2


class RelatedByStoreProductSerializer(serializers.ModelSerializer):
    related = ProductStoreListSerializer(read_only=True)

    class Meta:
        model = OcProductRelated
        fields = ['related']
        depth = 1


class ProductSupplierListSerializer(serializers.ModelSerializer):
    productdescbase = ProductDescriptionBase(read_only=True)

    def get_image_url(self, product):
         return #f"{settings.MEDIA_URL}{product.image}"

    class Meta:
        model = OcProduct
        #fields = ['product_id', 'name']
        fields = [ 'productdescbase', 'image_url', 'status']
        depth = 2




class ProductOptionsValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgProductOptionValues
        fields = ['id', 'sort_order', 'option_value']
        depth = 2



    def get_option_desc(self, obj):
        return obj.option.option_desc

    def get_option_value_desc(self, obj):
        return obj.option_value_desc


class ProductOptionsCurrentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductOption
        fields = '__all__'
        depth = 2

class ProductOptionValuesSerializer(serializers.ModelSerializer):


    class Meta:
        model = OcOptionValues
        fields = '__all__'
        depth = 2