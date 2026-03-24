import { motion } from 'motion/react';
import { Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ProjectsView({ onCreate }: { onCreate: () => void }) {
  const projects = [
    { name: 'Great Barrier Reef Exhibit', code: 'EXH-GBR-402', status: 'In Progress', progress: 65 },
    { name: 'Amazon Flooded Forest', code: 'FOR-AMZ-201', status: 'Planning', progress: 20 },
    { name: 'Atlantic Deep Water', code: 'DW-ATL-099', status: 'On Hold', progress: 45 },
    { name: 'Arctic Tundra', code: 'EXH-ARC-105', status: 'Completed', progress: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Projects Portfolio</h2>
          <p className="text-on-surface-variant font-medium mt-1">Active project tracking and resource allocation.</p>
        </div>
        <button 
          onClick={onCreate}
          className="px-6 py-2 bg-primary text-white font-headline font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.code} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-on-surface">{project.name}</h3>
                <p className="text-[10px] text-outline font-mono uppercase tracking-widest">{project.code}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                project.status === 'Completed' ? 'bg-green-50 text-green-700' :
                project.status === 'On Hold' ? 'bg-error-container/20 text-error' :
                'bg-secondary-container text-on-secondary-container'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-outline uppercase">Progress</span>
                <span className="text-xs font-bold text-on-surface">{project.progress}%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  className={`h-full ${project.status === 'Completed' ? 'bg-green-500' : 'bg-primary'}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
