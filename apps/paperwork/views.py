import requests
from django.shortcuts import  get_object_or_404
from apps.orders.models import OcOrder
from apps.quotes.models import OcTsgQuote
import os
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, Frame, PageTemplate, FrameBreak
from reportlab_qrcode import QRCodeImage
from reportlab.lib import colors
from apps.paperwork import utils
from django.db.models import Sum
from functools import partial
from PyPDF2 import PdfFileMerger, PdfFileWriter, PdfFileReader
from medusa import settings
from django.conf import settings
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.template.loader import get_template
from io import BytesIO
from xhtml2pdf import pisa

from reportlab.pdfbase.pdfmetrics import registerFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from django.views.decorators.csrf import csrf_exempt
from apps.orders.models import OcTsgOrderShipment

registerFont(TTFont('Arial','ARIAL.ttf'))

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
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
    styles.add(ParagraphStyle(name='header_main', alignment=TA_LEFT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='table_data', alignment=TA_LEFT, fontSize=8, leading=12))
    styles.add(ParagraphStyle(name='table_data_small', alignment=TA_LEFT, fontSize=6, leading=10))
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
        order_items = order_obj.order_products.exclude(status__in=settings.TSG_PRODUCT_STATUS_SHIPPING).exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)
    else:
        order_items = order_obj.order_products.all().exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)

    for order_item_data in order_items.iterator():

        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        order_item_tbl_data = [''] * 10
        if order_item_data.model != order_item_data.supplier_code:
            product_order_code = f"{order_item_data.model}<BR/>( {order_item_data.supplier_code} )"
        else:
            product_order_code = order_item_data.model

        order_item_tbl_data[0] = Paragraph(product_order_code, styles['table_data'])
        order_item_tbl_data[1] = Paragraph(order_item_data.name, styles['table_data'])

        #get any options in here
        option_text = utils.get_order_product_line_options(order_item_data.order_product_id)
        order_item_tbl_data[2] = Paragraph(option_text, styles['table_data_small'])
        if order_item_data.product_variant:
            if order_item_data.order_product_bespoke_image.all().exists():
                tmp_png_filename = utils._create_bespoke_image_png(
                    order_item_data.order_product_bespoke_image.all().first())
                if tmp_png_filename:
                    image_url = tmp_png_filename
                else:
                    image_url = settings.TSG_NO_IMAGE
            else:
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

    #see if there are comments
    if order_obj.comment:
        comment_clean = (order_obj.comment or "").replace('\n', '<br/>')
        comment_paragraph = Paragraph(f'<b>Comment:</b><br/>{comment_clean or ""}', styles['footer_left'])
    else:
        comment_paragraph = Paragraph('', styles['footer_left'])
    signed_paragraph = Paragraph('Signed:____________________', styles['footer_right'])

    footer_table = Table([[comment_paragraph, signed_paragraph]], colWidths=[doc.width / 2.0] * 2)
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        # Optional border styling for debug
         #('BOX', (0, 0), (-1, -1), 0.25, colors.grey),
    ]))

    # Add to document
    elements.append(footer_table)


    #doc.build(elements, canvasmaker=partial(CommentLastPageCanvas, draw_footer_fn=draw_footer, order_obj=order_obj))
    doc.build(elements, canvasmaker=utils.NumberedCanvas, onFirstPage=partial(utils.draw_footer, order_obj=order_obj), onLaterPages=partial(utils.draw_footer, order_obj=order_obj))


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
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
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
        order_items = order_obj.order_products.exclude(status__in=settings.TSG_PRODUCT_STATUS_SHIPPING).exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)
    else:
        order_items = order_obj.order_products.all().exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)

    for order_item_data in order_items.iterator():
        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        if bl_options:
            order_item_tbl_data = [''] * 10
        else:
            order_item_tbl_data = [''] * 9

        if order_item_data.model != order_item_data.supplier_code:
            product_order_code = f"{order_item_data.model}<BR/>( {order_item_data.supplier_code} )"
        else:
            product_order_code = order_item_data.model

        order_item_tbl_data[0] = Paragraph(product_order_code, styles['table_data'])

        if order_item_data.product_variant:
            #see if it's a bespoke image
            if order_item_data.order_product_bespoke_image.all().exists():
                tmp_png_filename = utils._create_bespoke_image_png(order_item_data.order_product_bespoke_image.all().first())
                if tmp_png_filename:
                    image_url = tmp_png_filename
                else:
                    image_url = settings.TSG_NO_IMAGE
            else:
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

    # see if there are comments
    if order_obj.comment:
        comment_clean = (order_obj.comment or "").replace('\n', '<br/>')
        comment_paragraph = Paragraph(f'<b>Comment:</b><br/>{comment_clean or ""}', styles['footer_left'])
    else:
        comment_paragraph = Paragraph('', styles['footer_left'])
    signed_paragraph = Paragraph('Signed:____________________', styles['footer_right'])

    footer_table = Table([[comment_paragraph, signed_paragraph]], colWidths=[doc.width / 2.0] * 2)
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        # Optional border styling for debug
        # ('BOX', (0, 0), (-1, -1), 0.25, colors.grey),
    ]))

    # Add to document
    elements.append(footer_table)

    doc.build(elements, canvasmaker=utils.NumberedCanvas, onFirstPage=partial(utils.draw_footer, order_obj=order_obj), onLaterPages=partial(utils.draw_footer, order_obj=order_obj))

    #pdf = buffer.getvalue()
    #uffer.close()
    #response.write(pdf)
    return buffer

