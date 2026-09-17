import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
html = urllib.request.urlopen(req).read().decode('utf-8')
chunks = re.findall(r'src="(/_next/static/[^"]+\.js)"', html)
for chunk in chunks:
    try:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "ALERTA DE DEBUG" in js:
            print("FOUND ALERTA DE DEBUG in", chunk)
    except:
        pass
