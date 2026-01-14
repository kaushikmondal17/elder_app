
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Home, ClipboardCheck, ShoppingBag, User as UserIcon, LogOut, AlertTriangle, Menu, X, Info, FileText, CalendarClock } from 'lucide-react';
import { AppView } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentView: AppView;
  setView: (v: AppView) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, setView, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const triggerSOS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      alert(`🚨 EMERGENCY SOS TRIGGERED!\nLocation: ${pos.coords.latitude}, ${pos.coords.longitude}\nElder Laboratories HQ has been notified with your live coordinates.`);
    });
  };

  const navItems: { id: AppView, label: string, icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'attendance', label: 'Duty', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'sales', label: 'Sales', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'history', label: 'Work Log', icon: <FileText className="w-5 h-5" /> },
  ];

  const sidebarItems: { id: AppView, label: string, icon: React.ReactNode }[] = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'leaves', label: 'Leave & Sick', icon: <CalendarClock className="w-5 h-5" /> },
    { id: 'about', label: 'About App', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-slate-50 shadow-2xl relative">
      {/* Top Header */}
      <header className="sticky top-0 z-[60] bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-blue-700 leading-tight">Elder Laboratories</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Connect v2.0</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={triggerSOS}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors animate-pulse border border-red-200"
            title="Emergency SOS"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area - Added bottom padding to avoid overlap with bottom nav */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>

      {/* Bottom Navigation Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-white border-t border-slate-100 px-2 flex items-center justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.03)] h-16">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
              currentView === item.id 
                ? 'text-blue-600' 
                : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${currentView === item.id ? 'bg-blue-50' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Slide-over Sidebar Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]" onClick={() => setIsMenuOpen(false)} />
          <aside className="fixed top-0 left-0 bottom-0 w-3/4 max-w-[300px] bg-white z-[80] shadow-2xl p-6 flex flex-col transition-transform duration-300 transform">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">Menu</h3>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="pb-4 mb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Main Modules</p>
                {navItems.map(item => (
                   <SidebarLink key={item.id} active={currentView === item.id} icon={item.icon} label={item.label} onClick={() => { setView(item.id); setIsMenuOpen(false); }} />
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Employee Center</p>
                {sidebarItems.map(item => (
                   <SidebarLink key={item.id} active={currentView === item.id} icon={item.icon} label={item.label} onClick={() => { setView(item.id); setIsMenuOpen(false); }} />
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-[10px] text-slate-400">{user.employeeId}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

const SidebarLink: React.FC<{ active: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl font-medium transition-all ${
      active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

export default Layout;
