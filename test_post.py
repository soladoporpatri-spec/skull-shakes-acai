import urllib.request
import json

payload = {
    "nomeCliente": "Test",
    "telefone": "11999999999",
    "endereco": "Rua Teste, 123",
    "cep": "12345-678",
    "formaPagamento": "Cash",
    "modalidadePagamento": "OnDelivery",
    "itens": [
        { "produtoId": 1, "quantidade": 1, "adicionaisIds": [] }
    ]
}
req = urllib.request.Request("https://skull-shakes-acai.onrender.com/pedidos", method="POST")
req.add_header("Origin", "https://skull-shakes-acai.vercel.app")
req.add_header("Content-Type", "application/json")

try:
    response = urllib.request.urlopen(req, data=json.dumps(payload).encode('utf-8'))
    print("Status:", response.status)
    print("Body:", response.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Body:", e.read().decode('utf-8'))
