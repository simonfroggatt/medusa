"""Choices for the "make your own" fields on a category (symbol and designer template). Read-only lookups."""
from django.db import connection

# Designer templates a category can point at directly. Anything symbol-driven goes through a symbol instead, and
# the wayfinding configurators are not an offer for a category page. Keep in step with ModelTsgCategoryBespoke.
TEMPLATE_PATHS = ('bespoke/designer_fireaction', 'bespoke/designer_board', 'bespoke/designer_bilingual', 'bespoke/colour_panel')


def symbol_options():
    """Every symbol the designer can open with: [(symbol_id, standard code, name, svg path)], by code.
    A symbol with no code cannot be passed to the designer, so it is left out."""
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT s.id, MIN(ss.code), s.referent, s.svg_path
                 FROM oc_tsg_symbols s
                 JOIN oc_tsg_symbol_standard ss ON ss.symbol_id = s.id AND ss.status = 1
                      AND ss.code IS NOT NULL AND ss.code <> ''
                GROUP BY s.id, s.referent, s.svg_path
                ORDER BY MIN(ss.code)""")
        return [(sid, code, (name or '').strip(), svg or '') for sid, code, name, svg in cursor.fetchall()]


def template_options():
    """Designer templates that have a live product to open: [(template_id, "Template - product name")]."""
    placeholders = ', '.join(['%s'] * len(TEMPLATE_PATHS))
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT t.id, t.title, MIN(pdb.title)
                 FROM oc_tsg_bespoke_templates t
                 JOIN oc_product p ON p.bespoke_template_id = t.id AND p.status = 1
                 JOIN oc_product_description_base pdb ON pdb.product_id = p.product_id
                WHERE t.path IN (""" + placeholders + """)
                GROUP BY t.id, t.title
                ORDER BY t.title""", list(TEMPLATE_PATHS))
        return [(tid, '%s — %s' % (title.strip(), (product or '').strip())) for tid, title, product in cursor.fetchall()]
