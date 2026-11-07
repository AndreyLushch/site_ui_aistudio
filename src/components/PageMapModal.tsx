import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageMapEntry {
  route: string;
  name: string;
  state: string;
  description: string;
  category: 'Основное' | 'Заказы' | 'Кабинет и коды' | 'Документы';
}

const PAGE_MAP: PageMapEntry[] = [
  {
    category: 'Основное',
    name: 'Главная',
    route: '/',
    state: 'Стандартное состояние',
    description: 'Первый экран, как это работает, подборка игр, пакеты, FAQ',
  },
  {
    category: 'Основное',
    name: 'Каталог игр',
    route: '/games',
    state: 'Все 7 игр + фильтры',
    description: 'Фильтры по игрокам, времени, тегам, быстрый переход',
  },
  {
    category: 'Основное',
    name: 'Карточка игры',
    route: '/games/guesser',
    state: 'Бесплатная игра (от 0 жетонов)',
    description: '«Угадайка» — 2–30 игроков, 0 жетонов для 2–5 чел',
  },
  {
    category: 'Основное',
    name: 'Карточка игры',
    route: '/games/shelter',
    state: 'Игра с ИИ (от 10 жетонов)',
    description: '«Укрытие» — 4–16 игроков, 40–90 мин, дебаты и ИИ',
  },
  {
    category: 'Основное',
    name: 'Магазин жетонов',
    route: '/tokens',
    state: 'Выбор пакета и способа получения',
    description: '10, 20, 50 жетонов; на кошелёк / кодом / в подарок',
  },
  {
    category: 'Заказы',
    name: 'Заглушка банка',
    route: '/pay/mock?orderId=ord_demo_pending',
    state: 'Имитация платёжной формы банка',
    description: 'Кнопки «Оплата прошла», «Отказ банка», «Закрыть окно»',
  },
  {
    category: 'Заказы',
    name: 'Заказ — Ожидание',
    route: '/order/ord_demo_pending',
    state: 'pending',
    description: '«Ждём подтверждение от банка…» с автообновлением',
  },
  {
    category: 'Заказы',
    name: 'Заказ — Оплачено',
    route: '/order/ord_demo_paid',
    state: 'paid',
    description: '«Оплачено, начисляем жетоны…»',
  },
  {
    category: 'Заказы',
    name: 'Заказ — Успех на кошелёк',
    route: '/order/ord_demo_fulfilled_wallet',
    state: 'fulfilled (wallet)',
    description: '«+50 жетонов на кошельке», новый баланс, ссылка в Telegram',
  },
  {
    category: 'Заказы',
    name: 'Заказ — Успех кодом',
    route: '/order/ord_demo_fulfilled_code',
    state: 'fulfilled (code)',
    description: 'Код крупно XXXX-XXXX-XXXX-XXXX, копирование, печать',
  },
  {
    category: 'Заказы',
    name: 'Заказ — Отказ банка',
    route: '/order/ord_demo_failed',
    state: 'failed (bank_declined)',
    description: 'Отказ банка, причина, кнопка повтора',
  },
  {
    category: 'Заказы',
    name: 'Заказ — Отменён',
    route: '/order/ord_demo_cancelled',
    state: 'cancelled (expired)',
    description: 'Истёк срок оплаты',
  },
  {
    category: 'Кабинет и коды',
    name: 'Активация кода',
    route: '/redeem',
    state: 'Форма ввода кода',
    description: 'Поле кода, автоформатирование, проверка и зачисление',
  },
  {
    category: 'Кабинет и коды',
    name: 'Кабинет пользователя',
    route: '/account',
    state: 'Авторизованный профиль',
    description: 'Аватар, имя, баланс, история покупок, коды под спойлером',
  },
  {
    category: 'Документы',
    name: 'Оферта',
    route: '/offer',
    state: 'Текст оферты',
    description: 'Официальные условия сервиса',
  },
  {
    category: 'Документы',
    name: 'Политика',
    route: '/privacy',
    state: 'Политика обработки данных',
    description: 'Конфиденциальность и безопасность чеков',
  },
  {
    category: 'Документы',
    name: 'Контакты',
    route: '/contacts',
    state: 'Реквизиты продавца',
    description: 'ИП, ОГРНИП, ИНН, поддержка',
  },
  {
    category: 'Документы',
    name: '404',
    route: '/unknown-route',
    state: 'Страница не найдена',
    description: 'Дружелюбная страница 404 с возвратом в каталог',
  },
];

export const PageMapModal: React.FC = () => {
  const { isPageMapOpen, setPageMapOpen } = useApp();
  const navigate = useNavigate();

  if (!isPageMapOpen) return null;

  const handleNavigate = (route: string) => {
    setPageMapOpen(false);
    navigate(route);
  };

  const categories = ['Основное', 'Заказы', 'Кабинет и коды', 'Документы'] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pagemap-modal-title"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1d1915] rounded-3xl border border-[#e9dfcf] dark:border-[#3a3127] shadow-2xl flex flex-col overflow-hidden text-[#1f1a14] dark:text-[#f5efe6]">
        {/* Header */}
        <div className="p-6 border-b border-[#e9dfcf] dark:border-[#3a3127] flex items-center justify-between">
          <div>
            <h2 id="pagemap-modal-title" className="text-xl font-bold font-serif">
              PageMap — Карта всех страниц и состояний
            </h2>
            <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
              Кликните по любой карточке для мгновенного перехода в это состояние
            </p>
          </div>
          <button
            onClick={() => setPageMapOpen(false)}
            className="p-2 text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] dark:hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix */}
        <div className="p-6 overflow-y-auto space-y-6">
          {categories.map((cat) => {
            const items = PAGE_MAP.filter((item) => item.category === cat);
            return (
              <div key={cat}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-3">
                  {cat}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <button
                      key={`${item.route}-${item.state}`}
                      type="button"
                      onClick={() => handleNavigate(item.route)}
                      className="p-3.5 text-left rounded-2xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-600 hover:shadow-xs transition-all flex flex-col justify-between group min-h-[90px]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-sm text-[#1f1a14] dark:text-[#f5efe6] group-hover:text-amber-700 dark:group-hover:text-amber-400">
                            {item.name}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#6b5f50] dark:text-[#b5a998] group-hover:text-amber-600 shrink-0" />
                        </div>
                        <span className="inline-block px-2 py-0.5 mb-1.5 rounded-md text-[11px] font-mono bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] text-amber-800 dark:text-amber-300">
                          {item.state}
                        </span>
                        <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
