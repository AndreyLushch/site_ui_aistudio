import {
  GameSlug,
  SiteGame,
  TokenPackage,
  SiteUser,
  Delivery,
  Order,
  RedeemResult,
  SiteAdapter,
} from '../types';
import { GAMES_FIXTURE } from '../fixtures/games';
import { TOKEN_PACKAGES } from '../fixtures/packages';
import { USER_FIXTURES } from '../fixtures/users';
import { ORDER_FIXTURES } from '../fixtures/orders';
import { generateActivationCode, normalizeCode } from '../utils/code';

interface StoredCodeRecord {
  code: string; // normalized
  tokens: number;
  isRedeemed: boolean;
  redeemedAt?: string;
  redeemedBy?: string;
  isExpired?: boolean;
}

const STORAGE_KEYS = {
  USER: 'nastolki_mock_user',
  ORDERS: 'nastolki_mock_orders',
  CODES: 'nastolki_mock_codes',
  RATE_LIMIT: 'nastolki_mock_ratelimit',
};

export class MockAdapter implements SiteAdapter {
  private games: SiteGame[] = [...GAMES_FIXTURE];
  private packages: TokenPackage[] = [...TOKEN_PACKAGES];
  private currentUser: SiteUser | null = USER_FIXTURES.standard;
  private orders: Map<string, Order> = new Map();
  private codes: Map<string, StoredCodeRecord> = new Map();
  private failedRedeemAttempts = 0;
  private rateLimitedUntil = 0;
  private simulateCatalogError = false;
  private listeners: Set<() => void> = new Set();
  private activeTimers: Map<string, NodeJS.Timeout[]> = new Map();

  constructor() {
    this.initFromStorage();
  }

