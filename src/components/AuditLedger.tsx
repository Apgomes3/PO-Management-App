import { AuditLog } from '../types';

export default function AuditLedger({ logs }: { logs: AuditLog[] }) {
  const typeStyles = {
    'Allocation Approved': 'text-primary border-primary',
    'Internal Draft': 'text-on-surface-variant border-outline-variant',
    'Exceeded Ceiling': 'text-error border-error',
  };

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div 
          key={log.id} 
          className={`p-4 rounded-xl relative border-l-4 shadow-sm transition-all hover:translate-x-1 ${
            log.type === 'Allocation Approved' ? 'bg-surface-container-lowest' : 'bg-surface-container opacity-80'
          } ${typeStyles[log.type].split(' ')[1]}`}
        >
          <div className="flex justify-between items-start mb-1">
            <p className={`text-[10px] font-bold uppercase tracking-wider ${typeStyles[log.type].split(' ')[0]}`}>
              {log.type}
            </p>
            <span className="text-[9px] text-outline-variant">{log.time}</span>
          </div>
          <p className={`text-xs font-semibold ${log.type === 'Allocation Approved' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
            {log.message}
          </p>
        </div>
      ))}
    </div>
  );
}
