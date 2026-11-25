/* 매장 상세
   #/store/:id */

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

  const mapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(store.name)},${store.lat},${store.lng}`;

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
              <dd>{formatPeriod(store.period)}</dd>
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
              <dt>위치</dt>
              <dd>
                {store.coordVerified ? "확인된 위치" : <span style={{ color: "var(--text-3)" }}>대략적인 위치 (확인 전)</span>}
              </dd>
            </div>
            <div>
              <dt>확인</dt>
              <dd>{formatDate(store.checkedAt)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
