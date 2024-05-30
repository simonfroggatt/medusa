import requests
from django.shortcuts import render, get_object_or_404
from apps.orders.models import OcOrder, OcOrderProduct
from apps.orders.serializers import OrderProductListSerializer
from apps.quotes.models import OcTsgQuote, OcTsgQuoteProduct
from apps.quotes.serializers import QuoteProductListSerializer
from django.template.loader import get_template
from django.http import HttpResponse
import os
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, inch
from reportlab.lib.enums import TA_JUSTIFY, TA_RIGHT, TA_LEFT, TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, Frame, PageTemplate, NextPageTemplate, FrameBreak
from reportlab_qrcode import QRCodeImage
from reportlab.graphics import renderPDF
from reportlab.lib import colors
from apps.paperwork import utils
from svglib.svglib import svg2rlg
from django.db.models import Sum
from functools import partial
from decimal import Decimal, ROUND_HALF_UP
import pathlib
from PyPDF2 import PdfFileMerger, PdfFileWriter, PdfFileReader
from medusa.settings import TSG_PRODUCT_STATUS_SHIPPING
from django.conf import settings
from urllib.parse import quote
from django.urls import path, include, reverse_lazy
from django.http import HttpResponse, HttpResponseRedirect


def gen_pick_list(order_id, bl_excl_shipped=False):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'{order_obj.store.prefix}-{order_obj.order_id}'

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Despatch-Note_'+order_ref_number,  # exchange with your title
                            author="Total Safety Group Ltd",  # exchange with your authors name
                            )

    # Our container for 'Flowable' objects
    elements = []

    # A large collection of style sheets pre-made for us
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='header_right', alignment=TA_RIGHT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='footer_right', alignment=TA_RIGHT, fontSize=14, leading=16))
    styles.add(ParagraphStyle(name='header_main', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=10, leading=12))
    styles.add(ParagraphStyle(name='footer', alignment=TA_CENTER, fontSize=8, leading=12))

#company logo
    comp_logo = utils.create_company_logo(order_obj.store)

#company contact & order details
    header_address = utils.create_address(order_obj.store)

# create the table
    header_tbl_data = [
        [comp_logo, Paragraph(header_address, styles['header_right'])]
    ]
    header_tbl = Table(header_tbl_data)
    header_tbl.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1),'MIDDLE'),
                                    ('TOPPADDING', (0,0), (-1,-1), 0),
                                    ]))
    elements.append(header_tbl)


# Title
    elements.append(Paragraph("Despatch Note", styles['title']))

# order details
    contacts_str = utils.contact_details(order_obj)
    order_str = utils.order_details(order_obj)
    order_tbl_data = [
        [Paragraph(contacts_str, styles['header_main']), Paragraph(order_str, styles['header_main'])]
    ]
    order_col_width = 40 * mm
    order_tbl_data = Table(order_tbl_data, colWidths=[doc.width - order_col_width, order_col_width])
    order_tbl_data.setStyle(TableStyle([
                                        ('ALIGN', (1, 1), (1, 1), "RIGHT")]))
    elements.append(order_tbl_data)
    elements.append(Spacer(doc.width, 5*mm))
#order items
# Code, Product, Options, image, Size, Material, QTY, P,S,C
    items_tbl_data = [
        ['Code', 'Product', 'Options', 'Image', 'Size', 'Material', 'QTY', 'P', 'S', 'C']
    ]

