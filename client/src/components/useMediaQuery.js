import { useState, useEffect } from "react";

// 🔹 Кастомный хук
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Функция проверки
    const handleChange = (e) => setMatches(e.matches);

    // Проверка при монтировании
    setMatches(mediaQuery.matches);

    // Подписка на изменения
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
