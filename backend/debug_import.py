import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrichain.settings')
django.setup()

try:
    print("Attempting to import core.models...")
    from core import models
    print("SUCCESS: Imported core.models")
except Exception:
    print("FAILURE: Could not import core.models")
    traceback.print_exc()

try:
    print("\nAttempting to import marketplace.views...")
    from marketplace import views
    print("SUCCESS: Imported marketplace.views")
except Exception:
    print("FAILURE: Could not import marketplace.views")
    traceback.print_exc()
