import urllib.request
import re

try:
    req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
    html = urllib.request.urlopen(req).read().decode('utf-8')
    chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)

    found_alert = False
    found_localhost = False
    
    for chunk in chunks:
        try:
            js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
            if "ERRO: O navegador" in js:
                found_alert = True
            if "http://localhost:5210" in js:
                found_localhost = True
        except Exception as e:
            pass

    print(f"Alert found: {found_alert}")
    print(f"Localhost found: {found_localhost}")
except Exception as e:
    print(e)
