/* =========================================================
   제휴모아 · JehyuMoa — 앱 조립
   React 18 + Babel Standalone (README 개발 방식)
   화면 · 컴포넌트 · 데이터는 src/ 에 있고, 여기서는 상태와 라우팅을 묶어 그려요.
   불러오는 순서는 index.html 을 봐요.
   ========================================================= */

function App() {
  const route = useRoute();
  // 상세(#/store/:id)를 열어도 뒤에는 마지막 탭 화면을 그대로 둬요
  const lastTab = useRef(route.tab || "list");
  if (route.tab) lastTab.current = route.tab;
  const tab = route.tab || lastTab.current;
  const detailId = route.storeId;
  // 앱 안에서 상세를 열었으면 닫을 때 브라우저 뒤로가기와 같게 동작해요
  const openedInApp = useRef(false);
  const setTab = (t) => navigate("/" + t);
  const closeDetail = () => {
    if (openedInApp.current) window.history.back();
    else navigate("/" + tab, { replace: true });
    openedInApp.current = false;
  };
  const [cond, setCond] = usePersistentState("cond", DEFAULT_COND);
  const [sort, setSort] = usePersistentState("sort", "distance");
  const [base, setBase] = usePersistentState("base", "gate");
  const [favorites, setFavorites] = usePersistentState("favorites", INITIAL_FAVORITES);
  const [settings, setSettings] = usePersistentState("settings", { newDeal: true, favChange: true });
  const [recent, setRecent] = usePersistentState("recent", []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [overlay, setOverlay] = useState(null); // sort | base | condition
  const [sortAnchor, setSortAnchor] = useState({ top: 0, right: 16 });
  const [toast, setToast] = useState(null);
  const [splash, setSplash] = useState(true);
  const [myPos, setMyPos] = useState(null);
  // 제휴 데이터 (data/stores.json) · null이면 불러오는 중
  const [stores, setStores] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const load = () => {
    setLoadError(null);
    loadStores()
      .then((d) => setStores(d.stores))
      .catch((e) => setLoadError(e.message || "데이터를 불러오지 못했어요"));
  };
  useEffect(load, []);

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
        openedInApp.current = false;
        navigate("/favorites", { replace: Boolean(detailId) });
      });
    }
  };

  const favCount = (store) => {
    const wasFav = INITIAL_FAVORITES.includes(store.id);
    const isFav = favSet.has(store.id);
    return store.favorites + (isFav && !wasFav ? 1 : 0) - (!isFav && wasFav ? 1 : 0);
  };

  const openDetail = (id) => {
    openedInApp.current = true;
    navigate("/store/" + encodeURIComponent(id));
    setRecent([id, ...recent.filter((r) => r !== id)].slice(0, 20));
  };

  const searchQuery = useMemo(() => makeQuery(query), [query]);

  const visible = useMemo(() => {
    return (stores || []).filter((s) => isEligible(s, cond))
      .filter((s) => category === "전체" || s.category === category)
      .filter((s) => searchRank(s, searchQuery) > 0);
  }, [stores, cond, category, searchQuery]);

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
    () => sortStores((stores || []).filter((s) => favSet.has(s.id) && isEligible(s, cond)), sort, base),
    [stores, favSet, cond, sort, base, myPos]
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

  const detailStore = detailId && stores ? stores.find((s) => s.id === detailId) : null;

  // 주소가 비었거나 모르는 화면·가게면 목록으로
  useEffect(() => {
    // 가게 데이터를 다 불러온 뒤에만 '없는 가게'로 판단해요
    if (!window.location.hash || route.unknown || (detailId && stores && !detailStore)) navigate("/list", { replace: true });
  }, [route, stores]);

  useEffect(() => {
    if (base === "me") requestMyPos(() => {}, () => setBase("gate"));
  }, []);

  // ESC로 맨 위 레이어 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (overlay) setOverlay(null);
      else if (detailId) closeDetail();
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

  // 데이터를 불러오는 중이거나 실패했을 때
  if (!stores) {
    return (
      <div className="app" ref={appRef}>
        <div className="load-state">
          {loadError ? (
            <>
              <h2>{loadError}</h2>
              <p>인터넷 연결이나 데이터 파일 위치(config.js의 DATA_URL)를 확인해 주세요.</p>
              <button className="btn-primary" onClick={load}>
                다시 시도
              </button>
            </>
          ) : (
            <p>제휴 정보를 불러오는 중이에요</p>
          )}
        </div>
        {splash && <Splash onDone={() => setSplash(false)} />}
      </div>
    );
  }

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
          openedInApp.current = false;
          navigate("/" + t, { replace: Boolean(detailId) });
        }}
      />

      {detailStore && (
        <DetailScreen
          store={detailStore}
          cond={cond}
          isFav={favSet.has(detailStore.id)}
          onToggleFav={() => toggleFav(detailStore)}
          onClose={closeDetail}
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
