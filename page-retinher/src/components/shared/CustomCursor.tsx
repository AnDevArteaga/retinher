import { useEffect, useRef } from "react";
import gsap from "gsap";

const LIGHT_CURSOR = "#ffffff";
const DARK_CURSOR = "#161731"; // --color-title-dark

function getLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getBackgroundAt(x: number, y: number): { r: number; g: number; b: number } | null {
  const el = document.elementFromPoint(x, y);
  let current: Element | null = el;

  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const bg = style.backgroundColor;

    const rgbMatch = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
      if (a > 0.1) return { r, g, b };
    }

    const hexMatch = bg.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }

    current = current.parentElement;
  }
  return null;
}

/** Si estamos sobre una zona que fuerza cursor claro (fondo oscuro) */
function isOverCursorLightZone(x: number, y: number): boolean {
  let el: Element | null = document.elementFromPoint(x, y);
  while (el) {
    if (el.hasAttribute?.("data-cursor-light")) return true;
    el = el.parentElement;
  }
  return false;
}

/** Si estamos sobre una zona que fuerza cursor oscuro (fondo claro/blanco) */
function isOverCursorDarkZone(x: number, y: number): boolean {
  let el: Element | null = document.elementFromPoint(x, y);
  while (el) {
    if (el.hasAttribute?.("data-cursor-dark")) return true;
    el = el.parentElement;
  }
  return false;
}

function isBackgroundDark(x: number, y: number): boolean {
  if (isOverCursorDarkZone(x, y)) return false; // forzar cursor oscuro (fondo claro)
  if (isOverCursorLightZone(x, y)) return true;  // forzar cursor blanco (fondo oscuro)
  const color = getBackgroundAt(x, y);
  if (!color) return false; // default: fondo claro
  const lum = getLuminance(color.r, color.g, color.b);
  return lum < 0.5;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorColorRef = useRef<string>(DARK_CURSOR);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const ctx = gsap.context(() => {
      let x = 0;
      let y = 0;
      let ringX = 0;
      let ringY = 0;

      const setCursorColor = (color: string) => {
        if (cursorColorRef.current === color) return;
        cursorColorRef.current = color;
        dot.style.backgroundColor = color;
        ring.style.borderColor = color;
      };

      const onMouseMove = (e: MouseEvent) => {
        x = e.clientX;
        y = e.clientY;
        gsap.set(dot, { x, y, xPercent: -50, yPercent: -50 });
        ringX = x;
        ringY = y;

        const dark = isBackgroundDark(x, y);
        setCursorColor(dark ? LIGHT_CURSOR : DARK_CURSOR);
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
        style={{ backgroundColor: DARK_CURSOR }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={{ borderColor: DARK_CURSOR }}
        aria-hidden
      />
    </>
  );
}