# Now add in all the
    image_max_h = 10 * mm
    image_max_w = 20 * mm

    if bl_excl_shipped:
        order_items = order_obj.order_products.exclude(status__in=TSG_PRODUCT_STATUS_SHIPPING)
    else:
        order_items = order_obj.order_products.all()

    for order_item_data in order_items.iterator():
        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        order_item_tbl_data = [''] * 10
        order_item_tbl_data[0] = Paragraph(order_item_data.model, styles['table_data'])
        order_item_tbl_data[1] = Paragraph(order_item_data.name, styles['table_data'])
        order_item_tbl_data[2] = ""
        if order_item_data.product_variant:
            image_src = order_item_data.product_variant.site_variant_image_url
            #if order_item_data.product_variant.alt_image:

            #if order_item_data.product_variant.site_variant_image_url:
            #    image_src = order_item_data.product_variant.site_variant_image_url
            #else:
            ##    if order_item_data.product_variant.prod_var_core.variant_image:
            #        image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.prod_var_core.variant_image}'
            #    else:
            #        image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.prod_var_core.product.image}'

            root_url = path
           # img = Image('http://127.0.0.1:8000/'+ quote(image_src))
            img = Image(settings.REPORT_URL + quote(image_src))
            img._restrictSize(image_max_w, image_max_h)
        else:
            img = ''

        order_item_tbl_data[3] = img
        order_item_tbl_data[4] = Paragraph(order_item_data.size_name, styles['table_data'])
        order_item_tbl_data[5] = Paragraph(order_item_data.material_name, styles['table_data'])
        order_item_tbl_data[6] = order_item_data.quantity
        order_item_tbl_data[7] = ""
        order_item_tbl_data[8] = ""
        order_item_tbl_data[9] = ""
        items_tbl_data.append(order_item_tbl_data)

    items_tbl_cols = [20 * mm, 50 * mm, 20 * mm, (image_max_w ) + 5, 30 * mm, 30 * mm, 10 * mm, 5 * mm, 5 * mm, 5 * mm]
    row_height = image_max_h + 10
    rows = len(items_tbl_data)
    items_tbl_rowh = [row_height] * rows
    items_tbl_rowh[0] = 20
    items_table = Table(items_tbl_data, items_tbl_cols, repeatRows=1)
    items_table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('ALIGN', (6, 1), (6, -1), "CENTRE"),
                                     ('ALIGN', (6, 0), (-1, 0), "CENTRE"),
                                     ('ALIGN', (3, 1), (3, -1), "CENTRE"),
                                     ('VALIGN', (0, 0), (-1, -1), "MIDDLE"),
                                     ('FONTSIZE', (0, 1), (-1, -1), 10),
                                     ('ROWBACKGROUNDS', (0, 1), (-1, -1), (colors.white, colors.whitesmoke)),
                                     ]))

    elements.append(items_table)
    elements.append(Spacer(doc.width, 5*mm))
    order_lines = order_items.count()
    product_count = order_items.aggregate(Sum('quantity'))['quantity__sum']

#add in the totals
    total_text = Paragraph(f'Total: {order_lines} lines and {product_count} products', styles['footer_right'])
    elements.append(total_text)
    elements.append(Spacer(doc.width, 15*mm))
    signed_text = Paragraph('Signed:____________________', styles['footer_right'])
    elements.append(signed_text)

    doc.build(elements, canvasmaker=utils.NumberedCanvas, onFirstPage=partial(utils.draw_footer, order_obj=order_obj), onLaterPages=partial(utils.draw_footer, order_obj=order_obj))

    #pdf = buffer.getvalue()
    #uffer.close()
    #response.write(pdf)
    return buffer


def gen_collection_note(order_id, bl_excl_shipped=False):
    width = 210 * mm
    height = 297 * mm
    padding = 5 * mm
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'{order_obj.store.prefix}-{order_obj.order_id}'

   # response = HttpResponse(content_type='application/pdf')

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Despatch-Note_'+order_ref_number,  # exchange with your title
                            author="Safety Signs and Notices LTD",  # exchange with your authors name
                            )

    # Our container for 'Flowable' objects
    elements = []

    # A large collection of style sheets pre-made for us
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='header_right', alignment=TA_RIGHT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='footer_right', alignment=TA_RIGHT, fontSize=14, leading=16))
    styles.add(ParagraphStyle(name='header_main', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=10, leading=12))
    styles.add(ParagraphStyle(name='footer', alignment=TA_CENTER, fontSize=8, leading=12))

