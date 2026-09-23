import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Employee,
  NavigationTab,
  LanguageCode,
  AttendanceRecord,
  RegularTask,
  AssignedTask,
  ActivityItem,
  Voucher,
  VaultItem,
  GalleryPhoto,
  OfficialGroupMessage,
  NotificationItem,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_REGULAR_TASKS,
  INITIAL_ASSIGNED_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_VOUCHERS,
  INITIAL_VAULT_ITEMS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_GROUP_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { getTranslation } from '../i18n/translations';

interface PortalContextType {
  currentEmployee: Employee;
  allEmployees: Employee[];
  switchEmployee: (employeeId: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  selectedVoucherId: string | null;
  setSelectedVoucherId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  attendance: AttendanceRecord[];
  todayAttendance: AttendanceRecord;
  handleCheckIn: () => void;
  handleCheckOut: () => boolean;
  regularTasks: RegularTask[];
  todayRegularTasks: RegularTask[];
  regularTasksCompletedToday: number;
  regularTasksTotalToday: number;
  canCheckOut: boolean;
  startRegularTask: (id: string) => void;
  completeRegularTask: (id: string) => void;
  assignedTasks: AssignedTask[];
  updateTaskSubmissions: (taskId: string, partialSubmissions: Partial<AssignedTask['submissions']>) => void;
  saveTaskDraft: (taskId: string) => void;
  submitAssignedTask: (taskId: string) => boolean;
  activities: ActivityItem[];
  submitActivityEvidence: (activityId: string, before: string, after: string, note: string) => void;
  vouchers: Voucher[];
  createVoucher: (data: { reason: Voucher['reason']; customReason?: string; date: string; time: string; description: string }) => void;
  vaultItems: VaultItem[];
  createVaultFolder: (name: string, parentId: string | null) => void;
  uploadVaultFile: (name: string, type: 'document' | 'photo', size: string, parentId: string | null) => void;
  deleteVaultItem: (id: string) => void;
  galleryPhotos: GalleryPhoto[];
  uploadGalleryPhoto: (title: string, location: string, url?: string) => void;
  deleteGalleryPhoto: (id: string) => void;
  groupMessages: OfficialGroupMessage[];
  sendGroupMessage: (text: string, attachmentType?: 'image' | 'voice' | 'document') => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  hasEnteredWorkspace: boolean;
  setHasEnteredWorkspace: (entered: boolean) => void;
  signOut: () => void;
  resetWorkspaceData: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'echo_portal_theme',
  LANG: 'echo_portal_lang',
  EMPLOYEE_ID: 'echo_portal_emp_id',
  AUTH: 'echo_portal_auth',
  ENTERED: 'echo_portal_entered',
  ATTENDANCE: 'echo_portal_attendance',
  REG_TASKS: 'echo_portal_reg_tasks_v2',
  ASSIGNED_TASKS: 'echo_portal_assigned_tasks',
  ACTIVITIES: 'echo_portal_activities',
  VOUCHERS: 'echo_portal_vouchers',
  VAULT: 'echo_portal_vault',
  GALLERY: 'echo_portal_gallery',
  MESSAGES: 'echo_portal_messages',
  NOTIFICATIONS: 'echo_portal_notifications',
};

// In-memory fallback dictionary for restrictive iframe environments where localStorage is blocked
const memoryStorage: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch {
    // Restricted iframe storage / SecurityError
  }
  return memoryStorage[key] ?? null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Restricted iframe storage / SecurityError
  }
  memoryStorage[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Restricted iframe storage
  }
  delete memoryStorage[key];
}

