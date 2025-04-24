from apps.xero_api.xero_objects.xero_base import XeroItem
import apps.xero_api.config as xero_config
from apps.orders.services import create_due_date, get_order_product_line_options
from decimal import Decimal
from django.conf import settings
import os
import logging
logger = logging.getLogger('apps')


class XeroInvoice(XeroItem):

    def __init__(self):
        super().__init__()
        self.__Type = 'ACCREC'
        self.__Contact  = None
        self.__LineItems = []
        self.__Date = None
        self.__DueDate = None
        self.__LineAmountTypes = 'Exclusive'
        self.__InvoiceNumber = None
        self.__Reference = None
        self.__Status = 'AUTHORISED'
        self.__SubTotal = 0.00
        self.__TotalTax = 0.00
        self.__Total = 0.00
        self.__InvoiceID = None
        self.__TaxCode = 'OUTPUT2'
        self.__AccountCode = xero_config.ACCOUNT_CODE_SALES
        self.__Payments = []
        self.__PaymentID = None
        return

    def add_invoice_details(self,order_obj, xero_contact_id):
        self.__Contact = xero_contact_id
        self.__Date = order_obj.date_added
        self.__InvoiceNumber = order_obj.invoice_prefix + "-"+ str(order_obj.order_id)
        self.__Reference = order_obj.customer_order_ref
        self.__TaxCode = order_obj.tax_rate.accounting_code
        if order_obj.date_due:
            self.__DueDate = order_obj.date_due
        else:
            self.__DueDate = create_due_date(order_obj)

    def add_invoice_payment(self, order_obj):
        payment_data = {}
        payment_data['Date'] = order_obj.payment_date
        payment_data['Amount'] = order_obj.total
        payment_data['PaymentType'] = "ACCRECPAYMENT"
        payment_data['Status'] = "AUTHORISED"
        payment_data['IsReconciled'] = "false"
        payment_data['Reference'] = order_obj.payment_ref
        payment_data['Invoice'] = {"InvoiceID": self.__InvoiceID}
        #find out if it's paypal or card
        if order_obj.payment_method == settings.TSG_PAYMENT_TYPE_PAYPAL:
            payment_data['Account'] = {"AccountID": xero_config.ACCOUNT_ID_PAYPAL}
        else:
            payment_data['Account'] = {"AccountID": xero_config.ACCOUNT_ID_SSAN}
       # payment_data['Account'] = {"AccountID": xero_config.ACCOUNT_ID_DEMO}
        self.__Payments.append(payment_data)

    def add_order_lines(self, order_lines):

        for product_line in order_lines:
            lineitem = {}
            lineitem['Description'] = product_line.name + '(' + product_line.model + ')' + '\n' + \
                                      'Size: ' + product_line.size_name + '\n' + \
                                      'Material: ' + product_line.material_name

            #check if there are any options
            option_text = self.__get_order_product_line_options(product_line.order_product_id)
            if option_text:
                lineitem['Description'] = lineitem['Description'] + '\n' + option_text

            lineitem['Quantity'] = product_line.quantity
            lineitem['UnitAmount'] = format(product_line.price, '.2f')
           # lineitem['LineAmount'] = format(product_line.total, '.2f')
            lineitem['TaxType'] = self.__TaxCode
            lineitem['AccountCode'] = self.__AccountCode
            self.__LineItems.append(lineitem)



    def add_line(self, line_data):
        lineitem = {}
        lineitem['Description'] = line_data['description']
        lineitem['Quantity'] = line_data['quantity']
        lineitem['UnitAmount'] = format(line_data['price'], '.2f')
        #lineitem['LineAmount'] = format(product_line['total'], '.2f')
        lineitem['TaxType'] = self.__TaxCode
        lineitem['AccountCode'] = line_data['account_code']

        self.__LineItems.append(lineitem)

    def set_totals(self, subtotal, tax, total):
        self.__SubTotal = subtotal
        self.__TotalTax = tax
        self.__Total = total

    def set_existing_id(self, invoice_id):
        self.__InvoiceID = invoice_id

    def save_invoice(self):
        post_fix = ''
        endpoint = 'Invoices'
        invoice_dict = {
            "Type": self.__Type,
            "Contact": {
                "ContactID":  self.__Contact
            },
            "InvoiceNumber": self.__InvoiceNumber,
            "DateString": self.__Date,
            "DueDateString": self.__DueDate,
            "Status": self.__Status,
            "LineAmountTypes": self.__LineAmountTypes,
            #"SubTotal": self.__SubTotal,
            #"TotalTax": self.__TotalTax,
            #"Total": self.__Total,
            "LineItems": self.__LineItems,
        }
        if self.__Reference:
            invoice_dict['Reference'] = self.__Reference

        invoices_data = {"Invoices": [invoice_dict]}
        if self.xero_api.save_to_xero(endpoint, invoices_data):
            xero_reponse = self.xero_api.get_xero_response()
            if xero_reponse['Invoices']:
                xero_response_invoice = xero_reponse['Invoices'][0]
                self.__InvoiceID = xero_response_invoice['InvoiceID']
                self.__Total = Decimal(str(xero_response_invoice['Total']))
            else:
                self.__InvoiceID = None
        else:
            self.__InvoiceID = None

        return self.__InvoiceID

    def send_invoice(self, order_id, send_email, mark_sent=True):
        bl_invoice_sent = False
        if self.check_invoice_exists(order_id):
           bl_invoice_sent =  True

        else:
            bl_invoice_sent = False

        return bl_invoice_sent

    def create_payment(self):
        endpoint = 'Payments'

        payments_data = {"Payments": self.__Payments}
        if self.xero_api.save_to_xero(endpoint, payments_data):
            xero_response = self.xero_api.get_xero_response()
            if xero_response['Payments']:
                xero_response_invoice = xero_response['Payments'][0]
                self.__PaymentID = xero_response_invoice['PaymentID']
            else:
                self.__PaymentID = None
        else:
            self.__PaymentID = None

        return self.__PaymentID

    def check_invoice_exists(self, order_id):
        return False

    def get_total(self):
        return self.__Total

    def get_order_link(self, xero_id):
        self.__InvoiceID = xero_id
        endpoint = 'Invoices'

        if self.xero_api.get_from_xero(endpoint, self.__InvoiceID, 'OnlineInvoice'):
            xero_response = self.xero_api.get_xero_response()
            if xero_response['OnlineInvoices']:
                xero_response_invoice = xero_response['OnlineInvoices'][0]
                self.__InvoiceURL = xero_response_invoice['OnlineInvoiceUrl']
            else:
                self.__InvoiceURL = None
        else:
            self.__InvoiceURL = None

        return self.__InvoiceURL

    def get_invoice(self, invoice_id):
        endpoint = 'Invoices'
        if self.xero_api.get_from_xero(endpoint, invoice_id):
            xero_response = self.xero_api.get_xero_response()
            if xero_response['Invoices']:
                xero_response_invoice = xero_response['Invoices'][0]
                self.__save_invoice_to_object(xero_response_invoice)
            else:
                self.__InvoiceID = None
        else:
            self.__InvoiceID = None

        return self.__InvoiceID

    def get_payments(self):
        return self.__Payments

    def get_order_contact_id(self, invoice_id):
        endpoint = 'Invoices'
        if self.xero_api.get_from_xero(endpoint, invoice_id):
            xero_response = self.xero_api.get_xero_response()
            if xero_response['Invoices']:
                xero_response_invoice = xero_response['Invoices'][0]
                contact_id = xero_response_invoice['Contact']['ContactID']
            else:
                contact_id = None
        else:
            contact_id = None

        return contact_id


    def __save_invoice_to_object(self, xero_response_invoice):
        self.__InvoiceID = xero_response_invoice['InvoiceID']
        self.__Total = Decimal(str(xero_response_invoice['Total']))
        self.__SubTotal = Decimal(str(xero_response_invoice['SubTotal']))
        self.__Payments = xero_response_invoice['Payments']
        self.__DueDate = xero_response_invoice['DueDate']
        self.__Status = xero_response_invoice['Status']


    def __get_order_product_line_options(self, order_product_id):
        option_data = get_order_product_line_options(order_product_id)
        options_obj = option_data['options']
        option_text = ''
        option_break = ''
        for option in options_obj:
            option_text = f'{option_text}{option_break}{option.option_name} : {option.value_name}'
            option_break = '\n'

        addon_obj = option_data['addons']
        for addon in addon_obj:
            option_text = f'{option_text}{option_break}{addon.class_name} : {addon.value_name}'
            option_break = '\n'

        return option_text

    def _debug(self, debugline):
        log_file = os.path.join(settings.BASE_DIR, 'apps/xero_api/logs/xero_error_invoices.txt')
        if os.path.exists(log_file):
            append_write = 'a'  # append if already exists
        else:
            append_write = 'w'  # make a new file if not

        with open(log_file, append_write) as outfile:
            outfile.write(debugline + '\n')


