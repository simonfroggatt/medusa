"""Input validation for quotes_web.

Header fields go through a Django form; the posted cart lines are checked in
CreateQuoteForm.clean_lines() because they arrive as a list of dicts, not form fields.
"""
from django import forms


class QuoteItemForm(forms.Form):
    """Staff edit of one quote line, including swapping it to a different variant.

    The variant fields are filled in by the dialog when staff pick a row from the variants
    table (size, material, orientation, code, supplier and the variant's own price), so a
    customer who was quoted for vinyl can be moved to rigid without retyping anything.
    """
    product_name = forms.CharField(max_length=255)
    quantity = forms.IntegerField(min_value=1)
    bulk_used = forms.BooleanField(required=False)
    unit_price = forms.DecimalField(min_value=0, max_digits=15, decimal_places=4, required=False)

    # set by the variants table; all optional so a manual or bespoke line can be edited too
    product_variant_id = forms.IntegerField(required=False)
    variant_code = forms.CharField(max_length=255, required=False)
    size_name = forms.CharField(max_length=256, required=False)
    width = forms.DecimalField(max_digits=10, decimal_places=0, required=False)
    height = forms.DecimalField(max_digits=10, decimal_places=0, required=False)
    orientation_name = forms.CharField(max_length=255, required=False)
    material_name = forms.CharField(max_length=255, required=False)
    supplier_id = forms.IntegerField(required=False)
    supplier_code = forms.CharField(max_length=64, required=False)
    base_unit_price = forms.DecimalField(min_value=0, max_digits=15, decimal_places=4, required=False)

    DETAIL_FIELDS = ('product_variant_id', 'variant_code', 'size_name', 'width', 'height',
                     'orientation_name', 'material_name', 'supplier_id', 'supplier_code',
                     'base_unit_price')

    def clean(self):
        cleaned = super().clean()
        if not cleaned.get('bulk_used') and cleaned.get('unit_price') is None:
            raise forms.ValidationError('Give a unit price, or switch bulk pricing back on.')
        return cleaned

    def detail(self):
        """Only the line-detail fields staff actually filled in."""
        return {name: self.cleaned_data.get(name) for name in self.DETAIL_FIELDS
                if self.cleaned_data.get(name) not in (None, '')}


class QuoteItemAddForm(forms.Form):
    """Add Product, posted from the shared order dialog (orders/dialogs/stock_product.html).

    That template hard-codes the order line's field names - name, model, price, total, tax -
    so this form answers to them and maps them onto the quote line's own columns in save().
    Reusing the template that way means Stock / Previous / Bespoke / Manual, the variants
    table and the option pickers all work with no copy of a 700-line template to maintain.
    """
    quote = forms.IntegerField()
    product_id = forms.IntegerField(required=False)
    product_variant = forms.IntegerField(required=False)
    name = forms.CharField(max_length=255)
    model = forms.CharField(max_length=255, required=False)
    size_name = forms.CharField(max_length=256, required=False)
    width = forms.DecimalField(max_digits=10, decimal_places=0, required=False)
    height = forms.DecimalField(max_digits=10, decimal_places=0, required=False)
    orientation_name = forms.CharField(max_length=255, required=False)
    material_name = forms.CharField(max_length=255, required=False)
    supplier = forms.IntegerField(required=False)
    supplier_code = forms.CharField(max_length=64, required=False)
    quantity = forms.IntegerField(min_value=1)
    price = forms.DecimalField(min_value=0, max_digits=15, decimal_places=4)
    total = forms.DecimalField(min_value=0, max_digits=15, decimal_places=4, required=False)
    tax = forms.DecimalField(min_value=0, max_digits=15, decimal_places=4, required=False)
    single_unit_price = forms.DecimalField(min_value=0, max_digits=15, decimal_places=4, required=False)
    base_unit_price = forms.DecimalField(min_value=0, max_digits=15, decimal_places=4, required=False)
    bulk_discount = forms.IntegerField(required=False)
    bulk_used = forms.BooleanField(required=False)
    is_bespoke = forms.BooleanField(required=False)
    exclude_discount = forms.BooleanField(required=False)
    line_discount = forms.DecimalField(max_digits=10, decimal_places=2, required=False)

    # rendered only on the order side of the shared template, declared so the field names
    # never come out blank if that branch is ever shown to a quote
    order = forms.IntegerField(required=False)
    status = forms.IntegerField(required=False)

    def line_values(self):
        """The cleaned data under the quote line's own column names."""
        data = self.cleaned_data
        return {
            'product_id': data.get('product_id') or None,
            'product_variant_id': data.get('product_variant') or None,
            'product_name': data['name'],
            'variant_code': data.get('model') or None,
            'size_name': data.get('size_name') or None,
            'width': data.get('width'),
            'height': data.get('height'),
            'orientation_name': data.get('orientation_name') or None,
            'material_name': data.get('material_name') or None,
            'supplier_id': data.get('supplier') or None,
            'supplier_code': data.get('supplier_code') or None,
            'quantity': data['quantity'],
            'unit_price': data['price'],
            'single_unit_price': data.get('single_unit_price') or data['price'],
            'base_unit_price': data.get('base_unit_price') or data.get('single_unit_price') or data['price'],
            'bulk_discount_id': data.get('bulk_discount') or None,
            'bulk_used': bool(data.get('bulk_used')),
            'is_bespoke': bool(data.get('is_bespoke')),
            'exclude_discount': bool(data.get('exclude_discount')),
            'line_discount': data.get('line_discount'),
        }


class QuoteHeaderForm(forms.Form):
    """Shipping, discount, expiry and notes - the parts staff set before sending."""
    shipping_cost = forms.DecimalField(min_value=0, max_digits=15, decimal_places=2,
                                       required=False)
    discount_amount = forms.DecimalField(min_value=0, max_digits=15, decimal_places=2,
                                         required=False)
    expiry_date = forms.DateField(required=False,
                                  widget=forms.DateInput(attrs={'type': 'date'}))
    notes = forms.CharField(required=False, widget=forms.Textarea(attrs={'rows': 3}))


class CreateQuoteForm(forms.Form):
    """The storefront's quote request (tsg_store -> quotes-web/api/create/)."""
    store_id = forms.IntegerField(min_value=0)
    customer_name = forms.CharField(max_length=255)
    customer_phone = forms.CharField(max_length=32)
    customer_email = forms.EmailField(max_length=96, required=False)
    medusa_customer_id = forms.IntegerField(required=False)
    notes = forms.CharField(required=False)

    REQUIRED_LINE_FIELDS = ('product_name', 'quantity', 'unit_price')

    def __init__(self, *args, lines=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.lines = lines or []

    def clean(self):
        cleaned = super().clean()
        cleaned['lines'] = self.clean_lines()
        return cleaned

    def clean_lines(self):
        if not isinstance(self.lines, list) or not self.lines:
            raise forms.ValidationError('lines must be a non-empty list')

        cleaned_lines = []
        for index, line in enumerate(self.lines):
            if not isinstance(line, dict):
                raise forms.ValidationError(f'line {index}: expected an object')
            missing = [f for f in self.REQUIRED_LINE_FIELDS if line.get(f) in (None, '')]
            if missing:
                raise forms.ValidationError(f'line {index}: missing {", ".join(missing)}')
            try:
                quantity = int(line['quantity'])
                float(line['unit_price'])
            except (TypeError, ValueError):
                raise forms.ValidationError(f'line {index}: quantity and unit_price must be numbers')
            if quantity < 1:
                raise forms.ValidationError(f'line {index}: quantity must be at least 1')
            cleaned_lines.append(line)
        return cleaned_lines
