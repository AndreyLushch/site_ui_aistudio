import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SiteGame } from '../types';
import { useApp } from '../context/AppContext';
import { getApplicableTiers, getStartingPriceTokens } from '../utils/price';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
import { GameCard } from '../components/GameCard';
import { CHARACTERS_FIXTURE, GameCharacter } from '../fixtures/characters';
import { texts } from '../texts';
import {
  Users,
  Clock,
  ChevronLeft,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  Quote,
  Maximize2,
  X,
  Shield,
  HelpCircle,
} from 'lucide-react';

const SCREENSHOT_METADATA: Record<string, { title: string; subtitle: string; tag: string }> = {
  '/assets/games/gangs_gangster.png': {
    title: 'Роль: Гангстер',
    subtitle: 'Боевик синдиката. Ночью выбирает цель, днём маскируется под тихого горожанина.',
    tag: 'Карта роли',
  },
  '/assets/games/gangs_sheriff.png': {
    title: 'Роль: Шериф',
    subtitle: 'Закон ночного города. Проверяет подозрительных игроков и ведёт дневное следствие.',
    tag: 'Карта роли',
  },
  '/assets/games/gangs_citizen.png': {
    title: 'Роль: Горожанин',
    subtitle: 'Мирные жители города. Побеждают благодаря наблюдательности и сплочённости.',
    tag: 'Карта роли',
  },
  '/assets/games/gangs_boss.png': {
    title: 'Роль: Босс гангстеров',
    subtitle: 'Глава синдиката, невидимый для обычных проверок шерифа. Управляет кланом.',
    tag: 'Карта роли',
  },
  '/assets/games/gangs_newspaper.png': {
    title: 'Газета «Новость: исчез горожанин»',
    subtitle: 'Автоматическая утренняя сводка ночных происшествий без живого ведущего.',
    tag: 'Экран фазы',
  },
  '/assets/games/gangs_night_city.png': {
    title: '«В городе наступает ночь»',
    subtitle: 'Ночная фаза: приглушённый свет, звуковое сопровождение и тайные действия в телефоне.',
    tag: 'Атмосфера',
  },
  '/assets/games/gangs_day.png': {
    title: '«В городе наступает день»',
    subtitle: 'Дневное голосование: город собирается на площади для разоблачения мафии.',
    tag: 'Экран голосования',
  },
  '/assets/games/shelter_bunker_ext.png': {
    title: 'Бункер «Укрытие»',
    subtitle: 'Внешний вид герметичного убежища перед надвигающейся глобальной катастрофой.',
    tag: 'Локация',
  },
  '/assets/games/shelter_table_debate.png': {
    title: 'Совет за круглым столом',
    subtitle: 'Ожесточённые дебаты специалистов: каждый раскрывает факты своего досье.',
    tag: 'Фаза дебатов',
  },
  '/assets/games/shelter_door_entry.png': {
    title: 'Шлюз и вердикт ИИ',
    subtitle: 'Финальный допуск в бункер и моделирование выживания колонии алгоритмом ИИ.',
    tag: 'Финал партии',
  },
};

