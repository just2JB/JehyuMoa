/* =========================================================
   제휴모아 · JehyuMoa
   React 18 + Babel Standalone (README 개발 방식)
   ========================================================= */
const { useState, useEffect, useMemo, useRef } = React;

/* ---------------------------------------------------------
   1. 목 데이터 (Figma 11주차 화면 기준)
   실제 제휴 정보가 아니라 프로토타입 확인용 예시입니다.
   --------------------------------------------------------- */
const COLLEGES = [
  "공학대학",
  "소프트웨어융합대학",
  "첨단융합대학",
  "약학대학",
  "글로벌문화통상대학",
  "커뮤니케이션&컬처대학",
  "경상대학",
  "디자인대학",
  "예체능대학",
  "LIONS칼리지",
];

const CATEGORIES = ["전체", "식당", "술집", "카페", "기타"];

const STUDENT_COUNCIL = "총학생회";

const STORES = [
  {
    id: "isaac", name: "이삭토스트", category: "카페", photo: "images/stores/isaac.png",
    lat: 37.300249, lng: 126.843907, favorites: 77, provider: STUDENT_COUNCIL,
    hours: { open: "08:00", close: "21:00" },
    benefits: [{ title: "음료 1,000원 할인", tag: "토스트·음료 함께", details: ["토스트와 음료를 함께 주문"] }],
  },
  {
    id: "oliva", name: "올리바샌드위치", category: "식당", photo: "images/stores/oliva.png",
    lat: 37.300431, lng: 126.843919, favorites: 98, provider: STUDENT_COUNCIL,
    hours: { open: "09:00", close: "20:00" },
    benefits: [{ title: "탄산음료 1캔", tag: "8,000원 이상", details: ["8,000원 이상 주문"] }],
  },
  {
    id: "iseo", name: "이서식당", category: "식당", photo: null,
    lat: 37.300671, lng: 126.844107, favorites: 64, provider: STUDENT_COUNCIL,
    hours: { open: "11:00", close: "21:00" },
    benefits: [
      { title: "음료 1캔", tag: "2명당 1캔", details: ["2명이 함께 오면 1캔"], minPeople: 2 },
      { title: "주류 1병", tag: "4명당", details: ["4명이 함께 오면 1병"], minPeople: 4 },
    ],
  },
  {
    id: "yuga", name: "유가네닭갈비", category: "식당", photo: "images/stores/yuga.png",
    lat: 37.300794, lng: 126.844744, favorites: 121, provider: STUDENT_COUNCIL,
    hours: { open: "11:00", close: "22:00" },
    benefits: [{ title: "음료 1캔", tag: "고기 메뉴 주문 시", details: ["고기 메뉴 주문"] }],
  },
  {
    id: "yuknsha", name: "육앤샤", category: "술집", photo: "images/stores/yuknsha.png",
    lat: 37.300584, lng: 126.845642, favorites: 187, provider: STUDENT_COUNCIL,
    hours: { open: "17:00", close: "02:00" },
    benefits: [
      { title: "소주 3,000원", tag: "오후 6시부터", details: ["오후 6시 이후 주문"] },
      { title: "육회비빔밥 1개", tag: "메뉴 4개 이상", details: ["메뉴 4개 이상 주문"] },
    ],
  },
  {
    id: "ilmi", name: "원조감자탕 일미집", category: "식당", photo: "images/stores/ilmi.png",
    hero: "images/stores/ilmi-hero.png",
    lat: 37.300295, lng: 126.846464, favorites: 156, provider: "공학대학 학생회 아름",
    providerCollege: "공학대학", pickOne: true,
    hours: { open: "11:00", close: "22:00" },
    period: "2026.09.01 ~ 12.31",
    source: "https://www.instagram.com/p/DVYePuXkVl1/?img_index=1",
    checkedAt: "2026.10.18",
    benefits: [
      { title: "펩시제로 1캔", fullTitle: "펩시제로 355ml 1캔", tag: "2명 이상 · 1인 1메뉴", details: ["2명 이상 방문", "1인 1메뉴"], minPeople: 2 },
      { title: "볶음밥 또는 사리", tag: "감자탕(중) 이상", details: ["감자탕(중) 이상 주문"] },
    ],
  },
  {
    id: "circle", name: "동그라미(써클)", category: "술집", photo: null,
    lat: 37.301959, lng: 126.845986, favorites: 109, provider: STUDENT_COUNCIL,
    hours: { open: "18:00", close: "03:00" },
    benefits: [
      { title: "음료수 1개", tag: "4명 이상", details: ["4명 이상 방문"], minPeople: 4 },
      { title: "5% 할인", tag: "현금/계좌이체", details: ["현금 또는 계좌이체로 결제"] },
    ],
  },
  {
    id: "rock", name: "락", category: "술집", photo: "images/stores/rock.png",
    lat: 37.300405, lng: 126.847701, favorites: 212, provider: STUDENT_COUNCIL,
    hours: { open: "18:00", close: "04:00" },
    benefits: [{ title: "소주 무제한 4,000원", tag: "오후 9시까지", details: ["오후 9시 전 입장"] }],
  },
  {
    id: "manchwi", name: "만취", category: "술집", photo: "images/stores/manchwi.png",
    lat: 37.300537, lng: 126.848016, favorites: 171, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "17:00", close: "03:00" },
    benefits: [
      { title: "주류 1병당 500원 할인", details: ["주류 주문 시 병마다 적용"] },
      { title: "5% 할인", tag: "현금/계좌이체", details: ["현금 또는 계좌이체로 결제"] },
    ],
  },
  {
    id: "daldal", name: "달달포차", category: "술집", photo: "images/stores/daldal.png",
    lat: 37.300389, lng: 126.848389, favorites: 143, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "18:00", close: "04:00" },
    benefits: [
      { title: "10% 할인", tag: "현금/계좌이체", details: ["현금 또는 계좌이체로 결제"] },
      { title: "주류 1병 500원 할인", details: ["주류 주문 시 적용"] },
    ],
  },
  {
    id: "roadrock", name: "로드락비어", category: "술집", photo: "images/stores/roadrock.png",
    lat: 37.297666, lng: 126.848303, favorites: 134, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "17:00", close: "02:00" },
    benefits: [
      { title: "음료 또는 주류 1병", tag: "탕 세트 주문 시", details: ["탕 세트 주문"] },
      { title: "주류 1병", tag: "20명 이상 · 테이블당", details: ["20명 이상 단체 방문", "테이블마다 1병"], minPeople: 20 },
    ],
  },
  {
    id: "ilmidak", name: "일미닭갈비파전", category: "식당", photo: "images/stores/ilmi-dakgalbi.png",
    lat: 37.303338, lng: 126.847775, favorites: 88, provider: STUDENT_COUNCIL,
    hours: { open: "11:30", close: "23:00" },
    benefits: [{ title: "볶음밥 1인분 또는 사리", tag: "3인분 이상", details: ["닭갈비 3인분 이상 주문"] }],
  },
  {
    id: "jaika", name: "자이카 인도요리", category: "식당", photo: "images/stores/jaika.png",
    lat: 37.305252, lng: 126.842322, favorites: 52, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "11:00", close: "21:30" },
    benefits: [
      { title: "음료 1개", tag: "테이블당", details: ["테이블마다 1개"] },
      { title: "믹스샐러드 1개", tag: "5명 이상", details: ["5명 이상 방문"], minPeople: 5 },
    ],
  },
  // 다른 단과대 학생회 제휴 예시 (소속 조건 필터 확인용)
  {
    id: "sw-chicken", name: "한입치킨", category: "술집", photo: null,
    lat: 37.301139, lng: 126.846552, favorites: 61, provider: "소프트웨어융합대학 학생회",
    providerCollege: "소프트웨어융합대학",
    hours: { open: "16:00", close: "01:00" },
    benefits: [{ title: "감자튀김 1개", tag: "2명 이상", details: ["2명 이상 방문"], minPeople: 2 }],
  },
  {
    id: "design-snack", name: "청춘분식", category: "식당", photo: null,
    lat: 37.301021, lng: 126.842860, favorites: 45, provider: "디자인대학 학생회",
    providerCollege: "디자인대학",
    hours: { open: "10:00", close: "20:00" },
    benefits: [{ title: "튀김 1인분", tag: "1인 1메뉴", details: ["1인 1메뉴 주문"] }],
  },
];

