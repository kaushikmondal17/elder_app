
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
  const [showHistory, setShowHistory] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceRecord | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setMediaStream(stream);
      setStreamActive(true);
      setUseFallback(false);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch(e){}
      }
    } catch (err) {
      setError("Camera access denied or unavailable.");
      setUseFallback(true);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        // Auto-submit login if inside login window and last log isn't IN
        if (location && loginOpen && lastLog?.type !== 'IN') {
          submitWithPhoto(dataUrl, 'IN');
          // notify user
          try { alert('Auto login submitted'); } catch(e){}
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhoto(result);
      // auto-submit if in login window
      if (location && loginOpen && lastLog?.type !== 'IN') {
        submitWithPhoto(result, 'IN');
      }
    };
    reader.readAsDataURL(file);
  };

  const submitWithPhoto = (photoSrc: string, type: 'IN' | 'OUT') => {
    if (!location) {
      setError('GPS not available');
      return;
    }

    const dist = Math.sqrt(
      Math.pow(location.latitude - OFFICE_LOCATION.lat, 2) + 
      Math.pow(location.longitude - OFFICE_LOCATION.lng, 2)
    ) * 111000;
    const place = dist <= GEOFENCE_RADIUS_METERS ? 'Office' : `Outside Office (${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)})`;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      type,
      timestamp: new Date().toISOString(),
      photo: photoSrc,
      location: { lat: location.latitude, lng: location.longitude },
      place,
      isValid: dist <= GEOFENCE_RADIUS_METERS
    });

    // show a short confirmation message
    setConfirmMsg(`${type === 'IN' ? 'Login' : 'Logout'} recorded`);
    setTimeout(() => setConfirmMsg(null), 3000);
  };

  const handleMark = (type: 'IN' | 'OUT') => {
    if (!photo || !location) return;
    // Use shared submit logic
    submitWithPhoto(photo, type);
    setPhoto(null);
  };

  useEffect(() => {
    // Do not auto-start camera to satisfy mobile user-gesture requirements.
    navigator.geolocation.getCurrentPosition((pos) => setLocation(pos.coords));

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [mediaStream]);

  const lastLog = logs[0];

  // Demo/Dummy attendance history data
  const demoLogs: AttendanceRecord[] = [
    {
      id: 'demo-1',
      userId: 'user-123',
      userName: 'John Smith',
      type: 'IN',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%2385c1e9" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em"%3EJS%3C/text%3E%3C/svg%3E',
      location: { lat: 40.7128, lng: -74.0060 },
      place: 'Office',
      isValid: true
    },
    {
      id: 'demo-2',
      userId: 'user-124',
      userName: 'Sarah Johnson',
      type: 'OUT',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f8b739" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em"%3ESJ%3C/text%3E%3C/svg%3E',
      location: { lat: 40.7580, lng: -73.9855 },
      place: 'Office',
      isValid: true
    },
    {
      id: 'demo-3',
      userId: 'user-125',
      userName: 'Mike Davis',
      type: 'IN',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%2352be80" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em"%3EMD%3C/text%3E%3C/svg%3E',
      location: { lat: 40.7489, lng: -73.9680 },
      place: 'Outside Office (40.75890, -73.96800)',
      isValid: false
    },
    {
      id: 'demo-4',
      userId: 'user-126',
      userName: 'Emma Wilson',
      type: 'OUT',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e74c3c" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em"%3EEW%3C/text%3E%3C/svg%3E',
      location: { lat: 40.7614, lng: -73.9776 },
      place: 'Office',
      isValid: true
    },
    {
      id: 'demo-5',
      userId: 'user-127',
      userName: 'Robert Chen',
      type: 'IN',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%239b59b6" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em"%3ERC%3C/text%3E%3C/svg%3E',
      location: { lat: 40.7505, lng: -73.9934 },
      place: 'Outside Office (40.75050, -73.99340)',
      isValid: false
    }
  ];

  const displayLogs = logs.length > 0 ? logs : demoLogs;

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
      {confirmMsg && (
        <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-bold">{confirmMsg}</div>
      )}
      
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {!photo ? (
          <div className="relative bg-slate-900 aspect-[4/3]">
            <video ref={videoRef} playsInline className="w-full h-full object-cover opacity-80" />
            {!streamActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-2 text-center">
                  <button onClick={startCamera} className="px-4 py-2 bg-white text-blue-700 rounded-xl font-bold">Open Camera</button>
                  <div className="text-sm text-white/80">or</div>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-blue-700 rounded-xl font-bold">Upload Photo</button>
                </div>
              </div>
            )}
            {streamActive && (
              <button onClick={capture} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-blue-500 shadow-xl">
                <Camera className="w-8 h-8 text-blue-600" />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
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

          {photo && (
            <div className="mb-3">
              <button
                onClick={() => {
                  // choose action based on windows
                  if (loginOpen && lastLog?.type !== 'IN') handleMark('IN');
                  else if (logoutOpen && lastLog?.type !== 'OUT') handleMark('OUT');
                  else handleMark('IN');
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center"
              >
                Submit
              </button>
              <p className="text-xs text-slate-500 mt-2">Click Submit to record attendance with this photo.</p>
            </div>
          )}

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
             <p className="text-center text-[10px] text-amber-600 font-bold uppercase tracking-wider">Attendance windows are currently closed the time</p>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800">Verification History</h4>
          <button
            onClick={() => setShowHistory(true)}
            className="text-[11px] font-bold uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100"
          >
            Salesman Verification History
          </button>
        </div>
        {displayLogs.map(log => (
          <div 
            key={log.id} 
            onClick={() => setSelectedLog(log)}
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl font-black text-xs ${log.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>{log.type}</div>
              <div>
                <p className="text-sm font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.timestamp).toLocaleDateString()}</p>
                {log.place && <p className="text-[10px] text-slate-500">{log.place}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <img src={log.photo} className="w-12 h-12 rounded-xl object-cover" />
              {log.isValid ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* History modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Salesman Verification History</h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">Close</button>
            </div>
            <div className="space-y-3">
              {displayLogs.length === 0 && <p className="text-sm text-slate-500">No verification records found.</p>}
              {displayLogs.map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl font-black text-xs ${l.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>{l.type}</div>
                    <div>
                      <p className="font-bold text-sm">{new Date(l.timestamp).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{l.userName}</p>
                      <p className="text-xs text-slate-500">Coords: {l.location?.lat},{l.location?.lng}</p>
                      {l.place && <p className="text-xs text-slate-500">{l.place}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img src={l.photo} alt="proof" className="w-12 h-12 rounded-md object-cover" />
                    {l.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceControl;