#company logo
    comp_logo = utils.create_company_logo(order_obj.store)

#company contact & order details
    header_address = utils.create_address(order_obj.store)

# create the table
    header_tbl_data = [
        [comp_logo, Paragraph(header_address, styles['header_right'])]
    ]
    header_tbl = Table(header_tbl_data)
    header_tbl.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1),'MIDDLE'),
                                    ('TOPPADDING', (0,0), (-1,-1), 0),
                                    ]))
    elements.append(header_tbl)


# Title
    elements.append(Paragraph("Collection Note", styles['title']))

# order details
    contacts_str = utils.contact_details(order_obj)
    order_str = utils.order_details(order_obj)
    order_tbl_data = [
        [Paragraph(contacts_str, styles['header_main']), Paragraph(order_str, styles['header_main'])]
    ]
    order_col_width = 40 * mm
    order_tbl_data = Table(order_tbl_data, colWidths=[doc.width - order_col_width, order_col_width])
    order_tbl_data.setStyle(TableStyle([
                                        ('ALIGN', (1, 1), (1, 1), "RIGHT")]))
    elements.append(order_tbl_data)
    elements.append(Spacer(doc.width, 5*mm))
#order items
# Code, Product, Options, image, Size, Material, QTY, P,S,C
    items_tbl_data = [
        ['Code', 'Product', 'Options', 'Image', 'Size', 'Material', 'QTY', 'P', 'S', 'C']
    ]

# Now add in all the
    image_max_h = 10 * mm
    image_max_w = 20 * mm

    if bl_excl_shipped:
        order_items = order_obj.order_products.exclude(status__in=TSG_PRODUCT_STATUS_SHIPPING)
    else:
        order_items = order_obj.order_products.all()

    for order_item_data in order_items.iterator():
        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        order_item_tbl_data = [''] * 10
        order_item_tbl_data[0] = Paragraph(order_item_data.model, styles['table_data'])
        order_item_tbl_data[1] = Paragraph(order_item_data.name, styles['table_data'])
        order_item_tbl_data[2] = ""
        if order_item_data.product_variant:
            image_src = order_item_data.product_variant.site_variant_image_url
            # if order_item_data.product_variant.alt_image:
            #     image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.alt_image}'
            # else:
            #     if order_item_data.product_variant.prod_var_core.variant_image:
            #         image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.prod_var_core.variant_image}'
            #     else:
            #         image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.prod_var_core.product.image}'

            img = Image(settings.REPORT_URL + quote(image_src))
            img._restrictSize(image_max_w, image_max_h)
        else:
            img = ''

        order_item_tbl_data[3] = img
        order_item_tbl_data[4] = Paragraph(order_item_data.size_name, styles['table_data'])
        order_item_tbl_data[5] = Paragraph(order_item_data.material_name, styles['table_data'])
        order_item_tbl_data[6] = order_item_data.quantity
        order_item_tbl_data[7] = ""
        order_item_tbl_data[8] = ""
        order_item_tbl_data[9] = ""
        items_tbl_data.append(order_item_tbl_data)

    items_tbl_cols = [20 * mm, 50 * mm, 20 * mm, (image_max_w ) + 5, 30 * mm, 30 * mm, 10 * mm, 5 * mm, 5 * mm, 5 * mm]
    row_height = image_max_h + 10
    rows = len(items_tbl_data)
    items_tbl_rowh = [row_height] * rows
    items_tbl_rowh[0] = 20
    items_table = Table(items_tbl_data, items_tbl_cols, repeatRows=1)
    items_table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('ALIGN', (6, 1), (6, -1), "CENTRE"),
                                     ('ALIGN', (6, 0), (-1, 0), "CENTRE"),
                                     ('ALIGN', (3, 1), (3, -1), "CENTRE"),
                                     ('VALIGN', (0, 0), (-1, -1), "MIDDLE"),
                                     ('FONTSIZE', (0, 1), (-1, -1), 10),
                                     ('ROWBACKGROUNDS', (0, 1), (-1, -1), (colors.white, colors.whitesmoke)),
                                     ]))

    elements.append(items_table)
    elements.append(Spacer(doc.width, 5*mm))
    order_lines = order_items.count()
    product_count = order_items.aggregate(Sum('quantity'))['quantity__sum']

