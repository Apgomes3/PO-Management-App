import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import PurchaseOrdersView from './components/PurchaseOrdersView';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import PODetail from './components/PODetail';
import CreateModal from './components/CreateModal';
import { KPI_STATS, PURCHASE_ORDERS as INITIAL_POS, SPENDING_VELOCITY, AUDIT_LOGS } from './constants';
import { PurchaseOrder, View, CreateAction } from './types';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('Purchase Orders');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_POS);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [activeCreateAction, setActiveCreateAction] = useState<CreateAction>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setActiveCreateAction('PO');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdatePO = (updatedPO: PurchaseOrder) => {
    setPurchaseOrders(prev => prev.map(po => po.id === updatedPO.id ? updatedPO : po));
    setSelectedPO(updatedPO);
  };

  const handleCreateSave = (data: any) => {
    if (activeCreateAction === 'PO') {
      const newPO: PurchaseOrder = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        amount: parseFloat(data.amount) || 0,
      };
      setPurchaseOrders(prev => [newPO, ...prev]);
    }
    // Handle other creations if needed
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardView onCreatePO={() => setActiveCreateAction('PO')} />;
      case 'Purchase Orders':
        return (
          <PurchaseOrdersView 
            kpiStats={KPI_STATS}
            purchaseOrders={purchaseOrders}
            spendingVelocity={SPENDING_VELOCITY}
            auditLogs={AUDIT_LOGS}
            onSelectPO={setSelectedPO}
            onCreatePO={() => setActiveCreateAction('PO')}
          />
        );
      case 'Projects':
        return <ProjectsView onCreate={() => setActiveCreateAction('Project')} />;
      default:
        return <DashboardView onCreatePO={() => setActiveCreateAction('PO')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onNewPO={() => setActiveCreateAction('PO')}
      />
      <TopNav 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onQuickCreate={() => setActiveCreateAction('PO')}
      />
      
      <main className="ml-64 pt-16 p-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* PO Detail Modal */}
      <AnimatePresence>
        {selectedPO && (
          <PODetail 
            po={selectedPO} 
            onClose={() => setSelectedPO(null)} 
            onUpdate={handleUpdatePO}
          />
        )}
      </AnimatePresence>

      {/* Creation Modals */}
      <AnimatePresence>
        {activeCreateAction && (
          <CreateModal 
            action={activeCreateAction}
            onClose={() => setActiveCreateAction(null)}
            onSave={handleCreateSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
