import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ cep: string }> }) {
  const resolvedParams = await context.params;
  const cep = resolvedParams.cep.replace(/\D/g, '');
  
  if (cep.length !== 8) {
    return NextResponse.json({ error: 'invalid_format' }, { status: 400 });
  }

  try {
    // 1. Fetch from BrasilAPI server-to-server (bypasses browser adblockers/CORS)
    const res = await fetch('https://brasilapi.com.br/api/cep/v1/' + cep);
    
    if (!res.ok) {
      // Fallback to ViaCEP if BrasilAPI fails
      const fallbackRes = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
      if (!fallbackRes.ok) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      
      const fallbackData = await fallbackRes.json();
      if (fallbackData.erro) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      
      return processAddressData({
        street: fallbackData.logradouro,
        neighborhood: fallbackData.bairro,
        city: fallbackData.localidade,
        state: fallbackData.uf
      });
    }

    const data = await res.json();
    return processAddressData({
      street: data.street,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state
    });
    
  } catch (error) {
    console.error('Server CEP Fetch Error:', error);
    return NextResponse.json({ error: 'service_error' }, { status: 500 });
  }
}

async function processAddressData(data: { street: string, neighborhood: string, city: string, state: string }) {
  let lat = null;
  let lng = null;

  // Busca coordenadas aproximadas usando OpenStreetMap (Nominatim) server-to-server
  if (data.street && data.city && data.state) {
    try {
      const query = encodeURIComponent(data.street + ', ' + data.city + ', ' + data.state + ', Brasil');
      // Nominatim requires a valid User-Agent
      const geoRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + query + '&limit=1', {
        headers: {
          'User-Agent': 'SkullShakes-Acai-Storefront/1.0'
        }
      });
      
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          lat = parseFloat(geoData[0].lat);
          lng = parseFloat(geoData[0].lon);
        }
      }
    } catch (e) {
      console.error('Erro Nominatim no servidor:', e);
    }
  }

  return NextResponse.json({
    street: data.street || '',
    neighborhood: data.neighborhood || '',
    city: data.city || '',
    state: data.state || '',
    lat,
    lng
  });
}