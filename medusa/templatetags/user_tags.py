from django import template

register = template.Library()

@register.filter('has_group')
def has_group(user, group_name):
    """
    check if our user has permiss
     {% if request.user|has_group:"medusaadmin" %}
    """
    groups = user.groups.all().values_list('name', flat=True)
    return True if group_name in groups else False