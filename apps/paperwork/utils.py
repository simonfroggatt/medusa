from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
import pathlib
from svglib.svglib import svg2rlg
from django.db.models import Sum, F, Q
from decimal import Decimal, ROUND_HALF_UP
from itertools import chain
from django.urls import path, include
from apps.orders.models import OcTsgOrderOption, OcTsgOrderProductOptions, OcOrderProduct, OcTsgOptionTypes
from apps.products.models import OcTsgProductVariants, OcTsgProductVariants, OcTsgProductVariantCore, OcProduct
from apps.options.models import OcTsgProductOption, OcTsgOptionValues
from django.conf import settings
from urllib.parse import quote
import os
from cairosvg import svg2png
from django.shortcuts import render, get_object_or_404
from reportlab_qrcode import QRCodeImage
from apps.orders.services import create_due_date
import json

def create_company_logo(company_obj):
    maxW = 90 * mm
    maxH = 20 * mm

    if settings.STATIC_ROOT:
        img_src = settings.STATIC_ROOT + '/paperwork/images/' + company_obj.logo_paperwork
    else:
        img_src = settings.STATIC_URL + '/paperwork/images/'  + company_obj.logo_paperwork
    #img_src = settings.STATIC_ROOT +'/paperwork/images/' + company_obj.logo_paperwork

    image_type = pathlib.Path(img_src).suffix
    if image_type.lower() == '.svg':
        comp_logo = svg2rlg(img_src)
        w = comp_logo.width
        h = comp_logo.height
        scaleW = maxW / w
        scaleY = maxH / h
        scaleNew = min(scaleY, scaleW)
        comp_logo.scale(scaleNew, scaleNew)
    else:
        comp_logo = Image(img_src)
        comp_logo._restrictSize(maxW, maxH)

    return comp_logo


def create_address(company_obj):
    address = ""
    address += company_obj.company_name
    address += '<BR/>' + company_obj.address
    address += '<BR/>' + company_obj.postcode
    address += '<BR/>Tel: ' + company_obj.telephone
    address += '<BR/>' + company_obj.email_address
    address += '<BR/>VAT# ' + company_obj.vat_number
    return address


def contact_details(order_obj):
    contacts_str = ""
    if order_obj.shipping_company:
        contacts_str += "Company: " + order_obj.shipping_company + "<BR/>"
    contacts_str += "Contact: " + order_obj.shipping_fullname + "<BR/>"
    contacts_str += "Telephone: " + order_obj.shipping_telephone
    return contacts_str


def order_details(order_obj):
    order_str = ""
    order_str += "Order: <B>" + order_obj.store.prefix + '-' + str(order_obj.order_id) + "</B><BR/>"
    order_str += "Date: " + order_obj.date_added.strftime('%d/%m/%Y') + "<BR/>"
    if order_obj.customer_order_ref:
        order_str += "Ref: " + order_obj.customer_order_ref
    return order_str

def get_shipping_address(order_obj):
    shipping_str = ''
    shipping_str += order_obj.shipping_fullname + "<BR/>"
    if order_obj.shipping_company:
        shipping_str += order_obj.shipping_company + "<BR/>"

    if order_obj.shipping_address_1:
        shipping_str += order_obj.shipping_address_1.replace("\n", "<br/>") + "<br/>"

    if order_obj.shipping_address_2:
        shipping_str += order_obj.shipping_address_2.replace("\n", "<br/>") + "<br/>"

    if order_obj.shipping_city:
        shipping_str += order_obj.shipping_city + "<BR/>"

    if order_obj.shipping_area:
        shipping_str += order_obj.shipping_area + "<BR/>"

    if order_obj.shipping_postcode:
        shipping_str += order_obj.shipping_postcode + "<BR/>"




    return shipping_str


def shipping_address_keep(order_obj):
    shipping_str = get_shipping_address(order_obj)
    shipping_str += "<BR/><BR/>Telephone: " + order_obj.shipping_telephone
    shipping_str += f'<BR/>Order ref: <b>{order_obj.order_id}</b>'
    shipping_str += "<BR/>Website: " + order_obj.store.name
    return shipping_str

