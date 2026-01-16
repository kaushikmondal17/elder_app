
export enum UserRole {
  SALESMAN = 'SALESMAN',
  MANAGER = 'MANAGER'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  deadline: string;
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  points: number;
  salary: number;
  pf: number;
  department: string;
  joiningDate: string;
  bloodGroup: string;
  password?: string;
  photoSeed?: string;
  assignedTasks?: Task[];
  aadharNo?: string;
  idProofType?: string;
  companyIdNo?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'SICK' | 'CASUAL' | 'EARNED';
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
}

export interface SalesRecord {
  id: string;
  salesmanId: string;
  salesmanName: string;
  shopName: string;
  shopAddress?: string;
  shopMobile?: string;
  medicineName: string;
  quantity: number;
  value: number;
  profit: number;
  timestamp: string;
  deliveryDate?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  type: 'IN' | 'OUT';
  timestamp: string;
  photo: string;
  location: {
    lat: number;
    lng: number;
  };
  place?: string;
  isValid: boolean;
}
