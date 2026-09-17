import urllib.request
import json

req = urllib.request.Request("https://skull-shakes-acai.vercel.app/api/pedidos", method="POST")
req.add_header("Content-Type", "application/json")

payload = {
    "nomeCliente": "Teste Proxy Agent",
    "telefone": "11999999999",
    "endereco": "Rua Teste, 123",
    "formaPagamento": "Cash",
    "modalidadePagamento": "OnDelivery",
    "observacoes": "Teste do Agent via Proxy",
    "itens": [
        {
            "produtoId": 1,
            "quantidade": 1,
            "adicionaisIds": []
        }
    ]
}

data = json.dumps(payload).encode('utf-8')

try:
    resp = urllib.request.urlopen(req, data=data)
    print("Status:", resp.status)
    print("Response:", resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
