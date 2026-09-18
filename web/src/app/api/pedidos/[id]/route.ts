import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://skull-shakes-acai.onrender.com').replace(/\/$/, '');
    
    const res = await fetch(backendUrl + '/pedidos/' + params.id, {
      method: 'GET',
    });
    
    if (!res.ok) {
        if (res.status === 404) {
            return NextResponse.json({ error: 'Pedido nao encontrado.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Erro ao buscar pedido' }, { status: res.status });
    }

    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await res.json();
    } else {
        const text = await res.text();
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro de proxy interno' }, { status: 500 });
  }
}
