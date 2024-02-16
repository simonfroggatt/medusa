
def icons_processor(request):
    # Add custom variables here
    return {
        'ICON_EDIT': 'fa-solid fa-pen-to-square',
        'ICON_EDIT_OUTLINE': 'fa-regular fa-pen-to-square',
        'ICON_DELETE': 'fa-solid fa-trash',
        'ICON_DELETE_OUTLINE': 'fa-regular fa-trash',
        'ICON_ADD': 'fa-solid fa-plus',
        'ICON_PDF':  'fa-solid fa-file-pdf',
        'ICON_DOC': 'fa-solid fa-file-word',
        'ICON_EXCEL': 'fa-solid fa-file-excel',
        'ICON_XLS': 'fa-solid fa-file-xls',
        'ICON_JPEG': 'fa-solid fa-file-jpg',
    }


def button_colours(request):
    return {
        'BUTTON_EDIT': 'btn-primary',
        'BUTTON_EDIT_OUTLINE': 'btn-outline-primary',
        'BUTTON_ADD': 'btn-success',
        'BUTTON_ADD_OUTLINE': 'btn-outline-success',
        'BUTTON_DELETE': 'btn-danger',
        'BUTTON_DELETE_OUTLINE': 'btn-outline-danger',
        'BUTTON_OK': 'btn-success',
        'BUTTON_CANCEL': 'btn-secondary',
        'BUTTON_UPDATE': 'btn-success',
        'BUTTON_EXTRA': 'btn-warning',
        'BUTTON_EXTRA_OUTLINE': 'btn-outline-warning',
        'BUTTON_INFO': 'btn-secondary',
    }

def js_icons(request):
    return {
        'JS_ICONS': icons_processor(request)
    }

def js_buttons(request):
    return {
        'JS_BUTTONS': button_colours(request)
    }
