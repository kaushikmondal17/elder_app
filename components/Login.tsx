
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, Phone, KeyRound, User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.SALESMAN);
  
  // Registration Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Login Field
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('elder_user_profile');
    if (savedUser) {
      setIsRegistered(true);
      const user = JSON.parse(savedUser);
      setRole(user.role);
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const newUser: User = {
      id: role === UserRole.MANAGER ? 'M001' : 'S101',
      employeeId: role === UserRole.MANAGER ? 'ELD-MGR-001' : 'ELD-SLS-101',
      name: role === UserRole.MANAGER ? 'Kaushik Mondal' : name,
      phone: phone,
      email: email,
      role: role,
      points: 0,
      salary: role === UserRole.MANAGER ? 85000 : 35000,
      pf: 1800,
      department: role === UserRole.MANAGER ? 'Field Management' : 'Pharmaceutical Sales',
      joiningDate: new Date().toISOString().split('T')[0],
      bloodGroup: 'O+',
      password: password,
      assignedTasks: []
    };

    localStorage.setItem('elder_user_profile', JSON.stringify(newUser));
    onLogin(newUser);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedUserStr = localStorage.getItem('elder_user_profile');
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      if (savedUser.password === loginPassword) {
        onLogin(savedUser);
      } else {
        setError('Incorrect password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-[1.8rem] flex items-center justify-center mb-4 shadow-inner">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Elder Laboratories Ltd</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Enterprise Solutions</p>
        </div>

        {!isRegistered ? (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-700">Agent Registration</h2>
              <p className="text-xs text-slate-400 font-medium">Create your secure field account</p>
            </div>

            <div className="flex bg-slate-100 rounded-2xl p-1 mb-4">
              <button 
                type="button"
                onClick={() => setRole(UserRole.SALESMAN)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${role === UserRole.SALESMAN ? 'bg-white shadow-md text-blue-600 scale-[1.02]' : 'text-slate-500'}`}
              >
                Sales Agent
              </button>
              <button 
                type="button"
                onClick={() => setRole(UserRole.MANAGER)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${role === UserRole.MANAGER ? 'bg-white shadow-md text-blue-600 scale-[1.02]' : 'text-slate-500'}`}
              >
                Manager
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-700 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-700 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="email"
                  placeholder="Official Email"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-700 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password"
                  placeholder="Set Password"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-700 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-bold text-center mt-2">{error}</p>}

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 mt-4 flex items-center justify-center space-x-2"
            >
              <span>Initialize Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-700">Welcome Back</h2>
              <p className="text-xs text-slate-400 font-medium">Enter your password to unlock</p>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Secret</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-black text-slate-700 text-lg tracking-[0.3em]"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-bold text-center mt-2">{error}</p>}

            <button 
              type="submit"
              className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Unlock Terminal
            </button>

            <button 
              type="button"
              onClick={() => {
                localStorage.removeItem('elder_user_profile');
                setIsRegistered(false);
              }}
              className="w-full text-[10px] text-slate-400 font-bold uppercase hover:text-blue-600 transition-colors"
            >
              Switch Account / Register New
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.1em]">
             Secured by 2026 <br />
             Proprietary Asset of Elder Laboratories Ltd.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
