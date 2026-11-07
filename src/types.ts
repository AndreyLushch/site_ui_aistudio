export type GameSlug = string;

export interface PriceTier {
  minPlayers: number;
  maxPlayers: number | null; // null = «и больше»
  priceTokens: number;
}

export interface SiteGame {
  slug: GameSlug;
  title: string;
  shortDescription: string;
  rules: string[]; // шаги правил
  minPlayers: number;
  maxPlayers: number;
  durationMin: number; // минут
  durationMax: number;
  tags: string[]; // 'party' | 'team' | 'words' | 'roles' | 'show' | 'ai' ...
  coverUrl: string | null; // null → заглушка
  screenshots: string[]; // может быть пустым
  priceTiers: PriceTier[];
  playUrl: string; // t.me/...?startapp=site_<slug>
}

export interface TokenPackage {
  id: string;
  tokens: number;
  priceRub: number; // целые рубли
  badge: string | null; // «Выгодно»
}

export interface SiteUser {
  telegramId: string;
  displayName: string;
  username: string | null;
  photoUrl: string | null;
  balanceTokens: number;
}

export type Delivery = 'wallet' | 'code';
export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'failed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  createdAt: string; // ISO
  packageId: string;
  tokens: number;
  amountRub: number;
  email: string; // в UI — маской
  delivery: Delivery;
  status: OrderStatus;
  code: string | null; // только delivery = 'code' и status = 'fulfilled'
  balanceAfter: number | null; // только delivery = 'wallet' и status = 'fulfilled'
  failureReason: 'bank_declined' | 'expired' | null;
}

export type RedeemResult =
  | { ok: true; tokens: number; balanceAfter: number }
  | { ok: false; reason: 'not_found' | 'already_redeemed' | 'expired' | 'rate_limited' | 'login_required' };

export interface SiteAdapter {
  getGames(): Promise<SiteGame[]>;
  getGame(slug: GameSlug): Promise<SiteGame | null>;
  getPackages(): Promise<TokenPackage[]>;
  getSession(): Promise<SiteUser | null>;
  loginWithTelegram(): Promise<SiteUser | null>; // null = отказ
  logout(): Promise<void>;
  createOrder(input: {
    packageId: string;
    email: string;
    delivery: Delivery;
    offerAccepted: true;
  }): Promise<{ orderId: string; payUrl: string }>;
  getOrder(orderId: string): Promise<Order | null>;
  listOrders(): Promise<Order[]>; // заказы вошедшего
  redeemCode(code: string): Promise<RedeemResult>;
}
