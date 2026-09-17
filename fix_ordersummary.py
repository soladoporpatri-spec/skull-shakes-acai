# -*- coding: utf-8 -*-
with open('web/src/components/checkout/OrderSummary.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '  deliveryFee: number;',
    '  deliveryFee: number;\n  isAberta?: boolean;'
)

content = content.replace(
    'export default function OrderSummary({ onSubmit, isSubmitting, status, deliveryFee }: Props) {',
    'export default function OrderSummary({ onSubmit, isSubmitting, status, deliveryFee, isAberta = true }: Props) {'
)

content = content.replace(
    '''        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || total === 0}
          className="w-full mt-8 bg-white text-black font-bold uppercase tracking-wider py-5 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
        </button>''',
    '''        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || total === 0 || !isAberta}
          className="w-full mt-8 bg-white text-black font-bold uppercase tracking-wider py-5 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {!isAberta ? 'Loja Fechada' : isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
        </button>'''
)

with open('web/src/components/checkout/OrderSummary.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
