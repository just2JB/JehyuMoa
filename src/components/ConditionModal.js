/* 조건 설정 모달
   누구랑 가요? (혼자 / 같이) · 같은 단과대면 인원, 섞였으면 단과대별 인원 · 내 소속 고르기 */

function ConditionModal({ cond, onApply, onClose }) {
  const [draft, setDraft] = useState(cond);
  const [page, setPage] = useState("main"); // main | college | add
  const [pickCollege, setPickCollege] = useState(cond.myCollege);

  const MAX_PEOPLE = 30;
  const together = draft.people > 1 || draft.together === true;
  const mixTotal = Object.values(draft.mix).reduce((a, b) => a + b, 0);
  const needsMix = together && !draft.sameCollege;
  const otherColleges = Object.keys(draft.mix).filter((c) => c !== draft.myCollege && draft.mix[c] > 0);
  // 섞였다고 했으면 다른 단과대 사람이 한 명은 있어야 해요
  const ready = !needsMix || otherColleges.length > 0;

  // 혼자 / 같이
  const setTogether = (on) => {
    if (!on) {
      setDraft({ ...draft, together: false, people: 1, mix: { [draft.myCollege]: 1 } });
      return;
    }
    const n = Math.max(2, draft.lastPeople || 2);
    setDraft({ ...draft, together: true, sameCollege: true, people: n, mix: { [draft.myCollege]: n } });
  };

  // 같이 + 같은 단과대: 인원 (나 포함)
  const setSameCount = (n) => {
    const people = Math.min(MAX_PEOPLE, Math.max(2, n));
    setDraft({ ...draft, people, lastPeople: people, mix: { [draft.myCollege]: people } });
  };

  const setSame = (same) => {
    if (same) {
      const people = Math.max(2, mixTotal);
      setDraft({ ...draft, together: true, sameCollege: true, people, mix: { [draft.myCollege]: people } });
    } else {
      // 나는 내 단과대 1명으로 두고, 같이 가는 사람은 단과대를 골라 나눠요 (아직 1명이어도 '같이' 상태 유지)
      const mix = { [draft.myCollege]: 1 };
      setDraft({ ...draft, together: true, sameCollege: false, mix, people: 1 });
    }
  };

  // 같이 + 섞임: 단과대별 인원, 합계가 곧 전체 인원
  const step = (college, delta) => {
    const mix = cleanMix({ ...draft.mix, [college]: (draft.mix[college] || 0) + delta }, draft.myCollege);
    const people = Object.values(mix).reduce((a, b) => a + b, 0);
    setDraft({ ...draft, mix, people, lastPeople: Math.max(2, people) });
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
                  setDraft({ ...draft, myCollege: pickCollege, mix: draft.sameCollege || draft.people === 1 ? { [pickCollege]: draft.people } : mix });
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

          <div className="segment" role="radiogroup" aria-label="혼자 또는 같이">
            <button role="radio" aria-checked={!together} className={!together ? "is-on" : ""} onClick={() => setTogether(false)}>
              혼자
            </button>
            <button role="radio" aria-checked={together} className={together ? "is-on" : ""} onClick={() => setTogether(true)}>
              같이
            </button>
          </div>

          {together && (
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

          {together && draft.sameCollege && (
            <div className="field">
              <div className="field-label">몇 명이에요?</div>
              <div className="college-list">
                <div className="college-row">
                  <span>나 포함</span>
                  <span className="spacer" />
                  <div className="stepper">
                    <button onClick={() => setSameCount(draft.people - 1)} disabled={draft.people <= 2} aria-label="한 명 빼기">
                      <Icon name="minus" size={16} />
                    </button>
                    <output aria-live="polite" key={draft.people} className="bump">
                      {draft.people}
                    </output>
                    <button className="plus" onClick={() => setSameCount(draft.people + 1)} disabled={draft.people >= MAX_PEOPLE} aria-label="한 명 더하기">
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {needsMix ? (
            <>
              <div className="field">
                <div className="field-label">
                  단과대별 인원
                  <span className="count-blue">총 {mixTotal}명</span>
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
                          <output aria-live="polite" key={n} className="bump">
                            {n}
                          </output>
                          <button className="plus" onClick={() => step(c, 1)} disabled={mixTotal >= MAX_PEOPLE} aria-label={`${c} 한 명 더하기`}>
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
                    disabled={mixTotal >= MAX_PEOPLE}
                  >
                    <Icon name="plus" size={16} />
                    단과대 추가
                  </button>
                </div>
              </div>
              <p className={`status-line ${ready ? "ok" : ""}`}>
                {ready ? <Icon name="check-green" size={16} /> : <Icon name="info" size={16} />}
                {ready ? `${otherColleges.length + 1}개 단과대 · ${mixTotal}명이 같이 가요` : "같이 가는 다른 단과대를 추가해 주세요"}
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

          <button className="btn-primary" disabled={!ready} onClick={() => onApply({ ...draft, together: draft.people > 1 })}>
            이 조건으로 보기
          </button>
        </div>
      </div>
    </>
  );
}
