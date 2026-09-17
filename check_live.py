import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    chunks = re.findall(r'src="(/_next/static/[^"]+\.js)"', html)
    found_alert = False
    found_proxy = False
    for chunk in chunks:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "ALERTA DE DEBUG" in js:
            found_alert = True
        if "/api/pedidos" in js:
            found_proxy = True
    print(f"Has ALERTA DE DEBUG: {found_alert}")
    print(f"Has Proxy /api/pedidos: {found_proxy}")
except Exception as e:
    print("Error:", e)
