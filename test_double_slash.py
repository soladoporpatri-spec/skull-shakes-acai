import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request("https://skull-shakes-acai.onrender.com//pedidos/configuracoes/status")
try:
    resp = urllib.request.urlopen(req, context=ctx)
    print("Status:", resp.status)
except urllib.error.HTTPError as e:
    print("Error:", e.code)
