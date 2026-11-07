import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TokenPackage, Delivery } from '../types';
import { useApp } from '../context/AppContext';
import { TokenPackageCard } from '../components/TokenPackageCard';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
import { texts } from '../texts';
import {
  Wallet,
  Gift,
  Mail,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const TokensPage: React.FC = () => {
  const { adapter, user, openLoginModal } = useApp();
  const navigate = useNavigate();

  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('standard');
  const [delivery, setDelivery] = useState<Delivery>('wallet');
  const [isGift, setIsGift] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [offerAccepted, setOfferAccepted] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    adapter.getPackages().then((pkgs) => {
      setPackages(pkgs);
      if (pkgs.length > 0 && !selectedPackageId) {
        setSelectedPackageId(pkgs[1]?.id || pkgs[0].id);
      }
    });
  }, [adapter, selectedPackageId]);

  // Adjust delivery default based on user login state
  useEffect(() => {
    if (!user) {
      setDelivery('code');
    }
  }, [user]);

  // When gift checkbox is toggled, force delivery to 'code'
  const handleGiftToggle = (checked: boolean) => {
    setIsGift(checked);
    if (checked) {
      setDelivery('code');
    }
  };

  const selectedPackage = packages.find((p) => p.id === selectedPackageId) || packages[1] || packages[0];

  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setEmailError('Введи адрес электронной почты для отправки чека');
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmed)) {
      setEmailError('Проверь правильность адреса (например, name@example.com)');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) return;

    if (!offerAccepted) {
      setGeneralError('Необходимо подтвердить согласие с условиями оферты');
      return;
    }

    try {
      setIsSubmitting(true);
      const effectiveDelivery = isGift || !user ? 'code' : delivery;

      const { orderId, payUrl } = await adapter.createOrder({
        packageId: selectedPackage.id,
        email: email.trim(),
        delivery: effectiveDelivery,
        offerAccepted: true,
      });

      navigate(payUrl);
    } catch (err: any) {
      setGeneralError(err?.message || 'Не удалось создать заказ. Попробуй позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="site-page-tokens" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 pb-28 md:pb-12 text-[var(--color-text)]">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text)] mb-2">
          {texts.tokensPage.title}
        </h1>
        <p className="text-sm text-[var(--color-secondary-text)] max-w-2xl">
          {texts.tokensPage.subtitle}
        </p>
      </div>

      <form onSubmit={handlePay} className="space-y-10">
        {/* Step 1: Packages */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-[var(--color-text)]">
            {texts.tokensPage.choosePackage}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <TokenPackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={pkg.id === selectedPackageId}
                onSelect={(id) => setSelectedPackageId(id)}
              />
            ))}
          </div>
        </section>

        {/* Step 2: Delivery Method */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-[var(--color-text)] mb-1">
              {texts.tokensPage.chooseDelivery}
            </h2>
            <p className="text-sm text-[var(--color-secondary-text)]">
              Выбирай, как ты хочешь получить жетоны после оплаты
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wallet Delivery Option */}
            <label
              data-testid="site-delivery-wallet"
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                delivery === 'wallet' && !isGift
                  ? 'bg-[var(--color-warm-card)] border-2 border-amber-600 shadow-xs'
                  : 'border-[var(--color-line)] hover:border-amber-400'
              } ${!user || isGift ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span className="font-bold text-sm text-[var(--color-text)]">
                    {texts.tokensPage.deliveryWallet}
                  </span>
                </div>
                <input
                  type="radio"
                  name="delivery"
                  value="wallet"
                  disabled={!user || isGift}
                  checked={delivery === 'wallet' && !isGift}
                  onChange={() => setDelivery('wallet')}
                  className="accent-amber-700 mt-0.5"
                />
              </div>

              <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed mb-3">
                {user ? (
                  <>
                    {texts.tokensPage.walletCreditedNote(user.displayName)}
                  </>
                ) : (
                  <>
                    {texts.tokensPage.loginRequiredForWallet}{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openLoginModal();
                      }}
                      className="text-amber-700 dark:text-amber-400 font-semibold underline cursor-pointer"
                    >
                      {texts.header.loginShort}
                    </button>
                  </>
                )}
              </p>
            </label>

            {/* Code Delivery Option */}
            <label
              data-testid="site-delivery-code"
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                delivery === 'code' || isGift
                  ? 'bg-[var(--color-warm-card)] border-2 border-amber-600 shadow-xs'
                  : 'border-[var(--color-line)] hover:border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span className="font-bold text-sm text-[var(--color-text)]">
                    {texts.tokensPage.deliveryCode}
                  </span>
                </div>
                <input
                  type="radio"
                  name="delivery"
                  value="code"
                  checked={delivery === 'code' || isGift}
                  onChange={() => setDelivery('code')}
                  className="accent-amber-700 mt-0.5"
                />
              </div>

              <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                {texts.tokensPage.deliveryCodeDesc}
              </p>
            </label>
          </div>

          {/* In Gift Checkbox */}
          <div className="pt-2">
            <label
              data-testid="site-gift-checkbox"
              className="inline-flex items-center gap-2.5 text-sm font-medium text-[var(--color-text)] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => handleGiftToggle(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-amber-700 cursor-pointer"
              />
              <span>{texts.tokensPage.deliveryGiftPrompt}</span>
            </label>
          </div>
        </section>

        {/* Step 3: Contact & Legal */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-[var(--color-text)] mb-1">
              3. Электронная почта и согласие
            </h2>
            <p className="text-sm text-[var(--color-secondary-text)]">
              {texts.tokensPage.emailNote}
            </p>
          </div>

          <div>
            <label htmlFor="token-email" className="block text-sm font-bold text-[var(--color-secondary-text)] mb-1.5">
              {texts.tokensPage.emailLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="token-email"
                type="email"
                required
                data-testid="site-tokens-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                placeholder={texts.tokensPage.emailPlaceholder}
                className={`w-full px-4 py-3 rounded-xl bg-[var(--color-warm-card)] border text-sm text-[var(--color-text)] focus:outline-hidden focus:ring-2 focus:ring-amber-500 min-h-[44px] ${
                  emailError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[var(--color-line)]'
                }`}
              />
              <Mail className="w-4 h-4 text-[var(--color-secondary-text)] absolute right-4 top-3.5 pointer-events-none" />
            </div>
            {emailError && (
              <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          {/* Offer acceptance */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                data-testid="site-tokens-offer"
                checked={offerAccepted}
                onChange={(e) => setOfferAccepted(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-amber-700 mt-0.5 shrink-0 cursor-pointer"
              />
              <span className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                Я соглашаюсь с условиями{' '}
                <Link to="/offer" target="_blank" className="text-amber-800 dark:text-amber-400 font-semibold underline">
                  публичной оферты
                </Link>{' '}
                и{' '}
                <Link to="/privacy" target="_blank" className="text-amber-800 dark:text-amber-400 font-semibold underline">
                  политики обработки персональных данных
                </Link>
                . Чек будет направлен на указанную почту.
              </span>
            </label>
          </div>

          {generalError && (
            <div className="p-3.5 rounded-xl bg-[var(--color-danger-bg)] border border-red-300 dark:border-red-900 text-sm text-[var(--color-danger-text)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}
        </section>

        {/* Step 4: Summary & Pay CTA Box */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-warm-card)] border border-[var(--color-line)] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-line)]">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--color-secondary-text)] block mb-1">
                {texts.tokensPage.paySummary}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-serif text-[var(--color-text)] tabular-nums">
                  {selectedPackage?.priceRub || 0} ₽
                </span>
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  за {selectedPackage?.tokens || 0} жетонов
                </span>
              </div>
            </div>

            {/* Payment methods badges - Neutral card and SBP symbols, no bank logos */}
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-secondary-text)]">
              <span className="px-2.5 py-1 rounded-md bg-[var(--color-card)] border border-[var(--color-line)] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                <span>{texts.tokensPage.methodCard}</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--color-card)] border border-[var(--color-line)] flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>{texts.tokensPage.methodSbp}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-secondary-text)] max-w-md">
              {texts.tokensPage.safePaymentNote}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="site-pay-button"
              className="px-8 py-4 rounded-2xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] active:bg-amber-900 text-white font-bold text-base transition-transform hover:scale-102 min-h-[48px] shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Создаём заказ…' : `Оплатить ${selectedPackage?.priceRub || 0} ₽`}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </form>

      {/* Sticky Bottom Bar for Mobile Viewports (< 768px) - Thumb friendly */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[var(--color-card)]/95 backdrop-blur-md border-t border-[var(--color-line)] flex items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-sm text-[var(--color-secondary-text)] block">{texts.tokensPage.totalLabel}</span>
          <span className="text-lg font-bold text-[var(--color-text)] tabular-nums">
            {selectedPackage?.priceRub || 0} ₽
          </span>
        </div>
        <button
          type="button"
          onClick={handlePay}
          data-testid="site-pay-button-mobile"
          className="px-6 py-2.5 rounded-xl bg-[var(--color-primary-action)] text-white font-bold text-sm min-h-[44px] flex items-center justify-center shadow-sm"
        >
          Оплатить
        </button>
      </div>
    </div>
  );
};
