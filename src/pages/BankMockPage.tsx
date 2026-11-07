import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { maskEmail } from '../utils/code';
import { CreditCard, QrCode, Shield, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { texts } from '../texts';

export const BankMockPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const navigate = useNavigate();
  const { adapter } = useApp();

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
    if (!order) return;
    adapter.triggerOrderSuccessSimulation(order.id);
    navigate(`/order/${order.id}`);
  };

  const handleDecline = () => {
    if (!order) return;
    adapter.triggerOrderBankDecline(order.id);
    navigate(`/order/${order.id}`);
  };

  const handleClose = () => {
    if (!order) return;
    adapter.triggerOrderCloseWindow(order.id);
    navigate(`/order/${order.id}`);
  };

  if (loading) {
    return (
      <div data-testid="site-page-bank-mock" className="max-w-md mx-auto px-4 py-16 text-center text-[var(--color-text)]">
        <p className="text-sm text-[var(--color-secondary-text)]">{texts.bankMock.loading}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div data-testid="site-page-bank-mock" className="max-w-md mx-auto px-4 py-16 text-center space-y-4 text-[var(--color-text)]">
        <h2 className="text-xl font-bold font-serif">{texts.bankMock.notFoundTitle}</h2>
        <p className="text-sm text-[var(--color-secondary-text)]">{texts.bankMock.notFoundDesc}</p>
        <button
          onClick={() => navigate('/tokens')}
          className="px-5 py-2.5 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold text-sm min-h-[44px]"
        >
          {texts.orderStatus.toStoreButton}
        </button>
      </div>
    );
  }

  const t = texts.bankMock;

  return (
    <div
      data-testid="site-page-bank-mock"
      className="min-h-screen bg-[var(--color-page-bg)] py-8 px-4 flex flex-col items-center justify-center text-[var(--color-text)] font-sans"
    >
      <div className="w-full max-w-md bg-[var(--color-card)] rounded-3xl shadow-xl border border-[var(--color-line)] overflow-hidden">
        {/* Bank Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm tracking-wide">{t.title}</span>
          </div>
          <span className="text-sm font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            SSL 256-bit
          </span>
        </div>

        {/* Order Info */}
        <div className="p-6 border-b border-[var(--color-line)] space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-[var(--color-secondary-text)] uppercase tracking-wider font-semibold">
              {texts.orderStatus.amountLabel}
            </span>
            <span className="text-2xl font-black tabular-nums text-[var(--color-text)]">
              {order.amountRub} ₽
            </span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-secondary-text)]">
            <span>{t.recipientLabel}</span>
            <span className="font-medium">{t.recipientValue}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-secondary-text)]">
            <span>{t.purposeLabel}</span>
            <span className="font-medium">{t.purposeValue(order.tokens)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-secondary-text)]">
            <span>{t.receiptEmailLabel}</span>
            <span>{maskEmail(order.email)}</span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="p-6 space-y-5">
          <div className="flex gap-2 p-1 bg-[var(--color-soft-bg)] rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px] ${
                selectedMethod === 'card'
                  ? 'bg-[var(--color-card)] shadow-xs text-[var(--color-text)]'
                  : 'text-[var(--color-secondary-text)]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t.tabCard}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('sbp')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px] ${
                selectedMethod === 'sbp'
                  ? 'bg-[var(--color-card)] shadow-xs text-[var(--color-text)]'
                  : 'text-[var(--color-secondary-text)]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{t.tabSbp}</span>
            </button>
          </div>

          {selectedMethod === 'card' ? (
            <div className="p-4 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)] space-y-3 text-sm">
              <div className="text-[var(--color-secondary-text)] font-medium">{t.testCardHint}</div>
              <div className="p-2.5 bg-[var(--color-card)] rounded-lg border border-[var(--color-line)] font-mono tracking-wider">
                •••• •••• •••• 4242
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                <div className="p-2 bg-[var(--color-card)] rounded-lg border border-[var(--color-line)]">
                  12/28
                </div>
                <div className="p-2 bg-[var(--color-card)] rounded-lg border border-[var(--color-line)]">
                  CVC •••
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)] text-center space-y-2">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-[var(--color-line)] flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-sm text-[var(--color-secondary-text)]">
                Отсканируй QR-код в приложении любого банка РФ для мгновенной оплаты через СБП
              </p>
            </div>
          )}

          {/* Test Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={handleSuccess}
              data-testid="site-bank-pay-success"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.successButton}</span>
            </button>

            <button
              type="button"
              onClick={handleDecline}
              data-testid="site-bank-pay-decline"
              className="w-full py-3 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>{t.declineButton}</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              data-testid="site-bank-close-window"
              className="w-full py-2.5 px-4 rounded-xl text-[var(--color-secondary-text)] hover:text-[var(--color-text)] text-sm font-medium transition-colors flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.closeWindowButton}</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[var(--color-soft-bg)] border-t border-[var(--color-line)] text-sm text-center text-[var(--color-secondary-text)]">
          Имитационный платёжный шлюз для интерактивного тестирования сценариев оплаты
        </div>
      </div>
    </div>
  );
};
