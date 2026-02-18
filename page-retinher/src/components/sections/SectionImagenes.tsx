import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "../../contexts/ContentContext";

gsap.registerPlugin(ScrollTrigger);

export function SectionImagenes() {
  const { data } = useContent();
  const imageSection = (data as { imageSection?: { title: string; subtitle: string; images: Array<{ id: string; src: string; alt: string }> } })?.imageSection;
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleRef.current;
      const grid = gridRef.current;
      if (!title || !grid) return;

      const images = grid.querySelectorAll(".img-wrap");
      gsap.set(title, { opacity: 0, y: 30 });
      gsap.set(images, { opacity: 0, scale: 0.92 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power4.out" },
      });
      tl.to(title, { opacity: 1, y: 0, duration: 0.6 })
        .to(images, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.08 }, "-=0.3");

      images.forEach((imgWrap) => {
        const img = imgWrap.querySelector("img");
        if (!img) return;
        ScrollTrigger.create({
          trigger: imgWrap,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 0.8,
          onUpdate: (self) => {
            const y = (1 - self.progress) * 20;
            gsap.set(img, { y });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!imageSection) return null;
  const { title, subtitle, images } = imageSection;

  return (
    <section ref={sectionRef} className="section bg-[var(--color-bg-primary)]" id="imagenes">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-24">
        <h2
          ref={titleRef}
          className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter"
          style={{ color: "var(--color-title-alt)" }}
        >
          {title}
        </h2>
        <p className="mb-10 sm:mb-12 md:mb-16 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)]">{subtitle}</p>
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="img-wrap aspect-[4/3] overflow-hidden rounded-xl"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
