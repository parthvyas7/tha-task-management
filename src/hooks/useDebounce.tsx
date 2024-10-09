import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, delay: number): [T, boolean] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [searching, setSearching] = useState<boolean>(false);

  useEffect(() => {
    setSearching(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    setSearching(false);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, searching];
}