export const GameDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { adapter, openQrModal } = useApp();
  const navigate = useNavigate();

  const [game, setGame] = useState<SiteGame | null>(null);
  const [allGames, setAllGames] = useState<SiteGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

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
      <div data-testid="site-page-game" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-[var(--color-text)]">
        <div className="h-96 rounded-3xl bg-[var(--color-card)] animate-pulse border border-[var(--color-line)]" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div data-testid="site-page-game" className="max-w-md mx-auto px-4 py-16 text-center text-[var(--color-text)]">
        <h2 className="text-xl font-bold font-serif mb-2">{texts.catalog.gameNotFound}</h2>
        <p className="text-sm text-[var(--color-secondary-text)] mb-6">
          {texts.catalog.noGamesSuggestion}
        </p>
        <Link
          to="/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold text-sm transition-colors min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{texts.actions.backToCatalog}</span>
        </Link>
      </div>
    );
  }

  const applicableTiers = getApplicableTiers(game);
  const startingPrice = getStartingPriceTokens(game);
  const similarGames = allGames.filter((g) => g.slug !== game.slug).slice(0, 3);
  const characters = CHARACTERS_FIXTURE.filter((c) => c.gameSlug === game.slug);

  return (
    <div data-testid="site-page-game" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 text-[var(--color-text)]">
      {/* Back button */}
      <div>
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{texts.actions.allGames}</span>
        </Link>
      </div>

      {/* Main Game Header Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Cover illustration */}
        <div className="md:col-span-5">
          {game.coverUrl ? (
            <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--color-line)] shadow-xl bg-[var(--color-card)] group">
              <img
                src={game.coverUrl}
                alt={`Обложка игры ${game.title}`}
                className="w-full h-auto max-h-[480px] object-cover object-top mx-auto transform group-hover:scale-102 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              {startingPrice === 0 && (
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-sm font-extrabold shadow-md">
                  {texts.catalog.freeForFew}
                </span>
              )}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between text-sm">
                <span className="font-semibold drop-shadow-md">{texts.catalog.officialArt}</span>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxImage({
                      src: game.coverUrl!,
                      title: game.title,
                      subtitle: 'Официальная обложка игры в Telegram Mini App',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-sm flex items-center gap-1 backdrop-blur-xs transition-colors min-h-[44px]"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>{texts.catalog.zoom}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="aspect-4/3 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-stone-900/20 border border-[var(--color-line)] p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
              <span className="text-6xl mb-4 select-none" role="img" aria-label={game.title}>
                🎲
              </span>
              <span className="text-sm font-serif font-bold text-[var(--color-text)] mb-1">
                {game.title}
              </span>
              <span className="text-sm text-[var(--color-secondary-text)] max-w-xs">
                Оригинальная party-игра для живой компании в Telegram
              </span>
              {startingPrice === 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-sm font-bold shadow-xs">
                  Бесплатно для 2–5 игроков
                </span>
              )}
            </div>
          )}
        </div>

        {/* Info & CTA */}
        <div className="md:col-span-7 space-y-5">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-secondary-text)]">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>{game.minPlayers}–{game.maxPlayers} игроков</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>{game.durationMin}–{game.durationMax} мин</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">
              Telegram Mini App
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text)] leading-tight">
            {game.title}
          </h1>

          <p className="text-base text-[var(--color-secondary-text)] leading-relaxed">
            {game.shortDescription}
          </p>

          <div className="p-4 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)] text-sm text-[var(--color-secondary-text)] space-y-1.5">
            <div className="font-bold text-[var(--color-text)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{texts.catalog.howMatchRuns}</span>
            </div>
            <p>
              {texts.catalog.howMatchRunsDesc}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openQrModal(game)}
              data-testid="site-play-telegram"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-bold text-sm transition-transform hover:scale-102 min-h-[48px] shadow-sm cursor-pointer"
            >
              <span>{texts.actions.playInTelegram}</span>
              <Sparkles className="w-4 h-4" />
            </button>

            <Link
              to="/tokens"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-line)] hover:border-amber-500 text-[var(--color-text)] font-semibold text-sm transition-colors min-h-[48px]"
            >
              <TokenCoinIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{texts.actions.topUpTokens}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Characters & Roles Section (When available for this game) */}
      {characters.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Галерея персонажей
              </span>
              <h2 className="text-2xl font-serif font-bold text-[var(--color-text)]">
                Ключевые роли и персонажи
              </h2>
            </div>
            <p className="text-sm text-[var(--color-secondary-text)] sm:text-right">
              Карты и уникальные способности в партии
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {characters.map((char) => (
              <div
                key={char.id}
                className="group rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-600/40 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[var(--color-soft-bg)] cursor-pointer" onClick={() => setLightboxImage({ src: char.image, title: char.name, subtitle: `${char.roleTitle} — ${char.quote}` })}>
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-sm font-bold border backdrop-blur-xs ${char.badgeColor}`}>
                    {char.badge}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif font-bold text-lg leading-tight drop-shadow-md">
                      {char.name}
                    </h3>
                    <p className="text-sm text-amber-200/90 font-medium">
                      {char.roleTitle}
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-sm italic text-[var(--color-secondary-text)] font-serif border-l-2 border-amber-600/40 pl-2">
                    {char.quote}
                  </p>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    {char.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Price Tiers Section (Rule 8) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[var(--color-text)] mb-1">
            Стоимость партии по ступеням игроков
          </h2>
          <p className="text-sm text-[var(--color-secondary-text)]">
            Цена фиксирована за всю компанию за одну полную партию. Оплачивай вскладчину прямо за столом!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {applicableTiers.map((tier) => (
            <div
              key={tier.label}
              className="p-4 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)] flex flex-col justify-between"
            >
              <div>
                <span className="text-sm font-semibold text-[var(--color-secondary-text)] block mb-1">
                  {tier.label}
                </span>
                <div className="flex items-center gap-1.5 text-xl font-black font-serif text-amber-800 dark:text-amber-400 tabular-nums">
                  <TokenCoinIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {tier.priceTokens === 0 ? 'Бесплатно' : `${tier.priceTokens} жетонов`}
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--color-line)] text-sm text-[var(--color-secondary-text)]">
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
      <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-[var(--color-text)] mb-1">
            Правила игры по шагам
          </h2>
          <p className="text-sm text-[var(--color-secondary-text)]">
            Система в Telegram ведёт игру автоматически — ведущему не нужно читать длинные книги правил.
          </p>
        </div>

        <div className="space-y-4">
          {game.rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--color-warm-card)] border border-[var(--color-line)]">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-action)] text-white font-bold text-sm flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <p className="text-sm text-[var(--color-text)] leading-relaxed pt-1">
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Game Interface & Scenes */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold font-serif text-[var(--color-text)] mb-1">
              Экраны и атмосфера игры
            </h2>
            <p className="text-sm text-[var(--color-secondary-text)]">
              Иллюстрации карточек ролей, игровых фаз и событий партии
            </p>
          </div>
          <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            Нажми на карточку для детального просмотра
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {game.screenshots.map((item, idx) => {
            const isImage = item.startsWith('/');
            const meta = isImage ? SCREENSHOT_METADATA[item] : null;

            if (isImage) {
              return (
                <div
                  key={idx}
                  onClick={() =>
                    setLightboxImage({
                      src: item,
                      title: meta?.title || `Сцена ${idx + 1}`,
                      subtitle: meta?.subtitle || '',
                    })
                  }
                  className="group rounded-2xl bg-[var(--color-card)] border border-[var(--color-line)] overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-600/40 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[var(--color-card)]">
                    <img
                      src={item}
                      alt={meta?.title || 'Скриншот игры'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {meta?.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-sm font-bold backdrop-blur-xs">
                        {meta.tag}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/80 dark:bg-black/80 text-[var(--color-text)] shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <h4 className="text-sm font-bold font-serif text-[var(--color-text)] line-clamp-1">
                      {meta?.title || 'Игровой экран'}
                    </h4>
                    <p className="text-sm text-[var(--color-secondary-text)] line-clamp-2">
                      {meta?.subtitle || 'Интерфейс в Telegram Mini App'}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--color-soft-bg)] border border-[var(--color-line)] text-center flex flex-col items-center justify-center min-h-[160px]"
              >
                <ImageIcon className="w-8 h-8 text-amber-700/60 dark:text-amber-400/60 mb-2" />
                <span className="text-sm font-serif text-[var(--color-secondary-text)]">
                  [Скриншот: {item}]
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Similar Games */}
      <section className="space-y-6 pt-6 border-t border-[var(--color-line)]">
        <h2 className="text-2xl font-serif font-bold text-[var(--color-text)]">
          Похожие игры для компании
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarGames.map((simGame) => (
            <GameCard key={simGame.slug} game={simGame} />
          ))}
        </div>
      </section>

      {/* Lightbox Modal for Art Inspection */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[var(--color-card)] rounded-3xl border border-[var(--color-line)] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[var(--color-line)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-[var(--color-text)]">
                  {lightboxImage.title}
                </h3>
                <p className="text-sm text-[var(--color-secondary-text)]">
                  {lightboxImage.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-xl text-[var(--color-secondary-text)] hover:text-[var(--color-text)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black/50 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="p-4 bg-[var(--color-warm-card)] border-t border-[var(--color-line)] flex items-center justify-between">
              <span className="text-sm text-[var(--color-secondary-text)]">
                Настолки в Telegram Mini App
              </span>
              <button
                type="button"
                onClick={() => openQrModal(game)}
                className="px-4 py-2 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-bold text-sm min-h-[44px]"
              >
                Играть сейчас
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

