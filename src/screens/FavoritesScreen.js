/* 즐겨찾기 화면
   #/favorites */

function FavoritesScreen({ stores, sort, base, cond, onOpenSort, sortBtnRef, rowProps, goList }) {
  const listKey = `${sort}-${base}`;
  return (
    <div className="screen">
      <div className="page-head">
        <div className="row">
          <h1>
            즐겨찾기 {stores.length > 0 && <em>{stores.length}곳</em>}
          </h1>
          {stores.length > 0 && <SortButton sort={sort} onClick={onOpenSort} btnRef={sortBtnRef} />}
        </div>
        <p>{conditionLabel(cond)} 조건에 맞는 혜택으로 보여요</p>
      </div>
      {stores.length === 0 ? (
        <div className="empty" style={{ paddingTop: 120 }}>
          <div className="empty-icon">
            <img src="images/icons/bookmark-empty.svg" width="32.16" height="32.16" alt="" />
          </div>
          <h2>아직 즐겨찾기한 가게가 없어요</h2>
          <p>목록에서 북마크를 누르면 여기에 모여요</p>
          <button className="btn-primary" onClick={goList}>
            제휴 가게 둘러보기
          </button>
        </div>
      ) : (
        <div className="store-list" key={listKey}>
          {stores.map((s) => (
            <StoreRow key={s.id} store={s} base={base} {...rowProps(s)} />
          ))}
        </div>
      )}
    </div>
  );
}
