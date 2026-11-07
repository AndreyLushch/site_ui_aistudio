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
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-xl border border-amber-600/30 transition-transform hover:scale-105 min-h-[44px]"
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
          className="fixed bottom-16 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[80vh] bg-white dark:bg-[#1d1915] rounded-3xl border border-[#e9dfcf] dark:border-[#3a3127] shadow-2xl flex flex-col overflow-hidden text-[#1f1a14] dark:text-[#f5efe6] animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#e9dfcf] dark:border-[#3a3127] flex items-center justify-between bg-[#fdf8ef] dark:bg-[#231d16]">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h2 className="font-bold text-sm">Панель управления прототипом</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#6b5f50] hover:text-[#1f1a14] dark:hover:text-white rounded-lg"
              aria-label="Свернуть панель"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e9dfcf] dark:border-[#3a3127] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`flex-1 py-2.5 text-center transition-colors ${
                activeTab === 'fixtures'
                  ? 'border-b-2 border-amber-600 text-amber-800 dark:text-amber-400 bg-amber-500/5'
                  : 'text-[#6b5f50] dark:text-[#b5a998]'
              }`}
            >
              Фикстуры и тесты
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'proposals'
                  ? 'border-b-2 border-amber-600 text-amber-800 dark:text-amber-400 bg-amber-500/5'
                  : 'text-[#6b5f50] dark:text-[#b5a998]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Предложения (§9)</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-5 text-xs">
            {activeTab === 'fixtures' ? (
              <>
                {/* User Session Switcher */}
                <div>
                  <label className="font-bold text-[#6b5f50] dark:text-[#b5a998] block mb-2 uppercase tracking-wider text-[10px]">
                    Пользователь (сессия)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleUserChange('guest')}
                      className={`p-2 rounded-xl text-left border transition-colors ${
                        !user
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block">Гость</span>
                      <span className="text-[10px] opacity-80">Без входа</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('standard')}
                      className={`p-2 rounded-xl text-left border transition-colors ${
                        user?.telegramId === USER_FIXTURES.standard.telegramId
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block truncate">Андрей Л.</span>
                      <span className="text-[10px] opacity-80">Баланс: {user?.telegramId === USER_FIXTURES.standard.telegramId ? user.balanceTokens : 35}</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('zeroBalance')}
                      className={`p-2 rounded-xl text-left border transition-colors ${
                        user?.telegramId === USER_FIXTURES.zeroBalance.telegramId
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block truncate">Павел (0 жетонов)</span>
                      <span className="text-[10px] opacity-80">Нулевой баланс</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('longName')}
                      className={`p-2 rounded-xl text-left border transition-colors ${
                        user?.telegramId === USER_FIXTURES.longName.telegramId
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block truncate">Длинное имя</span>
                      <span className="text-[10px] opacity-80">120 жетонов</span>
                    </button>
                    <button
                      onClick={() => handleUserChange('noPhoto')}
                      className={`p-2 rounded-xl text-left border col-span-2 transition-colors ${
                        user?.telegramId === USER_FIXTURES.noPhoto.telegramId
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10'
                      }`}
                    >
                      <span className="font-semibold block">Мария К. (без фото)</span>
                      <span className="text-[10px] opacity-80">Проверка плейсхолдера аватара</span>
                    </button>
                  </div>
                </div>

                {/* Balance Controls */}
                {user && (
                  <div>
                    <label className="font-bold text-[#6b5f50] dark:text-[#b5a998] block mb-2 uppercase tracking-wider text-[10px]">
                      Баланс жетонов ({user.balanceTokens})
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => adapter.adjustBalance(10)}
                        className="flex-1 py-1.5 px-3 bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] rounded-xl font-bold text-amber-800 dark:text-amber-400 hover:border-amber-600"
                      >
                        +10 жетонов
                      </button>
                      <button
                        onClick={() => adapter.adjustBalance(-10)}
                        className="flex-1 py-1.5 px-3 bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] rounded-xl font-bold text-amber-800 dark:text-amber-400 hover:border-amber-600"
                      >
                        -10 жетонов
                      </button>
                      <button
                        onClick={() => adapter.adjustBalance(-user.balanceTokens)}
                        className="py-1.5 px-3 bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] rounded-xl font-bold text-red-700 hover:border-red-600"
                        title="Обнулить"
                      >
                        0
                      </button>
                    </div>
                  </div>
                )}

                {/* Theme Switcher */}
                <div>
                  <label className="font-bold text-[#6b5f50] dark:text-[#b5a998] block mb-2 uppercase tracking-wider text-[10px]">
                    Тема оформления
                  </label>
                  <div className="flex gap-1.5 p-1 bg-[#f3ece1] dark:bg-[#2a231b] rounded-xl">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                        theme === 'light' ? 'bg-white text-[#1f1a14] font-bold shadow-xs' : 'text-[#6b5f50] dark:text-[#b5a998]'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Светлая</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                        theme === 'dark' ? 'bg-[#1d1915] text-[#f5efe6] font-bold shadow-xs' : 'text-[#6b5f50] dark:text-[#b5a998]'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Тёмная</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                        theme === 'system' ? 'bg-white dark:bg-[#1d1915] text-[#1f1a14] dark:text-[#f5efe6] font-bold shadow-xs' : 'text-[#6b5f50] dark:text-[#b5a998]'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Авто</span>
                    </button>
                  </div>
                </div>

                {/* Style Preset Switcher (Section 7 requirement: 3 visual styles) */}
                <div>
                  <label className="font-bold text-[#6b5f50] dark:text-[#b5a998] block mb-2 uppercase tracking-wider text-[10px]">
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
                          className={`w-full p-2 text-left rounded-xl border transition-colors flex items-center justify-between ${
                            isSel
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">{preset.name}</span>
                            <span className="text-[10px] opacity-80 line-clamp-1">{preset.description}</span>
                          </div>
                          {isSel && <span className="text-[10px] font-bold uppercase tracking-wider">Активен</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Viewport Width Emulation (Section 6 requirement: 360 / 768 / 1280) */}
                <div>
                  <label className="font-bold text-[#6b5f50] dark:text-[#b5a998] block mb-2 uppercase tracking-wider text-[10px]">
                    Ширина экрана (адаптив)
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => setPreviewWidth(360)}
                      className={`p-1.5 rounded-lg border text-center transition-colors ${
                        previewWidth === 360 ? 'bg-amber-600 text-white border-amber-600 font-bold' : 'border-[#e9dfcf] dark:border-[#3a3127]'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 mx-auto mb-1" />
                      <span>360</span>
                    </button>
                    <button
                      onClick={() => setPreviewWidth(768)}
                      className={`p-1.5 rounded-lg border text-center transition-colors ${
                        previewWidth === 768 ? 'bg-amber-600 text-white border-amber-600 font-bold' : 'border-[#e9dfcf] dark:border-[#3a3127]'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5 mx-auto mb-1" />
                      <span>768</span>
                    </button>
                    <button
                      onClick={() => setPreviewWidth(1280)}
                      className={`p-1.5 rounded-lg border text-center transition-colors ${
                        previewWidth === 1280 ? 'bg-amber-600 text-white border-amber-600 font-bold' : 'border-[#e9dfcf] dark:border-[#3a3127]'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5 mx-auto mb-1" />
                      <span>1280</span>
                    </button>
                    <button
                      onClick={() => setPreviewWidth(null)}
                      className={`p-1.5 rounded-lg border text-center transition-colors ${
                        previewWidth === null ? 'bg-amber-600 text-white border-amber-600 font-bold' : 'border-[#e9dfcf] dark:border-[#3a3127]'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5 mx-auto mb-1" />
                      <span>100%</span>
                    </button>
                  </div>
                </div>

                {/* Orders in States Quick Jump */}
                <div>
                  <label className="font-bold text-[#6b5f50] dark:text-[#b5a998] block mb-2 uppercase tracking-wider text-[10px]">
                    Открыть заказ в статусе…
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => navigate('/order/ord_demo_pending')}
                      className="p-1.5 rounded-lg border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-600 text-left font-medium"
                    >
                      ⏳ pending
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_paid')}
                      className="p-1.5 rounded-lg border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-600 text-left font-medium"
                    >
                      💳 paid
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_fulfilled_wallet')}
                      className="p-1.5 rounded-lg border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-600 text-left font-medium"
                    >
                      ✅ fulfilled (кошелёк)
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_fulfilled_code')}
                      className="p-1.5 rounded-lg border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-600 text-left font-medium"
                    >
                      🎁 fulfilled (код)
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_failed')}
                      className="p-1.5 rounded-lg border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-600 text-left font-medium text-red-600"
                    >
                      ❌ failed (отказ)
                    </button>
                    <button
                      onClick={() => navigate('/order/ord_demo_cancelled')}
                      className="p-1.5 rounded-lg border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-600 text-left font-medium"
                    >
                      ⏹️ cancelled
                    </button>
                  </div>
                </div>

                {/* Edge Cases Toggles */}
                <div className="pt-2 border-t border-[#e9dfcf] dark:border-[#3a3127] space-y-2">
                  <button
                    onClick={handleCatalogErrorToggle}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between font-semibold transition-colors ${
                      catalogErrorSim
                        ? 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400'
                        : 'border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10'
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
                      className="flex-1 p-2 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127] hover:bg-amber-500/10 font-medium"
                    >
                      Сброс лимита кодов
                    </button>
                    <button
                      onClick={() => setPageMapOpen(true)}
                      className="flex-1 p-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>PageMap</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Proposals Tab (Section 9) */
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-600/20 text-xs">
                  <p className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                    Предложения сверх контракта (§9)
                  </p>
                  <p className="text-[#6b5f50] dark:text-[#b5a998]">
                    Готовые идеи для расширения платформы и коммерческого роста сервиса:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127]">
                    <span className="font-bold text-sm block mb-1">1. Подарочная открытка</span>
                    <p className="text-[#6b5f50] dark:text-[#b5a998] mb-2">
                      Генерация красивой открытки с кодом для печати или отправки в PDF/PNG. Уже реализована кнопка печати и предпросмотр!
                    </p>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Адаптер: `getOrder()` + печать/экспорт
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127]">
                    <span className="font-bold text-sm block mb-1">2. Тематические подборки</span>
                    <p className="text-[#6b5f50] dark:text-[#b5a998] mb-2">
                      Быстрые фильтры «На двоих», «Для вечеринки/корпоратива», «Разминка перед застольем».
                    </p>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                      Адаптер: `tags: ['couples', 'corporate', 'party']`
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127]">
                    <span className="font-bold text-sm block mb-1">3. Калькулятор жетонов на вечер</span>
                    <p className="text-[#6b5f50] dark:text-[#b5a998] mb-2">
                      Укажи сколько вас человек и сколько часов планируете играть — калькулятор подскажет идеальный пакет жетонов.
                    </p>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                      Адаптер: расчёт по ступеням партий
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127]">
                    <span className="font-bold text-sm block mb-1">4. Решения для заведений (B2B)</span>
                    <p className="text-[#6b5f50] dark:text-[#b5a998] mb-2">
                      Подписка для антикафе и баров: брендированные QR-тейблтенты, безлимитные партии для гостей заведения.
                    </p>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
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
