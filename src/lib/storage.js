/* 저장
   새로고침해도 남는 상태 (localStorage) */

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem("jehyumoa:" + key);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("jehyumoa:" + key, JSON.stringify(value));
    } catch (e) {
      /* 저장 공간을 쓸 수 없으면 메모리에서만 유지 */
    }
  }, [key, value]);
  return [value, setValue];
}
