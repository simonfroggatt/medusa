"""The "make your own" offer on category pages: work out, for every shop category, what it would show.

A category uses its own oc_tsg_category_bespoke row, else its parent's, else its grandparent's. A row with no
bespoke product means "no offer here" and stops inheriting. Pure functions here; the view feeds them rows.
"""
MAX_DEPTH = 8

OFFER = 'offer'              # on, with a landing product
DRAFT = 'draft'              # a landing product is chosen but the row is switched off
NONE = 'none'                # explicit "no offer here"
UNMAPPED = 'unmapped'        # nothing set anywhere up the tree: shows nothing


def resolve(category_id, rules, parents):
    """rules: {category_id: row}, parents: {category_id: parent_id or None}.
    Returns (kind, row, inherited_from_category_id or None)."""
    seen = set()
    current, hops = category_id, 0
    while current is not None and current not in seen and hops <= MAX_DEPTH:
        seen.add(current)
        row = rules.get(current)
        if row is not None:
            if row.bespoke_product_id is None:
                kind = NONE
            else:
                kind = OFFER if row.status else DRAFT
            return kind, row, (None if current == category_id else current)
        current = parents.get(current)
        hops += 1
    return UNMAPPED, None, None


def tree_rows(categories, rules, parents):
    """categories: [(id, name, parent_id)] in display order. Returns one dict per category with its effective offer."""
    by_parent = {}
    for cid, name, parent in categories:
        by_parent.setdefault(parent, []).append((cid, name, parent))
    ordered = []

    def walk(parent, depth):
        for cid, name, par in by_parent.get(parent, []):
            kind, row, inherited_from = resolve(cid, rules, parents)
            ordered.append({'id': cid, 'name': name, 'depth': depth, 'kind': kind, 'rule': rules.get(cid),
                            'effective': row, 'inherited_from': inherited_from})
            walk(cid, depth + 1)
    walk(None, 0)
    return ordered


def category_choices(categories, taken=()):
    """[(id, "Parent > Child")] for a dropdown, sorted by that path, leaving out categories that already have a row.
    Many sub-categories share a name ("General Signs" x8), so the parent has to be in the label."""
    names = {cid: name for cid, name, _ in categories}
    parents = {cid: parent for cid, _, parent in categories}
    choices = []
    for cid, name, _ in categories:
        if cid in taken:
            continue
        path, current, hops, seen = [], cid, 0, set()
        while current is not None and current in names and current not in seen and hops <= MAX_DEPTH:
            seen.add(current)
            path.append(names[current])
            current = parents.get(current)
            hops += 1
        choices.append((cid, ' \u203a '.join(reversed(path))))
    return sorted(choices, key=lambda choice: choice[1].lower())


def load_categories(store_id):
    """Active shop categories of one store as [(id, name, parent_id)] in menu order, and {id: parent_id}."""
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT cat.id, cat.name, par.parent_id
                 FROM oc_tsg_category cat
                 JOIN oc_tsg_category_parent par ON par.category_id = cat.id AND par.status = 1
                WHERE cat.store_id = %s AND cat.status = 1
                ORDER BY par.sort_order, cat.name""", [store_id])
        rows = cursor.fetchall()
    seen, categories = set(), []
    for cid, name, parent in rows:           # a category can sit under more than one parent: keep the first
        if cid not in seen:
            seen.add(cid)
            categories.append((cid, name or 'Category %s' % cid, parent))
    return categories, {cid: parent for cid, _, parent in categories}


def designer_products():
    """The designer products an offer can open: [(product_id, title)].
    Picked by their designer template, not the is_bespoke flag (several designers don't carry it);
    the stock-sign rebuilds (single_panel) and ordinary products are left out."""
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT p.product_id, TRIM(pdb.title)
                 FROM oc_product p
                 JOIN oc_tsg_bespoke_templates t ON t.id = p.bespoke_template_id
                 JOIN oc_product_description_base pdb ON pdb.product_id = p.product_id
                WHERE p.status = 1
                  AND t.path LIKE 'bespoke/%%'
                  AND t.path <> 'bespoke/single_panel'
                ORDER BY pdb.title""")
        return [(pid, title) for pid, title in cursor.fetchall()]
