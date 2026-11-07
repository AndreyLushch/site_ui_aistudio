import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TokenCoinIcon } from './TokenCoinIcon';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { texts } from '../texts';

export const Header: React.FC = () => {
  const { user, openLoginModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: texts.nav.games, href: '/games' },
    { label: texts.nav.tokens, href: '/tokens' },
    { label: texts.nav.howItWorks, href: '/#how-it-works' },
    { label: texts.nav.redeem, href: '/redeem' },
  ];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return location.pathname === '/' && location.hash === href.replace('/', '');
    }
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-page-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text)] whitespace-nowrap shrink-0 group focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
        >
          <TokenCoinIcon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700 dark:text-amber-500 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-serif">{texts.brand.name}</span>
        </Link>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--color-secondary-text)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                isActive(link.href)
                  ? 'text-amber-800 dark:text-amber-400 border-amber-700 dark:border-amber-400 font-semibold'
                  : 'border-transparent hover:text-[var(--color-text)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <Link
              to="/account"
              data-testid="site-account-link"
              className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 rounded-full bg-[var(--color-card)] border border-[var(--color-line)] text-sm hover:border-amber-500 transition-colors min-h-[44px] shrink-0"
            >
              <div
                data-testid="site-user-balance"
                className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300"
              >
                <TokenCoinIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="tabular-nums">{user.balanceTokens}</span>
              </div>
              <span className="w-px h-3.5 bg-[var(--color-line)]" />
              <div className="flex items-center gap-1.5 max-w-[130px] truncate">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                {/* Rule 4: On mobile 320-390px, hide name, keep balance and avatar */}
                <span className="hidden sm:inline truncate text-sm font-medium text-[var(--color-text)]">
                  {user.displayName}
                </span>
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              data-testid="site-login-telegram"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-white bg-[var(--color-tg)] hover:bg-[var(--color-tg-hover)] active:opacity-90 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[44px] shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span className="hidden sm:inline">{texts.actions.loginWithTelegram}</span>
              <span className="sm:hidden">{texts.header.loginShort}</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-text)] rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label={texts.header.menu}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[var(--color-page-bg)] border-b border-[var(--color-line)] space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-text)] hover:bg-amber-500/10 transition-colors min-h-[44px]"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-amber-800 dark:text-amber-400 bg-amber-500/10 min-h-[44px]"
            >
              {texts.nav.account} ({user.balanceTokens} {texts.vocabulary.tokens})
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
