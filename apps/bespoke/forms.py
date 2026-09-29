"""Editing the designer's standard rows.

A row is a band on a sign: a colour, its wording and its symbol. The wording is
a list and the symbol is a link, so both are inline formsets -- which is why
these live in tables rather than a JSON blob.

What is deliberately NOT editable here:

  code      a saved design refers to it, so changing one would quietly change
            what an old design means. Set once when the row is created.
  weight    on a band with a symbol beside wording. The plate behind the symbol
            is a square cut from the band's height, so an odd height gives an
            odd plate and the symbols stop lining up down the left of the sign.
            The field is shown, with a warning, because it is read for bands
            that have no symbol or no wording.
"""

from django import forms
from django.db.models import Min
from django.forms import inlineformset_factory

from apps.symbols.models import OcTsgSymbols

from apps.bespoke.models import (
    KINDS,
    OcTsgBespokeBoard,
    OcTsgBespokeBoardRow,
    OcTsgBespokeRow,
    OcTsgBespokeRowGroup,
    OcTsgBespokeRowLine,
    OcTsgBespokeRowSymbol,
)


def _bootstrap(fields):
    """Bootstrap classes, so the forms look like the rest of Medusa."""
    for field in fields.values():
        widget = field.widget
        if isinstance(widget, forms.CheckboxInput):
            widget.attrs.setdefault('class', 'form-check-input')
        elif isinstance(widget, forms.Select):
            widget.attrs.setdefault('class', 'form-select')
        else:
            widget.attrs.setdefault('class', 'form-control')


class RowGroupForm(forms.ModelForm):
    class Meta:
        model = OcTsgBespokeRowGroup
        fields = ['kind', 'title', 'sort_order', 'status']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        _bootstrap(self.fields)


# The engine's category keys, in words. A free-text box asking for a "category
# key" is the engine's vocabulary, not anybody else's.
COLOURS = [
    ('', 'Follow the symbol'),
    ('prohibition', 'Prohibition — red ring'),
    ('mandatory', 'Mandatory — blue circle'),
    ('warning', 'Warning — yellow triangle'),
    ('fire_emergency', 'Safe condition — green'),
    ('fire', 'Fire equipment — red'),
    ('plain', 'White, black wording'),
]

# What a band's height means, rather than a decimal.
HEIGHTS = [
    ('0.70', 'Short'),
    ('1.00', 'Normal'),
    ('1.25', 'Tall'),
    ('1.50', 'Taller'),
    ('2.00', 'Double'),
]


class RowForm(forms.ModelForm):
    colour = forms.ChoiceField(choices=COLOURS, required=False, label='Colour')
    weight = forms.ChoiceField(choices=HEIGHTS, label='Height', initial='1.00')

    class Meta:
        model = OcTsgBespokeRow
        fields = ['group', 'label', 'colour', 'cells', 'weight',
                  'is_step', 'has_write_on', 'sort_order', 'status']

    def __init__(self, *args, kind='board', **kwargs):
        super().__init__(*args, **kwargs)
        self.kind = kind
        self.fields['group'].queryset = OcTsgBespokeRowGroup.objects.filter(kind=kind, status=True)
        self.fields['status'].label = 'Offer this row to customers'
        self.fields['sort_order'].label = 'Where it sits in its group'
        # A height off the list (a preset asked for 0.9) still has to show.
        current = self.initial.get('weight') or getattr(self.instance, 'weight', None)
        if current is not None:
            key = f'{float(current):.2f}'
            if key not in dict(HEIGHTS):
                self.fields['weight'].choices = [*HEIGHTS, (key, f'{float(current):g}')]
            self.initial['weight'] = key
        # A notice is a column of steps: one cell, never two. A board has no
        # steps and no write-on boxes. Neither product should be shown the
        # other's controls.
        if kind == 'fireaction':
            del self.fields['cells']
        else:
            del self.fields['is_step']
            del self.fields['has_write_on']
        _bootstrap(self.fields)

    def clean_colour(self):
        return (self.cleaned_data.get('colour') or '').strip() or None

    def save(self, commit=True):
        row = super().save(commit=False)
        if self.kind == 'fireaction':
            row.cells = 1
        if commit:
            row.save()
        return row


class NewRowForm(RowForm):
    """A row being created: `code` is asked for once and never again."""

    code = forms.SlugField(
        max_length=64,
        help_text='Short name a saved design refers to, e.g. fa-no-lifts. It cannot be '
                  'changed later without changing what old designs mean.',
    )

    class Meta(RowForm.Meta):
        fields = ['group', 'code', 'label', 'colour', 'cells', 'weight',
                  'is_step', 'has_write_on', 'sort_order', 'status']

    def clean_code(self):
        code = self.cleaned_data['code'].strip().lower()
        if OcTsgBespokeRow.objects.filter(code=code).exists():
            raise forms.ValidationError('A row already uses that code.')
        return code