const INITIAL_FAVORITES = ["isaac", "ilmi", "rock", "manchwi"];

const SORTS = {
  distance: { label: "거리순", desc: (base) => `${BASES[base].label}에서 가까운 순` },
  popular: { label: "인기순", desc: () => "최근 30일 즐겨찾기가 많은 순" },
  name: { label: "가나다순", desc: () => "가게 이름 ㄱ → ㅎ 순" },
};

/* 정문 · 후문 좌표는 OSM 캠퍼스 경계를 보고 잡은 근사값이에요. 실제 데이터 준비(#7)에서 현장 좌표로 바꿔요. */
const BASES = {
  gate: { label: "ERICA 정문", desc: "학교 정문에서 잰 거리 · 기본", lat: 37.2999, lng: 126.8438 },
  back: { label: "ERICA 후문", desc: "후문 쪽 가게가 먼저 보여요", lat: 37.2935, lng: 126.8285 },
  me: { label: "지금 내 위치", desc: "위치 권한을 허용하면 쓸 수 있어요" },
};

/* ---------------------------------------------------------
   2. 도우미 함수
   --------------------------------------------------------- */
function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem("jehyumoa:" + key);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("jehyumoa:" + key, JSON.stringify(value));
    } catch (e) {
      /* 저장 공간을 쓸 수 없으면 메모리에서만 유지 */
    }
  }, [key, value]);
  return [value, setValue];
}

function formatDistance(m) {
  return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`;
}

/* 지금 내 위치 (브라우저 위치 권한으로 받은 값). 없으면 정문 기준으로 계산해요. */
let MY_POS = null;

function basePoint(base) {
  if (base === "me" && MY_POS) return MY_POS;
  return BASES[base === "me" ? "gate" : base];
}

/** 두 좌표 사이 직선거리(m) */
function metersBetween(a, b) {
  const R = 6371000;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function distanceOf(store, base) {
  return Math.round(metersBetween(basePoint(base), store) / 10) * 10;
}

/** 같이 가는 사람 전체가 이 가게 제휴 대상인지 */
function isEligible(store, cond) {
  if (!store.providerCollege) return true; // 총학생회 제휴는 ERICA 학생 모두
  const colleges = groupColleges(cond);
  return colleges.length === 1 && colleges[0] === store.providerCollege;
}

function groupColleges(cond) {
  if (cond.people === 1 || cond.sameCollege) return [cond.myCollege];
  return Object.keys(cond.mix).filter((c) => cond.mix[c] > 0);
}

function conditionLabel(cond) {
  const colleges = groupColleges(cond);
  const who = colleges.length > 1 ? `${cond.myCollege} 외 ${colleges.length - 1}곳` : cond.myCollege;
  return `${who} · ${cond.people === 1 ? "혼자" : cond.people + "명"}`;
}

function minutesOf(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function hourText(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h < 12 || h === 24 ? "오전" : "오후";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hh}시${m ? ` ${m}분` : ""}`;
}

function openState(hours, now = new Date()) {
  const cur = now.getHours() * 60 + now.getMinutes();
  const open = minutesOf(hours.open);
  let close = minutesOf(hours.close);
  if (close <= open) close += 24 * 60; // 새벽까지 영업
  const inRange = (t) => t >= open && t < close;
  const isOpen = inRange(cur) || inRange(cur + 24 * 60);
  return isOpen
    ? { isOpen, text: `${hourText(hours.close)}에 닫아요` }
    : { isOpen, text: `${hourText(hours.open)}에 열어요` };
}

/* ---------- 한글 검색 ----------
   화면에 보이는 글자(가게 이름 · 혜택 · 조건)와 업종에서만 찾아요.
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

/** 0: 안 맞음 · 1: 혜택·조건·업종이 맞음 · 2: 이름이 맞음 · 3: 이름이 이렇게 시작 */
function searchRank(store, q) {
  if (!q) return 1;
  const nameRanges = matchRanges(store.name, q);
  if (nameRanges.length) return nameRanges[0][0] === 0 ? 3 : 2;
  const rest = [store.category, ...store.benefits.flatMap((b) => [b.title, b.tag || ""])];
  return rest.some((t) => matchRanges(t, q).length) ? 1 : 0;
}

function sortStores(list, sort, base) {
  const copy = [...list];
  if (sort === "distance") copy.sort((a, b) => distanceOf(a, base) - distanceOf(b, base));
  if (sort === "popular") copy.sort((a, b) => b.favorites - a.favorites);
  if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  return copy;
}

/* ---------------------------------------------------------
   3. 작은 컴포넌트
   --------------------------------------------------------- */
function Icon({ name, size = 24, alt = "" }) {
  return <img src={`images/icons/${name}.svg`} width={size} height={size} alt={alt} />;
}

function Thumb({ store, size = 64 }) {
  if (store.photo) {
    return (
      <div className="thumb" style={{ width: size, height: size }}>
        <img className="photo" src={store.photo} alt="" />
      </div>
    );
  }
  const icon = store.category === "술집" ? "beer" : "utensils";
  return (
    <div className={`thumb cat-${store.category}`} style={{ width: size, height: size }}>
      <Icon name={icon} size={Math.round(size * 0.4375)} />
    </div>
  );
}

