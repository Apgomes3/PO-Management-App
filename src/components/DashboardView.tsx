import { motion } from 'motion/react';
import { LayoutDashboard, TrendingUp, Users, Clock } from 'lucide-react';

interface DashboardProps {
  onCreatePO: () => void;
}

export default function DashboardView({ onCreatePO }: DashboardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Executive Dashboard</h2>
          <p className="text-on-surface-variant font-medium mt-1">Real-time operational overview and performance metrics.</p>
        </div>
        <button 
          onClick={onCreatePO}
          className="px-6 py-2 bg-primary text-white font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          + Quick PO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: '$2.4M', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Active Users', value: '1,284', icon: Users, color: 'text-blue-600' },
          { label: 'Avg. Lead Time', value: '14 Days', icon: Clock, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2 rounded-lg bg-surface-container`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <p className="text-outline text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-extrabold text-on-surface">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
        <h3 className="text-lg font-extrabold mb-6">Operational Efficiency</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-outline-variant/20 rounded-xl">
          <p className="text-outline-variant italic">Efficiency visualization coming soon...</p>
        </div>
      </div>
    </motion.div>
  );
}
