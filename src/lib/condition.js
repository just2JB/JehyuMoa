/* 조건
   같이 가는 사람(인원 · 단과대)에 맞는 제휴인지, 조건 이름, 단과대별 인원 정리 */

function isEligible(store, cond) {
  if (!store.providerCollege) return true; // 총학생회 제휴는 ERICA 학생 모두
  const colleges = groupColleges(cond);
  return colleges.length === 1 && colleges[0] === store.providerCollege;
}

function groupColleges(cond) {
  if (cond.people === 1 || cond.sameCollege) return [cond.myCollege];
  return Object.keys(cond.mix).filter((c) => cond.mix[c] > 0);
}

function conditionLabel(cond) {
  const colleges = groupColleges(cond);
  const who = colleges.length > 1 ? `${cond.myCollege} 외 ${colleges.length - 1}곳` : cond.myCollege;
  return `${who} · ${cond.people === 1 ? "혼자" : cond.people + "명"}`;
}

function cleanMix(mix, myCollege) {
  const out = {};
  out[myCollege] = Math.max(1, mix[myCollege] || 1);
  Object.keys(mix).forEach((c) => {
    if (c !== myCollege && mix[c] > 0) out[c] = mix[c];
  });
  return out;
}