function BookmarkButton({ on, onToggle, name, size = 24, variant = "list" }) {
  const icon = on ? (variant === "detail" ? "bookmark-detail" : "bookmark-on") : "bookmark";
  // 담는 순간에만 튀어요: 처음 그릴 때 이미 담긴 북마크는 움직이지 않게
  const prev = useRef(on);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (on && !prev.current) setBump(true);
    prev.current = on;
  }, [on]);
  return (
    <button
      className={`bm-btn ${bump ? "is-bump" : ""}`}
      onAnimationEnd={() => setBump(false)}
      aria-pressed={on}
      aria-label={on ? `${name} 즐겨찾기에서 빼기` : `${name} 즐겨찾기에 담기`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

function StoreRow({ store, base, isFav, favCount, onToggleFav, onOpen, q = null }) {
  return (
    <div
      className="store-row"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(store.id)}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(store.id) : null)}
    >
      <Thumb store={store} />
      <div className="info">
        <div className="name-line">
          <strong>
            <Hl text={store.name} q={q} />
          </strong>
          {store.pickOne && <span className="badge-pick">택 1</span>}
          <span className="meta">{formatDistance(distanceOf(store, base))}</span>
        </div>
        {store.benefits.map((b) => (
          <div className="benefit-line" key={b.title}>
            <span>
              <Hl text={b.title} q={q} />
            </span>
            {b.tag && (
              <span className="tag">
                <Hl text={b.tag} q={q} />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="save">
        <BookmarkButton on={isFav} onToggle={onToggleFav} name={store.name} />
        <span className="meta">{favCount}</span>
      </div>
    </div>
  );
}

function SortButton({ sort, onClick, btnRef }) {
  return (
    <button className="sort-btn" onClick={onClick} ref={btnRef} aria-haspopup="menu">
      <Icon name="arrow-up-down" size={16} />
      {SORTS[sort].label}
      <Icon name="chevron-down" size={16} />
    </button>
  );
}

function SortBasis({ sort, base }) {
  return (
    <div className="sort-basis">
      <Icon name="map-pin" size={14} />
      {sort === "distance" ? `${BASES[base].label} 기준 · 가까운 순` : SORTS[sort].desc(base)}
    </div>
  );
}

/* ---------------------------------------------------------
   4. 화면
   --------------------------------------------------------- */
function TopUI({ cond, onOpenCondition, query, setQuery, category, setCategory }) {
  return (
    <div className="top-ui">
      <div className="logo-row">
        <img className="logo" src="images/logo.svg" alt="제휴모아" />
        <button className="cond-pill" onClick={onOpenCondition} aria-label={`조건 바꾸기: ${conditionLabel(cond)}`}>
          <Icon name="users" size={16} />
          {conditionLabel(cond)}
          <Icon name="chevron-down-blue" size={16} />
        </button>
      </div>
      <label className="search">
        <Icon name="search" size={20} />
        <span className="sr-only">가게 검색</span>
        <input
          type="search"
          value={query}
          placeholder="매장 이름이나 메뉴로 찾기"
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery("")} aria-label="검색어 지우기">
            <Icon name="x" size={16} />
          </button>
        )}
      </label>
      <div className="chips" role="tablist" aria-label="업종">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            className={`chip ${category === c ? "is-on" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListScreen(props) {
  const { searchQuery, stores, sort, base, onOpenSort, sortBtnRef, rowProps, cond, onResetFilters, category } = props;
  const listKey = `${sort}-${base}-${category}-${conditionLabel(cond)}`;
  return (
    <div className="screen">
      <TopUI {...props} />
      <div className="list-head">
        <h1 className="list-title">
          제휴 가게 <em>{stores.length}곳</em>
        </h1>
        <SortButton sort={sort} onClick={onOpenSort} btnRef={sortBtnRef} />
      </div>
      <SortBasis sort={sort} base={base} />
      {stores.length === 0 ? (
        <div className="empty">
          <div className="empty-icon gray">
            <Icon name="search" size={28} />
          </div>
          <h2>조건에 맞는 제휴 가게가 없어요</h2>
          <p>{conditionLabel(cond)} 조건에서 검색어나 업종을 바꿔 보세요</p>
          <button className="btn-primary" onClick={onResetFilters}>
            전체 가게 보기
          </button>
        </div>
      ) : (
        <div className="store-list" key={listKey}>
          {stores.map((s) => (
            <StoreRow key={s.id} store={s} base={base} q={searchQuery} {...rowProps(s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoritesScreen({ stores, sort, base, cond, onOpenSort, sortBtnRef, rowProps, goList }) {
  const listKey = `${sort}-${base}`;
  return (
    <div className="screen">
      <div className="page-head">
        <div className="row">
          <h1>
            즐겨찾기 {stores.length > 0 && <em>{stores.length}곳</em>}
          </h1>
          {stores.length > 0 && <SortButton sort={sort} onClick={onOpenSort} btnRef={sortBtnRef} />}
        </div>
        <p>{conditionLabel(cond)} 조건에 맞는 혜택으로 보여요</p>
      </div>
      {stores.length === 0 ? (
        <div className="empty" style={{ paddingTop: 120 }}>
          <div className="empty-icon">
            <img src="images/icons/bookmark-empty.svg" width="32.16" height="32.16" alt="" />
          </div>
          <h2>아직 즐겨찾기한 가게가 없어요</h2>
          <p>목록에서 북마크를 누르면 여기에 모여요</p>
          <button className="btn-primary" onClick={goList}>
            제휴 가게 둘러보기
          </button>
        </div>
      ) : (
        <div className="store-list" key={listKey}>
          {stores.map((s) => (
            <StoreRow key={s.id} store={s} base={base} {...rowProps(s)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- 지도보기 (실제 지도) ----------
   Leaflet + OpenStreetMap 데이터(CARTO 밝은 지도 타일) 위에 목록과 같은 조건의 가게를
   Figma '지도 썸네일 핀'으로 보여 줘요. 가까운 핀은 묶어서 숫자로, 핀을 누르면 아래 카드.
   다른 지도(카카오맵 등)로 바꿀 때는 MAP_TILES와 이 컴포넌트만 바꾸면 돼요. */
const MAP_TILES = {
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19,
};
const MAP_START_ZOOM = 17;
const CLUSTER_PX = 44; // 화면에서 이 거리보다 가까운 핀은 하나로 묶어요

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function pinHtml(store, count, on) {
  const size = on ? 48 : 38;
  const inner = store.photo
    ? `<img class="photo" src="${store.photo}" alt="" />`
    : `<img src="images/icons/${store.category === "술집" ? "beer" : "utensils"}.svg" width="${Math.round(size * 0.44)}" height="${Math.round(size * 0.44)}" alt="" />`;
  return `<div class="pin ${on ? "is-on" : ""}">
    <span class="pin-frame"><span class="thumb ${store.photo ? "" : "cat-" + store.category}" style="width:${size}px;height:${size}px">${inner}</span></span>
    <img class="pin-tail" src="images/map/${on ? "tail-selected" : "tail"}.svg" width="12" height="7" alt="" />
    ${count > 1 ? `<span class="pin-count">${count}</span>` : ""}
    ${on ? `<span class="pin-name">${escapeHtml(count > 1 ? `${store.name} 외 ${count - 1}곳` : store.name)}</span>` : ""}
  </div>`;
}

/** 지금 확대 수준에서 화면상 가까운 가게끼리 묶기 (목록 순서의 첫 가게가 대표) */
function clusterOnMap(map, stores) {
  const groups = [];
  stores.forEach((s) => {
    const pt = map.latLngToLayerPoint([s.lat, s.lng]);
    const g = groups.find((gr) => gr.pt.distanceTo(pt) < CLUSTER_PX);
    if (g) g.stores.push(s);
    else groups.push({ pt, stores: [s] });
  });
  return groups;
}

function MapScreen(props) {
  const { stores, base, rowProps, searchQuery, myPos } = props;
  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const [zoom, setZoom] = useState(MAP_START_ZOOM);
  const [selected, setSelected] = useState(null); // 묶음 대표 가게 id
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false); // 지도가 만들어진 뒤에 핀을 그려요

  // 지도 만들기 (탭에 들어올 때 한 번)
  useEffect(() => {
    if (!window.L) {
      setFailed(true);
      return;
    }
    const start = basePoint(base);
    const map = L.map(boxRef.current, { zoomControl: false, attributionControl: true }).setView([start.lat, start.lng], MAP_START_ZOOM);
    L.tileLayer(MAP_TILES.url, { attribution: MAP_TILES.attribution, maxZoom: MAP_TILES.maxZoom, subdomains: "abcd" }).addTo(map);
    map.attributionControl.setPrefix(false);
    layerRef.current = L.layerGroup().addTo(map);
    map.on("zoomend", () => setZoom(map.getZoom()));
    map.on("click", () => setSelected(null));
    mapRef.current = map;
    setReady(true);
    // 탭 전환 직후 크기가 0일 수 있어 한 번 더 맞춰요
    const t = setTimeout(() => map.invalidateSize(), 0);
    return () => {
      clearTimeout(t);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const groups = useMemo(() => (mapRef.current ? clusterOnMap(mapRef.current, stores) : []), [stores, zoom, ready]);
  const selGroup = groups.find((g) => g.stores[0].id === selected) || null;

  useEffect(() => {
    if (selected && !selGroup) setSelected(null);
  }, [groups]);

  // 핀 · 기준점 그리기
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    const gate = BASES.gate;
    L.marker([gate.lat, gate.lng], {
      interactive: false,
      icon: L.divIcon({ className: "map-gate-icon", html: `<span class="map-gate"><img src="images/map/dot.svg" width="8" height="8" alt="" />ERICA 정문</span>`, iconSize: null }),
    }).addTo(layer);

    if (myPos) {
      L.marker([myPos.lat, myPos.lng], {
        interactive: false,
        icon: L.divIcon({ className: "map-me-icon", html: `<span class="map-me" aria-label="내 위치"></span>`, iconSize: [18, 18] }),
      }).addTo(layer);
    }

    groups.forEach((g) => {
      const s = g.stores[0];
      const on = selected === s.id;
      const center = g.stores.length > 1 ? averagePoint(g.stores) : s;
      const marker = L.marker([center.lat, center.lng], {
        zIndexOffset: on ? 1000 : 0,
        keyboard: true,
        title: g.stores.length > 1 ? `${s.name} 외 ${g.stores.length - 1}곳` : s.name,
        icon: L.divIcon({ className: "pin-icon", html: pinHtml(s, g.stores.length, on), iconSize: [0, 0] }),
      });
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setSelected(s.id);
      });
      marker.addTo(layer);
    });
  }, [groups, selected, myPos]);

  const goTo = (pt) => mapRef.current && mapRef.current.flyTo([pt.lat, pt.lng], Math.max(zoom, MAP_START_ZOOM), { duration: 0.5 });
  const home = basePoint(base);

  return (
    <div className="screen map-screen">
      <TopUI {...props} />
      <div className="map-view">
        <div className="map-box" ref={boxRef} />

        {failed && <div className="map-empty">지도를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.</div>}

        <div className="map-guide">
          이 근처 제휴 가게 <b>{stores.length}곳</b>
        </div>

        <button
          className="map-locate"
          style={{ bottom: selGroup ? 122 : 16 }}
          aria-label={`${base === "me" && myPos ? "내 위치" : BASES[base === "me" ? "gate" : base].label}로 이동`}
          onClick={() => goTo(home)}
        >
          <Icon name="locate" size={24} />
        </button>

        {selGroup && (
          <div key={selected} className="map-cards">
            {selGroup.stores.map((s) => (
              <div className="map-card" key={s.id}>
                <StoreRow store={s} base={base} q={searchQuery} {...rowProps(s)} />
              </div>
            ))}
          </div>
        )}

        {stores.length === 0 && <div className="map-empty">조건에 맞는 제휴 가게가 없어요</div>}
      </div>
    </div>
  );
}

function averagePoint(list) {
  return {
    lat: list.reduce((a, s) => a + s.lat, 0) / list.length,
    lng: list.reduce((a, s) => a + s.lng, 0) / list.length,
  };
}

function MyScreen({ cond, favCount, recentCount, sort, base, settings, setSettings, onOpenCondition, onOpenSortSetting, onOpenBase, goFavorites, showToast }) {
  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });
  return (
    <div className="screen">
      <div className="my">
        <div className="my-top">
          <h1>마이 페이지</h1>
          <div className="cond-card">
            <img src="images/logo.svg" width="44" height="44" alt="" />
            <div className="txt">
              <b>ERICA 학생</b>
              <small>내 조건 · {conditionLabel(cond)}</small>
            </div>
            <button onClick={onOpenCondition}>바꾸기</button>
          </div>
          <div className="summary">
            <button onClick={goFavorites}>
              <small>즐겨찾기</small>
              <b>{favCount}곳</b>
            </button>
            <button onClick={() => showToast("최근 본 가게 목록은 다음 단계에서 열 수 있어요")}>
              <small>최근 본 가게</small>
              <b>{recentCount}곳</b>
            </button>
          </div>
        </div>

        <section className="group">
          <h2>목록 보기</h2>
          <button className="set-row" onClick={onOpenSortSetting}>
            <span>기본 정렬</span>
            <span className="val">{SORTS[sort].label}</span>
            <Icon name="chevron-right" size={18} />
          </button>
          <button className="set-row" onClick={onOpenBase}>
            <span>거리 기준</span>
            <span className="val">{BASES[base].label}</span>
            <Icon name="chevron-right" size={18} />
          </button>
        </section>

        <section className="group">
          <h2>알림</h2>
          <button className="set-row" role="switch" aria-checked={settings.newDeal} onClick={() => toggle("newDeal")}>
            <span>새 제휴 알림</span>
            <span className={`toggle ${settings.newDeal ? "is-on" : ""}`} />
          </button>
          <button className="set-row" role="switch" aria-checked={settings.favChange} onClick={() => toggle("favChange")}>
            <span>즐겨찾기 가게 혜택이 바뀌면 알림</span>
            <span className={`toggle ${settings.favChange ? "is-on" : ""}`} />
          </button>
        </section>

        <section className="group">
          <h2>도움</h2>
          <button className="set-row" onClick={() => showToast("제보 양식은 준비 중이에요")}>
            <span>제휴 정보 제보하기</span>
            <Icon name="chevron-right" size={18} />
          </button>
          <button className="set-row" onClick={() => showToast("공지 · 이용 안내는 준비 중이에요")}>
            <span>공지 · 이용 안내</span>
            <Icon name="chevron-right" size={18} />
          </button>
          <button className="set-row" onClick={() => showToast("제휴모아 프로토타입 v1.0.0")}>
            <span>앱 정보</span>
            <span className="val">v1.0.0</span>
            <Icon name="chevron-right" size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}

function DetailScreen({ store, cond, isFav, onToggleFav, onClose, showToast }) {
  const state = openState(store.hours);
  const people = cond.people;
  const providerCollege = store.providerCollege;

  const share = async () => {
    const text = `${store.name} · ${store.benefits.map((b) => b.title).join(", ")}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "제휴모아", text });
      } else {
        await navigator.clipboard.writeText(text);
        showToast("제휴 정보를 복사했어요");
      }
    } catch (e) {
      /* 공유를 취소한 경우 */
    }
  };

  const mapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(store.name)},${store.lat},${store.lng}`;

  return (
    <div className="detail" role="dialog" aria-label={`${store.name} 상세`}>
      <div className="hero">
        {store.hero || store.photo ? (
          <img src={store.hero || store.photo} alt={`${store.name} 대표 사진`} />
        ) : (
          <div className={`thumb cat-${store.category}`} style={{ width: "100%", height: "100%", borderRadius: 0 }}>
            <Icon name={store.category === "술집" ? "beer" : "utensils"} size={96} />
          </div>
        )}
        <button className="float-btn" style={{ left: 16 }} onClick={onClose} aria-label="뒤로">
          <Icon name="chevron-left" size={20} />
        </button>
        <button className="float-btn" style={{ right: 16 }} onClick={share} aria-label="공유">
          <Icon name="share" size={20} />
        </button>
      </div>

      <div className="detail-body">
        <div className="detail-name">
          <p className="sub">
            {store.category} · {store.provider} 제휴
          </p>
          <div className="row">
            <h1>{store.name}</h1>
            <BookmarkButton on={isFav} onToggle={onToggleFav} name={store.name} variant="detail" />
          </div>
          <p className={`open-state ${state.isOpen ? "" : "closed"}`}>
            <Icon name="clock" size={16} />
            <b>{state.isOpen ? "영업 중" : "영업 전"}</b>· {state.text}
          </p>
        </div>

        <div className="quick">
          <button onClick={() => showToast("전화번호는 실제 데이터 연결 후 보여 드려요")}>
            <Icon name="phone" size={20} />
            전화
          </button>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="map-pin-20" size={20} />
            길찾기
          </a>
        </div>

        <section className="benefits">
          <h2 className="section-title">
            받을 수 있는 혜택
            {store.pickOne && <span className="badge-pick">택 1</span>}
            {store.pickOne && <small>{store.benefits.length === 2 ? "둘 중 하나만" : "하나만 골라요"}</small>}
          </h2>
          {store.benefits.map((b, i) => {
            const locked = b.minPeople && people < b.minPeople;
            return (
              <React.Fragment key={b.title}>
                {i > 0 && store.pickOne && <div className="or">또는</div>}
                <article className={`benefit-card ${locked ? "is-locked" : ""}`}>
                  <div className="ic">
                    <Icon name="ticket" size={22} />
                  </div>
                  <div className="body">
                    <h3>{b.fullTitle || b.title}</h3>
                    <ul>
                      {b.details.map((d) => (
                        <li key={d}>
                          <Icon name="check-14" size={14} />
                          {d}
                        </li>
                      ))}
                    </ul>
                    {locked && (
                      <p className="lock-note">
                        지금 조건({people}명)에서는 받을 수 없어요 · {b.minPeople}명부터
                      </p>
                    )}
                  </div>
                </article>
              </React.Fragment>
            );
          })}
        </section>

        <section className="howto">
          <h2>받는 법</h2>
          <ol>
            <li>
              <i>1</i>주문할 때 학생증을 보여 주세요
            </li>
            {providerCollege && (
              <li style={{ marginTop: 12 }}>
                <i>2</i>같이 간 사람이 모두 {providerCollege} 학생이어야 해요
              </li>
            )}
          </ol>
        </section>

        <section>
          <h2 className="section-title" style={{ marginBottom: 12 }}>
            가게 · 제휴 정보
          </h2>
          <dl className="info-table">
            <div>
              <dt>영업</dt>
              <dd>
                매일 {hourText(store.hours.open)} ~ {hourText(store.hours.close)} (예시)
              </dd>
            </div>
            <div>
              <dt>기간</dt>
              <dd>{store.period || "2026.09.01 ~ 12.31 (예시)"}</dd>
            </div>
            <div>
              <dt>제공</dt>
              <dd>{store.provider}</dd>
            </div>
            <div>
              <dt>출처</dt>
              <dd>
                {store.source ? (
                  <a href={store.source} target="_blank" rel="noopener noreferrer">
                    인스타그램 공지 보기
                    <img src="images/icons/external-link.svg" width="14" height="14" alt="" />
                  </a>
                ) : (
                  <span style={{ color: "var(--text-3)" }}>목 데이터 · 출처 없음</span>
                )}
              </dd>
            </div>
            <div>
              <dt>위치</dt>
              <dd>
                {store.coordVerified ? "확인된 위치" : <span style={{ color: "var(--text-3)" }}>대략적인 위치 (확인 전)</span>}
              </dd>
            </div>
            <div>
              <dt>확인</dt>
              <dd>{store.checkedAt || "-"}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   5. 모달 · 메뉴
   --------------------------------------------------------- */
function SortMenu({ sort, base, anchor, onPick, onOpenBase, onClose }) {
  return (
    <>
      <div className="dim" onClick={onClose} />
      <div className="popover" role="menu" style={{ top: anchor.top, right: anchor.right }}>
        {Object.keys(SORTS).map((key) => (
          <button
            key={key}
            role="menuitemradio"
            aria-checked={sort === key}
            className={`opt ${sort === key ? "is-on" : ""}`}
            onClick={() => onPick(key)}
          >
            <span>
              <b>{SORTS[key].label}</b>
              <small>{SORTS[key].desc(base)}</small>
            </span>
            {sort === key && <Icon name="check" size={24} />}
          </button>
        ))}
        <hr />
        <button className="basis" onClick={onOpenBase}>
          <span>거리 기준</span>
          <span>{BASES[base].label}</span>
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </>
  );
}

function BaseModal({ base, onApply, onClose }) {
  const [pick, setPick] = useState(base);
  return (
    <>
      <div className="dim" onClick={onClose} />
      <div className="modal-wrap">
        <div className="modal compact" role="dialog" aria-modal="true" aria-labelledby="base-title">
          <div className="modal-head">
            <h2 id="base-title">거리 기준</h2>
            <button className="icon-btn" onClick={onClose} aria-label="닫기">
              <Icon name="x" size={18} />
            </button>
          </div>
          <p className="modal-desc">어디서부터 가까운 순으로 정렬할까요?</p>
          <div className="radio-list" role="radiogroup">
            {Object.keys(BASES).map((key) => (
              <button
                key={key}
                role="radio"
                aria-checked={pick === key}
                className={`radio-card ${pick === key ? "is-on" : ""}`}
                onClick={() => setPick(key)}
              >
                <Icon name={pick === key ? "radio-on" : "radio-off"} size={20} />
                <span>
                  <b>{BASES[key].label}</b>
                  <small>{BASES[key].desc}</small>
                </span>
              </button>
            ))}
          </div>
          <p className="note">
            <Icon name="info" size={16} />
            인기순은 최근 30일 즐겨찾기 수, 가나다순은 가게 이름으로 정해요.
          </p>
          <button className="btn-primary" onClick={() => onApply(pick)}>
            이 기준으로 정렬
          </button>
        </div>
      </div>
    </>
  );
}

function ConditionModal({ cond, onApply, onClose }) {
  const [draft, setDraft] = useState(cond);
  const [page, setPage] = useState("main"); // main | college | add
  const [pickCollege, setPickCollege] = useState(cond.myCollege);

  const peopleOptions = [1, 2, 3, 4, 5];
  const mixTotal = Object.values(draft.mix).reduce((a, b) => a + b, 0);
  const needsMix = draft.people > 1 && !draft.sameCollege;
  const balanced = !needsMix || mixTotal === draft.people;

  const setPeople = (n) => {
    if (draft.sameCollege || n === 1) {
      setDraft({ ...draft, people: n, mix: { [draft.myCollege]: draft.sameCollege ? n : Math.min(n, draft.mix[draft.myCollege] || 1) } });
      return;
    }
    const mix = { ...draft.mix };
    {
      // 인원을 줄이면 다른 단과대 인원부터 줄여요
      let over = Object.values(mix).reduce((a, b) => a + b, 0) - n;
      Object.keys(mix)
        .filter((c) => c !== draft.myCollege)
        .reverse()
        .forEach((c) => {
          while (over > 0 && mix[c] > 0) {
            mix[c] -= 1;
            over -= 1;
          }
        });
      if (over > 0) mix[draft.myCollege] = Math.max(1, mix[draft.myCollege] - over);
    }
    setDraft({ ...draft, people: n, mix: cleanMix(mix, draft.myCollege) });
  };

  const setSame = (same) => {
    const mix = same ? { [draft.myCollege]: draft.people } : draft.mix;
    setDraft({ ...draft, sameCollege: same, mix: same ? mix : startMix(draft) });
  };

  const step = (college, delta) => {
    const mix = { ...draft.mix, [college]: (draft.mix[college] || 0) + delta };
    setDraft({ ...draft, mix: cleanMix(mix, draft.myCollege) });
  };

  if (page === "college" || page === "add") {
    const isAdd = page === "add";
    return (
      <>
        <div className="dim" onClick={onClose} />
        <div className="modal-wrap">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="college-title" style={{ gap: 16 }}>
            <div className="modal-head">
              <h2 id="college-title">
                <button className="back-btn" onClick={() => setPage("main")} aria-label="뒤로">
                  <Icon name="chevron-left" size={24} />
                </button>
                {isAdd ? "단과대 추가" : "내 소속"}
              </h2>
              <button className="icon-btn" onClick={onClose} aria-label="닫기">
                <Icon name="x" size={18} />
              </button>
            </div>
            <p className="modal-desc">
              {isAdd ? "같이 가는 사람의 단과대를 골라 주세요." : "ERICA 단과대 10곳 중에서 골라 주세요."}
            </p>
            <div className="college-grid">
              {COLLEGES.map((c) => {
                const used = isAdd && draft.mix[c] > 0;
                return (
                  <button
                    key={c}
                    disabled={used}
                    className={`${c.length > 7 ? "long" : ""} ${pickCollege === c ? "is-on" : ""}`}
                    aria-pressed={pickCollege === c}
                    onClick={() => setPickCollege(c)}
                  >
                    {pickCollege === c && <Icon name="check-blue-16" size={16} />}
                    {c}
                  </button>
                );
              })}
            </div>
            <div style={{ height: 4 }} />
            <button
              className="btn-primary"
              disabled={isAdd && (!pickCollege || draft.mix[pickCollege] > 0)}
              onClick={() => {
                if (isAdd) {
                  step(pickCollege, 1);
                } else {
                  const mix = { ...draft.mix };
                  const mine = mix[draft.myCollege] || 1;
                  delete mix[draft.myCollege];
                  mix[pickCollege] = (mix[pickCollege] || 0) + mine;
                  setDraft({ ...draft, myCollege: pickCollege, mix: draft.sameCollege ? { [pickCollege]: draft.people } : mix });
                }
                setPage("main");
              }}
            >
              {isAdd ? "추가하기" : "선택 완료"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dim" onClick={onClose} />
      <div className="modal-wrap">
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cond-title">
          <div className="modal-head">
            <h2 id="cond-title">누구랑 가요?</h2>
            <button className="icon-btn" onClick={onClose} aria-label="닫기">
              <Icon name="x" size={18} />
            </button>
          </div>
          <p className="modal-desc">같이 가는 인원과 소속에 맞는 혜택만 보여 드려요.</p>

          <div className="field">
            <div className="field-label">나까지 몇 명</div>
            <div className="chips" role="radiogroup">
              {peopleOptions.map((n) => (
                <button
                  key={n}
                  role="radio"
                  aria-checked={draft.people === n}
                  className={`chip ${draft.people === n ? "is-on" : ""}`}
                  onClick={() => setPeople(n)}
                >
                  {n === 1 ? "혼자" : n === 5 ? "5명+" : `${n}명`}
                </button>
              ))}
            </div>
          </div>

          {draft.people > 1 && (
            <div className="field">
              <div className="field-label">모두 같은 단과대예요?</div>
              <div className="segment" role="radiogroup">
                <button role="radio" aria-checked={draft.sameCollege} className={draft.sameCollege ? "is-on" : ""} onClick={() => setSame(true)}>
                  네
                </button>
                <button role="radio" aria-checked={!draft.sameCollege} className={!draft.sameCollege ? "is-on" : ""} onClick={() => setSame(false)}>
                  아니요
                </button>
              </div>
            </div>
          )}

          {needsMix ? (
            <>
              <div className="field">
                <div className="field-label">
                  단과대별 인원
                  <span className="count-blue">
                    {mixTotal} / {draft.people}명
                  </span>
                </div>
                <div className="college-list">
                  {Object.keys(draft.mix).map((c) => {
                    const isMe = c === draft.myCollege;
                    const n = draft.mix[c];
                    return (
                      <div className="college-row" key={c}>
                        <span>{c}</span>
                        {isMe && <span className="me-badge">나</span>}
                        <span className="spacer" />
                        <div className="stepper">
                          <button onClick={() => step(c, -1)} disabled={isMe && n <= 1} aria-label={`${c} 한 명 빼기`}>
                            <Icon name="minus" size={16} />
                          </button>
                          <output aria-live="polite" key={n} className="bump">{n}</output>
                          <button className="plus" onClick={() => step(c, 1)} disabled={mixTotal >= draft.people} aria-label={`${c} 한 명 더하기`}>
                            <Icon name="plus" size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="add-college"
                    onClick={() => {
                      setPickCollege(null);
                      setPage("add");
                    }}
                    disabled={mixTotal >= draft.people}
                    style={mixTotal >= draft.people ? { opacity: 0.4 } : null}
                  >
                    <Icon name="plus" size={16} />
                    단과대 추가
                  </button>
                </div>
              </div>
              <p className={`status-line ${balanced ? "ok" : ""}`}>
                {balanced ? <Icon name="check-green" size={16} /> : <Icon name="info" size={16} />}
                {balanced ? `${draft.people}명 모두 나눴어요` : `${draft.people - mixTotal}명을 더 나눠 주세요`}
              </p>
            </>
          ) : (
            <div className="field">
              <div className="field-label">내 소속</div>
              <button
                className="select-row"
                onClick={() => {
                  setPickCollege(draft.myCollege);
                  setPage("college");
                }}
              >
                <strong>{draft.myCollege}</strong>
                <span className="link-blue">바꾸기</span>
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
          )}

          <button className="btn-primary" disabled={!balanced} onClick={() => onApply(draft)}>
            이 조건으로 보기
          </button>
        </div>
      </div>
    </>
  );
}

function cleanMix(mix, myCollege) {
  const out = {};
  out[myCollege] = Math.max(1, mix[myCollege] || 1);
  Object.keys(mix).forEach((c) => {
    if (c !== myCollege && mix[c] > 0) out[c] = mix[c];
  });
  return out;
}

function startMix(cond) {
  const others = Object.keys(cond.mix).filter((c) => c !== cond.myCollege);
  if (others.length) return cleanMix(cond.mix, cond.myCollege);
  return { [cond.myCollege]: cond.people };
}

function Toast({ toast, onAction }) {
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite" key={toast.id}>
      <span>{toast.message}</span>
      {toast.action && <button onClick={onAction}>{toast.action}</button>}
    </div>
  );
}

function TabBar({ tab, setTab }) {
  const tabs = [
    { key: "list", label: "목록", on: "list-on", off: "list-off" },
    { key: "map", label: "지도보기", on: "map-on", off: "map-off" },
    { key: "favorites", label: "즐겨찾기", on: "bookmark-tab-on", off: "bookmark" },
    { key: "my", label: "마이 페이지", on: "user-on", off: "user-off" },
  ];
  return (
    <nav className="tabbar" aria-label="하단 탭">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${tab === t.key ? "is-on" : ""}`}
          aria-current={tab === t.key ? "page" : undefined}
          onClick={() => setTab(t.key)}
        >
          <Icon name={tab === t.key ? t.on : t.off} size={24} />
          {t.label}
        </button>
      ))}
    </nav>
  );
}