// Safe JSON parser and writer
function safeGetJSON<T>(key: string, fallback: T): T {
  try {
    const saved = safeGetItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeSetJSON<T>(key: string, value: T): void {
  try {
    safeSetItem(key, JSON.stringify(value));
  } catch {
    // Graceful fallback
  }
}

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeGetItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    safeSetItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Language state
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = safeGetItem(STORAGE_KEYS.LANG) as LanguageCode | null;
    return saved === 'ta' || saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    safeSetItem(STORAGE_KEYS.LANG, lang);
  };

  const t = (key: string) => getTranslation(key, language);

  // Authentication & Flow State: Default to TRUE so the portal is instantly live in preview
  const [hasEnteredWorkspace, setHasEnteredWorkspaceState] = useState<boolean>(() => {
    const saved = safeGetItem(STORAGE_KEYS.ENTERED);
    return saved === null ? true : saved === 'true';
  });

  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    const saved = safeGetItem(STORAGE_KEYS.AUTH);
    return saved === null ? true : saved === 'true';
  });

  const setHasEnteredWorkspace = (val: boolean) => {
    setHasEnteredWorkspaceState(val);
    safeSetItem(STORAGE_KEYS.ENTERED, String(val));
  };

  const setIsAuthenticated = (val: boolean) => {
    setIsAuthenticatedState(val);
    safeSetItem(STORAGE_KEYS.AUTH, String(val));
  };

  // Employee State
  const [employeeId, setEmployeeId] = useState<string>(() => {
    return safeGetItem(STORAGE_KEYS.EMPLOYEE_ID) || 'emp-arjun';
  });

  const currentEmployee = INITIAL_EMPLOYEES.find((e) => e.id === employeeId) || INITIAL_EMPLOYEES[0];

  const switchEmployee = (newId: string) => {
    setEmployeeId(newId);
    safeSetItem(STORAGE_KEYS.EMPLOYEE_ID, newId);
    setActiveTab('home');
    setSelectedTaskId(null);
    setSelectedActivityId(null);
    setSelectedVoucherId(null);
  };

  // Navigation & Sub-views
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Attendance
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    return safeGetJSON(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.ATTENDANCE, attendance);
  }, [attendance]);

  const todayRecord = attendance.find((a) => a.date === '2026-09-23') || {
    id: 'att-today',
    employeeId: currentEmployee.id,
    date: '2026-09-23',
    dateFormatted: '23 Sep',
    checkIn: null,
    checkOut: null,
    hours: null,
    status: 'Not Checked In',
  };

  const handleCheckIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // Determine Late status if check-in is after 9:15 AM
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);
    const newStatus = isLate ? 'Late' : 'Checked In';

    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.date === '2026-09-23') {
          return {
            ...rec,
            checkIn: timeStr,
            status: newStatus,
          };
        }
        return rec;
      })
    );

    // Add notification
    addNotification({
      title: 'Attendance Recorded',
      message: `Checked in at ${timeStr} (${newStatus}).`,
      type: 'attendance',
      targetPage: 'attendance',
    });
  };

  const handleCheckOut = (): boolean => {
    if (!canCheckOut) return false;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.date === '2026-09-23') {
          return {
            ...rec,
            checkOut: timeStr,
            hours: '8h 52m',
            status: 'Present',
          };
        }
        return rec;
      })
    );

    addNotification({
      title: 'Shift Completed',
      message: `Checked out at ${timeStr}. Working hours recorded: 8h 52m.`,
      type: 'attendance',
      targetPage: 'attendance',
    });

    return true;
  };

  // Regular Tasks
  const [regularTasks, setRegularTasks] = useState<RegularTask[]>(() => {
    return safeGetJSON(STORAGE_KEYS.REG_TASKS, INITIAL_REGULAR_TASKS);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.REG_TASKS, regularTasks);
  }, [regularTasks]);

  const startRegularTask = (id: string) => {
    setRegularTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'In Progress' } : t))
    );
  };

  const completeRegularTask = (id: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const taskItem = regularTasks.find((t) => t.id === id);

    setRegularTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Completed',
              completedAt: timeStr,
              completedDate: '23 Sep 2026',
            }
          : t
      )
    );

    addNotification({
      title: 'Regular Task Completed',
      message: `${taskItem?.title || 'Task'} completed at ${timeStr}. Synced to Admin Monitor.`,
      type: 'task',
      targetPage: 'home',
    });
  };

  // Regular tasks scheduled for today (Wednesday, 23 Sep 2026)
  const todayDayOfWeek = 3;
  const todayDayOfMonth = 23;

  const todayRegularTasks = regularTasks.filter((task) => {
    if (task.frequency === 'daily') return true;
    if (task.frequency === 'weekly' && task.scheduledDays?.includes(todayDayOfWeek)) return true;
    if (task.frequency === 'monthly' && task.scheduledDates?.includes(todayDayOfMonth)) return true;
    return false;
  });

  const regularTasksCompletedToday = todayRegularTasks.filter((x) => x.status === 'Completed').length;
  const regularTasksTotalToday = todayRegularTasks.length;
  const canCheckOut =
    regularTasksTotalToday > 0 && regularTasksCompletedToday >= regularTasksTotalToday;

  // Assigned Tasks
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>(() => {
    return safeGetJSON(STORAGE_KEYS.ASSIGNED_TASKS, INITIAL_ASSIGNED_TASKS);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.ASSIGNED_TASKS, assignedTasks);
  }, [assignedTasks]);

  const updateTaskSubmissions = (taskId: string, partial: Partial<AssignedTask['submissions']>) => {
    setAssignedTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            submissions: {
              ...t.submissions,
              ...partial,
            },
          };
        }
        return t;
      })
    );
  };

  const saveTaskDraft = (taskId: string) => {
    setAssignedTasks((prev) =>
      prev.map((t) => (t.id === taskId && t.status === 'Pending' ? { ...t, status: 'In Progress' } : t))
    );
  };

  const submitAssignedTask = (taskId: string): boolean => {
    const task = assignedTasks.find((t) => t.id === taskId);
    if (!task) return false;

    // Validate mandatory admin checklist items
    const req = task.requiredChecklist;
    const sub = task.submissions;

    if (req.beforeAfterPhotos && (!sub.beforePhoto || !sub.afterPhoto)) {
      return false;
    }
    if (req.voiceReply && !sub.voiceNoteUrl) {
      return false;
    }
    if (req.fourPhotosOneVideo && (sub.photos.length < 4 || !sub.video)) {
      return false;
    }
    if (req.signature && (!sub.signatureName || !sub.confirmedSignature)) {
      return false;
    }
    if (req.markRating && (!sub.markRating || sub.markRating < 1)) {
      return false;
    }

    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    setAssignedTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'Submitted',
              submittedAt: timeStr,
            }
          : t
      )
    );

    addNotification({
      title: 'Task Evidence Submitted',
      message: `Task #${task.taskNumber}: "${task.taskTitle}" submitted. Awaiting Admin Review.`,
      type: 'task',
      targetPage: 'new-task',
      targetId: task.id,
    });

    return true;
  };

  // Activities
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    return safeGetJSON(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  const submitActivityEvidence = (activityId: string, before: string, after: string, note: string) => {
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    setActivities((prev) =>
      prev.map((act) =>
        act.id === activityId
          ? {
              ...act,
              status: 'Awaiting Admin Verification',
              beforePhoto: before || act.beforePhoto,
              afterPhoto: after || act.afterPhoto,
              additionalNote: note,
              submittedAt: timeStr,
            }
          : act
      )
    );

    addNotification({
      title: 'Activity Evidence Submitted',
      message: `Activity #${activityId}: Resolution evidence submitted to Admin Raised Activity stream.`,
      type: 'activity',
      targetPage: 'new-activity',
      targetId: activityId,
    });
  };

  // Vouchers
  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    return safeGetJSON(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.VOUCHERS, vouchers);
  }, [vouchers]);

  const createVoucher = (data: {
    reason: Voucher['reason'];
    customReason?: string;
    date: string;
    time: string;
    description: string;
  }) => {
    const code = `VCH-${Math.floor(9000 + Math.random() * 900)}`;
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const newVoucher: Voucher = {
      id: code.toLowerCase(),
      employeeId: currentEmployee.id,
      voucherCode: code,
      reason: data.reason,
      customReason: data.customReason,
      date: data.date,
      time: data.time,
      description: data.description,
      status: 'Submitted for Admin Review',
      createdAt: timeStr,
    };

    setVouchers((prev) => [newVoucher, ...prev]);

    addNotification({
      title: 'Voucher Submitted',
      message: `Voucher ${code} for ${data.reason} has been submitted for Admin Review.`,
      type: 'voucher',
      targetPage: 'voucher-creation',
      targetId: newVoucher.id,
    });
  };

  // Personal Vault
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    return safeGetJSON(STORAGE_KEYS.VAULT, INITIAL_VAULT_ITEMS);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.VAULT, vaultItems);
  }, [vaultItems]);

  const createVaultFolder = (name: string, parentId: string | null) => {
    const newFolder: VaultItem = {
      id: `vf-${Date.now()}`,
      employeeId: currentEmployee.id,
      parentId,
      name,
      type: 'folder',
      updatedAt: 'Today',
    };
    setVaultItems((prev) => [...prev, newFolder]);
  };

  const uploadVaultFile = (name: string, type: 'document' | 'photo', size: string, parentId: string | null) => {
    const newFile: VaultItem = {
      id: `vfile-${Date.now()}`,
      employeeId: currentEmployee.id,
      parentId,
      name,
      type,
      size,
      updatedAt: 'Today',
    };
    setVaultItems((prev) => [...prev, newFile]);
  };

  const deleteVaultItem = (id: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== id && item.parentId !== id));
  };

  // Photo Gallery
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    return safeGetJSON(STORAGE_KEYS.GALLERY, INITIAL_GALLERY_PHOTOS);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.GALLERY, galleryPhotos);
  }, [galleryPhotos]);

  const uploadGalleryPhoto = (title: string, location: string, url?: string) => {
    const newPhoto: GalleryPhoto = {
      id: `gp-${Date.now()}`,
      employeeId: currentEmployee.id,
      title,
      url: url || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2338bdf8" font-family="sans-serif" font-size="18">Field Capture Upload</text></svg>',
      location: location || 'Field Location · Chennai',
      date: '23 Sep 2026',
    };
    setGalleryPhotos((prev) => [newPhoto, ...prev]);
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Group Messages
  const [groupMessages, setGroupMessages] = useState<OfficialGroupMessage[]>(() => {
    return safeGetJSON(STORAGE_KEYS.MESSAGES, INITIAL_GROUP_MESSAGES);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.MESSAGES, groupMessages);
  }, [groupMessages]);

  const sendGroupMessage = (text: string, attachmentType?: 'image' | 'voice' | 'document') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const newMsg: OfficialGroupMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentEmployee.id,
      senderName: currentEmployee.name,
      senderRole: 'Employee',
      avatarUrl: currentEmployee.avatarUrl,
      text,
      timestamp: timeStr,
      attachmentType,
    };

    setGroupMessages((prev) => [...prev, newMsg]);
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return safeGetJSON(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  });

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  const addNotification = (item: Omit<NotificationItem, 'id' | 'employeeId' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      employeeId: currentEmployee.id,
      timestamp: 'Just now',
      read: false,
      ...item,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const signOut = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
  };

  const resetWorkspaceData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => safeRemoveItem(k));
    } catch {
      // ignore
    }
    setAttendance(INITIAL_ATTENDANCE);
    setRegularTasks(INITIAL_REGULAR_TASKS);
    setAssignedTasks(INITIAL_ASSIGNED_TASKS);
    setActivities(INITIAL_ACTIVITIES);
    setVouchers(INITIAL_VOUCHERS);
    setVaultItems(INITIAL_VAULT_ITEMS);
    setGalleryPhotos(INITIAL_GALLERY_PHOTOS);
    setGroupMessages(INITIAL_GROUP_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsAuthenticated(false);
    setHasEnteredWorkspace(false);
    setEmployeeId('emp-arjun');
    setActiveTab('home');
  };

  return (
    <PortalContext.Provider
      value={{
        currentEmployee,
        allEmployees: INITIAL_EMPLOYEES,
        switchEmployee,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        selectedTaskId,
        setSelectedTaskId,
        selectedActivityId,
        setSelectedActivityId,
        selectedVoucherId,
        setSelectedVoucherId,
        searchQuery,
        setSearchQuery,
        attendance,
        todayAttendance: todayRecord,
        handleCheckIn,
        handleCheckOut,
        regularTasks,
        todayRegularTasks,
        regularTasksCompletedToday,
        regularTasksTotalToday,
        canCheckOut,
        startRegularTask,
        completeRegularTask,
        assignedTasks,
        updateTaskSubmissions,
        saveTaskDraft,
        submitAssignedTask,
        activities,
        submitActivityEvidence,
        vouchers,
        createVoucher,
        vaultItems,
        createVaultFolder,
        uploadVaultFile,
        deleteVaultItem,
        galleryPhotos,
        uploadGalleryPhoto,
        deleteGalleryPhoto,
        groupMessages,
        sendGroupMessage,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isAuthenticated,
        setIsAuthenticated,
        hasEnteredWorkspace,
        setHasEnteredWorkspace,
        signOut,
        resetWorkspaceData,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
