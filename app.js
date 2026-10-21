// Английский для Саши: карточки, «послушай и найди», «прочитай и найди», мемори, раскраска,
// «какое число пропущено». Писать не нужно — только нажимать. Прогресс хранится в localStorage.

const $view = document.getElementById('view');
const KEY = 'sasha-english-v1';
const byId = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const KNOWN = TOPICS.filter(t => t.known).map(t => t.id);

// ——— прогресс ———
function load() {
  try { return Object.assign({ stars: 0, words: {}, best: {}, seenSticker: 0, rate: 0.85, sound: true, voice: '' }, JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch (e) { return { stars: 0, words: {}, best: {}, seenSticker: 0, rate: 0.85, sound: true, voice: '' }; }
}
const P = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }
const wkey = (tid, it) => tid + ':' + it.w;
function stat(tid, it) { return P.words[wkey(tid, it)] || { ok: 0, bad: 0 }; }
function mark(tid, it, good) {
  const s = stat(tid, it);
  if (good) s.ok++; else s.bad++;
  P.words[wkey(tid, it)] = s;
}
function mastery(t) {
  const n = t.items.filter(it => { const s = stat(t.id, it); return s.ok >= 2 && s.ok > s.bad; }).length;
  return n / t.items.length;
}
const stickersOpen = () => Math.min(STICKERS.length, Math.floor(P.stars / 10));

// ——— озвучка ———
const LETTER = { A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'gee', H: 'aitch', I: 'eye', J: 'jay', K: 'kay', L: 'el', M: 'em',
  N: 'en', O: 'oh', P: 'pee', Q: 'cue', R: 'are', S: 'ess', T: 'tee', U: 'you', V: 'vee', W: 'double you', X: 'ex', Y: 'why', Z: 'zed' };
let enVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
  const pref = ['Samantha', 'Karen', 'Moira', 'Daniel', 'Google US English', 'Google UK English Female', 'Microsoft Aria'];
  enVoice = vs.find(v => v.name === P.voice)
    || pref.map(n => vs.find(v => v.name.startsWith(n))).find(Boolean)
    || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

function sayText(it, full) {
  if (it.L) return full ? LETTER[it.w] + '. ' + it.ru.split(' — ')[0] : LETTER[it.w];
  return it.w.replace(/-/g, '');
}
function speak(text, slow) {
  // в APK-версии озвучивает родной синтез речи Android (WebView не умеет speechSynthesis)
  if (window.AndroidTTS) { AndroidTTS.speak(text, slow ? 0.6 : P.rate); return; }
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = enVoice ? enVoice.lang : 'en-US';
  if (enVoice) u.voice = enVoice;
  u.rate = slow ? 0.55 : P.rate;
  speechSynthesis.speak(u);
}

// ——— звуки ———
let ac = null;
function beep(notes) {
  if (!P.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    let t = ac.currentTime;
    for (const [f, d, type] of notes) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.02);
      t += d * 0.8;
    }
  } catch (e) {}
}
const sndGood = () => beep([[660, 0.12], [990, 0.2]]);
const sndBad = () => beep([[220, 0.25, 'triangle']]);
const sndWin = () => beep([[523, 0.14], [659, 0.14], [784, 0.14], [1047, 0.3]]);

// ——— помощники ———
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const go = h => { location.hash = h; };
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; };

function pic(it, cls) {
  cls = cls || '';
  if (it.c) return `<span class="pic ${cls}"><span class="blob${it.c === '#FFFFFF' ? ' light' : ''}" style="--c:${it.c}"></span></span>`;
  if (it.n) {
    const dots = it.n <= 12 ? `<span class="dots">${'<i></i>'.repeat(it.n)}</span>` : '';
    return `<span class="pic num ${cls}"><b>${it.n}</b>${dots}</span>`;
  }
  if (it.svg) return `<span class="pic svg ${cls}">${SVGS[it.svg]}</span>`;
  if (it.L) return `<span class="pic letter ${cls}"><b>${it.L}</b><small>${it.e}</small></span>`;
  return `<span class="pic emo ${cls}">${it.e}</span>`;
}
const word = it => it.L ? it.L : esc(it.w);
const tr = it => `<span class="tr">[${esc(it.t)}]</span>`;
const starsRow = n => '<i class="s-on">★</i>'.repeat(n) + '<i class="s-off">★</i>'.repeat(3 - n);

