
import React, { useState, useEffect } from 'react';
import { User, SalesRecord, Task } from '../types';
import { TrendingUp, Award, CheckCircle2, Circle, Sparkles, LayoutList } from 'lucide-react';
import { getPerformanceInsights } from '../services/geminiService';

interface SalesmanDashboardProps {
  user: User;
  sales: SalesRecord[];
}

const SalesmanDashboard: React.FC<SalesmanDashboardProps> = ({ user, sales }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.timestamp.startsWith(todayStr));
  const totalValue = todaySales.reduce((sum, s) => sum + s.value, 0);
  const totalVisits = todaySales.length;

  const tasks: Task[] = user.assignedTasks || [];

  useEffect(() => {
    if (sales.length > 0) {
      setLoadingInsights(true);
      getPerformanceInsights(sales, user.name).then(res => {
        setInsights(res);
        setLoadingInsights(false);
      });
    }
  }, [sales.length]);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-100 text-xs font-black uppercase tracking-widest">Today's Revenue</p>
          <h3 className="text-4xl font-black mt-2">₹{totalValue.toLocaleString()}</h3>
          <div className="mt-6 flex items-center space-x-3">
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 border border-white/10">
                <Award className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-bold">{user.points} Pts</span>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 border border-white/10">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-sm font-bold">{totalVisits} Visits</span>
             </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800 flex items-center space-x-2">
            <LayoutList className="w-4 h-4 text-blue-500" />
            <span>Assigned Tasks</span>
          </h4>
          <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-lg">Operational Orders</span>
        </div>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
               <p className="text-slate-400 text-xs font-bold italic">No pending manager tasks</p>
            </div>
          ) : (
            tasks.map(t => (
              <div key={t.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-start space-x-4">
                 <div className={`mt-1 ${t.status === 'COMPLETED' ? 'text-green-500' : 'text-slate-300'}`}>
                    {t.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                 </div>
                 <div className="flex-1">
                   <p className={`font-bold text-sm ${t.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.title}</p>
                   <p className="text-[10px] text-slate-400 font-medium mt-0.5">{t.description}</p>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h4 className="font-black text-xs uppercase tracking-widest text-amber-900">AI Field Advisor</h4>
        </div>
        {loadingInsights ? (
          <div className="space-y-2">
            <div className="h-3 bg-amber-200 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-amber-200 rounded w-4/5 animate-pulse"></div>
          </div>
        ) : (
          <p className="text-sm text-amber-800 leading-relaxed font-medium">{insights || "Complete more visits to unlock smart field insights."}</p>
        )}
      </div>
    </div>
  );
};

export default SalesmanDashboard;
