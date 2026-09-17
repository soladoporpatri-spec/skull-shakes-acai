import urllib.request

req = urllib.request.Request("https://skull-shakes-acai.onrender.com/pedidos", method="OPTIONS")
req.add_header("Origin", "https://skull-shakes-acai.vercel.app")
req.add_header("Access-Control-Request-Method", "POST")
req.add_header("Access-Control-Request-Headers", "content-type")

try:
    resp = urllib.request.urlopen(req)
    print("Status:", resp.status)
    print("Headers:", resp.headers)
except Exception as e:
    print("Error:", e)
