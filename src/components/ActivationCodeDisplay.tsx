import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Printer, Gift, Mail, ArrowRight } from 'lucide-react';
import { maskEmail } from '../utils/code';
import { TELEGRAM_BOT_USERNAME } from '../texts';

interface ActivationCodeDisplayProps {
  code: string;
  email?: string;
  tokens: number;
  onOpenGiftCard?: () => void;
}

export const ActivationCodeDisplay: React.FC<ActivationCodeDisplayProps> = ({
  code,
  email,
  tokens,
  onOpenGiftCard,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const telegramRedeemUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?startapp=redeem_${code}`;

  return (
    <div
      data-testid="site-activation-code-card"
      className="p-6 md:p-8 rounded-3xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm text-center"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-sm font-semibold">
        <Gift className="w-4 h-4" />
        <span>Код активации на {tokens} жетонов</span>
      </div>

      <div className="my-3">
        <div
          data-testid="site-code-value"
          className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-[#1f1a14] dark:text-[#f5efe6] py-4 px-6 bg-white dark:bg-[#1d1915] rounded-2xl border-2 border-amber-600/30 inline-block shadow-xs select-all"
        >
          {code}
        </div>
      </div>

      {email && (
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] flex items-center justify-center gap-1.5 my-3">
          <Mail className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Код и электронный чек отправлены на {maskEmail(email)}</span>
        </p>
      )}

      {/* Primary and secondary actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 mb-8 no-print">
        <button
          type="button"
          onClick={handleCopy}
          data-testid="site-code-copy"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-medium text-sm transition-colors min-h-[44px] shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Скопировано!' : 'Скопировать'}</span>
        </button>

        <a
          href={telegramRedeemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2AABEE] hover:bg-[#229ed9] text-white font-medium text-sm transition-colors min-h-[44px] shadow-sm"
        >
          <span>Открыть в Telegram и активировать</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {onOpenGiftCard ? (
          <button
            type="button"
            onClick={onOpenGiftCard}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127] bg-white dark:bg-[#1d1915] text-[#1f1a14] dark:text-[#f5efe6] hover:bg-amber-50 dark:hover:bg-[#2a231b] text-sm font-medium transition-colors min-h-[44px]"
          >
            <Gift className="w-4 h-4 text-amber-600" />
            <span>Подарочная открытка</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127] bg-white dark:bg-[#1d1915] text-[#1f1a14] dark:text-[#f5efe6] hover:bg-amber-50 dark:hover:bg-[#2a231b] text-sm font-medium transition-colors min-h-[44px]"
          >
            <Printer className="w-4 h-4 text-[#6b5f50] dark:text-[#b5a998]" />
            <span>Распечатать</span>
          </button>
        )}
      </div>

      {/* 3 Steps instructions */}
      <div className="pt-6 border-t border-[#e9dfcf] dark:border-[#3a3127] text-left">
        <h3 className="text-base font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-3 text-center sm:text-left">
          Как активировать код (3 простых шага):
        </h3>
        <ol className="grid sm:grid-cols-3 gap-4 text-sm text-[#6b5f50] dark:text-[#b5a998]">
          <li className="p-3 bg-white/70 dark:bg-[#1d1915]/70 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127]">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Шаг 1</span>
            Откройте Настолки в Telegram или перейдите на страницу «Активация кода» на этом сайте.
          </li>
          <li className="p-3 bg-white/70 dark:bg-[#1d1915]/70 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127]">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Шаг 2</span>
            Вставьте 16-значный код в поле активации и нажмите кнопку «Активировать».
          </li>
          <li className="p-3 bg-white/70 dark:bg-[#1d1915]/70 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127]">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Шаг 3</span>
            {tokens} жетонов мгновенно начислятся на ваш кошелёк и будут готовы к игре.
          </li>
        </ol>
      </div>
    </div>
  );
};
