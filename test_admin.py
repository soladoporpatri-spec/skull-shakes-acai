import urllib.request

try:
    resp = urllib.request.urlopen("https://skull-shakes-admin.vercel.app/")
    print("Status:", resp.status)
    print("HTML Content (first 1000 chars):", resp.read().decode('utf-8')[:1000])
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("HTML Content:", e.read().decode('utf-8')[:1000])
except Exception as e:
    print("Error:", e)
