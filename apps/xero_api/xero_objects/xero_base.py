from apps.xero_api.xero_auth_manager import XeroAuthManager
class XeroItem:

    xero_api = None
    _tenant_id = None
    def __init__(self):
        self.xero_api = XeroAuthManager()
        self._tenant_id = self.xero_api.tenant_id
        return

    def do_request(self, endpoint, data, method):
        self.xero_api._get_req(endpoint, data, method)
        return self.xero_api.get_xero_response()

    def get_response(self):
        return self.xero_api.get_xero_response()

    def get_tenant_id(self):
        return self._tenant_id

    def send_request(self, endpoint, data, method):
        self.xero_api._set_req(endpoint, data, method)
        return self.xero_api.get_xero_response()
