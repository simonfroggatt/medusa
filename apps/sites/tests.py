from django.test import TestCase

# Create your tests here.


# ---- Search Terms report -------------------------------------------------
from datetime import datetime, timezone as dt_timezone
from types import SimpleNamespace
from unittest import mock

from django.db.utils import ProgrammingError
from django.template.loader import render_to_string
from django.test import RequestFactory, SimpleTestCase

from apps.sites import search_terms, views


class SearchTermsFilterTests(SimpleTestCase):
    def test_defaults(self):
        self.assertEqual(search_terms.parse_filters({}), (0, 30))

    def test_valid_values(self):
        self.assertEqual(search_terms.parse_filters({'site': '1', 'days': '7'}), (1, 7))
        self.assertEqual(search_terms.parse_filters({'site': '3', 'days': '0'}), (3, 0))

    def test_junk_falls_back_instead_of_erroring(self):
        self.assertEqual(search_terms.parse_filters({'site': 'x', 'days': 'y'}), (0, 30))
        self.assertEqual(search_terms.parse_filters({'site': '-4', 'days': '11'}), (0, 30))

    def test_percent(self):
        self.assertEqual(search_terms.percent(1, 4), 25.0)
        self.assertEqual(search_terms.percent(0, 0), 0.0)


def sample_report(**overrides):
    when = datetime(2026, 10, 9, 10, 30, tzinfo=dt_timezone.utc)
    report = {
        'total': 12, 'people': 5, 'no_results_total': 3, 'no_results_pct': 25.0, 'avg_ms': 140,
        'top': [{'term': 'fire exit', 'searches': 7, 'people': 4, 'avg_results': 43.0, 'last_searched': when}],
        'no_results': [{'term': 'extinguiser', 'searches': 3, 'people': 2, 'avg_results': 0.0, 'last_searched': when}],
    }
    report.update(overrides)
    return report


class SearchTermsViewTests(SimpleTestCase):
    def render(self, report, **extra):
        context = {'pageview': 'Search Terms', 'heading': 'Search Terms', 'site_id': 1, 'days': 30,
                   'periods': search_terms.PERIODS, 'stores': [(1, 'Safety Signs and Notices')],
                   'report': report}
        context.update(extra)
        request = RequestFactory().get('/sites/search-terms/')
        request.user = SimpleNamespace(
            is_authenticated=True, is_superuser=True, username='test', first_name='Test', last_name='User',
            groups=SimpleNamespace(all=lambda: SimpleNamespace(values_list=lambda *a, **k: ['superuser'])))
        # 'request' in the context (not request=) so the DB-backed context processors don't run
        context['request'] = request
        context['user'] = request.user
        context['js_version'] = 'test'
        return render_to_string('sites/search_terms.html', context)

    def test_renders_terms_and_summary(self):
        html = self.render(sample_report())
        self.assertIn('fire exit', html)
        self.assertIn('extinguiser', html)
        self.assertIn('25.0%', html)
        self.assertIn('140 ms', html)

    def test_selected_store_and_period(self):
        html = self.render(sample_report())
        self.assertIn('value="1" selected', html)
        self.assertIn('value="30" selected', html)

    def test_empty_period_explains_itself(self):
        html = self.render(sample_report(total=0, people=0, no_results_total=0, no_results_pct=0.0,
                                         avg_ms=None, top=[], no_results=[]))
        self.assertIn('No searches recorded', html)

    def test_search_text_is_escaped(self):
        report = sample_report()
        report['top'][0]['term'] = '<script>alert(1)</script>'
        html = self.render(report)
        self.assertNotIn('<script>alert(1)</script>', html)
        self.assertIn('&lt;script&gt;', html)

    def test_missing_table_shows_a_message_not_a_500(self):
        request = RequestFactory().get('/sites/search-terms/')
        request.user = SimpleNamespace(is_authenticated=True, is_superuser=True,
                                       groups=SimpleNamespace(filter=lambda **kw: []))
        missing = ProgrammingError(1146, "Table 'x.oc_tsg_customer_intent' doesn't exist")
        with mock.patch.object(search_terms, 'build_report', side_effect=missing), \
                mock.patch.object(search_terms, 'store_choices', return_value=[]), \
                mock.patch.object(views, 'render', return_value=mock.sentinel.response) as render:
            views.search_terms_report(request)
        context = render.call_args[0][2]
        self.assertTrue(context['table_missing'])
        self.assertNotIn('report', context)

    def test_other_database_errors_still_raise(self):
        request = RequestFactory().get('/sites/search-terms/')
        request.user = SimpleNamespace(is_authenticated=True, is_superuser=True,
                                       groups=SimpleNamespace(filter=lambda **kw: []))
        with mock.patch.object(search_terms, 'build_report', side_effect=ProgrammingError(1064, 'syntax')), \
                mock.patch.object(search_terms, 'store_choices', return_value=[]):
            with self.assertRaises(ProgrammingError):
                views.search_terms_report(request)

    def test_missing_table_message_names_the_sql_file(self):
        html = self.render(None, table_missing=True)
        self.assertIn('customer_intent_tables.sql', html)

    def test_view_passes_filters_to_report(self):
        request = RequestFactory().get('/sites/search-terms/', {'site': '2', 'days': '7'})
        user = SimpleNamespace(is_authenticated=True, is_superuser=True,
                               groups=SimpleNamespace(filter=lambda **kw: []))
        request.user = user
        with mock.patch.object(search_terms, 'build_report', return_value=sample_report()) as build, \
                mock.patch.object(search_terms, 'store_choices', return_value=[(2, 'Highway Safety Shop')]), \
                mock.patch.object(views, 'render', return_value=mock.sentinel.response) as render:
            response = views.search_terms_report(request)
        build.assert_called_once_with(2, 7)
        self.assertIs(response, mock.sentinel.response)
        self.assertEqual(render.call_args[0][2]['days'], 7)


