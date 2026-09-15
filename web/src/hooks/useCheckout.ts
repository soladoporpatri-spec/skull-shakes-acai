import { useState } from 'react';

export type CheckoutState = {
  address: { cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string; reference: string; receiverName: string; lat: string | null; lng: string | null; deliveryFee: number | null; distance: number | null; };
  payment: { method: string; needsChange: boolean; changeFor: string; };
  notes: string;
};

export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({
    address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', reference: '', receiverName: '', lat: null, lng: null, deliveryFee: null, distance: null },
    payment: { method: '', needsChange: false, changeFor: '' },
    notes: ''
  });
  const updateAddress = (fields: Partial<CheckoutState['address']>) => setState(s => ({ ...s, address: { ...s.address, ...fields } }));
  const updatePayment = (fields: Partial<CheckoutState['payment']>) => setState(s => ({ ...s, payment: { ...s.payment, ...fields } }));
  const updateNotes = (notes: string) => setState(s => ({ ...s, notes }));
  return { state, updateAddress, updatePayment, updateNotes };
}
