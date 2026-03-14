'use client';

import { useState } from 'react';
import { useMes, Worker } from '@/context/MesContext';
import { Stage, Order } from '@/types';
import { 
  Factory, 
  Wind, 
  Ruler, 
  Wrench, 
  ChevronLeft, 
  Plus, 
  Minus, 
  CheckCircle,
  AlertCircle,
  LogOut,
  Save,
  Hammer
} from 'lucide-react';

const STAGES: { name: Stage; icon: React.ElementType }[] = [
  { name: 'Pilana', icon: Factory },
  { name: 'Sušara', icon: Wind },
  { name: 'Blanjanje', icon: Ruler },
  { name: 'Montaža', icon: Wrench },
];

const getNextStage = (current: Stage): Stage => {
  const flow: Record<Stage, Stage> = {
    'Pilana': 'Sušara',
    'Sušara': 'Blanjanje',
    'Blanjanje': 'Montaža',
    'Montaža': 'Završeno',
    'Završeno': 'Završeno',
  };
  return flow[current];
};

export default function WorkerPage() {
  const { orders, workers, updateOrderProgress, savePartialProgress, setActiveWorker } = useMes();
  
  const [loggedInWorker, setLoggedInWorker] = useState<Worker | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [producedQty, setProducedQty] = useState(0);
  const [wasteQty, setWasteQty] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCompleteTask = () => {
    if (!selectedOrder || !loggedInWorker) return;
    
    const nextStage = getNextStage(selectedOrder.currentStage);
    updateOrderProgress(selectedOrder.id, producedQty, wasteQty, nextStage, loggedInWorker.id);
    
    setIsSuccess(true);
    
    // Show success feedback for 2 seconds, then go back to order list
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedOrder(null);
    }, 2000);
  };

  const handlePartialSave = () => {
    if (!selectedOrder || !loggedInWorker) return;
    
    savePartialProgress(selectedOrder.id, producedQty, wasteQty, loggedInWorker.id);
    
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedOrder(null);
      setLoggedInWorker(null);
    }, 2000);
  };

  const handlePinKeyPress = (key: string) => {
    setPinError(false);
    if (key === 'clear') {
      setPinInput('');
    } else if (key === 'enter') {
      const worker = workers.find(w => w.pin === pinInput);
      if (worker) {
        setLoggedInWorker(worker);
        setPinInput('');
        setPinError(false);
      } else {
        setPinError(true);
        setPinInput('');
      }
    } else {
      if (pinInput.length < 4) {
        setPinInput(prev => prev + key);
      }
    }
  };

  // STEP 0: PIN Authentication
  if (!loggedInWorker) {
    return (
      <div className="p-4 md:p-12 max-w-md mx-auto min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border-2 border-slate-200 w-full text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Prijava radnika
          </h1>
          <p className="text-slate-500 mb-8">Unesite svoj PIN za nastavak</p>
          
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-12 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-bold ${
                  pinInput.length > i 
                    ? 'border-quercus-primary bg-quercus-primary/10 text-quercus-primary' 
                    : pinError
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {pinInput.length > i ? '•' : ''}
              </div>
            ))}
          </div>

          {pinError && (
            <p className="text-red-500 font-medium mb-4">Neispravan PIN. Pokušajte ponovno.</p>
          )}

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handlePinKeyPress(num.toString())}
                className="h-16 md:h-20 bg-slate-50 rounded-2xl text-2xl md:text-3xl font-bold text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handlePinKeyPress('clear')}
              className="h-16 md:h-20 bg-red-50 rounded-2xl text-xl md:text-2xl font-bold text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors"
            >
              C
            </button>
            <button
              onClick={() => handlePinKeyPress('0')}
              className="h-16 md:h-20 bg-slate-50 rounded-2xl text-2xl md:text-3xl font-bold text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              0
            </button>
            <button
              onClick={() => handlePinKeyPress('enter')}
              className="h-16 md:h-20 bg-quercus-primary rounded-2xl text-xl md:text-2xl font-bold text-white hover:bg-quercus-primary/90 active:bg-quercus-primary/80 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 1: Select Workstation / Stage
  if (!selectedStage) {
    return (
      <div className="p-4 md:p-12 max-w-6xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Radnički terminal
          </h1>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-slate-700 font-medium">Prijavljen: {loggedInWorker.name}</span>
            <div className="w-px h-6 bg-slate-200"></div>
            <button 
              onClick={() => {
                if (selectedOrder) setActiveWorker(selectedOrder.id, null);
                setLoggedInWorker(null);
                setSelectedStage(null);
                setSelectedOrder(null);
              }}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Odjava
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-1">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const activeCount = orders.filter(
              (o) => o.currentStage === stage.name && o.status !== 'Završeno'
            ).length;

            return (
              <button
                key={stage.name}
                onClick={() => setSelectedStage(stage.name)}
                className="flex flex-col items-center justify-center p-8 md:p-12 bg-white rounded-3xl shadow-sm border-2 border-slate-200 hover:border-quercus-primary hover:bg-quercus-primary/5 active:bg-quercus-primary/10 transition-all group"
              >
                <Icon className="w-20 h-20 md:w-24 md:h-24 text-slate-400 group-hover:text-quercus-primary mb-6 transition-colors" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{stage.name}</h2>
                <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-lg md:text-xl font-medium">
                  {activeCount} Aktivnih narudžbi
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // STEP 2 & 3: Split Pane Layout for Order Selection and Execution
  const stageOrders = orders.filter(
    (o) => o.currentStage === selectedStage && o.status !== 'Završeno'
  );

  const handleSelectOrder = (order: Order) => {
    if (selectedOrder) {
      setActiveWorker(selectedOrder.id, null);
    }
    setSelectedOrder(order);
    setActiveWorker(order.id, loggedInWorker.id);
    setProducedQty(0);
    setWasteQty(0);
    setIsSuccess(false);
  };

  const handleBackToStages = () => {
    if (selectedOrder) {
      setActiveWorker(selectedOrder.id, null);
    }
    setSelectedStage(null);
    setSelectedOrder(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-screen-2xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackToStages}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-slate-600" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {selectedStage}
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-slate-700 font-medium">Prijavljen: {loggedInWorker.name}</span>
          <div className="w-px h-6 bg-slate-200"></div>
          <button 
            onClick={() => {
              if (selectedOrder) setActiveWorker(selectedOrder.id, null);
              setLoggedInWorker(null);
              setSelectedStage(null);
              setSelectedOrder(null);
            }}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Odjava
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 pb-16">
        {/* Left Pane: Order List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          {stageOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-300 text-center h-full">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-700">Sve je riješeno!</h2>
              <p className="text-slate-500 mt-2">Nema aktivnih narudžbi za ovu stanicu.</p>
            </div>
          ) : (
            stageOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              const progressPercent = Math.min(100, Math.round((order.completedQuantity / order.totalQuantity) * 100));
              
              return (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className={`flex flex-col p-5 rounded-2xl border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-quercus-primary bg-quercus-primary/5 shadow-md ring-4 ring-quercus-primary/10' 
                      : 'border-slate-200 bg-white hover:border-quercus-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 w-full">
                    <span className="font-bold text-slate-900">{order.id}</span>
                    {order.priority === 'Hitno' && (
                      <AlertCircle className="text-red-500 w-5 h-5 shrink-0" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{order.productType}</h3>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className="bg-quercus-primary h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-medium w-full">
                    <span>{progressPercent}%</span>
                    <span>{order.completedQuantity} / {order.totalQuantity} {order.unit}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Pane: Execution */}
        <div className="w-full lg:w-2/3">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center bg-emerald-500 text-white p-12 rounded-[2.5rem] shadow-xl animate-in zoom-in duration-300">
              <CheckCircle className="w-32 h-32 mb-8" />
              <h2 className="text-4xl font-bold mb-4 text-center">Zadatak završen!</h2>
              <p className="text-xl opacity-90 text-center">Napredak je uspješno spremljen.</p>
            </div>
          ) : selectedOrder ? (
            <div className="bg-slate-50/50 p-6 md:p-8 rounded-[2.5rem] border-2 border-slate-200 h-full flex flex-col">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {selectedOrder.productType}
                </h2>
                <p className="text-xl text-slate-500 font-medium">
                  Nalog {selectedOrder.id} &bull; Cilj: {selectedOrder.totalQuantity} {selectedOrder.unit}
                </p>
              </div>

              {(selectedOrder.dimensions || selectedOrder.qualityMix) && (
                <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-2xl mb-8 shadow-sm">
                  <h3 className="text-yellow-800 font-bold text-xl mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" /> Specifikacije proizvodnje
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedOrder.dimensions && (
                      <div className="bg-white/60 p-4 rounded-xl border border-yellow-200">
                        <p className="text-yellow-700/80 text-sm font-bold uppercase tracking-wider mb-1">Dimenzije</p>
                        <p className="text-yellow-900 font-black text-xl">{selectedOrder.dimensions}</p>
                      </div>
                    )}
                    {selectedOrder.qualityMix && (
                      <div className="bg-white/60 p-4 rounded-xl border border-yellow-200">
                        <p className="text-yellow-700/80 text-sm font-bold uppercase tracking-wider mb-1">Klasa / Omjer</p>
                        <p className="text-yellow-900 font-black text-xl">{selectedOrder.qualityMix}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-1">
                {/* Produced Quantity Control */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                    Unesi odrađenu količinu ({selectedOrder.unit})
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-50 p-4 rounded-2xl">
                    <button 
                      onClick={() => setProducedQty(Math.max(0, producedQty - 1))}
                      className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 text-red-500 active:bg-red-50 active:scale-95 transition-all shrink-0"
                    >
                      <Minus className="w-8 h-8" />
                    </button>
                    <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter min-w-[2ch] text-center">
                      {producedQty}
                    </span>
                    <button 
                      onClick={() => setProducedQty(producedQty + 1)}
                      className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 text-quercus-primary active:bg-quercus-primary/10 active:scale-95 transition-all shrink-0"
                    >
                      <Plus className="w-8 h-8" />
                    </button>
                  </div>
                </div>

                {/* Waste Quantity Control */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                    Prijava škarta/biomase ({selectedOrder.unit})
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-50 p-4 rounded-2xl">
                    <button 
                      onClick={() => setWasteQty(Math.max(0, wasteQty - 1))}
                      className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 text-red-500 active:bg-red-50 active:scale-95 transition-all shrink-0"
                    >
                      <Minus className="w-8 h-8" />
                    </button>
                    <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter min-w-[2ch] text-center">
                      {wasteQty}
                    </span>
                    <button 
                      onClick={() => setWasteQty(wasteQty + 1)}
                      className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 text-quercus-accent active:bg-quercus-accent/10 active:scale-95 transition-all shrink-0"
                    >
                      <Plus className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handlePartialSave}
                  disabled={producedQty === 0 && wasteQty === 0}
                  className="flex-1 py-6 px-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl text-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-8 h-8 shrink-0" />
                  <span>Spremi napredak (Kraj smjene)</span>
                </button>
                <button
                  onClick={handleCompleteTask}
                  disabled={producedQty === 0 && wasteQty === 0}
                  className="flex-1 py-6 px-4 bg-quercus-primary hover:bg-quercus-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl text-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-8 h-8 shrink-0" />
                  <span>Završi zadatak i proslijedi</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center">
              <Hammer className="w-20 h-20 text-slate-300 mb-6" />
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Odaberite narudžbu</h2>
              <p className="text-lg text-slate-500">Odaberite narudžbu s popisa lijevo za početak rada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
