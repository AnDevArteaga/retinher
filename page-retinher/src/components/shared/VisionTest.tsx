import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { mockData } from "../../data/MockData";

type VisionStage = "idle" | "calibration" | "test" | "feedback";
type EDirection = "arriba" | "abajo" | "izquierda" | "derecha";

const E_DIRECTIONS: EDirection[] = ["arriba", "abajo", "izquierda", "derecha"];

export function VisionTest() {
  const [stage, setStage] = useState<VisionStage>("idle");
  const [results, setResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [currentDirection, setCurrentDirection] = useState<EDirection>("arriba");
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [round, setRound] = useState(0);

  const calibrationRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const eRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const TOTAL_ROUNDS = 6;

  const pickRandomDirection = useCallback((): EDirection => {
    return E_DIRECTIONS[Math.floor(Math.random() * E_DIRECTIONS.length)];
  }, []);

  const startCalibration = useCallback(() => {
    setStage("calibration");
    setFeedbackCorrect(null);
  }, []);

  useEffect(() => {
    if (stage !== "calibration") return;
    const ctx = gsap.context(() => {
      const eye = eyeRef.current;
      const calibration = calibrationRef.current;
      if (!eye || !calibration) return;

      const beam = calibration.querySelector(".calibration-beam");
      gsap.set(eye, { scale: 0.8, opacity: 0 });
      gsap.set(beam, { scaleX: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          setStage("test");
          setCurrentDirection(pickRandomDirection());
          setRound(1);
          setResults((r) => ({ ...r, total: 1 }));
        },
      });
      tl.to(eye, { scale: 1, opacity: 1, duration: 0.5, ease: "power4.out" })
        .to(beam, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.2")
        .to(beam, { scaleX: 0, duration: 0.3 }, "+=0.2");
    }, sectionRef);
    return () => ctx.revert();
  }, [stage, pickRandomDirection]);

  const answer = useCallback(
    (userChoice: EDirection) => {
      if (stage !== "test") return;
      const correct = userChoice === currentDirection;
      setFeedbackCorrect(correct);
      setResults((r) => ({
        correct: r.correct + (correct ? 1 : 0),
        total: r.total,
      }));
      setStage("feedback");
    },
    [stage, currentDirection]
  );

  useEffect(() => {
    if (stage !== "feedback") return;
    const ctx = gsap.context(() => {
      const fb = feedbackRef.current;
      if (!fb) return;
      gsap.set(fb, { opacity: 0, scale: 0.95 });
      gsap.to(fb, { opacity: 1, scale: 1, duration: 0.35, ease: "power4.out" });
      if (feedbackCorrect === true) {
        const scan = fb.querySelector(".feedback-scan");
        gsap.fromTo(scan, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: "power4.out" });
      }
      if (feedbackCorrect === false) {
        const glitch = fb.querySelector(".feedback-glitch");
        gsap.to(glitch, { x: -4, duration: 0.05, repeat: 5, yoyo: true });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [stage, feedbackCorrect]);

  const nextRound = useCallback(() => {
    if (round >= TOTAL_ROUNDS) {
      setStage("idle");
      setRound(0);
      return;
    }
    setStage("test");
    setCurrentDirection(pickRandomDirection());
    setRound((r) => r + 1);
    setResults((prev) => ({ ...prev, total: prev.total + 1 }));
    setFeedbackCorrect(null);
  }, [round, pickRandomDirection]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (stage !== "test") return;
      const map: Record<string, EDirection> = {
        ArrowUp: "arriba",
        ArrowDown: "abajo",
        ArrowLeft: "izquierda",
        ArrowRight: "derecha",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        answer(dir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [stage, answer]);

  const getEStyle = (): React.CSSProperties => {
    const transform = {
      arriba: "rotate(0deg)",
      abajo: "rotate(180deg)",
      izquierda: "rotate(-90deg)",
      derecha: "rotate(90deg)",
    }[currentDirection];
    return { transform };
  };

  return (
    <section ref={sectionRef} className="section section-vision" id="vision-lab">
      <div className="mx-auto flex min-h-[100vh] w-full max-w-4xl flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        {stage === "idle" && (
          <div className="text-center">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ color: "var(--color-title)" }}
            >
              {mockData.visionLab.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)]">{mockData.visionLab.tagline}</p>
            <button
              type="button"
              onClick={startCalibration}
              className="mt-10 rounded-full px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-btn)" }}
              data-cursor-magnetic
            >
              Iniciar test de visión
            </button>
          </div>
        )}

        {stage === "calibration" && (
          <div ref={calibrationRef} className="flex flex-col items-center">
            <p className="mb-8 text-lg text-[var(--color-text)]">{mockData.visionLab.calibration}</p>
            <p className="mb-6 text-sm text-[var(--color-text-muted)]">{mockData.visionLab.calibrationDesc}</p>
            <div ref={eyeRef} className="relative">
              <div className="h-24 w-24 rounded-full border-2 border-[var(--color-title)]/40 bg-[var(--color-bg-secondary)] md:h-32 md:w-32" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full shadow-[0_0_20px_rgba(255,102,0,0.5)]" style={{ backgroundColor: "var(--color-btn)" }} />
              </div>
            </div>
            <div
              className="calibration-beam absolute left-1/2 top-1/2 h-px w-[80vw] origin-center -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--color-btn)] to-transparent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        )}

        {stage === "test" && (
          <div ref={eRef} className="flex flex-col items-center">
            <p className="mb-6 text-[var(--color-text)]">{mockData.visionLab.testInstruction}</p>
            <p className="mb-4 text-sm text-[var(--color-text-muted)]">
              Ronda {round} / {TOTAL_ROUNDS} — Usa flechas del teclado o botones
            </p>
            <div
              className="flex h-32 w-32 items-center justify-center rounded-xl bg-[var(--color-bg-secondary)] md:h-40 md:w-40"
              style={getEStyle()}
            >
              <span className="text-7xl font-bold md:text-8xl" style={{ color: "var(--color-title)" }}>E</span>
            </div>
            <div className="mt-10 flex gap-4">
              {E_DIRECTIONS.map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => answer(dir)}
                  className="rounded-lg border border-[var(--color-title)]/30 px-4 py-2 text-sm transition-colors hover:opacity-90"
                  style={{ color: "var(--color-title)", backgroundColor: "var(--color-bg-secondary)" }}
                  data-cursor-magnetic
                >
                  {dir === "arriba" && "↑"}
                  {dir === "abajo" && "↓"}
                  {dir === "izquierda" && "←"}
                  {dir === "derecha" && "→"}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "feedback" && (
          <div ref={feedbackRef} className="relative overflow-hidden rounded-2xl border border-[var(--color-text-muted)]/20 bg-[var(--color-bg-secondary)] px-12 py-10 text-center">
            <div
              className="feedback-scan absolute inset-0 origin-top opacity-20"
              style={{ transform: "scaleY(0)", backgroundColor: "var(--color-btn)" }}
            />
            <div className="feedback-glitch relative">
              <p
                className="text-xl font-bold"
                style={{ color: feedbackCorrect ? "var(--color-btn)" : "#dc2626" }}
              >
                {feedbackCorrect
                  ? mockData.visionLab.feedback.correct
                  : mockData.visionLab.feedback.incorrect}
              </p>
              <p className="mt-2 text-[var(--color-text-muted)]">
                {results.correct} / {results.total} aciertos
              </p>
              <button
                type="button"
                onClick={nextRound}
                className="mt-6 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-btn)" }}
                data-cursor-magnetic
              >
                {round >= TOTAL_ROUNDS ? "Ver resultado final" : "Siguiente"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