function head(title, back, extra) {
  return `<header class="bar">
    ${back ? `<button class="iconbtn" data-go="${back}" aria-label="Назад">‹</button>` : ''}
    <h1>${title}</h1>
    <span class="starchip" aria-label="Звёзды">⭐ ${P.stars}</span>
    ${extra || ''}
  </header>`;
}

// ——— главная ———
function tile(t) {
  const m = Math.round(mastery(t) * 100);
  const b = P.best[t.id] || 0;
  return `<button class="tile" style="--tint:${t.tint}" data-go="#/topic/${t.id}">
    <span class="tile-ico">${t.icon}</span>
    <span class="tile-name">${t.title}</span>
    <span class="tile-en">${t.en}</span>
    <span class="meter"><i style="width:${m}%"></i></span>
    <span class="tile-stars" aria-label="Лучший результат">${starsRow(b)}</span>
  </button>`;
}
function home() {
  const open = stickersOpen();
  $view.innerHTML = `
  <header class="hello">
    <div>
      <p class="hi">Привет, Саша! 👋</p>
      <p class="sub">Hello, Sasha! Давай поиграем по-английски.</p>
    </div>
    <div class="hello-side">
      <span class="starchip big">⭐ ${P.stars}</span>
      <button class="iconbtn ghost" data-go="#/settings" aria-label="Настройки">⚙️</button>
    </div>
  </header>

  <button class="hero" data-go="#/quiz/review/mix">
    <span class="hero-ico">🔁</span>
    <span><b>Повторим, что знаю</b><small>Цвета, числа, семья и фрукты вперемешку</small></span>
    <span class="arrow">›</span>
  </button>

  <h2 class="sec">Из школы</h2>
  <div class="grid">${TOPICS.filter(t => t.known).map(tile).join('')}</div>

  <h2 class="sec">Игры</h2>
  <div class="games">
    <button class="game" data-go="#/paint"><span>🖍️</span><b>Раскраска</b><small>Раскрась картинку по-английски</small></button>
    <button class="game" data-go="#/missing"><span>❓</span><b>Какое число пропущено?</b><small>What number is missing?</small></button>
    <button class="game" data-go="#/pairs/mix"><span>🃏</span><b>Мемори</b><small>Найди пары: картинка и слово</small></button>
  </div>

  <h2 class="sec">Узнать новое</h2>
  <div class="grid">${TOPICS.filter(t => !t.known).map(tile).join('')}</div>

  <button class="album" data-go="#/stickers">
    <span class="album-row">${STICKERS.slice(0, Math.max(open, 1)).slice(-5).map(s => open ? s : '🔒').join('')}</span>
    <span><b>Мои наклейки</b><small>${open} из ${STICKERS.length} · новая за каждые 10 ⭐</small></span>
    <span class="arrow">›</span>
  </button>
  `;
}

// ——— тема ———
function topicView(id) {
  const t = byId[id];
  if (!t) return go('#/');
  const extra = [];
  if (id === 'colors') extra.push(`<button class="mode" data-go="#/paint"><span>🖍️</span><b>Раскраска</b></button>`);
  if (id === 'numbers') extra.push(`<button class="mode" data-go="#/missing"><span>❓</span><b>Какое число пропущено?</b></button>`);
  $view.innerHTML = `${head(t.icon + ' ' + t.title, '#/')}
  <button class="en-title" data-say="${esc(t.en)}">${esc(t.en)} <span>🔊</span></button>
  <div class="modes">
    <button class="mode" data-go="#/cards/${id}"><span>👀</span><b>Смотреть карточки</b></button>
    <button class="mode" data-go="#/quiz/${id}/listen"><span>👂</span><b>Послушай и найди</b></button>
    <button class="mode" data-go="#/quiz/${id}/read"><span>📖</span><b>Прочитай и найди</b></button>
    <button class="mode" data-go="#/pairs/${id}"><span>🃏</span><b>Мемори</b></button>
    ${extra.join('')}
    ${t.phrases ? `<button class="mode" data-go="#/phrases/${id}"><span>💬</span><b>${t.phrasesTitle || 'Фразы'}</b></button>` : ''}
  </div>
  <h2 class="sec">Все слова · нажми, чтобы послушать</h2>
  <div class="list">
    ${t.items.map((it, i) => {
      const s = stat(id, it);
      const done = s.ok >= 2 && s.ok > s.bad;
      return `<button class="row" data-word="${id}:${i}">
        ${pic(it, 'sm')}
        <span class="row-txt"><b>${word(it)}</b> ${tr(it)}<small>${esc(it.ru)}</small></span>
        <span class="row-mark">${done ? '✅' : '🔊'}</span>
      </button>`;
    }).join('')}
  </div>`;
}

