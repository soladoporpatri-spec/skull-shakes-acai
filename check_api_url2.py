import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
html = urllib.request.urlopen(req).read().decode('utf-8')
chunks = re.findall(r'src="(/_next/static/[^"]+\.js)"', html)
for chunk in chunks:
    try:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "localhost" in js:
            print("FOUND LOCALHOST in", chunk)
        if "onrender" in js:
            print("FOUND RENDER in", chunk)
    except:
        pass
