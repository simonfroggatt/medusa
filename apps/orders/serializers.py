from rest_framework import serializers
from .models import OcOrder, OcOrderProduct, OcOrderTotal, OcOrderFlags, OcTsgFlags, \
    OcTsgOrderShipment, OcTsgOrderProductStatusHistory
from django.conf import settings
from medusa.models import OcTsgOrderProductStatus
from apps.orders import services as serv
from apps.sites.models import OcStore
from apps.products.models import OcTsgProductVariants, OcTsgProductVariantCore

class ShortStoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcStore
        fields = ['store_id', 'thumb']

class OrderStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOrderProduct
        fields = ['status']

class TsgFlagSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgFlags
        fields = ['flag_name', 'flag_icon']


class OrderFlagsListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcOrderFlags
        fields = ['flag']

        depth = 1


class ProductStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOrderProductStatus
        fields = ['status_id', 'icon_path']


class OrderProductFlagsSerializer(serializers.ModelSerializer):
    status = ProductStatusSerializer(read_only=True)

    class Meta:
        model = OcOrderProduct
        fields = ['status']
    depth = 2

class OrderListSerializer(serializers.ModelSerializer):
    orderflags = OrderFlagsListSerializer(many=True, read_only=True)
    product_flags = serializers.SerializerMethodField(read_only=True)
    shipping_flag = serializers.SerializerMethodField(read_only=True)
    highlight_code = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OcOrder
        fields = [field.name for field in model._meta.fields]
        read_only_fields = (['short_date'])
        fields.extend(['dow', 'days_since_order', 'is_order', 'orderflags', 'product_flags', 'shipping_flag',
                       'short_date', 'highlight_code'])

        depth = 1

    def get_product_flags(self, obj):
        unique_flags = OcOrderProduct.objects.select_related('status').filter(order=obj.order_id,
                                                                               status__is_flag=1).order_by(
            'status__order_by').values('status__icon_path', 'status__name').distinct()
        return unique_flags.values('status__icon_path')

    def get_shipping_flag(self, obj):
        shipping_status = OcTsgOrderShipment.objects.filter(order_id=obj.order_id).order_by('-date_added').select_related(
            'shipping_status'
            ).values('shipping_status__status_title', 'shipping_status__status_colour').first()
        return shipping_status

    def get_highlight_code(self, obj):
        return serv.order_highlight_code(obj)

class OrderProductListSerializer(serializers.ModelSerializer):
    has_svg = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OcOrderProduct
        fields = [field.name for field in model._meta.fields]
        fields.extend(['product_image_url', 'order_product_option', 'order_product_variant_options', 'has_svg'])
        fields.remove('order')
        depth = 3

    def get_has_svg(self, obj):
        return obj.order_product_bespoke_image.exists()

class PreviousVariant(serializers.ModelSerializer):

    class Meta:
        model = OcTsgProductVariants
        fields = '__all__'
        depth = 2


class OrderPreviousProductListSerializer(serializers.ModelSerializer):
    product_variant_data = PreviousVariant(many=True, read_only=True)

    class Meta:
        model = OcOrderProduct
        fields = [field.name for field in model._meta.fields]
        fields.extend(['order_product_option', 'order_id', 'product_variant_data'])
        fields.remove('order')
        fields.remove('status')

        depth = 1


class OrderTotalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcOrderTotal
        fields = ['code', 'title', 'value']


class OrderProductStatusHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = OcTsgOrderProductStatusHistory
        fields = '__all__'
        depth = 2

class CustomerPreviousOrdersSerializer(serializers.ModelSerializer):
   # orderflags = OrderFlagsListSerializer(many=True, read_only=True)
   # product_flags = serializers.SerializerMethodField(read_only=True)
    shipping_flag = serializers.SerializerMethodField(read_only=True)
    highlight_code = serializers.SerializerMethodField(read_only=True)

    storeshort = ShortStoreSerializer(source='store', read_only=True)

    def get_product_flags(self, obj):
        unique_flags = OcOrderProduct.objects.select_related('status').filter(order=obj.order_id,
                                                                              status__is_flag=1).order_by(
            'status__order_by').values('status__icon_path', 'status__name').distinct()

        return unique_flags.values('status__icon_path')

    def get_shipping_flag(self, obj):
        shipping_status = OcTsgOrderShipment.objects.filter(order_id=obj.order_id).order_by('-date_added').select_related(
            'shipping_status'
            ).values('shipping_status__status_title', 'shipping_status__status_colour').first()

        return shipping_status

    def get_highlight_code(self, obj):
        return serv.order_highlight_code(obj)
#Website	Order	Reference	Date	Day	Payment Status	Order Status	Total
    class Meta:
        model = OcOrder
        read_only_fields = (['short_date'])
        fields = ['storeshort', 'customer', 'printed', 'payment_status', 'order_id', 'date_added','short_date', 'dow', 'total', 'order_status', 'payment_status','shipping_flag', 'highlight_code', 'customer_order_ref']
        depth = 1