  private emitChange() {
    this.saveToStorage();
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (e) {
        console.error('MockAdapter listener error', e);
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private initFromStorage() {
    // Populate default orders
    for (const ord of Object.values(ORDER_FIXTURES)) {
      this.orders.set(ord.id, { ...ord });
    }

    // Populate pre-configured test codes
    this.seedCode('DEMO-PASS-50TK-2026', 50, false, false);
    this.seedCode('TEST-GIFT-20TK-FREE', 20, false, false);
    this.seedCode('USED-CODE-10TK-PAST', 10, true, false);
    this.seedCode('OLD1-EXPR-20TK-PAST', 20, false, true);

    // Try reading localStorage if in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser !== null) {
          this.currentUser = storedUser ? JSON.parse(storedUser) : null;
        }

        const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (storedOrders) {
          const list: Order[] = JSON.parse(storedOrders);
          for (const ord of list) {
            this.orders.set(ord.id, ord);
          }
        }

        const storedCodes = localStorage.getItem(STORAGE_KEYS.CODES);
        if (storedCodes) {
          const list: StoredCodeRecord[] = JSON.parse(storedCodes);
          for (const rec of list) {
            this.codes.set(rec.code, rec);
          }
        }
      } catch (err) {
        console.warn('Failed to parse localStorage for MockAdapter', err);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(Array.from(this.orders.values())));
        localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(Array.from(this.codes.values())));
      } catch (e) {
        // quota exceeded or private mode, ignore
      }
    }
  }

  private seedCode(code: string, tokens: number, isRedeemed: boolean, isExpired: boolean) {
    const clean = normalizeCode(code);
    this.codes.set(clean, {
      code: clean,
      tokens,
      isRedeemed,
      isExpired,
    });
  }

  // --- SiteAdapter Implementation ---

  public async getGames(): Promise<SiteGame[]> {
    await this.delay(100);
    if (this.simulateCatalogError) {
      throw new Error('Не удалось загрузить каталог игр. Проверьте соединение.');
    }
    return [...this.games];
  }

  public async getGame(slug: GameSlug): Promise<SiteGame | null> {
    await this.delay(80);
    if (this.simulateCatalogError) {
      throw new Error('Ошибка загрузки данных игры.');
    }
    const found = this.games.find((g) => g.slug === slug);
    return found ? { ...found } : null;
  }

  public async getPackages(): Promise<TokenPackage[]> {
    await this.delay(50);
    return [...this.packages];
  }

  public async getSession(): Promise<SiteUser | null> {
    await this.delay(40);
    return this.currentUser ? { ...this.currentUser } : null;
  }

  public async loginWithTelegram(): Promise<SiteUser | null> {
    await this.delay(250);
    this.currentUser = { ...USER_FIXTURES.standard };
    this.emitChange();
    return this.currentUser;
  }

  public async logout(): Promise<void> {
    await this.delay(100);
    this.currentUser = null;
    this.emitChange();
  }

  public async createOrder(input: {
    packageId: string;
    email: string;
    delivery: Delivery;
    offerAccepted: true;
  }): Promise<{ orderId: string; payUrl: string }> {
    await this.delay(150);
    const pkg = this.packages.find((p) => p.id === input.packageId);
    if (!pkg) {
      throw new Error('Выбранный пакет жетонов не найден');
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      packageId: input.packageId,
      tokens: pkg.tokens,
      amountRub: pkg.priceRub,
      email: input.email,
      delivery: input.delivery,
      status: 'pending',
      code: null,
      balanceAfter: null,
      failureReason: null,
    };

    this.orders.set(orderId, order);
    this.emitChange();

    return {
      orderId,
      payUrl: `/pay/mock?orderId=${orderId}`,
    };
  }

  public async getOrder(orderId: string): Promise<Order | null> {
    await this.delay(80);
    const ord = this.orders.get(orderId);
    return ord ? { ...ord } : null;
  }

  public async listOrders(): Promise<Order[]> {
    await this.delay(120);
    const all = Array.from(this.orders.values());
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return all;
  }

  public async redeemCode(code: string): Promise<RedeemResult> {
    await this.delay(200);

    // Rule: Login required for code redemption
    if (!this.currentUser) {
      return { ok: false, reason: 'login_required' };
    }

    // Rate limiting check: 5 consecutive invalid codes
    const now = Date.now();
    if (this.rateLimitedUntil > now) {
      return { ok: false, reason: 'rate_limited' };
    }

    const clean = normalizeCode(code);
    const record = this.codes.get(clean);

    if (!record) {
      this.failedRedeemAttempts++;
      if (this.failedRedeemAttempts >= 5) {
        this.rateLimitedUntil = now + 10 * 60 * 1000; // 10 minutes lock
        return { ok: false, reason: 'rate_limited' };
      }
      return { ok: false, reason: 'not_found' };
    }

    if (record.isRedeemed) {
      return { ok: false, reason: 'already_redeemed' };
    }

    if (record.isExpired) {
      return { ok: false, reason: 'expired' };
    }

    // Success!
    this.failedRedeemAttempts = 0;
    record.isRedeemed = true;
    record.redeemedAt = new Date().toISOString();
    record.redeemedBy = this.currentUser.telegramId;

    const newBalance = this.currentUser.balanceTokens + record.tokens;
    this.currentUser = {
      ...this.currentUser,
      balanceTokens: newBalance,
    };

    this.emitChange();

    return {
      ok: true,
      tokens: record.tokens,
      balanceAfter: newBalance,
    };
  }

  // --- Bank Mock & Progression Helpers ---

  /**
   * Called when user presses "Оплата прошла" on the mock bank page.
   * Specification:
   * "на заглушке банка «Оплата прошла» → через 2–5 с paid → ещё через 1–2 с fulfilled (жетоны на баланс или код)"
   */
  public triggerOrderSuccessSimulation(orderId: string, speedMultiplier = 1) {
    const order = this.orders.get(orderId);
    if (!order) return;

    this.clearOrderTimers(orderId);

    // Phase 1: bank confirm -> 'paid' in 2.5s
    const t1 = setTimeout(() => {
      const current = this.orders.get(orderId);
      if (!current || current.status !== 'pending') return;

      current.status = 'paid';
      this.orders.set(orderId, { ...current });
      this.emitChange();

      // Phase 2: fulfillment -> 'fulfilled' in 1.5s
      const t2 = setTimeout(() => {
        const toFulfill = this.orders.get(orderId);
        if (!toFulfill || toFulfill.status !== 'paid') return;

        toFulfill.status = 'fulfilled';

        if (toFulfill.delivery === 'wallet') {
          // If user is currently logged in, credit tokens to wallet
          if (this.currentUser) {
            const newBal = this.currentUser.balanceTokens + toFulfill.tokens;
            this.currentUser = {
              ...this.currentUser,
              balanceTokens: newBal,
            };
            toFulfill.balanceAfter = newBal;
          } else {
            toFulfill.balanceAfter = toFulfill.tokens;
          }
        } else {
          // Generate activation code
          const code = generateActivationCode();
          toFulfill.code = code;
          this.seedCode(code, toFulfill.tokens, false, false);
        }

        this.orders.set(orderId, { ...toFulfill });
        this.emitChange();
      }, 1500 / speedMultiplier);

      const list = this.activeTimers.get(orderId) || [];
      list.push(t2);
      this.activeTimers.set(orderId, list);
    }, 2500 / speedMultiplier);

    this.activeTimers.set(orderId, [t1]);
  }

  public triggerOrderBankDecline(orderId: string) {
    this.clearOrderTimers(orderId);
    const order = this.orders.get(orderId);
    if (!order) return;

    order.status = 'failed';
    order.failureReason = 'bank_declined';
    this.orders.set(orderId, { ...order });
    this.emitChange();
  }

  public triggerOrderCloseWindow(orderId: string) {
    this.clearOrderTimers(orderId);
    const order = this.orders.get(orderId);
    if (!order) return;

    // Remains pending so user can return to pay
    order.status = 'pending';
    this.orders.set(orderId, { ...order });
    this.emitChange();
  }

  private clearOrderTimers(orderId: string) {
    const timers = this.activeTimers.get(orderId);
    if (timers) {
      timers.forEach(clearTimeout);
      this.activeTimers.delete(orderId);
    }
  }

  // --- DevPanel Controls ---

  public setSession(user: SiteUser | null) {
    this.currentUser = user ? { ...user } : null;
    this.emitChange();
  }

  public setUserFixture(key: keyof typeof USER_FIXTURES | 'guest') {
    if (key === 'guest') {
      this.setSession(null);
    } else {
      this.setSession(USER_FIXTURES[key]);
    }
  }

  public adjustBalance(delta: number) {
    if (!this.currentUser) return;
    const newBal = Math.max(0, this.currentUser.balanceTokens + delta);
    this.currentUser = {
      ...this.currentUser,
      balanceTokens: newBal,
    };
    this.emitChange();
  }

  public setSimulateCatalogError(value: boolean) {
    this.simulateCatalogError = value;
    this.emitChange();
  }

  public resetRateLimit() {
    this.failedRedeemAttempts = 0;
    this.rateLimitedUntil = 0;
    this.emitChange();
  }

  public resetToDefaults() {
    this.orders.clear();
    for (const ord of Object.values(ORDER_FIXTURES)) {
      this.orders.set(ord.id, { ...ord });
    }
    this.currentUser = { ...USER_FIXTURES.standard };
    this.failedRedeemAttempts = 0;
    this.rateLimitedUntil = 0;
    this.simulateCatalogError = false;
    this.emitChange();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Global singleton instance for the app
export const mockAdapter = new MockAdapter();
