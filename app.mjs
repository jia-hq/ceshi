import { deck, spreads, drawOptions, createReading, cardMeaning } from './core.mjs';

const $ = id => document.getElementById(id);
const activeKey = 'tarot-active-v2';
const historyKey = 'tarot-history-v2';
const oldKey = 'three-card-tarot-reading-v1';
const state = { spreadKey: 'three', theme: '关系', question: '', cards: [], options: [] };
const glyphs = { major: '✶', cups: '♡', wands: '✦', swords: '✧', pentacles: '◇' };
const safetyPattern = /自杀|自残|伤害自己|诊断|疾病|怀孕|买股票|投资建议|法律判决/;
let filter = 'all';
let drawEpoch = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motion = {
  one: { title: '让一张牌慢慢浮现。', hint: '选择一张牌，给今天一个观察角度。' },
  three: { title: '从三张牌里，找一条线索。', hint: '每选一张，牌阵会向两侧展开。' },
  five: { title: '把五个视角逐一放好。', hint: '让牌阵从中心向外延伸，慢慢看清全貌。' },
};

function readJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
function store(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function saveActive() { store(activeKey, state); }
function show(name) {
  document.querySelectorAll('.view').forEach(view => { view.hidden = view.id !== name; });
  document.querySelectorAll('[data-nav]').forEach(item => item.classList.toggle('active', item.dataset.nav === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function selectSpread(key) {
  drawEpoch++;
  state.spreadKey = spreads[key] ? key : 'three'; state.cards = []; state.options = []; state.question = '';
  $('question').value = ''; $('char-count').textContent = '0 / 120'; $('safety').hidden = true;
  $('setup-title').textContent = spreads[state.spreadKey].name;
  $('setup-subtitle').textContent = `${spreads[state.spreadKey].subtitle}。先选择主题，再写下一个想探索的问题。`;
  saveActive(); show('setup');
}
function makeFace(card, className = 'tarot-face') {
  const face = document.createElement('div'); face.className = `${className} ${card.suit || 'major'} ${card.reversed ? 'reversed' : ''}`;
  const image = document.createElement('img'); image.src = card.image || deck.find(item => item.id === card.id)?.image || '';
  image.alt = `${card.zh}牌面`; image.loading = 'lazy'; image.decoding = 'async';
  const fallback = document.createElement('span'); fallback.className = 'face-fallback'; fallback.textContent = glyphs[card.suit || 'major']; fallback.hidden = true;
  image.addEventListener('error', () => { image.hidden = true; fallback.hidden = false; });
  face.append(image, fallback); return face;
}
function renderDraw() {
  const epoch = ++drawEpoch;
  const spread = spreads[state.spreadKey];
  const index = state.cards.length;
  $('draw').dataset.mode = state.spreadKey;
  $('draw-title').textContent = motion[state.spreadKey].title;
  $('draw-hint').textContent = motion[state.spreadKey].hint;
  $('draw-prompt').textContent = `第 ${index + 1} / ${spread.positions.length} 张 · ${spread.positions[index]}`;
  $('draw-progress').replaceChildren();
  spread.positions.forEach((position, i) => {
    const item = document.createElement('div'); item.className = `progress-item ${i < index ? 'complete' : ''} ${i === index ? 'current' : ''}`;
    const mark = document.createElement('span'); mark.textContent = i < index ? '✓' : String(i + 1);
    const label = document.createElement('small'); label.textContent = position;
    item.append(mark, label); $('draw-progress').append(item);
  });
  if (state.options.length !== 5) { state.options = drawOptions(state.cards, 5); saveActive(); }
  $('deck-row').classList.remove('revealing');
  $('deck-row').replaceChildren();
  state.options.forEach((card, i) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'card-back'; button.setAttribute('aria-label', `选择第 ${i + 1} 张牌背`);
    button.innerHTML = '<span>✶</span><small>THE TAROT</small>';
    button.addEventListener('click', () => {
      if ($('deck-row').classList.contains('revealing')) return;
      $('deck-row').classList.add('revealing');
      $('deck-row').querySelectorAll('button').forEach(item => { item.disabled = true; });
      button.classList.add('chosen');
      const advance = () => {
        if (epoch !== drawEpoch) return;
        state.cards.push({ ...card, position: spread.positions[index] }); state.options = []; saveActive();
        if (state.cards.length === spread.positions.length) finishReading(); else renderDraw();
      };
      if (reducedMotion.matches) advance(); else window.setTimeout(advance, state.spreadKey === 'one' ? 600 : state.spreadKey === 'three' ? 500 : 420);
    });
    $('deck-row').append(button);
  });
  show('draw');
}
function saveReading() {
  const history = readJson(historyKey, []);
  const entry = { id: crypto.randomUUID?.() || String(Date.now()), date: new Date().toISOString(), spreadKey: state.spreadKey, theme: state.theme, question: state.question, cards: state.cards };
  history.unshift(entry); store(historyKey, history.slice(0, 30)); return entry;
}
function finishReading() { const entry = saveReading(); renderResult(entry); }
function renderResult(entry) {
  const reading = createReading(entry.theme, entry.question, entry.cards, entry.spreadKey);
  $('result').dataset.mode = entry.spreadKey;
  $('result-title').textContent = reading.spreadName;
  $('result-question').textContent = reading.question ? `你想探索：${reading.question}｜解读焦点：${reading.focus}` : `主题：${reading.theme}｜解读焦点：${reading.focus}`;
  $('result-cards').replaceChildren();
  reading.cards.forEach((card, i) => {
    const article = document.createElement('article'); article.className = 'reading-card';
    const face = makeFace(card);
    const details = document.createElement('div'); details.className = 'reading-details';
    const label = document.createElement('span'); label.className = 'eyebrow'; label.textContent = `${String(i + 1).padStart(2, '0')} / ${card.position}`;
    const title = document.createElement('h3'); title.textContent = `${card.zh} · ${card.reversed ? '逆位' : '正位'}`;
    const english = document.createElement('small'); english.textContent = card.name;
    const meaning = document.createElement('p'); meaning.textContent = card.meaning;
    details.append(label, title, english, meaning); article.append(face, details); $('result-cards').append(article);
  });
  $('summary').textContent = reading.summary; $('reflection').textContent = reading.reflection;
  $('reading-sections').replaceChildren();
  reading.sections.forEach(section => {
    const block = document.createElement('section');
    const title = document.createElement('h4'); title.textContent = section.title;
    const body = document.createElement('p'); body.textContent = section.body;
    block.append(title, body); $('reading-sections').append(block);
  });
  $('reading-support').textContent = reading.support;
  $('reading-limitations').textContent = reading.limitations;
  $('reading-limitations').hidden = !reading.limitations;
  $('reading-action').textContent = reading.action;
  $('again').onclick = () => selectSpread(entry.spreadKey);
  $('copy').onclick = async () => {
    const text = `${reading.spreadName}｜${reading.cards.map(c => `${c.position}：${c.zh}${c.reversed ? '逆位' : '正位'}`).join('；')}。${reading.summary}`;
    try { await navigator.clipboard.writeText(text); $('copy').textContent = '已复制摘要 ✓'; }
    catch { $('copy').textContent = '复制失败，请手动选择文字'; }
  };
  show('result');
}
function renderLibrary() {
  const query = $('library-search').value.trim().toLowerCase();
  const cards = deck.filter(card => (filter === 'all' || (filter === 'major' ? card.arcana === 'major' : card.suit === filter)) && (!query || `${card.zh} ${card.name} ${cardMeaning(card).keywords.join(' ')}`.toLowerCase().includes(query)));
  $('library-count').textContent = `找到 ${cards.length} 张牌`;
  $('library-grid').replaceChildren();
  cards.forEach(card => {
    const button = document.createElement('button'); button.className = 'library-card'; button.type = 'button';
    const face = makeFace(card, 'mini-face');
    const name = document.createElement('strong'); name.textContent = card.zh;
    const meta = document.createElement('small'); meta.textContent = cardMeaning(card).family;
    button.append(face, name, meta); button.addEventListener('click', () => openCard(card)); $('library-grid').append(button);
  });
}
function openCard(card) {
  const meaning = cardMeaning(card); const box = $('dialog-content'); box.replaceChildren();
  const layout = document.createElement('div'); layout.className = 'dialog-layout';
  const face = makeFace(card);
  const text = document.createElement('div');
  const family = document.createElement('span'); family.className = 'eyebrow'; family.textContent = meaning.family;
  const title = document.createElement('h2'); title.textContent = card.zh;
  const english = document.createElement('small'); english.textContent = card.name;
  const intro = document.createElement('p'); intro.className = 'dialog-intro'; intro.textContent = meaning.intro;
  const tags = document.createElement('div'); tags.className = 'keyword-row'; meaning.keywords.forEach(word => { const tag = document.createElement('span'); tag.textContent = word; tags.append(tag); });
  text.append(family, title, english, intro, tags);
  for (const [label, value] of [['正位', meaning.upright], ['逆位', meaning.reversed], ['给自己的问题', meaning.question]]) {
    const section = document.createElement('section'); const heading = document.createElement('h3'); heading.textContent = label; const p = document.createElement('p'); p.textContent = value; section.append(heading, p); text.append(section);
  }
  layout.append(face, text); box.append(layout); $('card-dialog').showModal();
}
function renderHistory() {
  const history = readJson(historyKey, []); $('history-list').replaceChildren();
  $('clear-all').hidden = history.length === 0;
  if (!history.length) { const empty = document.createElement('div'); empty.className = 'empty-state'; empty.innerHTML = '<span>✶</span><h3>旅程还没有开始</h3><p>完成一次抽牌后，记录会出现在这里。</p>'; const start = document.createElement('button'); start.className = 'button-gold'; start.textContent = '去探索 ↗'; start.addEventListener('click', () => show('home')); empty.append(start); $('history-list').append(empty); return; }
  history.forEach(entry => {
    const row = document.createElement('article'); row.className = 'history-item';
    const info = document.createElement('div'); const date = document.createElement('small'); date.textContent = new Date(entry.date).toLocaleString('zh-CN');
    const title = document.createElement('h3'); title.textContent = spreads[entry.spreadKey]?.name || '塔罗解读';
    const question = document.createElement('p'); question.textContent = entry.question || `主题：${entry.theme}`;
    const cards = document.createElement('span'); cards.className = 'history-cards'; cards.textContent = entry.cards.map(c => c.zh).join(' · ');
    info.append(date, title, question, cards);
    const actions = document.createElement('div'); actions.className = 'history-actions';
    const view = document.createElement('button'); view.textContent = '查看'; view.addEventListener('click', () => renderResult(entry));
    const remove = document.createElement('button'); remove.textContent = '删除'; remove.addEventListener('click', () => { store(historyKey, readJson(historyKey, []).filter(item => item.id !== entry.id)); renderHistory(); });
    actions.append(view, remove); row.append(info, actions); $('history-list').append(row);
  });
}

document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); const page = button.dataset.nav; if (page === 'library') renderLibrary(); if (page === 'history') renderHistory(); show(page); }));
document.querySelectorAll('[data-spread]').forEach(button => button.addEventListener('click', () => selectSpread(button.dataset.spread)));
$('hero-start').addEventListener('click', () => $('spreads').scrollIntoView({ behavior: 'smooth' }));
document.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => { state.theme = button.dataset.theme; document.querySelectorAll('[data-theme]').forEach(item => item.classList.toggle('selected', item === button)); saveActive(); }));
$('question').addEventListener('input', () => { $('char-count').textContent = `${$('question').value.length} / 120`; });
$('begin').addEventListener('click', () => {
  const question = $('question').value.trim();
  if (safetyPattern.test(question)) { $('safety').hidden = false; $('safety').textContent = '这个问题需要现实中的专业支持；这里不适合做相关判断。请换一个关于自身感受或支持方式的问题。如正处于危险中，请及时联系可信任的人或当地紧急服务。'; return; }
  $('safety').hidden = true; state.question = question; state.cards = []; state.options = []; saveActive(); renderDraw();
});
$('draw-back').addEventListener('click', () => { drawEpoch++; state.cards = []; state.options = []; saveActive(); show('setup'); });
$('library-search').addEventListener('input', renderLibrary);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('selected', item === button)); renderLibrary(); }));
$('dialog-close').addEventListener('click', () => $('card-dialog').close());
$('card-dialog').addEventListener('click', event => { if (event.target === $('card-dialog')) $('card-dialog').close(); });
$('clear-all').addEventListener('click', () => { if (!confirm('确定删除这台设备上的全部塔罗记录吗？')) return; try { localStorage.removeItem(historyKey); localStorage.removeItem(activeKey); localStorage.removeItem(oldKey); } catch {} renderHistory(); });

const saved = readJson(activeKey, null);
if (saved && spreads[saved.spreadKey] && Array.isArray(saved.cards) && saved.cards.length < spreads[saved.spreadKey].positions.length) {
  Object.assign(state, saved);
  $('question').value = state.question || '';
  $('char-count').textContent = `${$('question').value.length} / 120`;
  document.querySelectorAll('[data-theme]').forEach(item => item.classList.toggle('selected', item.dataset.theme === state.theme));
  if (state.cards.length || state.options?.length) renderDraw();
}
