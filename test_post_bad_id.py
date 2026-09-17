import urllib.request
import json
import ssl
import uuid

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request("https://skull-shakes-acai.onrender.com/pedidos", method="POST")
req.add_header("Origin", "https://skull-shakes-acai.vercel.app")
req.add_header("Content-Type", "application/json")

payload = {
    "nomeCliente": "Patricio (Teste)",
    "telefone": "62994014135",
    "endereco": "Rua X, 123",
    "cep": "75000000",
    "formaPagamento": "Cash",
    "modalidadePagamento": "OnDelivery",
    "observacoes": "",
    "idempotencyKey": str(uuid.uuid4()),
    "itens": [
        {
            "produtoId": 0,
            "quantidade": 1,
            "adicionaisIds": []
        }
    ]
}

try:
    resp = urllib.request.urlopen(req, data=json.dumps(payload).encode('utf-8'), context=ctx)
    print("Status:", resp.status)
    print("Body:", resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Status:", e.code)
    print("Body:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
