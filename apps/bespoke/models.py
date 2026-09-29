from django.db import models

# Create your models here.


class OcTsgBespokeDesigns(models.Model):
    """A sign drawn in Medusa that belongs to nobody yet.

    Table created by sql/2026-09-24_bespoke_designs.sql. Every other design in
    the system hangs off a product, a basket line or an order line; these are
    free-standing — worked up for a customer who rang, or tried out before
    quoting.
    """
    KINDS = {
        'standard': 'Basic / Advanced',
        'bilingual': 'Two languages',
        'board': 'Site safety board',
        'roadsign': 'Temporary site sign',
    }

    design_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=160, blank=True, default='')
    kind = models.CharField(max_length=20, default='standard')
    design = models.TextField(blank=True, null=True)
    svg_raw = models.TextField(blank=True, null=True)
    svg_export = models.BinaryField(blank=True, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    height = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    order_product_id = models.IntegerField(blank=True, null=True)
    created_by_id = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_designs'
        ordering = ['-updated_at']

    @property
    def kind_label(self):
        return self.KINDS.get(self.kind, self.kind)

    @property
    def size_label(self):
        if self.width and self.height:
            return f'{self.width:.0f} × {self.height:.0f} mm'
        return ''

    def __str__(self):
        return self.name or f'Design {self.pk}'


# ---------------------------------------------------------------------------
# Standard rows for the board and notice designers
#
# Tables created by sql/2026-09-28_bespoke_board_rows.sql and extended by
# sql/2026-09-28_bespoke_fire_action_rows.sql. Unmanaged, like everything else
# that lives in the shared OpenCart database, so the shop's PHP can read them
# too: the SQL files are the schema, Django only reads and writes rows.
#
# A row is a band on a sign -- a symbol beside a message. The same shape serves
# both products, told apart by `kind`:
#
#   board       a site safety board. Bands may be split into two cells.
#   fireaction  a fire action notice. One cell always, and a band may be a
#               numbered step or carry a box to write in.
# ---------------------------------------------------------------------------


KINDS = (
    ('board', 'Site safety board'),
    ('fireaction', 'Fire action notice'),
)


class OcTsgBespokeRowGroup(models.Model):
    """A heading in the designer's row picker.

    Headings belong to one product: a board offers Headers / Site rules / PPE /
    Warnings / Prohibitions, a notice offers Header / Raise the alarm / Leave /
    Assemble / Do not. A title only has to be unique within its own kind.
    """
    group_id = models.AutoField(primary_key=True)
    kind = models.CharField(max_length=16, choices=KINDS, default='board')
    title = models.CharField(max_length=64)
    sort_order = models.IntegerField(default=0)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_row_group'
        ordering = ['kind', 'sort_order', 'title']
        unique_together = (('kind', 'title'),)

    def __str__(self):
        return self.title


class OcTsgBespokeRow(models.Model):
    """One standard band: a colour, its wording and its symbols.

    `code` is what a saved design refers to, so a row that is no longer offered
    is retired with `status` rather than deleted -- otherwise every design that
    used it loses its meaning.

    `weight` is how tall the band stands against the others, and the notice
    designer deliberately ignores it for a band that has a symbol beside
    wording: the plate behind the symbol is a square cut from the band's
    height, so an odd weight gives an odd plate and the symbols stop lining up
    down the left of the sign. It is read for bands with no symbol, or no
    wording, where there is no column to keep.
    """
    STYLES = (('title', 'Title'), ('body', 'Body'), ('footer', 'Small print'))

    row_id = models.AutoField(primary_key=True)
    group = models.ForeignKey(OcTsgBespokeRowGroup, models.DO_NOTHING, db_column='group_id',
                              related_name='rows')
    code = models.CharField(max_length=64, unique=True)
    label = models.CharField(max_length=128, help_text='What the picker shows')
    colour = models.CharField(max_length=32, blank=True, null=True,
                              help_text="Category key, 'plain', or blank to follow the symbol")
    cells = models.SmallIntegerField(default=1, help_text='1 or 2; a notice is always 1')
    weight = models.DecimalField(max_digits=3, decimal_places=2, default=1,
                                 help_text='Height against the other bands')
    is_step = models.BooleanField(default=False, verbose_name='Numbered step',
                                  help_text='Notices only. The number itself comes from where the '
                                            'band sits, so it is never stored.')
    has_write_on = models.BooleanField(default=False, verbose_name='Box to write in',
                                       help_text='Notices only. Empty it is somewhere to put a pen; '
                                                 'typed in, it is the same box printed.')
    sort_order = models.IntegerField(default=0)
    status = models.BooleanField(default=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_row'
        ordering = ['sort_order', 'label']

    @property
    def kind(self):
        return self.group.kind

    def __str__(self):
        return self.label


class OcTsgBespokeRowLine(models.Model):
    """A line of wording on a standard band.

    A band may have none at all: the mandatory circle above the title of a
    5PFAN is a symbol standing on its own.
    """
    line_id = models.AutoField(primary_key=True)
    row = models.ForeignKey(OcTsgBespokeRow, models.DO_NOTHING, db_column='row_id',
                            related_name='lines')
    sort_order = models.IntegerField(default=0)
    text = models.CharField(max_length=255)
    style = models.CharField(max_length=16, choices=OcTsgBespokeRow.STYLES, default='body')
    caps = models.BooleanField(default=False, verbose_name='Capitals')
    bold = models.BooleanField(default=True)
    # Relative, so it survives the row being drawn at any size on any sign --
    # which is why a row may carry it while a fixed letter height may not.
    align = models.CharField(
        max_length=8, default='centre', verbose_name='Sits against',
        choices=(('left', 'Left'), ('centre', 'Centre'), ('right', 'Right')))
    min_height = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True,
                                     verbose_name='Smallest letter height (mm)',
                                     help_text='Small print may shrink this far')

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_row_line'
        ordering = ['sort_order', 'line_id']

    def __str__(self):
        return self.text


class OcTsgBespokeRowSymbol(models.Model):
    """The symbol on a standard band.

    A band may have none: a notice's title band runs the full width because the
    circle above it is its own band.
    """
    row = models.ForeignKey(OcTsgBespokeRow, models.DO_NOTHING, db_column='row_id',
                            related_name='symbols')
    # The ARTWORK (oc_tsg_symbols), not the standard. That is what the designer
    # identifies a symbol by, and what the symbol feed hands it as `symbol_id`.
    # The ISO code lives on the standard, which is one join further out.
    symbol = models.ForeignKey('symbols.OcTsgSymbols', models.DO_NOTHING,
                               db_column='symbol_id')
    sort_order = models.IntegerField(default=0)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_row_symbol'
        ordering = ['sort_order', 'id']
        unique_together = (('row', 'symbol'),)

    @property
    def code(self):
        """The ISO code, e.g. M001 — what the rows are written in terms of."""
        standard = self.symbol.octsgsymbolstandard_set.filter(status=True).first()
        return standard.code if standard and standard.code else ''

    def __str__(self):
        return self.code or f'Symbol {self.symbol_id}'


class OcTsgBespokeBoard(models.Model):
    """A ready-made sign: an ordered list of standard rows.

    Boards are drawn at whatever size the customer picked, so `width` and
    `height` are blank for them. A notice is drawn at the size it is printed
    at, and says whether its steps are numbered -- the printed 5PFAN does not
    number its five.
    """
    board_id = models.AutoField(primary_key=True)
    kind = models.CharField(max_length=16, choices=KINDS, default='board')
    code = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=128)
    hint = models.CharField(max_length=255, blank=True, null=True,
                            help_text='The one line under the button')
    width = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                verbose_name='Width (mm)', help_text='Notices only')
    height = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                 verbose_name='Height (mm)', help_text='Notices only')
    numbered = models.BooleanField(default=True, verbose_name='Number the steps',
                                   help_text='Notices only')
    sort_order = models.IntegerField(default=0)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_board'
        ordering = ['kind', 'sort_order', 'title']

    @property
    def size_label(self):
        if self.width and self.height:
            return f'{self.width:.0f} × {self.height:.0f} mm'
        return ''

    def __str__(self):
        return self.title


class OcTsgBespokeBoardRow(models.Model):
    """One line of a ready-made sign: a standard row, or two side by side.

    Two only ever happens on a board. A notice is a column of steps, and half a
    step is not a thing anyone orders.
    """
    board = models.ForeignKey(OcTsgBespokeBoard, models.DO_NOTHING, db_column='board_id',
                              related_name='board_rows')
    sort_order = models.IntegerField(default=0)
    cells = models.SmallIntegerField(default=1)
    weight = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True,
                                 help_text="Overrides the row's own height")
    row_left = models.ForeignKey(OcTsgBespokeRow, models.DO_NOTHING, db_column='row_id_left',
                                 related_name='+')
    row_right = models.ForeignKey(OcTsgBespokeRow, models.DO_NOTHING, db_column='row_id_right',
                                  related_name='+', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oc_tsg_bespoke_board_row'
        ordering = ['sort_order', 'id']

    def __str__(self):
        if self.row_right_id:
            return f'{self.row_left} | {self.row_right}'
        return str(self.row_left)
