
import React, { useState } from 'react';
import { LeaveRequest } from '../types';
import { CalendarClock, Plus, X, Thermometer, Briefcase, Plane, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface LeaveManagementProps {
  leaves: LeaveRequest[];
  onApply: (req: LeaveRequest) => void;
  userId: string;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ leaves, onApply, userId }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    type: 'SICK' as const,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      id: Math.random().toString(36).substr(2, 9),
      userId,
      ...formData,
      status: 'PENDING'
    });
    setIsApplying(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Leaves & Sick</h2>
        <button 
          onClick={() => setIsApplying(true)}
          className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-3 gap-3">
        <BalanceCard icon={<Thermometer className="w-4 h-4" />} label="Sick" count="4/12" color="bg-orange-500" />
        <BalanceCard icon={<Briefcase className="w-4 h-4" />} label="Casual" count="8/15" color="bg-blue-500" />
        <BalanceCard icon={<Plane className="w-4 h-4" />} label="Earned" count="12/20" color="bg-green-500" />
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-800">My Applications</h4>
        {leaves.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl">
            <CalendarClock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No leave requests found</p>
          </div>
        ) : (
          leaves.map(l => (
            <div key={l.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${l.type === 'SICK' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  {l.type === 'SICK' ? <Thermometer className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{l.type} LEAVE</p>
                  <p className="text-xs text-slate-500">{l.startDate} to {l.endDate}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                l.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                l.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {l.status === 'PENDING' && <Clock className="w-3 h-3" />}
                {l.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                {l.status === 'REJECTED' && <AlertCircle className="w-3 h-3" />}
                <span>{l.status}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Apply for Leave</h3>
              <button onClick={() => setIsApplying(false)} className="p-2 bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Leave Type</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="EARNED">Earned Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">From</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">To</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reason</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  rows={3}
                  placeholder="Medical reason or family function..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const BalanceCard: React.FC<{ icon: React.ReactNode, label: string, count: string, color: string }> = ({ icon, label, count, color }) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-100 text-center flex flex-col items-center">
    <div className={`p-2 rounded-lg text-white mb-2 ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
    <p className="text-sm font-black text-slate-800">{count}</p>
  </div>
);

export default LeaveManagement;
