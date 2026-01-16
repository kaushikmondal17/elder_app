
import React, { useState } from 'react';
import { AttendanceRecord, SalesRecord } from '../types';
import { Clock, ShoppingBag, MapPin, CheckCircle2, XCircle, Phone, MapPin as LocationIcon, Calendar, X, TrendingUp, DollarSign, Award, Zap, Filter, BarChart3, Eye, Target, Flame } from 'lucide-react';

interface HistoryViewProps {
  logs: AttendanceRecord[];
  sales: SalesRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, sales }) => {
  const [activeHistory, setActiveHistory] = useState<'all' | 'attendance' | 'sales'>('all');
  const [selectedSale, setSelectedSale] = useState<SalesRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics
  const totalSales = sales.length;
  const totalValue = sales.reduce((sum, s) => sum + s.value, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const avgSaleValue = totalSales > 0 ? Math.round(totalValue / totalSales) : 0;
  const profitMargin = totalValue > 0 ? Math.round((totalProfit / totalValue) * 100) : 0;
  
  const totalCheckIns = logs.filter(l => l.type === 'IN').length;
  const totalCheckOuts = logs.filter(l => l.type === 'OUT').length;
  const validLogs = logs.filter(l => l.isValid).length;
  const avgProfit = totalSales > 0 ? Math.round(totalProfit / totalSales) : 0;

  // Filter data based on search
  const filteredSales = sales.filter(s => 
    s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = logs.filter(l =>
    l.place?.toLowerCase().includes(searchTerm.toLowerCase()) || ''
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Field Activity logs</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Total Sales</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{totalSales}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Total Profit</p>
              <p className="text-2xl font-black text-green-600 mt-1">₹{totalProfit}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Value</p>
              <p className="text-2xl font-black text-purple-600 mt-1">₹{avgSaleValue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Check-Ins</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{totalCheckIns}</p>
            </div>
            <Zap className="w-8 h-8 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Advanced Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Avg Profit/Sale</p>
          <p className="text-xl font-black text-green-600">₹{avgProfit}</p>
          <p className="text-[9px] text-slate-400 mt-1">Per transaction</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Valid Logs</p>
          <p className="text-xl font-black text-blue-600">{validLogs}/{logs.length}</p>
          <p className="text-[9px] text-slate-400 mt-1">Verified</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Total Value</p>
          <p className="text-xl font-black text-purple-600">₹{totalValue}</p>
          <p className="text-[9px] text-slate-400 mt-1">All sales</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        <button 
          onClick={() => setActiveHistory('all')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${activeHistory === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>All</span>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">{logs.length + sales.length}</span>
        </button>
        <button 
          onClick={() => setActiveHistory('attendance')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${activeHistory === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          <Clock className="w-4 h-4" />
          <span>Attendance</span>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">{logs.length}</span>
        </button>
        <button 
          onClick={() => setActiveHistory('sales')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${activeHistory === 'sales' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Visits</span>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">{sales.length}</span>
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <Filter className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder={activeHistory === 'sales' ? 'Search pharmacy or medicine...' : activeHistory === 'attendance' ? 'Search by location...' : 'Search activities...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm text-slate-700 placeholder-slate-400"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {activeHistory === 'all' ? (
          // Show all activities combined
          logs.length === 0 && sales.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">No activities found.</p>
          ) : (
            <div className="space-y-4">
              {/* Attendance Section */}
              {filteredLogs.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Attendance ({filteredLogs.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {filteredLogs.map(log => (
                      <div key={log.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${log.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
                              <Clock className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-slate-800">{log.type === 'IN' ? 'Login' : 'Logout'}</span>
                                {log.isValid ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status</p>
                            <p className={`text-[10px] font-bold ${log.isValid ? 'text-green-600' : 'text-red-600'}`}>{log.isValid ? 'Verified' : 'Invalid'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-500 pt-3 border-t border-slate-50">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{log.location.lat.toFixed(4)}, {log.location.lng.toFixed(4)}</span>
                          </div>
                          <img src={log.photo} className="w-8 h-8 rounded-lg object-cover border border-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sales Section */}
              {filteredSales.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Sales Visits ({filteredSales.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {filteredSales.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => setSelectedSale(s)}
                        className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{s.shopName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(s.timestamp).toLocaleTimeString()}</p>
                              {s.shopMobile && <p className="text-[10px] text-blue-600 font-bold">📞 {s.shopMobile}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-blue-600">₹{s.value}</p>
                            <p className="text-[9px] font-bold text-green-600 uppercase">Profit: ₹{s.profit.toFixed(0)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{s.location.lat.toFixed(4)}, {s.location.lng.toFixed(4)}</span>
                          </div>
                          <span className="uppercase text-blue-500">{s.medicineName} (Qty: {s.quantity})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        ) : activeHistory === 'attendance' ? (
          filteredLogs.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">No attendance logs found.</p>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${log.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-800">{log.type === 'IN' ? 'Login' : 'Logout'}</span>
                        {log.isValid ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status</p>
                    <p className={`text-[10px] font-bold ${log.isValid ? 'text-green-600' : 'text-red-600'}`}>{log.isValid ? 'Verified' : 'Invalid'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500 pt-3 border-t border-slate-50">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{log.location.lat.toFixed(4)}, {log.location.lng.toFixed(4)}</span>
                  </div>
                  <img src={log.photo} className="w-8 h-8 rounded-lg object-cover border border-slate-100" />
                </div>
              </div>
            ))
          )
        ) : (
          filteredSales.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">No sales visits logged.</p>
          ) : (
            filteredSales.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedSale(s)}
                className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                       <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{s.shopName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(s.timestamp).toLocaleTimeString()}</p>
                      {s.shopMobile && <p className="text-[10px] text-blue-600 font-bold">📞 {s.shopMobile}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-600">₹{s.value}</p>
                    <p className="text-[9px] font-bold text-green-600 uppercase">Profit: ₹{s.profit.toFixed(0)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{s.location.lat.toFixed(4)}, {s.location.lng.toFixed(4)}</span>
                  </div>
                  <span className="uppercase text-blue-500">{s.medicineName} (Qty: {s.quantity})</span>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Pharmacy Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800">Pharmacy Details</h3>
              <button onClick={() => setSelectedSale(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Pharmacy Header */}
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-sm font-black text-slate-800">{selectedSale.shopName}</p>
                {selectedSale.shopAddress && (
                  <p className="text-xs text-slate-600 mt-2 flex items-start space-x-2">
                    <LocationIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedSale.shopAddress}</span>
                  </p>
                )}
                {selectedSale.shopMobile && (
                  <p className="text-xs text-slate-600 mt-2 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{selectedSale.shopMobile}</span>
                  </p>
                )}
              </div>

              {/* Order Details */}
              <div className="border-b border-slate-100 pb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Order Details</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Medicine:</span>
                    <span className="text-sm font-bold text-slate-800">{selectedSale.medicineName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Quantity:</span>
                    <span className="text-sm font-bold text-slate-800">{selectedSale.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Order Value:</span>
                    <span className="text-sm font-bold text-blue-600">₹{selectedSale.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Profit:</span>
                    <span className="text-sm font-bold text-green-600">₹{selectedSale.profit.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Timeline</p>
                
                <div className="flex space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-500">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="w-0.5 h-8 bg-green-200 my-1"></div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Order Placed</p>
                    <p className="text-[10px] text-slate-500">{new Date(selectedSale.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] text-slate-500">{new Date(selectedSale.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-500">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Expected Delivery</p>
                    <p className="text-[10px] text-slate-500">{selectedSale.deliveryDate ? new Date(selectedSale.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Processing'}</p>
                    <p className="text-[10px] text-slate-400 italic">to pharmacy company</p>
                  </div>
                </div>
              </div>

              {/* Order Confirmation */}
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
                <p className="text-xs font-bold text-green-700 flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Order Confirmed & Processing</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Shops & Performance Section */}
      {(activeHistory === 'sales' || activeHistory === 'all') && sales.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-800">Top Performers</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Revenue Shop */}
            {(() => {
              const topByRevenue = [...sales].sort((a, b) => b.value - a.value)[0];
              return (
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Top Revenue</p>
                      <p className="text-lg font-black text-blue-600 mt-1">{topByRevenue.shopName}</p>
                    </div>
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="space-y-2 pt-3 border-t border-blue-200">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-600 font-bold">Order Value:</span>
                      <span className="text-sm font-black text-blue-600">₹{topByRevenue.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-600 font-bold">Medicine:</span>
                      <span className="text-[10px] font-bold text-slate-800">{topByRevenue.medicineName}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Highest Profit Shop */}
            {(() => {
              const topByProfit = [...sales].sort((a, b) => b.profit - a.profit)[0];
              return (
                <div className="bg-gradient-to-br from-green-50 via-green-50 to-green-100 p-5 rounded-2xl border border-green-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Highest Profit</p>
                      <p className="text-lg font-black text-green-600 mt-1">{topByProfit.shopName}</p>
                    </div>
                    <Flame className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="space-y-2 pt-3 border-t border-green-200">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-600 font-bold">Profit:</span>
                      <span className="text-sm font-black text-green-600">₹{topByProfit.profit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-600 font-bold">Qty Sold:</span>
                      <span className="text-[10px] font-bold text-slate-800">{topByProfit.quantity} units</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Most Visited Shop */}
          {(() => {
            const shopCounts = sales.reduce((acc: Record<string, number>, s) => {
              acc[s.shopName] = (acc[s.shopName] || 0) + 1;
              return acc;
            }, {});
            const mostVisited = Object.entries(shopCounts).sort((a, b) => b[1] - a[1])[0];
            const mostVisitedShop = sales.find(s => s.shopName === mostVisited[0]);

            if (mostVisitedShop) {
              return (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Most Visited</p>
                      <p className="text-lg font-black text-purple-600 mt-1">{mostVisitedShop.shopName}</p>
                      <p className="text-xs text-slate-600 mt-2 flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Visited {mostVisited[1]} times</span>
                      </p>
                    </div>
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
