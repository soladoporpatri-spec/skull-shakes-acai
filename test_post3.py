import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request("https://skull-shakes-acai.onrender.com/pedidos", method="POST")
req.add_header("Origin", "https://skullshakes-nuedw6jsu-patriciopaulosousacunha-8741s-projects.vercel.app")
req.add_header("Content-Type", "application/json")

payload = {
    "nomeCliente": "Patricio",
    "telefone": "62999999999",
    "endereco": "Rua X",
    "cep": "75000000",
    "formaPagamento": "Cash",
    "modalidadePagamento": "OnDelivery",
    "observacoes": "",
    "itens": [
        {
            "produtoId": 1,
            "quantidade": 1,
            "adicionaisIds": []
        }
    ]
}

try:
    resp = urllib.request.urlopen(req, data=json.dumps(payload).encode('utf-8'), context=ctx)
    print("Status:", resp.status)
    print("Body:", resp.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Body:", e.read().decode('utf-8'))
