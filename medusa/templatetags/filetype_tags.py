from django import template
from django.conf import settings
from medusa.models import OcTsgFiletypeImages

register = template.Library()

@register.filter('filetype_image')
def filetype_image(filename):
    """
    get the file exntension and see if it matched the file extension in the database
    """

    file_ext = filename.split('.')[-1]
    filetype_obj = OcTsgFiletypeImages.objects.filter(extension__exact=file_ext.lower()).first()
    if filetype_obj:
        return filetype_obj.image_url
    else:
        return settings.TSG_NO_IMAGE