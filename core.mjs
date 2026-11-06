import deckData from './deck.mjs';
import { understandQuestion } from './knowledge.mjs';

export const deck = deckData;
export const spreads = {
  one: { name: '一张牌 · 今日启示', subtitle: '用一个角度开始今天', positions: ['此刻的提示'] },
  three: { name: '三张牌 · 问题探索', subtitle: '看见处境、阻力与行动', positions: ['当前处境', '值得留意', '可以尝试'] },
  five: { name: '五张牌 · 深入梳理', subtitle: '把问题拆成五个视角', positions: ['问题核心', '已有资源', '隐藏阻力', '新的视角', '下一步行动'] },
};
export const positions = spreads.three.positions;

const major = [
  ['起点','好奇','新的道路正在展开，允许自己先探索再承诺。','仓促或犹豫可能让你看不清第一步，试着先缩小风险。','如果从一小步开始，我会尝试什么？'],
  ['创造','资源','你已有一些工具与能力，关键是把想法变成具体行动。','计划和行动之间可能有落差，先盘点真正可用的资源。','我手边已有哪一项资源？'],
  ['直觉','沉静','安静观察能让未说出口的信息慢慢浮现。','过度猜测会放大不确定感，把感受与事实分开看。','我已经知道、却还没承认的是什么？'],
  ['滋养','丰盛','照顾正在成长的事，也允许自己接受支持。','过度付出或忽视自身需要，可能让关系失衡。','我需要给自己什么样的照顾？'],
  ['结构','边界','清楚的规则和责任能为行动提供稳定框架。','控制过多或边界模糊，都会让合作变得吃力。','哪个边界需要说得更清楚？'],
  ['学习','传统','从经验与可靠的指导中寻找可借鉴的方法。','沿用旧规则未必适合现在，试着分辨哪些仍有用。','我愿意保留哪条规则，调整哪条？'],
  ['连接','选择','重要的选择需要与你真正看重的价值保持一致。','回避选择或只求迎合，可能让真实需要被遮住。','这个选择反映了我怎样的价值？'],
  ['方向','推进','方向明确后，可以把热情落实到持续行动中。','用力向前之前，先确认目标是否仍然属于自己。','我真正想驶向哪里？'],
  ['勇气','耐心','温柔而坚定的态度，往往比强推更有力量。','压抑情绪或硬撑，可能消耗本来可以保存的能量。','我能怎样更温和地坚持？'],
  ['独处','寻找','留出安静时间，能帮助你听见自己的判断。','独处若变成隔绝，也许需要重新连接可信任的人。','我需要的独处与支持各有多少？'],
  ['变化','周期','变化正在发生，留意你能把握的那部分。','试图控制每个结果会让人疲惫，先稳住日常节奏。','变化之中什么仍在我掌握里？'],
  ['公平','权衡','把事实、责任和各方需要放在同一张桌上。','若判断受情绪左右，先核实信息再做决定。','我是否给了每一方同样的理解？'],
  ['暂停','视角','暂时停下不等于失败，换个角度可能看到新路。','长期停滞可能是回避，给暂停设一个重新行动的时间。','如果倒过来看，问题会怎样变化？'],
  ['结束','转变','某个阶段正在结束，给新事物腾出空间。','抓住已经不合适的旧方式，可能妨碍下一步。','我准备放下什么，保留什么？'],
  ['调和','节奏','不同需要可以慢慢调和，寻找可持续的步调。','急于求成或过度妥协，都会打乱自己的节奏。','怎样的步调能让我走得更久？'],
  ['束缚','欲望','看见让自己受限的习惯，才能重新选择。','沉迷或自责都可能加重束缚，先找一个小出口。','我以为离不开的，真的无法改变吗？'],
  ['冲击','重建','旧结构出现裂缝，先看清哪些地方需要重建。','变化令人不安，但回避问题可能带来更大震动。','当下最需要修复的基础是什么？'],
  ['希望','恢复','希望不必宏大，微小的恢复也值得看见。','理想若离现实太远，可以先寻找具体的支持。','今天什么小事让我感觉好一点？'],
  ['朦胧','感受','允许情绪存在，同时给事实留出核对空间。','焦虑容易填补未知，暂缓对模糊信息下结论。','哪些是事实，哪些只是猜测？'],
  ['清晰','活力','清晰的表达和真实的喜悦可以带来动力。','太想维持乐观，可能让复杂感受无处安放。','我想和谁分享眼前的好消息？'],
  ['回顾','回应','回看走过的路，从经验中提炼新的回应。','反复审判过去会困住自己，试着把理解带到现在。','我从过去学到了什么？'],
  ['完成','整合','一个阶段趋于完整，可以承认自己的成长。','对完美结局的期待，可能遮住已经取得的成果。','我已经完成了哪一部分？'],
];
const suits = {
  cups: { name: '圣杯', theme: '情感、关系与内在体验', action: '表达感受' },
  wands: { name: '权杖', theme: '热情、创意与行动动力', action: '启动行动' },
  swords: { name: '宝剑', theme: '思考、沟通与取舍', action: '核对事实' },
  pentacles: { name: '星币', theme: '资源、身体与现实安排', action: '安排资源' },
};
const ranks = [
  ['新的可能','一个起点正在出现'],['双向选择','两种力量需要找到平衡'],['共同成长','合作能让想法落地'],
  ['稳住基础','已有的东西需要被妥善照看'],['面对摩擦','不适可能指出需要改变的地方'],['恢复流动','给予和接受正在重新平衡'],
  ['审视方向','停下来评估投入是否值得'],['持续练习','熟练来自一次次具体行动'],['独立收获','已有成果值得被自己看见'],
  ['阶段完成','责任与成果一起到来'],['新的消息','保持好奇，允许自己学习'],['主动前行','把想法带入现实并留意节奏'],
  ['成熟照料','理解自己也理解他人的需要'],['稳健承担','用清晰边界支撑长远目标'],
];
const themeLead = { 关系: '在关系中', 工作: '在工作或学习中', 自我成长: '在自我成长中' };
const focusRules = [
  { name: '沟通', pattern: /沟通|交流|表达|说话|聊天|争吵|吵架/, lens: '先分清自己想表达的需要，与希望对方立刻给出的回应', move: '把一句指责改写成一句关于自己感受的陈述' },
  { name: '边界', pattern: /边界|拒绝|底线|距离|控制|尊重/, lens: '看一看哪些责任属于自己，哪些其实需要交还给对方', move: '写下一个可以温和而清楚说出的界限' },
  { name: '选择', pattern: /选择|决定|要不要|是否|犹豫|取舍/, lens: '把每个选项的真实代价和自己看重的价值放在一起', move: '列出一个可逆的小尝试，而不是要求自己立刻定终局' },
  { name: '关系', pattern: /伴侣|恋人|喜欢|感情|朋友|复合|分手|他|她/, lens: '把注意力从猜测他人的想法，拉回自己实际感受到的互动', move: '观察一次具体互动中双方各自表达了什么' },
  { name: '工作', pattern: /工作|同事|领导|职业|岗位|升职|跳槽|求职|项目/, lens: '区分可控制的任务、需要协商的资源和暂时未知的结果', move: '选一个本周能完成的具体行动' },
  { name: '成长', pattern: /成长|改变|习惯|自信|焦虑|迷茫|情绪/, lens: '注意自己的节奏，别用一次表现给自己下总评', move: '记录一个已经发生的细小变化' },
];

