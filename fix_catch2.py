# -*- coding: utf-8 -*-
with open('web/src/components/checkout/CheckoutSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_catch = '''    } catch (error: unknown) {
      console.error('[checkout]', error);
      setStatus('idle');
      const msg =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro inesperado. Tente novamente.';
      alert(msg);
    }'''

new_catch = '''    } catch (error: any) {
      console.error('[checkout]', error);
      setStatus('idle');
      const msg = error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
      alert("ALERTA DE DEBUG:\\nURL: " + API_URL + "\\nERRO: " + msg + "\\n\\nSe o erro for 'Failed to fetch', DESATIVE O ESCUDO DO BRAVE (leaozinho) ou outro AdBlock. Ele bloqueia pedidos pra APIs externas.");
    }'''

content = content.replace(old_catch, new_catch)

with open('web/src/components/checkout/CheckoutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
