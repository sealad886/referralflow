export type Patient = {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
};

export type Referral = {
  id: string;
  patient: Patient;
  department: 'Cardiology' | 'Orthopedics' | 'Neurology' | 'Oncology' | 'Pediatrics';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
};

export type NotificationEvent = {
  id: string;
  type: 'Email Sent' | 'Status Update' | 'New Referral';
  details: string;
  timestamp: string;
  recipient: string;
};

export const patients: Patient[] = [
  { id: 'PAT001', name: 'John Smith', dob: '1985-02-15', gender: 'Male' },
  { id: 'PAT002', name: 'Emily Jones', dob: '1992-08-22', gender: 'Female' },
  { id: 'PAT003', name: 'Michael Williams', dob: '1978-11-05', gender: 'Male' },
  { id: 'PAT004', name: 'Jessica Brown', dob: '2001-04-30', gender: 'Female' },
  { id: 'PAT005', name: 'David Miller', dob: '1964-07-12', gender: 'Male' },
];

export const referrals: Referral[] = [
  {
    id: 'REF001',
    patient: patients[0],
    department: 'Cardiology',
    status: 'Completed',
    date: '2023-10-26',
    priority: 'Urgent',
  },
  {
    id: 'REF002',
    patient: patients[1],
    department: 'Orthopedics',
    status: 'In Progress',
    date: '2023-10-28',
    priority: 'Routine',
  },
  {
    id: 'REF003',
    patient: patients[2],
    department: 'Neurology',
    status: 'Pending',
    date: '2023-11-01',
    priority: 'Routine',
  },
  {
    id: 'REF004',
    patient: patients[3],
    department: 'Oncology',
    status: 'Cancelled',
    date: '2023-10-29',
    priority: 'STAT',
  },
  {
    id: 'REF005',
    patient: patients[4],
    department: 'Pediatrics',
    status: 'Pending',
    date: '2023-11-02',
    priority: 'Urgent',
  },
   {
    id: 'REF006',
    patient: { id: 'PAT006', name: 'Sarah Davis', dob: '1988-01-19', gender: 'Female' },
    department: 'Cardiology',
    status: 'In Progress',
    date: '2023-11-03',
    priority: 'Urgent',
  },
];

export const notifications: NotificationEvent[] = [
    { id: 'EVT001', type: 'Email Sent', details: 'Appointment reminder sent for referral REF002', timestamp: '2023-10-29 10:00 AM', recipient: 'emily.jones@email.com' },
    { id: 'EVT002', type: 'Status Update', details: 'Referral REF001 status changed to "Completed"', timestamp: '2023-10-28 03:45 PM', recipient: 'System' },
    { id: 'EVT003', type: 'New Referral', details: 'New referral REF005 created for Pediatrics', timestamp: '2023-11-02 09:15 AM', recipient: 'admin@clinic.com' },
    { id: 'EVT004', type: 'Status Update', details: 'Referral REF004 status changed to "Cancelled"', timestamp: '2023-10-29 11:20 AM', recipient: 'System' },
    { id: 'EVT005', type: 'Email Sent', details: 'Referral confirmation sent for REF005', timestamp: '2023-11-02 09:16 AM', recipient: 'david.miller@email.com' },
];
