/* 마이 페이지
   #/my */

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
