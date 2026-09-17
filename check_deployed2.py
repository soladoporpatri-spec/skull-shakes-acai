import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)
    for chunk in chunks:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "localhost" in js:
            print("FOUND localhost in", chunk)
        if "onrender" in js:
            print("FOUND onrender in", chunk)
except Exception as e:
    print(e)
