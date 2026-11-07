import test from 'node:test';
import assert from 'node:assert/strict';
import { MockAdapter } from './MockAdapter';
import { USER_FIXTURES } from '../fixtures/users';

test('MockAdapter loads games and packages correctly', async () => {
  const adapter = new MockAdapter();
  const games = await adapter.getGames();
  assert.equal(games.length, 7);

  const packages = await adapter.getPackages();
  assert.equal(packages.length, 3);
  assert.equal(packages[2].badge, 'Выгодно');
});

test('MockAdapter handles login and logout lifecycle with conditional user data', async () => {
  const adapter = new MockAdapter();
  adapter.setSession(null);
  assert.equal(await adapter.getSession(), null);

  const loggedIn = await adapter.loginWithTelegram();
  assert.notEqual(loggedIn, null);
  assert.equal(loggedIn?.displayName, USER_FIXTURES.standard.displayName);

  await adapter.logout();
  assert.equal(await adapter.getSession(), null);
});

test('MockAdapter enforces Rule 8: guest receives empty orders and cannot create wallet delivery order', async () => {
  const adapter = new MockAdapter();
  adapter.setSession(null);

  // Guest gets empty list
  const guestOrders = await adapter.listOrders();
  assert.deepEqual(guestOrders, []);

  // Guest cannot create wallet delivery order
  await assert.rejects(
    async () => {
      await adapter.createOrder({
        packageId: 'standard',
        email: 'guest@example.com',
        delivery: 'wallet',
        offerAccepted: true,
      });
    },
    { message: /Для доставки на кошелёк необходимо войти через Telegram/ }
  );

  // Guest CAN create code delivery order
  const { orderId } = await adapter.createOrder({
    packageId: 'standard',
    email: 'guest@example.com',
    delivery: 'code',
    offerAccepted: true,
  });
  assert.ok(orderId);

  // Log in -> now listOrders returns orders
  await adapter.loginWithTelegram();
  const userOrders = await adapter.listOrders();
  assert.ok(userOrders.length > 0);
});

test('MockAdapter code redemption handles login requirement, invalid codes and rate limiting', async () => {
  const adapter = new MockAdapter();

  // 1. Without session -> login_required
  adapter.setSession(null);
  const res1 = await adapter.redeemCode('DEM2-PASS-59TK-2726');
  assert.equal(res1.ok, false);
  if (!res1.ok) assert.equal(res1.reason, 'login_required');

  // Log in
  adapter.setSession({ ...USER_FIXTURES.standard, balanceTokens: 10 });

  // 2. Already redeemed code
  const resUsed = await adapter.redeemCode('USED-CARD-29TK-PAST');
  assert.equal(resUsed.ok, false);
  if (!resUsed.ok) assert.equal(resUsed.reason, 'already_redeemed');

  // 3. Expired code
  const resExpired = await adapter.redeemCode('EXPR-CARD-24TK-PAST');
  assert.equal(resExpired.ok, false);
  if (!resExpired.ok) assert.equal(resExpired.reason, 'expired');

  // 4. Successful redemption with valid alphabet code
  const resSuccess = await adapter.redeemCode('DEM2-PASS-59TK-2726');
  assert.equal(resSuccess.ok, true);
  if (resSuccess.ok) {
    assert.equal(resSuccess.tokens, 50);
    assert.equal(resSuccess.balanceAfter, 60);
  }

  // 5. Subsequent attempt of same code -> already_redeemed
  const resAgain = await adapter.redeemCode('DEM2-PASS-59TK-2726');
  assert.equal(resAgain.ok, false);
  if (!resAgain.ok) assert.equal(resAgain.reason, 'already_redeemed');

  // 6. Test rate limit after 5 failed invalid attempts
  adapter.resetRateLimit();
  for (let i = 0; i < 4; i++) {
    const r = await adapter.redeemCode(`INVALID-CD23-4567-89AB`);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, 'not_found');
  }
  const r5 = await adapter.redeemCode('INVALID-CD23-4567-89AB');
  assert.equal(r5.ok, false);
  if (!r5.ok) assert.equal(r5.reason, 'rate_limited');
});
