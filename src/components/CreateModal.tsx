import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2 } from 'lucide-react';
import { CreateAction, PurchaseOrder, POItem, POItemType } from '../types';

interface CreateModalProps {
  action: CreateAction;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ITEM_TYPES: POItemType[] = ['Tanks', 'LSS', 'Acrylic', 'Rockwork', 'Components', 'Electrical', 'Other'];

export default function CreateModal({ action, onClose, onSave }: CreateModalProps) {
  const [formData, setFormData] = useState<any>({
    poNumber: `#PO-24-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    projectName: '',
    projectCode: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    amount: '',
    requiresProcurement: false,
    requiresEngineering: false,
    status: 'Pending',
    stage: 'HQ_ISSUED',
    paymentClaims: [],
    items: [{ id: Math.random().toString(36).substr(2, 9), description: '', type: '' }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out items that are empty (no description OR no type)
    const validItems = formData.items.filter((item: POItem) => item.description.trim() !== '' && item.type !== '');
    
    if (validItems.length === 0) {
      alert('Please add at least one complete item (description and type).');
      return;
    }

    onSave({ ...formData, items: validItems });
    onClose();
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: keyof POItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-add new line if type is selected on the last item
    if (field === 'type' && value !== '' && index === formData.items.length - 1) {
      newItems.push({ id: Math.random().toString(36).substr(2, 9), description: '', type: '' });
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const renderForm = () => {
    switch (action) {
      case 'PO':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">PO Number</label>
                <input 
                  type="text" 
                  value={formData.poNumber}
                  readOnly
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Date</label>
                <input 
                  type="text" 
                  value={formData.date}
                  readOnly
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Project Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Great Barrier Reef"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Project Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. EXH-GBR-402"
                  value={formData.projectCode}
                  onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Order Items</label>
              </div>
              
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-12 gap-2 px-2 pb-2 border-b border-outline-variant/10">
                  <div className="col-span-7 text-[9px] font-bold uppercase tracking-widest text-outline-variant">Description</div>
                  <div className="col-span-4 text-[9px] font-bold uppercase tracking-widest text-outline-variant">Type</div>
                  <div className="col-span-1"></div>
                </div>
                {formData.items.map((item: any, index: number) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center py-1 group">
                    <div className="col-span-7">
                      <input 
                        type="text"
                        placeholder="Item description..."
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-outline-variant/30 focus:border-primary/50 px-2 py-1.5 text-xs text-on-surface transition-all outline-none"
                      />
                    </div>
                    <div className="col-span-4">
                      <select 
                        value={item.type}
                        onChange={(e) => updateItem(index, 'type', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-outline-variant/30 focus:border-primary/50 px-2 py-1.5 text-xs text-on-surface transition-all outline-none cursor-pointer"
                      >
                        <option value="" disabled>Select Type</option>
                        {ITEM_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length <= 1}
                        className="text-on-surface-variant hover:text-error disabled:opacity-0 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.requiresProcurement}
                    onChange={(e) => setFormData({ ...formData, requiresProcurement: e.target.checked })}
                    className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20"
                  />
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-widest">Requires Procurement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.requiresEngineering}
                    onChange={(e) => setFormData({ ...formData, requiresEngineering: e.target.checked })}
                    className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20"
                  />
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-widest">Requires Engineering</span>
                </label>
              </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2 bg-surface-container-high text-on-surface font-bold text-xs uppercase tracking-widest rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Create Order
              </button>
            </div>
          </form>
        );
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-extrabold text-on-surface">Action Not Available</h3>
            <p className="text-sm text-on-surface-variant mb-8">This creation type is currently disabled.</p>
            <button onClick={onClose} className="px-6 py-2 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-lg">Close</button>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (action) {
      case 'PO': return 'Issue Internal Purchase Order';
      case 'Project': return 'Register New Project';
      default: return '';
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
        className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight uppercase tracking-widest">{getTitle()}</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {renderForm()}
        </div>
      </motion.div>
    </motion.div>
  );
}