def gen_backorder_note(order_id, bl_excl_shipped=False):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'{order_obj.store.prefix}-{order_obj.order_id}'

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Backorder_'+order_ref_number,
                            author="Total Safety Group Ltd",
                            )

    # Our container for 'Flowable' objects
    elements = []

    # A large collection of style sheets pre-made for us
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='header_right', alignment=TA_RIGHT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='footer_right', alignment=TA_RIGHT, fontSize=14, leading=16))
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
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
    elements.append(Paragraph("Items on Backorder", styles['title']))

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
        items_tbl_data = [['Code', 'Image', 'Product','Size', 'Material','Options', 'QTY']]
    else:
        items_tbl_data = [['Code', 'Image', 'Product','Size', 'Material', 'Qty']]

# Now add in all the
    image_max_h = 10 * mm
    image_max_w = 20 * mm


    if bl_excl_shipped:
        order_items = order_obj.order_products.exclude(status__in=settings.TSG_PRODUCT_STATUS_SHIPPING).filter(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)
    else:
        order_items = order_obj.order_products.all().filter(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)

    for order_item_data in order_items.iterator():
        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        if bl_options:
            order_item_tbl_data = [''] * 7
        else:
            order_item_tbl_data = [''] * 6

        if order_item_data.model != order_item_data.supplier_code:
            product_order_code = f"{order_item_data.model}<BR/>( {order_item_data.supplier_code} )"
        else:
            product_order_code = order_item_data.model

        order_item_tbl_data[0] = Paragraph(product_order_code, styles['table_data'])

        if order_item_data.product_variant:
            #see if it's a bespoke image
            if order_item_data.order_product_bespoke_image.all().exists():
                tmp_png_filename = utils._create_bespoke_image_png(order_item_data.order_product_bespoke_image.all().first())
                if tmp_png_filename:
                    image_url = tmp_png_filename
                else:
                    image_url = settings.TSG_NO_IMAGE
            else:
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
        items_tbl_data.append(order_item_tbl_data)

    if bl_options:
        items_tbl_cols = [20 * mm, (image_max_w ) + 5,55 * mm, 27.5 * mm, 27.5 * mm,  40 * mm, 10 * mm]
    else:
        items_tbl_cols = [20 * mm, (image_max_w ) + 5, 65 * mm, 40 * mm, 40 * mm, 10 * mm]
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

    # see if there are comments
    if order_obj.comment:
        comment_clean = (order_obj.comment or "").replace('\n', '<br/>')
        comment_paragraph = Paragraph(f'<b>Comment:</b><br/>{comment_clean or ""}', styles['footer_left'])
    else:
        comment_paragraph = Paragraph('', styles['footer_left'])
    signed_paragraph = Paragraph('Signed:____________________', styles['footer_right'])

    footer_table = Table([[comment_paragraph, signed_paragraph]], colWidths=[doc.width / 2.0] * 2)
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        # Optional border styling for debug
        # ('BOX', (0, 0), (-1, -1), 0.25, colors.grey),
    ]))

    # Add to document
    elements.append(footer_table)

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
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
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
        order_items = order_obj.order_products.exclude(status__in=settings.TSG_PRODUCT_STATUS_SHIPPING).exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)
    else:
        order_items = order_obj.order_products.all().exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)

    for order_item_data in order_items.iterator():
        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        if bl_options:
            order_item_tbl_data = [''] * 10
        else:
            order_item_tbl_data = [''] * 9

        if order_item_data.model != order_item_data.supplier_code:
            product_order_code = f"{order_item_data.model}<BR/>( {order_item_data.supplier_code} )"
        else:
            product_order_code = order_item_data.model

        order_item_tbl_data[0] = Paragraph(product_order_code, styles['table_data'])

        if order_item_data.product_variant:
            if order_item_data.order_product_bespoke_image.all().exists():
                tmp_png_filename = utils._create_bespoke_image_png(order_item_data.order_product_bespoke_image.all().first())
                if tmp_png_filename:
                    image_url = tmp_png_filename
                else:
                    image_url = settings.TSG_NO_IMAGE
            else:
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

    # see if there are comments
    if order_obj.comment:
        comment_clean = (order_obj.comment or "").replace('\n', '<br/>')
        comment_paragraph = Paragraph(f'<b>Comment:</b><br/>{comment_clean or ""}', styles['footer_left'])
    else:
        comment_paragraph = Paragraph('', styles['footer_left'])
    signed_paragraph = Paragraph('Signed:____________________', styles['footer_right'])

    footer_table = Table([[comment_paragraph, signed_paragraph]], colWidths=[doc.width / 2.0] * 2)
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        # Optional border styling for debug
        # ('BOX', (0, 0), (-1, -1), 0.25, colors.grey),
    ]))

    # Add to document
    elements.append(footer_table)

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
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
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
        order_items = order_obj.order_products.exclude(status__in=settings.TSG_PRODUCT_STATUS_SHIPPING).exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)
    else:
        order_items = order_obj.order_products.all().exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)

    for order_item_data in order_items.iterator():
        if order_item_data.product_variant:
            model = order_item_data.product_variant.variant_code
        if bl_options:
            order_item_tbl_data = [''] * 8
        else:
            order_item_tbl_data = [''] * 7

        order_item_tbl_data[0] = Paragraph(order_item_data.model, styles['table_data'])

        if order_item_data.product_variant:
            if order_item_data.order_product_bespoke_image.all().exists():
                tmp_png_filename = utils._create_bespoke_image_png(order_item_data.order_product_bespoke_image.all().first())
                if tmp_png_filename:
                    image_url = tmp_png_filename
                else:
                    image_url = settings.TSG_NO_IMAGE
            else:
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

    # see if there are comments
    if order_obj.comment:
        comment_clean = (order_obj.comment or "").replace('\n', '<br/>')
        comment_paragraph = Paragraph(f'<b>Comment:</b><br/>{comment_clean or ""}', styles['footer_left'])
    else:
        comment_paragraph = Paragraph('', styles['footer_left'])

    signed_str = 'Staff Signed:__________________'
    customer_signed_str = 'Customer Name:__________________'
    customer_signed_str += 'Customer signed:__________________<BR/><BR/>'
    customer_signed_str += 'Date:___/___/_____'

    signed_paragraph = Paragraph(customer_signed_str, styles['footer_right'])

    footer_table = Table([[comment_paragraph, signed_paragraph]], colWidths=[doc.width / 2.0] * 2)
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        # Optional border styling for debug
        # ('BOX', (0, 0), (-1, -1), 0.25, colors.grey),
    ]))

    # Add to document
    elements.append(footer_table)


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
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
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

    doc.build(
        elements,
        canvasmaker=utils.NumberedCanvas,
        onFirstPage=lambda canvas, doc: utils.draw_footer(canvas, doc, order_obj=order_obj, add_account=True),
        onLaterPages=lambda canvas, doc: utils.draw_footer(canvas, doc, order_obj=order_obj, add_account=True)
    )

    #pdf = buffer.getvalue()
    #buffer.close()
    #response.write(pdf)
    return buffer

