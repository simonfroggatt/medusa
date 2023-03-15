from apps.templating.views import OcTsgTemplates


def get_template_data(template_name, store_id):
    data = dict()
    obj_tempate = OcTsgTemplates.objects.filter(name__iexact=template_name).filter(template_type_id=1)\
        .filter(store_id=store_id).first()
    data['header'] = obj_tempate.header
    data['main'] = obj_tempate.main
    return data

