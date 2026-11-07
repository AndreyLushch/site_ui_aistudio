import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TokenCoinIcon } from './TokenCoinIcon';
import { Menu, X, User as UserIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, openLoginModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Каталог игр', href: '/games' },
    { label: 'Купить жетоны', href: '/tokens' },
    { label: 'Как играть', href: '/#how-it-works' },
    { label: 'Активация кода', href: '/redeem' },
  ];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return location.pathname === '/' && location.hash === href.replace('/', '');
    }
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f6f2ec]/90 dark:bg-[#13110e]/90 backdrop-blur-md border-b border-[#e9dfcf] dark:border-[#3a3127]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#1f1a14] dark:text-[#f5efe6] whitespace-nowrap shrink-0 group focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
        >
          <TokenCoinIcon className="w-7 h-7 text-amber-700 dark:text-amber-500 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-serif">Настолки</span>
        </Link>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6b5f50] dark:text-[#b5a998]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                isActive(link.href)
                  ? 'text-amber-800 dark:text-amber-400 border-amber-700 dark:border-amber-400 font-semibold'
                  : 'border-transparent hover:text-[#1f1a14] dark:hover:text-[#f5efe6]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              to="/account"
              data-testid="site-account-link"
              className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-full bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] text-sm hover:border-amber-500 transition-colors min-h-[44px]"
            >
              <div
                data-testid="site-user-balance"
                className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300"
              >
                <TokenCoinIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{user.balanceTokens}</span>
              </div>
              <span className="w-1 h-3 bg-[#e9dfcf] dark:bg-[#3a3127]" />
              <div className="flex items-center gap-2 max-w-[130px] truncate">
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
                <span className="truncate text-xs font-medium text-[#1f1a14] dark:text-[#f5efe6]">
                  {user.displayName}
                </span>
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              data-testid="site-login-telegram"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#2AABEE] hover:bg-[#229ed9] active:bg-[#1d8bc0] rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[44px] shadow-xs"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span>Войти через Telegram</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] dark:hover:text-[#f5efe6] rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#f6f2ec] dark:bg-[#13110e] border-b border-[#e9dfcf] dark:border-[#3a3127] space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-medium text-[#1f1a14] dark:text-[#f5efe6] hover:bg-amber-500/10 transition-colors min-h-[44px]"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-medium text-amber-800 dark:text-amber-400 bg-amber-500/10 min-h-[44px]"
            >
              Личный кабинет ({user.balanceTokens} жетонов)
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
