import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const ctx = gsap.context(() => {
      let x = 0;
      let y = 0;
      let ringX = 0;
      let ringY = 0;

      const setRingTarget = (tx: number, ty: number) => {
        ringX = tx;
        ringY = ty;
      };

      const onMouseMove = (e: MouseEvent) => {
        x = e.clientX;
        y = e.clientY;
        gsap.set(dot, { x, y, xPercent: -50, yPercent: -50 });
        setRingTarget(x, y);
      };

      const onButtonEnter = () => {
        gsap.to(dot, { scale: 2, opacity: 0.4, duration: 0.3, ease: "power4.out" });
        gsap.to(ring, { scale: 2.2, borderWidth: 2, duration: 0.3, ease: "power4.out" });
      };

      const onButtonLeave = () => {
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: "power4.out" });
        gsap.to(ring, { scale: 1, borderWidth: 1, duration: 0.3, ease: "power4.out" });
      };

      window.addEventListener("mousemove", onMouseMove);

      const buttons = document.querySelectorAll("a, button, [data-cursor-magnetic]");
      buttons.forEach((btn) => {
        btn.addEventListener("mouseenter", onButtonEnter);
        btn.addEventListener("mouseleave", onButtonLeave);
      });

      gsap.ticker.add(updateRing);
      function updateRing() {
        ringX += (x - ringX) * 0.18;
        ringY += (y - ringY) * 0.18;
        gsap.set(ring, { x: ringX, y: ringY, xPercent: -50, yPercent: -50 });
      }

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        buttons.forEach((btn) => {
          btn.removeEventListener("mouseenter", onButtonEnter);
          btn.removeEventListener("mouseleave", onButtonLeave);
        });
        gsap.ticker.remove(updateRing);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full"
        style={{ backgroundColor: "var(--color-title)" }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-title)]"
        aria-hidden
      />
    </>
  );
}
