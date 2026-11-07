import React from 'react';
import { Order } from '../types';
import { TokenCoinIcon } from './TokenCoinIcon';
import { ActivationCodeDisplay } from './ActivationCodeDisplay';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { texts, TELEGRAM_BOT_USERNAME } from '../texts';
import { maskEmail } from '../utils/code';

interface OrderStatusCardProps {
  order: Order;
  onOpenGiftCard?: () => void;
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ order, onOpenGiftCard }) => {
  const telegramBotUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}`;

  if (order.status === 'pending') {
    return (
      <div
        data-testid="site-order-status"
        className="p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-sm text-center max-w-lg mx-auto text-[var(--color-text)]"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center animate-pulse">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif mb-2">{texts.orderStatus.waitingBankTitle}</h2>
        <p className="text-sm text-[var(--color-secondary-text)] mb-6">
          Заказ #{order.id}. Мы автоматически проверяем поступление платежа. Обычно это занимает от нескольких секунд до минуты.
        </p>

        <div className="p-4 rounded-xl bg-[var(--color-warm-card)] border border-[var(--color-line)] text-left text-sm space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">{texts.orderStatus.packageLabel}</span>
            <span className="font-semibold">{order.tokens} жетонов</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">{texts.orderStatus.amountLabel}</span>
            <span className="font-semibold">{order.amountRub} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">{texts.orderStatus.emailLabel}</span>
            <span>{maskEmail(order.email)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={`/pay/mock?orderId=${order.id}`}
            data-testid="site-order-return-pay"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-medium text-sm transition-colors min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{texts.orderStatus.returnToPay}</span>
          </a>
          <p className="text-sm text-[var(--color-secondary-text)]">
            Если ты уже завершил оплату в банке, страница обновится автоматически.
          </p>
        </div>
      </div>
    );
  }

  if (order.status === 'paid') {
    return (
      <div
        data-testid="site-order-status"
        className="p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-sm text-center max-w-lg mx-auto text-[var(--color-text)]"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold font-serif mb-2">{texts.orderStatus.processingTitle}</h2>
        <p className="text-sm text-[var(--color-secondary-text)] mb-6">
          Платёж подтверждён банком. Регистрируем транзакцию в системе…
        </p>
        <div className="w-full bg-[var(--color-line)] h-2 rounded-full overflow-hidden">
          <div className="bg-amber-600 h-full w-2/3 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (order.status === 'fulfilled') {
    // If delivery was by code
    if (order.delivery === 'code' && order.code) {
      return (
        <div data-testid="site-order-status" className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--color-success-bg)] border border-emerald-300 dark:border-emerald-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-[var(--color-success-text)] mx-auto mb-2" />
            <h2 className="text-xl font-bold text-[var(--color-success-text)]">
              {texts.orderStatus.codeSuccessTitle}
            </h2>
            <p className="text-sm text-[var(--color-success-text)] mt-1">
              Код активации на {order.tokens} жетонов сгенерирован и готов к использованию.
            </p>
          </div>

          <ActivationCodeDisplay
            code={order.code}
            email={order.email}
            tokens={order.tokens}
            onOpenGiftCard={onOpenGiftCard}
          />
        </div>
      );
    }

    // If delivery was directly to wallet
    return (
      <div
        data-testid="site-order-status"
        className="p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-sm text-center max-w-lg mx-auto text-[var(--color-text)]"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif mb-2">
          +{order.tokens} жетонов на кошельке!
        </h2>
        <p className="text-sm text-[var(--color-secondary-text)] mb-6">
          Жетоны уже зачислены на твой баланс Telegram и готовы к игре за любым столом.
        </p>

        {order.balanceAfter !== null && (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)] text-base font-bold text-amber-800 dark:text-amber-300 mb-6">
            <TokenCoinIcon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
            <span>{texts.orderStatus.newBalanceLabel(order.balanceAfter)}</span>
          </div>
        )}

        <div className="space-y-3">
          <a
            href={telegramBotUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="site-order-open-telegram"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-medium text-sm transition-colors min-h-[44px] shadow-sm"
          >
            <span>{texts.orderStatus.openInTelegram}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-sm text-[var(--color-secondary-text)]">
            Чек отправлен на почту {maskEmail(order.email)}
          </p>
        </div>
      </div>
    );
  }

  if (order.status === 'failed') {
    return (
      <div
        data-testid="site-order-status"
        className="p-8 rounded-3xl bg-[var(--color-card)] border border-red-200 dark:border-red-900/40 shadow-sm text-center max-w-lg mx-auto text-[var(--color-text)]"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif mb-2 text-[var(--color-danger-text)]">
          {texts.orderStatus.failedTitle}
        </h2>
        <p className="text-sm text-[var(--color-secondary-text)] mb-6">
          {order.failureReason === 'bank_declined'
            ? 'Банк отклонил операцию. Средства не списаны. Попробуй другую карту или оплати через СБП.'
            : 'Время ожидания оплаты истекло. Средства с твоего счёта не списаны.'}
        </p>

        <a
          href="/tokens"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-medium text-sm transition-colors min-h-[44px]"
        >
          <span>{texts.orderStatus.retryButton}</span>
        </a>
      </div>
    );
  }

  // Cancelled or other
  return (
    <div
      data-testid="site-order-status"
      className="p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-sm text-center max-w-lg mx-auto text-[var(--color-text)]"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--color-secondary-text)] flex items-center justify-center">
        <XCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold font-serif mb-2">{texts.orderStatus.cancelledTitle}</h2>
      <p className="text-sm text-[var(--color-secondary-text)] mb-6">
        Срок ожидания истёк или заказ был закрыт. Ты можешь оформить новый заказ в любое время.
      </p>
      <a
        href="/tokens"
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-medium text-sm transition-colors min-h-[44px]"
      >
        <span>{texts.orderStatus.toStoreButton}</span>
      </a>
    </div>
  );
};
