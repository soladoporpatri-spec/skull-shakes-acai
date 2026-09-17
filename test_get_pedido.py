import urllib.request
try:
    resp = urllib.request.urlopen("https://skull-shakes-acai.onrender.com/pedidos/4")
    print("Status:", resp.status)
    print("Data:", resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Status:", e.code)
    print("Data:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
