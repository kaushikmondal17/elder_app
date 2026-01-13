
import React, { useState } from 'react';
import { User, SalesRecord } from '../types';
import { MOCK_MEDICINES } from '../constants';
import { PlusCircle, Store, Package } from 'lucide-react';

interface SalesEntryProps {
  user: User;
  onAdd: (record: SalesRecord) => void;
  history: SalesRecord[];
}

const SalesEntry: React.FC<SalesEntryProps> = ({ user, onAdd, history }) => {
  const [shopName, setShopName] = useState('');
  const [selectedMed, setSelectedMed] = useState(MOCK_MEDICINES[0]);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName) return;

    const value = selectedMed.price * quantity;
    const profit = value * selectedMed.profitMargin;

    navigator.geolocation.getCurrentPosition((pos) => {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        salesmanId: user.id,
        salesmanName: user.name,
        shopName,
        medicineName: selectedMed.name,
        quantity,
        value,
        profit,
        timestamp: new Date().toISOString(),
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setShopName('');
      setQuantity(1);
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Visit & Log</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Partner Store</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="text"
                placeholder="Pharmacy Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Medicine Product</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select 
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border-0 rounded-2xl outline-none font-bold appearance-none"
                  value={selectedMed.name}
                  onChange={(e) => {
                    const med = MOCK_MEDICINES.find(m => m.name === e.target.value);
                    if (med) setSelectedMed(med);
                  }}
                >
                  {MOCK_MEDICINES.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                <input 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-4 bg-slate-50 border-0 rounded-2xl font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Value</label>
                <div className="w-full py-4 bg-blue-50 text-blue-700 font-black text-center rounded-2xl">
                  ₹{selectedMed.price * quantity}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Sales Data</span>
        </button>

        {success && <p className="text-center text-green-600 font-black text-xs animate-bounce">ENTRY RECORDED</p>}
      </form>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-800">Your Activity Today</h4>
        {history.length === 0 ? (
          <p className="text-slate-400 text-xs italic">No logs yet.</p>
        ) : (
          history.map(h => (
            <div key={h.id} className="p-4 bg-white border border-slate-100 rounded-[1.5rem] flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">{h.shopName}</p>
                <p className="text-[10px] text-slate-400 font-bold">{h.medicineName} x {h.quantity}</p>
              </div>
              <p className="font-black text-blue-600">₹{h.value}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesEntry;
