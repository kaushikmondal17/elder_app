
import React, { useState } from 'react';
import { SalesRecord, AttendanceRecord, User, UserRole, Task, LeaveRequest } from '../types';
import { Users, TrendingUp, Edit3, Plus, Store, CheckCircle, XCircle, Clock, Calendar, Send, UserCheck, UserMinus, Coffee, MapPin } from 'lucide-react';

interface ManagerDashboardProps {
  sales: SalesRecord[];
  attendance: AttendanceRecord[];
  staffList: User[];
  leaves: LeaveRequest[];
  onDeployTask: (userId: string, task: Task) => void;
  onUpdateStaff: (user: User) => void;
  onDeleteTask?: (taskId: string, userId: string) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ sales, attendance, staffList, leaves, onDeployTask, onUpdateStaff, onDeleteTask }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'staff' | 'tasks'>('monitor');
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [editingTask, setEditingTask] = useState<Task & { ownerId: string } | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', userId: staffList[0]?.id || '', description: '' });
  const [deletedTasks, setDeletedTasks] = useState<Set<string>>(new Set());
  const [mapViewStaff, setMapViewStaff] = useState<{ name: string; location: string; coords: string } | null>(null);

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

  const handleDeleteTask = (taskId: string, userId: string) => {
    setDeletedTasks(prev => new Set(prev).add(taskId));
    if (onDeleteTask) {
      onDeleteTask(taskId, userId);
    }
  };

  const handleEditTask = (task: Task, ownerId: string) => {
    setEditingTask({ ...task, ownerId });
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      // Find the staff member and update their task
      const staffMember = staffList.find(s => s.id === editingTask.ownerId);
      if (staffMember && staffMember.assignedTasks) {
        const taskIndex = staffMember.assignedTasks.findIndex(t => t.id === editingTask.id);
        if (taskIndex !== -1) {
          staffMember.assignedTasks[taskIndex] = {
            ...editingTask,
            ownerId: undefined as any
          };
          onUpdateStaff(staffMember);
        }
      }
      setEditingTask(null);
      alert('Task updated successfully!');
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

                // Mock location data - you can replace with actual data from your staff object
                const location = (staff as any).lastLocation || "Not tracked";
                const locationCoords = (staff as any).locationCoords || "28.7041,77.1025"; // Default to Delhi coordinates

                const handleOpenMaps = () => {
                  setMapViewStaff({
                    name: staff.name,
                    location: location,
                    coords: locationCoords
                  });
                };

                return (
                  <div key={staff.id} className="p-4 bg-white border border-slate-50 rounded-3xl">
                    <div className="flex items-center justify-between mb-3">
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
                    <div className="flex items-center justify-between pl-11">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <p className="text-[10px] text-slate-500 font-semibold">{location}</p>
                      </div>
                      <button
                        onClick={handleOpenMaps}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        VIEW MAP
                      </button>
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
              {staffList.flatMap(s => (s.assignedTasks || []).map(t => ({...t, owner: s.name, ownerId: s.id}))).filter(t => !deletedTasks.has(t.id)).slice(0, 5).map(task => (
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
                   <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                         {task.status}
                      </span>
                      <button 
                        onClick={() => handleEditTask(task, task.ownerId)}
                        className="p-1 text-slate-300 hover:text-blue-600 transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id, task.ownerId)}
                        className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                        title="Delete task"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                   </div>
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

      {editingTask && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <form onSubmit={handleSaveTask} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800">Edit Assignment</h3>
                <button type="button" onClick={() => setEditingTask(null)}><XCircle className="w-6 h-6 text-slate-300" /></button>
             </div>
             <div className="space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Task Title</label>
                   <input 
                      value={editingTask.title} 
                      onChange={e => setEditingTask({...editingTask, title: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-0 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                   <textarea 
                      value={editingTask.description} 
                      onChange={e => setEditingTask({...editingTask, description: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-0 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 h-24" 
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                   <select 
                      value={editingTask.status} 
                      onChange={e => setEditingTask({...editingTask, status: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-0 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                   >
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                   </select>
                </div>
             </div>
             <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 uppercase text-xs tracking-widest">Save Changes</button>
          </form>
        </div>
      )}

      {mapViewStaff && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-slate-800">{mapViewStaff.name}</h3>
                   <p className="text-sm text-slate-500 mt-1">{mapViewStaff.location}</p>
                </div>
                <button type="button" onClick={() => setMapViewStaff(null)}><XCircle className="w-6 h-6 text-slate-300" /></button>
             </div>
             <div className="rounded-2xl overflow-hidden border border-slate-200 h-96">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.0!2d${mapViewStaff.coords.split(',')[1]}!3d${mapViewStaff.coords.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1768543865208`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
             </div>
             <div className="space-y-2 p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-600 uppercase">Last Known Location</p>
                <p className="text-sm font-semibold text-slate-800">{mapViewStaff.location}</p>
                <p className="text-xs text-slate-500">Coordinates: {mapViewStaff.coords}</p>
             </div>
             <button 
               onClick={() => {
                 const [lat, lng] = mapViewStaff.coords.split(',');
                 window.open(`https://www.google.com/maps/search/${lat},${lng}`, '_blank');
               }}
               className="w-full bg-blue-600 text-white font-black py-3 rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-700 transition-colors"
             >
                Open in Google Maps
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