// ——— карточки ———
let cardIdx = 0, cardTopic = '';
function cardsView(id) {
  const t = byId[id];
  if (!t) return go('#/');
  if (cardTopic !== id) { cardTopic = id; cardIdx = 0; }
  const it = t.items[cardIdx];
  $view.innerHTML = `${head(t.title, '#/topic/' + id)}
  <div class="card-wrap">
    <button class="card" id="bigcard" style="--tint:${t.tint}" aria-label="Послушать">
      ${pic(it, 'xl')}
      <span class="card-word">${word(it)}</span>
      ${tr(it)}
      <span class="card-ru">${esc(it.ru)}</span>
    </button>
    <div class="say-row">
      <button class="sayb" data-sayit="0">🔊 Послушать</button>
      <button class="sayb slow" data-sayit="1" aria-label="Медленно">🐢</button>
    </div>
    <div class="pager">
      <button class="nav" id="prev" ${cardIdx === 0 ? 'disabled' : ''} aria-label="Назад">←</button>
      <span>${cardIdx + 1} / ${t.items.length}</span>
      ${cardIdx < t.items.length - 1
        ? `<button class="nav" id="next" aria-label="Дальше">→</button>`
        : `<button class="nav done" data-go="#/quiz/${id}/listen">Играть ▶</button>`}
    </div>
  </div>`;
  const sayIt = slow => speak(sayText(it, true), slow);
  document.getElementById('bigcard').onclick = () => sayIt(false);
  $view.querySelectorAll('[data-sayit]').forEach(b => b.onclick = () => sayIt(b.dataset.sayit === '1'));
  const move = d => { cardIdx = Math.max(0, Math.min(t.items.length - 1, cardIdx + d)); cardsView(id); speak(sayText(t.items[cardIdx], true)); };
  const p = document.getElementById('prev'), n = document.getElementById('next');
  if (p) p.onclick = () => move(-1);
  if (n) n.onclick = () => move(1);
  swipe(document.querySelector('.card-wrap'), move);
}
function swipe(el, cb) {
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 60) cb(dx < 0 ? 1 : -1);
  });
}

// ——— фразы ———
function phrasesView(id) {
  const t = byId[id];
  if (!t || !t.phrases) return go('#/');
  $view.innerHTML = `${head(t.phrasesTitle || 'Фразы', '#/topic/' + id)}
  <p class="hint">Нажми на строчку — я прочитаю её по-английски. 🐢 — медленно.</p>
  <div class="list">
    ${t.phrases.map((p, i) => `<div class="row phrase">
      <span class="pic emo sm">${p.e}</span>
      <button class="row-txt" data-ph="${i}"><b>${esc(p.w)}</b><small>${esc(p.ru)}</small></button>
      <button class="iconbtn ghost" data-ph="${i}" data-slow="1" aria-label="Медленно">🐢</button>
    </div>`).join('')}
  </div>
  <button class="wide" id="all">▶ Прочитать всё</button>`;
  $view.querySelectorAll('[data-ph]').forEach(b => b.onclick = () => speak(t.phrases[+b.dataset.ph].w, !!b.dataset.slow));
  document.getElementById('all').onclick = () => speak(t.phrases.map(p => p.w).join(' '));
}

