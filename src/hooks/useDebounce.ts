import { type DependencyList, useEffect, useRef } from "react";

export default function useDebounce(
  callback: () => void,
  delayMs: number,
  deps: DependencyList = [],
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const timer = setTimeout(() => {
      callbackRef.current();
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [delayMs, ...deps]);
}
