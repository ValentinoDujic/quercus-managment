export type Unit = 'm3' | 'm2' | 'kom' | 'palete' | 'kg';
export type Stage = 'Pilana' | 'Sušara' | 'Blanjanje' | 'Montaža' | 'Završeno';
export type Priority = 'Normalno' | 'Hitno';
export type OrderStatus = 'Na čekanju' | 'U tijeku' | 'Završeno';

export interface Order {
  id: string;
  productType: string;
  totalQuantity: number;
  completedQuantity: number;
  wasteQuantity: number;
  unit: Unit;
  currentStage: Stage;
  priority: Priority;
  status: OrderStatus;
  dimensions?: string;
  qualityMix?: string;
  deadline?: string;
  priceDetails?: string;
  activeWorkerId?: number | null;
}

export type WorkstationStatus = 'Aktivno' | 'Mirovanje' | 'Održavanje';

export interface Workstation {
  id: string;
  name: string;
  status: WorkstationStatus;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Sirovina' | 'Poluproizvod' | 'Gotov proizvod';
  quantity: number;
  unit: Unit;
}
