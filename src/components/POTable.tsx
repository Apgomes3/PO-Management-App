import { PurchaseOrder } from '../types';
import { Eye, Edit2 } from 'lucide-react';

export default function POTable({ orders, onSelect }: { orders: PurchaseOrder[], onSelect: (po: PurchaseOrder) => void }) {
  const statusStyles = {
    Approved: 'bg-green-50 text-green-700',
    Pending: 'bg-secondary-container text-on-secondary-container',
    Rejected: 'bg-error-container/20 text-error',
  };

  const stageLabels: Record<string, string> = {
    HQ_ISSUED: 'HQ Issued',
    FACTORY_RECEIVED: 'Factory Received',
    OPERATIONS_RELEASED: 'Ops Released',
    PROCUREMENT: 'Procurement',
    ENGINEERING: 'Engineering',
    PRODUCTION: 'Production',
    SHIPPING: 'Shipping',
    DELIVERED: 'Delivered',
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low">
            <tr>
              {['PO Number', 'Project', 'Stage', 'Date', 'Amount', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {orders.map((order, idx) => (
              <tr 
                key={order.id} 
                onClick={() => onSelect(order)}
                className={`hover:bg-surface-container/30 transition-colors cursor-pointer ${idx % 2 !== 0 ? 'bg-surface-container-low/20' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="font-headline font-bold text-sm text-on-surface">{order.poNumber}</div>
                  <div className="text-[10px] text-outline font-mono">{order.projectCode}</div>
                </td>
                <td className="px-6 py-4 font-body font-medium text-sm text-on-surface">{order.projectName}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {stageLabels[order.stage]}
                  </span>
                </td>
                <td className="px-6 py-4 font-body text-xs text-on-surface-variant">{order.date}</td>
                <td className="px-6 py-4 font-headline font-bold text-sm text-on-surface">
                  {order.amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.amount) : '---'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-surface-container-high rounded text-outline transition-colors">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-surface-container-high rounded text-outline transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 flex items-center justify-between border-t border-surface-container bg-surface-container-lowest">
        <button className="px-4 py-2 border border-outline-variant/30 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
          Previous
        </button>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-xs font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant text-xs font-bold transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant text-xs font-bold transition-colors">3</button>
          <span className="px-1 py-2 text-outline-variant">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant text-xs font-bold transition-colors">70</button>
        </div>
        <button className="px-4 py-2 border border-outline-variant/30 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}
