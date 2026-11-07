import React from 'react';
import { useLocation } from 'react-router-dom';
import { texts } from '../texts';
import { Shield, FileText, Mail } from 'lucide-react';

export const DocPages: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/offer') {
    const t = texts.docs.offer;
    return (
      <div data-testid="site-page-offer" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
          <FileText className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">{t.badge}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-text)]">
          {t.title}
        </h1>
        <p className="text-sm text-[var(--color-secondary-text)]">
          {t.edition}
        </p>

        <div className="p-6 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] space-y-4 text-sm text-[var(--color-text)] leading-relaxed">
          <h2 className="font-bold text-base font-serif">{t.sec1Title}</h2>
          <p className="text-[var(--color-secondary-text)]">{t.sec1P1}</p>
          <p className="text-[var(--color-secondary-text)]">{t.sec1P2}</p>

          <h2 className="font-bold text-base font-serif pt-2">{t.sec2Title}</h2>
          <p className="text-[var(--color-secondary-text)]">{t.sec2P1}</p>
          <p className="text-[var(--color-secondary-text)]">{t.sec2P2}</p>

          <h2 className="font-bold text-base font-serif pt-2">{t.sec3Title}</h2>
          <p className="text-[var(--color-secondary-text)]">{t.sec3P1}</p>
          <p className="text-[var(--color-secondary-text)]">{t.sec3P2}</p>

          <h2 className="font-bold text-base font-serif pt-2">{t.sec4Title}</h2>
          <p className="text-sm text-[var(--color-secondary-text)] font-mono">
            {texts.footer.requisites}
          </p>
        </div>
      </div>
    );
  }

  if (path === '/privacy') {
    const t = texts.docs.privacy;
    return (
      <div data-testid="site-page-privacy" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">{t.badge}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-text)]">
          {t.title}
        </h1>
        <p className="text-sm text-[var(--color-secondary-text)]">
          {t.edition}
        </p>

        <div className="p-6 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] space-y-4 text-sm text-[var(--color-text)] leading-relaxed">
          <h2 className="font-bold text-base font-serif">{t.sec1Title}</h2>
          <p className="text-[var(--color-secondary-text)]">{t.sec1P1}</p>

          <h2 className="font-bold text-base font-serif pt-2">{t.sec2Title}</h2>
          <p className="text-[var(--color-secondary-text)]">{t.sec2P1}</p>

          <h2 className="font-bold text-base font-serif pt-2">{t.sec3Title}</h2>
          <p className="text-[var(--color-secondary-text)]">{t.sec3P1}</p>
        </div>
      </div>
    );
  }

  // Contacts
  const t = texts.docs.contacts;
  return (
    <div data-testid="site-page-contacts" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
        <Mail className="w-5 h-5" />
        <span className="text-sm font-bold uppercase tracking-wider">{t.badge}</span>
      </div>
      <h1 className="text-3xl font-serif font-bold text-[var(--color-text)]">
        {t.title}
      </h1>
      <p className="text-sm text-[var(--color-secondary-text)]">
        {t.subtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] space-y-3">
          <h2 className="font-bold text-base font-serif text-[var(--color-text)]">
            {t.supportTitle}
          </h2>
          <div className="space-y-2 text-sm text-[var(--color-secondary-text)]">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <a href={`mailto:${t.supportEmail}`} className="text-amber-800 dark:text-amber-400 hover:underline">
                {t.supportEmail}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-sm">{t.supportTime}</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] space-y-3">
          <h2 className="font-bold text-base font-serif text-[var(--color-text)]">
            {t.botTitle}
          </h2>
          <div className="space-y-2 text-sm text-[var(--color-secondary-text)]">
            <p>
              {t.botDesc} <strong>@{texts.brand.name}Bot</strong>
            </p>
            <a
              href={`https://t.me/${texts.brand.name}Bot`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              <span>{t.botAction}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--color-warm-card)] border border-[var(--color-line)] space-y-2 text-sm text-[var(--color-secondary-text)]">
        <h3 className="font-bold text-base text-[var(--color-text)] font-serif mb-2">
          {t.requisitesBadge}
        </h3>
        <p>{t.pIp}</p>
        <p>{t.pOgrnip}</p>
        <p>{t.pInn}</p>
        <p>{t.pAccount}</p>
        <p>{t.pBik}</p>
      </div>
    </div>
  );
};