def gen_proforma(order_id):
    width = 210 * mm
    height = 297 * mm
    padding = 5 * mm
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'PF-{order_obj.store.prefix}-{order_obj.order_id}'

   # response = HttpResponse(content_type='application/pdf')

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Proforma_'+order_ref_number,  # exchange with your title
                            author="Safety Signs and Notices LTD",  # exchange with your authors name
                            )

    # Our container for 'Flowable' objects
    elements = []

    # A large collection of style sheets pre-made for us
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='header_right', alignment=TA_RIGHT, fontSize=8, leading=10))
    styles.add(ParagraphStyle(name='footer_right', alignment=TA_RIGHT, fontSize=14, leading=16))
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
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
    elements.append(Paragraph("Proforma Invoice", styles['title']))

# order details
    shipping_address = utils.order_shipping(order_obj)
    billing_address = utils.order_billing(order_obj)
    order_details_dict = utils.order_proforma_details_tup(order_obj)
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

    elements.extend(generate_order_footer(order_obj, order_total_table, styles))

    #order_payment_str = utils.proforma_details_legal(order_obj)

    #payment_paragraph = Paragraph(order_payment_str, styles['header_main'])




    #order_total_info = [
    #    [Paragraph(order_payment_str, styles['header_main']), order_total_table]
    #]
    #order_total_footer = Table(order_total_info, colWidths=[100*mm, 100*mm])
    #order_total_footer.setStyle(TableStyle([
    #    ('ALIGN', (1, 0), (-1, -1), "RIGHT"),
    #    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    #    ('VALIGN', (1, 0), (-1, -1), "TOP")]))

    #elements.append(order_total_footer)

    doc.build(
        elements,
        canvasmaker=utils.NumberedCanvas,
        onFirstPage=lambda canvas, doc: utils.draw_footer(canvas, doc, order_obj=order_obj, add_account=True),
        onLaterPages=lambda canvas, doc: utils.draw_footer(canvas, doc, order_obj=order_obj, add_account=True)
    )

    #doc.build(elements, canvasmaker=utils.NumberedCanvas, onFirstPage=partial(utils.draw_footer, order_obj=order_obj, add_account=True), onLaterPages=partial(utils.draw_footer, order_obj=order_obj, add_account=True))
    return buffer

