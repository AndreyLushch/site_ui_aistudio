import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { CreditCard, QrCode, Shield, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { maskEmail } from '../utils/code';

export const BankMockPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { adapter } = useApp();

  const orderId = searchParams.get('orderId') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'sbp'>('card');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    adapter.getOrder(orderId).then((ord) => {
      setOrder(ord);
      setLoading(false);
    });
  }, [orderId, adapter]);

  const handleSuccess = () => {
    if (!orderId) return;
    adapter.triggerOrderSuccessSimulation(orderId);
    navigate(`/order/${orderId}`);
  };

  const handleDecline = () => {
    if (!orderId) return;
    adapter.triggerOrderBankDecline(orderId);
    navigate(`/order/${orderId}`);
  };

  const handleClose = () => {
    if (!orderId) return;
    adapter.triggerOrderCloseWindow(orderId);
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div data-testid="site-page-bank-mock" className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-sm text-[#6b5f50]">Загрузка платёжного шлюза…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div data-testid="site-page-bank-mock" className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif">Заказ не найден</h2>
        <p className="text-sm text-[#6b5f50]">Проверьте ссылку или создайте заказ заново.</p>
        <button
          onClick={() => navigate('/tokens')}
          className="px-5 py-2.5 rounded-xl bg-amber-700 text-white font-semibold text-sm"
        >
          В магазин жетонов
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="site-page-bank-mock"
      className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 flex flex-col items-center justify-center text-slate-900 dark:text-slate-100 font-sans"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Bank Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm tracking-wide">Платёжная форма банка</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Безопасное соединение
          </span>
        </div>

        {/* Order Info */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Сумма к оплате:
            </span>
            <span className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">
              {order.amountRub} ₽
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Получатель:</span>
            <span className="font-medium">Сервис «Настолки» (ИП Лущиков А. В.)</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Назначение:</span>
            <span className="font-medium">{order.tokens} жетонов (Заказ #{order.id})</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Чек на почту:</span>
            <span>{maskEmail(order.email)}</span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="p-6 space-y-5">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                selectedMethod === 'card'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Банковская карта</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('sbp')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                selectedMethod === 'sbp'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Оплата через СБП</span>
            </button>
          </div>

          {selectedMethod === 'card' ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="text-slate-500 font-medium">Тестовые данные карты (заглушка):</div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono tracking-wider">
                •••• •••• •••• 4242
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  12/28
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  CVC •••
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-xs text-slate-500">
                Отсканируйте QR-код в приложении любого банка РФ для мгновенной оплаты через СБП
              </p>
            </div>
          )}

          {/* Test Action Buttons required by Rule 3 */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={handleSuccess}
              data-testid="site-bank-pay-success"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Оплата прошла (Успех)</span>
            </button>

            <button
              type="button"
              onClick={handleDecline}
              data-testid="site-bank-pay-decline"
              className="w-full py-3 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Отказ банка</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              data-testid="site-bank-close-window"
              className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Закрыть окно (вернуться к заказу)</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-center text-slate-500">
          Имитационный платёжный шлюз для интерактивного тестирования сценариев оплаты
        </div>
      </div>
    </div>
  );
};