// ——— викторина ———
let Q = null;
function pickItems(ids, n) {
  const pool = [];
  for (const id of ids) for (const it of byId[id].items) {
    const s = stat(id, it);
    pool.push({ tid: id, it, score: (s.bad + 1) / (s.ok + 1) + Math.random() * 1.2 });
  }
  pool.sort((a, b) => b.score - a.score);
  return shuffle(pool.slice(0, n));
}
function startQuiz(id, mode) {
  const ids = id === 'review' ? KNOWN : [id];
  if (!ids.every(x => byId[x])) return go('#/');
  const qs = pickItems(ids, 8).map(q => ({ ...q, type: mode === 'mix' ? (Math.random() < 0.5 ? 'listen' : 'read') : mode }));
  Q = { id, mode, qs, i: 0, good: 0, total: qs.length, retried: new Set(), earned: 0, busy: false };
  quizStep();
}
function gapWord(it) {
  const w = it.ru.split(' — ')[0];
  const k = w.indexOf(it.w.toLowerCase());
  return w.slice(0, k) + '_' + w.slice(k + 1);
}
function quizStep() {
  if (Q.i >= Q.qs.length) return quizEnd();
  const q = Q.qs[Q.i];
  const t = byId[q.tid];
  const others = sample(t.items.filter(x => x !== q.it), 3);
  const opts = shuffle([q.it, ...others]);
  const back = Q.id === 'review' ? '#/' : '#/topic/' + Q.id;
  const listen = q.type === 'listen';
  $view.innerHTML = `${head(Q.id === 'review' ? 'Повторяем' : t.title, back)}
  <div class="progress"><i style="width:${Q.i / Q.qs.length * 100}%"></i></div>
  ${listen ? `
    <p class="ask">Послушай и нажми на картинку</p>
    <div class="say-row center">
      <button class="sayb big" id="rep">🔊 Ещё раз</button>
      <button class="sayb slow" id="slow" aria-label="Медленно">🐢</button>
    </div>
    <div class="opts pics">${opts.map((o, k) => `<button class="opt" data-k="${k}">${pic(o, 'lg')}</button>`).join('')}</div>`
  : `
    ${q.it.L ? `<p class="ask">Какая буква пропущена?</p>
    <div class="qpic abcq"><span class="pic emo xl">${q.it.e}</span><b>${esc(gapWord(q.it))}</b></div>`
    : `<p class="ask">Что это? Прочитай и выбери слово</p>
    <div class="qpic">${pic(q.it, 'xl')}</div>`}
    <div class="opts words">${opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${word(o)}</b>${tr(o)}</button>`).join('')}</div>`}
  `;
  const play = slow => speak(sayText(q.it), slow);
  if (listen) {
    document.getElementById('rep').onclick = () => play(false);
    document.getElementById('slow').onclick = () => play(true);
    setTimeout(() => play(false), 250);
  }
  Q.busy = false;
  $view.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    if (Q.busy) return;
    const o = opts[+b.dataset.k];
    const right = o === q.it;
    const key = q.tid + ':' + q.it.w;
    Q.busy = true;
    if (right) {
      b.classList.add('ok'); sndGood();
      if (!Q.retried.has(key)) { Q.good++; Q.earned++; P.stars++; }
      mark(q.tid, q.it, true);
      speak(sayText(q.it, true));
      setTimeout(() => { Q.i++; quizStep(); }, 1300);
    } else {
      b.classList.add('bad'); sndBad();
      if (navigator.vibrate) navigator.vibrate(60);
      mark(q.tid, q.it, false);
      const k = opts.indexOf(q.it);
      $view.querySelector(`.opt[data-k="${k}"]`).classList.add('show');
      setTimeout(() => speak(sayText(q.it, true)), 300);
      if (!Q.retried.has(key)) { Q.retried.add(key); Q.qs.push({ ...q }); }
      setTimeout(() => { Q.i++; quizStep(); }, 2300);
    }
    save();
  });
}
function quizEnd() {
  const ratio = Q.good / Q.total;
  const st = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
  if (Q.id !== 'review') P.best[Q.id] = Math.max(P.best[Q.id] || 0, st);
  save();
  sndWin();
  const again = '#/quiz/' + Q.id + '/' + Q.mode + '?' + Date.now();
  finish(st, `Правильно с первого раза: ${Q.good} из ${Q.total}`, again, Q.id === 'review' ? '#/' : '#/topic/' + Q.id);
}

// ——— экран результата (общий для игр) ———
function finish(st, line, again, back) {
  const open = stickersOpen();
  const fresh = open > P.seenSticker;
  const newOnes = fresh ? STICKERS.slice(P.seenSticker, open) : [];
  P.seenSticker = open; save();
  const praise = st === 3 ? 'Супер! Excellent!' : st === 2 ? 'Молодец! Good job!' : 'Хорошо! Попробуем ещё?';
  $view.innerHTML = `${head('Готово!', back)}
  <div class="result">
    <div class="big-stars">${[0, 1, 2].map(i => `<span style="animation-delay:${i * 0.18}s" class="${i < st ? 'on' : ''}">★</span>`).join('')}</div>
    <p class="praise">${praise}</p>
    <p class="line">${line}</p>
    <p class="line">Всего звёзд: ⭐ ${P.stars}</p>
    ${fresh ? `<div class="newsticker"><span>${newOnes.join(' ')}</span><b>Новая наклейка!</b></div>`
      : `<p class="line small">До новой наклейки: ${10 - P.stars % 10} ⭐</p>`}
    <div class="res-btns">
      <button class="wide" data-go="${again}">🔁 Ещё раз</button>
      <button class="wide ghost" data-go="${back}">Выйти</button>
    </div>
  </div>`;
  speak(st >= 2 ? 'Well done!' : 'Good!');
}

// ——— мемори ———
let M = null;
function pairsView(id) {
  const tid = id === 'mix' ? sample(KNOWN, 1)[0] : id;
  const t = byId[tid];
  if (!t) return go('#/');
  const its = sample(t.items, 6);
  const cards = shuffle(its.flatMap((it, i) => [{ i, side: 'pic', it }, { i, side: 'word', it }]));
  M = { tid, id, cards, open: [], found: 0, moves: 0, lock: false };
  $view.innerHTML = `${head('Мемори · ' + t.title, id === 'mix' ? '#/' : '#/topic/' + tid)}
  <p class="hint">Открывай по две карточки. Найди картинку и её слово!</p>
  <div class="memory">${cards.map((c, k) => `<button class="mem" data-k="${k}" style="--tint:${t.tint}">
    <span class="back">?</span>
    <span class="face">${c.side === 'pic' ? pic(c.it, 'md') : `<b>${word(c.it)}</b>${tr(c.it)}`}</span>
  </button>`).join('')}</div>`;
  $view.querySelectorAll('.mem').forEach(b => b.onclick = () => memTap(b));
}
function memTap(b) {
  if (M.lock || b.classList.contains('up')) return;
  const c = M.cards[+b.dataset.k];
  b.classList.add('up');
  speak(sayText(c.it));
  M.open.push(b);
  if (M.open.length < 2) return;
  M.moves++;
  const [a, d] = M.open.map(x => M.cards[+x.dataset.k]);
  const pair = M.open;
  M.open = [];
  if (a.i === d.i) {
    sndGood();
    pair.forEach(x => x.classList.add('match'));
    mark(M.tid, a.it, true);
    M.found++;
    if (M.found === 6) {
      const st = M.moves <= 9 ? 3 : M.moves <= 13 ? 2 : 1;
      P.stars += st + 1; save();
      setTimeout(() => { sndWin(); finish(st, `Ходов: ${M.moves}. Звёзд за игру: ${st + 1}`, '#/pairs/' + M.id + '?' + Date.now(), M.id === 'mix' ? '#/' : '#/topic/' + M.tid); }, 900);
    }
    save();
  } else {
    M.lock = true;
    setTimeout(() => { pair.forEach(x => x.classList.remove('up')); M.lock = false; }, 1200);
  }
}

// ——— какое число пропущено ———
let N = null;
function missingView(restart) {
  if (restart || !N) N = { round: 0, good: 0, total: 6 };
  if (N.round >= N.total) {
    const st = N.good >= 6 ? 3 : N.good >= 4 ? 2 : 1;
    P.best.numbers = Math.max(P.best.numbers || 0, st); save(); sndWin();
    const g = N.good; N = null;
    return finish(st, `Угадано с первого раза: ${g} из 6`, '#/missing?' + Date.now(), '#/');
  }
  const nums = byId.numbers.items;
  const len = N.round < 3 ? 5 : 7;
  const start = 1 + (Math.random() * (12 - len + 1) | 0);
  const seq = nums.slice(start - 1, start - 1 + len);
  const gap = 1 + (Math.random() * (len - 2) | 0);
  const ans = seq[gap];
  const others = sample(nums.filter(x => x !== ans && Math.abs(x.n - ans.n) <= 3), 2);
  const opts = shuffle([ans, ...others]);
  let first = true;
  $view.innerHTML = `${head('Какое число пропущено?', '#/')}
  <div class="progress"><i style="width:${N.round / N.total * 100}%"></i></div>
  <button class="en-title" id="q">What number is missing? <span>🔊</span></button>
  <div class="seq">${seq.map((x, k) => k === gap ? `<span class="cell gap" id="gap">?</span>` : `<button class="cell" data-n="${k}">${x.n}</button>`).join('')}</div>
  <p class="ask">Выбери пропущенное число</p>
  <div class="opts words">${opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${o.w}</b>${tr(o)}</button>`).join('')}</div>`;
  const ask = () => speak('What number is missing?');
  document.getElementById('q').onclick = ask;
  setTimeout(ask, 250);
  $view.querySelectorAll('.cell[data-n]').forEach(b => b.onclick = () => speak(seq[+b.dataset.n].w));
  let busy = false;
  $view.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    if (busy) return;
    const o = opts[+b.dataset.k];
    if (o === ans) {
      busy = true;
      b.classList.add('ok'); sndGood();
      const g = document.getElementById('gap'); g.textContent = ans.n; g.classList.add('filled');
      speak(ans.w);
      mark('numbers', ans, first);
      if (first) { N.good++; P.stars++; }
      save();
      setTimeout(() => { N.round++; missingView(); }, 1400);
    } else {
      b.classList.add('bad'); sndBad();
      if (first) mark('numbers', ans, false);
      first = false; save();
      speak(o.w);
      setTimeout(() => b.classList.remove('bad'), 600);
    }
  });
}

