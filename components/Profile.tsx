
import React, { useState, useRef } from 'react';
import { User, AttendanceRecord } from '../types';
import { Wallet, Calendar, Shield, BadgeCheck, Phone, Mail, MapPin, Briefcase, Droplets, Info, Star, Edit2, Upload, X, Check } from 'lucide-react';

interface ProfileProps {
  user: User;
  attendance: AttendanceRecord[];
  onUserUpdate?: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, attendance, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'statutory' | 'holidays'>('info');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const HOLIDAYS = [
    { date: 'Oct 02', name: 'Gandhi Jayanti' },
    { date: 'Oct 31', name: 'Diwali (Festival of Lights)' },
    { date: 'Nov 15', name: 'Guru Nanak Jayanti' },
    { date: 'Dec 25', name: 'Christmas Day' }
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = () => {
    if (photoPreview) {
      const updatedUser = { ...editedUser, photoSeed: photoPreview };
      setEditedUser(updatedUser);
      onUserUpdate?.(updatedUser);
      setIsEditingPhoto(false);
      // Keep photoPreview in state to maintain the image after modal closes
    }
  };

  const handleProfileSave = () => {
    onUserUpdate?.(editedUser);
    setIsEditingProfile(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center py-6 relative group">
        <div className="relative">
          <img 
            src={editedUser.photoSeed || photoPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editedUser.id}`} 
            className="w-28 h-28 rounded-[2rem] object-cover shadow-xl border-4 border-white bg-blue-50" 
            alt="Profile"
          />
          <button
            onClick={() => setIsEditingPhoto(true)}
            className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-2xl border-4 border-white shadow-lg transition-colors"
          >
            <Upload className="w-5 h-5 text-white" />
          </button>
          <div className="absolute -bottom-2 -left-2 bg-green-500 p-2 rounded-2xl border-4 border-white shadow-lg">
            <BadgeCheck className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <h3 className="text-2xl font-bold text-slate-800">{editedUser.name}</h3>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="p-1.5 bg-slate-100 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit profile"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
         
        </div>
         <p className="text-bold text-sm my-2 ">User ID :<span>124SGFM14U</span></p>
        <p className="text-xs text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mt-1">
          {editedUser.role} • {editedUser.department}
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
            <DetailRow icon={<BadgeCheck className="w-5 h-5 text-purple-500" />} label="Company ID" value={user.companyIdNo || 'Not set'} />
            <DetailRow icon={<Shield className="w-5 h-5 text-amber-500" />} label="Aadhar Number" value={user.aadharNo ? `****${user.aadharNo.slice(-4)}` : 'Not set'} />
            <DetailRow icon={<Shield className="w-5 h-5 text-green-500" />} label="ID Proof Type" value={user.idProofType || 'Not set'} />
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

      {/* Photo Upload Modal */}
      {isEditingPhoto && (
        <div className="fixed inset-0  flex items-center justify-center z-50 rounded-3xl">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Update Photo</h2>
              <button onClick={() => { setIsEditingPhoto(false); setPhotoPreview(null); }} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              {photoPreview && (
                <img src={photoPreview} className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-300" alt="Preview" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-4 bg-blue-100 text-blue-600 font-bold rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose Photo
              </button>
              
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => { setIsEditingPhoto(false); setPhotoPreview(null); }}
                  className="flex-1 py-2 px-4 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhotoUpload}
                  disabled={!photoPreview}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
              <button onClick={() => { setIsEditingProfile(false); setEditedUser(user); }} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
                <input
                  type="text"
                  value={editedUser.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                <input
                  type="text"
                  value={editedUser.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company ID Number</label>
                <input
                  type="text"
                  value={editedUser.companyIdNo || ''}
                  onChange={(e) => handleInputChange('companyIdNo', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                  placeholder="e.g., ELD-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Aadhar Number (Last 4 digits)</label>
                <input
                  type="password"
                  value={editedUser.aadharNo || ''}
                  onChange={(e) => handleInputChange('aadharNo', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                  placeholder="Enter last 12 digits"
                  maxLength={12}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ID Proof Type</label>
                <select
                  value={editedUser.idProofType || ''}
                  onChange={(e) => handleInputChange('idProofType', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                >
                  <option value="">Select ID Proof Type</option>
                  <option value="Aadhar Card">Aadhar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Voter ID">Voter ID</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => { setIsEditingProfile(false); setEditedUser(user); }}
                  className="flex-1 py-2 px-4 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileSave}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
    </div>
    <div className="flex items-center gap-2">
      <p className="text-sm font-bold text-slate-700">{value}</p>
      <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
    </div>
  </div>
);

export default Profile;
