/* 조건 설정 모달
   누구랑 가요? · 단과대별 인원 · 내 소속 고르기 */

function ConditionModal({ cond, onApply, onClose }) {
  const [draft, setDraft] = useState(cond);
  const [page, setPage] = useState("main"); // main | college | add
  const [pickCollege, setPickCollege] = useState(cond.myCollege);

  const peopleOptions = [1, 2, 3, 4, 5];
  const mixTotal = Object.values(draft.mix).reduce((a, b) => a + b, 0);
  const needsMix = draft.people > 1 && !draft.sameCollege;
  const balanced = !needsMix || mixTotal === draft.people;

  const setPeople = (n) => {
    if (draft.sameCollege || n === 1) {
      setDraft({ ...draft, people: n, mix: { [draft.myCollege]: draft.sameCollege ? n : Math.min(n, draft.mix[draft.myCollege] || 1) } });
      return;
    }
    const mix = { ...draft.mix };
    {
      // 인원을 줄이면 다른 단과대 인원부터 줄여요
      let over = Object.values(mix).reduce((a, b) => a + b, 0) - n;
      Object.keys(mix)
        .filter((c) => c !== draft.myCollege)
        .reverse()
        .forEach((c) => {
          while (over > 0 && mix[c] > 0) {
            mix[c] -= 1;
            over -= 1;
          }
        });
      if (over > 0) mix[draft.myCollege] = Math.max(1, mix[draft.myCollege] - over);
    }
    setDraft({ ...draft, people: n, mix: cleanMix(mix, draft.myCollege) });
  };

  const setSame = (same) => {
    const mix = same ? { [draft.myCollege]: draft.people } : draft.mix;
    setDraft({ ...draft, sameCollege: same, mix: same ? mix : startMix(draft) });
  };

  const step = (college, delta) => {
    const mix = { ...draft.mix, [college]: (draft.mix[college] || 0) + delta };
    setDraft({ ...draft, mix: cleanMix(mix, draft.myCollege) });
  };

  if (page === "college" || page === "add") {
    const isAdd = page === "add";
    return (
      <>
        <div className="dim" onClick={onClose} />
        <div className="modal-wrap">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="college-title" style={{ gap: 16 }}>
            <div className="modal-head">
              <h2 id="college-title">
                <button className="back-btn" onClick={() => setPage("main")} aria-label="뒤로">
                  <Icon name="chevron-left" size={24} />
                </button>
                {isAdd ? "단과대 추가" : "내 소속"}
              </h2>
              <button className="icon-btn" onClick={onClose} aria-label="닫기">
                <Icon name="x" size={18} />
              </button>
            </div>
            <p className="modal-desc">
              {isAdd ? "같이 가는 사람의 단과대를 골라 주세요." : "ERICA 단과대 10곳 중에서 골라 주세요."}
            </p>
            <div className="college-grid">
              {COLLEGES.map((c) => {
                const used = isAdd && draft.mix[c] > 0;
                return (
                  <button
                    key={c}
                    disabled={used}
                    className={`${c.length > 7 ? "long" : ""} ${pickCollege === c ? "is-on" : ""}`}
                    aria-pressed={pickCollege === c}
                    onClick={() => setPickCollege(c)}
                  >
                    {pickCollege === c && <Icon name="check-blue-16" size={16} />}
                    {c}
                  </button>
                );
              })}
            </div>
            <div style={{ height: 4 }} />
            <button
              className="btn-primary"
              disabled={isAdd && (!pickCollege || draft.mix[pickCollege] > 0)}
              onClick={() => {
                if (isAdd) {
                  step(pickCollege, 1);
                } else {
                  const mix = { ...draft.mix };
                  const mine = mix[draft.myCollege] || 1;
                  delete mix[draft.myCollege];
                  mix[pickCollege] = (mix[pickCollege] || 0) + mine;
                  setDraft({ ...draft, myCollege: pickCollege, mix: draft.sameCollege ? { [pickCollege]: draft.people } : mix });
                }
                setPage("main");
              }}
            >
              {isAdd ? "추가하기" : "선택 완료"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dim" onClick={onClose} />
      <div className="modal-wrap">
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cond-title">
          <div className="modal-head">
            <h2 id="cond-title">누구랑 가요?</h2>
            <button className="icon-btn" onClick={onClose} aria-label="닫기">
              <Icon name="x" size={18} />
            </button>
          </div>
          <p className="modal-desc">같이 가는 인원과 소속에 맞는 혜택만 보여 드려요.</p>

          <div className="field">
            <div className="field-label">나까지 몇 명</div>
            <div className="chips" role="radiogroup">
              {peopleOptions.map((n) => (
                <button
                  key={n}
                  role="radio"
                  aria-checked={draft.people === n}
                  className={`chip ${draft.people === n ? "is-on" : ""}`}
                  onClick={() => setPeople(n)}
                >
                  {n === 1 ? "혼자" : n === 5 ? "5명+" : `${n}명`}
                </button>
              ))}
            </div>
          </div>

          {draft.people > 1 && (
            <div className="field">
              <div className="field-label">모두 같은 단과대예요?</div>
              <div className="segment" role="radiogroup">
                <button role="radio" aria-checked={draft.sameCollege} className={draft.sameCollege ? "is-on" : ""} onClick={() => setSame(true)}>
                  네
                </button>
                <button role="radio" aria-checked={!draft.sameCollege} className={!draft.sameCollege ? "is-on" : ""} onClick={() => setSame(false)}>
                  아니요
                </button>
              </div>
            </div>
          )}

          {needsMix ? (
            <>
              <div className="field">
                <div className="field-label">
                  단과대별 인원
                  <span className="count-blue">
                    {mixTotal} / {draft.people}명
                  </span>
                </div>
                <div className="college-list">
                  {Object.keys(draft.mix).map((c) => {
                    const isMe = c === draft.myCollege;
                    const n = draft.mix[c];
                    return (
                      <div className="college-row" key={c}>
                        <span>{c}</span>
                        {isMe && <span className="me-badge">나</span>}
                        <span className="spacer" />
                        <div className="stepper">
                          <button onClick={() => step(c, -1)} disabled={isMe && n <= 1} aria-label={`${c} 한 명 빼기`}>
                            <Icon name="minus" size={16} />
                          </button>
                          <output aria-live="polite" key={n} className="bump">{n}</output>
                          <button className="plus" onClick={() => step(c, 1)} disabled={mixTotal >= draft.people} aria-label={`${c} 한 명 더하기`}>
                            <Icon name="plus" size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="add-college"
                    onClick={() => {
                      setPickCollege(null);
                      setPage("add");
                    }}
                    disabled={mixTotal >= draft.people}
                    style={mixTotal >= draft.people ? { opacity: 0.4 } : null}
                  >
                    <Icon name="plus" size={16} />
                    단과대 추가
                  </button>
                </div>
              </div>
              <p className={`status-line ${balanced ? "ok" : ""}`}>
                {balanced ? <Icon name="check-green" size={16} /> : <Icon name="info" size={16} />}
                {balanced ? `${draft.people}명 모두 나눴어요` : `${draft.people - mixTotal}명을 더 나눠 주세요`}
              </p>
            </>
          ) : (
            <div className="field">
              <div className="field-label">내 소속</div>
              <button
                className="select-row"
                onClick={() => {
                  setPickCollege(draft.myCollege);
                  setPage("college");
                }}
              >
                <strong>{draft.myCollege}</strong>
                <span className="link-blue">바꾸기</span>
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
          )}

          <button className="btn-primary" disabled={!balanced} onClick={() => onApply(draft)}>
            이 조건으로 보기
          </button>
        </div>
      </div>
    </>
  );
}
