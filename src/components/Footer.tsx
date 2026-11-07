import React from 'react';
import { Link } from 'react-router-dom';
import { TokenCoinIcon } from './TokenCoinIcon';
import { texts } from '../texts';
import { useApp } from '../context/AppContext';
import { Map } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPageMapOpen } = useApp();

  return (
    <footer className="w-full bg-[var(--color-soft-bg)] border-t border-[var(--color-line)] text-sm text-[var(--color-secondary-text)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-bold text-[var(--color-text)] font-serif">
              <TokenCoinIcon className="w-6 h-6 text-amber-700 dark:text-amber-500" />
              <span>{texts.brand.name}</span>
            </Link>
            <p className="text-sm max-w-md leading-relaxed">
              {texts.brand.shortDescription}
            </p>
            <p className="text-sm text-[var(--color-secondary-text)] pt-2 leading-relaxed">
              {texts.footer.legalNotice}
            </p>
          </div>

          {/* Site navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)] mb-3">
              Навигация
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/games" className="hover:text-[var(--color-text)] transition-colors">
                  {texts.nav.games}
                </Link>
              </li>
              <li>
                <Link to="/tokens" className="hover:text-[var(--color-text)] transition-colors">
                  {texts.nav.tokens}
                </Link>
              </li>
              <li>
                <Link to="/redeem" className="hover:text-[var(--color-text)] transition-colors">
                  {texts.nav.redeem}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[var(--color-text)] transition-colors">
                  {texts.nav.account}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and docs */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)] mb-3">
              Документы
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/offer" className="hover:text-[var(--color-text)] transition-colors">
                  {texts.nav.offer}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[var(--color-text)] transition-colors">
                  {texts.nav.privacy}
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-[var(--color-text)] transition-colors">
                  {texts.nav.contacts}
                </Link>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => setPageMapOpen(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-amber-800 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  <Map className="w-4 h-4" />
                  <span>{texts.nav.pageMap}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Requisites row */}
        <div className="pt-6 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>{texts.footer.requisites}</p>
          <p>{texts.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

