import http

import requests
from django.shortcuts import render, get_object_or_404
from apps.orders.models import OcOrder, OcOrderProduct, OcTsgOrderOption, OcTsgOrderProductOptions
from apps.orders.serializers import OrderProductListSerializer
from apps.quotes.models import OcTsgQuote, OcTsgQuoteProduct
from apps.quotes.serializers import QuoteProductListSerializer
from django.template.loader import get_template
from django.http import HttpResponse
import os
import json
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, inch
from reportlab.lib.enums import TA_JUSTIFY, TA_RIGHT, TA_LEFT, TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, Frame, PageTemplate, NextPageTemplate, FrameBreak
from reportlab_qrcode import QRCodeImage
from reportlab.graphics.barcode import code128
from reportlab.pdfgen import canvas
from reportlab.graphics import renderPDF, renderPM
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
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template.loader import get_template
from svglib.svglib import svg2rlg
from io import BytesIO
from xhtml2pdf import pisa


from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.pdfbase.ttfonts import TTFont
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
registerFont(TTFont('Arial','ARIAL.ttf'))


from wand.api import library
import wand.color
import wand.image

from cairosvg import svg2png


from django.template.loader import render_to_string
from django.contrib.staticfiles import finders


def fetch_resources(uri, rel):
    path = os.path.join(settings.STATIC_ROOT, uri.replace(settings.STATIC_URL, ""))
    return path

def link_callback(uri, rel):
    """
    Convert HTML URIs to absolute system paths so xhtml2pdf can access those
    resources
    """
    result = finders.find(uri)
    if result:
        if not isinstance(result, (list, tuple)):
            result = [result]
        result = list(os.path.realpath(path) for path in result)
        path = result[0]
    else:
        sUrl = settings.STATIC_URL  # Typically /static/
        sRoot = settings.STATIC_ROOT  # Typically /home/userX/project_static/
        mUrl = settings.MEDIA_URL  # Typically /media/
        mRoot = settings.MEDIA_ROOT  # Typically /home/userX/project_static/media/

        if uri.startswith(mUrl):
            path = os.path.join(mRoot, uri.replace(mUrl, ""))
        elif uri.startswith(sUrl):
            path = os.path.join(sRoot, uri.replace(sUrl, ""))
        else:
            return uri

    # make sure that file exists
    if not os.path.isfile(path):
        raise RuntimeError(
            'media URI must start with %s or %s' % (sUrl, mUrl)
        )


def render_to_pdf(template_path, context={}):
    # Create a Django response object, and specify content_type as pdf
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="report.pdf"'
    # find the template and render it.
    template = get_template(template_path)
    html = template.render(context)

    # create a pdf
    BytesIO(html.encode("ISO-8859-1"))

    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), dest=result, link_callback=link_callback)
    if pdf.err:
        return HttpResponse("Invalid PDF", status_code=400, content_type='text/plain')
    return HttpResponse(result.getvalue(), content_type='application/pdf')


    #pisa_status = pisa.CreatePDF(html, dest=response, link_callback=link_callback)
    # if error then show some funny view
    #if not pisa_status.err:
    #    return HttpResponse(result.getvalue(), content_type='application/pdf')
    #return None

def test_pdf(request):
    order_obj = OcOrder.objects.get(pk=28)
    css_name = 'paperwork/despatch_note.css'
    template_name = 'paperwork/despatch_note.html'
    context = {'order_obj': order_obj}
    template = get_template(template_name)
    html = template.render(context)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")),dest=result, link_callback=link_callback)
    if pdf.err:
        return HttpResponse("Invalid PDF", status_code=400, content_type='text/plain')
    return HttpResponse(result.getvalue(), content_type='application/pdf')



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
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=8, leading=12))
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
            image_url = utils._create_image_url(order_item_data.product_variant.site_variant_image_url)

            img = Image(image_url)
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


