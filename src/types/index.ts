export type NavigationTab =
  | 'home'
  | 'dashboard'
  | 'new-task'
  | 'task-detail'
  | 'new-activity'
  | 'activity-detail'
  | 'attendance'
  | 'personal-vault'
  | 'photo-gallery'
  | 'company-group'
  | 'voucher-creation'
  | 'voucher-detail'
  | 'language'
  | 'profile-settings';

export type LanguageCode = 'en' | 'ta' | 'hi';

export interface EmployeePermissions {
  personalVault: boolean;
  photoGallery: boolean;
  companyGroup: boolean;
  voucherCreation: boolean;
  taskRequirements: boolean;
  activityAccess: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  employeeCode: string;
  designation: string;
  department: string;
  phone: string;
  salary: string;
  agreementStart: string;
  agreementEnd: string;
  avatarUrl: string;
  permissions: EmployeePermissions;
  leaveBalance: {
    taken: number;
    remaining: number;
    total: number;
  };
}

export type AttendanceStatus =
  | 'Not Checked In'
  | 'Checked In'
  | 'Checked Out'
  | 'Late'
  | 'Absent'
  | 'Present';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  dateFormatted: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: string | null;
  status: AttendanceStatus;
}

export interface RegularTask {
  id: string;
  employeeId: string;
  title: string;
  scheduledTime: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  scheduledDays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  scheduledDates?: number[]; // Day of month, e.g., 5, 20
  status: 'Pending' | 'In Progress' | 'Completed';
  completedAt?: string;
  completedDate?: string;
}

export type TaskStatus =
  | 'Pending'
  | 'In Progress'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Re-upload Requested';

export interface TaskPhoto {
  url: string;
  location: string;
  timestamp: string;
}

export interface TaskVideo {
  url: string;
  title: string;
  duration: string;
}

export interface TaskSubmissions {
  beforePhoto?: string;
  afterPhoto?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  photos: TaskPhoto[];
  video?: TaskVideo;
  signatureName?: string;
  confirmedSignature?: boolean;
  markRating?: number;
  narrativeNote?: string;
}

export interface AssignedTask {
  id: string;
  employeeId: string;
  taskNumber: number;
  clientName: string;
  companyName: string;
  taskTitle: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  checkInWindow: string;
  checkOutWindow: string;
  adminVoiceNote?: {
    duration: string;
    durationSeconds: number;
    recordedDate: string;
    audioTitle: string;
  };
  requiredChecklist: {
    beforeAfterPhotos: boolean;
    voiceReply: boolean;
    fourPhotosOneVideo: boolean;
    signature: boolean;
    markRating: boolean;
  };
  submissions: TaskSubmissions;
  status: TaskStatus;
  submittedAt?: string;
  adminFeedback?: string;
  adminReviewedAt?: string;
}

export type ActivityStatus =
  | 'Raised'
  | 'Acknowledged'
  | 'Assigned'
  | 'In Progress'
  | 'Work Completed'
  | 'Awaiting Admin Verification'
  | 'Resolved'
  | 'Closed'
  | 'Reopened';

export interface ActivityItem {
  id: string;
  employeeId: string;
  activityNumber: number;
  clientName: string;
  companyName: string;
  siteName: string;
  problem: string;
  date: string;
  time: string;
  adminInstructions: string;
  status: ActivityStatus;
  beforePhoto?: string;
  afterPhoto?: string;
  additionalNote?: string;
  submittedAt?: string;
}

export type VoucherReason =
  | 'Late'
  | 'Permission Request'
  | 'Leave Request'
  | 'Unexpected'
  | 'Advance Request'
  | 'Other';

export interface Voucher {
  id: string;
  employeeId: string;
  voucherCode: string;
  reason: VoucherReason;
  customReason?: string;
  date: string;
  time: string;
  description: string;
  status: 'Submitted for Admin Review' | 'Approved' | 'Rejected';
  adminResponse?: string;
  adminReviewedAt?: string;
  createdAt: string;
}

export interface VaultItem {
  id: string;
  employeeId: string;
  parentId: string | null;
  name: string;
  type: 'folder' | 'document' | 'photo';
  size?: string;
  updatedAt: string;
  url?: string;
}

export interface GalleryPhoto {
  id: string;
  employeeId: string;
  title: string;
  url: string;
  location: string;
  date: string;
}

export interface OfficialGroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Admin' | 'Client' | 'Employee';
  avatarUrl: string;
  text: string;
  timestamp: string;
  attachmentType?: 'image' | 'voice' | 'document';
  attachmentUrl?: string;
  attachmentMeta?: string;
}

export interface NotificationItem {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  type: 'task' | 'activity' | 'voucher' | 'attendance' | 'admin' | 'group';
  timestamp: string;
  read: boolean;
  targetPage?: NavigationTab;
  targetId?: string;
}