#add in the totals
    total_text = Paragraph(f'Total: {order_lines} lines and {product_count} products', styles['footer_right'])
    elements.append(total_text)
    elements.append(Spacer(doc.width, 10*mm))
    signed_str = 'Staff Signed:__________________'
    customer_signed_str = 'Customer Name:__________________'
    customer_signed_str += 'Customer signed:__________________<BR/><BR/>'
    customer_signed_str += 'Date:___/___/_____'

    signed_text = Paragraph(signed_str, styles['footer_right'])
    customer_signed_text = Paragraph(customer_signed_str, styles['footer_right'])
    elements.append(signed_text)
    elements.append(Spacer(doc.width, 5 * mm))
    elements.append(customer_signed_text)


    doc.build(elements, canvasmaker=utils.NumberedCanvas, onFirstPage=partial(utils.draw_footer, order_obj=order_obj), onLaterPages=partial(utils.draw_footer, order_obj=order_obj))

    #pdf = buffer.getvalue()
    #uffer.close()
    #response.write(pdf)
    return buffer


def gen_invoice(order_id):
    width = 210 * mm
    height = 297 * mm
    padding = 5 * mm
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'{order_obj.store.prefix}-{order_obj.order_id}'

   # response = HttpResponse(content_type='application/pdf')

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Invoice_'+order_ref_number,  # exchange with your title
                            author="Safety Signs and Notices LTD",  # exchange with your authors name
                            )

    # Our container for 'Flowable' objects
    elements = []

    # A large collection of style sheets pre-made for us
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='header_right', alignment=TA_RIGHT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='footer_right', alignment=TA_RIGHT, fontSize=14, leading=16))
    styles.add(ParagraphStyle(name='header_main', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=9, leading=11))
    styles.add(ParagraphStyle(name='footer', alignment=TA_CENTER, fontSize=8, leading=12))

#company logo
    comp_logo = utils.create_company_logo(order_obj.store)

#company contact & order details
    header_address = utils.create_address(order_obj.store)

# create the table
    header_tbl_data = [
        [comp_logo, Paragraph(header_address, styles['header_right'])]
    ]
    header_tbl = Table(header_tbl_data)
    header_tbl.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1),'MIDDLE'),
                                    ('TOPPADDING', (0,0), (-1,-1), 0),
                                    ]))
    elements.append(header_tbl)
# Title
    elements.append(Paragraph("Invoice", styles['title']))

# order details
    shipping_address = utils.order_shipping(order_obj)
    billing_address = utils.order_billing(order_obj)
    order_details_dict = utils.order_invoice_details_tup(order_obj)
    order_list = list(order_details_dict.items())
    order_details_tbl_data = []
    for order_details_data in order_list:
        tmp_data = list(order_details_data)
        order_details_tbl_data.append(tmp_data)

    order_details_table = Table(order_details_tbl_data)
    order_details_table.setStyle(TableStyle([
                                ('ALIGN', (0, 0), (-1, -1), "RIGHT"),
                                ('ALIGN', (1, 0), (-1, -1), "LEFT"),
                                 ('VALIGN', (0, 0), (-1, -1), "TOP"),
                                ('FONTSIZE', (0, 0), (-1, -1), 8),
                                ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
                                 ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                                 ('TOPPADDING', (0, 0), (-1, -1), 0)]))

    order_tbl_info = [
        [Paragraph(shipping_address, styles['header_main']),
         Paragraph(billing_address, styles['header_main']),
         order_details_table]
    ]

    #rder_address_col_width = (doc.width - order_col_width_details) / 2
    order_tbl_data = Table(order_tbl_info)
    order_tbl_data.setStyle(TableStyle([
                                        ('ALIGN', (2, 0), (2, 0), "RIGHT"),
                                        ('VALIGN', (0, 0), (-1, -1), "TOP"),
                                       # ('BACKGROUND', (2, 0), (-1, 0), colors.green),
                                        ]))
    elements.append(order_tbl_data)
    elements.append(Spacer(doc.width, 5*mm))

