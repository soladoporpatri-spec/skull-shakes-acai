import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request("https://skull-shakes-acai.onrender.com/pedidos", method="OPTIONS")
req.add_header("Origin", "https://skull-shakes-acai.vercel.app")
req.add_header("Access-Control-Request-Method", "POST")
req.add_header("Access-Control-Request-Headers", "content-type")
req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36")
req.add_header("Accept", "*/*")
req.add_header("Sec-Fetch-Mode", "cors")
req.add_header("Sec-Fetch-Site", "cross-site")
req.add_header("Sec-Fetch-Dest", "empty")

try:
    resp = urllib.request.urlopen(req, context=ctx)
    print("Status:", resp.status)
    print("Headers:", resp.headers)
except urllib.error.HTTPError as e:
    print("Status:", e.code)
    print("Headers:", e.headers)
except Exception as e:
    print("Error:", e)