def gen_shipping_page(order_id):
    width, height = A4
    styles = getSampleStyleSheet()

    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_ref_number = f'{order_obj.store.prefix}-{order_obj.order_id}'

    buffer = BytesIO()

    gap = 10 * mm
    margin = 10 * mm
    usable_width = width - 2 * margin
    usable_height = height - 2 * margin - 1 * gap  # subtract 2 gaps

    # Heights (adjusted to account for gaps)
    top_h = usable_height * 0.5 - 10 * mm
    middle_h = usable_height * 0.3
    bottom_h = usable_height * 0.2

    # Y positions
    bottom_y = margin
    middle_y = bottom_y + bottom_h
    top_y = middle_y + middle_h + gap

    top_frame = Frame(
        x1=margin,
        y1=top_y,
        width=usable_width,
        height=top_h,
        showBoundary=0
    )

    middle_frame = Frame(
        x1=margin,
        y1=middle_y,
        width=usable_width,
        height=middle_h,
        showBoundary=0
    )

    bottom_left_frame = Frame(
        x1=margin,
        y1=bottom_y,
        width=usable_width * 0.75,
        height=bottom_h,
        showBoundary=0
    )

    bottom_right_frame = Frame(
        x1=margin + usable_width * 0.75,
        y1=bottom_y,
        width=usable_width * 0.25,
        height=bottom_h,
        showBoundary=0
    )

    template = PageTemplate(frames=[
        top_frame,
        middle_frame,
        bottom_left_frame,
        bottom_right_frame
    ])


    # Create document and add template
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=3 * mm, leftMargin=3 * mm,
                            topMargin=8 * mm, bottomMargin=3 * mm,
                            title=f'Shipping_address_' + order_ref_number,  # exchange with your title
                            author="Safety Signs and Notices LTD",  # exchange with your authors name
                            )

    doc.addPageTemplates([template])

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='address_top', alignment=TA_LEFT, fontSize=20, leading=24))
    styles.add(ParagraphStyle(name='address_bottom', alignment=TA_LEFT, fontSize=16, leading=18))
    styles.add(ParagraphStyle(name='details_bottom', alignment=TA_LEFT, fontSize=14, leading=18))

    shipping_address = utils.get_shipping_address(order_obj)
    address_para = Paragraph(shipping_address, styles["address_top"])

    # Wrap the address in a table to center it in the top frame
    centered_address = Table(
        [[address_para]],
        colWidths=usable_width * 0.7,  # you can tweak width here
        hAlign='CENTER'  # horizontally center the content
    )
    centered_address.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))



    shipping_address_keep = utils.get_shipping_address(order_obj)
    shipping_order_details = utils.shipping_order_details(order_obj)

    qr = QRCodeImage(f'http://medusa.totalsafetygroup.com/orders/{order_id}', size=40 * mm)

    # Add content to each frame
    elements = [
        centered_address,
        #Paragraph(shipping_address, styles["address_top"]),
        FrameBreak(),
        Paragraph(shipping_address_keep, styles["address_bottom"]),
        FrameBreak(),
        Paragraph(shipping_order_details, styles["details_bottom"]),
        FrameBreak(),
        qr
    ]

    # Build the document
    doc.build(elements)

    pdf = buffer.getvalue()
    return buffer


