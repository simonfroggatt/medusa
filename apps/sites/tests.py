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
