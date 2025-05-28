from apps.templating.views import OcTsgTemplates


def get_template_data(template_name, store_id):
    data = dict()

    obj_tempate = OcTsgTemplates.objects.filter(template_type__enum_val__exact=template_name).filter(
        store_id=store_id).first()
    data['header'] = obj_tempate.subject
    data['main'] = obj_tempate.main
    return data

