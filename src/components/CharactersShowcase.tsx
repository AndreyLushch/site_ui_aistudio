import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHARACTERS_FIXTURE, GameCharacter } from '../fixtures/characters';
import { Sparkles, ArrowRight, Shield, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { texts } from '../texts';

export const CharactersShowcase: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('sheriff');
  const { openQrModal, adapter } = useApp();

  const selectedChar = CHARACTERS_FIXTURE.find((c) => c.id === selectedId) || CHARACTERS_FIXTURE[0];

  const handlePlayCharacterGame = async () => {
    const game = await adapter.getGame(selectedChar.gameSlug);
    if (game) {
      openQrModal(game);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{texts.characters.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text)] mb-3">
          {texts.characters.title}
        </h2>
        <p className="text-sm sm:text-base text-[var(--color-secondary-text)]">
          {texts.characters.subtitle}
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[var(--color-card)] via-[var(--color-warm-card)] to-[var(--color-soft-bg)] border border-[var(--color-line)] shadow-xl">
        {/* Character Tabs Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CHARACTERS_FIXTURE.map((char) => {
            const isSelected = char.id === selectedId;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelectedId(char.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all shrink-0 min-h-[48px] text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-card)] border-amber-600 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-[var(--color-card)]/60 border-[var(--color-line)] hover:border-amber-400'
                }`}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-10 h-10 rounded-xl object-cover object-top border border-amber-600/30"
                />
                <div>
                  <span className={`block text-sm font-bold ${isSelected ? 'text-amber-800 dark:text-amber-300' : 'text-[var(--color-text)]'}`}>
                    {char.name}
                  </span>
                  <span className="text-sm text-[var(--color-secondary-text)]">
                    {char.gameTitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Character Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Card Image Stage */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-[280px] sm:max-w-[320px] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-700/20 transform transition-transform group-hover:scale-102">
              <img
                src={selectedChar.image}
                alt={selectedChar.name}
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-medium">{texts.characters.cardLabel}</span>
              </div>
            </div>
          </div>

          {/* Character Lore and Info */}
          <div className="md:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${charBadgeClass(selectedChar.badge)}`}>
                {selectedChar.badge}
              </span>
              <span className="text-sm text-[var(--color-secondary-text)]">
                Игра «{selectedChar.gameTitle}»
              </span>
            </div>

            <div>
              <h3 className="text-3xl sm:text-4xl font-serif font-black text-[var(--color-text)] mb-1">
                {selectedChar.name}
              </h3>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                {selectedChar.roleTitle}
              </p>
            </div>

            <blockquote className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-600 italic text-sm text-[var(--color-text)] font-serif leading-relaxed">
              {selectedChar.quote}
            </blockquote>

            <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
              {selectedChar.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePlayCharacterGame}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-bold text-sm transition-transform hover:scale-102 min-h-[48px] shadow-sm cursor-pointer"
              >
                <span>{texts.characters.playInGame(selectedChar.gameTitle)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to={`/games/${selectedChar.gameSlug}`}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-line)] hover:border-amber-500 text-[var(--color-text)] font-semibold text-sm transition-colors min-h-[48px]"
              >
                <span>{texts.characters.gameRules}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function charBadgeClass(badge: string) {
  if (badge === 'Гангстеры') return 'bg-red-950/80 text-red-300 border-red-500/40';
  if (badge === 'Колония ИИ') return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
  if (badge === 'Дебаты') return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
  return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
}

