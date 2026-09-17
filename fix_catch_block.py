# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r"\} catch \(error: unknown\) \{\s*console\.error\('\[checkout\]', error\);\s*setStatus\('idle'\);\s*const msg =\s*error instanceof Error\s*\?\s*error\.message\s*:\s*'Ocorreu um erro inesperado\. Tente novamente\.';\s*alert\(msg\);\s*\}"

replacement = r"""} catch (error: any) {
      console.error('[checkout]', error);
      setStatus('idle');
      const msg = error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
      const finalMsg = ALERTA DE DEBUG:\nURL: /pedidos\nERRO: \n\nSE O ERRO FOR 'Failed to fetch', DESATIVE O ESCUDO DO BRAVE (leãozinho no topo direito) ou seu bloqueador de anúncios, pois ele está bloqueando a conexão.;
      alert(finalMsg);
    }"""

content = re.sub(pattern, replacement, content)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
