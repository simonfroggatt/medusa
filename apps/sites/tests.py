from django.test import TestCase

# Create your tests here.


# ---- Search Terms report -------------------------------------------------
from datetime import datetime, timezone as dt_timezone
from types import SimpleNamespace
from unittest import mock

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
    def render(self, report):
        context = {'pageview': 'Search Terms', 'heading': 'Search Terms', 'site_id': 1, 'days': 30,
                   'periods': search_terms.PERIODS, 'stores': [(1, 'Safety Signs and Notices')],
                   'report': report}
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
