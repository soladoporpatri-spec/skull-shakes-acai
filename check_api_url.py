import urllib.request
import re

try:
    req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
    html = urllib.request.urlopen(req).read().decode('utf-8')
    chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)

    for chunk in chunks:
        try:
            js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
            matches = re.findall(r'fetch\([^)]*pedidos', js)
            if matches:
                print(f"Found in {chunk}:")
                for m in matches:
                    print("  ", m)
            
            # also look for api URL explicitly
            api_matches = re.findall(r'[a-zA-Z0-9_]+="http[^"]+"', js)
            for am in api_matches:
                if "api" in am.lower() or "localhost" in am.lower() or "render" in am.lower():
                    print("  Found potential URL:", am)
        except Exception as e:
            pass
except Exception as e:
    print(e)
