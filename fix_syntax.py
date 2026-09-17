# -*- coding: utf-8 -*-
code = '''import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skull-shakes-acai.onrender.com';
    
    const res = await fetch(backendUrl + '/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
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
    
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro de proxy interno' }, { status: 500 });
  }
}
'''
with open('web/src/app/api/pedidos/route.ts', 'w', encoding='utf-8') as f:
    f.write(code)

code2 = '''import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skull-shakes-acai.onrender.com';
    const res = await fetch(backendUrl + '/pedidos/configuracoes/status');
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
'''
with open('web/src/app/api/status/route.ts', 'w', encoding='utf-8') as f:
    f.write(code2)
