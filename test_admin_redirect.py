import urllib.request
import time

max_retries = 5
for i in range(max_retries):
    try:
        resp = urllib.request.urlopen("https://skull-shakes-admin.vercel.app/")
        print("Status:", resp.status)
        break
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
        if e.code == 404:
            print("Still deploying... waiting 10s")
            time.sleep(10)
        else:
            break
    except Exception as e:
        print("Error:", e)
