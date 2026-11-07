import React from 'react';
import { X, Printer, Gift, Sparkles } from 'lucide-react';
import { TokenCoinIcon } from './TokenCoinIcon';
import { TELEGRAM_BOT_USERNAME } from '../texts';

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
      <div className="w-full max-w-lg bg-white dark:bg-[#1d1915] rounded-3xl border border-[#e9dfcf] dark:border-[#3a3127] shadow-2xl p-6 sm:p-8 relative text-[#1f1a14] dark:text-[#f5efe6]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] dark:hover:text-white rounded-lg no-print min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 no-print">
          <h2 id="gift-card-modal-title" className="text-xl font-bold font-serif">
            Подарочная открытка
          </h2>
          <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
            Вы можете распечатать эту открытку или сделать скриншот и отправить другу
          </p>
        </div>

        {/* Printable Gift Card Body */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#fdf8ef] via-[#fffbf5] to-[#f3ece1] border-2 border-amber-600/40 text-[#1f1a14] shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <TokenCoinIcon className="w-8 h-8 text-amber-700" />
              <div>
                <span className="font-serif font-bold text-lg text-amber-950 block leading-tight">
                  Настолки
                </span>
                <span className="text-xs text-amber-800">Игры для компании в Telegram</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                Подарок
              </span>
              <span className="text-2xl font-black font-serif text-amber-900 tabular-nums">
                +{tokens} жетонов
              </span>
            </div>
          </div>

          <div className="my-6 text-center">
            <p className="text-sm text-stone-700 mb-2 font-medium">Твой секретный код активации:</p>
            <div className="font-mono text-xl sm:text-2xl font-extrabold tracking-widest text-amber-950 py-3 px-4 bg-white/90 rounded-xl border border-amber-300 inline-block shadow-xs select-all">
              {code}
            </div>
          </div>

          <div className="pt-4 border-t border-amber-900/10 text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">Как активировать:</p>
            <p>1. Открой бот <strong>@{TELEGRAM_BOT_USERNAME}</strong> в Telegram.</p>
            <p>2. Нажми «Пополнить → Ввести код» или перейди на сайт в раздел «Активация».</p>
            <p>3. Собирай компанию за стол и наслаждайся играми!</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] rounded-xl min-h-[44px]"
          >
            Закрыть
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-colors min-h-[44px] shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Распечатать открытку</span>
          </button>
        </div>
      </div>
    </div>
  );
};
