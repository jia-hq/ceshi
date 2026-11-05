import deckData from './deck.mjs';

export const deck = deckData;
export const positions = ['当前处境', '值得留意', '可以尝试'];

const majorIdeas = [
  ['新的起点', '给自己试错的空间'], ['主动创造', '盘点已经拥有的资源'],
  ['倾听直觉', '留意尚未说出的感受'], ['照顾与生长', '为重要的事留出时间'],
  ['秩序与边界', '明确各自能承担的责任'], ['传统与学习', '重新审视沿用的规则'],
  ['选择与连接', '说清真正重视的价值'], ['方向与推进', '把目标拆成下一步'],
  ['温柔的力量', '用耐心代替硬碰硬'], ['独处与观察', '留一点安静时间'],
  ['变化与周期', '接受暂时无法控制的部分'], ['公平与权衡', '看看双方各自的需要'],
  ['换一个角度', '暂停惯性的做法'], ['结束与转变', '允许旧方式自然告一段落'],
  ['调和与节奏', '寻找可以长期维持的步调'], ['束缚与欲望', '辨认让你失去自由的习惯'],
  ['打破旧结构', '先处理眼前真正的问题'], ['希望与恢复', '记录仍然有效的支持'],
  ['模糊与情绪', '先核实事实再下结论'], ['清晰与活力', '把好消息落实到日常'],
  ['回顾与回应', '从过去经验里提炼下一步'], ['完成与整合', '承认已经走过的路'],
];

const suitIdeas = {
  cups: ['情绪与关系', '诚实表达感受'],
  wands: ['热情与行动', '选择一个可以启动的小动作'],
  swords: ['想法与沟通', '区分事实和猜测'],
  pentacles: ['现实与资源', '留意时间与精力的分配'],
};

const rankIdeas = ['新的机会', '两种选择', '协作与成长', '稳定的基础', '眼前的摩擦', '逐步回稳', '调整方向', '持续投入', '接近收获', '阶段完成', '新的消息', '尝试推进', '照顾全局', '承担责任'];

const themeFocus = {
  '关系': '在关系里',
  '工作': '在工作或学习里',
  '自我成长': '在自我成长里',
};

function randomIndex(max) {
  if (globalThis.crypto?.getRandomValues) {
    const bucket = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    do globalThis.crypto.getRandomValues(bucket); while (bucket[0] >= limit);
    return bucket[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function drawThree() {
  const pool = [...deck];
  return positions.map(position => {
    const card = pool.splice(randomIndex(pool.length), 1)[0];
    return { ...card, reversed: randomIndex(2) === 1, position };
  });
}

export function drawOptions(chosen = []) {
  const chosenIds = new Set(chosen.map(card => card.id));
  const pool = deck.filter(card => !chosenIds.has(card.id));
  const result = [];
  for (let i = 0; i < 5; i++) {
    const card = pool.splice(randomIndex(pool.length), 1)[0];
    result.push({ ...card, reversed: randomIndex(2) === 1 });
  }
  return result;
}

function ideaFor(card) {
  if (card.arcana === 'major') return majorIdeas[card.rank];
  return [suitIdeas[card.suit][0] + '：' + rankIdeas[card.rank - 1], suitIdeas[card.suit][1]];
}

export function explainCard(card, reversed, theme) {
  const [idea, action] = ideaFor(card);
  const focus = themeFocus[theme] || '在这件事里';
  return reversed
    ? `${focus}，${card.zh}逆位提醒你留意“${idea}”是否被忽略、拖延或用力过度。先放慢一点，${action}，再决定要不要继续推进。`
    : `${focus}，${card.zh}正位把注意力带向“${idea}”。你可以试着${action}，看看哪一种做法更贴近当下的需要。`;
}

export function createReading(theme, question, cards = drawThree()) {
  const safeTheme = themeFocus[theme] ? theme : '自我成长';
  const annotated = cards.map(card => ({ ...card, meaning: explainCard(card, card.reversed, safeTheme), idea: ideaFor(card)[0] }));
  const [current, notice, action] = annotated;
  return {
    theme: safeTheme,
    question: String(question || '').trim().slice(0, 120),
    cards: annotated,
    summary: `这组三张牌从「${current.idea}」走向「${notice.idea}」，最后落在「${action.idea}」。它们不替你决定结果，却提供了三个观察角度：现在有什么、哪里值得留意、下一步能做什么。选一个最有触动的点，从一件小事开始。`,
    reflection: `如果只做一件小事来回应「${action.idea}」，你愿意从哪里开始？`,
  };
}
