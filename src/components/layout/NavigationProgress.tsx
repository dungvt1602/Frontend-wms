"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname          = usePathname();
  const [visible, setVisible] = useState(false);
  const [width,   setWidth]   = useState(0);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef    = useRef<number | null>(null);
  const prevPath  = useRef(pathname);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current)   cancelAnimationFrame(rafRef.current);
  };

  /* pathname 변경 감지 → 시작 */
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    clear();
    setVisible(true);
    setWidth(0);

    /* 짧은 딜레이 후 80%까지 빠르게 채움 */
    rafRef.current = requestAnimationFrame(() => {
      setWidth(70);
      timerRef.current = setTimeout(() => setWidth(85), 400);
    });

    /* 완료 */
    timerRef.current = setTimeout(() => {
      setWidth(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 300);
    }, 500);

    return clear;
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[99999] h-[2.5px] pointer-events-none"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg,#6366f1,#818cf8,#4f46e5)",
        transition: width === 100 ? "width 0.15s ease" : "width 0.4s ease",
        boxShadow: "0 0 8px rgba(99,102,241,0.6)",
      }}
    />
  );
}
