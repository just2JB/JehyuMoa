/* ---------------------------------------------------------
   6. 스플래시 · 로고 그리기 (흰 배경, 파랑 단색)
   티켓 윤곽선이 한 붓으로 그려지고 → 파랑으로 채워지고 →
   흰 면 · H · Y가 드러나며 제휴모아 로고로 완성돼요. 약 1.3초, 누르면 바로 넘어가요.
   (images/logo.svg와 같은 로고를 조각별로 움직이려고 경로를 나눠 둔 것)
   --------------------------------------------------------- */
const SPLASH_MS = 1300;
const SPLASH_EXIT_MS = 240;

const LOGO_PARTS = {
  ticket:
    "M45 0H82C82 4.7739 83.8964 9.35227 87.2721 12.7279C90.6477 16.1036 95.2261 18 100 18C104.774 18 109.352 16.1036 112.728 12.7279C116.104 9.35227 118 4.7739 118 0H155C166.935 0 178.381 4.74106 186.82 13.1802C195.259 21.6193 200 33.0653 200 45V155C200 166.935 195.259 178.381 186.82 186.82C178.381 195.259 166.935 200 155 200H118C118 195.226 116.104 190.648 112.728 187.272C109.352 183.896 104.774 182 100 182C95.2261 182 90.6477 183.896 87.2721 187.272C83.8964 190.648 82 195.226 82 200H45C33.0653 200 21.6193 195.259 13.1802 186.82C4.74106 178.381 0 166.935 0 155L0 45C0 33.0653 4.74106 21.6193 13.1802 13.1802C21.6193 4.74106 33.0653 0 45 0Z",
  face:
    "M100 28C105.669 27.9999 111.204 26.2791 115.874 23.065C120.544 19.851 124.128 15.2951 126.153 10H155C164.283 10 173.185 13.6875 179.749 20.2513C186.313 26.815 190 35.7174 190 45V155C190 164.283 186.313 173.185 179.749 179.749C173.185 186.312 164.283 190 155 190H126.153C124.128 184.705 120.544 180.149 115.874 176.935C111.204 173.721 105.669 172 100 172V28Z",
  h: "M37.75 66V93.75H62.25V66H74.75V134H62.25V106.25H37.75V134H25.25V66H37.75Z",
  y: "M169.456 69.0488L151.25 101.628V134H138.75V101.628L120.544 69.0488L131.456 62.9512L145 87.1875L158.544 62.9512L169.456 69.0488Z",
};

function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const reduce = useMemo(() => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    const total = reduce ? 500 : SPLASH_MS;
    const t1 = setTimeout(() => setLeaving(true), total);
    const t2 = setTimeout(onDone, total + SPLASH_EXIT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const skip = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDone, SPLASH_EXIT_MS);
  };

  return (
    <div className={`splash ${leaving ? "is-leaving" : ""} ${reduce ? "is-reduced" : ""}`} onClick={skip} role="presentation">
      <svg className="splash-logo" width="88" height="88" viewBox="-4 -4 208 208" aria-hidden="true">
        <path className="fill" d={LOGO_PARTS.ticket} fill="#2563EB" />
        <path className="outline" d={LOGO_PARTS.ticket} pathLength="1" fill="none" stroke="#2563EB" strokeWidth="5" strokeLinejoin="round" />
        <path className="face" d={LOGO_PARTS.face} fill="#fff" />
        <path className="h" d={LOGO_PARTS.h} fill="#fff" />
        <path className="y" d={LOGO_PARTS.y} fill="#2563EB" />
      </svg>
      <h1 className="splash-name">제휴모아</h1>
      <span className="sr-only">제휴모아를 불러오는 중</span>
    </div>
  );
}
