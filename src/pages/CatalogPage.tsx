import React, { useEffect, useState, useMemo } from 'react';
import { SiteGame } from '../types';
import { useApp } from '../context/AppContext';
import { GameCard } from '../components/GameCard';
import { Users, Clock, Filter, RotateCcw, AlertTriangle } from 'lucide-react';
import { texts } from '../texts';

export const CatalogPage: React.FC = () => {
  const { adapter } = useApp();
  const [games, setGames] = useState<SiteGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [playerFilter, setPlayerFilter] = useState<'all' | '2-4' | '5-8' | '9-15' | '16+'>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adapter.getGames();
      setGames(data);
    } catch (err: any) {
      setError(err?.message || 'Не удалось загрузить каталог игр');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    const unsub = adapter.subscribe(fetchGames);
    return () => unsub();
  }, [adapter]);

  // Available unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => g.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [games]);

  const tagLabels: Record<string, string> = {
    all: 'Все категории',
    party: 'Для вечеринки',
    team: 'Командные',
    words: 'Слова и намёки',
    roles: 'Тайные роли',
    show: 'Игра-шоу',
    ai: 'С оценкой ИИ',
    bluff: 'Блеф и интуиция',
    art: 'Ассоциации',
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      // 1. Player count
      if (playerFilter === '2-4' && (g.minPlayers > 4 || g.maxPlayers < 2)) return false;
      if (playerFilter === '5-8' && (g.minPlayers > 8 || g.maxPlayers < 5)) return false;
      if (playerFilter === '9-15' && (g.minPlayers > 15 || g.maxPlayers < 9)) return false;
      if (playerFilter === '16+' && g.maxPlayers < 16) return false;

      // 2. Duration
      if (durationFilter === 'short' && g.durationMin > 30) return false;
      if (durationFilter === 'medium' && (g.durationMax < 30 || g.durationMin > 60)) return false;
      if (durationFilter === 'long' && g.durationMax < 60) return false;

      // 3. Tag
      if (tagFilter !== 'all' && !g.tags.includes(tagFilter)) return false;

      return true;
    });
  }, [games, playerFilter, durationFilter, tagFilter]);

  const resetFilters = () => {
    setPlayerFilter('all');
    setDurationFilter('all');
    setTagFilter('all');
  };

  const hasActiveFilters = playerFilter !== 'all' || durationFilter !== 'all' || tagFilter !== 'all';

  if (error) {
    return (
      <div data-testid="site-page-games" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-[var(--color-text)]">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[var(--color-card)] border border-red-200 dark:border-red-900/40 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-serif mb-2">Каталог временно недоступен</h2>
          <p className="text-sm text-[var(--color-secondary-text)] mb-6">{error}</p>
          <button
            type="button"
            onClick={fetchGames}
            data-testid="site-retry-catalog"
            className="px-6 py-2.5 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold text-sm transition-colors min-h-[44px]"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="site-page-games" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-[var(--color-text)]">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text)] mb-2">
          Каталог игр
        </h1>
        <p className="text-sm text-[var(--color-secondary-text)]">
          Выбирай игру под состав твоей компании, длительность и настроение вечера.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
            <Filter className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Фильтры подбора</span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{texts.actions.resetAll}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* 1. Players count */}
          <div>
            <label className="text-sm font-bold text-[var(--color-secondary-text)] block mb-1.5">
              {texts.catalog.playersFilterLabel}
            </label>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: texts.catalog.allCount },
                { id: '2-4', label: '2–4' },
                { id: '5-8', label: '5–8' },
                { id: '9-15', label: '9–15' },
                { id: '16+', label: '16+' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPlayerFilter(item.id as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                    playerFilter === item.id
                      ? 'bg-[var(--color-primary-action)] text-white font-bold'
                      : 'bg-[var(--color-soft-bg)] text-[var(--color-text)] hover:bg-amber-100 dark:hover:bg-amber-950/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Duration */}
          <div>
            <label className="text-sm font-bold text-[var(--color-secondary-text)] block mb-1.5">
              {texts.catalog.durationFilterLabel}
            </label>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: texts.catalog.anyDuration },
                { id: 'short', label: texts.catalog.shortDuration },
                { id: 'medium', label: texts.catalog.mediumDuration },
                { id: 'long', label: texts.catalog.longDuration },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDurationFilter(item.id as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                    durationFilter === item.id
                      ? 'bg-[var(--color-primary-action)] text-white font-bold'
                      : 'bg-[var(--color-soft-bg)] text-[var(--color-text)] hover:bg-amber-100 dark:hover:bg-amber-950/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Category / Tag */}
          <div>
            <label className="text-sm font-bold text-[var(--color-secondary-text)] block mb-1.5">
              {texts.catalog.categoryFilterLabel}
            </label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium bg-[var(--color-soft-bg)] text-[var(--color-text)] rounded-lg border-0 focus:ring-2 focus:ring-amber-500 min-h-[44px]"
            >
              <option value="all">{texts.catalog.allCategories}</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tagLabels[tag] || tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of games */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-3xl bg-[var(--color-card)] animate-pulse border border-[var(--color-line)]" />
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)]">
          <p className="text-base font-bold font-serif text-[var(--color-text)] mb-2">
            Игр по выбранным фильтрам не найдено
          </p>
          <p className="text-sm text-[var(--color-secondary-text)] mb-4">
            Попробуй расширить параметры количества игроков или длительности партии.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold text-sm transition-colors min-h-[44px]"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};
