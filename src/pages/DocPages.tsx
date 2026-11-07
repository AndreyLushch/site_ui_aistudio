import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { texts } from '../texts';
import { Shield, FileText, Phone, Mail, MapPin } from 'lucide-react';

export const DocPages: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/offer') {
    return (
      <div data-testid="site-page-offer" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Юридический документ</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
          Публичная оферта на оказание услуг
        </h1>
        <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
          Редакция от 1 января 2026 года · Настоящий документ является публичной офертой в соответствии со статьей 437 ГК РФ.
        </p>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] space-y-4 text-sm text-[#1f1a14] dark:text-[#f5efe6] leading-relaxed">
          <h2 className="font-bold text-base font-serif">1. Общие положения</h2>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            1.1. Индивидуальный предприниматель Лущиков А. В. (далее — «Исполнитель») предлагает физическим лицам (далее — «Заказчик») заключить настоящий договор на условиях предоставления доступа к сервису цифровых настольных игр «Настолки» в Telegram Mini App.
          </p>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            1.2. Акцептом настоящей оферты является совершение Заказчиком оплаты пакета жетонов на сайте либо ввод кода активации.
          </p>

          <h2 className="font-bold text-base font-serif pt-2">2. Предмет договора</h2>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            2.1. Исполнитель обязуется предоставить Заказчику цифровую внутрисервисную валюту — «жетоны» — предназначенную исключительно для запуска игровых партий на платформе «Настолки» в Telegram.
          </p>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            2.2. Жетоны не являются электронными денежными средствами или ценными бумагами и не подлежат обмену на наличные деньги, кроме случаев, прямо предусмотренных законодательством РФ.
          </p>

          <h2 className="font-bold text-base font-serif pt-2">3. Порядок оплаты и выдачи жетонов</h2>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            3.1. Оплата производится банковскими картами платёжных систем МИР, Visa, MasterCard или через СБП на защищённой платёжной странице банка-эквайера.
          </p>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            3.2. При успешном платеже жетоны зачисляются на баланс профиля в Telegram либо предоставляется уникальный 16-значный код активации.
          </p>

          <h2 className="font-bold text-base font-serif pt-2">4. Реквизиты Исполнителя</h2>
          <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] font-mono">
            {texts.footer.requisites}
          </p>
        </div>
      </div>
    );
  }

  if (path === '/privacy') {
    return (
      <div data-testid="site-page-privacy" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Безопасность данных</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
          Политика конфиденциальности
        </h1>
        <p className="text-xs text-[#6b5f50] dark:text-[#b5a998]">
          Обработка персональных данных в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
        </p>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] space-y-4 text-sm text-[#1f1a14] dark:text-[#f5efe6] leading-relaxed">
          <h2 className="font-bold text-base font-serif">1. Какие данные мы собираем</h2>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            Мы запрашиваем адрес электронной почты исключительно для направления электронного чека (в соответствии с 54-ФЗ) и отправки кода активации. При входе через Telegram сервис получает ваш идентификатор Telegram ID и публичное имя профиля.
          </p>

          <h2 className="font-bold text-base font-serif pt-2">2. Данные банковских карт</h2>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            Сайт «Настолки» <strong>не собирает, не хранит и не обрабатывает</strong> полные номера банковских карт, сроки их действия или CVC/CVV коды. Вся платёжная информация вводится напрямую в сертифицированный защищённый платёжный шлюз банка.
          </p>

          <h2 className="font-bold text-base font-serif pt-2">3. Передача третьим лицам</h2>
          <p className="text-[#6b5f50] dark:text-[#b5a998]">
            Персональные данные Заказчика передаются только операторам фискальных данных (ОФД) и банку-эквайеру для формирования чека и проведения оплаты. Данные не передаются рекламным сетям.
          </p>
        </div>
      </div>
    );
  }

  // Contacts
  return (
    <div data-testid="site-page-contacts" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
        <Mail className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Связь с нами</span>
      </div>
      <h1 className="text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
        Контакты и реквизиты
      </h1>
      <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
        По любым вопросам работы сайта, покупкам и начислению жетонов пишите в службу заботы.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] space-y-3">
          <h2 className="font-bold text-base font-serif text-[#1f1a14] dark:text-[#f5efe6]">
            Служба поддержки
          </h2>
          <div className="space-y-2 text-sm text-[#6b5f50] dark:text-[#b5a998]">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600" />
              <a href="mailto:support@nastolki.app" className="text-amber-800 dark:text-amber-400 hover:underline">
                support@nastolki.app
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-xs">Время ответа: до 2 часов с 09:00 до 22:00 МСК</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] space-y-3">
          <h2 className="font-bold text-base font-serif text-[#1f1a14] dark:text-[#f5efe6]">
            Telegram бот
          </h2>
          <div className="space-y-2 text-sm text-[#6b5f50] dark:text-[#b5a998]">
            <p>
              Официальный бот сервиса: <strong>@{texts.brand.name}Bot</strong>
            </p>
            <a
              href={`https://t.me/${texts.brand.name}Bot`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              <span>Открыть в Telegram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] space-y-2 text-xs text-[#6b5f50] dark:text-[#b5a998]">
        <h3 className="font-bold text-sm text-[#1f1a14] dark:text-[#f5efe6] font-serif mb-2">
          Реквизиты юрлица (заглушка)
        </h3>
        <p>Индивидуальный предприниматель: Лущиков Андрей Владимирович</p>
        <p>ОГРНИП: 324774600123456</p>
        <p>ИНН: 772812345678</p>
        <p>Расчётный счёт: 40802810900000123456 в АО «Банк Точка»</p>
        <p>БИК: 044525104 · К/с: 30101810745374525104</p>
      </div>
    </div>
  );
};
