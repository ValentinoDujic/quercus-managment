'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, Workstation, Stage, InventoryItem } from '@/types';

export interface Worker {
  id: number;
  name: string;
  pin: string;
}

interface MesContextType {
  orders: Order[];
  workstations: Workstation[];
  workers: Worker[];
  inventory: InventoryItem[];
  updateOrderProgress: (
    orderId: string,
    addedQuantity: number,
    addedWaste: number,
    nextStage?: Stage,
    workerId?: number
  ) => void;
  savePartialProgress: (
    orderId: string,
    addedQuantity: number,
    addedWaste: number,
    workerId: number
  ) => void;
  addNewOrder: (newOrder: Omit<Order, 'id'>) => void;
  setActiveWorker: (orderId: string, workerId: number | null) => void;
}

const initialWorkers: Worker[] = [
  { id: 1, name: 'Ivan Horvat', pin: '1111' },
  { id: 2, name: 'Marko Kovač', pin: '2222' },
];

const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    productType: 'Hrastove daske (Klasa A)',
    totalQuantity: 45,
    completedQuantity: 15,
    wasteQuantity: 2,
    unit: 'm3',
    currentStage: 'Pilana',
    priority: 'Hitno',
    status: 'U tijeku',
  },
  {
    id: 'ORD-1002',
    productType: 'Jasen lamele',
    totalQuantity: 1150,
    completedQuantity: 0,
    wasteQuantity: 0,
    unit: 'm2',
    currentStage: 'Sušara',
    priority: 'Normalno',
    status: 'Na čekanju',
    dimensions: '4.2 x 95 x 1820 mm',
    qualityMix: '85-90% Klasa A, 10-15% Kern',
    deadline: 'Kraj svibnja 2026',
    priceDetails: 'EXW 9,50 EUR/m2 (A), 8,00 EUR/m2 (Kern)'
  },
  {
    id: 'ORD-1003',
    productType: 'Epoxy stol (Po mjeri)',
    totalQuantity: 2,
    completedQuantity: 1,
    wasteQuantity: 0,
    unit: 'kom',
    currentStage: 'Montaža',
    priority: 'Hitno',
    status: 'U tijeku',
  },
  {
    id: 'ORD-1004',
    productType: 'Briketi od biomase',
    totalQuantity: 20,
    completedQuantity: 20,
    wasteQuantity: 0,
    unit: 'palete',
    currentStage: 'Završeno',
    priority: 'Normalno',
    status: 'Završeno',
  },
  {
    id: 'ORD-1005',
    productType: 'Hrastove grede (Konstrukcijske)',
    totalQuantity: 120,
    completedQuantity: 60,
    wasteQuantity: 5,
    unit: 'kom',
    currentStage: 'Blanjanje',
    priority: 'Normalno',
    status: 'U tijeku',
  },
];

const initialWorkstations: Workstation[] = [
  { id: 'WS-01', name: 'Glavna pila (Tračna)', status: 'Aktivno' },
  { id: 'WS-02', name: 'Sušara 1', status: 'Aktivno' },
  { id: 'WS-03', name: 'Sušara 2', status: 'Održavanje' },
  { id: 'WS-04', name: 'Linija za blanjanje A', status: 'Mirovanje' },
  { id: 'WS-05', name: 'Stanica za montažu 1', status: 'Aktivno' },
];

const initialInventory: InventoryItem[] = [
  { id: 'INV-1', name: 'Hrast trupci (Klasa F)', category: 'Sirovina', quantity: 120, unit: 'm3' },
  { id: 'INV-2', name: 'Jasen trupci', category: 'Sirovina', quantity: 85, unit: 'm3' },
  { id: 'INV-3', name: 'Hrast daske neokrajčene', category: 'Poluproizvod', quantity: 40, unit: 'm3' },
  { id: 'INV-4', name: 'Epoxy smola', category: 'Sirovina', quantity: 500, unit: 'kg' },
];

const MesContext = createContext<MesContextType | undefined>(undefined);

export function MesProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [workstations, setWorkstations] = useState<Workstation[]>(
    initialWorkstations
  );
  const [workers] = useState<Worker[]>(initialWorkers);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

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

  const setActiveWorker = (orderId: string, workerId: number | null) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, activeWorkerId: workerId } : o))
    );
  };

  const updateOrderProgress = (
    orderId: string,
    addedQuantity: number,
    addedWaste: number,
    nextStage?: Stage,
    workerId?: number
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          let newCompleted = order.completedQuantity + addedQuantity;
          const newWaste = order.wasteQuantity + addedWaste;
          let newStage = nextStage || order.currentStage;
          let newStatus = order.status;

          if (newCompleted >= order.totalQuantity && order.currentStage !== 'Završeno') {
            newStage = getNextStage(order.currentStage);
            if (newStage === 'Završeno') {
              newStatus = 'Završeno';
              newCompleted = order.totalQuantity;
            } else {
              newStatus = 'Na čekanju';
              newCompleted = 0;
            }
          } else if (newStage !== order.currentStage && newStage !== 'Završeno') {
            newStatus = 'Na čekanju';
            newCompleted = 0;
          } else if (newCompleted > 0 || newStatus === 'Na čekanju') {
            newStatus = 'U tijeku';
          }

          return {
            ...order,
            completedQuantity: newCompleted,
            wasteQuantity: newWaste,
            currentStage: newStage,
            status: newStatus,
            activeWorkerId: null,
          };
        }
        return order;
      })
    );
  };

  const savePartialProgress = (
    orderId: string,
    addedQuantity: number,
    addedWaste: number,
    workerId: number
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          let newCompleted = order.completedQuantity + addedQuantity;
          const newWaste = order.wasteQuantity + addedWaste;
          let newStage = order.currentStage;
          let newStatus = order.status;

          if (newCompleted >= order.totalQuantity && order.currentStage !== 'Završeno') {
            newStage = getNextStage(order.currentStage);
            if (newStage === 'Završeno') {
              newStatus = 'Završeno';
              newCompleted = order.totalQuantity;
            } else {
              newStatus = 'Na čekanju';
              newCompleted = 0;
            }
          } else if (newCompleted > 0 || newStatus === 'Na čekanju') {
            newStatus = 'U tijeku';
          }

          return {
            ...order,
            completedQuantity: newCompleted,
            wasteQuantity: newWaste,
            currentStage: newStage,
            status: newStatus,
            activeWorkerId: null,
          };
        }
        return order;
      })
    );
  };

  const addNewOrder = (newOrder: Omit<Order, 'id'>) => {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrders((prev) => [...prev, { ...newOrder, id: newId }]);
  };

  return (
    <MesContext.Provider value={{ orders, workstations, workers, inventory, updateOrderProgress, savePartialProgress, addNewOrder, setActiveWorker }}>
      {children}
    </MesContext.Provider>
  );
}

export function useMes() {
  const context = useContext(MesContext);
  if (context === undefined) {
    throw new Error('useMes must be used within a MesProvider');
  }
  return context;
}
