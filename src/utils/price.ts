import { PriceTier, SiteGame } from '../types';

/**
 * Standard game player tiers
 */
export const STANDARD_TIERS = [
  { minPlayers: 2, maxPlayers: 5, label: '2–5 игроков' },
  { minPlayers: 6, maxPlayers: 12, label: '6–12 игроков' },
  { minPlayers: 13, maxPlayers: 18, label: '13–18 игроков' },
  { minPlayers: 19, maxPlayers: null, label: '19+ игроков' },
];

/**
 * Filters and returns only price tiers that overlap with the game's supported min/max player count.
 */
export function getApplicableTiers(game: SiteGame): Array<PriceTier & { label: string; perPersonApprox: number }> {
  return game.priceTiers
    .filter((tier) => {
      // Check if tier overlaps with game [game.minPlayers, game.maxPlayers]
      const tierMax = tier.maxPlayers ?? 999;
      return tierMax >= game.minPlayers && tier.minPlayers <= game.maxPlayers;
    })
    .map((tier) => {
      const label = tier.maxPlayers ? `${tier.minPlayers}–${tier.maxPlayers} игроков` : `${tier.minPlayers}+ игроков`;
      // Representative player count for approx estimation
      const tierMax = tier.maxPlayers ?? Math.min(game.maxPlayers, 24);
      const effectiveMin = Math.max(tier.minPlayers, game.minPlayers);
      const effectiveMax = Math.min(tierMax, game.maxPlayers);
      const avg = Math.round((effectiveMin + effectiveMax) / 2) || effectiveMin || 1;
      const perPersonApprox = tier.priceTokens === 0 ? 0 : Math.max(1, Math.round(tier.priceTokens / avg));

      return {
        ...tier,
        label,
        perPersonApprox,
      };
    });
}

/**
 * Finds the starting price (minimum tokens) for a game across its tiers.
 */
export function getStartingPriceTokens(game: SiteGame): number {
  if (!game.priceTiers.length) return 0;
  return Math.min(...game.priceTiers.map((t) => t.priceTokens));
}