#order items
# Code, Item, Quantity, Unit Price, Line Price,
    currency_symbol = order_obj.store.currency.symbol_left
    items_tbl_cols = [30 * mm, 100 * mm, 20 * mm, 25 * mm, 25 * mm]
    items_tbl_data = [
        ['Code', 'Item', 'Quantity', f'Unit Price ({currency_symbol})', f'Line Price ({currency_symbol})']
    ]

# Now add in all the
    image_max_h = 10 * mm
    image_max_w = 20 * mm

    order_items = order_obj.order_products.all()
    for order_item_data in order_items.iterator():
        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        order_item_tbl_data = [''] * 5
        order_item_tbl_data[0] = Paragraph(order_item_data.model, styles['table_data'])
        product_description = utils.create_product_desc(order_item_data)
        order_item_tbl_data[1] = Paragraph(product_description, styles['table_data'])
        if order_item_data.product_variant:
            image_src = order_item_data.product_variant.site_variant_image_url
            # if order_item_data.product_variant.alt_image:
            #     image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.alt_image}'
            # else:
            #     if order_item_data.product_variant.prod_var_core.variant_image:
            #         image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.prod_var_core.variant_image}'
            #     else:
            #         image_src = f'{settings.MEDIA_URL}/image/{order_item_data.product_variant.prod_var_core.product.image}'

            img = Image(settings.REPORT_URL + quote(image_src))
            img._restrictSize(image_max_w, image_max_h)
        else:
            img = ''

        order_item_tbl_data[2] = order_item_data.quantity
        order_item_tbl_data[3] = round(order_item_data.price,2)
        order_item_tbl_data[4] = round(order_item_data.total,2)
        items_tbl_data.append(order_item_tbl_data)


    items_table = Table(items_tbl_data, items_tbl_cols, repeatRows=1)
    items_table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('LINEABOVE', (0, 1), (-1, 1), 1, colors.black),
                                     ('ALIGN', (2, 0), (2, -1), "CENTRE"),
                                     ('ALIGN', (3, 1), (-1, -1), "RIGHT"),
                                     ('VALIGN', (0, 1), (-1, -1), "MIDDLE"),
                                     ('FONTSIZE', (0, 1), (-1, -1), 9),
                                     #('ROWBACKGROUNDS', (0, 0), (-1, -1), (colors.whitesmoke, colors.white)),
                                     ]))

    elements.append(items_table)
    elements.append(Spacer(doc.width, 5*mm))

#add in the totals
    order_total_obj = order_obj.order_totals.all()
    order_totals = utils.order_total_table(order_total_obj, order_obj.store.currency.symbol_left)
    order_total_table = Table(order_totals)
    order_total_table.setStyle(TableStyle([
                                    ('ALIGN', (0, 0), (-1, -1), "RIGHT"),
                                    ('ALIGN', (1, 0), (-1, -1), "RIGHT"),
                                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                                    ('FONTSIZE', (-2, -1), (-1, -1), 14),
                                    ('FONTNAME', (-1, -1), (-1, -1), 'Helvetica-Bold'),
                                    ('INNERGRID', (0, 0), (-1, -2), 0.25, colors.black),
                                    ('BOX', (0, 0), (-1, -2), 0.25, colors.black),

                                    ]))

    order_payment_str = utils.order_payment_details_simple(order_obj, order_obj.store.currency.symbol_left)
    order_obj.payment_status.name
    order_total_info = [
        [Paragraph(order_payment_str, styles['header_main']), order_total_table]
    ]
    order_total_footer = Table(order_total_info, colWidths=[100*mm, 100*mm])
    order_total_footer.setStyle(TableStyle([
        ('ALIGN', (1, 0), (-1, -1), "RIGHT"),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (1, 0), (-1, -1), "TOP")]))

    elements.append(order_total_footer)

    doc.build(elements, canvasmaker=utils.NumberedCanvas, onFirstPage=partial(utils.draw_footer, order_obj=order_obj), onLaterPages=partial(utils.draw_footer, order_obj=order_obj))

    #pdf = buffer.getvalue()
    #buffer.close()
    #response.write(pdf)
    return buffer


