

def create_bulk_arrays(qs_bulk):
    all_bulk_group = []
    for bulk_groups in qs_bulk.iterator():
        bulk_group = { 'name': bulk_groups.group_name, 'id': bulk_groups.bulk_group_id }
        group_breaks = list(bulk_groups.discountgroup.all().values())
        bulk_group['breaks'] = group_breaks
        all_bulk_group.append(bulk_group)

    return all_bulk_group