def shipping_order_details(order_obj):
    shipping_str = ''
    if order_obj.shipping_method:
        shipping_str += f"Shipping: {order_obj.shipping_method}<br/>"
    else:
        shipping_value = order_obj.order_totals.filter(code='shipping').first()
        if shipping_value:
            shipping_value = shipping_value.title
        else:
            shipping_value = 'No shipping specified'

        shipping_str += f"Shipping: {shipping_value}<br/>"

    if order_obj.shipping_telephone:
        shipping_str += f"Telephone: {order_obj.shipping_telephone}<br/>"

    shipping_str += f"Order ref: <b>{order_obj.order_id}</b><br/>"

    if order_obj.store and order_obj.store.name:
        shipping_str += f"Website: {order_obj.store.name}<br/>"

    if order_obj.comment:
        shipping_str += f"Comment: {order_obj.comment}"

    return shipping_str

def order_billing(order_obj):
    billing_str = '<b>Billing Address:</b><BR/>'
    billing_str += order_obj.payment_fullname + "<BR/>"
    if order_obj.payment_company:
        billing_str += order_obj.payment_company + "<BR/>"
    billing_str += order_obj.payment_address_1 + "<BR/>"
    if order_obj.payment_address_2:
        billing_str += order_obj.payment_address_2 + "<BR/>"
    billing_str += order_obj.payment_city + "<BR/>"
    if order_obj.payment_area:
        billing_str += order_obj.payment_area + "<BR/>"
    billing_str += order_obj.payment_postcode + "<BR/>"
    billing_str += order_obj.payment_country
    return billing_str


def order_shipping(order_obj):
    shipping_str = '<b>Shipping Address:</b><BR/>'
    shipping_str += order_obj.shipping_fullname + "<BR/>"
    if order_obj.shipping_company:
        shipping_str += order_obj.shipping_company + "<BR/>"
    if order_obj.shipping_address_1:
        shipping_str += order_obj.shipping_address_1 + "<BR/>"
    if order_obj.shipping_address_2:
        shipping_str += order_obj.shipping_address_2 + "<BR/>"
    if order_obj.shipping_city:
        shipping_str += order_obj.shipping_city + "<BR/>"
    if order_obj.shipping_area:
        shipping_str += order_obj.shipping_area + "<BR/>"
    if order_obj.shipping_postcode:
        shipping_str += order_obj.shipping_postcode + "<BR/>"
    if order_obj.shipping_country:
        shipping_str += order_obj.shipping_country + "<BR/>"

    return shipping_str


def order_invoice_details(order_obj):
    order_str = ""
    order_str += "Invoice Number: <B>" + order_obj.store.prefix + '-' + str(order_obj.order_id) + "</B><BR/>"
    order_str += "Invoice Date: " + order_obj.date_added.strftime('%d/%m/%Y') + "<BR/>"
    order_str += "Due Date: " + order_obj.date_added.strftime('%d/%m/%Y') + "<BR/>"
    if order_obj.customer_order_ref:
        order_str += f'Your Reference: {order_obj.customer_order_ref}<BR/>'
    order_str += f'Main Contact: {order_obj.fullname}<BR/>'
    order_str += f'Telephone: {order_obj.telephone}<BR/>'
    order_str += f'Email: {order_obj.email}'
    return order_str


def order_invoice_details_tup(order_obj):
    order_details_tup = dict()
    order_details_tup['Invoice Number'] = f'{order_obj.store.prefix}-{order_obj.order_id}'
    order_details_tup['Invoice Date'] = order_obj.date_added.strftime('%d/%m/%Y')
   # order_details_tup['Due Date'] = order_obj.date_due.strftime('%d/%m/%Y')
    order_details_tup['Your Reference:'] = f'{order_obj.customer_order_ref}'
    order_details_tup['Main Contact'] = f'{order_obj.fullname}'
    order_details_tup['Telephone'] = f'{order_obj.telephone}'
    order_details_tup['Email'] = f'{order_obj.email}'
    return order_details_tup


def order_total_table(order_total_obj, currency_symbol):
    order_total_tup = []
    order_total_data = order_total_obj.values('title', 'value')
    for order_total_pair in list(order_total_data):
        tmp_data = [''] * 2
        tmp_data[0] = order_total_pair['title']
        value_round = round(order_total_pair['value'], 2)
        tmp_data[1] = f'{currency_symbol}{value_round}'
        order_total_tup.append(tmp_data)
    return order_total_tup


