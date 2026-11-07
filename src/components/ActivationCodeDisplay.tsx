import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Printer, Gift, Mail, ArrowRight } from 'lucide-react';
import { maskEmail } from '../utils/code';
import { texts, TELEGRAM_BOT_USERNAME } from '../texts';

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
      className="p-6 md:p-8 rounded-3xl bg-[var(--color-warm-card)] border border-[var(--color-line)] shadow-sm text-center"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-sm font-semibold">
        <Gift className="w-4 h-4" />
        <span>{texts.activationCode.title(tokens)}</span>
      </div>

      <div className="my-3">
        <div
          data-testid="site-code-value"
          className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-[var(--color-text)] py-4 px-6 bg-[var(--color-card)] rounded-2xl border-2 border-amber-600/30 inline-block shadow-xs select-all"
        >
          {code}
        </div>
      </div>

      {email && (
        <p className="text-sm text-[var(--color-secondary-text)] flex items-center justify-center gap-1.5 my-3">
          <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{texts.activationCode.emailSent(maskEmail(email))}</span>
        </p>
      )}

      {/* Primary and secondary actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 mb-8 no-print">
        <button
          type="button"
          onClick={handleCopy}
          data-testid="site-code-copy"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-medium text-sm transition-colors min-h-[44px] shadow-sm cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? texts.actions.copied : texts.actions.copy}</span>
        </button>

        <a
          href={telegramRedeemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-tg)] hover:bg-[var(--color-tg-hover)] text-white font-medium text-sm transition-colors min-h-[44px] shadow-sm"
        >
          <span>{texts.activationCode.openTelegramRedeem}</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {onOpenGiftCard ? (
          <button
            type="button"
            onClick={onOpenGiftCard}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-text)] hover:bg-amber-500/10 text-sm font-medium transition-colors min-h-[44px] cursor-pointer"
          >
            <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{texts.activationCode.giftCardButton}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-text)] hover:bg-amber-500/10 text-sm font-medium transition-colors min-h-[44px] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[var(--color-secondary-text)]" />
            <span>{texts.activationCode.printButton}</span>
          </button>
        )}
      </div>

      {/* 3 Steps instructions */}
      <div className="pt-6 border-t border-[var(--color-line)] text-left">
        <h3 className="text-base font-bold text-[var(--color-text)] mb-3 text-center sm:text-left">
          Как активировать код (3 простых шага):
        </h3>
        <ol className="grid sm:grid-cols-3 gap-4 text-sm text-[var(--color-secondary-text)]">
          <li className="p-3 bg-[var(--color-card)] rounded-xl border border-[var(--color-line)]">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Шаг 1</span>
            Открой Настолки в Telegram или перейди на страницу «Активация кода» на этом сайте.
          </li>
          <li className="p-3 bg-[var(--color-card)] rounded-xl border border-[var(--color-line)]">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Шаг 2</span>
            Вставь 16-значный код в поле активации и нажми кнопку «Активировать».
          </li>
          <li className="p-3 bg-[var(--color-card)] rounded-xl border border-[var(--color-line)]">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Шаг 3</span>
            {tokens} жетонов мгновенно начислятся на твой кошелёк и будут готовы к игре.
          </li>
        </ol>
      </div>
    </div>
  );
};