# ---- Search Rules --------------------------------------------------------
from apps.sites.forms import SearchRuleForm
from apps.sites.models import OcTsgSearchRule


def fake_request(path='/sites/search-rules/', method='get', data=None):
    factory = RequestFactory()
    request = getattr(factory, method)(path, data or {})
    request.user = SimpleNamespace(
        is_authenticated=True, is_superuser=True, username='test', first_name='Test', last_name='User',
        groups=SimpleNamespace(all=lambda: SimpleNamespace(values_list=lambda *a, **k: ['superuser']),
                               filter=lambda **kw: SimpleNamespace(exists=lambda: True)))
    return request


def render_page(template, request, **context):
    # 'request' in the context (not request=) so the DB-backed context processors don't run
    context.update({'request': request, 'user': request.user, 'js_version': 'test'})
    return render_to_string(template, context)


def make_rule(**fields):
    values = dict(rule_id=1, store_id=0, rule_type='demote_only', label='NHS signs',
                  category_patterns='NHS Signs\n\n  Hospital%  ', trigger_words='nhs, hospital ,,htm',
                  penalty=400, status=True)
    values.update(fields)
    rule = OcTsgSearchRule(**values)
    rule.store_name = 'All stores'
    return rule


class SearchRuleModelTests(SimpleTestCase):
    def test_patterns_and_words_are_split_and_trimmed(self):
        rule = make_rule()
        self.assertEqual(rule.patterns_list, ['NHS Signs', 'Hospital%'])
        self.assertEqual(rule.words_list, ['nhs', 'hospital', 'htm'])

    def test_empty_fields_give_empty_lists(self):
        rule = make_rule(category_patterns=None, trigger_words=None)
        self.assertEqual(rule.patterns_list, [])
        self.assertEqual(rule.words_list, [])


    def test_save_stamps_dates_from_the_database_clock(self):
        from django.db.models.functions import Now
        rule = OcTsgSearchRule(store_id=0, rule_type='ignore_word', label='x', trigger_words='sign')
        with mock.patch('django.db.models.Model.save') as save:
            rule.save()
        save.assert_called_once()
        self.assertIsInstance(rule.date_added, Now)
        self.assertIsInstance(rule.date_modified, Now)

    def test_editing_keeps_date_added_but_moves_date_modified(self):
        from django.db.models.functions import Now
        rule = make_rule()
        rule._state.adding = False
        rule.date_added = datetime(2026, 1, 1, tzinfo=dt_timezone.utc)
        with mock.patch('django.db.models.Model.save'):
            rule.save()
        self.assertEqual(rule.date_added.year, 2026)
        self.assertIsInstance(rule.date_modified, Now)


