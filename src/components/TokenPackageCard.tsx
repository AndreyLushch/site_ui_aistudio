import React from 'react';
import { TokenPackage } from '../types';
import { TokenCoinIcon } from './TokenCoinIcon';
import { Check } from 'lucide-react';

interface TokenPackageCardProps {
  pkg: TokenPackage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const TokenPackageCard: React.FC<TokenPackageCardProps> = ({
  pkg,
  isSelected,
  onSelect,
}) => {
  const pricePerToken = (pkg.priceRub / pkg.tokens).toFixed(1);

  return (
    <div
      data-testid={`site-package-${pkg.id}`}
      onClick={() => onSelect(pkg.id)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onSelect(pkg.id);
        }
      }}
      className={`relative cursor-pointer p-6 rounded-3xl transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'bg-[#fdf8ef] dark:bg-[#231d16] border-2 border-amber-600 shadow-md ring-2 ring-amber-500/20'
          : 'bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] hover:border-amber-400'
      }`}
    >
      {/* Badge if present */}
      {pkg.badge && (
        <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold shadow-xs">
          {pkg.badge}
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <TokenCoinIcon className="w-7 h-7" />
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-[#e9dfcf] dark:border-[#3a3127]'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        <div className="mb-2">
          <div className="text-3xl font-extrabold font-serif text-[#1f1a14] dark:text-[#f5efe6] tabular-nums">
            {pkg.tokens}
          </div>
          <div className="text-sm font-medium text-[#6b5f50] dark:text-[#b5a998]">
            жетонов
          </div>
        </div>

        <p className="text-xs text-[#6b5f50] dark:text-[#b5a998] mb-4">
          ≈ {pricePerToken} ₽ за жетон
        </p>
      </div>

      <div className="pt-4 border-t border-[#e9dfcf] dark:border-[#3a3127] flex items-baseline justify-between">
        <span className="text-xs text-[#6b5f50] dark:text-[#b5a998]">Итого:</span>
        <span className="text-xl font-bold text-[#1f1a14] dark:text-[#f5efe6] tabular-nums">
          {pkg.priceRub} ₽
        </span>
      </div>
    </div>
  );
};
