import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ExternalLink, QrCode } from 'lucide-react';
import { texts } from '../texts';

export const PlayQrModal: React.FC = () => {
  const { qrModalGame, closeQrModal } = useApp();

  if (!qrModalGame) return null;

  const playUrl = qrModalGame.playUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div
        className="w-full max-w-sm p-6 bg-[var(--color-card)] rounded-3xl border border-[var(--color-line)] shadow-2xl text-center text-[var(--color-text)] relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={closeQrModal}
          className="absolute top-4 right-4 p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-text)] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label={texts.actions.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <QrCode className="w-6 h-6" />
        </div>

        <h2 id="qr-modal-title" className="text-xl font-bold font-serif mb-1">
          {qrModalGame.title}
        </h2>
        <p className="text-sm text-[var(--color-secondary-text)] mb-5">
          {texts.brand.tagline}
        </p>

        {/* Clean crisp SVG QR code matrix */}
        <div className="p-4 mx-auto mb-4 bg-white rounded-2xl border border-[var(--color-line)] shadow-inner w-56 h-56 flex flex-col items-center justify-center text-stone-900">
          <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
            {/* Corner position markers */}
            <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
            <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
            <rect x="13" y="13" width="12" height="12" rx="2" fill="var(--color-primary-action)" />

            <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
            <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
            <rect x="75" y="13" width="12" height="12" rx="2" fill="var(--color-primary-action)" />

            <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
            <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
            <rect x="13" y="75" width="12" height="12" rx="2" fill="var(--color-primary-action)" />

            {/* Simulated QR data modules */}
            <rect x="38" y="8" width="6" height="6" fill="currentColor" />
            <rect x="48" y="14" width="6" height="6" fill="currentColor" />
            <rect x="56" y="8" width="6" height="6" fill="currentColor" />
            <rect x="38" y="22" width="6" height="6" fill="currentColor" />
            <rect x="48" y="26" width="6" height="6" fill="currentColor" />

            <rect x="8" y="38" width="6" height="6" fill="currentColor" />
            <rect x="18" y="44" width="6" height="6" fill="currentColor" />
            <rect x="26" y="38" width="6" height="6" fill="currentColor" />
            <rect x="14" y="52" width="6" height="6" fill="currentColor" />

            <rect x="38" y="38" width="8" height="8" rx="2" fill="var(--color-primary-action)" />
            <rect x="52" y="42" width="6" height="6" fill="currentColor" />
            <rect x="62" y="38" width="6" height="6" fill="currentColor" />
            <rect x="74" y="46" width="6" height="6" fill="currentColor" />
            <rect x="84" y="38" width="6" height="6" fill="currentColor" />

            <rect x="42" y="56" width="6" height="6" fill="currentColor" />
            <rect x="54" y="54" width="8" height="8" fill="currentColor" />
            <rect x="68" y="58" width="6" height="6" fill="currentColor" />
            <rect x="82" y="56" width="6" height="6" fill="currentColor" />

            <rect x="38" y="72" width="6" height="6" fill="currentColor" />
            <rect x="48" y="68" width="6" height="6" fill="currentColor" />
            <rect x="58" y="74" width="6" height="6" fill="currentColor" />
            <rect x="72" y="70" width="8" height="8" fill="currentColor" />
            <rect x="86" y="76" width="6" height="6" fill="currentColor" />
            <rect x="46" y="84" width="8" height="8" fill="currentColor" />
            <rect x="62" y="86" width="6" height="6" fill="currentColor" />
          </svg>
        </div>

        <p className="text-sm font-semibold text-[var(--color-text)] mb-4">
          {texts.qrModal.desc}
        </p>

        <a
          href={playUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-medium text-sm transition-colors min-h-[44px]"
        >
          <span>{texts.qrModal.toTelegramButton}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
