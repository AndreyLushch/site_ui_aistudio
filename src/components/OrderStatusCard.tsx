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
import { TELEGRAM_BOT_USERNAME } from '../texts';
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
        className="p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center animate-pulse">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif mb-2">Ждём подтверждение от банка…</h2>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] mb-6">
          Заказ #{order.id}. Мы автоматически проверяем поступление платежа. Обычно это занимает от нескольких секунд до минуты.
        </p>

        <div className="p-4 rounded-xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] text-left text-sm space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-[#6b5f50] dark:text-[#b5a998]">Пакет жетонов:</span>
            <span className="font-semibold">{order.tokens} жетонов</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b5f50] dark:text-[#b5a998]">Сумма к оплате:</span>
            <span className="font-semibold">{order.amountRub} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b5f50] dark:text-[#b5a998]">Электронная почта:</span>
            <span>{maskEmail(order.email)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={`/pay/mock?orderId=${order.id}`}
            data-testid="site-order-return-pay"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-colors min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Вернуться к оплате</span>
          </a>
          <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
            Если вы уже завершили оплату в банке, страница обновится автоматически.
          </p>
        </div>
      </div>
    );
  }

  if (order.status === 'paid') {
    return (
      <div
        data-testid="site-order-status"
        className="p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold font-serif mb-2">Оплата прошла, начисляем жетоны…</h2>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] mb-6">
          Платёж подтверждён банком. Регистрируем транзакцию в системе…
        </p>
        <div className="w-full bg-[#e9dfcf] dark:bg-[#3a3127] h-2 rounded-full overflow-hidden">
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
          <div className="p-6 rounded-2xl bg-[#e7f6ec] dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">
              Оплата успешно завершена!
            </h2>
            <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
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
        className="p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif mb-2">
          +{order.tokens} жетонов на кошельке!
        </h2>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] mb-6">
          Жетоны уже зачислены на ваш баланс Telegram и готовы к игре за любым столом.
        </p>

        {order.balanceAfter !== null && (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] text-base font-bold text-amber-800 dark:text-amber-300 mb-6">
            <TokenCoinIcon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
            <span>Новый баланс: {order.balanceAfter} жетонов</span>
          </div>
        )}

        <div className="space-y-3">
          <a
            href={telegramBotUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="site-order-open-telegram"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-colors min-h-[44px] shadow-sm"
          >
            <span>Открыть Настолки в Telegram</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
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
        className="p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-red-200 dark:border-red-900/40 shadow-sm text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif mb-2 text-red-900 dark:text-red-200">
          Оплата не удалась
        </h2>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] mb-6">
          {order.failureReason === 'bank_declined'
            ? 'Банк отклонил операцию. Средства не списаны. Попробуйте другую карту или оплатите через СБП.'
            : 'Время ожидания оплаты истекло. Средства с вашего счёта не списаны.'}
        </p>

        <a
          href="/tokens"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-colors min-h-[44px]"
        >
          <span>Попробовать снова</span>
        </a>
      </div>
    );
  }

  // Cancelled or other
  return (
    <div
      data-testid="site-order-status"
      className="p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm text-center max-w-lg mx-auto"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[#6b5f50] dark:text-[#b5a998] flex items-center justify-center">
        <XCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold font-serif mb-2">Заказ отменён</h2>
      <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] mb-6">
        Срок ожидания истёк или заказ был закрыт. Вы можете оформить новый заказ в любое время.
      </p>
      <a
        href="/tokens"
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-colors min-h-[44px]"
      >
        <span>В магазин жетонов</span>
      </a>
    </div>
  );
};
