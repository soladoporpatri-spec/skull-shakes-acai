# -*- coding: utf-8 -*-
code = '''import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skull-shakes-acai.onrender.com';
    const res = await fetch(${backendUrl}/pedidos/configuracoes/status);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
'''
with open('web/src/app/api/status/route.ts', 'w', encoding='utf-8') as f:
    f.write(code)
