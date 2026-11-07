import React from 'react';
import { Link } from 'react-router-dom';
import { TokenCoinIcon } from '../components/TokenCoinIcon';
import { ArrowLeft, Home, Dice5 } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      data-testid="site-page-404"
      className="max-w-md mx-auto px-4 py-20 text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
        <Dice5 className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
          Ошибка 404
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#1f1a14] dark:text-[#f5efe6]">
          Похоже, фишка потерялась
        </h1>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998] leading-relaxed">
          Такой страницы нет, но на нашем игровом столе ещё много отличных игр для вашей компании!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/games"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-colors min-h-[44px]"
        >
          <Dice5 className="w-4 h-4" />
          <span>Перейти в каталог игр</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl border border-[#e9dfcf] dark:border-[#3a3127] bg-white dark:bg-[#1d1915] text-[#1f1a14] dark:text-[#f5efe6] font-semibold text-sm hover:bg-amber-500/10 transition-colors min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>На главную</span>
        </Link>
      </div>
    </div>
  );
};
