import sys
import os
print("Python executable:", sys.executable)
print("PYTHONPATH:", os.environ.get("PYTHONPATH"))
print("sys.path:", sys.path)

print("--- Testing Imports ---")

try:
    import integrations.brightdata.brightdata_client
    print("Import brightdata_client: OK")
except ImportError as e:
    print(f"Import brightdata_client: FAIL ({e})")
except Exception as e:
    print(f"Import brightdata_client: ERROR ({e})")

try:
    from targets.immoscout.map import map_listing
    print("Import map_listing: OK")
except ImportError as e:
    print(f"Import map_listing: FAIL ({e})")
except Exception as e:
    print(f"Import map_listing: ERROR ({e})")

try:
    from utils.mapping_helper import parse_price
    print("Import utils: OK")
except ImportError as e:
    print(f"Import utils: FAIL ({e})")
except Exception as e:
    print(f"Import utils: ERROR ({e})")
