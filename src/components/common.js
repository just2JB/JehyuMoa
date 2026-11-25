/* 공통 컴포넌트
   아이콘 · 썸네일 · 북마크 · 매장 줄 · 정렬 버튼 · 상단 UI · 토스트 · 하단 탭 */

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
