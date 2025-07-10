export type Patient = {
  id: string; // This will serve as the MRN (Medical Record Number)
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
};

export type ReferralStatus = 'Draft' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Canceled by referrer' | 'Refused by referred' | 'Patient declined';
export type ReferralSide = 'Left' | 'Right' | 'Both' | 'General';
export type ReferralSeverity = 'Mild' | 'Moderate' | 'Severe';

export type Referral = {
  id: string;
  patient: Patient;
  department: 'Cardiology' | 'Orthopedics' | 'Neurology' | 'Oncology' | 'Pediatrics';
  status: ReferralStatus;
  date: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  isDraft?: boolean;
  // New clinical fields
  diagnosis?: string;
  side?: ReferralSide;
  severity?: ReferralSeverity;
  clinicalDetails?: string;
  treatmentToDate?: string;
  // Audit fields
  referredBy?: string;
  lastEditedBy?: string;
  lastEditedOn?: string;
};

export type NotificationEvent = {
  id: string;
  type: 'Email Sent' | 'Status Update' | 'New Referral';
  details: string;
  timestamp: string;
  recipient: string;
};

export const patients: Patient[] = [
  { id: 'MRN87345', name: 'John Smith', dob: '1985-02-15', gender: 'Male' },
  { id: 'MRN12389', name: 'Emily Jones', dob: '1992-08-22', gender: 'Female' },
  { id: 'MRN55432', name: 'Michael Williams', dob: '1978-11-05', gender: 'Male' },
  { id: 'MRN98765', name: 'Jessica Brown', dob: '2001-04-30', gender: 'Female' },
  { id: 'MRN34567', name: 'David Miller', dob: '1964-07-12', gender: 'Male' },
  { id: 'MRN11223', name: 'Sarah Davis', dob: '1988-01-19', gender: 'Female' },
  { id: 'MRN66778', name: 'John Smith', dob: '1989-03-20', gender: 'Male' },
];

export const referrals: Referral[] = [
  {
    id: 'REF001',
    patient: patients[0],
    department: 'Cardiology',
    status: 'Completed',
    date: '2023-10-26',
    priority: 'Urgent',
    diagnosis: 'Atrial Fibrillation',
    side: 'General',
    severity: 'Severe',
    clinicalDetails: 'Patient presents with irregular heartbeat and shortness of breath.',
    treatmentToDate: 'Prescribed anticoagulants.',
    referredBy: 'Dr. Evelyn Reed',
    lastEditedBy: 'Dr. Evelyn Reed',
    lastEditedOn: '2023-10-26T10:00:00Z',
  },
  {
    id: 'REF002',
    patient: patients[1],
    department: 'Orthopedics',
    status: 'In Progress',
    date: '2023-10-28',
    priority: 'Routine',
    diagnosis: 'Torn ACL',
    side: 'Left',
    severity: 'Moderate',
    clinicalDetails: 'Injury sustained during a soccer match.',
    treatmentToDate: 'Physical therapy initiated.',
    referredBy: 'Dr. Ben Carter',
    lastEditedBy: 'Dr. Ben Carter',
    lastEditedOn: '2023-10-28T14:30:00Z',
  },
  {
    id: 'REF003',
    patient: patients[2],
    department: 'Neurology',
    status: 'Pending',
    date: '2023-11-01',
    priority: 'Routine',
    diagnosis: 'Migraines',
    side: 'General',
    severity: 'Moderate',
    referredBy: 'Dr. Olivia Chen',
    lastEditedBy: 'Dr. Olivia Chen',
    lastEditedOn: '2023-11-01T09:15:00Z',
  },
  {
    id: 'REF004',
    patient: patients[3],
    department: 'Oncology',
    status: 'Cancelled',
    date: '2023-10-29',
    priority: 'STAT',
    referredBy: 'Dr. Sam Wallace',
    lastEditedBy: 'Dr. Sam Wallace',
    lastEditedOn: '2023-10-29T11:00:00Z',
  },
  {
    id: 'REF005',
    patient: patients[4],
    department: 'Pediatrics',
    status: 'Pending',
    date: '2023-11-02',
    priority: 'Urgent',
    referredBy: 'Dr. Chloe Kim',
    lastEditedBy: 'Dr. Chloe Kim',
    lastEditedOn: '2023-11-02T13:00:00Z',
  },
   {
    id: 'REF006',
    patient: patients[5],
    department: 'Cardiology',
    status: 'In Progress',
    date: '2023-11-03',
    priority: 'Urgent',
    diagnosis: 'Coronary Artery Disease',
    side: 'General',
    severity: 'Severe',
    clinicalDetails: 'Patient reports chest pain and fatigue.',
    referredBy: 'Dr. Evelyn Reed',
    lastEditedBy: 'Dr. Isaac Hayes',
    lastEditedOn: '2023-11-04T16:45:00Z',
  },
  {
    id: 'REF007',
    patient: patients[6],
    department: 'Cardiology',
    status: 'Pending',
    date: '2023-11-05',
    priority: 'Routine',
    referredBy: 'Dr. Ben Carter',
    lastEditedBy: 'Dr. Ben Carter',
    lastEditedOn: '2023-11-05T11:30:00Z',
  },
  {
    id: 'REF008',
    patient: patients[0],
    department: 'Oncology',
    status: 'Canceled by referrer',
    date: '2023-11-06',
    priority: 'Routine',
    referredBy: 'Dr. Sam Wallace',
    lastEditedBy: 'Dr. Sam Wallace',
    lastEditedOn: '2023-11-06T10:00:00Z',
  },
  {
    id: 'REF009',
    patient: patients[1],
    department: 'Neurology',
    status: 'Refused by referred',
    date: '2023-11-07',
    priority: 'Routine',
    referredBy: 'Dr. Olivia Chen',
    lastEditedBy: 'Dr. Olivia Chen',
    lastEditedOn: '2023-11-07T14:00:00Z',
  },
  {
    id: 'REF010',
    patient: patients[2],
    department: 'Orthopedics',
    status: 'Patient declined',
    date: '2023-11-08',
    priority: 'Routine',
    referredBy: 'Dr. Ben Carter',
    lastEditedBy: 'Dr. Ben Carter',
    lastEditedOn: '2023-11-08T18:00:00Z',
  },
  {
    id: 'REF011',
    patient: patients[3],
    department: 'Cardiology',
    status: 'Draft',
    date: '2023-11-09',
    priority: 'Routine',
    isDraft: true,
    referredBy: 'Dr. Jane Doe',
    lastEditedBy: 'Dr. Jane Doe',
    lastEditedOn: '2023-11-09T12:00:00Z',
  },
];

export const notifications: NotificationEvent[] = [
    { id: 'EVT001', type: 'Email Sent', details: 'Appointment reminder sent for referral REF002', timestamp: '2023-10-29 10:00 AM', recipient: 'emily.jones@email.com' },
    { id: 'EVT002', type: 'Status Update', details: 'Referral REF001 status changed to "Completed"', timestamp: '2023-10-28 03:45 PM', recipient: 'System' },
    { id: 'EVT003', type: 'New Referral', details: 'New referral REF005 created for Pediatrics', timestamp: '2023-11-02 09:15 AM', recipient: 'admin@clinic.com' },
    { id: 'EVT004', type: 'Status Update', details: 'Referral REF004 status changed to "Cancelled"', timestamp: '2023-10-29 11:20 AM', recipient: 'System' },
    { id: 'EVT005', type: 'Email Sent', details: 'Referral confirmation sent for REF005', timestamp: '2023-11-02 09:16 AM', recipient: 'david.miller@email.com' },
];
