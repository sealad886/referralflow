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

// --- User Management ---

export type UserRole = 'Admin' | 'Manager' | 'Clinical' | 'Clerical';
export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export type UserPermission =
  | 'CanAssignReferral'
  | 'CanCompleteReferral'
  | 'CanRefuseReferral'
  | 'CanEditUsers'
  | 'CanViewGroupAnalytics'
  | 'CanViewSystemAnalytics';

export type UserGroup = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  permissions: UserPermission[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  role: UserRole;
  status: UserStatus;
  departments: string[];
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  groups: string[]; // Array of group IDs
  permissions: { [key in UserPermission]?: boolean }; // User-specific overrides
  lastLogin: string;
  professionalRegBody?: string;
  professionalRegId?: string;
  mfaEnabled: boolean;
};

// --- Location Management ---

export type LocationType = 'Facility' | 'Department';

export type LocationSettings = {
  id: `setting_${string}`;
  name: string;
  value: string | number | boolean;
  unit?: 'days' | 'hours' | 'percent';
  description: string;
  isInherited?: boolean; // Used by the simulator
};

export type Location = {
  id: `loc_${string}`;
  name: string;
  type: LocationType;
  parentId?: `loc_${string}` | null;
  settings: LocationSettings[];
};

export const locations: Location[] = [
  {
    id: 'loc_main_hospital',
    name: 'City Central Hospital',
    type: 'Facility',
    parentId: null,
    settings: [
      { id: 'setting_001', name: 'Default Referral Deadline', value: 14, unit: 'days', description: 'Default time frame for routine referrals to be completed.' },
      { id: 'setting_002', name: 'Urgent Referral Deadline', value: 3, unit: 'days', description: 'Default time frame for urgent referrals to be completed.' },
    ],
  },
  {
    id: 'loc_cardiology_dept',
    name: 'Cardiology',
    type: 'Department',
    parentId: 'loc_main_hospital',
    settings: [
       { id: 'setting_002', name: 'Urgent Referral Deadline', value: 2, unit: 'days', description: 'Cardiology requires a faster turnaround for urgent cases.' },
    ],
  },
  {
    id: 'loc_ortho_dept',
    name: 'Orthopedics',
    type: 'Department',
    parentId: 'loc_main_hospital',
    settings: [],
  },
  {
    id: 'loc_dialysis_unit',
    name: 'Dialysis Unit',
    type: 'Department',
    parentId: 'loc_cardiology_dept',
    settings: [
       { id: 'setting_001', name: 'Default Referral Deadline', value: 7, unit: 'days', description: 'Dialysis referrals must be processed weekly.' },
       { id: 'setting_003', name: 'Requires Pre-authorization', value: true, description: 'All dialysis referrals require pre-authorization from insurance.'}
    ],
  },
   {
    id: 'loc_dialysis_4th_floor',
    name: 'Dialysis, 4th Floor',
    type: 'Department',
    parentId: 'loc_dialysis_unit',
    settings: [],
  },
  {
    id: 'loc_dialysis_ground_floor',
    name: 'Dialysis, Ground Floor',
    type: 'Department',
    parentId: 'loc_dialysis_unit',
    settings: [
      { id: 'setting_001', name: 'Default Referral Deadline', value: 5, unit: 'days', description: 'Ground floor has higher throughput and requires faster completion.' },
    ],
  },
];


export const userGroups: UserGroup[] = [
    {
        id: 'group_cardio_clinicians',
        name: 'Cardiology Clinicians',
        description: 'Clinical staff in the Cardiology department.',
        memberCount: 2,
        permissions: ['CanAssignReferral', 'CanCompleteReferral', 'CanRefuseReferral'],
    },
    {
        id: 'group_managers',
        name: 'Department Managers',
        description: 'Managers overseeing departmental operations.',
        memberCount: 1,
        permissions: ['CanEditUsers', 'CanViewGroupAnalytics'],
    },
     {
        id: 'group_admins',
        name: 'System Administrators',
        description: 'Users with full system access.',
        memberCount: 1,
        permissions: ['CanEditUsers', 'CanViewGroupAnalytics', 'CanViewSystemAnalytics', 'CanAssignReferral', 'CanCompleteReferral', 'CanRefuseReferral'],
    },
];

export const users: User[] = [
  {
    id: 'usr_001',
    firstName: 'Jane',
    lastName: 'Doe',
    title: 'Dr.',
    role: 'Admin',
    status: 'Active',
    departments: ['Administration', 'Cardiology'],
    email: 'jane.doe@clinic.com',
    emailVerified: true,
    phone: '+1 (555) 123-4567',
    phoneVerified: true,
    groups: ['group_admins'],
    permissions: {},
    lastLogin: '2023-11-10T10:00:00Z',
    mfaEnabled: true,
  },
  {
    id: 'usr_002',
    firstName: 'Ben',
    lastName: 'Carter',
    title: 'Dr.',
    role: 'Clinical',
    status: 'Active',
    departments: ['Orthopedics'],
    email: 'ben.carter@clinic.com',
    emailVerified: true,
    phone: '+1 (555) 987-6543',
    phoneVerified: false,
    groups: [],
    permissions: {
      CanAssignReferral: true,
      CanCompleteReferral: true,
      CanRefuseReferral: true,
    },
    lastLogin: '2023-11-09T14:20:00Z',
    professionalRegBody: 'GMC',
    professionalRegId: '7654321',
    mfaEnabled: false,
  },
   {
    id: 'usr_003',
    firstName: 'Evelyn',
    lastName: 'Reed',
    title: 'Dr.',
    role: 'Manager',
    status: 'Active',
    departments: ['Cardiology'],
    email: 'evelyn.reed@clinic.com',
    emailVerified: true,
    phone: '+1 (555) 111-2222',
    phoneVerified: true,
    groups: ['group_managers', 'group_cardio_clinicians'],
    permissions: {},
    lastLogin: '2023-11-10T11:05:00Z',
    professionalRegBody: 'AMA',
    professionalRegId: '1234567',
    mfaEnabled: true,
  },
  {
    id: 'usr_004',
    firstName: 'Admissions',
    lastName: 'Clerk',
    title: '',
    role: 'Clerical',
    status: 'Active',
    departments: ['Admissions'],
    email: 'admissions@clinic.com',
    emailVerified: true,
    phone: '+1 (555) 333-4444',
    phoneVerified: true,
    groups: [],
    permissions: {},
    lastLogin: '2023-11-10T09:15:00Z',
    mfaEnabled: false,
  },
    {
    id: 'usr_005',
    firstName: 'Isaac',
    lastName: 'Hayes',
    title: 'Dr.',
    role: 'Clinical',
    status: 'Inactive',
    departments: ['Cardiology'],
    email: 'isaac.hayes@clinic.com',
    emailVerified: false,
    phone: '+1 (555) 555-6666',
    phoneVerified: false,
    groups: ['group_cardio_clinicians'],
    permissions: {},
    lastLogin: '2023-09-15T18:00:00Z',
    professionalRegBody: 'GMC',
    professionalRegId: '9876543',
    mfaEnabled: false,
  },
    {
    id: 'usr_006',
    firstName: 'Pending',
    lastName: 'User',
    title: '',
    role: 'Clerical',
    status: 'Pending',
    departments: ['Neurology'],
    email: 'pending@clinic.com',
    emailVerified: false,
    phone: '',
    phoneVerified: false,
    groups: [],
    permissions: {},
    lastLogin: '',
    mfaEnabled: false,
  },
];


// --- END User Management ---


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
