
from apps.xero_api.xero_objects.xero_base import XeroItem
from phonenumbers import number_type, parse
from django.conf import settings
import os
import logging
logger = logging.getLogger('apps')
from decimal import Decimal

class XeroContact(XeroItem):

    __XERO_ENDPOINT = 'Contacts'
    __PAYMENT_TERMS = ['DAYSAFTERBILLDATE','DAYSAFTERBILLMONTH', 'OFCURRENTMONTH', 'OFFOLLOWINGMONTH']


    def __init__(self):
        #note we are using the same case as xero uses
        super().__init__()
        self.__ContactID = None
        self.__ContactNumber = None
        self.__AccountNumber = None
        self.__ContactStatus = "ACTIVE"
        self.__Name = None
        self.__FirstName = None
        self.__LastName = None
        self.__EmailAddress = None
        self.__SkypeUserName = None
        self.__BankAccountDetails = None
        self.__CompanyNumber = None
        self.__TaxNumber = None
        self.__AccountsReceivableTaxType = None
        self.__AccountsPayableTaxType = None
        self.__Addresses = []
        self.__Phones = []
        self.__IsSupplier = False
        self.__IsCustomer = True
        self.__DefaultCurrency = "GBP"
        self.__ContactPersons = None
        self.__SalesDefaultAccountCode = "200"
        self.__PaymentTerms = None
        self.__Website = None
        self.__Balances = None
        return

    def get_contact(self, xero_contact_id):
        response = self.do_request('Contacts/' + xero_contact_id, '', '')
        return response


    def add_contact_details(self, contact_data):
        if contact_data['company']:
            self.__Name = contact_data['company']
        else:
            self.__Name = contact_data['fullname']
        if contact_data['firstname']:
            self.__FirstName = contact_data['firstname']
        if contact_data['lastname']:
            self.__LastName = contact_data['lastname']
        if contact_data['email']:
            self.__EmailAddress = contact_data['email']

        if 'website' in contact_data:
            self.__Website = contact_data['website']
        return

    def add_address(self, address_data):
        self._debug('add_address')
        #check if we have a contact address
        self._debug('add_address - address_data')
        self._debug(str(address_data))

        logger.debug(f"add_address = {address_data}")

        address_xero = {'AddressType': 'STREET'}
        #split the address
        address_data['address_1'] = address_data['address_1'].replace('\r', '')
        address_lines = address_data['address_1'].split('\n')
        for i in range(len(address_lines)):
            if i <= 3:
                address_xero['AddressLine' + str(i+1)] = address_lines[i].strip()
            else:
                address_xero['AddressLine4'] += '\n' + address_lines[i].strip()

        if address_data['city']:
            address_xero['City'] = address_data['city']
        if address_data['region']:
            address_xero['Region'] = address_data['region']
        if address_data['postcode']:
            address_xero['PostalCode'] = address_data['postcode']
        if address_data['country']:
            address_xero['Country'] = address_data['country']

        self.__Addresses.append(address_xero)



    def add_telephone(self, phonenumber):
        phone_number_full = parse(phonenumber, "GB")

        if number_type(phone_number_full) == 'MOBILE':
            phone_xero = {'PhoneType': 'MOBILE'}
        else:
            phone_xero = {'PhoneType': 'DEFAULT'}

        phone_xero['PhoneNumber'] = phone_number_full.national_number
        phone_xero['PhoneCountryCode'] = phone_number_full.country_code
        self.__Phones.append(phone_xero)

    def add_payment_terms(self, type, days):
        payment_terms = {'Sales': {'Type': type, 'Day': days} }
        self.__PaymentTerms = payment_terms


    def save_contact(self):
        endpoint = 'Contacts'
        contact_dict = {
            "Name": self.__Name,
            "FirstName": self.__FirstName,
            "LastName": self.__LastName,
            "EmailAddress": self.__EmailAddress,
            "Addresses" : self.__Addresses,
            "Phones": self.__Phones,
            "AccountsReceivableTaxType": "OUTPUT2",
            "AccountsPayableTaxType": "INPUT2",
            "DefaultCurrency": "GBP",
            "SalesDefaultAccountCode": self.__SalesDefaultAccountCode,
            "IsSupplier": self.__IsSupplier,
            "IsCustomer": self.__IsCustomer,
            "PaymentTerms": self.__PaymentTerms,
            "ContactStatus": self.__ContactStatus,
            "Website": self.__Website,
        }

        if self.__ContactID:
            contact_dict['ContactID'] = self.__ContactID

        if self.xero_api.save_to_xero(endpoint, contact_dict):
            xero_reponse = self.xero_api.get_xero_response()
            if xero_reponse['Contacts']:
                xero_reponse_contact = xero_reponse['Contacts'][0]
                self.__ContactID = xero_reponse_contact['ContactID']
            else:
                self.__ContactID = None
        else:
            self.__ContactID = None

        return self.__ContactID

    def set_existing_id(self, contact_id):
        self.__ContactID = contact_id
        return

    def get_account_balance(self):
        data = dict()
        data = {
            'outstanding': 0,
            'overdue': 0
        }

        if self.do_request('Contacts/' + self.__ContactID, '', ''):
            xero_response = self.xero_api.get_xero_response()
            if xero_response['Contacts']:
                contact = xero_response['Contacts'][0]
                balances = contact.get('Balances', {})
                receivable = balances.get('AccountsReceivable', {})
                outstanding = Decimal(str(receivable.get('Outstanding', 0)))
                overdue = Decimal(str(receivable.get('Overdue', 0)))
                data = {
                    'outstanding': outstanding,
                    'overdue': overdue
                }
        return data


    def _debug(self, debugline):
        log_file = os.path.join(settings.BASE_DIR, 'apps/xero_api/logs/xero_error.txt')
        if os.path.exists(log_file):
            append_write = 'a'  # append if already exists
        else:
            append_write = 'w'  # make a new file if not

        with open(log_file, append_write, encoding='utf-8') as outfile:
            outfile.write(debugline + '\n')
