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

test('78 张牌都有对应的本地牌图路径', () => {
  assert.equal(new Set(deck.map(card => card.image)).size, 78);
  assert.ok(deck.every(card => /^cards\/[mcswp]\d\d\.jpg$/.test(card.image)));
});

test('同一组牌会根据问题焦点给出不同解读', () => {
  const cards = drawThree();
  const communication = createReading('关系', '我该怎样和伴侣沟通？', cards);
  const boundary = createReading('关系', '我该怎样建立边界？', cards);
  assert.notEqual(communication.summary, boundary.summary);
  assert.notEqual(communication.reflection, boundary.reflection);
  assert.ok(communication.summary.includes('沟通'));
  assert.ok(boundary.summary.includes('边界'));
});

test('逐张解读按牌位变化，避免重复同一种套话', () => {
  const cards = [deck[0], deck[1], deck[2]].map((card, i) => ({ ...card, reversed: false, position: spreads.three.positions[i] }));
  const reading = createReading('工作', '我该怎样和同事沟通？', cards);
  assert.ok(reading.cards[0].meaning.includes('目前'));
  assert.ok(reading.cards[1].meaning.includes('留意'));
  assert.ok(reading.cards[2].meaning.includes('下一步'));
  assert.equal(new Set(reading.cards.map(card => card.meaning)).size, 3);
});

test('情绪强烈时先给安顿提示，仍保留自主选择', () => {
  const reading = createReading('工作', '我很焦虑，担心项目失败，不知道怎么办', drawThree());
  assert.ok(reading.support.includes('焦虑'));
  assert.ok(reading.support.includes('先'));
  assert.ok(reading.action.includes('可以'));
  assert.ok(reading.sources.length >= 2);
});

test('不能识别的具体问题会明确表示理解有限', () => {
  const reading = createReading('自我成长', '蓝色窗帘究竟代表什么', drawThree());
  assert.ok(reading.limitations.includes('没有完全理解'));
  assert.ok(reading.summary.includes('不能可靠地把这个具体问题映射'));
  assert.ok(!reading.action.includes('记录一个已经发生的细小变化'));
});

test('不同牌阵有不同层次的解读与篇幅', () => {
  const question = '我该怎样和伴侣沟通？';
  const make = key => createReading('关系', question, deck.slice(0, spreads[key].positions.length).map((card, index) => ({ ...card, reversed: false, position: spreads[key].positions[index] })), key);
  const one = make('one');
  const three = make('three');
  const five = make('five');
  assert.deepEqual(one.sections.map(s => s.title), ['今日线索']);
  assert.deepEqual(three.sections.map(s => s.title), ['处境与提醒', '可以尝试']);
  assert.deepEqual(five.sections.map(s => s.title), ['问题核心', '资源与阻力', '新的视角', '行动与整合']);
  const size = reading => reading.sections.map(s => s.body).join('').length;
  assert.ok(size(one) < size(three));
  assert.ok(size(three) < size(five));
  assert.ok(five.sections.some(s => s.body.includes('已有资源') && s.body.includes('隐藏阻力')));
});

test('牌面知识为每张牌提供具体观察线索', async () => {
  const { cardDetail } = await import('./knowledge.mjs');
  const details = deck.map(cardDetail);
  assert.ok(details.every(item => item.imageCue.length > 12 && item.tension.length > 12 && item.practice.length > 12));
  assert.equal(new Set(details.map(item => item.imageCue)).size, 78);
});

test('三张和五张解读包含牌面依据与牌间联系', () => {
  const cards = deck.slice(0, 5).map((card, i) => ({ ...card, reversed: i === 2, position: spreads.five.positions[i] }));
  const three = createReading('关系', '我怎样更好沟通？', cards.slice(0, 3).map((card, i) => ({ ...card, position: spreads.three.positions[i] })), 'three');
  const five = createReading('关系', '我怎样更好沟通？', cards, 'five');
  assert.ok(three.cards.every(card => card.meaning.includes('画面')));
  assert.ok(three.sections.some(section => section.body.includes('两张牌')));
  assert.ok(five.sections.some(section => section.body.includes('呼应') || section.body.includes('张力')));
  assert.ok(five.sections.map(section => section.body).join('').length > 450);
});