def gen_dispatch_note(order_id, bl_excl_shipped=False):
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
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data_small', alignment=TA_LEFT, fontSize=6, leading=10))
    styles.add(ParagraphStyle(name='footer', alignment=TA_CENTER, fontSize=8, leading=10))

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
    bl_options = utils.order_has_options(order_obj.order_id)
    #product_options_addons = get_order_line_options(order_obj.or)
    if bl_options:
        items_tbl_data = [['Code', 'Image', 'Product','Size', 'Material','Options', 'QTY', 'P', 'S', 'C']]
    else:
        items_tbl_data = [['Code', 'Image', 'Product','Size', 'Material', 'Qty', 'P', 'S', 'C']]

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
        if bl_options:
            order_item_tbl_data = [''] * 10
        else:
            order_item_tbl_data = [''] * 9

        order_item_tbl_data[0] = Paragraph(order_item_data.model, styles['table_data'])

        if order_item_data.product_variant:
            image_src = order_item_data.product_variant.site_variant_image_url
            image_url = utils._create_image_url(order_item_data.product_variant.site_variant_image_url)

            img = Image(image_url)
            img._restrictSize(image_max_w, image_max_h)


        else:
            img = ''

        order_item_tbl_data[1] = img

        order_item_tbl_data[2] = Paragraph(order_item_data.name, styles['table_data'])
        order_item_tbl_data[3] = Paragraph(order_item_data.size_name, styles['table_data'])
        order_item_tbl_data[4] = Paragraph(order_item_data.material_name, styles['table_data'])

        option_col_adj = 0
        if bl_options:
            option_text = utils.get_order_product_line_options(order_item_data.order_product_id)
            order_item_tbl_data[5] = Paragraph(option_text, styles['table_data_small'])
            option_col_adj = 1

        order_item_tbl_data[5+option_col_adj] = order_item_data.quantity
        order_item_tbl_data[6+option_col_adj] = ""
        order_item_tbl_data[7+option_col_adj] = ""
        order_item_tbl_data[8+option_col_adj] = ""
        items_tbl_data.append(order_item_tbl_data)

    if bl_options:
        items_tbl_cols = [20 * mm, (image_max_w ) + 5,50 * mm, 22.5 * mm, 22.5 * mm,  40 * mm, 10 * mm, 5 * mm, 5 * mm, 5 * mm]
    else:
        items_tbl_cols = [20 * mm, (image_max_w ) + 5, 60 * mm, 35 * mm, 35 * mm, 10 * mm, 5 * mm, 5 * mm, 5 * mm]
    row_height = image_max_h + 10
    rows = len(items_tbl_data)
    items_tbl_rowh = [row_height] * rows
    items_tbl_rowh[0] = 20
    items_table = Table(items_tbl_data, items_tbl_cols, repeatRows=1)
    items_table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('ALIGN', (5 + option_col_adj, 1), (5 + option_col_adj, -1), "CENTRE"),
                                     ('ALIGN', (5 + option_col_adj, 0), (-1, 0), "CENTRE"),
                                     ('ALIGN', (1, 1), (1, -1), "CENTRE"),
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

