import { Search, Bell, Settings } from 'lucide-react';
import { View } from '../types';

interface TopNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onQuickCreate: () => void;
}

export default function TopNav({ currentView, onViewChange, onQuickCreate }: TopNavProps) {
  const navItems: View[] = ['Dashboard', 'Purchase Orders', 'Projects'];

  return (
    <header className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-8 h-16 ml-0 pl-[calc(16rem+2rem)]">
      <div className="flex items-center gap-8">
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button 
              key={item}
              onClick={() => onViewChange(item)}
              className={`font-headline text-sm font-semibold tracking-tight transition-colors cursor-pointer ${
                currentView === item 
                  ? 'text-primary border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={onQuickCreate}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          + New PO
        </button>

        <div className="relative w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
          <input 
            type="text" 
            placeholder="Search POs or projects..."
            className="w-full bg-surface-container border-none rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-md transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-md transition-all">
            <Settings size={20} />
          </button>
          <div className="h-6 w-[1px] bg-outline-variant/30"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface leading-none">Marcus Thorne</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">Head of Procurement</p>
            </div>
            <img 
              src="https://picsum.photos/seed/executive/100/100" 
              alt="Marcus Thorne" 
              className="w-9 h-9 rounded-full border border-outline-variant/20 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
