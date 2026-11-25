/* 목록 화면
   #/list */

function ListScreen(props) {
  const { searchQuery, stores, sort, base, onOpenSort, sortBtnRef, rowProps, cond, onResetFilters, category } = props;
  const listKey = `${sort}-${base}-${category}-${conditionLabel(cond)}`;
  return (
    <div className="screen">
      <TopUI {...props} />
      <div className="list-head">
        <h1 className="list-title">
          제휴 가게 <em>{stores.length}곳</em>
        </h1>
        <SortButton sort={sort} onClick={onOpenSort} btnRef={sortBtnRef} />
      </div>
      <SortBasis sort={sort} base={base} />
      {stores.length === 0 ? (
        <div className="empty">
          <div className="empty-icon gray">
            <Icon name="search" size={28} />
          </div>
          <h2>조건에 맞는 제휴 가게가 없어요</h2>
          <p>{conditionLabel(cond)} 조건에서 검색어나 업종을 바꿔 보세요</p>
          <button className="btn-primary" onClick={onResetFilters}>
            전체 가게 보기
          </button>
        </div>
      ) : (
        <div className="store-list" key={listKey}>
          {stores.map((s) => (
            <StoreRow key={s.id} store={s} base={base} q={searchQuery} {...rowProps(s)} />
          ))}
        </div>
      )}
    </div>
  );
}