class SearchRuleFormTests(SimpleTestCase):
    def form(self, **overrides):
        data = {'store_id': '0', 'rule_type': 'demote_any', 'label': 'Prestige', 'category_patterns': 'Prestige%',
                'trigger_words': 'prestige', 'penalty': '300', 'status': 'on'}
        data.update(overrides)
        with mock.patch('apps.sites.forms.OcStore.objects') as stores:
            stores.filter.return_value.order_by.return_value.values_list.return_value = [(1, 'Safety Signs and Notices')]
            return SearchRuleForm(data)

    def test_valid_rule(self):
        form = self.form()
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['store_id'], 0)

    def test_store_choice_is_an_int(self):
        form = self.form(store_id='1')
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['store_id'], 1)

    def test_push_down_rule_needs_categories(self):
        form = self.form(category_patterns='  ')
        self.assertFalse(form.is_valid())
        self.assertIn('category_patterns', form.errors)

    def test_ignore_rule_needs_words_but_not_categories(self):
        self.assertFalse(self.form(rule_type='ignore_word', category_patterns='', trigger_words='').is_valid())
        ok = self.form(rule_type='ignore_word', category_patterns='', trigger_words='sign, notice')
        self.assertTrue(ok.is_valid(), ok.errors)

    def test_unknown_store_is_rejected(self):
        self.assertFalse(self.form(store_id='99').is_valid())


class SearchRulePageTests(SimpleTestCase):
    def test_list_shows_rules(self):
        html = render_page('sites/search_rules.html', fake_request(), rules=[make_rule()], table_missing=False)
        self.assertIn('NHS signs', html)
        self.assertIn('Hospital%', html)
        self.assertIn('nhs, hospital, htm', html)
        self.assertIn('/sites/search-rules/1/edit', html)
        self.assertIn('/sites/search-rules/1/delete', html)

    def test_list_escapes_rule_text(self):
        html = render_page('sites/search_rules.html', fake_request(),
                           rules=[make_rule(label='<img src=x onerror=alert(1)>')], table_missing=False)
        self.assertNotIn('<img src=x', html)

    def test_list_names_the_sql_file_when_the_table_is_missing(self):
        html = render_page('sites/search_rules.html', fake_request(), rules=[], table_missing=True)
        self.assertIn('2026-10-09_search_rules.sql', html)
        self.assertNotIn('New Rule', html)

    def test_view_survives_a_missing_table(self):
        missing = ProgrammingError(1146, "Table 'x.oc_tsg_search_rule' doesn't exist")
        with mock.patch.object(views.OcTsgSearchRule, 'objects') as objects, \
                mock.patch.object(views.OcStore, 'objects') as stores, \
                mock.patch.object(views, 'render', return_value=mock.sentinel.response) as render:
            stores.filter.return_value.values_list.return_value = []
            objects.order_by.side_effect = missing
            views.search_rules_list(fake_request())
        self.assertTrue(render.call_args[0][2]['table_missing'])

    def test_form_page_renders(self):
        with mock.patch('apps.sites.forms.OcStore.objects') as stores:
            stores.filter.return_value.order_by.return_value.values_list.return_value = []
            form = SearchRuleForm(instance=make_rule())
        html = render_page('sites/search_rule_form.html', fake_request(), form=form)
        self.assertIn('NHS signs', html)
        self.assertIn('Categories', html)

    def test_delete_refuses_get(self):
        with mock.patch.object(views, 'get_object_or_404') as lookup:
            response = views.search_rule_delete(fake_request('/sites/search-rules/1/delete'), 1)
        self.assertEqual(response.status_code, 405)
        lookup.assert_not_called()

    def test_delete_post_deletes_and_redirects(self):
        rule = mock.Mock()
        request = fake_request('/sites/search-rules/1/delete', method='post')
        with mock.patch.object(views, 'get_object_or_404', return_value=rule), \
                mock.patch.object(views, 'messages'):
            response = views.search_rule_delete(request, 1)
        rule.delete.assert_called_once()
        self.assertEqual(response.status_code, 302)


# ---- Banners -------------------------------------------------------------
from datetime import date, timedelta

from apps.sites.forms import BannerForm
from apps.sites.models import OcTsgBanner


def make_banner(**fields):
    values = dict(banner_id=1, store_id=4, status=True, sort_order=1, title='Trade Accounts Available',
                  tag='Maritime Resellers', link='/index.php?route=account/register', button_text='Request Account',
                  button_style='solid', bg_from='#0B2545', bg_to='#3D5A80')
    values.update(fields)
    banner = OcTsgBanner(**values)
    banner.store_name = 'Imo signs'
    return banner


