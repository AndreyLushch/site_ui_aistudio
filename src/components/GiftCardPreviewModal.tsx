import React from 'react';
import { X, Printer, Gift, Sparkles } from 'lucide-react';
import { TokenCoinIcon } from './TokenCoinIcon';
import { texts, TELEGRAM_BOT_USERNAME } from '../texts';

interface GiftCardPreviewModalProps {
  code: string;
  tokens: number;
  isOpen: boolean;
  onClose: () => void;
}

export const GiftCardPreviewModal: React.FC<GiftCardPreviewModalProps> = ({
  code,
  tokens,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-card-modal-title"
    >
      <div className="w-full max-w-lg bg-[var(--color-card)] rounded-3xl border border-[var(--color-line)] shadow-2xl p-6 sm:p-8 relative text-[var(--color-text)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-text)] rounded-lg no-print min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 no-print">
          <h2 id="gift-card-modal-title" className="text-xl font-bold font-serif">
            Подарочная открытка
          </h2>
          <p className="text-sm text-[var(--color-secondary-text)]">
            Ты можешь распечатать эту открытку или сделать скриншот и отправить другу
          </p>
        </div>

        {/* Printable Gift Card Body */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-warm-card)] border-2 border-amber-600/40 text-[var(--color-text)] shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <TokenCoinIcon className="w-8 h-8 text-amber-700 dark:text-amber-400" />
              <div>
                <span className="font-serif font-bold text-lg text-amber-950 dark:text-amber-200 block leading-tight">
                  {texts.brand.name}
                </span>
                <span className="text-sm text-amber-800 dark:text-amber-400">{texts.giftCard.subtitle}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {texts.vocabulary.gift}
              </span>
              <span className="text-2xl font-black font-serif text-amber-900 dark:text-amber-300 tabular-nums">
                +{tokens} жетонов
              </span>
            </div>
          </div>

          <div className="my-6 text-center">
            <p className="text-sm text-stone-700 dark:text-stone-300 mb-2 font-medium">{texts.giftCard.secretCodeLabel}</p>
            <div className="font-mono text-xl sm:text-2xl font-extrabold tracking-widest text-amber-950 dark:text-amber-200 py-3 px-4 bg-[var(--color-card)] rounded-xl border border-amber-300 dark:border-amber-700 inline-block shadow-xs select-all">
              {code}
            </div>
          </div>

          <div className="pt-4 border-t border-amber-900/10 text-sm text-stone-600 dark:text-stone-400 space-y-1">
            <p className="font-semibold text-stone-800 dark:text-stone-200">{texts.giftCard.howToActivate}</p>
            <p>{texts.giftCard.step1(TELEGRAM_BOT_USERNAME)}</p>
            <p>{texts.giftCard.step2}</p>
            <p>{texts.giftCard.step3}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-text)] rounded-xl min-h-[44px] cursor-pointer"
          >
            {texts.actions.close}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold text-sm transition-colors min-h-[44px] shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{texts.giftCard.printButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