def gen_shipping_page(order_id):
    width = 210 * mm
    height = 297 * mm
    padding = 40 * mm
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'{order_obj.store.prefix}-{order_obj.order_id}'

    #response = HttpResponse(content_type='application/pdf')

    buffer = BytesIO()

    elements = []
    top_address_frame = Frame(padding, height/2 + 20*mm, width - 2*padding, 100*mm, showBoundary=0)
    bottom_address_frame = Frame(padding, 20*mm, width - 2*padding, 100 * mm, showBoundary=0)
    mainPage = PageTemplate(frames=[top_address_frame, bottom_address_frame])

    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Shipping_address_' + order_ref_number,  # exchange with your title
                            author="Safety Signs and Notices LTD",  # exchange with your authors name
                            )

    doc.addPageTemplates(mainPage)

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='address_top', alignment=TA_LEFT, fontSize=20, leading=22))
    styles.add(ParagraphStyle(name='address_bottom', alignment=TA_LEFT, fontSize=14))

    shipping_address = utils.get_shipping_address(order_obj)
    shipping_address_keep = utils.shipping_address_keep(order_obj)
    heading = Paragraph(shipping_address, styles['address_top'])
    heading2 = Paragraph(shipping_address_keep, styles['address_bottom'])

    elements.append(heading)
    elements.append(FrameBreak())  # move to next frame
    elements.append(heading2)

    qr = QRCodeImage(f'http://www.totalsafetygroup.co.uk/paperwork/shipping/{order_id}', size=30 * mm)
    elements.append(Spacer(doc.width, 5*mm))
    elements.append(qr)

    doc.build(elements)

    pdf = buffer.getvalue()
    #buffer.close()
   # response.write(pdf)
    return buffer


def gen_merged_paperwork(request, order_id):
    response = HttpResponse(content_type='application/pdf')
    pdflist=[]

    bl_exclude_shipped = False
    if 'print_shipped' in request.POST:
        bl_exclude_shipped = True

    if 'print_picklist' in request.POST:
        pdflist.append(gen_pick_list(order_id, bl_exclude_shipped))
        set_printed(request, order_id)
    if 'print_shipping' in request.POST:
        pdflist.append(gen_shipping_page(order_id))
    if 'print_invoice' in request.POST:
        pdflist.append(gen_invoice(order_id))
    if 'print_collection' in request.POST:
        pdflist.append(gen_collection_note(order_id, bl_exclude_shipped))
        set_printed(request, order_id)

    result_pdf = PdfFileWriter()

    merger = PdfFileMerger()
    for pdf_buffer in pdflist:
        merger.append(PdfFileReader(stream=pdf_buffer))
        pdf_buffer.close()
    buffer = BytesIO()

    merger.write(buffer)
    pdf = buffer.getvalue()
    response.write(pdf)
    return response