class BannerModelTests(SimpleTestCase):
    def test_showing_now_follows_status_and_dates(self):
        today = date.today()
        self.assertTrue(make_banner().showing_now)
        self.assertFalse(make_banner(status=False).showing_now)
        self.assertTrue(make_banner(date_start=today, date_end=today).showing_now)
        self.assertFalse(make_banner(date_start=today + timedelta(days=1)).showing_now)
        self.assertFalse(make_banner(date_end=today - timedelta(days=1)).showing_now)

    def test_save_stamps_dates_from_the_database_clock(self):
        from django.db.models.functions import Now
        banner = make_banner()
        with mock.patch('django.db.models.Model.save'):
            banner.save()
        self.assertIsInstance(banner.date_added, Now)
        self.assertIsInstance(banner.date_modified, Now)

    def test_text_defaults_to_centre(self):
        self.assertEqual(OcTsgBanner().text_align, 'center')
        self.assertEqual([value for value, _ in OcTsgBanner.TEXT_ALIGNS], ['left', 'center', 'right'])

    def test_str_falls_back_when_there_is_no_heading(self):
        self.assertEqual(str(make_banner(title='')), 'Banner 1')
        self.assertEqual(str(make_banner(title='', alt_text='Spring sale')), 'Spring sale')


class BannerFormTests(SimpleTestCase):
    def form(self, **overrides):
        data = {'store_id': '4', 'status': 'on', 'sort_order': '1', 'title': 'Hello', 'button_style': 'outline',
                'text_align': 'center', 'bg_from': '#0B2545', 'bg_to': '#1a3a5c'}
        data.update(overrides)
        with mock.patch('apps.sites.forms.OcStore.objects') as stores:
            stores.filter.return_value.order_by.return_value.values_list.return_value = [(1, 'SSAN'), (4, 'Imo signs')]
            return BannerForm(data)

    def test_text_only_banner_is_valid(self):
        form = self.form(text_align='left')
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['store_id'], 4)
        self.assertEqual(form.cleaned_data['text_align'], 'left')

    def test_text_position_must_be_left_centre_or_right(self):
        self.assertFalse(self.form(text_align='diagonal').is_valid())

    def test_needs_an_image_or_a_heading(self):
        form = self.form(title='  ')
        self.assertFalse(form.is_valid())
        self.assertIn('image, a heading', str(form.non_field_errors()))

    def test_end_date_cannot_precede_start(self):
        form = self.form(date_start='2026-12-25', date_end='2026-12-01')
        self.assertFalse(form.is_valid())
        self.assertIn('date_end', form.errors)

    def test_dates_are_optional(self):
        self.assertTrue(self.form(date_start='', date_end='').is_valid())

    def test_unknown_store_is_rejected(self):
        self.assertFalse(self.form(store_id='99').is_valid())

    def test_colours_must_be_six_digit_hex_and_are_normalised(self):
        ok = self.form(bg_from='#14532d', bg_to='#1c1f23')
        self.assertTrue(ok.is_valid(), ok.errors)
        self.assertEqual(ok.cleaned_data['bg_from'], '#14532D')
        for bad in ('red', '#12', '14532d', '#GGGGGG', ''):
            form = self.form(bg_from=bad)
            self.assertFalse(form.is_valid(), bad)
            self.assertIn('bg_from', form.errors)

    def test_colour_field_renders_a_swatch_and_a_hex_box(self):
        with mock.patch('apps.sites.forms.OcStore.objects') as stores:
            stores.filter.return_value.order_by.return_value.values_list.return_value = [(4, 'Imo signs')]
            form = BannerForm(instance=make_banner(bg_from='#0B2545'))
        html = str(form['bg_from'])
        self.assertIn('type="color"', html)
        self.assertIn('name="bg_from"', html)
        self.assertIn('value="#0B2545"', html)
        self.assertEqual(html.count('name="bg_from"'), 1)


