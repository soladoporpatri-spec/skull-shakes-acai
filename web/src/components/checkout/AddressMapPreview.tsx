import { MapPin } from 'lucide-react';
export default function AddressMapPreview({ address }: { address: string }) {
  if (!address) return null;
  return (
    <div className="w-full h-32 bg-zinc-900 border border-white/10 flex flex-col items-center justify-center text-zinc-500 mt-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <MapPin size={24} className="mb-2 text-white/40" />
      <span className="text-xs uppercase tracking-widest text-center z-10 px-4">Localização Aproximada<br/><span className="text-[10px] opacity-70 normal-case">{address}</span></span>
    </div>
  );
}