def gen_quote_pdf(quote_id, bl_total=True):
    width = 210 * mm
    height = 297 * mm
    padding = 5 * mm
    quote_obj = get_object_or_404(OcTsgQuote, pk=quote_id)
    quote_ref_number = f'Q-{quote_obj.store.prefix}-{quote_obj.quote_id}'

    # response = HttpResponse(content_type='application/pdf')

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Quote_' + quote_ref_number,  # exchange with your title
                            author="Safety Signs and Notices LTD",  # exchange with your authors name
                            )

    # Our container for 'Flowable' objects
    elements = []

    # A large collection of style sheets pre-made for us
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='header_right', alignment=TA_RIGHT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='footer_right', alignment=TA_RIGHT, fontSize=14, leading=16))
    styles.add(ParagraphStyle(name='header_main', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=9, leading=11))
    styles.add(ParagraphStyle(name='footer', alignment=TA_CENTER, fontSize=8, leading=12))

    # company logo
    comp_logo = utils.create_company_logo(quote_obj.store)

    # company contact & quote details
    header_address = utils.create_address(quote_obj.store)

    # create the table
    header_tbl_data = [
        [comp_logo, Paragraph(header_address, styles['header_right'])]
    ]
    header_tbl = Table(header_tbl_data)
    header_tbl.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                                    ]))
    elements.append(header_tbl)
    # Title
    elements.append(Paragraph("Quotation", styles['title']))

    # quote details
    shipping_address = utils.quote_shipping(quote_obj)
    quote_details_dict = utils.quote_details_tup(quote_obj)
    quote_list = list(quote_details_dict.items())
    quote_details_tbl_data = []
    for quote_details_data in quote_list:
        tmp_data = list(quote_details_data)
        quote_details_tbl_data.append(tmp_data)

    quote_details_table = Table(quote_details_tbl_data)
    quote_details_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), "RIGHT"),
        ('ALIGN', (1, 0), (-1, -1), "LEFT"),
        ('VALIGN', (0, 0), (-1, -1), "TOP"),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0)]))

    quote_tbl_info = [
        [Paragraph(shipping_address, styles['header_main']),
         quote_details_table]
    ]

    # rder_address_col_width = (doc.width - order_col_width_details) / 2
    quote_tbl_data = Table(quote_tbl_info)
    quote_tbl_data.setStyle(TableStyle([
        ('ALIGN', (2, 0), (2, 0), "RIGHT"),
        ('VALIGN', (0, 0), (-1, -1), "TOP"),
        # ('BACKGROUND', (2, 0), (-1, 0), colors.green),
    ]))
    elements.append(quote_tbl_data)
    elements.append(Spacer(doc.width, 5 * mm))

    # order items
    # Code, Item, Quantity, Unit Price, Line Price,
    currency_symbol = quote_obj.store.currency.symbol_left
    items_tbl_cols = [30 * mm, 100 * mm, 20 * mm, 25 * mm, 25 * mm]
    items_tbl_data = [
        ['Code', 'Item', 'Quantity', f'Unit Price ({currency_symbol})', f'Line Price ({currency_symbol})']
    ]

    # Now add in all the
    image_max_h = 10 * mm
    image_max_w = 20 * mm

    quote_items = quote_obj.product_quote.all()
    for quote_item_data in quote_items.iterator():
        if quote_item_data.product_variant:
            model = quote_item_data.product_variant.variant_code
        quote_item_tbl_data = [''] * 5
        quote_item_tbl_data[0] = Paragraph(quote_item_data.model, styles['table_data'])
        product_description = utils.create_product_desc(quote_item_data,False)
        quote_item_tbl_data[1] = Paragraph(product_description, styles['table_data'])
        if quote_item_data.product_variant:
            if quote_item_data.product_variant.alt_image:
                image_src = f'{settings.MEDIA_URL}/image/{quote_item_data.product_variant.alt_image}'
            else:
                if quote_item_data.product_variant.prod_var_core.variant_image:
                    image_src = f'{settings.MEDIA_URL}/image/{quote_item_data.product_variant.prod_var_core.variant_image}'
                else:
                    image_src = f'{settings.MEDIA_URL}/image/{quote_item_data.product_variant.prod_var_core.product.image}'

            img = Image(image_src)
            img._restrictSize(image_max_w, image_max_h)
        else:
            img = ''

        quote_item_tbl_data[2] = quote_item_data.quantity
        quote_item_tbl_data[3] = round(quote_item_data.price, 2)
        quote_item_tbl_data[4] = round(quote_item_data.total, 2)
        items_tbl_data.append(quote_item_tbl_data)

    items_table = Table(items_tbl_data, items_tbl_cols, repeatRows=1)
    items_table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('LINEABOVE', (0, 1), (-1, 1), 1, colors.black),
                                     ('ALIGN', (2, 0), (2, -1), "CENTRE"),
                                     ('ALIGN', (3, 1), (-1, -1), "RIGHT"),
                                     ('VALIGN', (0, 1), (-1, -1), "MIDDLE"),
                                     ('FONTSIZE', (0, 1), (-1, -1), 9),
                                     # ('ROWBACKGROUNDS', (0, 0), (-1, -1), (colors.whitesmoke, colors.white)),
                                     ]))

    elements.append(items_table)
    elements.append(Spacer(doc.width, 5 * mm))

    if bl_total:
        # add in the totals
        quote_totals = list(utils.quote_total_table(quote_obj, quote_items, quote_obj.store.currency.symbol_left).items())
        quote_total_table = Table(quote_totals)
        quote_total_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), "RIGHT"),
            ('ALIGN', (1, 0), (-1, -1), "RIGHT"),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('FONTSIZE', (-2, -1), (-1, -1), 14),
            ('FONTNAME', (-1, -1), (-1, -1), 'Helvetica-Bold'),
            ('INNERGRID', (0, 0), (-1, -2), 0.25, colors.black),
            ('BOX', (0, 0), (-1, -2), 0.25, colors.black),
        ]))


        quote_valid_str = utils.quote_valid_details(quote_obj, quote_obj.store.currency.symbol_left)
        order_total_info = [
            [Paragraph(quote_valid_str, styles['header_main']), quote_total_table]
        ]
        quote_total_footer = Table(order_total_info, colWidths=[100 * mm, 100 * mm])
        quote_total_footer.setStyle(TableStyle([
            ('ALIGN', (1, 0), (-1, -1), "RIGHT"),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('VALIGN', (1, 0), (-1, -1), "TOP")]))

        elements.append(quote_total_footer)
    else:
        quote_valid_str = utils.quote_valid_details(quote_obj, quote_obj.store.currency.symbol_left)
        elements.append(Paragraph(quote_valid_str, styles['header_main']))

    doc.build(elements, canvasmaker=utils.NumberedCanvas, onFirstPage=partial(utils.draw_footer, order_obj=quote_obj),
              onLaterPages=partial(utils.draw_footer, order_obj=quote_obj))

    # pdf = buffer.getvalue()
    # buffer.close()
    # response.write(pdf)
    return buffer


