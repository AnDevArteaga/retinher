import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mockData } from "../data/MockData";

gsap.registerPlugin(ScrollTrigger);

export function GalleryHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const title = titleRef.current;
      if (!section || !track) return;

      const trackWidth = track.scrollWidth;
      const distance = -(trackWidth - window.innerWidth);

      gsap.to(track, {
        x: distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${trackWidth}`,
          pin: true,
          scrub: 1,
        },
      });

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0.3, y: 20 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "top 20%",
              scrub: 0.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[var(--color-bg-primary)]" id="gallery">
      <div className="absolute left-0 top-0 z-10 px-6 pt-24 md:px-12">
        <h2
          ref={titleRef}
          className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl"
          style={{ color: "var(--color-title)" }}
        >
          {mockData.gallery.title}
        </h2>
        <p className="mt-2 text-lg text-[var(--color-text-muted)]">{mockData.gallery.subtitle}</p>
      </div>
      <div
        ref={trackRef}
        className="absolute left-0 top-0 flex h-full items-center gap-6 pl-6 pt-32 md:gap-8 md:pl-12"
        style={{ width: "max-content" }}
      >
        {mockData.gallery.items.map((item) => (
          <div
            key={item.id}
            className="relative flex h-[70vh] w-[85vw] flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-text-muted)]/20 bg-[var(--color-bg-secondary)] md:w-[70vw] lg:w-[55vw]"
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <img
                src={item.src}
                alt={item.caption}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-sm font-medium text-[var(--color-text)]">{item.caption}</p>
            </div>
          </div>
        ))}
        <div className="h-[70vh] w-[20px] flex-shrink-0" aria-hidden />
      </div>
    </section>
  );
}
