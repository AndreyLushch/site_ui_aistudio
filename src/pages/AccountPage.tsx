import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  LogOut,
  History,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { maskEmail } from '../utils/code';
import { TELEGRAM_BOT_USERNAME } from '../texts';

export const AccountPage: React.FC = () => {
  const { user, adapter, openLoginModal } = useApp();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCodes, setVisibleCodes] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchOrders = () => {
      if (user) {
        adapter.listOrders().then((list) => {
          if (mounted) {
            setOrders(list);
            setLoading(false);
          }
        });
      } else {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    const unsub = adapter.subscribe(fetchOrders);
    return () => {
      mounted = false;
      unsub();
    };
  }, [user, adapter]);


  const handleLogout = async () => {
    await adapter.logout();
    navigate('/');
  };

  const toggleCodeVisibility = (orderId: string) => {
    setVisibleCodes((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCopyCode = async (orderId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      // fallback
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div data-testid="site-page-account" className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
          Вход в личный кабинет
        </h1>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
          Личный кабинет доступен после быстрой авторизации через Telegram.
        </p>
        <button
          type="button"
          onClick={openLoginModal}
          data-testid="site-login-telegram"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2AABEE] hover:bg-[#229ed9] text-white font-semibold text-sm transition-colors min-h-[44px] shadow-sm"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
          <span>Войти через Telegram</span>
        </button>
      </div>
    );
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Ожидает оплаты', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' },
    paid: { label: 'Оплачен', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' },
    fulfilled: { label: 'Выполнен', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' },
    failed: { label: 'Отказ банка', color: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300' },
    cancelled: { label: 'Отменён', color: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300' },
    refunded: { label: 'Возврат', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300' },
  };

  return (
    <div data-testid="site-page-account" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.displayName}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-amber-500/20 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <UserIcon className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1f1a14] dark:text-[#f5efe6] leading-tight">
              {user.displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b5f50] dark:text-[#b5a998]">
              {user.username && <span>@{user.username}</span>}
              <span aria-hidden="true">·</span>
              <span>ID: {user.telegramId}</span>
            </div>
          </div>
        </div>

        {/* Balance & Actions */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] text-left">
            <span className="text-[11px] text-[#6b5f50] dark:text-[#b5a998] block">Баланс кошелька:</span>
            <div data-testid="site-user-balance" className="flex items-center gap-1.5 text-xl font-bold text-amber-800 dark:text-amber-400">
              <TokenCoinIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>{user.balanceTokens}</span>
              <span className="text-xs font-normal text-[#6b5f50] dark:text-[#b5a998]">жетонов</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            data-testid="site-account-logout"
            className="p-3 text-[#6b5f50] dark:text-[#b5a998] hover:text-red-600 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            title="Выйти из аккаунта"
            aria-label="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top-up CTA bar */}
      <div className="p-4 rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#6b5f50] dark:text-[#b5a998] text-center sm:text-left">
          Нужны жетоны для новой партии? Пополняйте баланс картой РФ или через СБП.
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/tokens"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors min-h-[44px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Купить жетоны</span>
          </Link>
          <a
            href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2AABEE] hover:bg-[#229ed9] text-white font-semibold text-xs transition-colors min-h-[44px]"
          >
            <span>В Telegram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <h2 className="text-lg font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
              История покупок на сайте
            </h2>
          </div>
          <span className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
            Всего заказов: {orders.length}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] text-sm text-[#6b5f50] animate-pulse">
            Загрузка истории заказов…
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] text-sm text-[#6b5f50] dark:text-[#b5a998]">
            У вас пока нет заказов на сайте. Жетоны, купленные через Telegram Stars, отображаются в боте.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-[#e9dfcf] dark:border-[#3a3127] bg-white dark:bg-[#1d1915]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e9dfcf] dark:border-[#3a3127] bg-[#fdf8ef] dark:bg-[#231d16] text-[#6b5f50] dark:text-[#b5a998]">
                  <th className="py-3 px-4 font-bold">Дата</th>
                  <th className="py-3 px-4 font-bold">Пакет</th>
                  <th className="py-3 px-4 font-bold">Сумма</th>
                  <th className="py-3 px-4 font-bold">Способ</th>
                  <th className="py-3 px-4 font-bold">Статус</th>
                  <th className="py-3 px-4 font-bold text-right">Код / Заказ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9dfcf] dark:divide-[#3a3127]">
                {orders.map((ord) => {
                  const dateStr = new Date(ord.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const statusInfo = statusLabels[ord.status] || {
                    label: ord.status,
                    color: 'bg-stone-100 text-stone-800',
                  };
                  const isCodeVisible = visibleCodes[ord.id];

                  return (
                    <tr key={ord.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3 px-4 text-[#6b5f50] dark:text-[#b5a998] whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1f1a14] dark:text-[#f5efe6] whitespace-nowrap">
                        {ord.tokens} жетонов
                      </td>
                      <td className="py-3 px-4 font-bold tabular-nums text-[#1f1a14] dark:text-[#f5efe6] whitespace-nowrap">
                        {ord.amountRub} ₽
                      </td>
                      <td className="py-3 px-4 text-[#6b5f50] dark:text-[#b5a998] whitespace-nowrap">
                        {ord.delivery === 'wallet' ? 'На кошелёк' : 'Код активации'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {ord.delivery === 'code' && ord.code ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="font-mono font-bold text-xs">
                              {isCodeVisible ? ord.code : '••••-••••-••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleCodeVisibility(ord.id)}
                              className="p-1 text-[#6b5f50] hover:text-[#1f1a14] dark:hover:text-white"
                              title={isCodeVisible ? 'Скрыть код' : 'Показать код'}
                            >
                              {isCodeVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            {isCodeVisible && (
                              <button
                                type="button"
                                onClick={() => handleCopyCode(ord.id, ord.code!)}
                                className="p-1 text-[#6b5f50] hover:text-amber-700"
                                title="Скопировать код"
                              >
                                {copiedId === ord.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={`/order/${ord.id}`}
                            className="text-amber-800 dark:text-amber-400 font-semibold hover:underline"
                          >
                            Детали
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
