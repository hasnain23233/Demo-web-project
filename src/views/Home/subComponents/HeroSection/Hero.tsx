// src/pages/home/subComponents/Hero.tsx
import { FC, useEffect, useRef } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { RightArrow } from "../../../../assets/Icons";
import { motion } from "framer-motion";
import { useThemeMode } from "../../../../theme/theme";

const TECH_ITEMS = [
  "GPT-4o", "Claude API", "LangChain", "LangGraph", "CrewAI",
  "MCP Protocol", "RAG Pipelines", "AI Agents", "Pinecone", "FastAPI",
  "Next.js", "PyTorch", "HuggingFace", "Llama 4", "Mistral",
];

const GRID_COLS = 28;
const GRID_ROWS = 18;

export const Hero: FC = () => {
  const { mode } = useThemeMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const rafRef    = useRef<number>(0);

  // ── Derived tokens (mirrors FirstImageSection pattern) ──────────────────
  const isLight         = mode === "light";
  const bgColor         = isLight ? "#f5f7fb"          : "#040404";
  const cardBgColor     = isLight ? "#ffffff"          : "#080808";
  const borderColor     = isLight ? "#d0dff7"          : "#161616";
  const borderColorInner= isLight ? "#cdd8f0"          : "#1e1e1e";
  const primaryText     = isLight ? "#0d0d0d"          : "#ffffff";
  const secondaryText   = isLight ? "#4a4545"          : "#555555";
  const mutedText       = isLight ? "#8a9ab8"          : "#444444";
  const badgeBg         = isLight ? "#eef3fc"          : "#0f0f0f";
  const badgeBorder     = isLight ? "#ccd8f0"          : "#2e2e2e";
  const badgeDot        = isLight ? "#0a84ff"          : "#ffffff";
  const badgeLabel      = isLight ? "#5a6a8a"          : "#666666";

  // Canvas dot/line colour
  const dotColor        = isLight ? "0,80,200"         : "255,255,255";

  // Vignette — in light mode fade to page bg colour
  const vignette        = isLight
    ? "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #f5f7fb 100%)"
    : "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #040404 100%)";

  // Primary CTA
  const ctaPrimaryBg    = isLight ? "#0a1a3a"          : "#ffffff";
  const ctaPrimaryText  = isLight ? "#ffffff"          : "#000000";
  const ctaPrimaryHover = isLight ? "#0d2255"          : "#e0e0e0";

  // Secondary CTA
  const ctaSecBorder    = isLight ? badgeBorder        : "#2e2e2e";
  const ctaSecText      = isLight ? "#4a5a7a"          : "#777777";
  const ctaSecHoverText = isLight ? "#0d0d0d"          : "#ffffff";
  const ctaSecHoverBorder = isLight ? "#8fa0cc"        : "#555555";

  // Stats divider
  const statsDivider    = isLight ? "#d0dff7"          : "#1a1a1a";
  const statsNumColor   = isLight ? "#0d0d0d"          : "#ffffff";
  const statsLabelColor = isLight ? "#8a9ab8"          : "#444444";

  // Ticker
  const tickerBg        = isLight ? "#f5f7fb"          : "#040404";
  const tickerBorder    = isLight ? "#d0dff7"          : "#161616";
  const tickerPillBg    = isLight ? "#eef3fc"          : "#080808";
  const tickerPillBorder= isLight ? "#cdd8f0"          : "#1e1e1e";
  const tickerText      = isLight ? "#8a9ab8"          : "#444444";

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;
    let W = 0, H = 0, time = 0;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 2e-4,
      vy: (Math.random() - 0.5) * 2e-4,
      r: Math.random() * 1.2 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const r = parent.getBoundingClientRect();
      W = canvas.width  = r.width  * devicePixelRatio;
      H = canvas.height = r.height * devicePixelRatio;
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top)  / r.height,
      };
    };
    const onMouseLeave = () => { mouseRef.current = { x: 0.5, y: 0.5 }; };

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);
    resize();

    // Light mode uses blue-tinted dots; dark uses white dots
    const dc = isLight ? "0,80,200" : "255,255,255";

    // Opacity multipliers — light needs lower alpha so dots don't overpower
    const dotBaseAlpha  = isLight ? 0.035 : 0.04;
    const dotBrightMult = isLight ? 0.10  : 0.18;
    const dotGlowMult   = isLight ? 0.25  : 0.5;
    const lineBase      = isLight ? 0.06  : 0.12;
    const lineBoost     = isLight ? 0.12  : 0.25;
    const partBase      = isLight ? 0.15  : 0.25;
    const partBoost     = isLight ? 0.30  : 0.55;
    const ringAlphaMult = isLight ? 0.55  : 1;

    const RINGS = [
      { r: 300, ry: 0.18, speed:  0.25, alpha: 0.025, thick: 1   },
      { r: 220, ry: 0.22, speed: -0.20, alpha: 0.035, thick: 0.8 },
      { r: 150, ry: 0.28, speed:  0.32, alpha: 0.040, thick: 0.7 },
    ];

    const draw = () => {
      time += 0.008;
      const w   = W / devicePixelRatio;
      const h   = H / devicePixelRatio;
      const mx  = mouseRef.current.x * w;
      const my  = mouseRef.current.y * h;
      const tiltX = (mouseRef.current.y - 0.5) * 0.3;
      const tiltY = (mouseRef.current.x - 0.5) * 0.3;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      // ── 3D perspective grid ──
      const cw = w / GRID_COLS;
      const rh = h / GRID_ROWS;
      for (let r = 0; r <= GRID_ROWS; r++) {
        for (let c = 0; c <= GRID_COLS; c++) {
          const bx   = c * cw;
          const by   = r * rh;
          const wave = Math.sin(c * 0.35 + time * 1.1) * 14
                     + Math.cos(r * 0.42 + time * 0.7) * 10;
          const persp = 1 + tiltX * (r / GRID_ROWS - 0.5) * 0.6
                          + tiltY * (c / GRID_COLS - 0.5) * 0.6;
          const x = bx + tiltY * (bx - w / 2) * 0.04;
          const y = by + wave * persp + tiltX * (by - h / 2) * 0.04;
          const bright = 0.5 + 0.5 * Math.sin(c * 0.4 + r * 0.3 + time * 0.8);
          const dm  = Math.hypot(x - mx, y - my) / 120;
          const glow = Math.max(0, 1 - dm);
          ctx.beginPath();
          ctx.arc(x, y, 0.8 + glow * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dc},${dotBaseAlpha + bright * dotBrightMult + glow * dotGlowMult})`;
          ctx.fill();
        }
      }

      // ── Floating particles + connections ──
      for (const p of particles) {
        p.x += p.vx + Math.sin(time + p.phase) * 7e-5;
        p.y += p.vy + Math.cos(time + p.phase * 0.7) * 5e-5;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x * w, ay = a.y * h;
        const dm = Math.hypot(ax - mx, ay - my);
        const boost = Math.max(0, 1 - dm / 130);
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx2 = b.x * w, by2 = b.y * h;
          const d = Math.hypot(ax - bx2, ay - by2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(ax, ay); ctx.lineTo(bx2, by2);
            ctx.strokeStyle = `rgba(${dc},${(1 - d / 100) * lineBase + boost * lineBoost})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(ax, ay, a.r + boost * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dc},${partBase + boost * partBoost})`;
        ctx.fill();
      }

      // ── Tilting 3D orbital rings ──
      const cx2 = w / 2, cy2 = h * 0.42;
      for (const rg of RINGS) {
        const angle = rg.speed * time;
        const scaleY = rg.ry + tiltX * 0.08;
        ctx.beginPath();
        ctx.ellipse(
          cx2 + tiltY * rg.r * 0.15,
          cy2 + tiltX * rg.r * 0.08,
          rg.r, rg.r * scaleY, angle, 0, Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(${dc},${rg.alpha * ringAlphaMult})`;
        ctx.lineWidth = rg.thick;
        ctx.stroke();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, [mode]); // re-run when mode changes so canvas colours update

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: bgColor,
        transition: "background-color 0.4s ease",
        px: { xs: "24px", sm: "48px", lg: "80px" },
        cursor: "crosshair",
      }}
    >
      {/* ── 3D Canvas ── */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* ── Radial vignette ── */}
      <Box
        sx={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: vignette,
          transition: "background 0.4s ease",
        }}
      />

      <Stack alignItems="center" gap={3} sx={{ zIndex: 2, mt: { xs: "80px", md: 0 } }}>

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }}
        >
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: `0.5px solid ${badgeBorder}`,
            borderRadius: "99px",
            px: "14px", py: "6px",
            backgroundColor: badgeBg,
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}>
            <Box sx={{
              width: "6px", height: "6px", borderRadius: "50%",
              backgroundColor: badgeDot,
              transition: "background-color 0.4s ease",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.25 } },
            }} />
            <Typography sx={{
              fontSize: "12px", color: badgeLabel,
              letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500,
              transition: "color 0.4s ease",
            }}>
              AI-Native Software Firm
            </Typography>
          </Box>
        </motion.div>

        {/* Headline */}
        <Box>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, type: "spring", bounce: 0.3 }}
          >
            <Typography sx={{
              fontSize: { xs: "52px", sm: "72px", md: "96px", xl: "112px" },
              fontWeight: 500, lineHeight: 0.95,
              color: primaryText,
              letterSpacing: "-0.03em", fontFamily: "'Georgia', serif",
              transition: "color 0.4s ease",
            }}>
              Build
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, type: "spring", bounce: 0.3 }}
          >
            <Typography sx={{
              fontSize: { xs: "52px", sm: "72px", md: "96px", xl: "112px" },
              fontWeight: 500, lineHeight: 0.95, letterSpacing: "-0.03em",
              fontFamily: "'Georgia', serif",
              // Dark: hollow stroke effect. Light: solid muted colour (stroke looks bad on light bg)
              ...(isLight
                ? { color: "#b0b8cc" }
                : { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.4)" }
              ),
              transition: "color 0.4s ease",
            }}>
              Intelligence.
            </Typography>
          </motion.div>
        </Box>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          <Typography sx={{
            fontSize: { xs: "15px", sm: "17px" },
            color: secondaryText,
            maxWidth: "480px", lineHeight: 1.7,
            transition: "color 0.4s ease",
          }}>
            Production-grade AI, scalable applications, and agentic systems built
            for companies defining what's next.
          </Typography>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05 }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
            <Button
              component={Link} to="/contact"
              sx={{
                px: "24px", py: "12px",
                backgroundColor: ctaPrimaryBg,
                color: ctaPrimaryText,
                fontSize: "14px", fontWeight: 500, textTransform: "none",
                borderRadius: "8px",
                transition: "transform 0.2s, background-color 0.3s, color 0.3s",
                "&:hover": { backgroundColor: ctaPrimaryHover, transform: "translateY(-2px)" },
                "&:active": { transform: "translateY(0)" },
              }}
            >
              Start Your Project
            </Button>
            <Button
              component={Link} to="/solutions" endIcon={<RightArrow />}
              sx={{
                px: "24px", py: "12px",
                backgroundColor: "transparent",
                color: ctaSecText,
                fontSize: "14px", textTransform: "none",
                borderRadius: "8px",
                border: `0.5px solid ${ctaSecBorder}`,
                transition: "color 0.2s, border-color 0.2s, transform 0.2s",
                "&:hover": { color: ctaSecHoverText, borderColor: ctaSecHoverBorder, transform: "translateY(-2px)" },
                "&:active": { transform: "translateY(0)" },
              }}
            >
              View Our Work
            </Button>
          </Stack>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.25 }}
          style={{ width: "100%" }}
        >
          <Stack
            direction="row" gap={{ xs: "32px", sm: "56px" }} mt={1}
            sx={{
              borderTop: `0.5px solid ${statsDivider}`,
              pt: 3, justifyContent: "center",
              transition: "border-color 0.4s ease",
            }}
          >
            {[
              { num: "50+",  label: "Products Shipped" },
              { num: "12",   label: "Countries"        },
              { num: "100%", label: "Remote-Native"    },
            ].map(({ num, label }) => (
              <Box key={label} textAlign="center">
                <Typography sx={{
                  fontSize: { xs: "24px", sm: "32px" }, fontWeight: 500,
                  color: statsNumColor, lineHeight: 1,
                  transition: "color 0.4s ease",
                }}>
                  {num}
                </Typography>
                <Typography sx={{
                  fontSize: "12px", color: statsLabelColor,
                  mt: "6px", letterSpacing: "0.04em",
                  transition: "color 0.4s ease",
                }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </motion.div>
      </Stack>

      {/* ── Scrolling ticker ── */}
      <Box sx={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        py: "14px",
        borderTop: `0.5px solid ${tickerBorder}`,
        overflow: "hidden", zIndex: 3,
        backgroundColor: tickerBg,
        transition: "background-color 0.4s ease, border-color 0.4s ease",
      }}>
        <Box sx={{
          display: "flex", gap: "10px", width: "max-content",
          animation: "ticker 28s linear infinite",
          "@keyframes ticker": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        }}>
          {[...TECH_ITEMS, ...TECH_ITEMS].map((item, i) => (
            <Box key={i} sx={{
              px: "14px", py: "5px",
              border: `0.5px solid ${tickerPillBorder}`,
              borderRadius: "99px",
              backgroundColor: tickerPillBg,
              whiteSpace: "nowrap",
              transition: "background-color 0.4s ease, border-color 0.4s ease",
            }}>
              <Typography sx={{
                fontSize: "12px", color: tickerText,
                letterSpacing: "0.04em",
                transition: "color 0.4s ease",
              }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};