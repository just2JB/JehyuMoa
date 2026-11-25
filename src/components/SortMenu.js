/* 정렬 메뉴 · 거리 기준 모달
   정렬 버튼에서 펼쳐지는 메뉴와 거리 기준 고르기 */

function SortMenu({ sort, base, anchor, onPick, onOpenBase, onClose }) {
  return (
    <>
      <div className="dim" onClick={onClose} />
      <div className="popover" role="menu" style={{ top: anchor.top, right: anchor.right }}>
        {Object.keys(SORTS).map((key) => (
          <button
            key={key}
            role="menuitemradio"
            aria-checked={sort === key}
            className={`opt ${sort === key ? "is-on" : ""}`}
            onClick={() => onPick(key)}
          >
            <span>
              <b>{SORTS[key].label}</b>
              <small>{SORTS[key].desc(base)}</small>
            </span>
            {sort === key && <Icon name="check" size={24} />}
          </button>
        ))}
        <hr />
        <button className="basis" onClick={onOpenBase}>
          <span>거리 기준</span>
          <span>{BASES[base].label}</span>
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </>
  );
}

function BaseModal({ base, onApply, onClose }) {
  const [pick, setPick] = useState(base);
  return (
    <>
      <div className="dim" onClick={onClose} />
      <div className="modal-wrap">
        <div className="modal compact" role="dialog" aria-modal="true" aria-labelledby="base-title">
          <div className="modal-head">
            <h2 id="base-title">거리 기준</h2>
            <button className="icon-btn" onClick={onClose} aria-label="닫기">
              <Icon name="x" size={18} />
            </button>
          </div>
          <p className="modal-desc">어디서부터 가까운 순으로 정렬할까요?</p>
          <div className="radio-list" role="radiogroup">
            {Object.keys(BASES).map((key) => (
              <button
                key={key}
                role="radio"
                aria-checked={pick === key}
                className={`radio-card ${pick === key ? "is-on" : ""}`}
                onClick={() => setPick(key)}
              >
                <Icon name={pick === key ? "radio-on" : "radio-off"} size={20} />
                <span>
                  <b>{BASES[key].label}</b>
                  <small>{BASES[key].desc}</small>
                </span>
              </button>
            ))}
          </div>
          <p className="note">
            <Icon name="info" size={16} />
            인기순은 최근 30일 즐겨찾기 수, 가나다순은 가게 이름으로 정해요.
          </p>
          <button className="btn-primary" onClick={() => onApply(pick)}>
            이 기준으로 정렬
          </button>
        </div>
      </div>
    </>
  );
}