def order_payment_details(order_obj, currency_symbol):
    order_payment_str = ''
    if order_obj.payment_history:
        order_history_obj = order_obj.payment_history.order_by('-date_added').first()
        if order_history_obj.payment_status_id != 2:
            order_payment_str = 'Payment not received / failed'
            order_payment_str += '<BR/>Last Payment Attempt Type:' + order_history_obj.payment_status.name
            order_payment_str += ' made by:' + order_history_obj.payment_method.method_name
            order_payment_str += '<BR/>Merchant message ' + order_history_obj.comment
        else:
            order_payment_str = 'Paid with thanks'
            order_payment_str += '<BR/>Paid via ' + order_history_obj.payment_method.method_name
            if order_obj.date_due:
                order_payment_str += ' at ' + order_obj.date_due.strftime('%d/%m/%Y')
            order_payment_str += '<BR/>' + order_history_obj.comment
    else:
        order_payment_str = 'Payment Type ss:' + order_obj.payment_status.name
        order_payment_str += '<BR/>Due Date:' + order_obj.date_added.strftime('%d/%m/%Y')
    return order_payment_str


def order_payment_details_simple(order_obj, currency_symbol):
    order_payment_str = ''
    create_due_date(order_obj)
    if order_obj.payment_status_id == 2:
        order_payment_str = 'Paid with thanks'
        order_payment_str +='<br/>Paid via ' + order_obj.payment_method.method_name
    elif order_obj.payment_status_id == 3:
        order_payment_str = 'Paid on account'
        order_payment_str += '<BR/>Due Date : ' + order_obj.date_due.strftime('%d/%m/%Y')
    else:
        order_payment_str = 'Payment Method : ' + order_obj.payment_method.method_name + '<BR/>'
        order_payment_str += 'Payment Status : ' + order_obj.payment_status.name
        order_payment_str += '<BR/>Due Date : ' + order_obj.date_due.strftime('%d/%m/%Y')
    return order_payment_str


def order_proforma_details_tup(order_obj):
    order_details_tup = dict()
    order_details_tup['Proforma Number'] = f'PF-{order_obj.store.prefix}-{order_obj.order_id}'
    order_details_tup['Proforma Date'] = order_obj.date_added.strftime('%d/%m/%Y')
    order_details_tup['Main Contact'] = f'{order_obj.fullname}'
    order_details_tup['Telephone'] = f'{order_obj.telephone}'
    order_details_tup['Email'] = f'{order_obj.email}'
    return order_details_tup


def proforma_details_legal():
    proforma_string = 'This is a Proforma Invoice for information only.<BR/>A VAT invoice will be issued upon receipt of payment.'
    return proforma_string

def create_product_desc(order_line, bl_orientation=True, bl_quote = False):
    product_desc = ''
    product_desc += order_line.name + "<BR/>"
    product_desc += f'{order_line.size_name} - '
    if bl_orientation:
        product_orientaion = f'({order_line.orientation_name})'
    else:
        product_orientaion = ''
    product_desc += f'{order_line.material_name} {product_orientaion}'
    if bl_quote:
        options_text = get_order_product_line_options(order_line.product_id)
    else:
        options_text = get_order_product_line_options(order_line.order_product_id)
    product_desc = f'{product_desc}<BR/>{options_text}'

    return product_desc

def create_product_line_option_description(order_line):
    options_text = get_order_product_line_options(order_line.order_product_id)
    return options_text


def quote_shipping(quote_obj):
    shipping_str = '<b>Address:</b><BR/>'
    shipping_str += quote_obj.fullname + "<BR/>"
    if quote_obj.company:
        shipping_str += quote_obj.company + "<BR/>"

    if quote_obj.quote_address:
        shipping_str += quote_obj.quote_address + "<BR/>"

    if quote_obj.quote_city:
        shipping_str += quote_obj.quote_city + "<BR/>"

    if quote_obj.quote_area:
        shipping_str += quote_obj.quote_area + "<BR/>"

    if quote_obj.quote_postcode:
        shipping_str += quote_obj.quote_postcode + "<BR/>"
    #shipping_str += quote_obj.shipping_country
    return shipping_str


def quote_details_tup(quote_obj):
    quote_details_tup = dict()
    quote_details_tup['Quote Number'] = f'Q-{quote_obj.store.prefix}-{quote_obj.quote_id}'
    quote_details_tup['Quote Date'] = quote_obj.date_added.strftime('%d/%m/%Y')
   # order_details_tup['Due Date'] = order_obj.date_due.strftime('%d/%m/%Y')
    quote_details_tup['Main Contact'] = f'{quote_obj.fullname}'
    quote_details_tup['Telephone'] = f'{quote_obj.telephone}'
    quote_details_tup['Email'] = f'{quote_obj.email}'
    return quote_details_tup

