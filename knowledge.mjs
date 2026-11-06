// Each rule is an original product prompt, not a quotation from a source.
import { imageNote } from './card-notes.mjs';
export const sources = {
  tarot: { title: 'A. E. Waite, The Pictorial Key to the Tarot', url: 'https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot' },
  stress: { title: 'OpenStax Psychology 2e, Regulation of Stress', url: 'https://openstax.org/books/psychology-2e/pages/14-4-regulation-of-stress' },
  grounding: { title: 'WHO, Doing What Matters in Times of Stress', url: 'https://www.who.int/publications/i/item/9789240003927' },
};

export function cardDetail(card) {
  const [imageCue, tension, practice] = imageNote(card);
  return { imageCue, tension, practice, source: 'tarot' };
}

const emotionRules = [
  { name: '焦虑', pattern: /焦虑|担心|害怕|恐慌|紧张|不安|怕.*失败/, support: '听起来你正为这件事感到焦虑。先不急着从牌里找确定答案，可以停一停，留意呼吸和身边能看见的事物，再回到眼前可处理的一小步。' },
  { name: '难过', pattern: /难过|伤心|失落|委屈|悲伤|痛苦/, support: '这件事似乎让你很难过。现在不必马上振作或作出决定；如果愿意，先给这份感受一点空间，也可以找可信任的人说说。' },
  { name: '愤怒', pattern: /生气|愤怒|气愤|恼火|气死/, support: '这件事可能让你感到愤怒。先让情绪有一个安全的缓冲，再决定怎样表达需要或界限，可能会更贴近你真正想要的结果。' },
  { name: '疲惫', pattern: /累|疲惫|压力大|撑不住|崩溃/, support: '你可能已经承受了不少压力。抽牌可以稍后再解释；此刻先休息一下、喝点水，或联系一个能陪你的人，也是一种照顾自己。' },
];

export function understandQuestion(question, theme, focus) {
  const clean = String(question || '').trim();
  const emotion = emotionRules.find(rule => rule.pattern.test(clean));
  const explicitFocus = Boolean(focus.pattern?.test(clean));
  const unknown = Boolean(clean && !explicitFocus && !emotion);
  return {
    emotion: emotion?.name || null,
    support: emotion?.support || '抽牌前后都可以停一停，看看自己此刻有什么感受；不需要因为一张牌而催促自己立刻作决定。',
    action: unknown ? '如果愿意，可以先把问题改写得更具体，例如“这件事让我在意的是什么？”；是否继续由你决定。' : `如果愿意，可以先${focus.move}；这只是一个可尝试的方向，是否适合仍由你判断。`,
    limitations: unknown ? '我可能没有完全理解你问题中的具体情境。下面只是牌面提供的反思角度，请以你的实际经历为准。' : '',
    unknown,
    sources: emotion ? ['tarot', 'stress', 'grounding'] : ['tarot', 'stress'],
  };
}
