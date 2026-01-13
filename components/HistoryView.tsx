
import React, { useState } from 'react';
import { AttendanceRecord, SalesRecord } from '../types';
import { Clock, ShoppingBag, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface HistoryViewProps {
  logs: AttendanceRecord[];
  sales: SalesRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, sales }) => {
  const [activeHistory, setActiveHistory] = useState<'attendance' | 'sales'>('attendance');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Field Activity logs</h2>

      <div className="flex bg-slate-100 rounded-2xl p-1">
        <button 
          onClick={() => setActiveHistory('attendance')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${activeHistory === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          <Clock className="w-4 h-4" />
          <span>Attendance</span>
        </button>
        <button 
          onClick={() => setActiveHistory('sales')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${activeHistory === 'sales' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Visits</span>
        </button>
      </div>

      <div className="space-y-4">
        {activeHistory === 'attendance' ? (
          logs.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">No attendance logs found.</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${log.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                       <span className="text-sm font-bold text-slate-800">{log.type === 'IN' ? 'Login' : 'Logout'}</span>
                       {log.isValid ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified IP</p>
                      <p className="text-[10px] font-bold text-blue-500">192.168.1.1</p>
                   </div>
                   <img src={log.photo} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                </div>
              </div>
            ))
          )
        ) : (
          sales.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">No sales visits logged.</p>
          ) : (
            sales.map(s => (
              <div key={s.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                       <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{s.shopName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(s.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-600">₹{s.value}</p>
                    <p className="text-[9px] font-bold text-green-600 uppercase">Profit: ₹{s.profit.toFixed(0)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{s.location.lat.toFixed(4)}, {s.location.lng.toFixed(4)}</span>
                  </div>
                  <span className="uppercase text-blue-500">{s.medicineName} (Qty: {s.quantity})</span>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default HistoryView;
