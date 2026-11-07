import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CODE_ALPHABET,
  normalizeCode,
  formatCode,
  isValidCodeFormat,
  generateActivationCode,
  maskEmail,
} from './code';
import { getApplicableTiers, getStartingPriceTokens } from './price';
import { SiteGame } from '../types';

test('code normalization strips dashes, spaces and lowercases', () => {
  assert.equal(normalizeCode('ab23-45cd efgh-jk78'), 'AB2345CDEFGHJK78');
  assert.equal(normalizeCode('2345-6789-abcd-efgh'), '23456789ABCDEFGH');
});

test('code formatting formats 16 chars into groups of 4', () => {
  assert.equal(formatCode('23456789ABCDEFGH'), '2345-6789-ABCD-EFGH');
});

test('code generator creates 16 chars without 0, O, 1, I', () => {
  for (let i = 0; i < 50; i++) {
    const code = generateActivationCode();
    assert.equal(code.length, 19); // 16 chars + 3 hyphens
    const clean = normalizeCode(code);
    assert.equal(clean.length, 16);
    assert.equal(isValidCodeFormat(clean), true);
    assert.equal(clean.includes('0'), false);
    assert.equal(clean.includes('O'), false);
    assert.equal(clean.includes('1'), false);
    assert.equal(clean.includes('I'), false);
  }
});

test('email masking masks local part accurately', () => {
  assert.equal(maskEmail('andrey.lusch@gmail.com'), 'a***@gmail.com');
  assert.equal(maskEmail('test@mail.ru'), 't***@mail.ru');
  assert.equal(maskEmail('x@test.com'), 'x***@test.com');
});

test('price tiers filtering respects game min and max players', () => {
  const game: SiteGame = {
    slug: 'tractor',
    title: 'Трактор',
    shortDescription: 'Игра-шоу',
    rules: ['Шаг 1'],
    minPlayers: 3,
    maxPlayers: 12,
    durationMin: 15,
    durationMax: 45,
    tags: ['show'],
    coverUrl: null,
    screenshots: [],
    priceTiers: [
      { minPlayers: 2, maxPlayers: 5, priceTokens: 5 },
      { minPlayers: 6, maxPlayers: 12, priceTokens: 10 },
      { minPlayers: 13, maxPlayers: 18, priceTokens: 15 },
      { minPlayers: 19, maxPlayers: null, priceTokens: 20 },
    ],
    playUrl: 'https://t.me/NastolkiBot?startapp=site_tractor',
  };

  const applicable = getApplicableTiers(game);
  // Tractor is 3-12 players, so only tiers 2-5 and 6-12 should apply
  assert.equal(applicable.length, 2);
  assert.equal(applicable[0].minPlayers, 2);
  assert.equal(applicable[1].minPlayers, 6);
  assert.equal(getStartingPriceTokens(game), 5);
});
