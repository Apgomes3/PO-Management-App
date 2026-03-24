export type View = 'Dashboard' | 'Purchase Orders' | 'Projects';
export type CreateAction = 'PO' | 'Project' | null;

export type POStage = 
  | 'HQ_ISSUED' 
  | 'FACTORY_RECEIVED' 
  | 'OPERATIONS_RELEASED' 
  | 'PROCUREMENT' 
  | 'ENGINEERING' 
  | 'PRODUCTION' 
  | 'SHIPPING' 
  | 'DELIVERED';

export interface PaymentClaim {
  id: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Paid';
  reference: string;
}

export interface ShippingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  status: 'In Transit' | 'At Port' | 'Delivered';
}

export type POItemType = 
  | 'Tanks' 
  | 'LSS' 
  | 'Acrylic' 
  | 'Rockwork' 
  | 'Components' 
  | 'Electrical' 
  | 'Other'
  | '';

export interface POItem {
  id: string;
  description: string;
  type: POItemType;
  quantity?: number;
  unit?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  projectName: string;
  projectCode: string;
  date: string;
  amount?: number; // Optional as per user request for factory view
  status: 'Approved' | 'Pending' | 'Rejected';
  stage: POStage;
  paymentClaims: PaymentClaim[];
  shipping?: ShippingInfo;
  requiresProcurement: boolean;
  requiresEngineering: boolean;
  items: POItem[];
}

export interface KPIData {
  label: string;
  value: string;
  change?: string;
  type: 'allocation' | 'approval' | 'budget' | 'projects';
  subtext?: string;
}

export interface AuditLog {
  id: string;
  type: 'Allocation Approved' | 'Internal Draft' | 'Exceeded Ceiling';
  message: string;
  time: string;
}

export interface SpendingData {
  code: string;
  value: number;
}
