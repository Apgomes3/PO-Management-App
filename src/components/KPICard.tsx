import React from 'react';
import { KPIData } from '../types';
import { GitBranch, ClipboardCheck, Landmark, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

const icons = {
  allocation: GitBranch,
  approval: ClipboardCheck,
  budget: Landmark,
  projects: Bookmark,
};

const colors = {
  allocation: 'bg-primary/10 text-primary',
  approval: 'bg-secondary-container text-on-secondary-container',
  budget: 'bg-tertiary-container text-on-tertiary-container',
  projects: 'bg-surface-container-highest text-on-surface-variant',
};

const KPICard: React.FC<{ data: KPIData }> = ({ data }) => {
  const Icon = icons[data.type];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colors[data.type]}`}>
          <Icon size={20} />
        </div>
        {data.change && (
          <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full">
            {data.change}
          </span>
        )}
        {data.type === 'approval' && (
          <span className="text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full">
            Admin Priority
          </span>
        )}
        {data.type === 'budget' && (
          <span className="text-[10px] font-bold text-error bg-error-container/20 px-2 py-1 rounded-full">
            FY24 Q4
          </span>
        )}
      </div>
      
      <p className="text-outline text-[10px] font-bold uppercase tracking-widest mb-1">{data.label}</p>
      <h3 className="text-2xl font-extrabold text-on-surface">{data.value}</h3>
      
      {data.type === 'allocation' && (
        <div className="mt-4 h-1 bg-surface-container rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            className="h-full bg-primary"
          />
        </div>
      )}

      {data.type === 'approval' && (
        <div className="mt-4 flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <img 
              key={i}
              src={`https://picsum.photos/seed/user${i}/40/40`} 
              className="w-6 h-6 rounded-full border-2 border-surface-container-lowest"
              alt="Team member"
              referrerPolicy="no-referrer"
            />
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-surface-container-highest flex items-center justify-center text-[8px] font-bold">+2</div>
        </div>
      )}

      {data.subtext && data.type !== 'approval' && (
        <p className="text-[10px] text-outline-variant mt-2">{data.subtext}</p>
      )}

      {data.type === 'projects' && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-xs font-semibold text-on-surface">Great Barrier Reef Exhibit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="text-xs font-semibold text-on-surface">Amazon Flooded Forest</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;
