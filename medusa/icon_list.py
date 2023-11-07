def icons_processor(request):
    # Add custom variables here
    return {
        'ICON_EDIT': 'fa-solid fa-pen-to-square',
        'ICON_DELETE': 'fa-solid fa-trash',
        'ICON_ADD': 'fa-solid fa-plus',
    }

def button_colours(request):
    return {
        'BUTTON_EDIT': 'btn-primary',
        'BUTTON_ADD': 'btn-success',
        'BUTTON_DELETE': 'btn-danger',
        'BUTTON_OK': 'btn-success',
        'BUTTON_CANCEL': 'btn-secondary',
        'BUTTON_UPDATE': 'btn-success',
        'BUTTON_EXTRA': 'btn-warning'
    }

def js_icons(request):
    return {
        'JS_ICONS': icons_processor(request)
    }

def js_buttons(request):
    return {
        'JS_BUTTONS': button_colours(request)
    }