def gen_merged_paperwork(request, order_id):
    response = HttpResponse(content_type='application/pdf')
    pdflist=[]

    bl_exclude_shipped = False
    bl_exclude_backorder = False
    if 'print_shipped' in request.POST:
        bl_exclude_shipped = True

    if 'print_backorder' in request.POST:
        bl_exclude_backorder = True

    if 'print_picklist' in request.POST:
        #pdflist.append(gen_pick_list(order_id, bl_exclude_shipped))
        #we need to see if there are tsg varoant options. If so, we create a different picklist and dispatch note
        if utils.order_has_product_options(order_id):
            if _test_has_unshipped_items(order_id):
                pdflist.append(gen_options_pick_list(order_id, bl_exclude_shipped))
                pdflist.append(gen_dispatch_note(order_id, bl_exclude_shipped))
        else:
            if _test_has_unshipped_items(order_id):
                pdflist.append(gen_pick_list(order_id, bl_exclude_shipped))
            if _test_has_backorder_items(order_id) and not bl_exclude_backorder:
                pdflist.append(gen_backorder_note(order_id, bl_exclude_shipped))

        set_printed(request, order_id)
    if 'print_shipping' in request.POST:
        pdflist.append(gen_shipping_page(order_id))
    if 'print_invoice' in request.POST:
        pdflist.append(gen_invoice(order_id))
    if 'print_collection' in request.POST:
        if _test_has_unshipped_items(order_id):
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

