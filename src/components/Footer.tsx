import React from 'react';
import { Link } from 'react-router-dom';
import { TokenCoinIcon } from './TokenCoinIcon';
import { texts } from '../texts';
import { useApp } from '../context/AppContext';
import { Map } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPageMapOpen } = useApp();

  return (
    <footer className="w-full bg-[#f3ece1] dark:bg-[#1a1612] border-t border-[#e9dfcf] dark:border-[#3a3127] text-sm text-[#6b5f50] dark:text-[#b5a998] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-bold text-[#1f1a14] dark:text-[#f5efe6] font-serif">
              <TokenCoinIcon className="w-6 h-6 text-amber-700 dark:text-amber-500" />
              <span>{texts.brand.name}</span>
            </Link>
            <p className="text-sm max-w-md leading-relaxed">
              {texts.brand.shortDescription}
            </p>
            <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] pt-2">
              {texts.footer.legalNotice}
            </p>
          </div>

          {/* Site navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f1a14] dark:text-[#f5efe6] mb-3">
              Навигация
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/games" className="hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors">
                  Каталог игр
                </Link>
              </li>
              <li>
                <Link to="/tokens" className="hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors">
                  Купить жетоны
                </Link>
              </li>
              <li>
                <Link to="/redeem" className="hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors">
                  Активация кода
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and docs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f1a14] dark:text-[#f5efe6] mb-3">
              Документы
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/offer" className="hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors">
                  Контакты и реквизиты
                </Link>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => setPageMapOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-400 font-semibold hover:underline"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Карта всех страниц (PageMap)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Requisites row */}
        <div className="pt-6 border-t border-[#e9dfcf] dark:border-[#3a3127] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>{texts.footer.requisites}</p>
          <p>{texts.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
