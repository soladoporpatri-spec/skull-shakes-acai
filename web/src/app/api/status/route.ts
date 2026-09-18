import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://skull-shakes-acai.onrender.com').replace(/\/$/, '');
    const res = await fetch(backendUrl + '/pedidos/configuracoes/status');
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
