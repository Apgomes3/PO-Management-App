import { SpendingData } from '../types';
import { motion } from 'motion/react';

export default function SpendingChart({ data }: { data: SpendingData[] }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl h-64 flex flex-col justify-end border border-outline-variant/10 shadow-sm">
      <div className="flex items-end justify-between h-40 gap-4">
        {data.map((item) => (
          <div key={item.code} className="w-full bg-surface-container rounded-t-lg relative group">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${item.value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute bottom-0 w-full bg-primary-dim rounded-t-lg transition-all group-hover:bg-primary"
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline-variant">
              {item.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
