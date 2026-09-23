import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
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
        <div className="min-h-screen bg-[#0a0a09] text-neutral-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-white/10 p-10 text-center space-y-6">
            <div className="text-neutral-400 flex items-center justify-center">
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

const AppContent: React.FC = () => {
  const { hasEnteredWorkspace, isAuthenticated, activeTab } = usePortal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If user hasn't completed welcome flow or isn't logged in, show WelcomeScreen
  if (!hasEnteredWorkspace || !isAuthenticated) {
    return <WelcomeScreen onEnter={() => {}} />;
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
    <div className="min-h-screen bg-[#f7f5f0] dark:bg-[#0a0a09] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
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
      <main className="flex-1 pb-16">
        {renderCurrentPage()}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-neutral-900/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 ed-mono">
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
