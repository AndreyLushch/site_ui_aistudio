import React from 'react';
import { useApp } from '../context/AppContext';
import { TELEGRAM_BOT_USERNAME } from '../texts';
import { ShieldCheck, X } from 'lucide-react';

export const TelegramLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, adapter } = useApp();

  if (!isLoginModalOpen) return null;

  const handleAllow = async () => {
    await adapter.loginWithTelegram();
    closeLoginModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="telegram-dialog-title"
    >
      <div
        className="w-full max-w-md p-6 bg-white dark:bg-[#1d1915] rounded-2xl border border-[#e9dfcf] dark:border-[#3a3127] shadow-xl text-[#1f1a14] dark:text-[#f5efe6] relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-2 text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] dark:hover:text-white rounded-lg"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#2AABEE]/15 flex items-center justify-center text-[#2AABEE]">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </div>
          <div>
            <h2 id="telegram-dialog-title" className="text-lg font-bold">
              Telegram запрашивает доступ
            </h2>
            <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
              Авторизация для сервиса @{TELEGRAM_BOT_USERNAME}
            </p>
          </div>
        </div>

        <div className="p-4 mb-6 rounded-xl bg-[#fdf8ef] dark:bg-[#231d16] border border-[#e9dfcf] dark:border-[#3a3127] text-sm space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm">
              Сайт получит ваше имя, юзернейм и ID в Telegram. Это свяжет кошелёк жетонов на сайте с вашим аккаунтом в Mini App.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeLoginModal}
            className="px-4 py-2.5 text-sm font-medium text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] dark:hover:text-white rounded-xl transition-colors min-h-[44px]"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleAllow}
            data-testid="site-telegram-modal-allow"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2AABEE] hover:bg-[#229ed9] active:bg-[#1d8bc0] rounded-xl transition-colors min-h-[44px] shadow-sm"
          >
            Разрешить
          </button>
        </div>
      </div>
    </div>
  );
};
