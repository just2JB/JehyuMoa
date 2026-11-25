/* 제휴 데이터 불러오기 · 검사
   data/stores.json(또는 config.js의 DATA_URL)을 불러와서
   - 형식이 틀린 가게는 빼고 콘솔에 이유를 알려 줘요 (앱 전체가 멈추지 않게)
   - 제휴 기간이 끝났거나 아직 시작 전인 가게는 목록에서 숨겨요
   데이터 형식과 입력 방법은 docs/data-guide.md 를 봐요. */

const CATEGORY_SET = ["식당", "술집", "카페", "기타"];
const TIME_RE = /^([01]\d|2[0-4]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// 안산 상록구 근처를 크게 벗어난 좌표는 잘못 넣은 값일 가능성이 높아요
const AREA = { minLat: 37.2, maxLat: 37.4, minLng: 126.7, maxLng: 127.0 };

/** 가게 하나의 문제 목록 (없으면 빈 배열) */
function storeProblems(s) {
  const p = [];
  const need = (cond, msg) => (cond ? null : p.push(msg));
  need(s && typeof s.id === "string" && /^[a-z0-9-]+$/.test(s.id), "id는 영어 소문자·숫자·- 로 (예: ilmi-gamjatang)");
  need(typeof s.name === "string" && s.name.trim(), "name(가게 이름)이 없어요");
  need(CATEGORY_SET.includes(s.category), `category는 ${CATEGORY_SET.join("·")} 중 하나`);
  need(typeof s.lat === "number" && s.lat > AREA.minLat && s.lat < AREA.maxLat, "lat(위도)가 없거나 안산 근처가 아니에요");
  need(typeof s.lng === "number" && s.lng > AREA.minLng && s.lng < AREA.maxLng, "lng(경도)가 없거나 안산 근처가 아니에요");
  need(typeof s.provider === "string" && s.provider.trim(), "provider(제휴를 맺은 학생회)가 없어요");
  need(!s.providerCollege || COLLEGES.includes(s.providerCollege), `providerCollege는 ${COLLEGES.join(", ")} 중 하나`);
  need(s.hours && TIME_RE.test(s.hours.open) && TIME_RE.test(s.hours.close), "hours는 { open: \"11:00\", close: \"22:00\" } 형식");
  need(s.period && DATE_RE.test(s.period.start) && DATE_RE.test(s.period.end) && s.period.start <= s.period.end, "period는 { start: \"2026-09-01\", end: \"2026-12-31\" } 형식");
  need(!s.checkedAt || DATE_RE.test(s.checkedAt), "checkedAt은 \"2026-10-18\" 형식");
  need(!s.source || /^https:\/\//.test(s.source), "source(출처)는 https:// 로 시작하는 주소");
  need(typeof s.favorites === "number" && s.favorites >= 0, "favorites(최근 30일 즐겨찾기 수)는 0 이상 숫자");
  need(Array.isArray(s.benefits) && s.benefits.length > 0, "benefits(혜택)가 하나 이상 있어야 해요");
  (s.benefits || []).forEach((b, i) => {
    need(b && typeof b.title === "string" && b.title.trim(), `benefits[${i}].title이 없어요`);
    need(b && Array.isArray(b.details), `benefits[${i}].details는 배열 (예: ["2명 이상 방문"])`);
    need(!b || b.minPeople === undefined || (Number.isInteger(b.minPeople) && b.minPeople >= 1), `benefits[${i}].minPeople은 1 이상 정수`);
  });
  return p;
}

/** 형식 검사 + id 중복 검사. 문제 있는 가게는 빼고 { stores, problems } */
function validateStores(list) {
  const problems = [];
  const seen = new Set();
  const stores = [];
  (Array.isArray(list) ? list : []).forEach((s, i) => {
    const label = `#${i} ${(s && s.name) || (s && s.id) || "(이름 없음)"}`;
    const p = storeProblems(s || {});
    if (s && seen.has(s.id)) p.push(`id '${s.id}'가 중복돼요`);
    if (p.length) problems.push({ label, problems: p });
    else {
      seen.add(s.id);
      stores.push(s);
    }
  });
  return { stores, problems };
}

function todayISO(now = new Date()) {
  const z = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${z(now.getMonth() + 1)}-${z(now.getDate())}`;
}

/** 오늘이 제휴 기간 안인지 */
function isActive(store, today = todayISO()) {
  return store.period.start <= today && today <= store.period.end;
}

/** "2026-09-01" → "2026.09.01" */
function formatDate(iso) {
  return iso ? iso.replace(/-/g, ".") : "-";
}

/** 같은 해면 끝 날짜에서 연도를 빼요: 2026.09.01 ~ 12.31 */
function formatPeriod(period) {
  const [sy] = period.start.split("-");
  const [ey, em, ed] = period.end.split("-");
  return `${formatDate(period.start)} ~ ${sy === ey ? `${em}.${ed}` : formatDate(period.end)}`;
}

/** 데이터 불러오기 → 검사 → 기간 지난 가게 숨기기 */
async function loadStores(url = CONFIG.DATA_URL) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`데이터를 불러오지 못했어요 (${res.status})`);
  const json = await res.json();
  const { stores, problems } = validateStores(json.stores);
  if (problems.length) {
    console.warn(`[제휴모아] 형식이 맞지 않아 뺀 가게 ${problems.length}곳 — docs/data-guide.md 참고`);
    problems.forEach((x) => console.warn(` - ${x.label}: ${x.problems.join(" / ")}`));
  }
  const today = todayISO();
  const active = stores.filter((s) => isActive(s, today));
  if (active.length < stores.length) console.info(`[제휴모아] 기간이 아닌 제휴 ${stores.length - active.length}곳은 숨겼어요`);
  return { stores: active, updatedAt: json.updatedAt || null, skipped: problems.length };
}
