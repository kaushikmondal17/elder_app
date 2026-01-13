
import React, { useState, useEffect } from 'react';
import { User, UserRole, SalesRecord, AttendanceRecord, LeaveRequest, Task } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import SalesmanDashboard from './components/SalesmanDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AttendanceControl from './components/AttendanceControl';
import SalesEntry from './components/SalesEntry';
import Profile from './components/Profile';
import LeaveManagement from './components/LeaveManagement';
import About from './components/About';
import HistoryView from './components/HistoryView';

export type AppView = 'dashboard' | 'attendance' | 'sales' | 'profile' | 'leaves' | 'about' | 'history';

const DEFAULT_STAFF: User[] = [
  { id: 'S101', employeeId: 'ELD-SLS-101', name: 'Rajesh Kumar', role: UserRole.SALESMAN, department: 'Pharma Sales', points: 1250, phone: '9876543210', salary: 35000, pf: 1800, joiningDate: '2022-03-15', bloodGroup: 'B+', email: 'rajesh.k@elderpharma.com', assignedTasks: [] },
  { id: 'S102', employeeId: 'ELD-SLS-102', name: 'Amit Singh', role: UserRole.SALESMAN, department: 'Pharma Sales', points: 980, phone: '9822110033', salary: 32000, pf: 1600, joiningDate: '2023-01-10', bloodGroup: 'A+', email: 'amit.s@elderpharma.com', assignedTasks: [] }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [staffList, setStaffList] = useState<User[]>(DEFAULT_STAFF);

  useEffect(() => {
    const savedSales = localStorage.getItem('elder_sales');
    if (savedSales) setSalesData(JSON.parse(savedSales));
    
    const savedAttendance = localStorage.getItem('elder_attendance');
    if (savedAttendance) setAttendanceLogs(JSON.parse(savedAttendance));

    const savedLeaves = localStorage.getItem('elder_leaves');
    if (savedLeaves) setLeaves(JSON.parse(savedLeaves));

    const savedStaff = localStorage.getItem('elder_staff');
    if (savedStaff) setStaffList(JSON.parse(savedStaff));
  }, []);

  const handleLogin = (u: User) => {
    // Sync login user with staff list if it's a salesman
    const found = staffList.find(s => s.id === u.id);
    setUser(found || u);
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
  };

  const addSalesRecord = (record: SalesRecord) => {
    const updated = [record, ...salesData];
    setSalesData(updated);
    localStorage.setItem('elder_sales', JSON.stringify(updated));
  };

  const addAttendanceRecord = (record: AttendanceRecord) => {
    const updated = [record, ...attendanceLogs];
    setAttendanceLogs(updated);
    localStorage.setItem('elder_attendance', JSON.stringify(updated));
  };

  const addLeaveRequest = (req: LeaveRequest) => {
    const updated = [req, ...leaves];
    setLeaves(updated);
    localStorage.setItem('elder_leaves', JSON.stringify(updated));
  };

  const deployTask = (userId: string, task: Task) => {
    const updatedStaff = staffList.map(s => {
      if (s.id === userId) {
        return { ...s, assignedTasks: [task, ...(s.assignedTasks || [])] };
      }
      return s;
    });
    setStaffList(updatedStaff);
    localStorage.setItem('elder_staff', JSON.stringify(updatedStaff));
    
    // Update current user if they are the one getting the task
    if (user && user.id === userId) {
      setUser(updatedStaff.find(s => s.id === userId) || null);
    }
  };

  const updateStaffProfile = (updatedUser: User) => {
    const updatedStaff = staffList.map(s => s.id === updatedUser.id ? updatedUser : s);
    setStaffList(updatedStaff);
    localStorage.setItem('elder_staff', JSON.stringify(updatedStaff));
    if (user && user.id === updatedUser.id) setUser(updatedUser);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} currentView={view} setView={setView} onLogout={handleLogout}>
      <div className="pt-4">
        {view === 'dashboard' && (
          user.role === UserRole.SALESMAN 
            ? <SalesmanDashboard user={user} sales={salesData.filter(s => s.salesmanId === user.id)} />
            : <ManagerDashboard 
                sales={salesData} 
                attendance={attendanceLogs} 
                staffList={staffList} 
                leaves={leaves}
                onDeployTask={deployTask}
                onUpdateStaff={updateStaffProfile}
              />
        )}
        {view === 'attendance' && (
          <AttendanceControl user={user} logs={attendanceLogs.filter(a => a.userId === user.id)} onAdd={addAttendanceRecord} />
        )}
        {view === 'sales' && (
          <SalesEntry user={user} onAdd={addSalesRecord} history={salesData.filter(s => s.salesmanId === user.id)} />
        )}
        {view === 'profile' && (
          <Profile user={user} attendance={attendanceLogs.filter(a => a.userId === user.id)} />
        )}
        {view === 'leaves' && (
          <LeaveManagement leaves={leaves.filter(l => l.userId === user.id)} onApply={addLeaveRequest} userId={user.id} />
        )}
        {view === 'about' && <About />}
        {view === 'history' && <HistoryView logs={attendanceLogs.filter(a => a.userId === user.id)} sales={salesData.filter(s => s.salesmanId === user.id)} />}
      </div>
    </Layout>
  );
};

export default App;
