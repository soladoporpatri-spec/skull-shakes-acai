import urllib.request
import re

req = urllib.request.Request("https://skullshakes-nuedw6jsu-patriciopaulosousacunha-8741s-projects.vercel.app/")
html = urllib.request.urlopen(req).read().decode('utf-8')
chunks = re.findall(r'src="(/_next/static/chunks/.*?\.js)"', html)

found_alert = False
for chunk in chunks:
    try:
        js = urllib.request.urlopen("https://skullshakes-nuedw6jsu-patriciopaulosousacunha-8741s-projects.vercel.app" + chunk).read().decode('utf-8')
        if "ERRO: O navegador" in js:
            found_alert = True
    except Exception as e:
        pass

if found_alert:
    print("ALERT FOUND IN DEPLOYMENT")
else:
    print("ALERT NOT FOUND IN DEPLOYMENT")