def gen_quote(quote_id):
    buffer = BytesIO()
    return buffer


def gen_quote_paperwork(request, quote_id):
    response = HttpResponse(content_type='application/pdf')
    pdflist = []
    if 'with_total_print' in request.POST:
        pdflist.append(gen_quote_pdf(quote_id, True))
    else:
        pdflist.append(gen_quote_pdf(quote_id, False))

    #result_pdf = PdfFileWriter()

    merger = PdfFileMerger()
    for pdf_buffer in pdflist:
        merger.append(PdfFileReader(stream=pdf_buffer))
        pdf_buffer.close()
    buffer = BytesIO()

    merger.write(buffer)
    pdf = buffer.getvalue()
    response.write(pdf)
    return response


def set_printed(request, order_id):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_obj.printed = 1
    order_obj.order_status_id = settings.TSG_ORDER_STATUS_PROCESSED
    order_obj.save()
    _push_to_xero(request, order_id)


def _push_to_xero(request, order_id):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    if order_obj.xero_id:
        xero_url = reverse_lazy('order-update-xero', kwargs={'pk': order_obj.order_id})
    else:
        xero_url = reverse_lazy('order-add-xero', kwargs={'pk': order_obj.order_id})
    base_url = request.build_absolute_uri(xero_url)
    r = requests.get(base_url)

