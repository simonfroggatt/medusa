import requests
from django.conf import settings
from apps.orders.models import OcTsgOrderShipment, OcTsgShippingStatus, OcOrder


def check_all_shipment_statuses():
    #get all the orders that are shipped but not delivered
    shipped_obj = OcTsgOrderShipment.objects.filter(order_shipping_status=1, order_id__gte=100000)
    #step though each order
    for shipment in shipped_obj:
        if shipment.shipping_courier_id == 1:
            _dpd_tracking_check(shipped_obj.tracking_number)
            pass

        elif shipment.shipping_courier_id == 2:
            # FEDEX
            pass

        elif shipment.shipping_courier_id == 3:
            # Royal Mail logic
            pass

        elif shipment.shipping_courier_id == 4:
            # DX logic
            pass

        else:
            # Unknown or unsupported courier
            print(f"Courrier not needed: {shipment.shipping_courier_id}")


def _dpd_tracking_check(tracking_number):
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
        <trackingrequest>
        <user>{settings.DPD_USERNAME}</user>
        <password>{settings.DPD_PASSWORD}</password>
        <trackingnumbers>
        <trackingnumber>{tracking_number}</trackingnumber>
        </trackingnumbers>
        </trackingrequest>"""

    response = requests.post(
        url="https://apps.geopostuk.com/trackingcore/ie/parcels",
        headers={"Content-Type": "application/xml"},
        data=xml,
        timeout=15
    )

    # Parse and update status as needed
    if response.status_code == 200:
        # parse response.content and update shipment.status
        """OcTsgShipmentTrackingEvent.objects.create(
    shipment=shipment,
    status="Delivered",
    status_code="DLV",
    event_time=datetime_from_courier,
    location="London Depot",
    courier_message="Package delivered to front door"
)"""
        pass
    else:
        # log or retry if needed
        pass
