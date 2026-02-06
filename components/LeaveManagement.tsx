
import React, { useState } from 'react';
import { LeaveRequest } from '../types';
import { CalendarClock, Plus, X, Thermometer, Briefcase, Plane, AlertCircle, CheckCircle2, Clock, Edit2, Save } from 'lucide-react';

interface LeaveManagementProps {
  leaves: LeaveRequest[];
  onApply: (req: LeaveRequest) => void;
  userId: string;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ leaves, onApply, userId }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<'SICK' | 'CASUAL' | 'EARNED' | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescriptions, setEditedDescriptions] = useState({
    SICK: 'Used for medical reasons',
    CASUAL: 'Used for personal work or any reason',
    EARNED: 'Annual leave based on service'
  });
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

  const leaveDetails = {
    SICK: { label: 'Sick Leave', used: 4, total: 12, color: 'bg-orange-500', description: editedDescriptions.SICK },
    CASUAL: { label: 'Casual Leave', used: 8, total: 15, color: 'bg-blue-500', description: editedDescriptions.CASUAL },
    EARNED: { label: 'Earned Leave', used: 12, total: 20, color: 'bg-green-500', description: editedDescriptions.EARNED }
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
        <BalanceCard 
          icon={<Thermometer className="w-4 h-4" />} 
          label="Sick" 
          count="4/12" 
          color="bg-orange-500"
          onClick={() => setSelectedLeaveType('SICK')}
        />
        <BalanceCard 
          icon={<Briefcase className="w-4 h-4" />} 
          label="Casual" 
          count="8/15" 
          color="bg-blue-500"
          onClick={() => setSelectedLeaveType('CASUAL')}
        />
        <BalanceCard 
          icon={<Plane className="w-4 h-4" />} 
          label="Earned" 
          count="12/20" 
          color="bg-green-500"
          onClick={() => setSelectedLeaveType('EARNED')}
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-800">My Leave Applications</h4>
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

      {/* Leave Details Popup */}
      {selectedLeaveType && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">{leaveDetails[selectedLeaveType].label}</h3>
              <button 
                onClick={() => setSelectedLeaveType(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Leave Info */}
              <div className={`p-6 rounded-2xl text-white ${leaveDetails[selectedLeaveType].color}`}>
                <div className="text-center">
                  <p className="text-sm font-semibold opacity-90">Total Balance</p>
                  <p className="text-4xl font-black mt-2">{leaveDetails[selectedLeaveType].total}</p>
                  <p className="text-sm opacity-90 mt-2">days available</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-bold text-slate-700">Used</p>
                    <p className="text-sm font-bold text-slate-700">{leaveDetails[selectedLeaveType].used} days</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${leaveDetails[selectedLeaveType].color}`}
                      style={{ width: `${(leaveDetails[selectedLeaveType].used / leaveDetails[selectedLeaveType].total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-bold text-slate-700">Remaining</p>
                    <p className="text-sm font-bold text-green-600">{leaveDetails[selectedLeaveType].total - leaveDetails[selectedLeaveType].used} days</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${((leaveDetails[selectedLeaveType].total - leaveDetails[selectedLeaveType].used) / leaveDetails[selectedLeaveType].total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">About</p>
                  <button
                    onClick={() => setIsEditingDescription(!isEditingDescription)}
                    className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {isEditingDescription ? <Save className="w-4 h-4 text-green-600" /> : <Edit2 className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
                {isEditingDescription ? (
                  <textarea
                    value={editedDescriptions[selectedLeaveType]}
                    onChange={(e) => setEditedDescriptions({
                      ...editedDescriptions,
                      [selectedLeaveType]: e.target.value
                    })}
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-medium text-slate-700 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-slate-600 font-medium">{leaveDetails[selectedLeaveType].description}</p>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedLeaveType(null)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 z-10 "
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

const BalanceCard: React.FC<{ icon: React.ReactNode, label: string, count: string, color: string, onClick?: () => void }> = ({ icon, label, count, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-4 rounded-3xl border border-slate-100 text-center flex flex-col items-center hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
  >
    <div className={`p-2 rounded-lg text-white mb-2 ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
    <p className="text-sm font-black text-slate-800">{count}</p>
  </button>
);

export default LeaveManagement;
