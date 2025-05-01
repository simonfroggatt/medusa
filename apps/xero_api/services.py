from apps.xero_api.xero_objects.contact import XeroContact
from cryptography.fernet import Fernet

class XeroClient:
    def get_company_account_balance(self, company_id, encrypted):
        f = Fernet(settings.XERO_TOKEN_FERNET)
        decrypted = f.decrypt(encrypted).decode()
        if decrypted != str(company_id):
            data['status'] = 'ERROR'
            data['error'] = 'API TSG decryption failed'
            return JsonResponse(data)

        company = OcTsgCompany.objects.get(pk=company_id)
        if not company.xero_id:
            data['status'] = 'ERROR'
            data['account_details'] = {'outstanding': 0, 'overdue': 0}
            return data

        return self.xero_company_account(company.xero_id)


#todo - need to finish this off .  Need to move on
    def xero_company_account(self, xero_contact_id):
        data = {}

        if xero_contact_id:
            xero_contact_obj = XeroContact()
            xero_balance = xero_contact_obj.get_account_balance()
            errors = xero_contact_obj.xero_api.get_error()
            if not errors:
                company_obj.xero_id = contact_id
                company_obj.save()
                data['status'] = 'OK'
                data['account_balance'] = xero_balance
            else:
                data['status'] = 'ERROR'
                data['error'] = errors
                data['account_balance'] = {}
        else:
            data['status'] = 'OK'
            data['account_balance'] = {}

        xero_contact_data = _get_company_accounts(company_obj)
        if xero_contact_data['status'] == 'OK':
            data['status'] = 'OK'
            data['account_details'] = xero_contact_data['account_balance']
        else:
            data['status'] = xero_contact_data['status']
            data['error'] = xero_contact_data['error']

        data['xero_call_type'] = 'COMPANY'
        return JsonResponse(data)


"""from xero_api.services import XeroClient

def company_dashboard(request, company_id):
    company = OcTsgCompany.objects.get(pk=company_id)
    encrypted = generate_token(company_id)  # however you create the token

    xero = XeroClient()
    context = {
        'company': company,
        'account_balance': xero.get_company_account_balance(company_id, encrypted)
    }

    return render(request, 'company_dashboard.html', context)"""