def quote_total_table(quote_obj, quote_product_obj, currency_symbol):
    quote_total_tup = dict()
    tax_rate = quote_obj.tax_rate.rate
    if quote_product_obj:
        subtotal = quote_product_obj.aggregate(sum=Sum(F('price') * F('quantity')))['sum']
        subtotal_rounded = Decimal(subtotal.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        quote_total_tup['SubTotal'] = f'{currency_symbol}{subtotal_rounded}'
        discount = Decimal(quote_obj.discount)
        discount_rounded = Decimal(discount.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        subtotal_net = subtotal_rounded - discount_rounded + quote_obj.shipping_rate
        tax_rounded = Decimal((subtotal_net * (tax_rate / 100)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        total_rounded = Decimal((subtotal_net + tax_rounded).quantize(Decimal('.01'), rounding=ROUND_HALF_UP))

        quote_total_tup[f'{quote_obj.shipping_type}'] = f'{currency_symbol}{quote_obj.shipping_rate}'

        quote_total_tup['Discount'] = f'{currency_symbol}{discount_rounded}'

        quote_total_tup[f'{quote_obj.tax_rate}'] = f'{currency_symbol}{tax_rounded}'

        quote_total_tup['Total'] = f'{currency_symbol}{total_rounded}'
    else:
        quote_total_tup[f'{quote_obj.shipping_type}'] = f'{currency_symbol}{quote_obj.shipping_rate}'
        quote_total_tup['Discount'] = 0.00
        quote_total_tup[f'{quote_obj.tax_rate}'] = 0.00
        quote_total_tup['Total'] = 0.00

    return quote_total_tup


def quote_valid_details(quote_obj, currency_symbol):
    quote_valid_str = ''
    quote_valid_str = f'Quote Valid for {quote_obj.days_valid} days'
    return quote_valid_str


def draw_footer(canvas, doc, order_obj):
    canvas.saveState()
    footer_company_str = ""
    footer_company_str += order_obj.store.company_name
    if order_obj.store.footer_text:
        footer_company_str += " " + order_obj.store.footer_text
    if order_obj.store.registration_number:
        footer_company_str += " Registered in England No. " + order_obj.store.registration_number

    canvas.setFont('Helvetica', 8, leading=None)
    canvas.drawString(5 * mm, 5 * mm, footer_company_str)
    canvas.restoreState()

class NumberedCanvas(canvas.Canvas):

    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        """add page info to each page (page x of y)"""
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.setFont('Helvetica', 8, leading=None)
        self.drawRightString(205*mm, 5*mm,
            "Page %d of %d" % (self._pageNumber, page_count))


def order_has_options(order_id):
    order_options_obj = OcTsgOrderOption.objects.filter(order_id=order_id)
    if order_options_obj:
        return True

    order_addons_obj = OcTsgOrderProductOptions.objects.filter(order_product__order_id=order_id)
    if order_addons_obj:
        return True
    else:
        return False


def get_order_product_line_options(order_product_id):
    options_obj = OcTsgOrderOption.objects.filter(order_product_id=order_product_id)
    option_text = ''
    option_break = ''
    for index, option in enumerate(options_obj):
        if index > 0:  # Check if this is not the first option
            option_break = '<BR/>'
        option_text += f'{option.option_name} : {option.value_name}{option_break}'

    addon_obj = OcTsgOrderProductOptions.objects.filter(order_product_id=order_product_id)

    addon_break = ''
    addon_text = ''
    for index, addon in enumerate(addon_obj):
        if index > 0:  # Check if this is not the first option
            addon_break = '<BR/>'
        addon_text += f'{option_break}{addon.class_name} : {addon.value_name}{addon_break}'

    return f'{option_text}{option_break}{addon_text}'

def order_has_product_options(order_id):
    extra_items = OcTsgOptionTypes.objects.filter( Q(extra_product=True) | Q(extra_variant=True) ).values_list('option_type_id')
    options_to_check = list(chain(*extra_items))
    #not see if any of these are in the order_prodcts
    order_products = OcTsgOrderProductOptions.objects.filter(order_product__order_id=order_id).filter(class_type_id__in=options_to_check)
    if order_products:
        test_order_id = order_products[0].order_product_id
        return True
    else:
        return False

def get_order_product_line_add(order_product_id, bl_options = False, style = [], store_id=1, qty = 0):
    #see if this order line has options that are extra products / variants
    extra_items = OcTsgOptionTypes.objects.filter(Q(extra_product=True) | Q(extra_variant=True)).values_list(
        'option_type_id')
    options_to_check = list(chain(*extra_items))
    product_obj = []
    order_products = OcTsgOrderProductOptions.objects.filter(order_product_id=order_product_id).filter(class_type_id__in=options_to_check)
    for order_item_data in order_products.iterator():
        product_table_line = dict()
        #these options are products...create table rows
        product_variant_id = order_item_data.value_id
        #product_obj_variant = OcTsgProductVariantCore.objects.filter(prod_variant_core_id=product_variant_id).first()
        product_table_line['table'] = _create_addon_data_for_table(product_variant_id, bl_options, style, store_id, qty)
        product_table_line['qty_added'] = qty
        #then we have a product with options that are add products
        product_obj.append(product_table_line)

    return product_obj

def _create_addon_data_for_table(product_variant_id, bl_options = False, styles = [], store_id = 1, qty = 0):
    image_max_h = 10 * mm
    image_max_w = 20 * mm
    #get the variant
    variant_obj = get_object_or_404(OcTsgProductVariants, pk=product_variant_id)
    #variant_obj = OcTsgProductVariantCore.objects.filter(prod_variant_core_id=product_variant_id).first()

    order_item_data = variant_obj
    if bl_options:
        order_item_tbl_data = [''] * 10
    else:
        order_item_tbl_data = [''] * 9
    order_item_tbl_data[0] = Paragraph(order_item_data.variant_code, styles['table_data'])

    image_src = order_item_data.site_variant_image_url
    image_url = _create_image_url(image_src)

    img = Image(image_url)
    img._restrictSize(image_max_w, image_max_h)

    order_item_tbl_data[1] = img
    core_variant = order_item_data.prod_var_core
    base_product = order_item_data.prod_var_core.product
    order_item_tbl_data[2] = Paragraph(base_product.productdescbase.title, styles['table_data'])
    order_item_tbl_data[3] = Paragraph(core_variant.size_material.product_size.size_name, styles['table_data'])
    order_item_tbl_data[4] = Paragraph(core_variant.size_material.product_material.material_name, styles['table_data'])

    option_col_adj = 0
    if bl_options:
        #option_text = get_order_product_line_options(order_item_data.order_product_id)
        order_item_tbl_data[5] = '' #Paragraph(option_text, styles['table_data_small'])
        option_col_adj = 1

    order_item_tbl_data[5 + option_col_adj] = qty
    order_item_tbl_data[6 + option_col_adj] = ""
    order_item_tbl_data[7 + option_col_adj] = ""
    order_item_tbl_data[8 + option_col_adj] = ""

    return order_item_tbl_data


def _create_image_url(image_src):
    if image_src.endswith('.svg'):
        if settings.CDN:
            svg_url = image_src
        else:
            svg_url = filename = settings.REPORT_URL + quote(image_src)
        image_file_name = os.path.basename(quote(image_src))
        image_file = os.path.splitext(image_file_name)

        # image_url = os.path.join(settings.MEDIA_ROOT, 'preview_cache', image_file[0]+'.png')
        image_url = os.path.join(settings.REPORT_PATH_CACHE, image_file[0] + '.png')
        if not os.path.isfile(image_url):
            svg2png(url=svg_url, write_to=image_url)
    else:
        if settings.CDN:
            image_url = image_src
        else:
            image_url = settings.REPORT_URL + quote(image_src)

    return image_url

def _create_bespoke_image_png(bespoke_print_obj):
    #create a tmp file
    bespoke_id = bespoke_print_obj.id
    png_filename = f'bespoke_image-{bespoke_id}.png'
    tmp_filename = os.path.join(settings.BESPOKE_TMP_PATH, png_filename)
    #svg_string = json.loads(bespoke_print_obj.svg_export)
    #svg_string = bespoke_print_obj.svg_export
    #svg2png(bytestring=svg_string, write_to=tmp_filename)

    svg_data = bespoke_print_obj.svg_export
    if isinstance(svg_data, bytes):
        # It's already ready to be used
        svg_string = svg_data
    else:
        # Assume it's JSON and parse
        try:
            svg_string = json.loads(svg_data)
            if isinstance(svg_string, str):
                svg_string = svg_string.encode('utf-8')  # convert to bytes for svg2png
        except json.JSONDecodeError:
            raise ValueError("Expected JSON, but got an invalid string")

    svg2png(bytestring=svg_string, write_to=tmp_filename)


    # tmp = json.dumps(svg_bytes)
    # now check the file exists



    if os.path.exists(tmp_filename):
        return tmp_filename
    else:
        return None