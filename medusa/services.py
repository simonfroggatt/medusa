from apps.templating.models import OcTsgTemplates, OcTsgTemplateTypes
from preview_generator.manager import PreviewManager
import os
from django.conf import settings


def createUploadThumbnail(filename):
    cache_path = os.path.join(settings.MEDIA_ROOT, 'preview_cache')
    preview_path = filename
    manager = PreviewManager(cache_path, create_folder=True)
    path_to_preview_image = manager.get_jpeg_preview(preview_path)
    return os.path.basename(path_to_preview_image)