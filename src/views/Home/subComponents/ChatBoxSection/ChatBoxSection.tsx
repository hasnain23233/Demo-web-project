// src/pages/home/subComponents/ChatBoxSection.tsx
import { FC, useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useThemeMode } from "../../../../theme/theme";

const SUGGESTIONS = [
  "How do I build a RAG pipeline?",
  "What is an AI agent?",
  "Explain LangChain in simple terms",
  "How does vector search work?",
];

const PARTICLE_LAYERS = [
  { count: 40, speed: 0.9, maxR: 1.0,  bright: 0.22, connect: true  },
  { count: 25, speed: 0.5, maxR: 1.6,  bright: 0.35, connect: false },
  { count: 15, speed: 0.25, maxR: 2.4, bright: 0.50, connect: false },
];

const BEAMS = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * Math.PI * 2,
  length: Math.random() * 0.3 + 0.15,
  speed: (Math.random() - 0.5) * 0.003,
  alpha: Math.random() * 0.025 + 0.008,
  width: Math.random() * 0.8 + 0.3,
}));

const RINGS = Array.from({ length: 5 }, (_, i) => ({
  r: 60 + i * 55,
  speed: (0.2 + i * 0.06) * (i % 2 ? 1 : -1),
  alpha: 0.012 + i * 0.006,
  thick: 0.6 + i * 0.1,
  phase: i * Math.PI * 0.4,
}));

