
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
  const [billItems, setBillItems] = useState<Array<{
    id: string;
    medicineName: string;
    quantity: number;
    price: number;
    value: number;
    profit: number;
  }>>([]);

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
      // setBillPreview(null);
    });
  };

  const addToBill = () => {
    if (!shopName) return;
    const value = selectedMed.price * quantity;
    const profit = value * selectedMed.profitMargin;
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      medicineName: selectedMed.name,
      quantity,
      price: selectedMed.price,
      value,
      profit,
    };
    setBillItems((s) => [...s, item]);
    setQuantity(1);
  };

  const removeBillItem = (id: string) => {
    setBillItems((s) => s.filter(i => i.id !== id));
  };

  const sendToProcess = () => {
    if (!shopName || billItems.length === 0) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const ts = new Date().toISOString();
      billItems.forEach(item => {
        onAdd({
          id: Math.random().toString(36).substr(2, 9),
          salesmanId: user.id,
          salesmanName: user.name,
          shopName,
          medicineName: item.medicineName,
          quantity: item.quantity,
          value: item.value,
          profit: item.profit,
          timestamp: ts,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        });
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setShopName('');
      setQuantity(1);
      setBillItems([]);
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
          type="button"
          onClick={addToBill}
          className="w-full mb-3 py-4 bg-emerald-600 text-white rounded-[1.25rem] font-black uppercase text-xs tracking-widest shadow-md flex items-center justify-center space-x-2"
        >
          <span>Add To Bill</span>
        </button>

        <button 
          type="submit"
          className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Sales Data</span>
        </button>

        {success && <p className="text-center text-green-600 font-black text-xs animate-bounce">ENTRY RECORDED</p>}
      </form>

      <div className="mt-6">
        <h4 className="font-bold text-slate-800">Bill Preview</h4>
        {billItems.length === 0 ? (
          <p className="text-slate-400 text-xs italic">No items in bill. Add products to build a bill.</p>
        ) : (
          <div className="mt-3 p-4 bg-white border border-slate-100 rounded-[1.5rem] space-y-4">
            {billItems.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{item.medicineName} x {item.quantity}</p>
                  <p className="text-[10px] text-slate-400">Rate ₹{item.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600">₹{item.value}</p>
                  <button onClick={() => removeBillItem(item.id)} className="text-xs text-red-500 font-bold mt-1">Remove</button>
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="font-bold">Total</div>
              <div className="text-right">
                <div className="font-black text-blue-600">₹{billItems.reduce((s, i) => s + i.value, 0)}</div>
                <div className="text-[10px] text-slate-400">Profit ₹{billItems.reduce((s, i) => s + i.profit, 0).toFixed(2)}</div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={sendToProcess}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest "
              >
                Send to Process
              </button>
            </div>
          </div>
        )}
      </div>

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
