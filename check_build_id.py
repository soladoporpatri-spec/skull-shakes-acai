import urllib.request
import re

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/")
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    build_id = re.search(r'"buildId":"([^"]+)"', html)
    if build_id:
        print("Build ID:", build_id.group(1))
    else:
        print("Build ID not found. HTML snippet:", html[:500])
except Exception as e:
    print("Error:", e)
