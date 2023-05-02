from rest_framework import serializers
from .models import OcProduct, OcProductDescription, OcProductDescriptionBase, OcTsgProductVariantCore, \
    OcTsgSizeMaterialComb, OcTsgProductVariants, OcProductToStore, OcProductToCategory
from apps.category.models import OcCategoryToStore
from django.conf import settings
from apps.symbols.models import OcTsgProductSymbols
from apps.options.models import OcTsgProductVariantCoreOptions

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
        fields = ['supplier_code']

class ProductDescriptionSites(serializers.ModelSerializer):
    class Meta:
        model = OcProductDescription
        fields = ['name', 'title', 'description']



class ProductListSerializer(serializers.ModelSerializer):
    productdescbase = ProductDescriptionBase(read_only=True)
    corevariants = ProductVariantCoreSerializer(many=True, read_only=True)
  #  corevariants = serializers.SerializerMethodField(read_only=True)

    def get_corevariants(self, products):
        return ', '.join(
            [''.join(str(variants.supplier_code).split()) for variants in products.corevariants.only('supplier_code')])

    def get_image_url(self, product):
        return f"{settings.MEDIA_URL}{product.image}"


    class Meta:
        model = OcProduct
        #fields = ['product_id', 'model', 'image_url', 'status', 'productdescbase', 'corevariants']
        fields = ['product_id', 'model', 'image_url', 'status', 'productdescbase', 'corevariants']
        depth = 2


class SizeMaterialCombSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgSizeMaterialComb
        fields = ['product_size', 'product_material', 'price']
        depth = 2


class CoreVariantSerializer(serializers.ModelSerializer):
    size_material = SizeMaterialCombSerializer(read_only=True)
    class Meta:
        model = OcTsgProductVariantCore
        fields = ['prod_variant_core_id','supplier_code', 'variant_image_url', 'gtin', 'bl_live', 'size_material']
        depth = 3


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductVariants
        fields = ['variant_code', 'variant_overide_price', 'prod_var_core']
        depth = 3


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
        fields = '__all__'

        depth = 1


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OcProductToCategory
        fields = '__all__'
        depth = 2

class ProductSymbolSerialzer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductSymbols
        fields = '__all__'
        depth = 1

class ProductCoreVariantOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgProductVariantCoreOptions
        fields= '__all__'
        depth = 2





