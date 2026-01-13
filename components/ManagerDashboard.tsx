
import React, { useState } from 'react';
import { SalesRecord, AttendanceRecord, User, UserRole, Task, LeaveRequest } from '../types';
import { Users, TrendingUp, Edit3, Plus, Store, CheckCircle, XCircle, Clock, Calendar, Send, UserCheck, UserMinus, Coffee } from 'lucide-react';

interface ManagerDashboardProps {
  sales: SalesRecord[];
  attendance: AttendanceRecord[];
  staffList: User[];
  leaves: LeaveRequest[];
  onDeployTask: (userId: string, task: Task) => void;
  onUpdateStaff: (user: User) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ sales, attendance, staffList, leaves, onDeployTask, onUpdateStaff }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'staff' | 'tasks'>('monitor');
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', userId: staffList[0]?.id || '', description: '' });

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Logic for Attendance Monitoring
  const onDutyIds = new Set(attendance.filter(a => a.type === 'IN' && a.timestamp.startsWith(todayStr)).map(a => a.userId));
  const onLeaveIds = new Set(leaves.filter(l => l.status === 'APPROVED' && todayStr >= l.startDate && todayStr <= l.endDate).map(l => l.userId));

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.userId) return;
    
    onDeployTask(taskForm.userId, {
      id: Math.random().toString(36).substr(2, 9),
      title: taskForm.title,
      description: taskForm.description || 'Assigned by Manager',
      status: 'PENDING',
      deadline: 'End of Day'
    });
    
    setTaskForm({ ...taskForm, title: '', description: '' });
    alert('Task deployed successfully!');
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      onUpdateStaff(editingStaff);
      setEditingStaff(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800">Operations Hub</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button onClick={() => setActiveTab('monitor')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === 'monitor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Live</button>
           <button onClick={() => setActiveTab('staff')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === 'staff' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Staff</button>
           <button onClick={() => setActiveTab('tasks')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === 'tasks' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Tasks</button>
        </div>
      </div>

      {activeTab === 'monitor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm">
              <Users className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-2xl font-black text-slate-800">{onDutyIds.size}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Agents On-Duty</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm">
              <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-2xl font-black text-slate-800">₹{sales.filter(s => s.timestamp.startsWith(todayStr)).reduce((a,b)=>a+b.value,0).toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Today's Sales</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center space-x-2">
               <UserCheck className="w-4 h-4 text-blue-500" />
               <span>Today's Staff Status</span>
            </h4>
            <div className="space-y-2">
              {staffList.map(staff => {
                const isWorking = onDutyIds.has(staff.id);
                const isOnLeave = onLeaveIds.has(staff.id);
                let statusText = "Absent";
                let statusColor = "text-red-500 bg-red-50";
                let StatusIcon = <UserMinus className="w-3 h-3" />;

                if (isWorking) {
                  statusText = "Working";
                  statusColor = "text-green-600 bg-green-50";
                  StatusIcon = <Clock className="w-3 h-3" />;
                } else if (isOnLeave) {
                  statusText = "On Leave";
                  statusColor = "text-amber-600 bg-amber-50";
                  StatusIcon = <Coffee className="w-3 h-3" />;
                }

                return (
                  <div key={staff.id} className="p-4 bg-white border border-slate-50 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.photoSeed || staff.id}`} className="w-8 h-8 rounded-full bg-slate-100" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{staff.employeeId}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[9px] font-black uppercase ${statusColor}`}>
                      {StatusIcon}
                      <span>{statusText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="font-bold text-slate-800 flex items-center justify-between">
                <span>Recent Shop Sales</span>
                <Store className="w-4 h-4 text-slate-300" />
             </h4>
             {sales.length === 0 ? (
               <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem]">
                 <p className="text-slate-400 text-sm">No activity recorded today</p>
               </div>
             ) : (
               sales.slice(0, 5).map((s, i) => (
                 <div key={i} className="bg-white p-4 border border-slate-100 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                          <Store className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">{s.shopName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{s.salesmanName} • {s.medicineName}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-blue-600">₹{s.value}</p>
                       <p className="text-[9px] text-green-500 font-bold">Qty: {s.quantity}</p>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">Field Force Directory</h4>
            <button className="p-2 bg-blue-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            {staffList.map(staff => (
              <div key={staff.id} className="bg-white border border-slate-100 p-4 rounded-3xl flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.photoSeed || staff.id}`} className="w-12 h-12 rounded-2xl bg-slate-50" />
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${onDutyIds.has(staff.id) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">{staff.employeeId} • {staff.department}</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingStaff(staff)} className="p-2 text-slate-400 hover:text-blue-600">
                    <Edit3 className="w-5 h-5" />
                 </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
           <form onSubmit={handleTaskSubmit} className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                 <Calendar className="w-6 h-6 text-blue-200" />
                 <h4 className="text-lg font-black uppercase tracking-tight">Deploy Daily Task</h4>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black uppercase text-blue-200 block mb-1">Select Employee</label>
                    <select 
                      value={taskForm.userId}
                      onChange={e => setTaskForm({...taskForm, userId: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-sm outline-none appearance-none font-bold"
                    >
                       {staffList.map(s => <option key={s.id} value={s.id} className="text-slate-800">{s.name} ({s.employeeId})</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-blue-200 block mb-1">Task Title</label>
                    <input 
                      placeholder="e.g. Visit Apollo Pharmacy" 
                      value={taskForm.title}
                      onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl placeholder:text-white/40 text-sm outline-none font-bold" 
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-blue-200 block mb-1">Instructions (Optional)</label>
                    <textarea 
                      placeholder="Specific medicine focus..." 
                      value={taskForm.description}
                      onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl placeholder:text-white/40 text-sm outline-none font-medium h-24" 
                    />
                 </div>
                 <button type="submit" className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl shadow-lg uppercase text-xs tracking-widest mt-2 flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Order</span>
                 </button>
              </div>
           </form>

           <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Recent Assignments</h4>
              {staffList.flatMap(s => (s.assignedTasks || []).map(t => ({...t, owner: s.name}))).slice(0, 5).map(task => (
                <div key={task.id} className="p-4 bg-white border border-slate-100 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <CheckCircle className={`w-4 h-4 ${task.status === 'COMPLETED' ? 'text-green-500' : 'text-slate-300'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{task.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned To: {task.owner}</p>
                      </div>
                   </div>
                   <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {task.status}
                   </span>
                </div>
              ))}
           </div>
        </div>
      )}

      {editingStaff && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <form onSubmit={handleEditSave} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800">Edit Profile</h3>
                <button type="button" onClick={() => setEditingStaff(null)}><XCircle className="w-6 h-6 text-slate-300" /></button>
             </div>
             <div className="space-y-4">
                <div className="flex justify-center mb-4">
                   <div className="relative group cursor-pointer">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editingStaff.photoSeed || editingStaff.id}`} className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-blue-100 shadow-sm" />
                      <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-5 h-5 text-white" />
                      </div>
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Staff Full Name</label>
                   <input 
                      value={editingStaff.name} 
                      onChange={e => setEditingStaff({...editingStaff, name: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-0 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Department</label>
                      <input 
                          value={editingStaff.department} 
                          onChange={e => setEditingStaff({...editingStaff, department: e.target.value})}
                          className="w-full p-4 bg-slate-50 rounded-2xl border-0 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Basic Salary</label>
                      <input 
                          type="number"
                          value={editingStaff.salary} 
                          onChange={e => setEditingStaff({...editingStaff, salary: Number(e.target.value)})}
                          className="w-full p-4 bg-slate-50 rounded-2xl border-0 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avatar Seed (e.g. blue-avatar)</label>
                   <input 
                      value={editingStaff.photoSeed || ''} 
                      onChange={e => setEditingStaff({...editingStaff, photoSeed: e.target.value})}
                      placeholder="Enter any text to change photo"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-0 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
                   />
                </div>
             </div>
             <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 uppercase text-xs tracking-widest">Update Employee Record</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
