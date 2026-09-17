import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    chunks = re.findall(r'src="(/_next/static/[^"]+\.js)"', html)
    found_alert = False
    for chunk in chunks:
        js = urllib.request.urlopen("https://skull-shakes-acai.vercel.app" + chunk).read().decode('utf-8')
        if "ALERTA DE DEBUG" in js:
            found_alert = True
            print("YES! The new code is deployed on skull-shakes-acai.vercel.app!")
            # Let's print the exact code around it
            match = re.search(r'.{0,50}ALERTA DE DEBUG.{0,50}', js)
            if match:
                print("Context:", match.group(0))
    if not found_alert:
        print("NO! The new code is NOT deployed. The HTML is loading old chunks.")
except Exception as e:
    print("Error:", e)
