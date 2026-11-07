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
      setEmailError('Введите адрес электронной почты для отправки чека');
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmed)) {
      setEmailError('Проверьте правильность адреса (например, name@example.com)');
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
      setGeneralError(err?.message || 'Не удалось создать заказ. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="site-page-tokens" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 pb-28 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-2">
          {texts.tokensPage.title}
        </h1>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] max-w-2xl">
          {texts.tokensPage.subtitle}
        </p>
      </div>

      <form onSubmit={handlePay} className="space-y-10">
        {/* Step 1: Packages */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-[#1f1a14] dark:text-[#f5efe6]">
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
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#1f1a14] dark:text-[#f5efe6] mb-1">
              {texts.tokensPage.chooseDelivery}
            </h2>
            <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
              Выберите, как вы хотите получить жетоны после оплаты
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wallet Delivery Option */}
            <label
              data-testid="site-delivery-wallet"
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                delivery === 'wallet' && !isGift
                  ? 'bg-[#fdf8ef] dark:bg-[#231d16] border-2 border-amber-600 shadow-xs'
                  : 'border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-400'
              } ${!user || isGift ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span className="font-bold text-sm text-[#1f1a14] dark:text-[#f5efe6]">
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

              <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] leading-relaxed mb-3">
                {user ? (
                  <>
                    Жетоны начислятся на ваш профиль <strong>{user.displayName}</strong> сразу после подтверждения банка.
                  </>
                ) : (
                  <>
                    Требуется авторизация через Telegram.{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openLoginModal();
                      }}
                      className="text-amber-700 dark:text-amber-400 font-semibold underline"
                    >
                      Войти сейчас
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
                  ? 'bg-[#fdf8ef] dark:bg-[#231d16] border-2 border-amber-600 shadow-xs'
                  : 'border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span className="font-bold text-sm text-[#1f1a14] dark:text-[#f5efe6]">
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

              <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
                {texts.tokensPage.deliveryCodeDesc}
              </p>
            </label>
          </div>

          {/* In Gift Checkbox */}
          <div className="pt-2">
            <label
              data-testid="site-gift-checkbox"
              className="inline-flex items-center gap-2.5 text-sm font-medium text-[#1f1a14] dark:text-[#f5efe6] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => handleGiftToggle(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-amber-700 cursor-pointer"
              />
              <span>Покупаю в подарок другу (сгенерировать подарочный код)</span>
            </label>
          </div>
        </section>

        {/* Step 3: Contact & Legal */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#1f1a14] dark:text-[#f5efe6] mb-1">
              3. Электронная почта и согласие
            </h2>
            <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
              {texts.tokensPage.emailNote}
            </p>
          </div>

          <div>
            <label htmlFor="token-email" className="block text-xs font-bold text-[#6b5f50] dark:text-[#b5a998] mb-1.5">
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
                className={`w-full px-4 py-3 rounded-xl bg-[#fdf8ef] dark:bg-[#231d16] border text-sm text-[#1f1a14] dark:text-[#f5efe6] focus:outline-hidden focus:ring-2 focus:ring-amber-500 min-h-[44px] ${
                  emailError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#e9dfcf] dark:border-[#3a3127]'
                }`}
              />
              <Mail className="w-4 h-4 text-[#6b5f50] absolute right-4 top-3.5 pointer-events-none" />
            </div>
            {emailError && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
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
              <span className="text-xs text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
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
            <div className="p-3.5 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}
        </section>

        {/* Step 4: Summary & Pay CTA Box */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e9dfcf] dark:border-[#3a3127]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b5f50] dark:text-[#b5a998] block mb-1">
                {texts.tokensPage.paySummary}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-serif text-[#1f1a14] dark:text-[#f5efe6] tabular-nums">
                  {selectedPackage?.priceRub || 0} ₽
                </span>
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  за {selectedPackage?.tokens || 0} жетонов
                </span>
              </div>
            </div>

            {/* Payment methods badges - Neutral card and SBP symbols, no bank logos */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6b5f50] dark:text-[#b5a998]">
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Карта</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>СБП</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] max-w-md">
              {texts.tokensPage.safePaymentNote}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="site-pay-button"
              className="px-8 py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-base transition-transform hover:scale-102 min-h-[48px] shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Создаём заказ…' : `Оплатить ${selectedPackage?.priceRub || 0} ₽`}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </form>

      {/* Sticky Bottom Bar for Mobile Viewports (< 768px) - Thumb friendly */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 dark:bg-[#1d1915]/95 backdrop-blur-md border-t border-[#e9dfcf] dark:border-[#3a3127] flex items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-[11px] text-[#6b5f50] dark:text-[#b5a998] block">Итого:</span>
          <span className="text-lg font-bold text-[#1f1a14] dark:text-[#f5efe6] tabular-nums">
            {selectedPackage?.priceRub || 0} ₽
          </span>
        </div>
        <button
          type="button"
          onClick={handlePay}
          data-testid="site-pay-button-mobile"
          className="px-6 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-sm min-h-[44px] flex items-center justify-center shadow-sm"
        >
          Оплатить
        </button>
      </div>
    </div>
  );
};
