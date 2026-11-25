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
