/* 정렬
   거리순 · 인기순 · 가나다순 */

function sortStores(list, sort, base) {
  const copy = [...list];
  if (sort === "distance") copy.sort((a, b) => distanceOf(a, base) - distanceOf(b, base));
  if (sort === "popular") copy.sort((a, b) => b.favorites - a.favorites);
  if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  return copy;
}