export const ChatBoxSection: FC = () => {
  const { mode } = useThemeMode();
  const isLight = mode === "light";

  const [focused, setFocused] = useState(false);
  const [value, setValue]     = useState("");

  const sectionRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const smoothRef   = useRef({ x: 0.5, y: 0.5 });
  const targetRef   = useRef({ x: 0.5, y: 0.5 });
  const focusedRef  = useRef(false);
  const rafRef      = useRef<number>(0);

  // ── Derived tokens ──────────────────────────────────────────────────────
  const bgColor          = isLight ? "#f5f7fb"              : "#040404";
  const labelColor       = isLight ? "#8a9ab8"              : "#333333";
  const starColor        = isLight ? "#0055ff"              : "#ffffff";
  const headlineColor    = isLight ? "#0d0d0d"              : "#ffffff";
  const subTextColor     = isLight ? "#4a4545"              : "#444444";
  const cardBg           = isLight ? "#ffffff"              : "#0e0e0e";
  const cardBorderIdle   = isLight ? "#d0dff7"              : "#1e1e1e";
  const cardBorderFocused= isLight ? "#8faad8"              : "#3a3a3a";
  const inputBg          = isLight ? "#f0f5ff"              : "#080808";
  const inputBorder      = isLight ? "#d0dff7"              : "#1e1e1e";
  const inputBorderHover = isLight ? "#8faad8"              : "#333333";
  const inputBorderFocus = isLight ? "#0a84ff"              : "#444444";
  const inputText        = isLight ? "#0d0d0d"              : "#bbbbbb";
  const placeholderColor = isLight ? "#a0aec0"              : "#333333";
  const chipBorder       = isLight ? "#d0dff7"              : "#1e1e1e";
  const chipBorderHover  = isLight ? "#8faad8"              : "#3a3a3a";
  const chipBgHover      = isLight ? "#eef3fc"              : "#0d0d0d";
  const chipText         = isLight ? "#4a5a7a"              : "#444444";
  const sendBtnActiveBg  = isLight ? "#0a1a3a"              : "#ffffff";
  const sendBtnActiveColor = isLight ? "#ffffff"            : "#000000";
  const sendBtnActiveHover = isLight ? "#0d2255"            : "#e0e0e0";
  const sendBtnIdleBg    = isLight ? "#eef3fc"              : "#111111";
  const sendBtnIdleColor = isLight ? "#a0aec0"              : "#333333";

  // Canvas colour channel
  const dc = isLight ? "0,80,200" : "255,255,255";
  const dotBase   = isLight ? 0.020 : 0.025;
  const rippleMult= isLight ? 0.05  : 0.08;
  const glowMult  = isLight ? 0.25  : 0.40;
  const lineBase  = isLight ? 0.04  : 0.07;
  const lineBoost = isLight ? 0.10  : 0.18;
  const partBright= isLight ? 0.35  : 0.60;
  const ringAlpha = isLight ? 0.55  : 1.00;

  useEffect(() => { focusedRef.current = focused; }, [focused]);

  useEffect(() => {
    const section  = sectionRef.current!;
    const canvas   = canvasRef.current!;
    const cardWrap = cardWrapRef.current!;
    const ctx      = canvas.getContext("2d")!;
    let W = 0, H = 0, time = 0;

    const particles: any[] = [];
    PARTICLE_LAYERS.forEach((L, li) => {
      for (let i = 0; i < L.count; i++) {
        particles.push({
          x: Math.random(), y: Math.random(),
          vx: (Math.random() - 0.5) * L.speed * 2e-4,
          vy: (Math.random() - 0.5) * L.speed * 2e-4,
          r: Math.random() * L.maxR + 0.3,
          phase: Math.random() * Math.PI * 2,
          layer: li, L,
        });
      }
    });

    const resize = () => {
      const r = section.getBoundingClientRect();
      W = canvas.width  = r.width  * devicePixelRatio;
      H = canvas.height = r.height * devicePixelRatio;
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      targetRef.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top)  / r.height,
      };
    };
    const onMouseLeave = () => { targetRef.current = { x: 0.5, y: 0.5 }; };

    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.008;
      smoothRef.current.x += (targetRef.current.x - smoothRef.current.x) * 0.05;
      smoothRef.current.y += (targetRef.current.y - smoothRef.current.y) * 0.05;

      const { x: sx, y: sy } = smoothRef.current;
      const tiltX = (sy - 0.5) * 0.3;
      const tiltY = (sx - 0.5) * 0.3;
      const w  = W / devicePixelRatio;
      const h  = H / devicePixelRatio;
      const mx = sx * w, my = sy * h;
      const isFoc = focusedRef.current;

      const cr  = cardWrap.getBoundingClientRect();
      const sr  = section.getBoundingClientRect();
      const ccx = cr.left + cr.width  / 2 - sr.left;
      const ccy = cr.top  + cr.height / 2 - sr.top;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      // ── Vortex rings ──
      for (const rg of RINGS) {
        const a     = rg.speed * time + rg.phase;
        const scaleY = 0.32 + tiltX * 0.1;
        ctx.beginPath();
        ctx.ellipse(
          ccx + tiltY * rg.r * 0.15,
          ccy + tiltX * rg.r * 0.1,
          rg.r, rg.r * scaleY, a, 0, Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(${dc},${(rg.alpha + (isFoc ? 0.015 : 0)) * ringAlpha})`;
        ctx.lineWidth = rg.thick;
        ctx.stroke();
        const dx = ccx + Math.cos(a * 1.8) * rg.r + tiltY * rg.r * 0.15;
        const dy = ccy + Math.sin(a * 1.8) * rg.r * scaleY + tiltX * rg.r * 0.1;
        ctx.beginPath(); ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dc},${rg.alpha * 7 * ringAlpha})`; ctx.fill();
      }

      // ── Energy beams ──
      for (const b of BEAMS) {
        b.angle += b.speed + (isFoc ? 0.002 : 0);
        const len = (isFoc ? w * 0.45 : w * 0.3) * b.length;
        const x2  = ccx + Math.cos(b.angle) * len;
        const y2  = ccy + Math.sin(b.angle) * len;
        const grad = ctx.createLinearGradient(ccx, ccy, x2, y2);
        grad.addColorStop(0,   `rgba(${dc},${b.alpha * 2.5 * ringAlpha})`);
        grad.addColorStop(0.4, `rgba(${dc},${b.alpha * ringAlpha})`);
        grad.addColorStop(1,   `rgba(${dc},0)`);
        ctx.beginPath(); ctx.moveTo(ccx, ccy); ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = b.width + (isFoc ? 0.4 : 0);
        ctx.stroke();
      }

      // ── Ripple dot grid ──
      const cols = 26, rows = 12, cw = w / cols, rh = h / rows;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const bx = c * cw, by = r * rh;
          const distC  = Math.hypot(bx - ccx, by - ccy);
          const ripple = (Math.sin(distC * 0.025 - time * 2.2) * 0.5 + 0.5);
          const wave   = Math.sin(c * 0.38 + time * 1.1) * 9 + Math.cos(r * 0.45 + time * 0.75) * 7;
          const persp  = 1 + tiltX * (r / rows - 0.5) * 0.5 + tiltY * (c / cols - 0.5) * 0.5;
          const x  = bx + tiltY * (bx - w / 2) * 0.04;
          const y  = by + wave * persp + tiltX * (by - h / 2) * 0.04;
          const dm = Math.hypot(x - mx, y - my) / 90;
          const glow = Math.max(0, 1 - dm);
          const fBoost = isFoc ? ripple * 0.12 : 0;
          ctx.beginPath();
          ctx.arc(x, y, 0.5 + glow * 2 + fBoost * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dc},${dotBase + ripple * rippleMult + glow * glowMult + fBoost})`;
          ctx.fill();
        }
      }

      // ── Layered particles ──
      for (const p of particles) {
        p.x += p.vx + Math.sin(time + p.phase) * 6e-5;
        p.y += p.vy + Math.cos(time + p.phase * 0.7) * 5e-5;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      }
      const L0 = particles.filter(p => p.layer === 0);
      for (let i = 0; i < L0.length; i++) {
        const a = L0[i], ax = a.x * w, ay = a.y * h;
        const dm = Math.hypot(ax - mx, ay - my);
        const boost = Math.max(0, 1 - dm / 100);
        for (let j = i + 1; j < L0.length; j++) {
          const b = L0[j], bx2 = b.x * w, by2 = b.y * h;
          const d = Math.hypot(ax - bx2, ay - by2);
          if (d < 80) {
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx2, by2);
            ctx.strokeStyle = `rgba(${dc},${(1 - d / 80) * lineBase + boost * lineBoost})`;
            ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        const px = p.x * w, py = p.y * h;
        const dm = Math.hypot(px - mx, py - my);
        const boost = Math.max(0, 1 - dm / 100);
        const ds = 0.6 + p.layer * 0.2;
        ctx.beginPath();
        ctx.arc(px, py, (p.r + boost * 2.5) * ds, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dc},${(p.L.bright * partBright + boost * 0.4) * ds})`;
        ctx.fill();
      }

      // ── 3D card tilt ──
      const rotX = (sy - 0.5) * 18;
      const rotY = (sx - 0.5) * -18;
      cardWrap.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, [mode]); // re-run on mode change

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: "relative",
        backgroundColor: bgColor,
        transition: "background-color 0.4s ease",
        px: { xs: "24px", sm: "48px", lg: "80px" },
        py: { xs: "72px", sm: "96px", md: "120px" },
        overflow: "hidden",
        cursor: "crosshair",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      <Box sx={{ maxWidth: "720px", mx: "auto", position: "relative", zIndex: 2 }}>

        {/* Label */}
        <Typography sx={{
          fontSize: "11px", color: labelColor, letterSpacing: "0.08em",
          textTransform: "uppercase", textAlign: "center",
          mb: "20px", fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "color 0.4s ease",
        }}>
          <Box component="span" sx={{
            width: "7px", height: "7px", background: starColor, opacity: 0.7,
            clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
            animation: "spinStar 4s linear infinite",
            "@keyframes spinStar": { to: { transform: "rotate(360deg)" } },
          }} />
          Ask anything
          <Box component="span" sx={{
            width: "7px", height: "7px", background: starColor, opacity: 0.7,
            clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
            animation: "spinStar 4s linear infinite reverse",
            "@keyframes spinStar": { to: { transform: "rotate(360deg)" } },
          }} />
        </Typography>

        {/* Headline */}
        <Typography sx={{
          fontSize: { xs: "28px", sm: "36px", md: "44px" }, fontWeight: 500,
          color: headlineColor, textAlign: "center", lineHeight: 1.15,
          letterSpacing: "-0.02em", mb: "12px", fontFamily: "'Georgia', serif",
          transition: "color 0.4s ease",
        }}>
          AI got you covered
        </Typography>

        <Typography sx={{
          fontSize: { xs: "14px", sm: "16px" }, color: subTextColor,
          textAlign: "center", maxWidth: "420px", mx: "auto",
          lineHeight: 1.65, mb: "40px",
          transition: "color 0.4s ease",
        }}>
          Smarter than your average text box — think of this as the upgrade you
          didn't know you needed.
        </Typography>

        {/* Card */}
        <Box ref={cardWrapRef} sx={{ transformStyle: "preserve-3d" }}>
          <Box sx={{
            background: cardBg,
            border: "0.5px solid",
            borderColor: focused ? cardBorderFocused : cardBorderIdle,
            borderRadius: "16px",
            p: { xs: "24px", sm: "28px" },
            transition: "border-color 0.3s, background-color 0.4s ease",
            position: "relative",
            overflow: "hidden",
            boxShadow: isLight
              ? "0 8px 32px rgba(0,60,180,0.08), 0 2px 8px rgba(0,0,0,0.04)"
              : "none",
            "&::before": focused ? {
              content: '""',
              position: "absolute", inset: "-1px", borderRadius: "17px",
              background: isLight
                ? "conic-gradient(from 0deg, transparent, rgba(0,100,255,0.06) 20%, transparent 40%)"
                : "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.06) 20%, transparent 40%)",
              animation: "borderSpin 3s linear infinite",
              zIndex: 0,
              "@keyframes borderSpin": { to: { transform: "rotate(360deg)" } },
            } : {},
          }}>
            <TextField
              fullWidth
              placeholder="Why is the sun yellow?"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              variant="outlined"
              sx={{
                position: "relative", zIndex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: inputBg,
                  color: inputText,
                  height: { xs: "48px", sm: "52px" }, px: "4px",
                  transition: "background-color 0.4s ease",
                  "& fieldset": { borderColor: inputBorder },
                  "&:hover fieldset": { borderColor: inputBorderHover },
                  "&.Mui-focused fieldset": { borderColor: inputBorderFocus, borderWidth: "0.5px" },
                },
                "& .MuiInputBase-input::placeholder": { color: placeholderColor, opacity: 1 },
                "& .MuiInputBase-input": { fontSize: "14px" },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={!value.trim()}
                        sx={{
                          backgroundColor: value.trim() ? sendBtnActiveBg : sendBtnIdleBg,
                          color: value.trim() ? sendBtnActiveColor : sendBtnIdleColor,
                          borderRadius: "8px", width: 36, height: 36, mr: "2px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: value.trim() ? sendBtnActiveHover : (isLight ? "#dce8ff" : "#1a1a1a"),
                          },
                          "&.Mui-disabled": {
                            backgroundColor: sendBtnIdleBg,
                            color: isLight ? "#b0bcd8" : "#2a2a2a",
                          },
                        }}
                      >
                        <SendIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Suggestion chips */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px", mt: "16px", position: "relative", zIndex: 1 }}>
              {SUGGESTIONS.map((s) => (
                <Box
                  key={s}
                  onClick={() => setValue(s)}
                  sx={{
                    px: "12px", py: "6px",
                    border: `0.5px solid ${chipBorder}`,
                    borderRadius: "99px", cursor: "pointer",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: chipBorderHover,
                      backgroundColor: chipBgHover,
                      transform: "translateY(-2px) translateZ(4px)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "12px", color: chipText, transition: "color 0.3s ease" }}>
                    {s}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};