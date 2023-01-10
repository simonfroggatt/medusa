from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
import pathlib
from svglib.svglib import svg2rlg


def create_company_logo(company_obj):
    maxW = 90 * mm
    maxH = 20 * mm

    img_src = 'apps/paperwork/static/paperwork/images/' + company_obj.logo_paperwork
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
    address += '<BR/>VAT:# ' + company_obj.vat_number
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
    shipping_str += order_obj.shipping_address_1 + "<BR/>"
    if order_obj.shipping_address_2:
        shipping_str += order_obj.shipping_address_2 + "<BR/>"
    shipping_str += order_obj.shipping_city + "<BR/>"
    if order_obj.shipping_area:
        shipping_str += order_obj.shipping_area + "<BR/>"
    shipping_str += order_obj.shipping_postcode
    return shipping_str


def shipping_address_keep(order_obj):
    shipping_str = get_shipping_address(order_obj)
    shipping_str += "<BR/><BR/>Telephone: " + order_obj.shipping_telephone
    shipping_str += f'<BR/>Order ref: <b>{order_obj.order_id}</b>'
    shipping_str += "<BR/>Website: " + order_obj.store.name
    return shipping_str


def order_billing(order_obj):
    billing_str = '<b>Shipping Address:</b><BR/>'
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
    shipping_str = '<b>Billing Address:</b><BR/>'
    shipping_str += order_obj.shipping_fullname + "<BR/>"
    if order_obj.shipping_company:
        shipping_str += order_obj.shipping_company + "<BR/>"
    shipping_str += order_obj.shipping_address_1 + "<BR/>"
    if order_obj.shipping_address_2:
        shipping_str += order_obj.shipping_address_2 + "<BR/>"
    shipping_str += order_obj.shipping_city + "<BR/>"
    shipping_str += order_obj.shipping_area + "<BR/>"
    shipping_str += order_obj.shipping_postcode + "<BR/>"
    shipping_str += order_obj.shipping_country
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
            order_payment_str += ' made by:' + order_history_obj.payment_method.payment_method_name
            order_payment_str += '<BR/>Merchant message ' + order_history_obj.comment
        else:
            order_payment_str = 'Paid with thanks'
            order_payment_str += '<BR/>Paid via ' + order_history_obj.payment_method.payment_method_name
            if order_obj.date_due:
                order_payment_str += ' at ' + order_obj.date_due.strftime('%d/%m/%Y')
            order_payment_str += '<BR/>' + order_history_obj.comment
    else:
        order_payment_str = 'Payment Type:' + order_obj.payment_status.name
        order_payment_str += '<BR/>Due Date:' + order_obj.date_added.strftime('%d/%m/%Y')
    return order_payment_str


def order_payment_details_simple(order_obj, currency_symbol):
    order_payment_str = ''
    if order_obj.payment_status_id == 2:
        order_payment_str = 'Paid with thanks'
    else:
        order_payment_str = 'Payment Type:' + order_obj.payment_status.name
        order_payment_str += '<BR/>Due Date:' + order_obj.date_added.strftime('%d/%m/%Y')
    return order_payment_str


def create_product_desc(order_line):
    product_desc = ''
    product_desc += order_line.name + "<BR/>"
    product_desc += f'Size:{order_line.size_name}<BR/>'
    product_desc += f'Material:{order_line.material_name} ({order_line.orientation_name})'
    return product_desc



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
