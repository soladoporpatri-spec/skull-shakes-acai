import urllib.request
import time

max_retries = 3
for i in range(max_retries):
    try:
        req = urllib.request.Request("https://skull-shakes-admin.vercel.app/")
        resp = urllib.request.urlopen(req)
        print("Status:", resp.status)
        print("Final URL:", resp.geturl())
        break
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
        if e.code == 404:
            print("Still 404...")
            time.sleep(5)
        else:
            break
    except Exception as e:
        print("Error:", e)
