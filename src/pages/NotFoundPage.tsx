import React from 'react';
import { Link } from 'react-router-dom';
import { Dice5, Home } from 'lucide-react';
import { texts } from '../texts';

export const NotFoundPage: React.FC = () => {
  const t = texts.notFound;
  return (
    <div
      data-testid="site-page-404"
      className="max-w-md mx-auto px-4 py-20 text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
        <Dice5 className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
          {t.badge}
        </span>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-text)]">
          {t.title}
        </h1>
        <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
          {t.desc}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/games"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-[var(--color-primary-action-text)] font-semibold text-sm transition-colors min-h-[44px]"
        >
          <Dice5 className="w-4 h-4" />
          <span>{t.toCatalog}</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-text)] font-semibold text-sm hover:bg-amber-500/10 transition-colors min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>{t.toHome}</span>
        </Link>
      </div>
    </div>
  );
};
