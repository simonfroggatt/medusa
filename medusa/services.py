from medusa.models import OcTsgTemplates, OcTsgTemplateTypes


def get_text_template(template_name):
    data = dict()
    obj_tempate = OcTsgTemplates.objects.filter(name__iexact=template_name).filter(template_type_id=1).first()
    data['header'] = obj_tempate.header
    data['main'] = obj_tempate.main
    return data
