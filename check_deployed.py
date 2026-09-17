import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)
    for chunk in chunks:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "http://localhost:5210" in js:
            print("FOUND LOCALHOST in", chunk)
        if "skull-shakes-acai.onrender.com" in js:
            print("FOUND RENDER URL in", chunk)
except Exception as e:
    print(e)
