from django import forms
from apps.sites.models import OcStore, OcTsgSearchRule
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