def gen_options_pick_list(order_id, bl_excl_shipped=False):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'{order_obj.store.prefix}-{order_obj.order_id}'
    qty_items = 0
    qty_lines = 0

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
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data_small', alignment=TA_LEFT, fontSize=6, leading=10))
    styles.add(ParagraphStyle(name='footer', alignment=TA_CENTER, fontSize=8, leading=10))

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
    elements.append(Paragraph("Pick Note", styles['title']))

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
    bl_options = utils.order_has_options(order_obj.order_id)
    #product_options_addons = get_order_line_options(order_obj.or)
    if bl_options:
        items_tbl_data = [['Code', 'Image', 'Product','Size', 'Material','Options', 'QTY', 'P', 'S', 'C']]
    else:
        items_tbl_data = [['Code', 'Image', 'Product','Size', 'Material', 'Qty', 'P', 'S', 'C']]

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
        if bl_options:
            order_item_tbl_data = [''] * 10
        else:
            order_item_tbl_data = [''] * 9

        order_item_tbl_data[0] = Paragraph(order_item_data.model, styles['table_data'])

        if order_item_data.product_variant:
            image_src = order_item_data.product_variant.site_variant_image_url
            image_url = utils._create_image_url(order_item_data.product_variant.site_variant_image_url)

            img = Image(image_url)
            img._restrictSize(image_max_w, image_max_h)


        else:
            img = ''

        order_item_tbl_data[1] = img

        order_item_tbl_data[2] = Paragraph(order_item_data.name, styles['table_data'])
        order_item_tbl_data[3] = Paragraph(order_item_data.size_name, styles['table_data'])
        order_item_tbl_data[4] = Paragraph(order_item_data.material_name, styles['table_data'])

        option_col_adj = 0
        if bl_options:
            option_text = utils.get_order_product_line_options(order_item_data.order_product_id)
            order_item_tbl_data[5] = Paragraph(option_text, styles['table_data_small'])
            option_col_adj = 1

        order_item_tbl_data[5+option_col_adj] = order_item_data.quantity
        order_item_tbl_data[6+option_col_adj] = ""
        order_item_tbl_data[7+option_col_adj] = ""
        order_item_tbl_data[8+option_col_adj] = ""
        items_tbl_data.append(order_item_tbl_data)

        addon_product = utils.get_order_product_line_add(order_item_data.order_product_id, bl_options, styles, order_obj.store_id, order_item_data.quantity)
        if addon_product:
            for addon in addon_product:
                qty_items += addon['qty_added']
                qty_lines += 1
                items_tbl_data.append(addon['table'])

        #this is where we need to see if this order line has additional products to add


    if bl_options:
        items_tbl_cols = [20 * mm, (image_max_w ) + 5,50 * mm, 22.5 * mm, 22.5 * mm,  40 * mm, 10 * mm, 5 * mm, 5 * mm, 5 * mm]
    else:
        items_tbl_cols = [20 * mm, (image_max_w ) + 5, 60 * mm, 35 * mm, 35 * mm, 10 * mm, 5 * mm, 5 * mm, 5 * mm]
    row_height = image_max_h + 10
    rows = len(items_tbl_data)
    items_tbl_rowh = [row_height] * rows
    items_tbl_rowh[0] = 20
    items_table = Table(items_tbl_data, items_tbl_cols, repeatRows=1)
    items_table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('ALIGN', (5 + option_col_adj, 1), (5 + option_col_adj, -1), "CENTRE"),
                                     ('ALIGN', (5 + option_col_adj, 0), (-1, 0), "CENTRE"),
                                     ('ALIGN', (1, 1), (1, -1), "CENTRE"),
                                     ('VALIGN', (0, 0), (-1, -1), "MIDDLE"),
                                     ('FONTSIZE', (0, 1), (-1, -1), 10),
                                     ('ROWBACKGROUNDS', (0, 1), (-1, -1), (colors.white, colors.whitesmoke)),
                                     ]))

    elements.append(items_table)
    elements.append(Spacer(doc.width, 5*mm))
    order_lines = order_items.count()
    product_count = order_items.aggregate(Sum('quantity'))['quantity__sum']
    product_count += qty_items
    order_lines += qty_lines

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
                            title=f'Collection-Note_'+order_ref_number,  # exchange with your title
                            author="Safety Signs and Notices LTD",  # exchange with your authors name
                            )

    # Our container for 'Flowable' objects
    elements = []

    # A large collection of style sheets pre-made for us
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='header_right', alignment=TA_RIGHT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='footer_right', alignment=TA_RIGHT, fontSize=14, leading=16))
    styles.add(ParagraphStyle(name='header_main', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data_small', alignment=TA_LEFT, fontSize=6, leading=10))
    styles.add(ParagraphStyle(name='table_data_qty', alignment=TA_CENTER, fontSize=10, leading=12))
    styles.add(ParagraphStyle(name='footer', alignment=TA_CENTER, fontSize=8, leading=10))

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

    bl_options = utils.order_has_options(order_obj.order_id)
    # product_options_addons = get_order_line_options(order_obj.or)
    if bl_options:
        items_tbl_data = [['Code', 'Image', 'Product', 'Size', 'Material', 'Options', 'QTY', '']]
    else:
        items_tbl_data = [['Code', 'Image', 'Product', 'Size', 'Material', 'QTY', '']]
#order items
# Code, Product, Options, image, Size, Material, QTY, P,S,C

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
        if bl_options:
            order_item_tbl_data = [''] * 8
        else:
            order_item_tbl_data = [''] * 7

        order_item_tbl_data[0] = Paragraph(order_item_data.model, styles['table_data'])

        if order_item_data.product_variant:
            image_src = order_item_data.product_variant.site_variant_image_url
            image_url = utils._create_image_url(order_item_data.product_variant.site_variant_image_url)
            img = Image(image_url)
            img._restrictSize(image_max_w, image_max_h)


        else:
            img = ''

        order_item_tbl_data[1] = img

        order_item_tbl_data[2] = Paragraph(order_item_data.name, styles['table_data'])
        order_item_tbl_data[3] = Paragraph(order_item_data.size_name, styles['table_data'])
        order_item_tbl_data[4] = Paragraph(order_item_data.material_name, styles['table_data'])

        option_col_adj = 0
        if bl_options:
            option_text = utils.get_order_product_line_options(order_item_data.order_product_id)
            order_item_tbl_data[5] = Paragraph(option_text, styles['table_data_small'])
            option_col_adj = 1

        order_item_tbl_data[5 + option_col_adj] = Paragraph(f'  / {order_item_data.quantity}', styles['table_data_qty'])
        order_item_tbl_data[6 + option_col_adj] = ""
        items_tbl_data.append(order_item_tbl_data)

    if bl_options:
        items_tbl_cols = [20 * mm, (image_max_w) + 5, 50 * mm, 22.5 * mm, 22.5 * mm, 40 * mm, 20 * mm, 5 * mm]
    else:
        items_tbl_cols = [20 * mm, (image_max_w) + 5, 60 * mm, 35 * mm, 35 * mm, 20 * mm, 5 * mm]
    row_height = image_max_h + 10
    rows = len(items_tbl_data)
    items_tbl_rowh = [row_height] * rows
    items_tbl_rowh[0] = 20
    items_table = Table(items_tbl_data, items_tbl_cols, repeatRows=1)
    items_table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
                                     ('ALIGN', (5 + option_col_adj, 1), (5 + option_col_adj, -1), "CENTRE"),
                                     ('ALIGN', (5 + option_col_adj, 0), (-1, 0), "CENTRE"),
                                     ('ALIGN', (1, 1), (1, -1), "CENTRE"),
                                     ('VALIGN', (0, 0), (-1, -1), "TOP"),
                                     ('VALIGN', (1, 1), (1, -1), "MIDDLE"),
                                     ('VALIGN', (6, 1), (6, -1), "MIDDLE"),
                                     ('FONTSIZE', (0, 1), (-1, -1), 10),
                                     ('ROWBACKGROUNDS', (0, 1), (-1, -1), (colors.white, colors.whitesmoke)),
                                     ]))

    elements.append(items_table)
    elements.append(Spacer(doc.width, 5 * mm))
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
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=9, leading=13))
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
        [Paragraph(billing_address, styles['header_main']),
         Paragraph(shipping_address, styles['header_main']),
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
    styles.add(ParagraphStyle(name='address_top', alignment=TA_LEFT, fontSize=20, leading=24))
    styles.add(ParagraphStyle(name='address_bottom', alignment=TA_LEFT, fontSize=14, leading=18))

    shipping_address = utils.get_shipping_address(order_obj)
    shipping_address_keep = utils.shipping_address_keep(order_obj)
    heading = Paragraph(shipping_address, styles['address_top'])
    heading2 = Paragraph(shipping_address_keep, styles['address_bottom'])

    elements.append(heading)
    elements.append(FrameBreak())  # move to next frame
    elements.append(heading2)

    qr = QRCodeImage(f'http://www.totalsafetygroup.co.uk/paperwork/shipping/{order_id}', size=30 * mm)
   # elements.append(Spacer(doc.width, 5*mm))
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
        #pdflist.append(gen_pick_list(order_id, bl_exclude_shipped))
        #we need to see if there are tsg varoant options. If so, we create a different picklist and dispatch note
        if utils.order_has_product_options(order_id):
            pdflist.append(gen_options_pick_list(order_id, bl_exclude_shipped))
            pdflist.append(gen_dispatch_note(order_id, bl_exclude_shipped))
        else:
            pdflist.append(gen_dispatch_note(order_id, bl_exclude_shipped))
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
   # response['Content-Disposition'] = f'attachment; filename="order_{order_id}.pdf"'
    response.write(pdf)
    merger.close()
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
        product_description = utils.create_product_desc(quote_item_data,False, True)
        quote_item_tbl_data[1] = Paragraph(product_description, styles['table_data'])

        if quote_item_data.product_variant:
            image_src = quote_item_data.product_variant.site_variant_image_url
            image_url = utils._create_image_url(quote_item_data.product_variant.site_variant_image_url)

            img = Image(image_url)
            img._restrictSize(image_max_w, image_max_h)

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
    return;
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    if not order_obj.xero_id:
        xero_url = reverse_lazy('order-add-xero', kwargs={'pk': order_obj.order_id})
        base_url = request.build_absolute_uri(xero_url)
        r = requests.get(base_url)


#this function is used by webstores to generate an invoice
#don't require a POST CSRF token
@csrf_exempt
def gen_invoice_for_webstore_download(request, order_id, order_hash):
    #return a pdf invoice for the order
    data = dict()
    response = HttpResponse(content_type='application/pdf')
    #catch any errors
    try:
        order_obj = get_object_or_404(OcOrder, pk=order_id)
        #check the hash
        if order_hash != order_obj.order_hash:
            raise Exception('Invalid order hash')
        #generate the invoice
        pdf = gen_invoice(order_id)
        #set the response headers
        response['Content-Disposition'] = f'attachment; filename="invoice_{order_id}.pdf"'
        response.write(pdf.getvalue())
        pdf.close()
    except Exception as e:
        data['error'] = str(e)
        response.write(json.dumps(data))
    return response

@csrf_exempt
def gen_invoice_for_webstore(request, order_id, order_hash):
        # return a pdf invoice for the order
        data = dict()
        response = HttpResponse(content_type='application/pdf')
        # catch any errors
        try:
            order_obj = get_object_or_404(OcOrder, pk=order_id)
            # check the hash
            if order_hash != order_obj.order_hash:
                raise Exception('Invalid order hash')
            # generate the invoice
            pdflist = []
            pdf = gen_invoice(order_id)
            pdflist.append(pdf)
            merger = PdfFileMerger()
            for pdf_buffer in pdflist:
                merger.append(PdfFileReader(stream=pdf_buffer))
                pdf_buffer.close()
            buffer = BytesIO()

            merger.write(buffer)
            pdf = buffer.getvalue()
            # response['Content-Disposition'] = f'attachment; filename="order_{order_id}.pdf"'
            response.write(pdf)
            merger.close()
        except Exception as e:
            data['error'] = str(e)
            response.write(json.dumps(data))
        return response

def test_barcode(request):
    code = 6240001
    pages = 1

    while pages < 9:
        draw_JCBbarcode(code)
        code += 125
        pages += 1

   # code += 301
   # draw_JCBbarcode(code)

def cam_barcode(request):
    code = 8240001
    jcbcode = "403/G0843"
    pages = 1

    while pages < 2:
        make_cambarcodepage(code, jcbcode)  #makes a page
        code += 125
        pages += 1


def cable_barcode(request):
    code = 8253001
    jcbcode= "721/H6791"
    pages = 1

    while pages < 2:
        make_cablebarcodepage(code, jcbcode)
        code += 125
        pages += 1

def box_barcode_old(request):
    code = 6240001
    pages = 1

    while pages < 9:
        draw_JCBbarcode(code)
        code += 125
        pages += 1

def boxsup_barcode(request):
    code = 8248001
    jcbcode = "403/H5316"
    pages = 1

    while pages < 5:
        make_box_sub_barcodepage(code, jcbcode)
        code += 250
        pages += 1


def box_barcode(request):
    jcbcode = "403/H5316"
    pages = 1

    while pages < 2:
        make_box_barcodepage(jcbcode)
        pages += 1


def make_cambarcodepage(code, jcbcode):

    c = canvas.Canvas(f"cam_{code}.pdf")
    #page_width = 1040*mm  # page width
    #page_height = 1000*mm  # page height

    page_width = 1000*mm  # page width
    page_height = 400*mm  # page height

    c.setPageSize((page_width, page_height))

    max_width = 40
    icount = 1000
    ix = 0
    iy = 0
    for i in range(icount):
        x_origin = (25 * mm) * ix
        y_origin = (15 * mm) * iy
        draw_cam_barcode(c, x_origin, y_origin, code+i, jcbcode)
        ix += 1
        if ix == max_width:
            ix = 0
            iy += 1

    c.save()  # save pdf
    return


def make_cablebarcodepage(code, jcbcode):

    c = canvas.Canvas(f"cable_{code}.pdf")
    #page_width = 1040*mm  # page width
    #page_height = 1000*mm  # page height

    page_width = 1000*mm  # page width
    page_height = 1100*mm  # page height

    c.setPageSize((page_width, page_height))

    max_width = 34
    icount = 1000
    ix = 0
    iy = 0
    for i in range(icount):
        x_origin = (30 * mm) * ix
        y_origin = (30 * mm) * iy
        draw_cable_barcode(c, x_origin, y_origin, code+i, jcbcode)
        ix += 1
        if ix == max_width:
            ix = 0
            iy += 1

    c.save()  # save pdf
    return

def make_box_sub_barcodepage(code, jcbcode):

    c = canvas.Canvas(f"box_sup_{code}.pdf")
    #page_width = 1040*mm  # page width
    #page_height = 1000*mm  # page height

    page_width = 1000*mm  # page width
    page_height = 630*mm  # page height

    c.setPageSize((page_width, page_height))

    max_width = 10
    icount = 250
    ix = 0
    iy = 0
    for i in range(icount):
        x_origin = (100 * mm) * ix
        y_origin = (25 * mm) * iy
        draw_box_sup_barcode(c, x_origin, y_origin, code+i, jcbcode)
        ix += 1
        if ix == max_width:
            ix = 0
            iy += 1

    c.save()  # save pdf
    return


def make_box_barcodepage(jcbcode):

    c = canvas.Canvas(f"box_black.pdf")
    #page_width = 1040*mm  # page width
    #page_height = 1000*mm  # page height

    page_width = 1000*mm  # page width
    page_height = 1000*mm  # page height

    c.setPageSize((page_width, page_height))

    max_width = 5
    icount = 100
    ix = 0
    iy = 0
    for i in range(icount):
        x_origin = (190 * mm) * ix
        y_origin = (35 * mm) * iy
        draw_box_barcode(c, x_origin, y_origin, jcbcode)
        ix += 1
        if ix == max_width:
            ix = 0
            iy += 1

    c.save()  # save pdf
    return





def draw_JCBbarcode(code):

    c = canvas.Canvas(f"{code}.pdf")
    page_width = 1040*mm  # page width
    page_height = 1000*mm  # page height
    c.setPageSize((page_width, page_height))

    max_width = 5
    icount = 125
    ix = 0
    iy = 0
    for i in range(icount):
        x_origin = (210 * mm) * ix
        y_origin = (40 * mm) * iy
        draw_barcode(c, x_origin, y_origin, code+i)
        ix += 1
        if ix == max_width:
            ix = 0
            iy += 1

    c.save()  # save pdf
    return



def draw_barcode(c, x_origin, y_origin, barcode_number):
    page_width = 200 * mm  # page width
    page_height = 30 * mm  # page height

    margin_y = 10  # top/bottom margin

    bar_height = 15 * mm  # barcode line height

    #bar_width = page_width / (11 * len(str(barcode_number)) + 55)  # barcode individual width has the formula
    bar_width = 2.75
    #bar_width = 2
    # page width / (11*string_length) + 55   ##(I also saw +35 but in my test it was not working)

    humanReadable = False  # with or without text
    barcode = code128.Code128(barcode_number,
                              barHeight=bar_height,
                              barWidth=bar_width,
                              humanReadable=humanReadable)

    drawon_x = x_origin + 95*mm  # x value for drawing already has a margin (not like Y) bar with formula account for that
    y_offset = 5 * mm
    if humanReadable:
        drawon_y = page_height - margin_y - bar_height - y_offset  # if text reduce bar height to hace the correct value
    else:
        drawon_y = page_height - bar_height - y_offset  # set draw point to the top of the page - the height of the drawn barcode

    drawon_y += y_origin

    barcode.drawOn(c, drawon_x, drawon_y)  # do the drawing

    c.rect(x_origin, y_origin, page_width, page_height, stroke=1, fill=0)

    #textobject = c.beginText()
    textline = f'{barcode_number}'
    #textobject.textLine(text=textline)
    #textobject.setTextOrigin(x_origin + (150*mm), y_origin + (200*mm))
    c.setFont("Helvetica", 53)
   # c.drawText(textobject)
    c.drawString(x_origin + (5*mm), y_origin + (9*mm), "403/H5316")
    c.setFont("Helvetica", 18)
    c.drawCentredString(x_origin + (151 * mm), y_origin + (3 * mm), textline)


    return http.HTTPStatus(200)


def draw_cam_barcode(c, x_origin, y_origin, barcode_number, jcbcode):
    page_width = 20 * mm  # page width
    page_height = 10 * mm  # page height

    margin_y = 1  # top/bottom margin

    bar_height = 4 * mm  # barcode line height

    #bar_width = page_width / (11 * len(str(barcode_number)) + 55)  # barcode individual width has the formula
    bar_width = 0.5

    humanReadable = False  # with or without text
    barcode = code128.Code128(barcode_number,
                              barHeight=bar_height,
                              barWidth=bar_width,
                              humanReadable=humanReadable)

    drawon_x = x_origin - 4.1*mm  # x value for drawing already has a margin (not like Y) bar with formula account for that
    y_offset = 3 * mm
    drawon_y = page_height - bar_height - y_offset  # set draw point to the top of the page - the height of the drawn barcode

    drawon_y += y_origin

    barcode.drawOn(c, drawon_x, drawon_y)  # do the drawing

    c.rect(x_origin, y_origin, page_width, page_height, stroke=1, fill=0)

    #textobject = c.beginText()

    c.setFont("Helvetica", 6)
    c.drawCentredString(x_origin + (10*mm), y_origin + (7.8*mm), jcbcode)

    textline = f'{barcode_number}'
    c.setFont("Helvetica", 6)
    c.drawCentredString(x_origin + (10 * mm), y_origin + (0.8 * mm), textline)


    return http.HTTPStatus(200)


def draw_cable_barcode(c, x_origin, y_origin, barcode_number, jcbcode):
    page_width = 25 * mm  # page width
    page_height = 25 * mm  # page height

    margin_y = 1  # top/bottom margin

    bar_height = 6 * mm  # barcode line height

    #bar_width = page_width / (11 * len(str(barcode_number)) + 55)  # barcode individual width has the formula
    bar_width = 0.6

    humanReadable = False  # with or without text
    barcode = code128.Code128(barcode_number,
                              barHeight=bar_height,
                              barWidth=bar_width,
                              humanReadable=humanReadable)

    drawon_x = x_origin - 3.5*mm  # x value for drawing already has a margin (not like Y) bar with formula account for that
    y_offset = 2.8 * mm
    drawon_y = page_height - bar_height - y_offset  # set draw point to the top of the page - the height of the drawn barcode

    drawon_y += y_origin

    barcode.drawOn(c, drawon_x, drawon_y)  # do the drawing

    c.rect(x_origin, y_origin, page_width, page_height, stroke=1, fill=0)

    #textobject = c.beginText()

    c.setFont("Helvetica", 6)
    c.drawCentredString(x_origin + (12.5*mm), y_origin + (22.8*mm), jcbcode)

    textline = f'{barcode_number}'
    c.setFont("Helvetica", 6)
    c.drawCentredString(x_origin + (12.5 * mm), y_origin + (14 * mm), textline)


    return http.HTTPStatus(200)


def draw_box_sup_barcode(c, x_origin, y_origin, barcode_number, jcbcode):
    draw_box_double_barcode(c, x_origin, y_origin, barcode_number, jcbcode)
    draw_box_double_barcode(c, x_origin + 45*mm, y_origin, barcode_number, jcbcode)

def draw_box_double_barcode(c, x_origin, y_origin, barcode_number, jcbcode):
    page_width = 40 * mm  # page width
    page_height = 20 * mm  # page height

    margin_y = 1  # top/bottom margin

    bar_height = 8 * mm  # barcode line height

    #bar_width = page_width / (11 * len(str(barcode_number)) + 55)  # barcode individual width has the formula
    bar_width = 1

    humanReadable = False  # with or without text
    barcode = code128.Code128(barcode_number,
                              barHeight=bar_height,
                              barWidth=bar_width,
                              humanReadable=humanReadable)



    drawon_x = x_origin - 2.3*mm  # x value for drawing already has a margin (not like Y) bar with formula account for that
    y_offset = 6 * mm
    drawon_y = page_height - bar_height - y_offset  # set draw point to the top of the page - the height of the drawn barcode

    drawon_y += y_origin

    barcode.drawOn(c, drawon_x, drawon_y)  # do the drawing

    c.rect(x_origin, y_origin, page_width, page_height, stroke=1, fill=0)

    #textobject = c.beginText()


    c.setFont("Helvetica", 12)
    c.drawCentredString(x_origin + (20*mm), y_origin + (15.3*mm), jcbcode)

    textline = f'{barcode_number}'
    c.setFont("Helvetica", 12)
    c.drawCentredString(x_origin + (20* mm), y_origin + (1.5 * mm), textline)


    return http.HTTPStatus(200)


def draw_box_barcode(c, x_origin, y_origin, barcode_number):
    page_width = 180 * mm  # page width
    page_height = 28 * mm  # page height

    c.setFillColorRGB(0, 0, 0)
    c.rect(x_origin, y_origin, page_width, page_height, stroke=1, fill=1)
    c.setFont("Helvetica", 57)
    c.setFillColorRGB(255, 255, 255)
    c.drawString(x_origin + (5*mm), y_origin + (7.5*mm), "403/H5316")
    c.rect(x_origin + page_width - ((5 + 38)*mm), y_origin + 5*mm, 38*mm, 18*mm, stroke=0, fill=1)


    return http.HTTPStatus(200)
