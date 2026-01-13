
import React, { useState, useRef, useEffect } from 'react';
import { User, AttendanceRecord } from '../types';
import { Camera, MapPin, CheckCircle2, AlertCircle, Clock, Lock } from 'lucide-react';
import { OFFICE_LOCATION, GEOFENCE_RADIUS_METERS, ATTENDANCE_WINDOWS } from '../constants';

interface AttendanceControlProps {
  user: User;
  logs: AttendanceRecord[];
  onAdd: (log: AttendanceRecord) => void;
}

const AttendanceControl: React.FC<AttendanceControlProps> = ({ user, logs, onAdd }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isTimeInWindow = (window: { start: string, end: string }) => {
    const now = new Date();
    const [startH, startM] = window.start.split(':').map(Number);
    const [endH, endM] = window.end.split(':').map(Number);
    const startTime = new Date(now).setHours(startH, startM, 0);
    const endTime = new Date(now).setHours(endH, endM, 0);
    return now.getTime() >= startTime && now.getTime() <= endTime;
  };

  const loginOpen = isTimeInWindow(ATTENDANCE_WINDOWS.LOGIN);
  const logoutOpen = isTimeInWindow(ATTENDANCE_WINDOWS.LOGOUT);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Camera access denied.");
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        setPhoto(canvasRef.current.toDataURL('image/jpeg'));
      }
    }
  };

  const handleMark = (type: 'IN' | 'OUT') => {
    if (!photo || !location) return;
    
    // Strict bypass for demo: in production would enforce loginOpen/logoutOpen
    const dist = Math.sqrt(
      Math.pow(location.latitude - OFFICE_LOCATION.lat, 2) + 
      Math.pow(location.longitude - OFFICE_LOCATION.lng, 2)
    ) * 111000;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      type,
      timestamp: new Date().toISOString(),
      photo,
      location: { lat: location.latitude, lng: location.longitude },
      isValid: dist <= GEOFENCE_RADIUS_METERS
    });
    setPhoto(null);
  };

  useEffect(() => {
    startCamera();
    navigator.geolocation.getCurrentPosition((pos) => setLocation(pos.coords));
  }, []);

  const lastLog = logs[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Duty Desk</h2>
        <div className="flex flex-col items-end">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${loginOpen ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            LOGIN: {ATTENDANCE_WINDOWS.LOGIN.start}-{ATTENDANCE_WINDOWS.LOGIN.end}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${logoutOpen ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            LOGOUT: {ATTENDANCE_WINDOWS.LOGOUT.start}-{ATTENDANCE_WINDOWS.LOGOUT.end}
          </span>
        </div>
      </div>
      
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {!photo ? (
          <div className="relative bg-slate-900 aspect-[4/3]">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
            <button onClick={capture} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-blue-500 shadow-xl">
              <Camera className="w-8 h-8 text-blue-600" />
            </button>
          </div>
        ) : (
          <div className="relative aspect-[4/3]">
            <img src={photo} className="w-full h-full object-cover" />
            <button onClick={() => setPhoto(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg text-xs font-bold">Retake</button>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="text-slate-600 font-medium">{location ? 'Location Locked' : 'Searching GPS...'}</span>
          </div>

          <div className="flex gap-4">
            <button 
              disabled={!photo || lastLog?.type === 'IN' || !loginOpen}
              onClick={() => handleMark('IN')}
              className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-30 flex items-center justify-center space-x-2"
            >
              {!loginOpen && <Lock className="w-4 h-4" />}
              <span>Login</span>
            </button>
            <button 
              disabled={!photo || lastLog?.type === 'OUT' || !lastLog || !logoutOpen}
              onClick={() => handleMark('OUT')}
              className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg disabled:opacity-30 flex items-center justify-center space-x-2"
            >
              {!logoutOpen && <Lock className="w-4 h-4" />}
              <span>Logout</span>
            </button>
          </div>
          {!loginOpen && !logoutOpen && (
             <p className="text-center text-[10px] text-amber-600 font-bold uppercase tracking-wider">Attendance windows are currently closed</p>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      <div className="space-y-4">
        <h4 className="font-bold text-slate-800">Verification History</h4>
        {logs.map(log => (
          <div key={log.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl font-black text-xs ${log.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>{log.type}</div>
              <div>
                <p className="text-sm font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <img src={log.photo} className="w-12 h-12 rounded-xl object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceControl;