class RowLineForm(forms.ModelForm):
    class Meta:
        model = OcTsgBespokeRowLine
        fields = ['text', 'style', 'caps', 'bold', 'align', 'min_height', 'sort_order']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['text'].widget.attrs['placeholder'] = 'Wording on this line'
        self.fields['style'].choices = [
            ('title', 'Large'), ('body', 'Normal'), ('footer', 'Small print')]
        self.fields['caps'].label = 'CAPITALS'
        self.fields['min_height'].label = 'May shrink to (mm)'
        _bootstrap(self.fields)


class SymbolSelect(forms.Select):
    """A symbol dropdown that carries each symbol's artwork with it.

    The code alone tells you nothing: nobody remembers that M004 is eye
    protection and M009 is gloves. Every option gets the path to its own SVG so
    the page can show the symbol you are actually choosing.
    """

    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):
        option = super().create_option(name, value, label, selected, index, subindex, attrs)
        instance = getattr(value, 'instance', None)
        if instance is not None:
            option['attrs']['data-img'] = instance.symbol_image_url
        return option


class SymbolChoiceField(forms.ModelChoiceField):
    """Symbols listed by their ISO code, which is how the rows name them.

    The field holds the ARTWORK (oc_tsg_symbols); the code lives on the
    standard, so it is annotated on rather than read per row.
    """

    def label_from_instance(self, obj):
        code = getattr(obj, 'iso_code', None)
        return f'{code} — {obj.referent}' if code and obj.referent else (code or f'Symbol {obj.pk}')


class RowSymbolForm(forms.ModelForm):
    symbol = SymbolChoiceField(
        queryset=OcTsgSymbols.objects.none(), required=False, widget=SymbolSelect)

    class Meta:
        model = OcTsgBespokeRowSymbol
        fields = ['symbol', 'sort_order']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Only artwork that carries a live standard, so the picker cannot offer
        # a symbol the designer would then fail to name.
        self.fields['symbol'].queryset = (
            OcTsgSymbols.objects
            .filter(octsgsymbolstandard__status=True)
            .annotate(iso_code=Min('octsgsymbolstandard__code'))
            .order_by('iso_code')
            .distinct()
        )
        _bootstrap(self.fields)


RowLineFormSet = inlineformset_factory(
    OcTsgBespokeRow, OcTsgBespokeRowLine, form=RowLineForm, extra=1, can_delete=True,
)

RowSymbolFormSet = inlineformset_factory(
    OcTsgBespokeRow, OcTsgBespokeRowSymbol, form=RowSymbolForm, extra=1, can_delete=True,
    max_num=2,
)


class BoardForm(forms.ModelForm):
    """A ready-made sign: a board, or a printed notice."""

    class Meta:
        model = OcTsgBespokeBoard
        fields = ['kind', 'code', 'title', 'hint', 'width', 'height',
                  'numbered', 'sort_order', 'status']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            # Same reason as a row's code: saved designs and the shop refer to it.
            self.fields['code'].disabled = True
        _bootstrap(self.fields)

    def clean(self):
        data = super().clean()
        if data.get('kind') == 'fireaction' and not (data.get('width') and data.get('height')):
            raise forms.ValidationError(
                'A notice is drawn at the size it is printed at, so it needs a width and a height.'
            )
        return data


class BoardRowForm(forms.ModelForm):
    class Meta:
        model = OcTsgBespokeBoardRow
        fields = ['row_left', 'row_right', 'weight', 'sort_order']

    def __init__(self, *args, kind='board', **kwargs):
        super().__init__(*args, **kwargs)
        rows = OcTsgBespokeRow.objects.filter(group__kind=kind, status=True).order_by(
            'group__sort_order', 'sort_order')
        for name in ('row_left', 'row_right'):
            self.fields[name].queryset = rows
        self.fields['row_right'].required = False
        # A notice is never two cells wide.
        if kind == 'fireaction':
            del self.fields['row_right']
        _bootstrap(self.fields)

    def save(self, commit=True):
        line = super().save(commit=False)
        line.cells = 2 if getattr(line, 'row_right_id', None) else 1
        if commit:
            line.save()
        return line


def board_row_formset(kind):
    """The rows of a ready-made sign, offering only rows of its own kind."""

    class _Form(BoardRowForm):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, kind=kind, **kwargs)

    return inlineformset_factory(
        OcTsgBespokeBoard, OcTsgBespokeBoardRow, form=_Form,
        fk_name='board', extra=1, can_delete=True,
    )


KIND_LABELS = dict(KINDS)