def gen_proforma_paperwork(request, order_id):
    response = HttpResponse(content_type='application/pdf')
    # Here is the magic:
    filename = f"proforma-{order_id}.pdf"  # or whatever you want

    response['Content-Disposition'] = f'inline; filename="{filename}"'

    pdflist = []
    pdflist.append(gen_proforma(order_id))
    merger = PdfFileMerger()
    for pdf_buffer in pdflist:
        merger.append(PdfFileReader(stream=pdf_buffer))
        pdf_buffer.close()
    buffer = BytesIO()

    merger.write(buffer)
    pdf = buffer.getvalue()
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
    styles.add(ParagraphStyle(name='footer_left', alignment=TA_LEFT, fontSize=8, leading=16))
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
    billing_address = utils.quote_billing(quote_obj)
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
        [Paragraph(billing_address, styles['header_main']),
         Paragraph(shipping_address, styles['header_main']),
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
    response['Content-Disposition'] = f'inline; filename="quote_{quote_id}.pdf"'
    response.write(pdf)
    merger.close()

    return response

def gen_invoice_for_emails(order_id):
    pdflist = []
    pdflist.append(gen_invoice(order_id))

    merger = PdfFileMerger()
    for pdf_buffer in pdflist:
        merger.append(PdfFileReader(stream=pdf_buffer))
        pdf_buffer.close()
    buffer = BytesIO()
    merger.write(buffer)
    pdf = buffer.getvalue()

    return pdf

def gen_proforma_for_emails(order_id):
    pdflist = []
    pdflist.append(gen_proforma(order_id))

    merger = PdfFileMerger()
    for pdf_buffer in pdflist:
        merger.append(PdfFileReader(stream=pdf_buffer))
        pdf_buffer.close()
    buffer = BytesIO()
    merger.write(buffer)
    pdf = buffer.getvalue()
    return pdf


def gen_quote_for_emails(quote_id, bl_total=True):
    pdflist = []
    pdflist.append(gen_quote_pdf(quote_id, bl_total))

    merger = PdfFileMerger()
    for pdf_buffer in pdflist:
        merger.append(PdfFileReader(stream=pdf_buffer))
        pdf_buffer.close()
    buffer = BytesIO()
    merger.write(buffer)
    pdf = buffer.getvalue()

    return pdf

def set_printed(request, order_id):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_obj.printed = 1
    order_obj.order_status_id = settings.TSG_ORDER_STATUS_PROCESSED
    order_obj.save()
    _push_to_xero(request, order_id)


def _push_to_xero(request, order_id):
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

def _test_has_unshipped_items(order_id):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_items = order_obj.order_products.all().exclude(status__in=settings.TSG_PRODUCT_STATUS_SHIPPING).exclude(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)
    if order_items.exists():
        return True
    return False

def _test_has_backorder_items(order_id):
    order_obj = get_object_or_404(OcOrder, pk=order_id)
    order_items = order_obj.order_products.all().filter(status__in=settings.TSG_PRODUCT_STATUS_BACKORDER)
    if order_items.exists():
        return True
    return False


class CommentLastPageCanvas(utils.NumberedCanvas):
    def __init__(self, *args, draw_footer_fn=None, order_obj=None, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []
        self.draw_footer_fn = draw_footer_fn
        self.order_obj = order_obj

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        super().showPage()

    def save(self):
        page_count = len(self._saved_page_states)
        for page_num, state in enumerate(self._saved_page_states):
            self.__dict__.update(state)
            self._startPage()

            # Custom footer on each page
            is_last = (page_num == page_count - 1)
            if self.draw_footer_fn:
                self.draw_footer_fn(self, self._doc, self.order_obj, is_last)

            super().showPage()
        super().save()

def draw_footer(canvas, doc, order_obj, is_last_page=False):
    canvas.saveState()
    footer_text = order_obj.store.company_name
    if order_obj.store.footer_text:
        footer_text += " " + order_obj.store.footer_text
    if order_obj.store.registration_number:
        footer_text += " Registered in England No. " + order_obj.store.registration_number

    canvas.setFont('Helvetica', 8)
    canvas.drawString(5 * mm, 5 * mm, footer_text)

    if is_last_page and order_obj.comment:
        canvas.setFont('Helvetica', 9)
        canvas.drawString(5 * mm, 20 * mm, f"Comment: {order_obj.comment}")

    canvas.restoreState()


def generate_order_footer(order_obj, order_total_table, styles):
    elements = []
    order_payment_str = utils.proforma_details_legal(order_obj)
    payment_paragraph = Paragraph(order_payment_str, styles['Normal'])

    # Build button
    button = None
    if order_obj.order_hash:
        payment_link = (
            f'{settings.TSG_PAYMENT_LINK}'
            f'&order_id={order_obj.order_id}&order_hash={order_obj.order_hash}'
        )
        button = Table(
            [[Paragraph(
                f'<a href="{payment_link}"><font color="white"><b>Pay Securely Online with STRIPE</b></font></a>',
                styles['Normal']
            )]],
            colWidths=[100 * mm],
            style=TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), '#007BFF'),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TEXTCOLOR', (0, 0), (-1, -1), 'white'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ])
        )

    # Combine paragraph and button vertically into left column
    left_column = [payment_paragraph]
    if button:
        left_column.append(Spacer(1, 6))
        left_column.append(button)

    # Assemble the final table: left column (legal+button), right column (totals)
    order_total_info = [
        [left_column, order_total_table]
    ]
    order_total_footer = Table(order_total_info, colWidths=[100 * mm, 100 * mm])
    order_total_footer.setStyle(TableStyle([
        ('ALIGN', (1, 0), (-1, -1), "RIGHT"),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (1, 0), (-1, -1), "TOP"),
    ]))

    elements.append(order_total_footer)
    return elements