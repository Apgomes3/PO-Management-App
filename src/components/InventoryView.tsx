import { motion } from 'motion/react';
import { Package, Search, Filter, AlertTriangle } from 'lucide-react';

export default function InventoryView({ onCreate }: { onCreate: () => void }) {
  const items = [
    { name: 'Steel Beams - 12m', code: 'ST-12M-001', stock: 142, unit: 'pcs', status: 'In Stock' },
    { name: 'Acrylic Panels - 4x8', code: 'AP-48-002', stock: 12, unit: 'pcs', status: 'Low Stock' },
    { name: 'Industrial Pumps - X100', code: 'IP-X100-003', stock: 4, unit: 'pcs', status: 'Out of Stock' },
    { name: 'PVC Pipes - 4"', code: 'PV-4-004', stock: 840, unit: 'm', status: 'In Stock' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Inventory Management</h2>
          <p className="text-on-surface-variant font-medium mt-1">Stock levels and material resource tracking.</p>
        </div>
        <button 
          onClick={onCreate}
          className="px-6 py-2 bg-primary text-white font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          + Add Item
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
            <input 
              type="text" 
              placeholder="Search inventory..."
              className="w-full bg-surface-container-lowest border-none rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest text-on-surface text-xs font-bold rounded-lg shadow-sm border border-outline-variant/20">
            <Filter size={14} />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low">
            <tr>
              {['Item Name', 'Item Code', 'Stock Level', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {items.map((item) => (
              <tr key={item.code} className="hover:bg-surface-container/30 transition-colors">
                <td className="px-6 py-4 font-body font-medium text-sm text-on-surface">{item.name}</td>
                <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{item.code}</td>
                <td className="px-6 py-4 font-headline font-bold text-sm text-on-surface">{item.stock} {item.unit}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'In Stock' ? 'bg-green-50 text-green-700' :
                    item.status === 'Low Stock' ? 'bg-secondary-container text-on-secondary-container' :
                    'bg-error-container/20 text-error'
                  }`}>
                    {item.status === 'Out of Stock' && <AlertTriangle size={10} />}
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary text-xs font-bold hover:underline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
