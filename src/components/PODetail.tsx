import { PurchaseOrder, POStage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Circle, Truck, CreditCard, Factory, FileCode, ShoppingCart, PackageCheck } from 'lucide-react';

interface PODetailProps {
  po: PurchaseOrder;
  onClose: () => void;
  onUpdate: (updatedPO: PurchaseOrder) => void;
}

const STAGES: { stage: POStage; label: string; icon: any }[] = [
  { stage: 'HQ_ISSUED', label: 'HQ Issued', icon: ShoppingCart },
  { stage: 'FACTORY_RECEIVED', label: 'Factory Received', icon: Factory },
  { stage: 'OPERATIONS_RELEASED', label: 'Ops Released', icon: PackageCheck },
  { stage: 'PROCUREMENT', label: 'Procurement', icon: ShoppingCart },
  { stage: 'ENGINEERING', label: 'Engineering', icon: FileCode },
  { stage: 'PRODUCTION', label: 'Production', icon: Factory },
  { stage: 'SHIPPING', label: 'Shipping', icon: Truck },
  { stage: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function PODetail({ po, onClose, onUpdate }: PODetailProps) {
  const currentStageIndex = STAGES.findIndex(s => s.stage === po.stage);

  const handleNextStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      onUpdate({ ...po, stage: STAGES[currentStageIndex + 1].stage });
    }
  };

  const handleAddPaymentClaim = () => {
    const amount = prompt('Enter payment claim amount:');
    if (amount) {
      const newClaim = {
        id: Math.random().toString(36).substr(2, 9),
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString(),
        status: 'Pending' as const,
        reference: `CLM-${Math.floor(Math.random() * 1000)}`
      };
      onUpdate({ ...po, paymentClaims: [...po.paymentClaims, newClaim] });
    }
  };

  const handleAddShipping = () => {
    const carrier = prompt('Enter carrier:');
    const tracking = prompt('Enter tracking number:');
    if (carrier && tracking) {
      onUpdate({
        ...po,
        shipping: {
          carrier,
          trackingNumber: tracking,
          estimatedDelivery: 'TBD',
          status: 'In Transit'
        }
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/20 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
          <div>
            <h2 className="text-xl font-extrabold text-on-surface">{po.poNumber}</h2>
            <p className="text-sm text-on-surface-variant font-medium">{po.projectName} ({po.projectCode})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Lifecycle Stepper */}
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-6">Process Lifecycle</h3>
            <div className="flex justify-between relative">
              <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-container -z-10" />
              <div 
                className="absolute top-5 left-0 h-[2px] bg-primary transition-all duration-500 -z-10" 
                style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
              />
              {STAGES.map((s, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const Icon = s.icon;
                
                return (
                  <div key={s.stage} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted ? 'bg-primary border-primary text-white' : 
                      isCurrent ? 'bg-surface-container-lowest border-primary text-primary shadow-md scale-110' : 
                      'bg-surface-container-lowest border-surface-container text-outline-variant'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-tighter text-center max-w-[60px] ${
                      isCurrent ? 'text-primary' : 'text-outline-variant'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Details & Actions */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Current Status</h3>
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <p className="text-sm font-semibold text-on-surface mb-2">
                    Stage: <span className="text-primary">{STAGES[currentStageIndex].label}</span>
                  </p>
                  <div className="flex gap-2 mt-4">
                    {po.stage === 'FACTORY_RECEIVED' && (
                      <button 
                        onClick={handleNextStage}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Release to Operations
                      </button>
                    )}
                    {po.stage === 'OPERATIONS_RELEASED' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onUpdate({ ...po, stage: 'PROCUREMENT' })}
                          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Initiate Procurement
                        </button>
                        <button 
                          onClick={() => onUpdate({ ...po, stage: 'ENGINEERING' })}
                          className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Initiate Engineering
                        </button>
                      </div>
                    )}
                    {(po.stage === 'PROCUREMENT' || po.stage === 'ENGINEERING') && (
                      <button 
                        onClick={() => onUpdate({ ...po, stage: 'PRODUCTION' })}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Start Production
                      </button>
                    )}
                    {po.stage === 'PRODUCTION' && (
                      <button 
                        onClick={() => onUpdate({ ...po, stage: 'SHIPPING' })}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Ready for Shipping
                      </button>
                    )}
                    {po.stage === 'SHIPPING' && (
                      <button 
                        onClick={() => onUpdate({ ...po, stage: 'DELIVERED' })}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Order Items</h3>
                <div className="space-y-3 mb-8">
                  {po.items && po.items.length > 0 ? (
                    po.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-surface-container-low border border-outline-variant/10 rounded-lg">
                        <div>
                          <p className="text-xs font-bold text-on-surface">{item.description}</p>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-outline-variant italic">No items listed.</p>
                  )}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-outline">Payment Claims</h3>
                  <button 
                    onClick={handleAddPaymentClaim}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    + Append Claim
                  </button>
                </div>
                <div className="space-y-2">
                  {po.paymentClaims.length === 0 ? (
                    <p className="text-xs text-outline-variant italic">No payment claims appended yet.</p>
                  ) : (
                    po.paymentClaims.map(claim => (
                      <div key={claim.id} className="flex justify-between items-center p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-lg">
                        <div>
                          <p className="text-xs font-bold text-on-surface">{claim.reference}</p>
                          <p className="text-[10px] text-outline-variant">{claim.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-on-surface">${claim.amount.toLocaleString()}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${
                            claim.status === 'Paid' ? 'text-green-600' : 'text-secondary'
                          }`}>{claim.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Shipping & Info */}
            <div className="space-y-8">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-outline">Shipping Information</h3>
                  {!po.shipping && (
                    <button 
                      onClick={handleAddShipping}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      + Add Shipping
                    </button>
                  )}
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl">
                  {po.shipping ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Truck className="text-primary" size={20} />
                        <div>
                          <p className="text-xs font-bold text-on-surface">{po.shipping.carrier}</p>
                          <p className="text-[10px] text-outline-variant">Tracking: {po.shipping.trackingNumber}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
                        <span className="text-[10px] font-bold text-outline uppercase">Status</span>
                        <span className="text-xs font-bold text-primary">{po.shipping.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-outline uppercase">Est. Delivery</span>
                        <span className="text-xs font-bold text-on-surface">{po.shipping.estimatedDelivery}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-outline-variant italic">Shipping information will be available once the order is ready for dispatch.</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Requirements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${po.requiresProcurement ? 'border-primary/20 bg-primary/5' : 'border-outline-variant/10 bg-surface-container-low'}`}>
                    <ShoppingCart size={16} className={po.requiresProcurement ? 'text-primary' : 'text-outline-variant'} />
                    <p className={`text-[10px] font-bold mt-2 ${po.requiresProcurement ? 'text-primary' : 'text-outline-variant'}`}>Procurement Required</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${po.requiresEngineering ? 'border-secondary/20 bg-secondary/5' : 'border-outline-variant/10 bg-surface-container-low'}`}>
                    <FileCode size={16} className={po.requiresEngineering ? 'text-secondary' : 'text-outline-variant'} />
                    <p className={`text-[10px] font-bold mt-2 ${po.requiresEngineering ? 'text-secondary' : 'text-outline-variant'}`}>Engineering Required</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-surface-container-highest text-on-surface font-bold text-xs uppercase tracking-widest rounded-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
