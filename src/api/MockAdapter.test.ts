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

test('MockAdapter handles login and logout lifecycle', async () => {
  const adapter = new MockAdapter();
  adapter.setSession(null);
  assert.equal(await adapter.getSession(), null);

  const loggedIn = await adapter.loginWithTelegram();
  assert.notEqual(loggedIn, null);
  assert.equal(loggedIn?.displayName, 'Андрей Лущиков');

  await adapter.logout();
  assert.equal(await adapter.getSession(), null);
});

test('MockAdapter order creation and status transition', async () => {
  const adapter = new MockAdapter();
  const { orderId, payUrl } = await adapter.createOrder({
    packageId: 'standard',
    email: 'test@mail.ru',
    delivery: 'wallet',
    offerAccepted: true,
  });

  assert.equal(payUrl.includes(orderId), true);
  const order = await adapter.getOrder(orderId);
  assert.notEqual(order, null);
  assert.equal(order?.status, 'pending');
  assert.equal(order?.tokens, 20);
});

test('MockAdapter code redemption handles login requirement, invalid codes and rate limiting', async () => {
  const adapter = new MockAdapter();

  // 1. Without session -> login_required
  adapter.setSession(null);
  const res1 = await adapter.redeemCode('DEMO-PASS-50TK-2026');
  assert.equal(res1.ok, false);
  if (!res1.ok) assert.equal(res1.reason, 'login_required');

  // Log in
  adapter.setSession({ ...USER_FIXTURES.standard, balanceTokens: 10 });

  // 2. Already redeemed code
  const resUsed = await adapter.redeemCode('USED-CODE-10TK-PAST');
  assert.equal(resUsed.ok, false);
  if (!resUsed.ok) assert.equal(resUsed.reason, 'already_redeemed');

  // 3. Expired code
  const resExpired = await adapter.redeemCode('OLD1-EXPR-20TK-PAST');
  assert.equal(resExpired.ok, false);
  if (!resExpired.ok) assert.equal(resExpired.reason, 'expired');

  // 4. Successful redemption
  const resSuccess = await adapter.redeemCode('DEMO-PASS-50TK-2026');
  assert.equal(resSuccess.ok, true);
  if (resSuccess.ok) {
    assert.equal(resSuccess.tokens, 50);
    assert.equal(resSuccess.balanceAfter, 60);
  }

  // 5. Subsequent attempt of same code -> already_redeemed
  const resAgain = await adapter.redeemCode('DEMO-PASS-50TK-2026');
  assert.equal(resAgain.ok, false);
  if (!resAgain.ok) assert.equal(resAgain.reason, 'already_redeemed');

  // 6. Test rate limit after 5 failed invalid attempts
  adapter.resetRateLimit();
  for (let i = 0; i < 4; i++) {
    const r = await adapter.redeemCode(`INVALID-CODE-${i}000`);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, 'not_found');
  }
  const r5 = await adapter.redeemCode('INVALID-CODE-5000');
  assert.equal(r5.ok, false);
  if (!r5.ok) assert.equal(r5.reason, 'rate_limited');
});
