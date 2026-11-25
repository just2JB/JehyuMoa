/* 공통 시작점
   React 훅과 로컬 설정(config.js)을 꺼내 둬요. 다른 src 파일보다 먼저 불러와야 해요. */

/* React 훅 */
const { useState, useEffect, useMemo, useRef } = React;

/* 로컬 설정 (config.js · 없으면 기본값) */
const CONFIG = Object.assign({ KAKAO_MAP_JS_KEY: "", DATA_URL: "data/stores.json" }, window.JEHYUMOA_CONFIG || {});
