from django import forms
from apps.sites.models import OcStore, OcTsgSearchRule, OcTsgBanner
from tinymce.widgets import TinyMCE


class StoreEditForm(forms.ModelForm):


    def __init__(self, *args, **kwargs):
        super(StoreEditForm, self).__init__(*args, **kwargs)
        self.fields['currency'].empty_label = None
        self.fields['tax_rate'].empty_label = None

    class Meta:
        model = OcStore

        fields = '__all__'

        labels = {
            'status': 'Site Live',
            'logo': 'Website Logo',
            'prefix': 'Order Ref Prefix',
            'name': 'Title',
            'footer_text' : 'Website Footer Text'
        }

        widgets = {
            'status': forms.CheckboxInput,
            'email_address': forms.EmailInput,
            'accounts_email_address': forms.EmailInput,
            'address': forms.Textarea(attrs={'rows': 5}),
        }



class SearchRuleForm(forms.ModelForm):
    store_id = forms.TypedChoiceField(coerce=int, label='Store')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        stores = [(0, 'All stores')] + list(
            OcStore.objects.filter(store_id__gt=0).order_by('name').values_list('store_id', 'name'))
        self.fields['store_id'].choices = stores

    def clean(self):
        cleaned = super().clean()
        rule_type = cleaned.get('rule_type')
        patterns = (cleaned.get('category_patterns') or '').strip()
        words = (cleaned.get('trigger_words') or '').strip()
        if rule_type in (OcTsgSearchRule.DEMOTE_ONLY, OcTsgSearchRule.DEMOTE_ANY) and not patterns:
            self.add_error('category_patterns', 'Add at least one category name (one per line).')
        if rule_type == OcTsgSearchRule.IGNORE_WORD and not words:
            self.add_error('trigger_words', 'Add at least one word.')
        return cleaned

    class Meta:
        model = OcTsgSearchRule
        fields = ['store_id', 'rule_type', 'label', 'category_patterns', 'trigger_words', 'penalty', 'status']
        labels = {
            'rule_type': 'What it does',
            'label': 'Name',
            'category_patterns': 'Categories',
            'trigger_words': 'Words',
            'penalty': 'How far to push down',
            'status': 'Active',
        }
        help_texts = {
            'category_patterns': 'Category names, one per line. % matches any text, e.g. Prestige% or %ClearVIEW%.',
            'trigger_words': 'Comma separated. For the push-down rules these are the words that switch the rule off '
                             '(someone searching "nhs" wants NHS signs). For "ignore" rules they are the words to ignore.',
            'penalty': 'Around 300 pushes a sign below the standard one; 400 puts it last. Not used by "ignore" rules.',
        }
        widgets = {
            'category_patterns': forms.Textarea(attrs={'rows': 4}),
            'status': forms.CheckboxInput,
        }


class MediaImageInput(forms.ClearableFileInput):
    """File input that shows the current image as a thumbnail. Django's own .url is wrong for
    Medusa's S3 media domain (it comes out as 'https//https://...'), so build it from the media prefix."""
    template_name = 'sites/widgets/media_image_input.html'


class BannerForm(forms.ModelForm):
    store_id = forms.TypedChoiceField(coerce=int, label='Store')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['store_id'].choices = list(
            OcStore.objects.filter(store_id__gt=0).order_by('name').values_list('store_id', 'name'))

    def clean(self):
        cleaned = super().clean()
        has_image = bool(cleaned.get('image')) or bool(self.instance.pk and self.instance.image
                                                       and not self.data.get('image-clear'))
        if not has_image and not (cleaned.get('title') or '').strip():
            raise forms.ValidationError('A banner needs an image, a heading, or both.')
        start, end = cleaned.get('date_start'), cleaned.get('date_end')
        if start and end and end < start:
            self.add_error('date_end', 'The end date is before the start date.')
        return cleaned

    class Meta:
        model = OcTsgBanner
        fields = ['store_id', 'status', 'sort_order', 'image', 'image_mobile', 'alt_text', 'tag', 'title',
                  'subtitle', 'link', 'button_text', 'button_style', 'text_align', 'bg_from', 'bg_to', 'date_start', 'date_end']
        labels = {
            'status': 'Active', 'sort_order': 'Order', 'image': 'Image', 'image_mobile': 'Phone image (optional)',
            'alt_text': 'Image description', 'tag': 'Small label above the heading', 'title': 'Heading',
            'subtitle': 'Text under the heading', 'link': 'Link', 'button_text': 'Button text',
            'button_style': 'Button style', 'text_align': 'Text position', 'bg_from': 'Background colour (from)', 'bg_to': 'Background colour (to)',
            'date_start': 'Show from (optional)', 'date_end': 'Show until (optional)',
        }
        help_texts = {
            'image': 'Wide image, about 1920 x 400 px. Leave the heading empty to show the picture as it is.',
            'image_mobile': 'A taller crop for phones. If empty, the main image is used.',
            'alt_text': 'For screen readers, and shown if the image fails. Important when the picture has the text in it.',
            'link': 'Where the banner or button goes, e.g. /fire-exit-signs. With no button text the whole banner is the link.',
            'sort_order': 'Lowest first.',
            'text_align': 'Where the text sits on the banner.',
            'bg_from': 'Shown behind the image, and instead of it if there is none.',
            'date_end': 'Last day it shows.',
        }
        widgets = {
            'status': forms.CheckboxInput,
            'image': MediaImageInput,
            'image_mobile': MediaImageInput,
            'bg_from': forms.TextInput(attrs={'type': 'color'}),
            'bg_to': forms.TextInput(attrs={'type': 'color'}),
            'date_start': forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
            'date_end': forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
            'subtitle': forms.Textarea(attrs={'rows': 2}),
        }
