import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteGame, TokenPackage } from '../types';
import { useApp } from '../context/AppContext';
import { GameCard } from '../components/GameCard';
import { TokenPackageCard } from '../components/TokenPackageCard';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
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
  // 1 party per 40 min => calcHours * 1.5 games. Price per game ~10-15 tokens for calcPlayers.
  const estParties = Math.max(1, Math.round((calcHours * 60) / 45));
  const tokensPerParty = calcPlayers <= 5 ? 5 : calcPlayers <= 12 ? 10 : 15;
  const recommendedTokens = estParties * tokensPerParty;

  const toggleFaq = (idx: number) => {
    setFaqOpenIndex(faqOpenIndex === idx ? null : idx);
  };

  return (
    <div data-testid="site-page-home" className="space-y-16 md:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 md:pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Живые игры в Telegram Mini App</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6] tracking-tight leading-tight text-balance">
              Настольные игры для тёплой компании
            </h1>

            <p className="text-base sm:text-lg text-[#6b5f50] dark:text-[#b5a998] max-w-2xl mx-auto leading-relaxed text-balance">
              Собирайтесь вместе, открывайте Настолки в общем групповом чате Telegram. У каждого свой телефон — общение вживую!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (games[0]) openQrModal(games[0]);
                }}
                data-testid="site-play-telegram"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-base transition-transform hover:scale-102 min-h-[48px] shadow-md"
              >
                <span>Играть в Telegram</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <Link
                to="/tokens"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-500 text-[#1f1a14] dark:text-[#f5efe6] font-semibold text-base transition-colors min-h-[48px]"
              >
                <TokenCoinIcon className="w-5 h-5 text-amber-600" />
                <span>Купить жетоны</span>
              </Link>
            </div>

            <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] pt-1">
              Без установок · Ссылка или QR-код · Оплата картой и СБП
            </p>
          </div>
        </div>
      </section>

      {/* 2. How It Works (3 Steps) */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-3">
            Как это устроено
          </h2>
          <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
            Три простых шага, чтобы начать весёлый вечер за 30 секунд
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-xl mb-6">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-2 font-serif">
                Откройте в чате Telegram
              </h3>
              <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
                Кто-то один открывает Настолки прямо в групповом чате вашей компании. Чат становится виртуальным игровым столом.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-xl mb-6">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-2 font-serif">
                Войдите по QR-коду
              </h3>
              <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
                Остальные участники наводят камеру смартфона на экран ведущего или переходят по ссылке в чате. Приложения ставить не надо.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-xl mb-6">
              3
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-2 font-serif">
                Играйте вживую
              </h3>
              <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
                Телефон показывает тайные роли, карточки и таймер. Разговаривайте, спорьте и смейтесь глядя друг другу в глаза.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Games Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-2">
              Популярные игры
            </h2>
            <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
              От весёлых викторин до дебатов в бункере под управлением ИИ
            </p>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-400 hover:underline shrink-0"
          >
            <span>Смотреть все 7 игр</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-white dark:bg-[#1d1915] animate-pulse border border-[#e9dfcf] dark:border-[#3a3127]" />
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

      {/* 4. Interactive Calculator & Party Split Explanation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Калькулятор вечера</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
                Сколько жетонов нужно на вечер?
              </h2>
              <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
                Вы платите только за <strong>партию</strong> (игру от старта до финала). Партию можно оплатить вскладчину прямо за столом: каждый вносит сколько хочет.
              </p>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-[#1f1a14] dark:text-[#f5efe6]">
                    <span>Сколько вас человек:</span>
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
                  <div className="flex justify-between text-xs font-semibold mb-1 text-[#1f1a14] dark:text-[#f5efe6]">
                    <span>Сколько часов планируете играть:</span>
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
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] text-center shadow-xs">
              <span className="text-xs uppercase tracking-wider text-[#6b5f50] dark:text-[#b5a998] font-bold block mb-1">
                Хватит примерно на:
              </span>
              <div className="text-3xl sm:text-4xl font-black font-serif text-amber-800 dark:text-amber-400 mb-1 tabular-nums">
                ~{recommendedTokens} жетонов
              </div>
              <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] mb-4">
                Это около {estParties} {estParties === 1 ? 'партии' : 'партий'} для компании из {calcPlayers} человек
              </p>

              <Link
                to="/tokens"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-colors min-h-[44px]"
              >
                <span>Выбрать пакет жетонов</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Token Packages Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6] mb-3">
            Жетоны и цены
          </h2>
          <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
            Купите жетоны на сайте картой РФ или СБП. Баланс мгновенно синхронизируется с Mini App в Telegram.
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm transition-colors min-h-[48px] shadow-sm"
          >
            <span>Перейти к оформлению покупки</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. FAQ Block (5–7 Questions) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Вопросы и ответы</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
            Часто задаваемые вопросы
          </h2>
        </div>

        <div className="space-y-3">
          {texts.faq.map((item, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-serif font-bold text-base text-[#1f1a14] dark:text-[#f5efe6] flex items-center justify-between gap-4 min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className={`text-amber-700 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#6b5f50] dark:text-[#b5a998] leading-relaxed border-t border-[#e9dfcf]/50 dark:border-[#3a3127]/50 pt-3">
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
