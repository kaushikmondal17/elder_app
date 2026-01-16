
import React, { useState } from 'react';
import { User, SalesRecord } from '../types';
import { MOCK_MEDICINES } from '../constants';
import { PlusCircle, Store, Package, CheckCircle2, Edit2, Trash2, X } from 'lucide-react';

interface SalesEntryProps {
  user: User;
  onAdd: (record: SalesRecord) => void;
  history: SalesRecord[];
}

const SalesEntry: React.FC<SalesEntryProps> = ({ user, onAdd, history }) => {
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopMobile, setShopMobile] = useState('');
  const [selectedMed, setSelectedMed] = useState(MOCK_MEDICINES[0]);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);
  const [billGenerated, setBillGenerated] = useState(false);
  const [billItems, setBillItems] = useState<Array<{
    id: string;
    medicineName: string;
    quantity: number;
    price: number;
    value: number;
    profit: number;
  }>>([]);
  const [billHistory, setBillHistory] = useState<Array<{
    id: string;
    shopName: string;
    shopAddress: string;
    shopMobile: string;
    items: typeof billItems;
    timestamp: string;
    total: number;
    profit: number;
    status: 'draft' | 'ordered';
  }>>([]);
  const [editingBill, setEditingBill] = useState<string | null>(null);
  const [editShopName, setEditShopName] = useState('');
  const [editShopAddress, setEditShopAddress] = useState('');
  const [editShopMobile, setEditShopMobile] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [editItemQuantity, setEditItemQuantity] = useState(1);

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
        shopAddress,
        shopMobile,
        medicineName: selectedMed.name,
        quantity,
        value,
        profit,
        timestamp: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setShopName('');
      setShopAddress('');
      setShopMobile('');
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

    // Create draft bill if it doesn't exist yet
    const existingDraft = billHistory.find(b => b.status === 'draft' && b.shopName === shopName);
    if (!existingDraft && billHistory.every(b => b.status !== 'draft')) {
      const draftBill = {
        id: Math.random().toString(36).substr(2, 9),
        shopName,
        shopAddress,
        shopMobile,
        items: billItems,
        timestamp: new Date().toISOString(),
        total: billItems.reduce((s, i) => s + i.value, 0),
        profit: billItems.reduce((s, i) => s + i.profit, 0),
        status: 'draft' as const
      };
      setBillHistory(s => [draftBill, ...s]);
    }

    setQuantity(1);
  };

  const removeBillItem = (id: string) => {
    setBillItems((s) => s.filter(i => i.id !== id));
  };

  const sendToProcess = () => {
    if (!shopName || billItems.length === 0) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const ts = new Date().toISOString();
      const total = billItems.reduce((s, i) => s + i.value, 0);
      const profit = billItems.reduce((s, i) => s + i.profit, 0);

      // Save to bill history as ORDERED
      setBillHistory(s => [...s, {
        id: Math.random().toString(36).substr(2, 9),
        shopName,
        shopAddress,
        shopMobile,
        items: billItems,
        timestamp: ts,
        total,
        profit,
        status: 'ordered'
      }]);

      billItems.forEach(item => {
        onAdd({
          id: Math.random().toString(36).substr(2, 9),
          salesmanId: user.id,
          salesmanName: user.name,
          shopName,
          shopAddress,
          shopMobile,
          medicineName: item.medicineName,
          quantity: item.quantity,
          value: item.value,
          profit: item.profit,
          timestamp: ts,
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        });
      });

      setBillGenerated(true);
      setTimeout(() => setBillGenerated(false), 4000);
      setShopName('');
      setShopAddress('');
      setShopMobile('');
      setQuantity(1);
      setBillItems([]);
    });
  };

  const resetForNewPharmacy = () => {
    setShopName('');
    setShopAddress('');
    setShopMobile('');
    setQuantity(1);
    setSelectedMed(MOCK_MEDICINES[0]);
    setBillItems([]);
  };

  const startEditBill = (billId: string) => {
    const bill = billHistory.find(b => b.id === billId);
    if (bill) {
      setEditingBill(billId);
      setEditShopName(bill.shopName);
      setEditShopAddress(bill.shopAddress);
      setEditShopMobile(bill.shopMobile);
    }
  };

  const saveEditBill = (billId: string) => {
    setBillHistory(s => s.map(b =>
      b.id === billId
        ? { ...b, shopName: editShopName, shopAddress: editShopAddress, shopMobile: editShopMobile }
        : b
    ));
    setEditingBill(null);
    setEditingItemId(null);
  };

  const deleteBill = (billId: string) => {
    setBillHistory(s => s.filter(b => b.id !== billId));
  };

  const editBillItem = (billId: string, itemId: string, newQuantity: number) => {
    setBillHistory(s => s.map(b => {
      if (b.id === billId) {
        const updatedItems = b.items.map(i => {
          if (i.id === itemId) {
            const newValue = i.price * newQuantity;
            const newProfit = newValue * (i.profit / i.value || 0);
            return { ...i, quantity: newQuantity, value: newValue, profit: newProfit };
          }
          return i;
        });
        const newTotal = updatedItems.reduce((sum, i) => sum + i.value, 0);
        const newProfit = updatedItems.reduce((sum, i) => sum + i.profit, 0);
        return { ...b, items: updatedItems, total: newTotal, profit: newProfit };
      }
      return b;
    }));
    setEditingItemId(null);
  };

  const removeBillItemFromHistory = (billId: string, itemId: string) => {
    setBillHistory(s => s.map(b => {
      if (b.id === billId) {
        const updatedItems = b.items.filter(i => i.id !== itemId);
        const newTotal = updatedItems.reduce((sum, i) => sum + i.value, 0);
        const newProfit = updatedItems.reduce((sum, i) => sum + i.profit, 0);
        return { ...b, items: updatedItems, total: newTotal, profit: newProfit };
      }
      return b;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Visit & Log</h2>
        {(shopName || billItems.length > 0) && (
          <button
            onClick={resetForNewPharmacy}
            className="text-xs font-bold uppercase bg-amber-50 text-amber-700 px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            + New Pharmacy Order
          </button>
        )}
      </div>

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

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pharmacy Address</label>
            <textarea
              placeholder="Street, City, State"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pharmacy Mobile Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={shopMobile}
              onChange={(e) => setShopMobile(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              pattern="[0-9]{10}"
              maxLength={10}
            />
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

        {/* <button 
          type="submit"
          className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Sales Data</span>
        </button> */}

        {success && <p className="text-center text-green-600 font-black text-xs animate-bounce">ENTRY RECORDED</p>}
      </form>

      <div className="mt-6">
        <h4 className="font-bold text-slate-800">Bill Preview</h4>
        {billItems.length === 0 ? (
          <p className="text-slate-400 text-xs italic">No items in bill. Add products to build a bill.</p>
        ) : (
          <div className="mt-3 p-4 bg-white border border-slate-100 rounded-[1.5rem] space-y-4">
            {/* Pharmacy Details Header */}
            <div className="border-b border-slate-200 pb-4">
              <p className="font-bold text-slate-800 text-sm">{shopName}</p>
              {shopAddress && <p className="text-xs text-slate-600 mt-1">{shopAddress}</p>}
              {shopMobile && <p className="text-xs text-slate-600">📞 {shopMobile}</p>}
            </div>

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

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-4">
              <div className="font-bold text-slate-800">Subtotal</div>
              <div className="text-right">
                <div className="font-black text-blue-600">₹{billItems.reduce((s, i) => s + i.value, 0)}</div>
                <div className="text-[10px] text-slate-400">Profit ₹{billItems.reduce((s, i) => s + i.profit, 0).toFixed(2)}</div>
              </div>
            </div>

            {/* Grand Total Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-2xl text-white text-center space-y-2 mb-4">
              <p className="text-sm font-bold opacity-90 uppercase tracking-widest">Grand Total</p>
              <p className="text-3xl font-black">₹{billItems.reduce((s, i) => s + i.value, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RS</p>
              <p className="text-xs opacity-90">Bill Amount</p>
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

      {/* Bill History Section */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800">📋 Bill Payment History</h4>

        {billHistory.length === 0 ? (
          <p className="text-slate-400 text-xs italic">No bills yet.</p>
        ) : (
          <div className="space-y-6">
            {/* ORDERED BILLS */}
            {billHistory.filter(b => b.status === 'ordered').length > 0 && (
              <div>
                <div className="text-xs font-black text-green-700 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Ordered Bills ({billHistory.filter(b => b.status === 'ordered').length})
                </div>
                <div className="space-y-3">
                  {billHistory.filter(b => b.status === 'ordered').map((bill, idx) => (
                    <div key={bill.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-[1.5rem] space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-slate-800">{bill.shopName}</p>
                            <span className="bg-green-200 text-green-800 text-[10px] font-black px-2 py-1 rounded-full">✓ ORDERED</span>
                          </div>
                          {bill.shopAddress && <p className="text-xs text-slate-600 mt-1">{bill.shopAddress}</p>}
                          {bill.shopMobile && <p className="text-xs text-slate-600">📞 {bill.shopMobile}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-black text-green-700">₹{bill.total}</p>
                          <p className="text-[10px] text-slate-500">Profit ₹{bill.profit.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white rounded-lg p-2 text-center">
                          <div className="text-slate-500 text-[10px]">Items</div>
                          <div className="font-bold text-slate-800">{bill.items.length}</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center">
                          <div className="text-slate-500 text-[10px]">Date</div>
                          <div className="font-bold text-slate-800">{new Date(bill.timestamp).toLocaleDateString()}</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center">
                          <div className="text-slate-500 text-[10px]">Time</div>
                          <div className="font-bold text-slate-800">{new Date(bill.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>

                      {/* Medicines List */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setExpandedBill(expandedBill === bill.id ? null : bill.id)}
                          className="w-full text-left text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 py-2"
                        >
                          {expandedBill === bill.id ? '▼' : '▶'} Show Medicines ({bill.items.length})
                        </button>
                        {expandedBill === bill.id && (
                          <div className="bg-white rounded-lg p-3 space-y-2 border-l-4 border-green-300">
                            {bill.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                {editingItemId === item.id ? (
                                  <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1">
                                      <p className="text-xs font-bold text-slate-800">{item.medicineName}</p>
                                      <p className="text-[10px] text-slate-500">₹{item.price}/unit</p>
                                    </div>
                                    <input
                                      type="number"
                                      min="1"
                                      value={editItemQuantity}
                                      onChange={(e) => setEditItemQuantity(parseInt(e.target.value) || 1)}
                                      className="w-12 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-bold text-center"
                                    />
                                    <button
                                      onClick={() => editBillItem(bill.id, item.id, editItemQuantity)}
                                      className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => setEditingItemId(null)}
                                      className="px-2 py-1 bg-slate-400 text-white text-xs font-bold rounded"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <div>
                                      <p className="text-xs font-bold text-slate-800">{item.medicineName} x {item.quantity}</p>
                                      <p className="text-[10px] text-slate-500">₹{item.price}/unit = ₹{item.value}</p>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => {
                                          setEditingItemId(item.id);
                                          setEditItemQuantity(item.quantity);
                                        }}
                                        className="p-1 bg-blue-100 text-blue-600 rounded text-xs font-bold hover:bg-blue-200"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => removeBillItemFromHistory(bill.id, item.id)}
                                        className="p-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => deleteBill(bill.id)}
                        className="w-full py-2 bg-red-100 text-red-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete from History
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DRAFT BILLS */}
            {billHistory.filter(b => b.status === 'draft').length > 0 && (
              <div>
                <div className="text-xs font-black text-amber-700 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                  Draft Bills ({billHistory.filter(b => b.status === 'draft').length})
                </div>
                <div className="space-y-3">
                  {billHistory.filter(b => b.status === 'draft').map((bill) => (
                    <div key={bill.id} className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-[1.5rem] space-y-3">
                      {<div className="text-xs font-black text-amber-700 uppercase">✏️ Draft</div>}
                      {editingBill === bill.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editShopName}
                            onChange={(e) => setEditShopName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold"
                            placeholder="Shop Name"
                          />
                          <textarea
                            value={editShopAddress}
                            onChange={(e) => setEditShopAddress(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold resize-none h-16 text-xs"
                            placeholder="Shop Address"
                          />
                          <input
                            type="tel"
                            value={editShopMobile}
                            onChange={(e) => setEditShopMobile(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold"
                            placeholder="Mobile"
                            maxLength={10}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEditBill(bill.id)}
                              className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg text-xs"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingBill(null)}
                              className="flex-1 py-2 bg-slate-300 text-slate-700 font-bold rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-800">{bill.shopName}</p>
                              {bill.shopAddress && <p className="text-xs text-slate-600 mt-1">{bill.shopAddress}</p>}
                              {bill.shopMobile && <p className="text-xs text-slate-600">📞 {bill.shopMobile}</p>}
                            </div>
                            <div className="text-right">
                              <p className="font-black text-amber-700">₹{bill.total}</p>
                              <p className="text-[10px] text-slate-400">Profit ₹{bill.profit.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">
                            {bill.items.length} item{bill.items.length !== 1 ? 's' : ''}
                          </div>

                          {/* Medicines List for Draft Bills */}
                          <div className="space-y-2">
                            <button
                              onClick={() => setExpandedBill(expandedBill === bill.id ? null : bill.id)}
                              className="w-full text-left text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-2 py-2"
                            >
                              {expandedBill === bill.id ? '▼' : '▶'} Show Medicines ({bill.items.length})
                            </button>
                            {expandedBill === bill.id && (
                              <div className="bg-white rounded-lg p-3 space-y-2 border-l-4 border-amber-300">
                                {bill.items.map(item => (
                                  <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    {editingItemId === item.id ? (
                                      <div className="flex-1 flex items-center gap-2">
                                        <div className="flex-1">
                                          <p className="text-xs font-bold text-slate-800">{item.medicineName}</p>
                                          <p className="text-[10px] text-slate-500">₹{item.price}/unit</p>
                                        </div>
                                        <input
                                          type="number"
                                          min="1"
                                          value={editItemQuantity}
                                          onChange={(e) => setEditItemQuantity(parseInt(e.target.value) || 1)}
                                          className="w-12 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-bold text-center"
                                        />
                                        <button
                                          onClick={() => editBillItem(bill.id, item.id, editItemQuantity)}
                                          className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded"
                                        >
                                          ✓
                                        </button>
                                        <button
                                          onClick={() => setEditingItemId(null)}
                                          className="px-2 py-1 bg-slate-400 text-white text-xs font-bold rounded"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <div>
                                          <p className="text-xs font-bold text-slate-800">{item.medicineName} x {item.quantity}</p>
                                          <p className="text-[10px] text-slate-500">₹{item.price}/unit = ₹{item.value}</p>
                                        </div>
                                        <div className="flex gap-1">
                                          <button
                                            onClick={() => {
                                              setEditingItemId(item.id);
                                              setEditItemQuantity(item.quantity);
                                            }}
                                            className="p-1 bg-blue-100 text-blue-600 rounded text-xs font-bold hover:bg-blue-200"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => removeBillItemFromHistory(bill.id, item.id)}
                                            className="p-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditBill(bill.id)}
                              className="flex-1 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" /> Edit Details
                            </button>
                            <button
                              onClick={() => deleteBill(bill.id)}
                              className="flex-1 py-2 bg-red-100 text-red-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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



      {/* Bill Generated Success Modal */}
      {billGenerated && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Bill Generated</h2>
              <p className="text-sm text-slate-500 text-center">Your bill has been successfully processed and recorded in the system.</p>
              <button
                onClick={() => setBillGenerated(false)}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors mt-4"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesEntry;
