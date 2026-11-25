/* 고정 값
   단과대 · 업종 · 정렬 · 거리 기준 · 기본 조건 */

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

const DEFAULT_COND = { myCollege: "공학대학", people: 2, sameCollege: true, mix: { 공학대학: 2 } };
