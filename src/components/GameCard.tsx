import React from 'react';
import { Link } from 'react-router-dom';
import { SiteGame } from '../types';
import { Users, Clock, Sparkles } from 'lucide-react';
import { TokenCoinIcon } from './TokenCoinIcon';
import { getStartingPriceTokens } from '../utils/price';
import { useApp } from '../context/AppContext';
import { texts } from '../texts';

interface GameCardProps {
  game: SiteGame;
}

// Visual art themes and thematic descriptions for cover placeholders
const GAME_THEMES: Record<string, { bg: string; icon: string; promptNote: string }> = {
  guesser: {
    bg: 'from-amber-600/20 via-orange-500/10 to-amber-900/10',
    icon: '🗣️',
    promptNote: 'Весёлая вечеринка: песочные часы, карточки со словами, смех друзей за круглым столом',
  },
  pantomime: {
    bg: 'from-emerald-600/20 via-teal-500/10 to-emerald-900/10',
    icon: '🎭',
    promptNote: 'Театральные маски, мимика, выразительные жесты рук в тёплом свете софитов',
  },
  shelter: {
    bg: 'from-zinc-700/30 via-amber-900/20 to-neutral-900/30',
    icon: '☢️',
    promptNote: 'Тяжёлая герметичная дверь бункера, мониторы с оценками ИИ, досье выживших',
  },
  tractor: {
    bg: 'from-yellow-600/25 via-amber-500/15 to-orange-900/20',
    icon: '🚜',
    promptNote: 'Импровизированная сцена шоу, микрофон, таблички с оценками жюри 1–5 звёзд',
  },
  gangs: {
    bg: 'from-slate-800/30 via-red-950/20 to-stone-900/30',
    icon: '🕵️',
    promptNote: 'Ночной город в стиле нуар, силуэты в шляпах, мерцающий фонарь и полицейский жетон',
  },
  spy: {
    bg: 'from-blue-900/25 via-indigo-950/20 to-slate-900/30',
    icon: '🔍',
    promptNote: 'Загадочный чемоданчик, карта локации, увеличительное стекло, допрос в полумраке',
  },
  associations: {
    bg: 'from-purple-900/20 via-pink-900/15 to-amber-950/20',
    icon: '✨',
    promptNote: 'Сюрреалистичные парящие карты с картинами, луна, ключ от потайной двери',
  },
};

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { openQrModal } = useApp();
  const startPrice = getStartingPriceTokens(game);
  const theme = GAME_THEMES[game.slug] || {
    bg: 'from-amber-500/20 to-stone-800/20',
    icon: '🎲',
    promptNote: 'Игровая карточка с элементами настольной игры',
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQrModal(game);
  };

  return (
    <article
      data-testid={`site-game-${game.slug}`}
      className="group flex flex-col bg-[var(--color-card)] rounded-3xl border border-[var(--color-line)] overflow-hidden hover:border-amber-600/50 hover:shadow-lg transition-all duration-200"
    >
      {/* Visual Cover / Placeholder */}
      <Link to={`/games/${game.slug}`} className="relative block aspect-16/10 overflow-hidden bg-[var(--color-soft-bg)]">
        {game.coverUrl ? (
          <div className="w-full h-full relative">
            <img
              src={game.coverUrl}
              alt={`Обложка игры ${game.title}`}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                game.slug === 'gangs' ? 'object-top' : 'object-center'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
            {startPrice === 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-sm font-bold shadow-xs">
                {texts.catalog.freeBadge}
              </span>
            )}
            <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-sm font-semibold backdrop-blur-xs">
              {texts.catalog.officialArt}
            </span>
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${theme.bg} flex flex-col items-center justify-center p-6 text-center relative`}>
            <span className="text-4xl sm:text-5xl mb-2 select-none transform group-hover:scale-110 transition-transform duration-200" role="img" aria-label={game.title}>
              {theme.icon}
            </span>
            <span className="text-sm font-serif text-[var(--color-secondary-text)] max-w-[220px] line-clamp-2">
              [Иллюстрация: {theme.promptNote}]
            </span>
            {startPrice === 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-sm font-bold shadow-xs">
                {texts.catalog.freeBadge}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-secondary-text)] mb-2">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>{game.minPlayers}–{game.maxPlayers} игроков</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>{game.durationMin}–{game.durationMax} мин</span>
            </span>
          </div>

          <Link to={`/games/${game.slug}`} className="block group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
            <h3 className="text-xl font-bold font-serif text-[var(--color-text)] mb-2 leading-tight">
              {game.title}
            </h3>
          </Link>

          <p className="text-sm text-[var(--color-secondary-text)] line-clamp-2 mb-4 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-4 border-t border-[var(--color-line)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-300">
            <TokenCoinIcon className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>
              {startPrice === 0 ? 'от 0 жетонов' : `от ${startPrice} жетонов`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/games/${game.slug}`}
              className="px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:bg-amber-500/10 rounded-xl transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Подробнее
            </Link>
            <button
              type="button"
              onClick={handlePlayClick}
              data-testid="site-play-telegram"
              className="px-3.5 py-2 text-sm font-bold text-white bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] rounded-xl transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center shadow-xs cursor-pointer"
            >
              В Telegram
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