/* ---------------------------------------------------------
   6. 스플래시 · 로고 그리기 (흰 배경, 파랑 단색)
   티켓 윤곽선이 한 붓으로 그려지고 → 파랑으로 채워지고 →
   흰 면 · H · Y가 드러나며 제휴모아 로고로 완성돼요. 약 1.3초, 누르면 바로 넘어가요.
   (images/logo.svg와 같은 로고를 조각별로 움직이려고 경로를 나눠 둔 것)
   --------------------------------------------------------- */
const SPLASH_MS = 1300;
const SPLASH_EXIT_MS = 240;

const LOGO_PARTS = {
  ticket:
    "M45 0H82C82 4.7739 83.8964 9.35227 87.2721 12.7279C90.6477 16.1036 95.2261 18 100 18C104.774 18 109.352 16.1036 112.728 12.7279C116.104 9.35227 118 4.7739 118 0H155C166.935 0 178.381 4.74106 186.82 13.1802C195.259 21.6193 200 33.0653 200 45V155C200 166.935 195.259 178.381 186.82 186.82C178.381 195.259 166.935 200 155 200H118C118 195.226 116.104 190.648 112.728 187.272C109.352 183.896 104.774 182 100 182C95.2261 182 90.6477 183.896 87.2721 187.272C83.8964 190.648 82 195.226 82 200H45C33.0653 200 21.6193 195.259 13.1802 186.82C4.74106 178.381 0 166.935 0 155L0 45C0 33.0653 4.74106 21.6193 13.1802 13.1802C21.6193 4.74106 33.0653 0 45 0Z",
  face:
    "M100 28C105.669 27.9999 111.204 26.2791 115.874 23.065C120.544 19.851 124.128 15.2951 126.153 10H155C164.283 10 173.185 13.6875 179.749 20.2513C186.313 26.815 190 35.7174 190 45V155C190 164.283 186.313 173.185 179.749 179.749C173.185 186.312 164.283 190 155 190H126.153C124.128 184.705 120.544 180.149 115.874 176.935C111.204 173.721 105.669 172 100 172V28Z",
  h: "M37.75 66V93.75H62.25V66H74.75V134H62.25V106.25H37.75V134H25.25V66H37.75Z",
  y: "M169.456 69.0488L151.25 101.628V134H138.75V101.628L120.544 69.0488L131.456 62.9512L145 87.1875L158.544 62.9512L169.456 69.0488Z",
};

