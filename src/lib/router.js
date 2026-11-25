/* 해시 라우팅
   라이브러리 없이 주소 # 뒤를 화면으로 써요. Live Server 같은 정적 서버에서도 새로고침 · 뒤로가기 · 링크 공유가 돼요.
   #/list · #/map · #/favorites · #/my · #/store/:id */

const TABS = ["list", "map", "favorites", "my"];

function parseRoute(hash) {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "store" && parts[1]) return { tab: null, storeId: decodeURIComponent(parts[1]) };
  return { tab: TABS.includes(parts[0]) ? parts[0] : "list", storeId: null, unknown: parts.length > 0 && !TABS.includes(parts[0]) };
}

function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

/** 화면 이동. replace면 방문 기록을 남기지 않아요 (뒤로가기로 돌아오지 않음) */
function navigate(path, { replace = false } = {}) {
  const url = "#" + path;
  if (window.location.hash === url) return;
  if (replace) {
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = path;
  }
}
