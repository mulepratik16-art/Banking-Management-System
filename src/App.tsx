import React, { useState } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationToast } from './components/modals/NotificationToast';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { AccountsPage } from './pages/AccountsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DepositPage } from './pages/DepositPage';
import { HelpPage } from './pages/HelpPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { TransactionsPage } from './pages/TransactionsPage';
import { TransferPage } from './pages/TransferPage';
import { WithdrawPage } from './pages/WithdrawPage';

const BankingApp: React.FC = () => {
  const { isLoggedIn, activePage } = useBanking();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Unauthenticated users see either the Landing Page or the Login Portal
  if (!isLoggedIn) {
    if (activePage === 'login') {
      return (
        <>
          <LoginPage />
          <NotificationToast />
        </>
      );
    }
    return (
      <>
        <LandingPage />
        <NotificationToast />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'deposit':
        return <DepositPage />;
      case 'withdraw':
        return <WithdrawPage />;
      case 'transfer':
        return <TransferPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area (Offset for desktop 72 = 18rem / 288px) */}
        <main className="flex-1 w-full lg:pl-72 flex flex-col justify-between">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            {renderActivePage()}
          </div>

          {/* Academic Project Footer */}
          <Footer />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ReceiptModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <BankingApp />
    </BankingProvider>
  );
}
