import test from 'node:test';
import assert from 'node:assert/strict';
import { deck, spreads, drawThree, drawOptions, explainCard, createReading, cardMeaning } from './core.mjs';

test('牌组恰好有 78 张不重复的牌', () => {
  assert.equal(deck.length, 78);
  assert.equal(new Set(deck.map(card => card.id)).size, 78);
});

test('一次抽牌不会重复，且包含三个固定牌位', () => {
  for (let n = 0; n < 50; n++) {
    const cards = drawThree();
    assert.equal(cards.length, 3);
    assert.equal(new Set(cards.map(card => card.id)).size, 3);
    assert.deepEqual(cards.map(card => card.position), ['当前处境', '值得留意', '可以尝试']);
  }
});

test('每一步给出五张互不重复且不含已选牌的候选牌', () => {
  const chosen = [deck[0], deck[1]];
  const options = drawOptions(chosen);
  assert.equal(options.length, 5);
  assert.equal(new Set(options.map(card => card.id)).size, 5);
  assert.ok(options.every(card => card.id !== chosen[0].id && card.id !== chosen[1].id));
});

test('解读可区分正逆位和主题，并产生完整总结', () => {
  const card = deck[0];
  assert.notEqual(explainCard(card, false, '关系'), explainCard(card, true, '关系'));
  const result = createReading('关系', '如何更好沟通？', [
    { ...deck[0], reversed: false, position: '当前处境' },
    { ...deck[1], reversed: true, position: '值得留意' },
    { ...deck[2], reversed: false, position: '可以尝试' },
  ]);
  assert.equal(result.cards.length, 3);
  assert.ok(result.summary.length > 30);
  assert.ok(result.reflection.length > 5);
});

test('提供一、三、五张不同牌阵', () => {
  assert.deepEqual(Object.values(spreads).map(s => s.positions.length), [1, 3, 5]);
  for (const [key, spread] of Object.entries(spreads)) {
    const cards = drawOptions([], spread.positions.length).map((card, i) => ({ ...card, position: spread.positions[i] }));
    const reading = createReading('自我成长', '', cards, key);
    assert.equal(reading.cards.length, spread.positions.length);
    assert.ok(reading.summary.length > 20);
  }
});

test('78 张牌都有可区分的百科内容', () => {
  const entries = deck.map(cardMeaning);
  assert.ok(entries.every(entry => entry.keywords.length >= 2 && entry.upright.length > 15 && entry.reversed.length > 15 && entry.question.length > 5));
  assert.equal(new Set(entries.map(entry => entry.upright)).size, 78);
});