function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const reduce = useMemo(() => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    const total = reduce ? 500 : SPLASH_MS;
    const t1 = setTimeout(() => setLeaving(true), total);
    const t2 = setTimeout(onDone, total + SPLASH_EXIT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const skip = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDone, SPLASH_EXIT_MS);
  };

  return (
    <div className={`splash ${leaving ? "is-leaving" : ""} ${reduce ? "is-reduced" : ""}`} onClick={skip} role="presentation">
      <svg className="splash-logo" width="88" height="88" viewBox="-4 -4 208 208" aria-hidden="true">
        <path className="fill" d={LOGO_PARTS.ticket} fill="#2563EB" />
        <path className="outline" d={LOGO_PARTS.ticket} pathLength="1" fill="none" stroke="#2563EB" strokeWidth="5" strokeLinejoin="round" />
        <path className="face" d={LOGO_PARTS.face} fill="#fff" />
        <path className="h" d={LOGO_PARTS.h} fill="#fff" />
        <path className="y" d={LOGO_PARTS.y} fill="#2563EB" />
      </svg>
      <h1 className="splash-name">제휴모아</h1>
      <span className="sr-only">제휴모아를 불러오는 중</span>
    </div>
  );
}

/* ---------------------------------------------------------
   7. App
   --------------------------------------------------------- */