// ——— раскраска ———
const SCENE = [
  { id: 'sun', color: 'yellow', ru: 'солнце', e: '☀️', d: '<circle cx="62" cy="58" r="30"/>' },
  { id: 'cloud', color: 'white', ru: 'облако', e: '☁️', d: '<path d="M150 78h80a18 18 0 0 0 0-36 26 26 0 0 0-48-10 20 20 0 0 0-32 14 16 16 0 0 0 0 32z"/>' },
  { id: 'sea', color: 'blue', ru: 'море', e: '🌊', d: '<path d="M0 182c20-8 40 8 60 0s40-8 60 0 40 8 60 0 40-8 60 0v78H0z"/>' },
  { id: 'sail', color: 'red', ru: 'парус', e: '⛵', d: '<path d="M112 82v90H58z"/>' },
  { id: 'boat', color: 'black', ru: 'лодку', e: '🚤', d: '<path d="M40 172h112l-16 22H58z"/>' },
  { id: 'fish', color: 'orange', ru: 'рыбку', e: '🐟', d: '<path d="M70 228c10-14 34-14 44 0-10 14-34 14-44 0zM70 228l-14-10v20z"/>' },
  { id: 'trunk', color: 'brown', ru: 'ствол пальмы', e: '🌴', d: '<path d="M282 96c6 30 6 60 0 92h16c4-32 2-62-4-92z"/>' },
  { id: 'leaves', color: 'green', ru: 'листья пальмы', e: '🌿', d: '<path d="M290 96c-20-24-52-24-70-8 22-4 44 0 70 8zM290 96c18-26 52-28 70-12-22-2-46 2-70 12zM290 96c-8-28-30-44-50-44 20 12 36 26 50 44zM290 96c10-26 34-40 54-38-20 10-38 22-54 38z"/>' },
  { id: 'flower', color: 'pink', ru: 'цветок', e: '🌸', d: '<circle cx="246" cy="164" r="7"/><circle cx="258" cy="164" r="7"/><circle cx="252" cy="154" r="7"/><circle cx="252" cy="173" r="6"/>' },
  { id: 'rock', color: 'grey', ru: 'камень', e: '🪨', d: '<path d="M318 196c2-14 14-22 28-18 10 4 14 12 14 18z"/>' }
];
let PT = null;
function paintView() {
  const colors = byId.colors.items;
  PT = { order: shuffle(SCENE), i: 0, wrong: 0, firstTry: 0 };
  $view.innerHTML = `${head('Раскраска', '#/')}
  <div class="paint">
    <svg class="scene" viewBox="0 0 360 260" role="img" aria-label="Картинка для раскраски">
      <rect width="360" height="260" fill="#EEF7FF"/>
      <path d="M220 200c20-30 110-34 140-20v80H200z" fill="#F3D9A4" stroke="#333" stroke-width="2.5"/>
      <path d="M112 82v92M252 176v24" stroke="#333" stroke-width="3" fill="none"/>
      ${SCENE.map(o => `<g id="p-${o.id}" class="part" fill="#F7F4EE" stroke="#333" stroke-width="2.5" stroke-linejoin="round">${o.d}</g>`).join('')}
    </svg>
    <div class="task" id="task"></div>
    <div class="crayons">${colors.map((c, k) => `<button class="crayon" data-k="${k}" style="--c:${c.c}" aria-label="Цвет"></button>`).join('')}</div>
  </div>`;
  $view.querySelectorAll('.crayon').forEach(b => b.onclick = () => paintTap(b, colors[+b.dataset.k]));
  paintTask();
}
function paintTask() {
  if (PT.i >= PT.order.length) {
    const g = PT.firstTry;
    P.stars += Math.ceil(g / 2);
    const st = g >= 9 ? 3 : g >= 6 ? 2 : 1;
    P.best.colors = Math.max(P.best.colors || 0, st); save();
    setTimeout(() => { sndWin(); finish(st, `С первого раза: ${g} из 10. Звёзд: ${Math.ceil(g / 2)}`, '#/paint?' + Date.now(), '#/'); }, 1500);
    document.getElementById('task').innerHTML = `<p class="ask">Какая красивая картинка! 🎉</p>`;
    return;
  }
  const o = PT.order[PT.i];
  const c = byId.colors.items.find(x => x.w === o.color);
  PT.wrong = 0;
  document.querySelectorAll('.part').forEach(g => g.classList.toggle('now', g.id === 'p-' + o.id));
  document.getElementById('task').innerHTML = `
    <p class="task-ru">Раскрась ${o.e} ${o.ru}</p>
    <button class="task-word" id="tw"><b>${c.w}</b> ${tr(c)} <span>🔊</span></button>`;
  document.getElementById('tw').onclick = () => speak(c.w);
  setTimeout(() => speak(c.w), 300);
}
function paintTap(b, col) {
  const o = PT.order[PT.i];
  if (!o) return;
  const target = byId.colors.items.find(x => x.w === o.color);
  if (col === target) {
    sndGood();
    const g = document.getElementById('p-' + o.id);
    g.classList.remove('now'); g.classList.add('painted');
    g.setAttribute('fill', col.c); g.querySelectorAll('*').forEach(el => el.setAttribute('fill', col.c));
    const tw = byId.colors.items.find(x => x.w === o.color);
    mark('colors', tw, PT.wrong === 0);
    if (PT.wrong === 0) PT.firstTry++;
    save();
    PT.i++;
    setTimeout(paintTask, 700);
  } else {
    sndBad();
    b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500);
    PT.wrong++;
    speak(target.w);
    if (PT.wrong >= 2) {
      const k = byId.colors.items.indexOf(target);
      const right = document.querySelector(`.crayon[data-k="${k}"]`);
      right.classList.add('hintme'); setTimeout(() => right.classList.remove('hintme'), 1800);
    }
  }
}

