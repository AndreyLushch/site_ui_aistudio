import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SiteGame } from '../types';
import { useApp } from '../context/AppContext';
import { getApplicableTiers, getStartingPriceTokens } from '../utils/price';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
import { GameCard } from '../components/GameCard';
import {
  Users,
  Clock,
  ChevronLeft,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';

export const GameDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { adapter, openQrModal } = useApp();
  const navigate = useNavigate();

  const [game, setGame] = useState<SiteGame | null>(null);
  const [allGames, setAllGames] = useState<SiteGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const [target, all] = await Promise.all([adapter.getGame(slug), adapter.getGames()]);
        if (mounted) {
          if (!target) {
            setError('Игра не найдена');
          } else {
            setGame(target);
            setAllGames(all);
          }
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Ошибка загрузки игры');
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
  }, [slug, adapter]);

  if (loading) {
    return (
      <div data-testid="site-page-game" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-96 rounded-3xl bg-white dark:bg-[#1d1915] animate-pulse border border-[#e9dfcf] dark:border-[#3a3127]" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div data-testid="site-page-game" className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold font-serif mb-2">Игра не найдена</h2>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] mb-6">
          Возможно, ссылка устарела или игра была перенесена.
        </p>
        <Link
          to="/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-colors min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Вернуться в каталог</span>
        </Link>
      </div>
    );
  }

  const applicableTiers = getApplicableTiers(game);
  const startingPrice = getStartingPriceTokens(game);
  const similarGames = allGames.filter((g) => g.slug !== game.slug).slice(0, 3);

  return (
    <div data-testid="site-page-game" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Каталог всех игр</span>
        </Link>
      </div>

      {/* Main Game Header Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Cover illustration / placeholder */}
        <div className="md:col-span-5">
          <div className="aspect-4/3 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-stone-900/20 border border-[#e9dfcf] dark:border-[#3a3127] p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <span className="text-6xl mb-4 select-none" role="img" aria-label={game.title}>
              🎲
            </span>
            <span className="text-xs font-serif text-[#6b5f50] dark:text-[#b5a998] max-w-xs">
              [Место под официальную обложку: арт игры {game.title}]
            </span>
            {startingPrice === 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                Бесплатно для 2–5 игроков
              </span>
            )}
          </div>
        </div>

        {/* Info & CTA */}
        <div className="md:col-span-7 space-y-5">
          {/* Unboxed metadata */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#6b5f50] dark:text-[#b5a998]">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{game.minPlayers}–{game.maxPlayers} игроков</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{game.durationMin}–{game.durationMax} мин</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6] leading-tight">
            {game.title}
          </h1>

          <p className="text-base text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
            {game.shortDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openQrModal(game)}
              data-testid="site-play-telegram"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm transition-transform hover:scale-102 min-h-[48px] shadow-sm"
            >
              <span>Играть в Telegram</span>
              <Sparkles className="w-4 h-4" />
            </button>

            <Link
              to="/tokens"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-500 text-[#1f1a14] dark:text-[#f5efe6] font-semibold text-sm transition-colors min-h-[48px]"
            >
              <TokenCoinIcon className="w-4 h-4 text-amber-600" />
              <span>Пополнить жетоны</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Price Tiers Section (Rule 8) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#1f1a14] dark:text-[#f5efe6] mb-1">
            Стоимость партии по ступеням игроков
          </h2>
          <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
            Цена фиксирована за всю компанию за одну полную партию. Оплачивайте вскладчину прямо за столом!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {applicableTiers.map((tier) => (
            <div
              key={tier.label}
              className="p-4 rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-[#6b5f50] dark:text-[#b5a998] block mb-1">
                  {tier.label}
                </span>
                <div className="flex items-center gap-1.5 text-xl font-black font-serif text-amber-800 dark:text-amber-400 tabular-nums">
                  <TokenCoinIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {tier.priceTokens === 0 ? 'Бесплатно' : `${tier.priceTokens} жетонов`}
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#e9dfcf]/60 dark:border-[#3a3127]/60 text-xs text-[#6b5f50] dark:text-[#b5a998]">
                {tier.priceTokens === 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">0 ₽ / чел</span>
                ) : (
                  <span>≈ {tier.perPersonApprox} жетон{tier.perPersonApprox === 1 ? '' : 'а'} с человека</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules Step-by-Step */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#1f1a14] dark:text-[#f5efe6] mb-1">
            Правила игры по шагам
          </h2>
          <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
            Система в Telegram ведёт игру автоматически — ведущему не нужно читать длинные книги правил.
          </p>
        </div>

        <div className="space-y-4">
          {game.rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127]">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <p className="text-sm text-[#1f1a14] dark:text-[#f5efe6] leading-relaxed pt-1">
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots (placeholders) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#1f1a14] dark:text-[#f5efe6] mb-1">
            Интерфейс в Telegram Mini App
          </h2>
          <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
            Скриншоты реальных экранов во время партии
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {game.screenshots.map((desc, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#f3ece1] dark:bg-[#2a231b] border border-[#e9dfcf] dark:border-[#3a3127] text-center flex flex-col items-center justify-center min-h-[160px]"
            >
              <ImageIcon className="w-8 h-8 text-amber-700/60 dark:text-amber-400/60 mb-2" />
              <span className="text-xs font-serif text-[#6b5f50] dark:text-[#b5a998]">
                [Скриншот: {desc}]
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Games */}
      <section className="space-y-6 pt-6 border-t border-[#e9dfcf] dark:border-[#3a3127]">
        <h2 className="text-2xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
          Похожие игры для компании
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarGames.map((simGame) => (
            <GameCard key={simGame.slug} game={simGame} />
          ))}
        </div>
      </section>
    </div>
  );
};