const DEFAULT_COND = { myCollege: "공학대학", people: 2, sameCollege: true, mix: { 공학대학: 2 } };

function App() {
  const [tab, setTab] = useState("list");
  const [cond, setCond] = usePersistentState("cond", DEFAULT_COND);
  const [sort, setSort] = usePersistentState("sort", "distance");
  const [base, setBase] = usePersistentState("base", "gate");
  const [favorites, setFavorites] = usePersistentState("favorites", INITIAL_FAVORITES);
  const [settings, setSettings] = usePersistentState("settings", { newDeal: true, favChange: true });
  const [recent, setRecent] = usePersistentState("recent", []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [detailId, setDetailId] = useState(null);
  const [overlay, setOverlay] = useState(null); // sort | base | condition
  const [sortAnchor, setSortAnchor] = useState({ top: 0, right: 16 });
  const [toast, setToast] = useState(null);
  const [splash, setSplash] = useState(true);
  const [myPos, setMyPos] = useState(null);

  const requestMyPos = (onOk, onFail) => {
    if (!navigator.geolocation) return onFail("이 브라우저는 위치를 지원하지 않아요");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        MY_POS = { lat: p.coords.latitude, lng: p.coords.longitude };
        setMyPos(MY_POS);
        onOk();
      },
      (err) => onFail(err.code === 1 ? "위치 권한이 없어 정문 기준으로 보여 드려요" : "위치를 찾지 못해 정문 기준으로 보여 드려요"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };
  const appRef = useRef(null);
  const sortBtnRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (message, action, onAction) => {
    clearTimeout(toastTimer.current);
    setToast({ message, action, onAction, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFav = (store) => {
    if (favSet.has(store.id)) {
      setFavorites(favorites.filter((id) => id !== store.id));
      showToast(`${store.name}을(를) 즐겨찾기에서 뺐어요`);
    } else {
      setFavorites([...favorites, store.id]);
      showToast(`${store.name}을(를) 즐겨찾기에 담았어요`, "보기", () => {
        setDetailId(null);
        setTab("favorites");
      });
    }
  };

  const favCount = (store) => {
    const wasFav = INITIAL_FAVORITES.includes(store.id);
    const isFav = favSet.has(store.id);
    return store.favorites + (isFav && !wasFav ? 1 : 0) - (!isFav && wasFav ? 1 : 0);
  };

  const openDetail = (id) => {
    setDetailId(id);
    setRecent([id, ...recent.filter((r) => r !== id)].slice(0, 20));
  };

  const searchQuery = useMemo(() => makeQuery(query), [query]);

  const visible = useMemo(() => {
    return STORES.filter((s) => isEligible(s, cond))
      .filter((s) => category === "전체" || s.category === category)
      .filter((s) => searchRank(s, searchQuery) > 0);
  }, [cond, category, searchQuery]);

  // 고른 정렬은 유지하되, 검색 중에는 이름이 맞는 가게를 혜택만 맞는 가게보다 먼저
  const listStores = useMemo(() => {
    const sorted = sortStores(visible, sort, base);
    if (!searchQuery) return sorted;
    return sorted
      .map((s, i) => ({ s, i, r: searchRank(s, searchQuery) }))
      .sort((a, b) => b.r - a.r || a.i - b.i)
      .map((x) => x.s);
  }, [visible, sort, base, searchQuery, myPos]);
  const favStores = useMemo(
    () => sortStores(STORES.filter((s) => favSet.has(s.id) && isEligible(s, cond)), sort, base),
    [favSet, cond, sort, base, myPos]
  );

  const openSort = () => {
    const btn = sortBtnRef.current;
    const app = appRef.current;
    if (btn && app) {
      const b = btn.getBoundingClientRect();
      const a = app.getBoundingClientRect();
      setSortAnchor({ top: b.bottom - a.top + 6, right: a.right - b.right });
    }
    setOverlay("sort");
  };

  const rowProps = (s) => ({
    isFav: favSet.has(s.id),
    favCount: favCount(s),
    onToggleFav: () => toggleFav(s),
    onOpen: openDetail,
  });

  const detailStore = STORES.find((s) => s.id === detailId);

  useEffect(() => {
    if (base === "me") requestMyPos(() => {}, () => setBase("gate"));
  }, []);

  // ESC로 맨 위 레이어 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (overlay) setOverlay(null);
      else if (detailId) setDetailId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay, detailId]);

  const shared = {
    cond,
    sort,
    base,
    sortBtnRef,
    rowProps,
    onOpenSort: openSort,
    onOpenCondition: () => setOverlay("condition"),
  };

  return (
    <div className="app" ref={appRef}>
      {tab === "list" && (
        <ListScreen
          {...shared}
          stores={listStores}
          searchQuery={searchQuery}
          myPos={myPos}
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          onResetFilters={() => {
            setQuery("");
            setCategory("전체");
          }}
        />
      )}
      {tab === "map" && (
        <MapScreen
          {...shared}
          stores={listStores}
          searchQuery={searchQuery}
          myPos={myPos}
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
        />
      )}
      {tab === "favorites" && <FavoritesScreen {...shared} stores={favStores} goList={() => setTab("list")} />}
      {tab === "my" && (
        <MyScreen
          cond={cond}
          sort={sort}
          base={base}
          favCount={favorites.length}
          recentCount={recent.length}
          settings={settings}
          setSettings={setSettings}
          onOpenCondition={() => setOverlay("condition")}
          onOpenSortSetting={() => {
            setSortAnchor({ top: 280, right: 16 });
            setOverlay("sort");
          }}
          onOpenBase={() => setOverlay("base")}
          goFavorites={() => setTab("favorites")}
          showToast={showToast}
        />
      )}

      <TabBar
        tab={tab}
        setTab={(t) => {
          setDetailId(null);
          setTab(t);
        }}
      />

      {detailStore && (
        <DetailScreen
          store={detailStore}
          cond={cond}
          isFav={favSet.has(detailStore.id)}
          onToggleFav={() => toggleFav(detailStore)}
          onClose={() => setDetailId(null)}
          showToast={showToast}
        />
      )}

      {overlay === "sort" && (
        <SortMenu
          sort={sort}
          base={base}
          anchor={sortAnchor}
          onPick={(k) => {
            setSort(k);
            setOverlay(null);
          }}
          onOpenBase={() => setOverlay("base")}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === "base" && (
        <BaseModal
          base={base}
          onClose={() => setOverlay(null)}
          onApply={(b) => {
            setOverlay(null);
            setSort("distance");
            if (b === "me") {
              requestMyPos(
                () => {
                  setBase("me");
                  showToast("지금 내 위치에서 가까운 순으로 보여 드려요");
                },
                (msg) => {
                  setBase("gate");
                  showToast(msg);
                }
              );
            } else {
              setBase(b);
            }
          }}
        />
      )}
      {overlay === "condition" && (
        <ConditionModal
          cond={cond}
          onClose={() => setOverlay(null)}
          onApply={(c) => {
            setCond(c);
            setOverlay(null);
            showToast(`${conditionLabel(c)} 조건으로 보여 드려요`);
          }}
        />
      )}

      <Toast
        toast={toast}
        onAction={() => {
          if (toast && toast.onAction) toast.onAction();
          setToast(null);
        }}
      />

      {splash && <Splash onDone={() => setSplash(false)} />}
    </div>
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
