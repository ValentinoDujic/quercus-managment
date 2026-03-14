'use client';

import { useState } from 'react';
import { useMes } from '@/context/MesContext';
import { Unit, Priority } from '@/types';
import { PlusCircle } from 'lucide-react';

export function AddOrderForm() {
  const { addNewOrder } = useMes();
  const [productType, setProductType] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState<Unit>('m3');
  const [priority, setPriority] = useState<Priority>('Normalno');
  const [dimensions, setDimensions] = useState('');
  const [qualityMix, setQualityMix] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priceDetails, setPriceDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productType || !quantity) return;

    addNewOrder({
      productType,
      totalQuantity: Number(quantity),
      completedQuantity: 0,
      wasteQuantity: 0,
      unit,
      currentStage: 'Pilana', // Default starting stage
      priority,
      status: 'Na čekanju',
      dimensions: dimensions || undefined,
      qualityMix: qualityMix || undefined,
      deadline: deadline || undefined,
      priceDetails: priceDetails || undefined,
    });

    // Reset form
    setProductType('');
    setQuantity('');
    setUnit('m3');
    setPriority('Normalno');
    setDimensions('');
    setQualityMix('');
    setDeadline('');
    setPriceDetails('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-quercus-primary" />
        Dodaj novu narudžbu
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Vrsta proizvoda</label>
          <input
            type="text"
            required
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="npr. Hrastove daske"
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Količina</label>
          <input
            type="number"
            required
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jedinica</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all bg-white"
            >
              <option value="m3">m³</option>
              <option value="m2">m²</option>
              <option value="kom">kom</option>
              <option value="palete">palete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prioritet</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all bg-white"
            >
              <option value="Normalno">Normalno</option>
              <option value="Hitno">Hitno</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Dimenzije</label>
          <input
            type="text"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="npr. 4.2 x 95 x 1820 mm"
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Klasa / Omjer</label>
          <input
            type="text"
            value={qualityMix}
            onChange={(e) => setQualityMix(e.target.value)}
            placeholder="npr. 85% Klasa A, 15% Kern"
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rok isporuke</label>
          <input
            type="text"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="npr. Kraj svibnja 2026"
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cijena / Uvjeti (Samo za Upravu)</label>
          <input
            type="text"
            value={priceDetails}
            onChange={(e) => setPriceDetails(e.target.value)}
            placeholder="npr. 9,50 EUR/m2 (A)"
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-quercus-primary focus:border-quercus-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-quercus-primary text-white font-semibold rounded-xl hover:bg-quercus-primary/90 active:scale-95 transition-all"
        >
          Spremi narudžbu
        </button>
      </div>
    </form>
  );
}
