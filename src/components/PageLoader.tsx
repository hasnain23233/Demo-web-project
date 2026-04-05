// src/components/PageLoader/PageLoader.tsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onFinish: () => void; }

const easeReveal = [0.76, 0, 0.24, 1] as const;

export const PageLoader = ({ onFinish }: Props) => {
  const [phase, setPhase] = useState<"loading" | "hold" | "split" | "done">("loading");
  const [pct,   setPct]   = useState(0);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  // ── Disable scroll during loader ──
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Phase sequencing ──
  useEffect(() => {
    // Fake progress bar: 0→100% over 1.8s
    const start = performance.now();
    const LOAD_DUR = 1800;
    const runBar = (now: number) => {
      const t = Math.min((now - start) / LOAD_DUR, 1);
      setPct(Math.round(easeOut(t) * 100));
      if (t < 1) rafRef.current = requestAnimationFrame(runBar);
    };
    rafRef.current = requestAnimationFrame(runBar);

    const t1 = setTimeout(() => setPhase("hold"),  1900);
    const t2 = setTimeout(() => setPhase("split"), 2500);
    const t3 = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      onFinish();
    }, 3600);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onFinish]);

  // ── 3D particle canvas on the overlay ──
  useEffect(() => {
    const canvas    = canvasRef.current!;
    const container = containerRef.current!;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, t = 0, raf = 0;

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 1.2e-4,
      vy: (Math.random() - 0.5) * 1.2e-4,
      r: Math.random() * 1.0 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      W = canvas.width  = window.innerWidth  * devicePixelRatio;
      H = canvas.height = window.innerHeight * devicePixelRatio;
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      t += 0.007;
      const w = W / devicePixelRatio, h = H / devicePixelRatio;
      ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.scale(devicePixelRatio, devicePixelRatio);

      // Wave dot grid
      const cols = 24, rows = 12, cw = w / cols, rh = h / rows;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const wave   = Math.sin(c * 0.4 + t * 1.1) * 10 + Math.cos(r * 0.45 + t * 0.7) * 8;
          const bright = 0.5 + 0.5 * Math.sin(c * 0.35 + r * 0.4 + t * 0.8);
          ctx.beginPath();
          ctx.arc(c * cw, r * rh + wave, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.02 + bright * 0.08})`;
          ctx.fill();
        }
      }

      // Particles + connections
      for (const p of pts) {
        p.x += p.vx + Math.sin(t + p.phase) * 5e-5;
        p.y += p.vy + Math.cos(t + p.phase * 0.7) * 4e-5;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], ax = a.x * w, ay = a.y * h;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], bx = b.x * w, by = b.y * h;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 100) * 0.06})`;
            ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.arc(ax, ay, a.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.fill();
      }

      // Slow orbital rings behind logo
      [{ r: 180, ry: 0.22, sp: 0.12, a: 0.025 }, { r: 260, ry: 0.18, sp: -0.08, a: 0.018 }].forEach(rg => {
        const ang = rg.sp * t;
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, rg.r, rg.r * rg.ry, ang, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${rg.a})`;
        ctx.lineWidth = 0.7; ctx.stroke();
        const dx = w / 2 + Math.cos(ang * 2) * rg.r;
        const dy = h / 2 + Math.sin(ang * 2) * rg.r * rg.ry;
        ctx.beginPath(); ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${rg.a * 6})`; ctx.fill();
      });

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        overflow: "hidden", pointerEvents: phase === "split" ? "none" : "auto",
      }}
    >
      {/* 3D canvas background */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {/* ── Logo + progress (visible during loading/hold) ── */}
      <AnimatePresence>
        {phase !== "split" && (
          <motion.div
            key="logo-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "absolute",backgroundColor: "black" , inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 0, 
            }}
          >
            {/* Glow ring behind logo */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: 280, height: 280,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 18, scale: 0.88 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 500,
                color: "#fff",
                letterSpacing: "-0.025em",
                fontFamily: "Nasalization" ,
                margin: 0,
                textShadow: "0 0 40px rgba(255,255,255,0.12)",
              }}
            >
              Fossilite AI
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              style={{
                fontSize: 11,
                color: "#444",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                margin: "10px 0 0",
                fontFamily: "Nasalization",
              }}
            >
              AI-native software
            </motion.p>

            {/* Divider line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              style={{ height: "0.5px", background: "rgba(255,255,255,0.12)", marginTop: 18 }}
            />

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              style={{
                position: "absolute", bottom: 36,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
              }}
            >
              <div style={{ width: 130, height: "0.5px", background: "#111", position: "relative", overflow: "hidden" }}>
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.1 }}
                  style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "rgba(255,255,255,0.3)" }}
                />
              </div>
              <span style={{ fontSize: 10, color: "#333", letterSpacing: "0.1em", fontFamily: "Nasalization"  }}>
                {pct}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Split panels ── */}
      <AnimatePresence>
        {phase === "split" && (
          <>
            {/* Left panel */}
            <motion.div
              key="left"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              exit={{}}
              transition={{ duration: 1.0, ease: easeReveal }}
              style={{
                position: "absolute", top: 0, left: 0,
                width: "50%", height: "100%",
                background: "#000", zIndex: 20,
              }}
            />
            {/* Right panel */}
            <motion.div
              key="right"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              exit={{}}
              transition={{ duration: 1.0, ease: easeReveal }}
              style={{
                position: "absolute", top: 0, right: 0,
                width: "50%", height: "100%",
                background: "#000", zIndex: 20,
              }}
            />

            {/* Center seam glow — flashes as the split opens */}
            <motion.div
              key="seam"
              initial={{ opacity: 0.6, scaleY: 1 }}
              animate={{ opacity: 0, scaleY: 1.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 1, height: "100%",
                background: "rgba(255,255,255,0.25)",
                zIndex: 21, pointerEvents: "none",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// small easing helper used for progress bar
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

export default PageLoader;