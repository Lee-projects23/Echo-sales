import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { LoginPage } from './components/auth/LoginPage';
import { HomePage } from './components/home/HomePage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { AttendancePage } from './components/attendance/AttendancePage';
import { NewTaskPage } from './components/tasks/NewTaskPage';
import { TaskDetailPage } from './components/tasks/TaskDetailPage';
import { NewActivityPage } from './components/activities/NewActivityPage';
import { ActivityDetailPage } from './components/activities/ActivityDetailPage';
import { PersonalVaultPage } from './components/vault/PersonalVaultPage';
import { PhotoGalleryPage } from './components/gallery/PhotoGalleryPage';
import { CompanyGroupPage } from './components/group/CompanyGroupPage';
import { VoucherCreationPage } from './components/vouchers/VoucherCreationPage';
import { VoucherDetailPage } from './components/vouchers/VoucherDetailPage';
import { LanguagePage } from './components/language/LanguagePage';
import { ProfileSettingsPage } from './components/profile/ProfileSettingsPage';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const INTRO_SEEN_KEY = 'echo_intro_seen';
const AUTH_KEY = 'echo_portal_auth';

const introAlreadySeen = () => {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {
    // Restricted storage — the intro simply plays again next session.
  }
};

/** True when this browser has previously completed a sign-in. */
const wasSignedIn = () => {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

class PortalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ECHO Portal encountered an unexpected render issue:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="echo-ambient min-h-screen flex items-center justify-center p-6" style={{ color: 'var(--echo-ink)' }}>
          <div className="echo-card echo-card--pad max-w-md w-full p-8 sm:p-10 text-center space-y-6">
            <div className="echo-icon-tile echo-icon-tile--warning mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="ed-label block">ECHO — Recovery</span>
              <h2 className="ed-h2 mt-2">Portal Recovery</h2>
              <p className="ed-sub mt-3">
                The portal encountered an unexpected display issue. Your saved operational state is intact.
              </p>
            </div>
            <button onClick={this.handleReset} className="ed-btn">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type EntryStage = 'intro' | 'login' | 'app';

const AppContent: React.FC = () => {
  const { hasEnteredWorkspace, isAuthenticated, activeTab, signOut } = usePortal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Entry sequence: ECHO wordmark intro → login page → employee home.
  // The intro plays once per browser session. It then hands off to the
  // workspace for an employee who has previously signed in, or to the login
  // page for a visitor who has never completed a sign-in.
  const [entryStage, setEntryStage] = useState<EntryStage>(() =>
    introAlreadySeen() ? (wasSignedIn() ? 'app' : 'login') : 'intro'
  );

  // Signing out returns to the login page (never the intro again).
  useEffect(() => {
    if (entryStage === 'app' && (!isAuthenticated || !hasEnteredWorkspace)) {
      setEntryStage('login');
    }
  }, [entryStage, isAuthenticated, hasEnteredWorkspace]);

  if (entryStage === 'intro') {
    return (
      <WelcomeScreen
        onEnter={() => {
          markIntroSeen();
          setEntryStage(wasSignedIn() ? 'app' : 'login');
        }}
      />
    );
  }

  if (entryStage === 'login') {
    return (
      <LoginPage
        onEnter={() => {
          markIntroSeen();
          setEntryStage('app');
        }}
      />
    );
  }

  // Active page renderer
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'new-task':
        return <NewTaskPage />;
      case 'task-detail':
        return <TaskDetailPage />;
      case 'new-activity':
        return <NewActivityPage />;
      case 'activity-detail':
        return <ActivityDetailPage />;
      case 'personal-vault':
        return <PersonalVaultPage />;
      case 'photo-gallery':
        return <PhotoGalleryPage />;
      case 'company-group':
        return <CompanyGroupPage />;
      case 'voucher-creation':
        return <VoucherCreationPage />;
      case 'voucher-detail':
        return <VoucherDetailPage />;
      case 'language':
        return <LanguagePage />;
      case 'profile-settings':
        return <ProfileSettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="echo-ambient min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Navigation Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 pb-20">{renderCurrentPage()}</main>

      {/* Footer */}
      <footer className="border-t border-[var(--echo-border)]">
        <div className="mx-auto px-[var(--echo-gutter)] py-7 flex flex-col sm:flex-row items-center justify-between gap-3 ed-meta">
          <span>ECHO Operational Companion · Synchronized with Admin Core</span>
          <span>Secure Connection · 2026</span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <PortalErrorBoundary>
      <PortalProvider>
        <AppContent />
      </PortalProvider>
    </PortalErrorBoundary>
  );
}

export default App;
