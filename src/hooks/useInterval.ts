import { useEffect, useRef } from 'react';

type FixMeLater = any;

// delay = null to end the callback, similar to setTimeout
// Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: FixMeLater, delay: number) {
  const savedCallback = useRef<Function>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
