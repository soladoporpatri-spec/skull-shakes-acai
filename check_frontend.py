import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
html = urllib.request.urlopen(req).read().decode('utf-8')

# Find the JS chunk that contains '/pedidos'
chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)
for chunk in chunks:
    try:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "/pedidos" in js:
            # find NEXT_PUBLIC_API_URL fallback
            print("Found in:", chunk)
            match = re.search(r'fetch\([^]+([^$]*)\True[^]*/pedidos', js)
            if match:
                print("URL context:", match.group(0))
            if "localhost:5210" in js:
                print("Localhost is present in chunk!")
            if "skull-shakes-acai.onrender.com" in js:
                print("Render URL is present in chunk!")
    except Exception as e:
        pass