// ——— наклейки ———
function stickersView() {
  const open = stickersOpen();
  $view.innerHTML = `${head('Мои наклейки', '#/')}
  <p class="hint">За каждые 10 звёзд — новая наклейка. Открыто ${open} из ${STICKERS.length}.</p>
  <div class="stickers">${STICKERS.map((s, i) => i < open
    ? `<span class="st on">${s}</span>`
    : `<span class="st"><small>${(i + 1) * 10} ⭐</small></span>`).join('')}</div>`;
}

// ——— настройки (для взрослых) ———
function settingsView() {
  const vs = 'speechSynthesis' in window ? speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)) : [];
  $view.innerHTML = `${head('Настройки', '#/')}
  <div class="settings">
    <label class="set"><span>Скорость голоса</span>
      <select id="rate">
        <option value="0.7" ${P.rate == 0.7 ? 'selected' : ''}>Медленно</option>
        <option value="0.85" ${P.rate == 0.85 ? 'selected' : ''}>Обычно</option>
        <option value="1" ${P.rate == 1 ? 'selected' : ''}>Быстро</option>
      </select></label>
    ${window.AndroidTTS ? '' : `<label class="set"><span>Голос</span>
      <select id="voice">${vs.length ? vs.map(v => `<option ${enVoice && v.name === enVoice.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')
        : '<option>Английских голосов нет</option>'}</select></label>`}
    <button class="wide ghost" id="test">🔊 Проверить: Hello, Sasha!</button>
    <label class="set"><span>Звуки в играх</span><input type="checkbox" id="snd" ${P.sound ? 'checked' : ''}></label>
    <div class="note">
      <b>Для родителей.</b> Темы «Из школы» взяты с листков Саши: цвета, числа до 12, семья, фрукты.
      Писать ничего не нужно, все задания на слух и на чтение. Слова, в которых Саша ошибается, чаще попадаются в «Повторим, что знаю».
      Если голоса нет, на Android: Настройки → Специальные возможности → Синтез речи → Google, скачать английский язык. На iPhone: Настройки → Универсальный доступ → Устный контент → Голоса → English.
    </div>
    <button class="wide danger" id="reset">Сбросить прогресс</button>
  </div>`;
  document.getElementById('rate').onchange = e => { P.rate = +e.target.value; save(); speak('Hello, Sasha!'); };
  const vsel = document.getElementById('voice');
  if (vsel) vsel.onchange = e => { P.voice = e.target.value; save(); pickVoice(); speak('Hello, Sasha!'); };
  document.getElementById('test').onclick = () => speak('Hello, Sasha!');
  document.getElementById('snd').onchange = e => { P.sound = e.target.checked; save(); };
  document.getElementById('reset').onclick = () => {
    if (!confirm('Точно сбросить все звёзды и наклейки?')) return;
    Object.assign(P, { stars: 0, words: {}, best: {}, seenSticker: 0 }); save(); go('#/');
  };
}

// ——— маршруты ———
function route() {
  if (window.AndroidTTS) AndroidTTS.stop();
  else if ('speechSynthesis' in window) speechSynthesis.cancel();
  const h = location.hash.replace(/^#\/?/, '').split('?')[0];
  const [a, b, c] = h.split('/');
  if (a === 'topic') topicView(b);
  else if (a === 'cards') cardsView(b);
  else if (a === 'phrases') phrasesView(b);
  else if (a === 'quiz') startQuiz(b, c || 'mix');
  else if (a === 'pairs') pairsView(b);
  else if (a === 'missing') missingView(true);
  else if (a === 'paint') paintView();
  else if (a === 'stickers') stickersView();
  else if (a === 'settings') settingsView();
  else home();
  window.scrollTo(0, 0);
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { go(g.dataset.go); return; }
  const s = e.target.closest('[data-say]');
  if (s) { speak(s.dataset.say); return; }
  const w = e.target.closest('[data-word]');
  if (w) { const [tid, i] = w.dataset.word.split(':'); speak(sayText(byId[tid].items[+i], true)); }
});
window.addEventListener('hashchange', route);
route();
