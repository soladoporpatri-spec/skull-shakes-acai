'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useState } from 'react';

// Use a placeholder key or environment variable.
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function CheckoutMap() {
  const [position, setPosition] = useState({ lat: -16.686891, lng: -49.264790 }); // Goiânia as placeholder, given the number +55 62 on the menu

  if (!API_KEY) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
        <p>Google Maps API Key não configurada.</p>
        <p className="text-sm mt-2">Defina NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no .env</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="w-full h-[400px] rounded-xl overflow-hidden border border-zinc-800">
        <Map
          defaultZoom={15}
          defaultCenter={position}
          mapId="SKULL_SHAKES_MAP_ID"
          onClick={(e) => {
            if (e.detail.latLng) {
              setPosition(e.detail.latLng);
            }
          }}
        >
          <AdvancedMarker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
}
