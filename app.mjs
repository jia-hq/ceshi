import { drawOptions, createReading, positions } from './core.mjs';

const $ = id => document.getElementById(id);
const storageKey = 'three-card-tarot-reading-v1';
const state = { theme: '关系', question: '', cards: [], options: [], count: 0 };
const symbols = { major: '✧', cups: '♡', wands: '✦', swords: '⚔', pentacles: '◇' };
const safetyPattern = /自杀|自残|伤害自己|诊断|疾病|怀孕|买股票|投资建议|法律判决/;

function show(id) {
  for (const name of ['setup', 'draw', 'result']) $(name).hidden = name !== id;
  $(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Private browsing can block storage. */ }
}

function renderDraw() {
  const labels = ['当前处境', '值得留意', '可以尝试'];
  $('draw-prompt').textContent = `请选择第${['一', '二', '三'][state.count]}张牌：${labels[state.count]}`;
  $('picked').replaceChildren();
  for (const card of state.cards.slice(0, state.count)) {
    const item = document.createElement('span');
    item.textContent = `${card.position} ✓`;
    $('picked').append(item);
  }
  $('deck-row').replaceChildren();
  if (state.options.length !== 5) { state.options = drawOptions(state.cards); save(); }
  for (let i = 0; i < 5; i++) {
    const button = document.createElement('button');
    button.className = 'card-back';
    button.type = 'button';
    button.setAttribute('aria-label', `选择第 ${i + 1} 张牌背`);
    button.textContent = '✧';
    button.addEventListener('click', () => {
      state.cards.push({ ...state.options[i], position: positions[state.count] });
      state.count++;
      state.options = [];
      save();
      if (state.count === 3) renderResult(); else renderDraw();
    });
    $('deck-row').append(button);
  }
  show('draw');
}

function renderResult() {
  const reading = createReading(state.theme, state.question, state.cards);
  $('result-question').textContent = state.question ? `你想探索：${state.question}` : `主题：${state.theme}`;
  $('result-cards').replaceChildren();
  for (const card of reading.cards) {
    const box = document.createElement('article');
    box.className = 'reading-card';
    const face = document.createElement('div'); face.className = 'card-face'; face.textContent = symbols[card.suit || 'major'];
    const pos = document.createElement('div'); pos.className = 'card-position'; pos.textContent = card.position;
    const title = document.createElement('h3'); title.textContent = card.zh;
    const ori = document.createElement('div'); ori.className = 'orientation'; ori.textContent = card.reversed ? '逆位' : '正位';
    const meaning = document.createElement('p'); meaning.textContent = card.meaning;
    box.append(face, pos, title, ori, meaning);
    $('result-cards').append(box);
  }
  $('summary').textContent = reading.summary;
  $('reflection').textContent = reading.reflection;
  show('result');
}

document.querySelectorAll('.theme').forEach(button => button.addEventListener('click', () => {
  state.theme = button.dataset.theme;
  document.querySelectorAll('.theme').forEach(item => item.classList.toggle('selected', item === button));
}));

$('begin').addEventListener('click', () => {
  const question = $('question').value.trim();
  if (safetyPattern.test(question)) {
    $('safety').hidden = false;
    $('safety').textContent = '这个问题可能需要现实中的专业支持。这里不适合做相关判断；请换一个关于自身感受或下一步支持的问题。若你正处于危险中，请及时联系身边可信任的人或当地紧急服务。';
    return;
  }
  $('safety').hidden = true;
  state.question = question;
  state.cards = [];
  state.options = [];
  state.count = 0;
  save();
  renderDraw();
});

$('again').addEventListener('click', () => {
  state.cards = []; state.options = []; state.count = 0; state.question = '';
  $('question').value = '';
  save(); show('setup');
});

$('clear').addEventListener('click', () => {
  try { localStorage.removeItem(storageKey); } catch {}
  state.theme = '关系'; state.question = ''; state.cards = []; state.options = []; state.count = 0;
  $('question').value = '';
  document.querySelectorAll('.theme').forEach(item => item.classList.toggle('selected', item.dataset.theme === '关系'));
  $('clear').textContent = '已清除本机记录';
  show('setup');
});

$('copy').addEventListener('click', async () => {
  const reading = createReading(state.theme, '', state.cards);
  const text = `此刻的三张牌｜${reading.cards.map(c => `${c.position}：${c.zh}${c.reversed ? '逆位' : '正位'}`).join('；')}。${reading.summary}`;
  try { await navigator.clipboard.writeText(text); $('copy').textContent = '已复制摘要'; }
  catch { $('copy').textContent = '复制失败，请手动选择文字'; }
});

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (saved && Array.isArray(saved.cards) && saved.cards.length === saved.count && Number.isInteger(saved.count) && saved.count >= 0 && saved.count <= 3) {
    Object.assign(state, saved);
    $('question').value = state.question;
    document.querySelectorAll('.theme').forEach(item => item.classList.toggle('selected', item.dataset.theme === state.theme));
    if (state.count === 3) renderResult(); else renderDraw();
  }
} catch { /* A damaged local record should not block the app. */ }
