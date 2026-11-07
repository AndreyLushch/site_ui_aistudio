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
          msg = 'Код не найден. Проверьте правильность введённых символов.';
        } else if (res.reason === 'already_redeemed') {
          msg = 'Этот код активации уже был использован ранее.';
        } else if (res.reason === 'expired') {
          msg = 'Срок действия данного кода активации истёк.';
        } else if (res.reason === 'rate_limited') {
          msg = 'Слишком много неверных попыток подряд. Пожалуйста, попробуйте снова через 10 минут.';
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
        message: err?.message || 'Не удалось активировать код. Попробуйте позже.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="site-page-redeem" className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
          <Gift className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
          Активация кода
        </h1>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
          Введите 16-значный подарочный код или промокод для моментального пополнения баланса.
        </p>
      </div>

      {/* Login requirement banner if guest */}
      {!user && (
        <div className="p-4 rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] flex items-center justify-between gap-4">
          <div className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
            <strong className="text-[#1f1a14] dark:text-[#f5efe6] block font-semibold">
              Вход через Telegram
            </strong>
            Чтобы зачислить жетоны на кошелёк, сначала выполните быстрый вход.
          </div>
          <button
            type="button"
            onClick={openLoginModal}
            className="px-4 py-2 rounded-xl bg-[#2AABEE] hover:bg-[#229ed9] text-white font-semibold text-xs transition-colors shrink-0 min-h-[44px]"
          >
            Войти
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code-input" className="block text-xs font-bold text-[#6b5f50] dark:text-[#b5a998] mb-2 uppercase tracking-wider">
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
              className="w-full px-4 py-3.5 rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] font-mono text-center text-lg sm:text-xl font-bold tracking-widest text-[#1f1a14] dark:text-[#f5efe6] focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-[#6b5f50]/50"
            />
            <p className="text-[11px] text-[#6b5f50] dark:text-[#b5a998] mt-1.5 text-center">
              Можно вставлять с дефисами или без, в любом регистре
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !inputCode.trim()}
            data-testid="site-redeem-submit"
            className="w-full py-3.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-sm transition-transform hover:scale-101 min-h-[44px] shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isSubmitting ? 'Проверяем код…' : 'Активировать код'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Responses Display */}
        {result && (
          <div className="pt-2 animate-in fade-in zoom-in-95 duration-150">
            {result.type === 'success' ? (
              <div className="p-5 rounded-2xl bg-[#e7f6ec] dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200 font-serif">
                  +{result.tokens} жетонов успешно начислено!
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Ваш текущий баланс: <strong>{result.balanceAfter} жетонов</strong>
                </p>
                <div className="pt-2">
                  <a
                    href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline"
                  >
                    <span>Открыть Настолки в Telegram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-center space-y-2 text-xs text-red-900 dark:text-red-200">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                <p className="font-semibold">{result.message}</p>
                {result.reason === 'login_required' && (
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-[#2AABEE] text-white font-semibold text-xs"
                  >
                    Войти через Telegram
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helpful hint for testing */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-600/20 text-xs text-[#6b5f50] dark:text-[#b5a998] space-y-1">
        <p className="font-bold text-amber-900 dark:text-amber-300">Тестовые коды для проверки:</p>
        <p>• <code className="font-mono font-bold select-all">DEMO-PASS-50TK-2026</code> — рабочий код на 50 жетонов</p>
        <p>• <code className="font-mono font-bold select-all">TEST-GIFT-20TK-FREE</code> — рабочий код на 20 жетонов</p>
        <p>• <code className="font-mono font-bold select-all">USED-CODE-10TK-PAST</code> — уже активированный код</p>
        <p>• <code className="font-mono font-bold select-all">OLD1-EXPR-20TK-PAST</code> — код с истёкшим сроком</p>
      </div>
    </div>
  );
};
