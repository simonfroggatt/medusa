"""
Check the Google Drive set-up for artwork PDFs, without leaving anything behind.

    python manage.py check_artwork_drive

It reports which service account is used, whether the target folder is visible to it, and then uploads a tiny
test PDF into the folder and deletes it again. Run it on the server that has the key file.
"""
import io

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.products import artwork_service


class Command(BaseCommand):
    help = 'Check the Drive folder for artwork PDFs: visible, writable, and the test file removed again.'

    def handle(self, *args, **options):
        folder = getattr(settings, 'ARTWORK_DRIVE_FOLDER', None)
        if not folder:
            raise CommandError('settings.ARTWORK_DRIVE_FOLDER is not set (the folder id from its Drive address).')

        key_file = artwork_service._drive_key_file()
        self.stdout.write(f'Key file: {key_file}')
        try:
            service = artwork_service.drive_service()
        except Exception as exc:
            raise CommandError(f'Could not load the service account key: {exc}')

        try:
            from google.oauth2 import service_account
            account = service_account.Credentials.from_service_account_file(key_file).service_account_email
            self.stdout.write(f'Service account: {account}')
        except Exception:
            pass

        try:
            info = service.files().get(fileId=folder, fields='id,name,mimeType,capabilities(canAddChildren)',
                                       supportsAllDrives=True).execute()
        except Exception as exc:
            raise CommandError('The service account cannot see the folder. Share the folder with the account '
                               f'above as Editor, and check the folder id. ({str(exc)[:200]})')
        self.stdout.write(f"Folder: \"{info.get('name')}\" ({info.get('mimeType')})")
        if not info.get('capabilities', {}).get('canAddChildren', True):
            raise CommandError('The service account can see the folder but cannot add files to it: make it Editor.')

        from googleapiclient.http import MediaIoBaseUpload
        data = b'%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\n' \
               b'trailer<</Root 1 0 R>>\n%%EOF\n'
        try:
            created = service.files().create(
                body={'name': 'medusa-artwork-drive-test (safe to delete).pdf', 'parents': [folder]},
                media_body=MediaIoBaseUpload(io.BytesIO(data), mimetype='application/pdf'),
                fields='id', supportsAllDrives=True).execute()
        except Exception as exc:
            raise CommandError(f'Could not write a test file into the folder: {str(exc)[:300]}')
        self.stdout.write(f"Test file written (id {created['id']}).")
        try:
            service.files().delete(fileId=created['id'], supportsAllDrives=True).execute()
            self.stdout.write('Test file deleted again. The Drive set-up works.')
        except Exception as exc:
            self.stdout.write(self.style.WARNING(
                f"Test file written but could not be deleted ({str(exc)[:150]}). Delete "
                '"medusa-artwork-drive-test (safe to delete).pdf" from the folder by hand.'))
