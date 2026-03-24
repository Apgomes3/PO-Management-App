import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  Package, 
  BarChart3, 
  HelpCircle, 
  Archive,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onNewPO: () => void;
}

export default function Sidebar({ currentView, onViewChange, onNewPO }: SidebarProps) {
  const navItems: { icon: any; label: View }[] = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: FileText, label: 'Purchase Orders' },
    { icon: Target, label: 'Projects' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/20 flex flex-col p-4 space-y-2 z-50">
      <div className="px-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-dim flex items-center justify-center text-white shadow-sm">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-primary-dim leading-none tracking-tight">ProcureArch</h1>
            <p className="font-headline font-bold text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">HQ Operations</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ x: 4 }}
            onClick={() => onViewChange(item.label)}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
              currentView === item.label 
                ? 'bg-surface-container-lowest text-primary shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <item.icon size={18} className="mr-3" />
            <span className="font-headline font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="px-2 mb-6">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onNewPO}
          className="w-full py-3 px-4 bg-primary-dim text-white rounded-xl font-headline font-bold text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
        >
          Create New PO
        </motion.button>
      </div>

      <div className="pt-4 border-t border-outline-variant/20 space-y-1">
        <a className="flex items-center px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer">
          <HelpCircle size={14} className="mr-3" />
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest">Support</span>
        </a>
        <a className="flex items-center px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer">
          <Archive size={14} className="mr-3" />
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest">Archive</span>
        </a>
      </div>
    </aside>
  );
}
