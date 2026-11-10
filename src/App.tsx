import React, { useState } from 'react';
import { NavigationPage, Reminder } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RemindersProvider, useReminders } from './context/RemindersContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ReminderModal } from './components/ReminderModal';
import { AlarmBanner } from './components/AlarmBanner';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RemindersPage } from './pages/RemindersPage';
import { CalendarPage } from './pages/CalendarPage';
import { DailyPlannerPage } from './pages/DailyPlannerPage';
import { CompletedPage } from './pages/CompletedPage';
import { NotificationCenterPage } from './pages/NotificationCenterPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { activeAlarm, dismissAlarm } = useReminders();

  // Login page MUST open first when visiting the website unauthenticated
  const [currentPage, setCurrentPage] = useState<NavigationPage>('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>(undefined);

  const navigateTo = (page: NavigationPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateModal = (initialDate?: string) => {
    setEditingReminder(null);
    setModalInitialDate(initialDate);
    setModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setModalInitialDate(undefined);
    setModalOpen(true);
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] animate-spin flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <div className="w-6 h-6 rounded-lg bg-[#080808]" />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#F5D76E] animate-pulse">
            Loading REMEMBER ME...
          </span>
        </div>
      </div>
    );
  }

  // Public / Unauthenticated Views (Default is Login Page!)
  if (!user) {
    switch (currentPage) {
      case 'signup':
        return <SignUpPage onNavigate={navigateTo} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={navigateTo} />;
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
      default:
        return <LoginPage onNavigate={navigateTo} />;
    }
  }

  // Authenticated Views (Default is Dashboard)
  const authenticatedPage =
    currentPage === 'login' ||
    currentPage === 'signup' ||
    currentPage === 'forgot-password'
      ? 'dashboard'
      : currentPage;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={authenticatedPage}
        onNavigate={navigateTo}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreateModal={() => handleOpenCreateModal()}
      />

      {/* Main App Layout */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all">
        {/* Top Header */}
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          currentPage={authenticatedPage}
          onNavigate={navigateTo}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {authenticatedPage === 'landing' && <LandingPage onNavigate={navigateTo} />}

          {authenticatedPage === 'dashboard' && (
            <DashboardPage
              onNavigate={navigateTo}
              onOpenCreateModal={() => handleOpenCreateModal()}
              onEditReminder={handleEditReminder}
            />
          )}

          {authenticatedPage === 'reminders' && (
            <RemindersPage
              onOpenCreateModal={() => handleOpenCreateModal()}
              onEditReminder={handleEditReminder}
            />
          )}

          {authenticatedPage === 'calendar' && (
            <CalendarPage
              onOpenCreateModalWithDate={(d) => handleOpenCreateModal(d)}
              onEditReminder={handleEditReminder}
            />
          )}

          {authenticatedPage === 'daily-planner' && <DailyPlannerPage />}

          {authenticatedPage === 'completed' && <CompletedPage />}

          {authenticatedPage === 'notifications' && <NotificationCenterPage />}

          {authenticatedPage === 'profile' && <ProfilePage />}

          {authenticatedPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Reminder Creation/Edit Modal */}
      <ReminderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        reminderToEdit={editingReminder}
        initialDate={modalInitialDate}
      />

      {/* Floating Luxury Alarm Banner */}
      <AlarmBanner alarm={activeAlarm} onDismiss={dismissAlarm} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RemindersProvider>
          <AppContent />
        </RemindersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
