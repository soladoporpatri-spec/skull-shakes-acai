import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    chunks = re.findall(r'src="(/_next/static/[^"]+\.js)"', html)
    found_proxy = False
    for chunk in chunks:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "/api/pedidos" in js:
            found_proxy = True
            print("YES! The proxy code is deployed on skull-shakes-acai.vercel.app!")
            # Print the context
            match = re.search(r'.{0,50}/api/pedidos.{0,50}', js)
            if match:
                print("Context:", match.group(0))
    if not found_proxy:
        print("NO! The proxy code is NOT deployed. The HTML is loading chunks that don't have '/api/pedidos'.")
except Exception as e:
    print("Error:", e)
