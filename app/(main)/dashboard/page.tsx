'use client';

import { useState } from 'react';
import { useMes } from '@/context/MesContext';
import { AddOrderForm } from '@/components/AddOrderForm';
import { 
  ClipboardList, 
  Activity, 
  Trash2, 
  Percent,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  User
} from 'lucide-react';

export default function DashboardPage() {
  const { orders, workstations, workers, inventory } = useMes();
  const [activeTab, setActiveTab] = useState<'pregled' | 'analitika'>('pregled');

  // Calculations
  const activeOrders = orders.filter(o => o.status !== 'Završeno');
  const inProgressOrders = orders.filter(o => o.status === 'U tijeku');
  const completedOrders = orders.filter(o => o.status === 'Završeno');
  
  const totalWaste = orders.reduce((sum, o) => sum + o.wasteQuantity, 0);
  const totalCompleted = orders.reduce((sum, o) => sum + o.completedQuantity, 0);
  
  const overallYield = totalCompleted + totalWaste > 0 
    ? Math.round((totalCompleted / (totalCompleted + totalWaste)) * 100) 
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Završeno':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Završeno
          </span>
        );
      case 'U tijeku':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Activity className="w-3.5 h-3.5" /> U tijeku
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <Clock className="w-3.5 h-3.5" /> Na čekanju
          </span>
        );
    }
  };

  const getWorkerName = (workerId?: number | null) => {
    if (!workerId) return null;
    const worker = workers.find(w => w.id === workerId);
    return worker ? worker.name : 'Nepoznato';
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nadzorna ploča</h1>
          <p className="text-slate-500 mt-1">Pregled tvorničkih operacija i prinosa u stvarnom vremenu.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pregled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'pregled' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pregled operacija
          </button>
          <button
            onClick={() => setActiveTab('analitika')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analitika' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Analitika poslovanja
          </button>
        </div>
      </div>

      {activeTab === 'pregled' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Aktivne narudžbe</h3>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ClipboardList className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{activeOrders.length}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">U tijeku</h3>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{inProgressOrders.length}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Ukupno škarta/biomase</h3>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {totalWaste} <span className="text-base font-normal text-slate-500">jedinica</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Ukupna iskoristivost</h3>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{overallYield}%</p>
            </div>
          </div>

          <div className="mb-8">
            <AddOrderForm />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Orders Data Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Radni nalozi</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Narudžbe</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proizvod / Dimenzije</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Radnik</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Napredak</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeOrders.map((order) => {
                      const progressPercent = Math.min(100, Math.round((order.completedQuantity / order.totalQuantity) * 100));
                      const workerName = getWorkerName(order.activeWorkerId);
                      
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-medium text-slate-900">{order.id}</span>
                            {order.priority === 'Hitno' && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                                Hitno
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-900 block">{order.productType}</span>
                            {order.dimensions && <span className="text-xs text-slate-500 block mt-0.5">Dim: {order.dimensions}</span>}
                            {order.qualityMix && <span className="text-xs text-slate-500 block">Klasa: {order.qualityMix}</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {workerName ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <User className="w-3.5 h-3.5" />
                                {workerName}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Nedodijeljeno</span>
                            )}
                          </td>
                          <td className="px-6 py-4 min-w-[200px]">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-medium text-slate-700">{progressPercent}%</span>
                              <span className="text-slate-500">{order.completedQuantity} / {order.totalQuantity} {order.unit}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-quercus-primary'}`}
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Stanje zaliha</h2>
                <Package className="w-5 h-5 text-slate-400" />
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  {/* Sirovina */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sirovina (Trupci)</h3>
                    <div className="space-y-3">
                      {inventory.filter(i => i.category === 'Sirovina').map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">{item.name}</span>
                          <span className="text-sm font-bold text-slate-900">{item.quantity} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Poluproizvodi */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Poluproizvodi</h3>
                    <div className="space-y-3">
                      {inventory.filter(i => i.category === 'Poluproizvod').map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">{item.name}</span>
                          <span className="text-sm font-bold text-slate-900">{item.quantity} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workstations Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Pregled radnih stanica</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 md:p-6 gap-4">
              {workstations.map((ws) => (
                <div key={ws.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{ws.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{ws.id}</p>
                  </div>
                  <div>
                    {ws.status === 'Aktivno' && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Aktivno
                      </span>
                    )}
                    {ws.status === 'Mirovanje' && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span> Mirovanje
                      </span>
                    )}
                    {ws.status === 'Održavanje' && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                        <AlertCircle className="w-3.5 h-3.5" /> Održavanje
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'analitika' && (
        <div className="space-y-8">
          {/* Top Overview Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Ukupni prihodi (Ovaj mjesec)</h3>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">124.500 €</p>
              <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +12.5% u odnosu na prošli mjesec
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Troškovi sirovine</h3>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">42.300 €</p>
              <p className="text-sm text-red-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +5.2% u odnosu na prošli mjesec
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Procijenjena dobit</h3>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">82.200 €</p>
              <p className="text-sm text-slate-500 mt-2">Prije oporezivanja i ostalih troškova</p>
            </div>
          </div>

          {/* Past Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Povijest završenih narudžbi</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Narudžbe</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proizvod</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Količina</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Škart</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedOrders.length > 0 ? (
                    completedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-medium text-slate-900">{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-900 block">{order.productType}</span>
                          {order.dimensions && <span className="text-xs text-slate-500 block mt-0.5">Dim: {order.dimensions}</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-900">{order.totalQuantity} {order.unit}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-red-600 font-medium">{order.wasteQuantity} {order.unit}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                        Nema završenih narudžbi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

