export async function lookupAddressByCep(cep: string) {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) throw new Error('invalid_format');
  try {
    const res = await fetch('/api/cep/' + clean);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'service_error');
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distância em km
}
