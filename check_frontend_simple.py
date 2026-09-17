import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
html = urllib.request.urlopen(req).read().decode('utf-8')

chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)
for chunk in chunks:
    try:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "http://localhost:5210" in js:
            print("Found localhost:5210 in", chunk)
        if "skull-shakes-acai.onrender.com" in js:
            print("Found render url in", chunk)
    except:
        pass
