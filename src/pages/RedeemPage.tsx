import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCode, normalizeCode } from '../utils/code';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
import {
  Gift,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { TELEGRAM_BOT_USERNAME } from '../texts';

export const RedeemPage: React.FC = () => {
  const { adapter, user, openLoginModal } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { type: 'success'; tokens: number; balanceAfter: number }
    | { type: 'error'; reason: string; message: string }
    | null
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = normalizeCode(raw);
    setInputCode(formatCode(clean));
    if (result) setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    if (!user) {
      setResult({
        type: 'error',
        reason: 'login_required',
        message: 'Для активации кода необходимо войти через Telegram, чтобы мы знали, на какой аккаунт зачислить жетоны.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await adapter.redeemCode(inputCode);
      if (res.ok) {
        setResult({
          type: 'success',
          tokens: res.tokens,
          balanceAfter: res.balanceAfter,
        });
        setInputCode('');
      } else {
        let msg = 'Произошла ошибка при активации';
        if (res.reason === 'not_found') {
          msg = 'Код не найден. Проверь правильность введённых символов.';
        } else if (res.reason === 'already_redeemed') {
          msg = 'Этот код активации уже был использован ранее.';
        } else if (res.reason === 'expired') {
          msg = 'Срок действия данного кода активации истёк.';
        } else if (res.reason === 'rate_limited') {
          msg = 'Слишком много неверных попыток подряд. Пожалуйста, попробуй снова через 10 минут.';
        } else if (res.reason === 'login_required') {
          msg = 'Для активации кода требуется войти через Telegram.';
        }

        setResult({
          type: 'error',
          reason: res.reason,
          message: msg,
        });
      }
    } catch (err: any) {
      setResult({
        type: 'error',
        reason: 'unexpected',
        message: err?.message || 'Не удалось активировать код. Попробуй позже.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="site-page-redeem" className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-8 text-[var(--color-text)]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
          <Gift className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[var(--color-text)]">
          Активация кода
        </h1>
        <p className="text-sm text-[var(--color-secondary-text)]">
          Введи 16-значный подарочный код или промокод для моментального пополнения баланса.
        </p>
      </div>

      {/* Login requirement banner if guest */}
      {!user && (
        <div className="p-4 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)] flex items-center justify-between gap-4">
          <div className="text-sm text-[var(--color-secondary-text)]">
            <strong className="text-[var(--color-text)] block font-semibold">
              Вход через Telegram
            </strong>
            Чтобы зачислить жетоны на кошелёк, сначала выполни быстрый вход.
          </div>
          <button
            type="button"
            onClick={openLoginModal}
            className="px-4 py-2 rounded-xl bg-[var(--color-tg)] hover:bg-[var(--color-tg-hover)] text-white font-semibold text-sm transition-colors shrink-0 min-h-[44px]"
          >
            Войти
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code-input" className="block text-sm font-bold text-[var(--color-secondary-text)] mb-2 uppercase tracking-wider">
              Код активации (16 символов):
            </label>
            <input
              id="code-input"
              type="text"
              autoComplete="off"
              spellCheck="false"
              maxLength={19}
              data-testid="site-redeem-input"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={inputCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3.5 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)] font-mono text-center text-lg sm:text-xl font-bold tracking-widest text-[var(--color-text)] focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-[var(--color-secondary-text)]/50 min-h-[44px]"
            />
            <p className="text-sm text-[var(--color-secondary-text)] mt-1.5 text-center">
              Можно вставлять с дефисами или без, в любом регистре
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !inputCode.trim()}
            data-testid="site-redeem-submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] active:bg-amber-900 text-white font-bold text-sm transition-transform hover:scale-101 min-h-[44px] shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isSubmitting ? 'Проверяем код…' : 'Активировать код'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Responses Display */}
        {result && (
          <div className="pt-2 animate-in fade-in zoom-in-95 duration-150">
            {result.type === 'success' ? (
              <div className="p-5 rounded-2xl bg-[var(--color-success-bg)] border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[var(--color-success-text)] mx-auto" />
                <h3 className="text-lg font-bold text-[var(--color-success-text)] font-serif">
                  +{result.tokens} жетонов успешно начислено!
                </h3>
                <p className="text-sm text-[var(--color-success-text)]">
                  Твой текущий баланс: <strong>{result.balanceAfter} жетонов</strong>
                </p>
                <div className="pt-2">
                  <a
                    href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-success-text)] hover:underline min-h-[44px]"
                  >
                    <span>{texts.actions.openInTelegram}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[var(--color-danger-bg)] border border-red-300 dark:border-red-900 text-center space-y-2 text-sm text-[var(--color-danger-text)]">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                <p className="font-semibold">{result.message}</p>
                {result.reason === 'login_required' && (
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="mt-2 px-4 py-2 rounded-lg bg-[var(--color-tg)] hover:bg-[var(--color-tg-hover)] text-white font-semibold text-sm min-h-[44px] cursor-pointer"
                  >
                    {texts.actions.loginWithTelegram}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helpful hint for testing - ONLY alphabet 23456789ABCDEFGHJKLMNPQRSTUVWXYZ */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-600/20 text-sm text-[var(--color-secondary-text)] space-y-1">
        <p className="font-bold text-amber-900 dark:text-amber-300">{texts.redeemPage.testCodesTitle}</p>
        <p>• <code className="font-mono font-bold select-all">DEM2-PASS-59TK-2726</code> — {texts.redeemPage.testCode1Desc}</p>
        <p>• <code className="font-mono font-bold select-all">TGFT-PLAY-28TK-FREE</code> — {texts.redeemPage.testCode2Desc}</p>
        <p>• <code className="font-mono font-bold select-all">USED-CARD-29TK-PAST</code> — {texts.redeemPage.testCode3Desc}</p>
        <p>• <code className="font-mono font-bold select-all">EXPR-CARD-24TK-PAST</code> — {texts.redeemPage.testCode4Desc}</p>
      </div>
    </div>
  );
};