class BannerPageTests(SimpleTestCase):
    def test_list_shows_banners(self):
        html = render_page('sites/banners.html', fake_request('/sites/banners/'), banners=[make_banner()],
                           stores=[(4, 'Imo signs')], site_id=0, table_missing=False)
        self.assertIn('Trade Accounts Available', html)
        self.assertIn('Maritime Resellers', html)
        self.assertIn('/sites/banners/1/edit', html)
        self.assertIn('/sites/banners/1/delete', html)
        self.assertIn('Always', html)

    def test_list_builds_the_image_address_from_the_media_prefix(self):
        banner = make_banner(image='stores/banners/lss-banner.jpg')
        html = render_page('sites/banners.html', fake_request('/sites/banners/'), banners=[banner],
                           stores=[], site_id=0, table_missing=False)
        self.assertIn('stores/banners/lss-banner.jpg', html)
        self.assertNotIn('https//https', html)

    def test_form_shows_a_thumbnail_and_a_remove_box_for_the_current_image(self):
        with mock.patch('apps.sites.forms.OcStore.objects') as stores:
            stores.filter.return_value.order_by.return_value.values_list.return_value = [(4, 'Imo signs')]
            form = BannerForm(instance=make_banner(image='stores/banners/lss-banner.jpg'))
        html = render_page('sites/banner_form.html', fake_request('/sites/banners/1/edit'), form=form)
        self.assertIn('stores/banners/lss-banner.jpg', html)
        self.assertIn('name="image-clear"', html)
        self.assertNotIn('https//https', html)

    def test_list_marks_a_banner_outside_its_dates(self):
        banner = make_banner(date_end=date.today() - timedelta(days=3))
        html = render_page('sites/banners.html', fake_request('/sites/banners/'), banners=[banner],
                           stores=[], site_id=0, table_missing=False)
        self.assertIn('outside dates', html)

    def test_list_escapes_text(self):
        html = render_page('sites/banners.html', fake_request('/sites/banners/'),
                           banners=[make_banner(title='<img src=x onerror=alert(1)>')],
                           stores=[], site_id=0, table_missing=False)
        self.assertNotIn('<img src=x', html)

    def test_list_asks_for_the_text_align_update_when_the_column_is_missing(self):
        html = render_page('sites/banners.html', fake_request('/sites/banners/'), banners=[], stores=[],
                           site_id=0, table_missing=False, needs_update=True)
        self.assertIn('2026-10-09_banner_text_align.sql', html)

    def test_view_flags_a_missing_column_not_a_missing_table(self):
        from django.db.utils import OperationalError
        unknown = OperationalError(1054, "Unknown column 'text_align' in 'field list'")
        with mock.patch.object(views.OcTsgBanner, 'objects') as objects, \
                mock.patch.object(views.OcStore, 'objects') as stores, \
                mock.patch.object(views, 'render', return_value=mock.sentinel.response) as render:
            stores.filter.return_value.order_by.return_value.values_list.return_value = []
            objects.all.side_effect = unknown
            views.banners_list(fake_request('/sites/banners/'))
        context = render.call_args[0][2]
        self.assertTrue(context['needs_update'])
        self.assertFalse(context['table_missing'])

    def test_other_database_errors_still_raise_on_the_banner_list(self):
        from django.db.utils import OperationalError
        with mock.patch.object(views.OcTsgBanner, 'objects') as objects, \
                mock.patch.object(views.OcStore, 'objects') as stores:
            stores.filter.return_value.order_by.return_value.values_list.return_value = []
            objects.all.side_effect = OperationalError(2006, 'server has gone away')
            with self.assertRaises(OperationalError):
                views.banners_list(fake_request('/sites/banners/'))

    def test_list_names_the_sql_file_when_the_table_is_missing(self):
        html = render_page('sites/banners.html', fake_request('/sites/banners/'), banners=[], stores=[],
                           site_id=0, table_missing=True)
        self.assertIn('2026-10-09_banners.sql', html)
        self.assertNotIn('New Banner', html)

    def test_view_survives_a_missing_table(self):
        missing = ProgrammingError(1146, "Table 'x.oc_tsg_banner' doesn't exist")
        with mock.patch.object(views.OcTsgBanner, 'objects') as objects, \
                mock.patch.object(views.OcStore, 'objects') as stores, \
                mock.patch.object(views, 'render', return_value=mock.sentinel.response) as render:
            stores.filter.return_value.order_by.return_value.values_list.return_value = []
            objects.all.side_effect = missing
            views.banners_list(fake_request('/sites/banners/'))
        self.assertTrue(render.call_args[0][2]['table_missing'])

    def test_form_page_renders_as_multipart(self):
        with mock.patch('apps.sites.forms.OcStore.objects') as stores:
            stores.filter.return_value.order_by.return_value.values_list.return_value = [(4, 'Imo signs')]
            form = BannerForm(instance=make_banner())
        html = render_page('sites/banner_form.html', fake_request('/sites/banners/1/edit'), form=form)
        self.assertIn('multipart/form-data', html)
        self.assertIn('Trade Accounts Available', html)

    def test_delete_refuses_get(self):
        with mock.patch.object(views, 'get_object_or_404') as lookup:
            response = views.banner_delete(fake_request('/sites/banners/1/delete'), 1)
        self.assertEqual(response.status_code, 405)
        lookup.assert_not_called()

    def test_delete_post_deletes_and_redirects(self):
        banner = mock.Mock()
        request = fake_request('/sites/banners/1/delete', method='post')
        with mock.patch.object(views, 'get_object_or_404', return_value=banner), mock.patch.object(views, 'messages'):
            response = views.banner_delete(request, 1)
        banner.delete.assert_called_once()
        self.assertEqual(response.status_code, 302)
