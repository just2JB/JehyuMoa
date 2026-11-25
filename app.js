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
    map: { x: 154, y: 274 }, // 지도 바탕(375×812) 위 핀 끝 위치
    id: "isaac", name: "이삭토스트", category: "카페", photo: "images/stores/isaac.png",
    distance: { gate: 40, back: 520 }, favorites: 77, provider: STUDENT_COUNCIL,
    hours: { open: "08:00", close: "21:00" },
    benefits: [{ title: "음료 1,000원 할인", tag: "토스트·음료 함께", details: ["토스트와 음료를 함께 주문"] }],
  },
  {
    map: { x: 122, y: 388 },
    id: "oliva", name: "올리바샌드위치", category: "식당", photo: "images/stores/oliva.png",
    distance: { gate: 60, back: 480 }, favorites: 98, provider: STUDENT_COUNCIL,
    hours: { open: "09:00", close: "20:00" },
    benefits: [{ title: "탄산음료 1캔", tag: "8,000원 이상", details: ["8,000원 이상 주문"] }],
  },
  {
    map: { x: 129, y: 395 },
    id: "iseo", name: "이서식당", category: "식당", photo: null,
    distance: { gate: 90, back: 450 }, favorites: 64, provider: STUDENT_COUNCIL,
    hours: { open: "11:00", close: "21:00" },
    benefits: [
      { title: "음료 1캔", tag: "2명당 1캔", details: ["2명이 함께 오면 1캔"], minPeople: 2 },
      { title: "주류 1병", tag: "4명당", details: ["4명이 함께 오면 1병"], minPeople: 4 },
    ],
  },
  {
    map: { x: 252, y: 286 },
    id: "yuga", name: "유가네닭갈비", category: "식당", photo: "images/stores/yuga.png",
    distance: { gate: 130, back: 400 }, favorites: 121, provider: STUDENT_COUNCIL,
    hours: { open: "11:00", close: "22:00" },
    benefits: [{ title: "음료 1캔", tag: "고기 메뉴 주문 시", details: ["고기 메뉴 주문"] }],
  },
  {
    map: { x: 185, y: 420 },
    id: "yuknsha", name: "육앤샤", category: "술집", photo: "images/stores/yuknsha.png",
    distance: { gate: 180, back: 330 }, favorites: 187, provider: STUDENT_COUNCIL,
    hours: { open: "17:00", close: "02:00" },
    benefits: [
      { title: "소주 3,000원", tag: "오후 6시부터", details: ["오후 6시 이후 주문"] },
      { title: "육회비빔밥 1개", tag: "메뉴 4개 이상", details: ["메뉴 4개 이상 주문"] },
    ],
  },
  {
    map: { x: 244, y: 430 },
    id: "ilmi", name: "원조감자탕 일미집", category: "식당", photo: "images/stores/ilmi.png",
    hero: "images/stores/ilmi-hero.png",
    distance: { gate: 240, back: 300 }, favorites: 156, provider: "공학대학 학생회 아름",
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
    map: { x: 246, y: 294 },
    id: "circle", name: "동그라미(써클)", category: "술집", photo: null,
    distance: { gate: 300, back: 260 }, favorites: 109, provider: STUDENT_COUNCIL,
    hours: { open: "18:00", close: "03:00" },
    benefits: [
      { title: "음료수 1개", tag: "4명 이상", details: ["4명 이상 방문"], minPeople: 4 },
      { title: "5% 할인", tag: "현금/계좌이체", details: ["현금 또는 계좌이체로 결제"] },
    ],
  },
  {
    map: { x: 325, y: 420 },
    id: "rock", name: "락", category: "술집", photo: "images/stores/rock.png",
    distance: { gate: 350, back: 210 }, favorites: 212, provider: STUDENT_COUNCIL,
    hours: { open: "18:00", close: "04:00" },
    benefits: [{ title: "소주 무제한 4,000원", tag: "오후 9시까지", details: ["오후 9시 전 입장"] }],
  },
  {
    map: { x: 331, y: 413 },
    id: "manchwi", name: "만취", category: "술집", photo: "images/stores/manchwi.png",
    distance: { gate: 380, back: 190 }, favorites: 171, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "17:00", close: "03:00" },
    benefits: [
      { title: "주류 1병당 500원 할인", details: ["주류 주문 시 병마다 적용"] },
      { title: "5% 할인", tag: "현금/계좌이체", details: ["현금 또는 계좌이체로 결제"] },
    ],
  },
  {
    map: { x: 319, y: 427 },
    id: "daldal", name: "달달포차", category: "술집", photo: "images/stores/daldal.png",
    distance: { gate: 410, back: 170 }, favorites: 143, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "18:00", close: "04:00" },
    benefits: [
      { title: "10% 할인", tag: "현금/계좌이체", details: ["현금 또는 계좌이체로 결제"] },
      { title: "주류 1병 500원 할인", details: ["주류 주문 시 적용"] },
    ],
  },
  {
    map: { x: 211, y: 518 },
    id: "roadrock", name: "로드락비어", category: "술집", photo: "images/stores/roadrock.png",
    distance: { gate: 470, back: 120 }, favorites: 134, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "17:00", close: "02:00" },
    benefits: [
      { title: "음료 또는 주류 1병", tag: "탕 세트 주문 시", details: ["탕 세트 주문"] },
      { title: "주류 1병", tag: "20명 이상 · 테이블당", details: ["20명 이상 단체 방문", "테이블마다 1병"], minPeople: 20 },
    ],
  },
  {
    map: { x: 259, y: 293 },
    id: "ilmidak", name: "일미닭갈비파전", category: "식당", photo: "images/stores/ilmi-dakgalbi.png",
    distance: { gate: 520, back: 90 }, favorites: 88, provider: STUDENT_COUNCIL,
    hours: { open: "11:30", close: "23:00" },
    benefits: [{ title: "볶음밥 1인분 또는 사리", tag: "3인분 이상", details: ["닭갈비 3인분 이상 주문"] }],
  },
  {
    map: { x: 81, y: 323 },
    id: "jaika", name: "자이카 인도요리", category: "식당", photo: "images/stores/jaika.png",
    distance: { gate: 610, back: 140 }, favorites: 52, provider: STUDENT_COUNCIL, pickOne: true,
    hours: { open: "11:00", close: "21:30" },
    benefits: [
      { title: "음료 1개", tag: "테이블당", details: ["테이블마다 1개"] },
      { title: "믹스샐러드 1개", tag: "5명 이상", details: ["5명 이상 방문"], minPeople: 5 },
    ],
  },
  // 다른 단과대 학생회 제휴 예시 (소속 조건 필터 확인용)
  {
    map: { x: 292, y: 352 },
    id: "sw-chicken", name: "한입치킨", category: "술집", photo: null,
    distance: { gate: 280, back: 260 }, favorites: 61, provider: "소프트웨어융합대학 학생회",
    providerCollege: "소프트웨어융합대학",
    hours: { open: "16:00", close: "01:00" },
    benefits: [{ title: "감자튀김 1개", tag: "2명 이상", details: ["2명 이상 방문"], minPeople: 2 }],
  },
  {
    map: { x: 92, y: 470 },
    id: "design-snack", name: "청춘분식", category: "식당", photo: null,
    distance: { gate: 150, back: 410 }, favorites: 45, provider: "디자인대학 학생회",
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

const BASES = {
  gate: { label: "ERICA 정문", desc: "학교 정문에서 걸어서 잰 거리 · 기본" },
  back: { label: "ERICA 후문", desc: "후문 쪽 가게가 먼저 보여요" },
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

function distanceOf(store, base) {
  if (base === "me") return Math.round((store.distance.gate + store.distance.back) / 2);
  return store.distance[base];
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
   '이삭토스트'를 치는 도중의 '이사', '잇', 'ㅇ'도 찾아지도록 글자를 자모로 풀어서 비교해요.
   - 잇(ㅇㅣㅅ) ⊂ 이삭(ㅇㅣㅅㅏㄱ)  → 받침이 다음 글자 첫소리로 넘어가는 순간도 찾음
   - 겹받침·겹모음도 풀어서 비교 (닭 → ㄷㅏㄹㄱ, 과 → ㄱㅗㅏ)
   - 자음만 치면 초성 검색 (ㅇㅅㅌㅅㅌ → 이삭토스트)
   - 띄어쓰기 · 대소문자 무시 */
const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const SPLIT = {
  ㄳ: "ㄱㅅ", ㄵ: "ㄴㅈ", ㄶ: "ㄴㅎ", ㄺ: "ㄹㄱ", ㄻ: "ㄹㅁ", ㄼ: "ㄹㅂ", ㄽ: "ㄹㅅ", ㄾ: "ㄹㅌ", ㄿ: "ㄹㅍ", ㅀ: "ㄹㅎ", ㅄ: "ㅂㅅ",
  ㅘ: "ㅗㅏ", ㅙ: "ㅗㅐ", ㅚ: "ㅗㅣ", ㅝ: "ㅜㅓ", ㅞ: "ㅜㅔ", ㅟ: "ㅜㅣ", ㅢ: "ㅡㅣ",
};
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, "");
}

function toJamo(text) {
  let out = "";
  for (const ch of normalize(text)) {
    const code = ch.charCodeAt(0);
    if (code >= HANGUL_START && code <= HANGUL_END) {
      const i = code - HANGUL_START;
      const jong = JONG[i % 28];
      const jung = JUNG[Math.floor(i / 28) % 21];
      out += CHO[Math.floor(i / 588)] + (SPLIT[jung] || jung) + (SPLIT[jong] || jong);
    } else {
      out += SPLIT[ch] || ch;
    }
  }
  return out;
}

function toChosung(text) {
  let out = "";
  for (const ch of normalize(text)) {
    const code = ch.charCodeAt(0);
    out += code >= HANGUL_START && code <= HANGUL_END ? CHO[Math.floor((code - HANGUL_START) / 588)] : ch;
  }
  return out;
}

function makeQuery(raw) {
  const plain = normalize(raw);
  if (!plain) return null;
  const onlyConsonants = /^[ㄱ-ㅎ]+$/.test(plain);
  return { plain, jamo: toJamo(plain), chosung: onlyConsonants ? plain : null };
}

function textMatches(text, q) {
  if (normalize(text).includes(q.plain) || toJamo(text).includes(q.jamo)) return true;
  return q.chosung ? toChosung(text).includes(q.chosung) : false;
}

/** 검색어와 맞는 글자 범위들 [시작, 끝) — 자모로 맞은 위치를 원래 글자 위치로 되돌려요 */
function matchRanges(text, q) {
  if (!q) return [];
  const segs = []; // 글자별 [자모 시작, 자모 끝, 초성 시작, 초성 끝]
  let jamo = "";
  let cho = "";
  for (const ch of text) {
    const j = /\s/.test(ch) ? "" : toJamo(ch);
    const c = /\s/.test(ch) ? "" : toChosung(ch);
    segs.push([jamo.length, jamo.length + j.length, cho.length, cho.length + c.length]);
    jamo += j;
    cho += c;
  }
  const collect = (hay, needle, a, b) => {
    const out = [];
    let from = 0;
    while (needle) {
      const at = hay.indexOf(needle, from);
      if (at < 0) break;
      const end = at + needle.length;
      const chars = segs.map((sg, i) => (sg[a] < end && sg[b] > at ? i : -1)).filter((i) => i >= 0);
      if (chars.length) out.push([chars[0], chars[chars.length - 1] + 1]);
      from = end;
    }
    return out;
  };
  const ranges = collect(jamo, q.jamo, 0, 1);
  return ranges.length || !q.chosung ? ranges : collect(cho, q.chosung, 2, 3);
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
  if (textMatches(store.name, q)) {
    const starts = toJamo(store.name).startsWith(q.jamo) || (q.chosung && toChosung(store.name).startsWith(q.chosung));
    return starts ? 3 : 2;
  }
  const rest = [store.category, store.provider, ...store.benefits.map((b) => `${b.title} ${b.tag || ""}`)];
  return rest.some((t) => textMatches(t, q)) ? 1 : 0;
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

/* ---------- 지도보기 ----------
   Figma 일러스트 지도(375×812) 위에 목록과 같은 조건의 가게를 핀으로 보여 줘요.
   가까운 핀은 묶어서 숫자로, 핀을 누르면 아래 카드로 보여 줘요. */
const MAP_W = 375;
const MAP_H = 812;
const GATE = { x: 110, y: 455 };
const CLUSTER_PX = 26;

const MAP_LABELS = [
  { text: "한양대학교 ERICA", x: 30.7, y: 496, size: 12, weight: 700, color: "#4e7398" },
  { text: "약학대학", x: 86.6, y: 751.8, size: 8, color: "#7890a8" },
  { text: "에리카컨벤션", x: 168.5, y: 617.8, size: 8, color: "#7890a8" },
  { text: "제1공학관", x: 64.3, y: 658.4, size: 8, color: "#7890a8" },
  { text: "꿈동산어린이공원", x: 181.8, y: 284.1, size: 8, weight: 500, color: "#3e8650" },
  { text: "숲속마을아파트", x: 231, y: 174.8, size: 9, color: "#8a8378" },
  { text: "마로니에공원", x: 111.1, y: 203.2, size: 9, weight: 500, color: "#3e8650" },
  { text: "안산천", x: 95, y: 126, size: 10, weight: 500, color: "#3d84c6", rotate: -26 },
];

function clusterStores(stores) {
  const groups = [];
  stores.forEach((s) => {
    const g = groups.find((gr) => Math.hypot(gr.x - s.map.x, gr.y - s.map.y) < CLUSTER_PX);
    if (g) g.stores.push(s);
    else groups.push({ x: s.map.x, y: s.map.y, stores: [s] });
  });
  return groups;
}

function MapScreen(props) {
  const { stores, base, rowProps, searchQuery } = props;
  const viewRef = useRef(null);
  const drag = useRef(null);
  const [view, setView] = useState({ w: MAP_W, h: 500 });
  const [pan, setPan] = useState(null);
  const [selected, setSelected] = useState(null); // 묶음의 첫 가게 id
  const [smooth, setSmooth] = useState(false); // 버튼으로 옮길 때만 transition

  const scale = Math.max(1, view.w / MAP_W);
  const clamp = (p) => ({
    x: Math.min(0, Math.max(view.w - MAP_W * scale, p.x)),
    y: Math.min(0, Math.max(view.h - MAP_H * scale, p.y)),
  });
  const centerOn = (pt) => clamp({ x: view.w / 2 - pt.x * scale, y: view.h * 0.45 - pt.y * scale });

  // 지도 영역 크기 재기
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const measure = () => setView({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setPan((p) => (p ? clamp(p) : centerOn({ x: 200, y: 400 })));
  }, [view.w, view.h]);

  const groups = useMemo(() => clusterStores(stores), [stores]);
  const selGroup = groups.find((g) => g.stores[0].id === selected) || null;

  // 조건이 바뀌어 고른 가게가 사라지면 선택 해제
  useEffect(() => {
    if (selected && !selGroup) setSelected(null);
  }, [groups]);

  const onPointerDown = (e) => {
    // 포인터 캡처 뒤에는 pointerup 대상이 지도 영역으로 바뀌므로, 누른 핀을 여기서 기억해요
    const pin = e.target.closest && e.target.closest("[data-pin]");
    drag.current = { sx: e.clientX, sy: e.clientY, start: pan, moved: false, pin: pin && pin.getAttribute("data-pin") };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
    if (d.moved) {
      setSmooth(false);
      setPan(clamp({ x: d.start.x + dx, y: d.start.y + dy }));
    }
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) setSelected(d.pin || null);
  };

  const p = pan || { x: 0, y: 0 };

  return (
    <div className="screen map-screen">
      <TopUI {...props} />
      <div
        className="map-view"
        ref={viewRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        <div
          className={`map-canvas ${smooth ? "is-smooth" : ""}`}
          style={{ transform: `translate(${p.x}px, ${p.y}px) scale(${scale})` }}
        >
          <img src="images/map/base.svg" width={MAP_W} height={MAP_H} alt="" draggable="false" />
          <img src="images/map/district.svg" width={MAP_W} height={MAP_H} alt="" draggable="false" />
          {MAP_LABELS.map((l) => (
            <span
              key={l.text}
              className="map-label"
              style={{
                left: l.x,
                top: l.y,
                fontSize: l.size,
                fontWeight: l.weight || 400,
                color: l.color,
                transform: l.rotate ? `rotate(${l.rotate}deg)` : undefined,
              }}
            >
              {l.text}
            </span>
          ))}
          <span className="map-gate" style={{ left: GATE.x - 12, top: GATE.y - 12 }}>
            <img src="images/map/dot.svg" width="8" height="8" alt="" />
            ERICA 정문
          </span>
          {groups.map((g) => {
            const s = g.stores[0];
            const on = selected === s.id;
            return (
              <button
                key={s.id}
                data-pin={s.id}
                className={`pin ${on ? "is-on" : ""}`}
                style={{ left: g.x, top: g.y, zIndex: on ? 3 : 1 }}
                aria-label={g.stores.length > 1 ? `${s.name} 외 ${g.stores.length - 1}곳` : s.name}
                aria-pressed={on}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? setSelected(s.id) : null)}
              >
                <span className="pin-frame">
                  <Thumb store={s} size={on ? 48 : 38} />
                </span>
                <img className="pin-tail" src={on ? "images/map/tail-selected.svg" : "images/map/tail.svg"} width="12" height="7" alt="" />
                {g.stores.length > 1 && <span className="pin-count">{g.stores.length}</span>}
                {on && <span className="pin-name">{g.stores.length > 1 ? `${s.name} 외 ${g.stores.length - 1}곳` : s.name}</span>}
              </button>
            );
          })}
        </div>

        <div className="map-guide">
          이 근처 제휴 가게 <b>{stores.length}곳</b>
        </div>

        <button
          className="map-locate"
          style={{ bottom: selGroup ? 122 : 16 }}
          aria-label="ERICA 정문으로 이동"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={() => {
            setSmooth(true);
            setPan(centerOn(GATE));
          }}
        >
          <Icon name="locate" size={24} />
        </button>

        {selGroup && (
          <div
            key={selected}
            className="map-cards"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
          >
            {selGroup.stores.map((s) => (
              <div className="map-card" key={s.id}>
                <StoreRow store={s} base={base} q={searchQuery} {...rowProps(s)} />
              </div>
            ))}
          </div>
        )}

        {stores.length === 0 && (
          <div className="map-empty">조건에 맞는 제휴 가게가 없어요</div>
        )}
      </div>
    </div>
  );
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

  const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent("안산 " + store.name)}`;

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
   6. 스플래시 · 로고 조립
   티켓 몸통이 펼쳐지고 → 흰 면이 밀려 들어와 맞물리고 → H와 Y가 제자리에 꽂히며
   제휴모아 로고로 완성돼요. 약 1.35초, 누르면 바로 넘어가요.
   (images/logo.svg와 같은 로고를 조각별로 움직이려고 경로를 나눠 둔 것)
   --------------------------------------------------------- */
const SPLASH_MS = 1350;
const SPLASH_EXIT_MS = 280;

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
      <svg className="splash-logo" width="96" height="96" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <clipPath id="splash-ticket-clip">
            <path d={LOGO_PARTS.ticket} />
          </clipPath>
          <linearGradient id="splash-sheen" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="lock">
          <path className="part ticket" d={LOGO_PARTS.ticket} fill="#2563EB" />
          <g clipPath="url(#splash-ticket-clip)">
            <path className="part face" d={LOGO_PARTS.face} fill="#fff" />
            <rect className="sheen" x="-80" y="-20" width="40" height="240" fill="url(#splash-sheen)" />
          </g>
          <path className="part h" d={LOGO_PARTS.h} fill="#fff" />
          <path className="part y" d={LOGO_PARTS.y} fill="#2563EB" />
        </g>
      </svg>
      <div className="splash-text">
        <h1>
          <span>제휴모아</span>
        </h1>
        <p>
          <span>
            ERICA <b>제휴 할인</b> 모아보기
          </span>
        </p>
      </div>
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
  }, [visible, sort, base, searchQuery]);
  const favStores = useMemo(
    () => sortStores(STORES.filter((s) => favSet.has(s.id) && isEligible(s, cond)), sort, base),
    [favSet, cond, sort, base]
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
            setBase(b);
            setSort("distance");
            setOverlay(null);
            if (b === "me") showToast("프로토타입이라 예시 위치로 거리를 계산해요");
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
