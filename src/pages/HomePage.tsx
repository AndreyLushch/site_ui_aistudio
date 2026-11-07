import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteGame, TokenPackage } from '../types';
import { useApp } from '../context/AppContext';
import { GameCard } from '../components/GameCard';
import { TokenPackageCard } from '../components/TokenPackageCard';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
import { CharactersShowcase } from '../components/CharactersShowcase';
import { texts, TELEGRAM_BOT_USERNAME } from '../texts';
import {
  Users,
  QrCode,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Sparkles,
  HelpCircle,
  Calculator,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { adapter, openQrModal } = useApp();
  const [games, setGames] = useState<SiteGame[]>([]);
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [calcPlayers, setCalcPlayers] = useState(6);
  const [calcHours, setCalcHours] = useState(2);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [g, p] = await Promise.all([adapter.getGames(), adapter.getPackages()]);
        if (mounted) {
          setGames(g);
          setPackages(p);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const unsub = adapter.subscribe(load);
    return () => {
      mounted = false;
      unsub();
    };
  }, [adapter]);

  // Featured 3 games for hero showcase
  const featuredGames = games.slice(0, 3);

  // Token calculator estimate
  const estParties = Math.max(1, Math.round((calcHours * 60) / 45));
  const tokensPerParty = calcPlayers <= 5 ? 5 : calcPlayers <= 12 ? 10 : 15;
  const recommendedTokens = estParties * tokensPerParty;

  const toggleFaq = (idx: number) => {
    setFaqOpenIndex(faqOpenIndex === idx ? null : idx);
  };

  return (
    <div data-testid="site-page-home" className="space-y-16 md:space-y-24 pb-16">
      {/* 1. Colorful Hero Section with Official Illustration */}
      <section className="relative pt-6 sm:pt-10 overflow-hidden">
        {/* Soft background ambient glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-orange-500/15 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-600/30 text-amber-900 dark:text-amber-300 text-sm font-bold shadow-xs">
                <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{texts.brand.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-[var(--color-text)] tracking-tight leading-[1.15] text-balance">
                {texts.brand.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[var(--color-secondary-text)] max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
                {texts.brand.heroDescription}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (games[0]) openQrModal(games[0]);
                  }}
                  data-testid="site-play-telegram"
                  className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-extrabold text-base transition-transform hover:scale-102 min-h-[48px] shadow-lg cursor-pointer"
                >
                  <span>{texts.actions.playInTelegram}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <Link
                  to="/tokens"
                  className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-line)] hover:border-amber-500 text-[var(--color-text)] font-bold text-base transition-colors min-h-[48px] shadow-xs"
                >
                  <TokenCoinIcon className="w-5 h-5 text-amber-600" />
                  <span>{texts.actions.buyTokens}</span>
                </Link>
              </div>

              {/* Trust bullets */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-medium text-[var(--color-secondary-text)]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {texts.brand.heroTrustNoInstall}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {texts.brand.heroTrustPayment}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  {texts.brand.heroTrustFreeStart}
                </span>
              </div>
            </div>

            {/* Right Column: Colorful Game Artwork Banner */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-md w-full">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-amber-600/30 shadow-2xl bg-[var(--color-card)]">
                  <img
                    src="/assets/games/hero_welcome.png"
                    alt="Настолки в Telegram — карточные игры, мимы, гангстеры и фишки"
                    className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500"
                  />
                  <div className="p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent absolute bottom-0 left-0 right-0 flex items-center justify-between text-white text-sm">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {texts.brand.heroPlatformBadge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-600 font-bold text-sm">
                      {texts.brand.heroMiniAppBadge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Characters & Roles Showcase */}
      <CharactersShowcase />

      {/* 3. How It Works (3 Steps) */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text)] mb-3">
            {texts.howItWorks.title}
          </h2>
          <p className="text-sm text-[var(--color-secondary-text)]">
            {texts.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-xl mb-6">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-2 font-serif">
                {texts.howItWorks.step1Title}
              </h3>
              <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                {texts.howItWorks.step1Desc}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-xl mb-6">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-2 font-serif">
                {texts.howItWorks.step2Title}
              </h3>
              <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                {texts.howItWorks.step2Desc}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-xl mb-6">
              3
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-2 font-serif">
                {texts.howItWorks.step3Title}
              </h3>
              <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                {texts.howItWorks.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Atmospheric Game Worlds & Stories Teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-bold border border-amber-500/30">
                {texts.atmosphere.badge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text)] leading-tight">
                {texts.atmosphere.title}
              </h2>
              <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                {texts.atmosphere.desc}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/games/gangs"
                  className="px-5 py-3 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-bold text-sm transition-colors"
                >
                  {texts.atmosphere.viewGangs}
                </Link>
                <Link
                  to="/games/shelter"
                  className="px-5 py-3 rounded-xl bg-[var(--color-warm-card)] hover:bg-[var(--color-soft-bg)] text-[var(--color-text)] font-semibold text-sm border border-[var(--color-line)] transition-colors"
                >
                  {texts.atmosphere.viewShelter}
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden border border-[var(--color-line)] shadow-md">
                <img
                  src="/assets/games/gangs_night_city.png"
                  alt="Ночной город"
                  className="w-full h-44 object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-[var(--color-line)] shadow-md">
                <img
                  src="/assets/games/gangs_newspaper.png"
                  alt="Городская газета"
                  className="w-full h-44 object-cover hover:scale-105 transition duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Games Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text)] mb-2">
              {texts.catalog.popularTitle}
            </h2>
            <p className="text-sm text-[var(--color-secondary-text)]">
              {texts.catalog.popularSubtitle}
            </p>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-400 hover:underline shrink-0"
          >
            <span>{texts.catalog.viewAllCount}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-[var(--color-card)] animate-pulse border border-[var(--color-line)]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Interactive Calculator & Party Split Explanation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-[var(--color-warm-card)] border border-[var(--color-line)] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-sm font-semibold">
                <Calculator className="w-4 h-4" />
                <span>{texts.calculator.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text)]">
                {texts.calculator.title}
              </h2>
              <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                {texts.calculator.desc}
              </p>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-1 text-[var(--color-text)]">
                    <span>{texts.calculator.playersLabel}</span>
                    <span className="font-bold text-amber-800 dark:text-amber-400">{calcPlayers} чел.</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={calcPlayers}
                    onChange={(e) => setCalcPlayers(Number(e.target.value))}
                    className="w-full accent-amber-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold mb-1 text-[var(--color-text)]">
                    <span>{texts.calculator.hoursLabel}</span>
                    <span className="font-bold text-amber-800 dark:text-amber-400">{calcHours} ч.</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={calcHours}
                    onChange={(e) => setCalcHours(Number(e.target.value))}
                    className="w-full accent-amber-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Result card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-line)] text-center shadow-xs">
              <span className="text-sm uppercase tracking-wider text-[var(--color-secondary-text)] font-bold block mb-1">
                {texts.calculator.estimateBadge}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-serif text-amber-800 dark:text-amber-400 mb-1 tabular-nums">
                ~{recommendedTokens} жетонов
              </div>
              <p className="text-sm text-[var(--color-secondary-text)] mb-4">
                {texts.calculator.approxParties} {estParties} {estParties === 1 ? 'партии' : 'партий'} {texts.calculator.forCompanyOf} {calcPlayers} человек
              </p>

              <Link
                to="/tokens"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold text-sm transition-colors min-h-[44px]"
              >
                <span>{texts.actions.chooseTokens}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Token Packages Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text)] mb-3">
            {texts.tokensPage.tokensAndPrices}
          </h2>
          <p className="text-sm text-[var(--color-secondary-text)]">
            {texts.tokensPage.tokensAndPricesSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {packages.map((pkg) => (
            <TokenPackageCard
              key={pkg.id}
              pkg={pkg}
              isSelected={pkg.id === 'standard'}
              onSelect={() => {}}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/tokens"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-bold text-sm transition-colors min-h-[48px] shadow-sm"
          >
            <span>{texts.actions.goToCheckout}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 8. FAQ Block */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-sm font-semibold mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{texts.nav.faq}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text)]">
            Часто задаваемые вопросы
          </h2>
        </div>

        <div className="space-y-3">
          {texts.faq.map((item, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-line)] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-serif font-bold text-base text-[var(--color-text)] flex items-center justify-between gap-4 min-h-[44px] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className={`text-amber-700 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[var(--color-secondary-text)] leading-relaxed border-t border-[var(--color-line)] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
