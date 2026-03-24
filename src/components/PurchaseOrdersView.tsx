import { PurchaseOrder, KPIData, SpendingData, AuditLog } from '../types';
import KPICard from './KPICard';
import POTable from './POTable';
import SpendingChart from './SpendingChart';
import AuditLedger from './AuditLedger';
import { Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface PurchaseOrdersViewProps {
  kpiStats: KPIData[];
  purchaseOrders: PurchaseOrder[];
  spendingVelocity: SpendingData[];
  auditLogs: AuditLog[];
  onSelectPO: (po: PurchaseOrder) => void;
  onCreatePO: () => void;
}

export default function PurchaseOrdersView({ 
  kpiStats, 
  purchaseOrders, 
  spendingVelocity, 
  auditLogs, 
  onSelectPO,
  onCreatePO
}: PurchaseOrdersViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Purchase Orders</h2>
          <p className="text-on-surface-variant font-medium mt-1">Internal procurement management and project allocation tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-surface-container-highest transition-colors">
            Export Ledger
          </button>
          <button 
            onClick={onCreatePO}
            className="px-6 py-2 bg-gradient-to-r from-primary to-primary-dim text-white font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            + Internal Order
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpiStats.map((stat) => (
          <KPICard key={stat.label} data={stat} />
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest text-on-surface text-xs font-bold rounded-lg shadow-sm border border-outline-variant/20">
            <Filter size={14} />
            Filters
          </button>
          <div className="h-4 w-[1px] bg-outline-variant/30"></div>
          <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg">All Status</button>
          <button className="px-3 py-1.5 hover:bg-surface-container-highest text-on-surface-variant text-xs font-bold rounded-lg transition-colors">By Project Code</button>
          <button className="px-3 py-1.5 hover:bg-surface-container-highest text-on-surface-variant text-xs font-bold rounded-lg transition-colors">FY 2024</button>
        </div>
        <div className="flex items-center gap-2 text-outline-variant text-xs font-medium">
          <span>Viewing ledger records 1-12 of 842</span>
        </div>
      </div>

      {/* Data Table */}
      <POTable orders={purchaseOrders} onSelect={onSelectPO} />

      {/* Bottom Charts/Logs */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-extrabold mb-4">Project Spending Velocity</h3>
          <SpendingChart data={spendingVelocity} />
        </div>
        <div>
          <h3 className="text-lg font-extrabold mb-4">Audit Ledger</h3>
          <AuditLedger logs={auditLogs} />
        </div>
      </div>
    </motion.div>
  );
}
