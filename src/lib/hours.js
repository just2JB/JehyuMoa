/* 영업 시간
   영업 중인지, 몇 시에 열고 닫는지 */

function minutesOf(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function hourText(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h < 12 || h === 24 ? "오전" : "오후";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hh}시${m ? ` ${m}분` : ""}`;
}

function openState(hours, now = new Date()) {
  const cur = now.getHours() * 60 + now.getMinutes();
  const open = minutesOf(hours.open);
  let close = minutesOf(hours.close);
  if (close <= open) close += 24 * 60; // 새벽까지 영업
  const inRange = (t) => t >= open && t < close;
  const isOpen = inRange(cur) || inRange(cur + 24 * 60);
  return isOpen
    ? { isOpen, text: `${hourText(hours.close)}에 닫아요` }
    : { isOpen, text: `${hourText(hours.open)}에 열어요` };
}
