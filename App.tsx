
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
  { id: 'S102', employeeId: 'ELD-SLS-102', name: 'Amit Singh', role: UserRole.SALESMAN, department: 'Pharma Sales', points: 980, phone: '9822110033', salary: 32000, pf: 1600, joiningDate: '2023-01-10', bloodGroup: 'A+', email: 'amit.s@elderpharma.com', assignedTasks: [] },
  { id: 'K1701', employeeId: 'ELD-SLS-K1701', name: 'Kaushik Mondal', role: UserRole.SALESMAN, department: 'IT Department', points: 980, phone: '8754218944', salary: 42000, pf: 1800, joiningDate: '2024-12-11', bloodGroup: 'A+', email: 'kaushik@elderpharma.com', assignedTasks: [] },
  { id: 'K1702', employeeId: 'ELD-SLS-K1702', name: 'Rahul Sharma', role: UserRole.SALESMAN, department: 'Sales Department', points: 1100, phone: '8754218945', salary: 45000, pf: 2000, joiningDate: '2024-12-12', bloodGroup: 'B+', email: 'rahul.s@elderpharma.com', assignedTasks: [] },
  { id: 'K1703', employeeId: 'ELD-SLS-K1703', name: 'Priya Patel', role: UserRole.SALESMAN, department: 'IT Department', points: 850, phone: '8754218946', salary: 38000, pf: 1900, joiningDate: '2024-12-13', bloodGroup: 'O+', email: 'priya.p@elderpharma.com', assignedTasks: [] },
  { id: 'K1704', employeeId: 'ELD-SLS-K1704', name: 'Neha Gupta', role: UserRole.SALESMAN, department: 'IT Department', points: 950, phone: '8754218947', salary: 43000, pf: 1950, joiningDate: '2024-12-14', bloodGroup: 'AB+', email: 'neha.g@elderpharma.com', assignedTasks: [] },
];

const DUMMY_ATTENDANCE: AttendanceRecord[] = [
  { id: 'ATT-001', userId: 'S101', userName: 'Rajesh Kumar', type: 'IN', timestamp: '2026-01-16T08:45:00', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh', location: { lat: 28.6139, lng: 77.2090 }, place: 'Office', isValid: true },
  { id: 'ATT-002', userId: 'S101', userName: 'Rajesh Kumar', type: 'OUT', timestamp: '2026-01-15T18:30:00', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh', location: { lat: 28.6250, lng: 77.2200 }, place: 'Field', isValid: true },
  { id: 'ATT-003', userId: 'S101', userName: 'Rajesh Kumar', type: 'IN', timestamp: '2026-01-15T09:15:00', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh', location: { lat: 28.6139, lng: 77.2090 }, place: 'Office', isValid: true },
  { id: 'ATT-004', userId: 'S101', userName: 'Rajesh Kumar', type: 'OUT', timestamp: '2026-01-14T17:45:00', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh', location: { lat: 28.6180, lng: 77.2150 }, place: 'Field', isValid: true }
];

const DUMMY_SALES: SalesRecord[] = [
  { id: 'SALE-001', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'Apollo Pharmacy', shopAddress: 'New Delhi, India', shopMobile: '9999888877', medicineName: 'Paracetamol 500mg', quantity: 50, value: 2500, profit: 500, timestamp: '2026-01-16T10:30:00', deliveryDate: '2026-01-18', location: { lat: 28.6139, lng: 77.2090 } },
  { id: 'SALE-002', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'Life Care Pharmacy', shopAddress: 'Delhi, India', shopMobile: '9888777666', medicineName: 'Amoxicillin 250mg', quantity: 30, value: 1800, profit: 360, timestamp: '2026-01-16T14:15:00', deliveryDate: '2026-01-19', location: { lat: 28.6250, lng: 77.2200 } },
  { id: 'SALE-003', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'Medplus Pharmacy', shopAddress: 'Gurgaon, India', shopMobile: '9777666555', medicineName: 'Aspirin 75mg', quantity: 100, value: 3500, profit: 700, timestamp: '2026-01-15T11:45:00', deliveryDate: '2026-01-17', location: { lat: 28.6180, lng: 77.2150 } },
  { id: 'SALE-004', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'Wellness Pharmacy', shopAddress: 'Noida, India', shopMobile: '9666555444', medicineName: 'Vitamin C 1000mg', quantity: 75, value: 2250, profit: 450, timestamp: '2026-01-15T15:20:00', deliveryDate: '2026-01-18', location: { lat: 28.5921, lng: 77.2196 } },
  { id: 'SALE-005', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'Raj Medical Store', shopAddress: 'Faridabad, India', shopMobile: '9555444333', medicineName: 'Ibuprofen 400mg', quantity: 60, value: 2100, profit: 420, timestamp: '2026-01-16T09:00:00', deliveryDate: '2026-01-18', location: { lat: 28.4089, lng: 77.3178 } },
  { id: 'SALE-006', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'HealthPlus Chemist', shopAddress: 'Greater Noida, India', shopMobile: '9444333222', medicineName: 'Metformin 500mg', quantity: 40, value: 2200, profit: 440, timestamp: '2026-01-16T11:30:00', deliveryDate: '2026-01-19', location: { lat: 28.4744, lng: 77.5610 } },
  { id: 'SALE-007', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'Care Pharmacy Center', shopAddress: 'Indirapuram, India', shopMobile: '9333222111', medicineName: 'Atorvastatin 10mg', quantity: 25, value: 2800, profit: 560, timestamp: '2026-01-16T13:45:00', deliveryDate: '2026-01-20', location: { lat: 28.6129, lng: 77.3859 } },
  { id: 'SALE-008', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'City Health Pharmacy', shopAddress: 'Vaishali, India', shopMobile: '9222111000', medicineName: 'Lisinopril 5mg', quantity: 35, value: 2450, profit: 490, timestamp: '2026-01-15T10:20:00', deliveryDate: '2026-01-17', location: { lat: 28.6314, lng: 77.3869 } },
  { id: 'SALE-009', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'Prime Medical Pharmacy', shopAddress: 'Sector 62, Noida', shopMobile: '9111000999', medicineName: 'Omeprazole 20mg', quantity: 45, value: 2350, profit: 470, timestamp: '2026-01-15T14:00:00', deliveryDate: '2026-01-17', location: { lat: 28.5746, lng: 77.3639 } },
  { id: 'SALE-010', salesmanId: 'S101', salesmanName: 'Rajesh Kumar', shopName: 'SafePlus Pharmacy', shopAddress: 'Janakpuri, Delhi', shopMobile: '8999888777', medicineName: 'Cetirizine 10mg', quantity: 80, value: 1950, profit: 390, timestamp: '2026-01-14T09:30:00', deliveryDate: '2026-01-16', location: { lat: 28.5244, lng: 77.0855 } }
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
    else setSalesData(DUMMY_SALES);

    const savedAttendance = localStorage.getItem('elder_attendance');
    if (savedAttendance) setAttendanceLogs(JSON.parse(savedAttendance));
    else setAttendanceLogs(DUMMY_ATTENDANCE);

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
