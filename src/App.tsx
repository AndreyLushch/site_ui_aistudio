/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DevPanel } from './components/DevPanel';
import { TelegramLoginModal } from './components/TelegramLoginModal';
import { PlayQrModal } from './components/PlayQrModal';
import { PageMapModal } from './components/PageMapModal';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { TokensPage } from './pages/TokensPage';
import { BankMockPage } from './pages/BankMockPage';
import { OrderPage } from './pages/OrderPage';
import { RedeemPage } from './pages/RedeemPage';
import { AccountPage } from './pages/AccountPage';
import { DocPages } from './pages/DocPages';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pathname, hash]);
  return null;
}

function MainLayout() {
  const { previewWidth } = useApp();
  const location = useLocation();
  const isBankMock = location.pathname.startsWith('/pay/mock');

  return (
    <div
      className={`min-h-screen flex flex-col bg-[var(--color-page-bg)] text-[var(--color-text)] transition-colors duration-200 ${
        previewWidth ? 'py-4 bg-stone-900/10 dark:bg-black/50' : ''
      }`}
    >
      <ScrollToTop />

      {/* Device frame wrapper if preview width is set in DevPanel */}
      <div
        style={
          previewWidth
            ? {
                width: `${previewWidth}px`,
                maxWidth: '100%',
                margin: '0 auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(180, 83, 9, 0.3)',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'var(--color-page-bg)',
              }
            : undefined
        }
        className="flex-1 flex flex-col min-h-screen"
      >
        {!isBankMock && <Header />}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<CatalogPage />} />
            <Route path="/games/:slug" element={<GameDetailPage />} />
            <Route path="/tokens" element={<TokensPage />} />
            <Route path="/pay/mock" element={<BankMockPage />} />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/redeem" element={<RedeemPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/offer" element={<DocPages />} />
            <Route path="/privacy" element={<DocPages />} />
            <Route path="/contacts" element={<DocPages />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {!isBankMock && <Footer />}
      </div>

      {/* Global Modals & Testing Tools */}
      <TelegramLoginModal />
      <PlayQrModal />
      <PageMapModal />
      <DevPanel />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