export function questionFocus(question, theme) {
  const clean = String(question || '').trim().slice(0, 120);
  return focusRules.find(rule => rule.pattern.test(clean)) ||
    (theme === '工作' ? focusRules[4] : theme === '关系' ? focusRules[3] : focusRules[5]);
}

function randomIndex(max) {
  if (globalThis.crypto?.getRandomValues) {
    const bucket = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    do globalThis.crypto.getRandomValues(bucket); while (bucket[0] >= limit);
    return bucket[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function drawOptions(chosen = [], count = 5) {
  const chosenIds = new Set(chosen.map(card => card.id));
  const pool = deck.filter(card => !chosenIds.has(card.id));
  if (!Number.isInteger(count) || count < 1 || count > pool.length) throw new RangeError('Invalid card count');
  return Array.from({ length: count }, () => {
    const card = pool.splice(randomIndex(pool.length), 1)[0];
    return { ...card, reversed: randomIndex(2) === 1 };
  });
}

export function drawThree() {
  return drawOptions([], 3).map((card, i) => ({ ...card, position: positions[i] }));
}

export function cardMeaning(card) {
  if (card.arcana === 'major') {
    const [first, second, upright, reversed, question] = major[card.rank];
    return { keywords: [first, second], upright, reversed, question, family: '大阿卡那', intro: `${card.zh}关注的是「${first}」与「${second}」。` };
  }
  const suit = suits[card.suit];
  const [keyword, phase] = ranks[card.rank - 1];
  return {
    keywords: [keyword, suit.theme.split('、')[0]], family: suit.name,
    intro: `${card.zh}把${suit.theme}带到「${keyword}」这个阶段。`,
    upright: `${phase}。在${suit.theme}上，留意一个具体机会，试着${suit.action}，让改变有现实的落点。`,
    reversed: `${keyword}可能暂时受阻，或出现投入与回报不平衡的感觉。先放慢节奏，重新检查${suit.theme}上的真实需要，再决定是否继续。`,
    question: `面对${keyword}，我可以怎样更清楚地${suit.action}？`,
  };
}

export function explainCard(card, reversed, theme) {
  const meaning = cardMeaning(card);
  return `${themeLead[theme] || '在这件事上'}，${card.zh}${reversed ? '逆位' : '正位'}提示你关注「${meaning.keywords[0]}」。${reversed ? meaning.reversed : meaning.upright}`;
}

export function createReading(theme, question, cards = drawThree(), spreadKey = 'three') {
  const spread = spreads[spreadKey] || spreads.three;
  if (cards.length !== spread.positions.length) throw new RangeError('Cards do not match spread');
  const safeTheme = themeLead[theme] ? theme : '自我成长';
  const focus = questionFocus(question, safeTheme);
  const guidance = understandQuestion(question, safeTheme, focus);
  const positionVoices = {
    '此刻的提示': idea => `今天可以把「${idea}」当作一个提醒。`,
    '当前处境': idea => `目前最值得看见的，也许是「${idea}」。`,
    '值得留意': idea => `接下来留意「${idea}」会怎样影响你的判断。`,
    '可以尝试': idea => `下一步不妨从「${idea}」开始做一个小尝试。`,
    '问题核心': idea => `问题的中心可能落在「${idea}」，先确认这是否符合你的真实经历。`,
    '已有资源': idea => `你已经拥有的资源里，或许有一份「${idea}」可以使用。`,
    '隐藏阻力': idea => `容易被忽略的阻力，可能与「${idea}」有关。`,
    '新的视角': idea => `换个角度看，「${idea}」也许提供另一种解释。`,
    '下一步行动': idea => `下一步可以围绕「${idea}」做一个可逆的小行动。`,
  };
  const annotated = cards.map((card, i) => {
    const position = spread.positions[i];
    const idea = cardMeaning(card).keywords[0];
    const base = card.reversed ? cardMeaning(card).reversed : cardMeaning(card).upright;
    const ending = guidance.unknown ? '如果这与你的问题没有关系，可以把它放下，只保留你认为有用的部分。' : `放回你关于${focus.name}的疑问里，可以先${focus.move}。`;
    const meaning = `${positionVoices[position]?.(idea) || `这张牌让你留意「${idea}」。`}${base}${ending}`;
    return { ...card, position, meaning, idea };
  });
  const first = annotated[0];
  const last = annotated.at(-1);
  const bridge = annotated.slice(1, -1).map(card => `「${card.position}」带来${card.idea}`).join('，');
  const intro = guidance.unknown ? '先只看牌面本身：' : question ? `关于你提出的「${focus.name}」问题，` : `围绕「${focus.name}」这个主题，`;
  const summary = guidance.unknown
    ? `我不能可靠地把这个具体问题映射到现有知识规则。${first.zh}带来「${first.idea}」的角度，${annotated.length > 1 ? `最后一张${last.zh}带来「${last.idea}」。` : ''}如果这些线索与你的经历无关，请不要勉强套用；你可以把问题说得更具体后再试。`
    : annotated.length === 1
    ? `${intro}${first.zh}把注意力带向「${first.idea}」。这并不能替你确定结果，却可以作为一个提醒：${focus.lens}。先试着${focus.move}。`
    : `${intro}「${first.position}」的${first.zh}提示${first.idea}，${bridge ? `${bridge}，` : ''}「${last.position}」的${last.zh}则把视线带向${last.idea}。把这些线索放回你自己的情境里：${focus.lens}。下一步可以先${focus.move}。`;
  const reflection = `在这件关于${focus.name}的事里，如果先${focus.move}，你会从哪里开始？`;
  const context = guidance.unknown ? '这只是牌面提供的观察角度；若与你的处境不符，可以放下。' : `放回你关于${focus.name}的问题里，${focus.lens}。`;
  let sections;
  if (spreadKey === 'one') {
    sections = [{ title: '今日线索', body: `${first.zh}提示「${first.idea}」。${context}` }];
  } else if (spreadKey === 'five') {
    const [core, resource, obstacle, perspective, step] = annotated;
    sections = [
      { title: '问题核心', body: `先看「${core.position}」的${core.zh}：${core.meaning}这张牌更像一面镜子，帮助你确认眼前最需要被看见的部分。${context}` },
      { title: '资源与阻力', body: `「${resource.position}」的${resource.zh}指出可以动用的${resource.idea}；「${obstacle.position}」的${obstacle.zh}则提醒你留意${obstacle.idea}带来的阻力。把两张牌并排看：你已经拥有什么，又在哪个环节最容易卡住？${context}` },
      { title: '新的视角', body: `「${perspective.position}」的${perspective.zh}让${perspective.idea}进入画面。它不一定推翻前面的判断，但可能帮助你重新理解资源与阻力的关系。可以想想：如果暂时不急于解决，是否还有另一种解释？` },
      { title: '行动与整合', body: `最后「${step.position}」的${step.zh}落在${step.idea}。把前四张牌连起来，不必一次处理所有问题。${guidance.action}完成后再回看：这个尝试是否让你更接近自己重视的方向？` },
    ];
  } else {
    const [current, notice, step] = annotated;
    sections = [
      { title: '处境与提醒', body: `「${current.position}」的${current.zh}呈现${current.idea}；「${notice.position}」的${notice.zh}提醒留意${notice.idea}。两张牌放在一起，或许值得问：我看到的是已经发生的事实，还是对下一步的担心？${context}` },
      { title: '可以尝试', body: `「${step.position}」的${step.zh}把注意力带到${step.idea}。${guidance.action}` },
    ];
  }
  return { theme: safeTheme, question: String(question || '').trim().slice(0, 120), focus: focus.name, spreadKey, spreadName: spread.name, cards: annotated, summary, reflection, sections, ...guidance };
}
