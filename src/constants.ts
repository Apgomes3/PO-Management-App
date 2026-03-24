import { PurchaseOrder, KPIData, AuditLog, SpendingData } from './types';

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: '#PO-24-GBR-01',
    projectName: 'Great Barrier Reef Exhibit',
    projectCode: 'EXH-GBR-402',
    date: 'Nov 02, 2023',
    amount: 42150.00,
    status: 'Approved',
    stage: 'PRODUCTION',
    paymentClaims: [
      { id: 'pc1', amount: 15000, date: 'Nov 15, 2023', status: 'Paid', reference: 'INV-001' }
    ],
    requiresProcurement: true,
    requiresEngineering: true,
    items: [
      { id: 'i1', description: 'Main Tank Acrylic Panel', type: 'Acrylic' },
      { id: 'i2', description: 'LSS Filtration Unit', type: 'LSS' }
    ]
  },
  {
    id: '2',
    poNumber: '#PO-24-AMZ-12',
    projectName: 'Amazon Flooded Forest',
    projectCode: 'FOR-AMZ-201',
    date: 'Nov 04, 2023',
    amount: 12400.00,
    status: 'Pending',
    stage: 'FACTORY_RECEIVED',
    paymentClaims: [],
    requiresProcurement: false,
    requiresEngineering: true,
    items: [
      { id: 'i3', description: 'Artificial Rockwork Set', type: 'Rockwork' }
    ]
  },
  {
    id: '3',
    poNumber: '#PO-24-ATL-05',
    projectName: 'Atlantic Deep Water',
    projectCode: 'DW-ATL-099',
    date: 'Oct 28, 2023',
    amount: 125000.00,
    status: 'Rejected',
    stage: 'HQ_ISSUED',
    paymentClaims: [],
    requiresProcurement: true,
    requiresEngineering: true,
    items: [
      { id: 'i4', description: 'Deep Water Tank Structure', type: 'Tanks' },
      { id: 'i5', description: 'Electrical Control Panel', type: 'Electrical' }
    ]
  },
  {
    id: '4',
    poNumber: '#PO-24-AMZ-15',
    projectName: 'Amazon Flooded Forest',
    projectCode: 'FOR-AMZ-201',
    date: 'Nov 05, 2023',
    amount: 2300.50,
    status: 'Approved',
    stage: 'SHIPPING',
    paymentClaims: [
      { id: 'pc2', amount: 2300.50, date: 'Dec 01, 2023', status: 'Approved', reference: 'INV-002' }
    ],
    shipping: {
      carrier: 'Global Logistics',
      trackingNumber: 'GL-123456789',
      estimatedDelivery: 'Dec 15, 2023',
      status: 'In Transit'
    },
    requiresProcurement: false,
    requiresEngineering: false,
    items: [
      { id: 'i6', description: 'Small Components Kit', type: 'Components' }
    ]
  }
];

export const KPI_STATS: KPIData[] = [
  {
    label: 'Project Allocation',
    value: '14 active',
    change: '+8.2%',
    type: 'allocation'
  },
  {
    label: 'Pending Approval',
    value: '18 Orders',
    subtext: 'Admin Priority',
    type: 'approval'
  },
  {
    label: 'Headquarters Budget',
    value: '$8.6M',
    subtext: 'Utilization: 72% Approved',
    type: 'budget'
  },
  {
    label: 'Active Projects',
    value: '2 Projects',
    type: 'projects'
  }
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    type: 'Allocation Approved',
    message: "#PO-24-GBR-01 assigned to 'Great Barrier Reef'",
    time: '12m ago'
  },
  {
    id: '2',
    type: 'Internal Draft',
    message: "Draft order created for 'Atlantic Deep Water'",
    time: '2h ago'
  },
  {
    id: '3',
    type: 'Exceeded Ceiling',
    message: "Project 'Amazon Forest' request held for review",
    time: '5h ago'
  }
];

export const SPENDING_VELOCITY: SpendingData[] = [
  { code: 'GBR', value: 40 },
  { code: 'AMZ', value: 75 },
  { code: 'ATL', value: 90 },
  { code: 'ARC', value: 35 },
  { code: 'IND', value: 55 },
  { code: 'PAC', value: 65 }
];
