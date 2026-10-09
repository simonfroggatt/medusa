import re

from django import forms
from apps.sites.models import OcStore, OcTsgSearchRule, OcTsgBanner, OcTsgCategoryBespoke
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


class ColourInput(forms.TextInput):
    """A colour swatch you can click, plus the hex code beside it (they stay in step: see banner_form.html)."""
    template_name = 'sites/widgets/colour_input.html'


class BannerForm(forms.ModelForm):
    store_id = forms.TypedChoiceField(coerce=int, label='Store')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['store_id'].choices = list(
            OcStore.objects.filter(store_id__gt=0).order_by('name').values_list('store_id', 'name'))

    def _clean_colour(self, name):
        value = (self.cleaned_data.get(name) or '').strip()
        if not re.fullmatch(r'#[0-9a-fA-F]{6}', value):
            raise forms.ValidationError('Use a colour like #0B2545 (a # and six letters or numbers).')
        return value.upper()

    def clean_bg_from(self):
        return self._clean_colour('bg_from')

    def clean_bg_to(self):
        return self._clean_colour('bg_to')

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
            'subtitle': 'Press Enter for a new line, and it shows as a new line on the banner.',
            'sort_order': 'Lowest first.',
            'text_align': 'Where the text sits on the banner.',
            'bg_from': 'Shown behind the image, and instead of it if there is none.',
            'date_end': 'Last day it shows.',
        }
        widgets = {
            'status': forms.CheckboxInput,
            'image': MediaImageInput,
            'image_mobile': MediaImageInput,
            'bg_from': ColourInput,
            'bg_to': ColourInput,
            'date_start': forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
            'date_end': forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
            'subtitle': forms.Textarea(attrs={'rows': 2}),
        }


class CategoryBespokeForm(forms.ModelForm):
    """One category's "make your own" offer. category_id is fixed once the rule exists."""
    NO_OFFER = ''
    bespoke_product_id = forms.TypedChoiceField(
        label='Opens this designer', required=False, coerce=int, empty_value=None,
        help_text='"No offer here" hides the offer on this category and stops its sub-categories inheriting one.')

    symbol_id = forms.TypedChoiceField(
        label='Opens with this symbol', required=False, coerce=int, empty_value=None,
        widget=forms.Select(attrs={'class': 'form-select form-select-sm', 'size': 7}),
        help_text='Optional. For this exact category only: its sub-categories use the designer\'s default symbol, '
                  'so a forklift symbol on "Warning Signs" would not spread to everything under it.')

    def __init__(self, *args, categories=(), products=(), symbols=(), **kwargs):
        # 'categories' already leaves out any category that has a row, so a duplicate can't be picked;
        # the unique key in the table is the backstop (validate_unique is skipped: it would query the database).
        super().__init__(*args, **kwargs)
        self.fields['bespoke_product_id'].choices = [(self.NO_OFFER, 'No offer here (also stops inheriting)')] + [
            (pid, '%s (%s)' % (title, pid)) for pid, title in products]
        self.fields['symbol_id'].choices = [('', 'No symbol (the designer starts from its default)')] + [
            (sid, '%s \u2014 %s' % (code, name)) for sid, code, name, _ in symbols]
        self.fields['category_id'] = forms.TypedChoiceField(
            label='Category', coerce=int, choices=[(cid, name) for cid, name in categories])
        if self.instance and self.instance.pk:
            self.fields['category_id'].disabled = True

    def validate_unique(self):
        pass

    def clean(self):
        cleaned = super().clean()
        if cleaned.get('bespoke_product_id') is None and cleaned.get('symbol_id') is not None:
            self.add_error('symbol_id', 'A symbol needs a designer to open: pick one above, or clear the symbol.')
        if cleaned.get('bespoke_product_id') is None and (cleaned.get('headline') or cleaned.get('text') or cleaned.get('prefill')):
            self.add_error('bespoke_product_id', 'Pick a designer, or clear the wording: "no offer" has nothing to show.')
        return cleaned

    class Meta:
        model = OcTsgCategoryBespoke
        fields = ['category_id', 'bespoke_product_id', 'symbol_id', 'type_label', 'headline', 'text', 'prefill', 'status', 'note']
        labels = {'type_label': 'Type (used in the wording)', 'headline': 'Heading (optional)', 'text': 'Text (optional)',
                  'prefill': 'Pre-fill the designer with (optional)', 'status': 'Active', 'note': 'Note (for us)'}
        help_texts = {
            'type_label': 'e.g. "prohibition": shows as "Custom prohibition signs at stock sign prices".',
            'headline': 'Leave blank for the standard wording.',
            'text': 'Leave blank for the standard wording.',
            'prefill': 'Words handed to the designer\'s "describe it" box so the AI suggests ideas straight away, e.g. "No smoking sign".',
            'status': 'Off keeps the row but hides the offer.',
        }
        widgets = {'status': forms.CheckboxInput, 'text': forms.Textarea(attrs={'rows': 2})}
