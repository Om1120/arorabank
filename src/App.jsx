import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { StatementModal } from './components/modals/StatementModal';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Transfers } from './pages/Transfers';
import { Transactions } from './pages/Transactions';
import { Cards } from './pages/Cards';
import { Analytics } from './pages/Analytics';
import { Admin } from './pages/Admin';
import { ReceiptPage } from './pages/ReceiptPage';
import { NotFound } from './pages/NotFound';

function App() {
  const location = useLocation();

  // Determine if current route should display dashboard sidebar
  const isDashboardRoute = [
    '/dashboard',
    '/transfers',
    '/transactions',
    '/cards',
    '/analytics',
    '/admin'
  ].includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--aurora-bg)' }}>
      {/* Top Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Primary Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="d-flex flex-fill">
        {/* Contextual Sidebar for Logged-In Pages */}
        {isDashboardRoute && (
          <div className="d-none d-lg-block">
            <Sidebar />
          </div>
        )}

        <main className="flex-fill" style={{ overflowX: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/receipt/:id" element={<ReceiptPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ReceiptModal />
      <StatementModal />
      <ToastContainer />

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}

export default App;
