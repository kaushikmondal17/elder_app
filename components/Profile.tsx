
import React, { useState } from 'react';
import { User, AttendanceRecord } from '../types';
import { Wallet, Calendar, Shield, BadgeCheck, Phone, Mail, MapPin, Briefcase, Droplets, Info, Star } from 'lucide-react';

interface ProfileProps {
  user: User;
  attendance: AttendanceRecord[];
}

const Profile: React.FC<ProfileProps> = ({ user, attendance }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'statutory' | 'holidays'>('info');

  const HOLIDAYS = [
    { date: 'Oct 02', name: 'Gandhi Jayanti' },
    { date: 'Oct 31', name: 'Diwali (Festival of Lights)' },
    { date: 'Nov 15', name: 'Guru Nanak Jayanti' },
    { date: 'Dec 25', name: 'Christmas Day' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.photoSeed || user.id}`} 
            className="w-28 h-28 rounded-[2rem] object-cover shadow-xl border-4 border-white bg-blue-50" 
            alt="Profile"
          />
          <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-2xl border-4 border-white shadow-lg">
            <BadgeCheck className="w-5 h-5 text-white" />
          </div>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-slate-800">{user.name}</h3>
        <p className="text-xs text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mt-1">
          {user.role} • {user.department}
        </p>
      </div>

      <div className="flex bg-slate-100 rounded-2xl p-1 mb-2">
        <button onClick={() => setActiveTab('info')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === 'info' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>General</button>
        <button onClick={() => setActiveTab('statutory')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === 'statutory' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Finance</button>
        <button onClick={() => setActiveTab('holidays')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === 'holidays' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Holidays</button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm min-h-[300px]">
        {activeTab === 'info' && (
          <div className="space-y-5">
            <DetailRow icon={<BadgeCheck className="w-5 h-5" />} label="Employee ID" value={user.employeeId} />
            <DetailRow icon={<Droplets className="w-5 h-5 text-red-500" />} label="Blood Group" value={user.bloodGroup} />
            <DetailRow icon={<Briefcase className="w-5 h-5" />} label="Joining Date" value={new Date(user.joiningDate).toLocaleDateString()} />
            <DetailRow icon={<Phone className="w-5 h-5" />} label="Contact" value={user.phone} />
            <DetailRow icon={<Mail className="w-5 h-5" />} label="Email" value={user.email} />
            <DetailRow icon={<MapPin className="w-5 h-5" />} label="Reporting Office" value="Mumbai (HQ)" />
          </div>
        )}

        {activeTab === 'statutory' && (
          <div className="space-y-5">
            <div className="bg-blue-50 p-6 rounded-3xl mb-4 text-center">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Monthly Net CTC</p>
              <p className="text-3xl font-black text-blue-700 mt-1">₹{user.salary.toLocaleString()}</p>
            </div>
            <DetailRow icon={<Shield className="w-5 h-5" />} label="PF Account Number" value="MH/BAN/0012345/000" />
            <DetailRow icon={<Shield className="w-5 h-5" />} label="Monthly PF" value={`₹${user.pf}`} />
            <DetailRow icon={<Wallet className="w-5 h-5" />} label="Tax Benefit Status" value="Enabled" />
            <DetailRow icon={<Calendar className="w-5 h-5" />} label="Next Payout" value="01-Nov-2024" />
          </div>
        )}

        {activeTab === 'holidays' && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center space-x-2 mb-2">
               <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
               <span>Official Holidays 2024</span>
            </h4>
            <div className="space-y-3">
              {HOLIDAYS.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-blue-600">{h.date}</span>
                      <span className="text-sm font-bold text-slate-700">{h.name}</span>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Elder Connect Digital ID</p>
          <p className="text-lg font-black mt-1">Verified Field Expert</p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
           <Shield className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
    </div>
    <p className="text-sm font-bold text-slate-700">{value}</p>
  </div>
);

export default Profile;
