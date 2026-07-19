'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface TypewriterProps {
  text: string;
  /** Milliseconds between each revealed word */
  speed?: number;
  /** Delay in ms before typing starts (lets cards stagger like a chat) */
  startDelay?: number;
  className?: string;
  dir?: 'auto' | 'ltr' | 'rtl';
}

/**
 * Reveals text word-by-word with a blinking cursor, like a ChatGPT/Claude
 * response being streamed. Purely client-side, so it works with any backend.
 */
export default function Typewriter({
  text,
  speed = 28,
  startDelay = 0,
  className,
  dir,
}: TypewriterProps) {
  const words = useMemo(() => text.split(' '), [text]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= words.length) {
            if (interval) clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, words.length, speed, startDelay]);

  const done = count >= words.length;

  return (
    <span dir={dir} className={className}>
      {words.slice(0, count).join(' ')}
      {!done && <span className="type-cursor" aria-hidden="true" />}
    </span>
  );
}
