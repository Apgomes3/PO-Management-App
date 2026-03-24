import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';

export default function ReportsView({ onCreate }: { onCreate: () => void }) {
  const reports = [
    { title: 'Monthly Procurement Summary', date: 'Mar 2024', type: 'Financial' },
    { title: 'Project Allocation Efficiency', date: 'Feb 2024', type: 'Operational' },
    { title: 'Inventory Turnover Analysis', date: 'Feb 2024', type: 'Logistics' },
    { title: 'Quarterly HQ Budget Review', date: 'Q1 2024', type: 'Financial' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Reports & Analytics</h2>
          <p className="text-on-surface-variant font-medium mt-1">Operational insights and performance analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-surface-container-highest transition-colors">
            <Calendar size={14} className="inline mr-2" />
            Select Period
          </button>
          <button 
            onClick={onCreate}
            className="px-6 py-2 bg-primary text-white font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.title} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex justify-between items-center group hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-surface-container text-primary group-hover:bg-primary/10 transition-colors">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-on-surface">{report.title}</h3>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{report.date} • {report.type}</p>
              </div>
            </div>
            <button className="p-2 text-outline-variant hover:text-primary transition-colors">
              <Download size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-extrabold">Procurement Trends</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600">
            <TrendingUp size={16} />
            <span>+12.4% vs last quarter</span>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-outline-variant/20 rounded-xl">
          <p className="text-outline-variant italic">Trend visualization coming soon...</p>
        </div>
      </div>
    </motion.div>
  );
}
