import urllib.request

req = urllib.request.Request("https://skull-shakes-acai.onrender.com/pedidos", method="OPTIONS")
req.add_header("Origin", "https://skull-shakes-acai.vercel.app")
req.add_header("Access-Control-Request-Method", "POST")

try:
    response = urllib.request.urlopen(req)
    print("Status:", response.status)
    print("Headers:", response.headers)
except Exception as e:
    print("Error:", e)
