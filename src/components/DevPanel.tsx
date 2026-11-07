import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { USER_FIXTURES } from '../fixtures/users';
import { stylePresets, StylePresetId } from '../theme/tokens';
import {
  Wrench,
  X,
  User,
  Sun,
  Moon,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  Map,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DevPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'fixtures' | 'proposals'>('fixtures');
  const [catalogErrorSim, setCatalogErrorSim] = useState(false);

  const {
    adapter,
    user,
    theme,
    setTheme,
    stylePreset,
    setStylePreset,
    setPageMapOpen,
    previewWidth,
    setPreviewWidth,
  } = useApp();

  const navigate = useNavigate();

  const handleUserChange = (key: string) => {
    if (key === 'guest') {
      adapter.setSession(null);
    } else {
      adapter.setSession(USER_FIXTURES[key]);
    }
  };

  const handleCatalogErrorToggle = () => {
    const next = !catalogErrorSim;
    setCatalogErrorSim(next);
    adapter.setSimulateCatalogError(next);
  };

  return (
    <aside aria-label="Панель разработчика" className="no-print">
      {/* Floating Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold text-sm shadow-xl border border-amber-600/30 transition-transform hover:scale-105 min-h-[44px]"
          aria-expanded={isOpen}
          aria-label="Панель тестирования DevPanel"
        >
          <Wrench className="w-4 h-4 text-amber-300" />
          <span>DevPanel</span>
          {user && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Drawer */}
      {isOpen && (
        <div
          role="region"
          aria-label="Настройки панели разработчика"
          className="fixed bottom-16 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[80vh] bg-[var(--color-card)] rounded-3xl border border-[var(--color-line)] shadow-2xl flex flex-col overflow-hidden text-[var(--color-text)] animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between bg-[var(--color-warm-card)]">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h2 className="font-bold text-sm">Панель управления прототипом</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[var(--color-secondary-text)] hover:text-[var(--color-text)] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Свернуть панель"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--color-line)] text-sm font-semibold">
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`flex-1 py-2.5 text-center transition-colors min-h-[44px] ${
                activeTab === 'fixtures'
                  ? 'border-b-2 border-amber-600 text-amber-800 dark:text-amber-400 bg-amber-500/5'
                  : 'text-[var(--color-secondary-text)]'
              }`}
            >
              Фикстуры и тесты
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 min-h-[44px] ${
                activeTab === 'proposals'
                  ? 'border-b-2 border-amber-600 text-amber-800 dark:text-amber-400 bg-amber-500/5'
                  : 'text-[var(--color-secondary-text)]'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Предложения (§9)</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-5 text-sm">
            {activeTab === 'fixtures' ? (
              <>
                {/* User Session Switcher */}
                <div>
                  <label className="font-bold text-[var(--color-secondary-text)] block mb-2 uppercase tracking-wider text-sm">
                    Пользователь (сессия)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleUserChange('guest')}
                      className={`p-2.5 rounded-xl text-left border transition-colors min-h-[44px] ${
                        !user
                          ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)]'
                          : 'border-[var(--color-line)] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block">Гость</span>
                      <span className="text-sm opacity-80">Без входа</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('standard')}
                      className={`p-2.5 rounded-xl text-left border transition-colors min-h-[44px] ${
                        user?.telegramId === USER_FIXTURES.standard.telegramId
                          ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)]'
                          : 'border-[var(--color-line)] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block truncate">Иван Иванов</span>
                      <span className="text-sm opacity-80">Баланс: {user?.telegramId === USER_FIXTURES.standard.telegramId ? user.balanceTokens : 35}</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('zeroBalance')}
                      className={`p-2.5 rounded-xl text-left border transition-colors min-h-[44px] ${
                        user?.telegramId === USER_FIXTURES.zeroBalance.telegramId
                          ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)]'
                          : 'border-[var(--color-line)] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block truncate">Пётр (0 жетонов)</span>
                      <span className="text-sm opacity-80">Нулевой баланс</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('longName')}
                      className={`p-2.5 rounded-xl text-left border transition-colors min-h-[44px] ${
                        user?.telegramId === USER_FIXTURES.longName.telegramId
                          ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)]'
                          : 'border-[var(--color-line)] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block truncate">Александр С.</span>
                      <span className="text-sm opacity-80">120 жетонов</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('noPhoto')}
                      className={`p-2.5 rounded-xl text-left border col-span-2 transition-colors min-h-[44px] ${
                        user?.telegramId === USER_FIXTURES.noPhoto.telegramId
                          ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)]'
                          : 'border-[var(--color-line)] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block">Анна К. (без фото)</span>
                      <span className="text-sm opacity-80">Проверка плейсхолдера аватара</span>
                    </button>
                  </div>
                </div>

                {/* Balance Controls */}
                {user && (
                  <div>
                    <label className="font-bold text-[var(--color-secondary-text)] block mb-2 uppercase tracking-wider text-sm">
                      Баланс жетонов ({user.balanceTokens})
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => adapter.adjustBalance(10)}
                        className="flex-1 py-2 px-3 bg-[var(--color-warm-card)] border border-[var(--color-line)] rounded-xl font-bold text-amber-800 dark:text-amber-400 hover:border-amber-600 min-h-[44px]"
                      >
                        +10 жетонов
                      </button>
                      <button
                        onClick={() => adapter.adjustBalance(-10)}
                        className="flex-1 py-2 px-3 bg-[var(--color-warm-card)] border border-[var(--color-line)] rounded-xl font-bold text-amber-800 dark:text-amber-400 hover:border-amber-600 min-h-[44px]"
                      >
                        -10 жетонов
                      </button>
                      <button
                        onClick={() => adapter.adjustBalance(-user.balanceTokens)}
                        className="py-2 px-3 bg-[var(--color-warm-card)] border border-[var(--color-line)] rounded-xl font-bold text-red-700 hover:border-red-600 min-h-[44px]"
                        title="Обнулить"
                      >
                        0
                      </button>
                    </div>
                  </div>
                )}

                {/* Theme Switcher */}
                <div>
                  <label className="font-bold text-[var(--color-secondary-text)] block mb-2 uppercase tracking-wider text-sm">
                    Тема оформления
                  </label>
                  <div className="flex gap-1.5 p-1 bg-[var(--color-soft-bg)] rounded-xl">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors min-h-[44px] ${
                        theme === 'light' ? 'bg-[var(--color-card)] text-[var(--color-text)] font-bold shadow-xs' : 'text-[var(--color-secondary-text)]'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-amber-600" />
                      <span>Светлая</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors min-h-[44px] ${
                        theme === 'dark' ? 'bg-[var(--color-card)] text-[var(--color-text)] font-bold shadow-xs' : 'text-[var(--color-secondary-text)]'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-amber-400" />
                      <span>Тёмная</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors min-h-[44px] ${
                        theme === 'system' ? 'bg-[var(--color-card)] text-[var(--color-text)] font-bold shadow-xs' : 'text-[var(--color-secondary-text)]'
                      }`}
                    >
                      <Laptop className="w-4 h-4" />
                      <span>Авто</span>
                    </button>
                  </div>
                </div>

                {/* Style Preset Switcher (Section 7 requirement: 3 visual styles) */}
                <div>
                  <label className="font-bold text-[var(--color-secondary-text)] block mb-2 uppercase tracking-wider text-sm">
                    Вариант стиля (3 варианта)
                  </label>
                  <div className="space-y-1.5">
                    {(Object.keys(stylePresets) as StylePresetId[]).map((key) => {
                      const preset = stylePresets[key];
                      const isSel = stylePreset === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setStylePreset(key)}
                          className={`w-full p-2.5 text-left rounded-xl border transition-colors flex items-center justify-between min-h-[44px] ${
                            isSel
                              ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)]'
                              : 'border-[var(--color-line)] hover:bg-amber-500/10'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">{preset.name}</span>
                            <span className="text-sm opacity-80 line-clamp-1">{preset.description}</span>
                          </div>
                          {isSel && <span className="text-sm font-bold uppercase tracking-wider">Активен</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Viewport Width Emulation (Section 6 requirement: 360 / 768 / 1280) */}
                <div>
                  <label className="font-bold text-[var(--color-secondary-text)] block mb-2 uppercase tracking-wider text-sm">
                    Ширина экрана (адаптив)
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => setPreviewWidth(360)}
                      className={`p-2 rounded-lg border text-center transition-colors min-h-[44px] flex flex-col items-center justify-center ${
                        previewWidth === 360 ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)] font-bold' : 'border-[var(--color-line)]'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1" />
                      <span>360</span>
                    </button>
                    <button
                      onClick={() => setPreviewWidth(768)}
                      className={`p-2 rounded-lg border text-center transition-colors min-h-[44px] flex flex-col items-center justify-center ${
                        previewWidth === 768 ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)] font-bold' : 'border-[var(--color-line)]'
                      }`}
                    >
                      <Tablet className="w-4 h-4 mx-auto mb-1" />
                      <span>768</span>
                    </button>
                    <button
                      onClick={() => setPreviewWidth(1280)}
                      className={`p-2 rounded-lg border text-center transition-colors min-h-[44px] flex flex-col items-center justify-center ${
                        previewWidth === 1280 ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)] font-bold' : 'border-[var(--color-line)]'
                      }`}
                    >
                      <Monitor className="w-4 h-4 mx-auto mb-1" />
                      <span>1280</span>
                    </button>
                    <button
                      onClick={() => setPreviewWidth(null)}
                      className={`p-2 rounded-lg border text-center transition-colors min-h-[44px] flex flex-col items-center justify-center ${
                        previewWidth === null ? 'bg-[var(--color-primary-action)] text-white border-[var(--color-primary-action)] font-bold' : 'border-[var(--color-line)]'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4 mx-auto mb-1" />
                      <span>100%</span>
                    </button>
                  </div>
                </div>

                {/* Orders in States Quick Jump */}
                <div>
                  <label className="font-bold text-[var(--color-secondary-text)] block mb-2 uppercase tracking-wider text-sm">
                    Открыть заказ в статусе…
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => navigate('/order/ord_demo_pending')}
                      className="p-2.5 rounded-lg border border-[var(--color-line)] hover:border-amber-600 text-left font-medium min-h-[44px]"
                    >
                      ⏳ pending
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_paid')}
                      className="p-2.5 rounded-lg border border-[var(--color-line)] hover:border-amber-600 text-left font-medium min-h-[44px]"
                    >
                      💳 paid
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_fulfilled_wallet')}
                      className="p-2.5 rounded-lg border border-[var(--color-line)] hover:border-amber-600 text-left font-medium min-h-[44px]"
                    >
                      ✅ fulfilled (кошелёк)
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_fulfilled_code')}
                      className="p-2.5 rounded-lg border border-[var(--color-line)] hover:border-amber-600 text-left font-medium min-h-[44px]"
                    >
                      🎁 fulfilled (код)
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_failed')}
                      className="p-2.5 rounded-lg border border-[var(--color-line)] hover:border-amber-600 text-left font-medium text-red-600 min-h-[44px]"
                    >
                      ❌ failed (отказ)
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_cancelled')}
                      className="p-2.5 rounded-lg border border-[var(--color-line)] hover:border-amber-600 text-left font-medium min-h-[44px]"
                    >
                      ⏹️ cancelled
                    </button>
                  </div>
                </div>

                {/* Edge Cases Toggles */}
                <div className="pt-2 border-t border-[var(--color-line)] space-y-2">
                  <button
                    onClick={handleCatalogErrorToggle}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between font-semibold transition-colors min-h-[44px] ${
                      catalogErrorSim
                        ? 'bg-[var(--color-danger-bg)] border-red-500 text-[var(--color-danger-text)]'
                        : 'border-[var(--color-line)] hover:bg-amber-500/10'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Каталог не загрузился</span>
                    </span>
                    <span>{catalogErrorSim ? 'ВКЛ' : 'ВЫКЛ'}</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => adapter.resetRateLimit()}
                      className="flex-1 p-2 rounded-xl border border-[var(--color-line)] hover:bg-amber-500/10 font-medium min-h-[44px]"
                    >
                      Сброс лимита кодов
                    </button>
                    <button
                      onClick={() => setPageMapOpen(true)}
                      className="flex-1 p-2 rounded-xl bg-[var(--color-primary-action)] hover:bg-[var(--color-primary-action-hover)] text-white font-semibold flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <Map className="w-4 h-4" />
                      <span>PageMap</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Proposals Tab (Section 9) */
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-600/20 text-sm">
                  <p className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                    Предложения сверх контракта (§9)
                  </p>
                  <p className="text-[var(--color-secondary-text)]">
                    Готовые идеи для расширения платформы и коммерческого роста сервиса:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[var(--color-warm-card)] border border-[var(--color-line)]">
                    <span className="font-bold text-sm block mb-1">1. Подарочная открытка</span>
                    <p className="text-[var(--color-secondary-text)] mb-2 text-sm">
                      Генерация красивой открытки с кодом для печати или отправки в PDF/PNG. Уже реализована кнопка печати и предпросмотр!
                    </p>
                    <span className="text-sm text-[var(--color-success-text)] font-semibold">
                      Адаптер: `getOrder()` + печать/экспорт
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-warm-card)] border border-[var(--color-line)]">
                    <span className="font-bold text-sm block mb-1">2. Тематические подборки</span>
                    <p className="text-[var(--color-secondary-text)] mb-2 text-sm">
                      Быстрые фильтры «На двоих», «Для вечеринки/корпоратива», «Разминка перед застольем».
                    </p>
                    <span className="text-sm text-amber-800 dark:text-amber-300 font-semibold">
                      Адаптер: `tags: ['couples', 'corporate', 'party']`
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-warm-card)] border border-[var(--color-line)]">
                    <span className="font-bold text-sm block mb-1">3. Калькулятор жетонов на вечер</span>
                    <p className="text-[var(--color-secondary-text)] mb-2 text-sm">
                      Укажи сколько вас человек и сколько часов планируете играть — калькулятор подскажет идеальный пакет жетонов.
                    </p>
                    <span className="text-sm text-amber-800 dark:text-amber-300 font-semibold">
                      Адаптер: расчёт по ступеням партий
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--color-warm-card)] border border-[var(--color-line)]">
                    <span className="font-bold text-sm block mb-1">4. Решения для заведений (B2B)</span>
                    <p className="text-[var(--color-secondary-text)] mb-2 text-sm">
                      Подписка для антикафе и баров: брендированные QR-тейблтенты, безлимитные партии для гостей заведения.
                    </p>
                    <span className="text-sm text-amber-800 dark:text-amber-300 font-semibold">
                      Адаптер: `getVenueSubscription()`
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
