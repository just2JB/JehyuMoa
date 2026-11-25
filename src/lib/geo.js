/* 거리 · 위치
   기준점(정문 · 후문 · 내 위치)에서 가게까지 직선거리 */

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
