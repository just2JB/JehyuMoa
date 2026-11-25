/* ---------- 한글 검색 ----------
   화면에 보이는 글자(가게 이름 · 혜택 · 조건)에서만 찾아요. 찾은 글자는 항상 강조돼 보여요.
   앞 글자들은 정확히 같아야 하고, 마지막 글자만 '치는 도중' 상태를 봐 줘요.
   - 이사 → 이삭 : 마지막 '사'(ㅅㅏ)가 '삭'(ㅅㅏㄱ)의 앞부분
   - 잇   → 이삭 : 받침 ㅅ이 다음 글자 첫소리로 넘어가기 직전 (ㅇㅣ + ㅅ)
   - 닭   → 달갈 : 겹받침도 같은 원리 (ㄷㅏㄹ + ㄱ)
   - 이삭ㅌ → 이삭토 : 끝에 자음·모음만 쳐 둔 상태
   - 자음만 치면 초성 검색 (ㅇㅅㅌㅅㅌ → 이삭토스트)
   - 띄어쓰기 · 대소문자 무시 */
const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const SPLIT = {
  "ㄳ": "ㄱㅅ", "ㄵ": "ㄴㅈ", "ㄶ": "ㄴㅎ", "ㄺ": "ㄹㄱ", "ㄻ": "ㄹㅁ", "ㄼ": "ㄹㅂ", "ㄽ": "ㄹㅅ", "ㄾ": "ㄹㅌ", "ㄿ": "ㄹㅍ", "ㅀ": "ㄹㅎ", "ㅄ": "ㅂㅅ",
  "ㅘ": "ㅗㅏ", "ㅙ": "ㅗㅐ", "ㅚ": "ㅗㅣ", "ㅝ": "ㅜㅓ", "ㅞ": "ㅜㅔ", "ㅟ": "ㅜㅣ", "ㅢ": "ㅡㅣ",
};
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

function isSyllable(ch) {
  const code = ch.charCodeAt(0);
  return code >= HANGUL_START && code <= HANGUL_END;
}

/** 한 글자를 자모로 (겹받침 · 겹모음은 풀어서) */
function charJamo(ch) {
  if (!isSyllable(ch)) return SPLIT[ch] || ch;
  const i = ch.charCodeAt(0) - HANGUL_START;
  const jung = JUNG[Math.floor(i / 28) % 21];
  const jong = JONG[i % 28];
  return CHO[Math.floor(i / 588)] + (SPLIT[jung] || jung) + (SPLIT[jong] || jong);
}

function charCho(ch) {
  return isSyllable(ch) ? CHO[Math.floor((ch.charCodeAt(0) - HANGUL_START) / 588)] : ch;
}

/** 띄어쓰기를 뺀 글자 목록 (원래 위치 기억) */
function toChars(text) {
  const out = [];
  Array.from(text.toLowerCase()).forEach((ch, idx) => {
    if (!/\s/.test(ch)) out.push({ ch, idx });
  });
  return out;
}

function makeQuery(raw) {
  const chars = toChars(raw).map((c) => c.ch);
  if (!chars.length) return null;
  const chosung = chars.every((ch) => /[ㄱ-ㅎ]/.test(ch)) ? chars : null;
  return { chars, chosung };
}

/** text의 start 글자부터 검색어가 맞으면 맞은 글자 수, 아니면 0 */
function matchAt(t, start, q) {
  const n = q.chars.length;
  for (let k = 0; k < n - 1; k++) {
    if (!t[start + k] || t[start + k].ch !== q.chars[k]) return 0;
  }
  const last = q.chars[n - 1];
  const cur = t[start + n - 1];
  if (!cur) return 0;
  if (cur.ch === last) return n;
  const lastJamo = charJamo(last);
  const curJamo = charJamo(cur.ch);
  if (curJamo.startsWith(lastJamo)) return n; // 이사 → 이삭, 이삭ㅌ → 이삭토
  const next = t[start + n];
  if (isSyllable(last) && next && curJamo.length < lastJamo.length && (curJamo + charCho(next.ch)).startsWith(lastJamo)) {
    return n + 1; // 잇 → 이삭, 닭 → 달갈
  }
  return 0;
}

/** 검색어와 맞는 글자 범위들 [시작, 끝) — 원래 글자 위치 기준 */
function matchRanges(text, q) {
  if (!q) return [];
  const t = toChars(text);
  const ranges = [];
  for (let i = 0; i < t.length; ) {
    let len = matchAt(t, i, q);
    if (!len && q.chosung) {
      len = q.chosung.every((c, k) => t[i + k] && charCho(t[i + k].ch) === c) ? q.chosung.length : 0;
    }
    if (len) {
      ranges.push([t[i].idx, t[i + len - 1].idx + 1]);
      i += len;
    } else {
      i += 1;
    }
  }
  return ranges;
}

/** 검색어와 맞는 부분만 파랑으로 */
function Hl({ text, q }) {
  const ranges = matchRanges(text, q);
  if (!ranges.length) return text;
  const chars = Array.from(text);
  const out = [];
  let last = 0;
  ranges.forEach(([a, b], i) => {
    if (a > last) out.push(chars.slice(last, a).join(""));
    out.push(
      <mark className="hl" key={i}>
        {chars.slice(a, b).join("")}
      </mark>
    );
    last = b;
  });
  if (last < chars.length) out.push(chars.slice(last).join(""));
  return out;
}

/** 0: 안 맞음 · 1: 혜택·조건이 맞음 · 2: 이름이 맞음 · 3: 이름이 이렇게 시작 */
function searchRank(store, q) {
  if (!q) return 1;
  const nameRanges = matchRanges(store.name, q);
  if (nameRanges.length) return nameRanges[0][0] === 0 ? 3 : 2;
  // 업종은 줄에 글자로 보이지 않으니 검색하지 않아요 (업종은 위 칩으로 골라요)
  const rest = store.benefits.flatMap((b) => [b.title, b.tag || ""]);
  return rest.some((t) => matchRanges(t, q).length) ? 1 : 0;
}
