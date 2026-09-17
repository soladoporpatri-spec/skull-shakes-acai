import urllib.request

try:
    resp = urllib.request.urlopen("https://skull-shakes-admin.vercel.app/login")
    print("Status:", resp.status)
    print("HTML Content:", resp.read().decode('utf-8')[:500])
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
except Exception as e:
    print("Error:", e)
