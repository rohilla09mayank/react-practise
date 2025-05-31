import { useEffect, useState } from "react";

export function useLocalStorageState(key) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    console.log(stored);
    return JSON.parse(stored) || [];
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
