import { FC, useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { RightArrow } from "../../../../assets/Icons";
import { useThemeMode } from "../../../../theme/theme";

// ── Design tokens (your exact palette) ───────────────────────────────────────
const getTokens = (isDark: boolean) => ({
  bg:               isDark ? "#161616" : "#FFF4E3",
  border:           isDark ? "#2a2a2a" : "#d9c9b0",
  eyebrow:          isDark ? "#BBC0C6" : "#4a4a6a",
  headline:         isDark ? "#FFF4E3" : "#001932",
  headlineStroke:   isDark ? "rgba(255,244,227,0.18)" : undefined,
  headlineFaded:    isDark ? "#3a3a3a" : "#BBC0C6",
  subText:          isDark ? "#BBC0C6" : "#4a4a6a",
  statsDivider:     isDark ? "#2a2a2a" : "#d9c9b0",
  statsNum:         isDark ? "#FFF4E3" : "#001932",
  statsLabel:       isDark ? "#BBC0C6" : "#4a4a6a",
  gridLine:         isDark ? "rgba(187,192,198,0.03)" : "rgba(0,25,50,0.04)",
  radialGlow:       isDark
    ? "radial-gradient(ellipse at center, rgba(187,192,198,0.06) 0%, transparent 65%)"
    : "radial-gradient(ellipse at center, rgba(0,25,50,0.06) 0%, transparent 65%)",
  ctaPrimaryBg:     isDark ? "#FFF4E3" : "#001932",
  ctaPrimaryText:   isDark ? "#001932" : "#FFF4E3",
  ctaPrimaryHover:  isDark ? "#e0d8cc" : "#0a2a4a",
  ctaPrimaryIcon:   isDark ? "none"    : "invert(1)",
  ctaSecBorder:     isDark ? "#2a2a2a" : "#d9c9b0",
  ctaSecText:       isDark ? "#BBC0C6" : "#4a4a6a",
  ctaSecHoverText:  isDark ? "#FFF4E3" : "#001932",
  ctaSecHoverBorder:isDark ? "#BBC0C6" : "#001932",
});

// ── Tiny hook: fires once when element enters viewport ────────────────────────
function useInView(threshold = 0.15) {
  const ref  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Animated reveal wrapper ───────────────────────────────────────────────────
interface RevealProps {
  children: React.ReactNode;
  delay?: number;   // ms
  from?: "bottom" | "left" | "right" | "scale";
}
const Reveal: FC<RevealProps> = ({ children, delay = 0, from = "bottom" }) => {
  const { ref, visible } = useInView();
  const base = {
    bottom: { transform: "translateY(28px)", opacity: 0 },
    left:   { transform: "translateX(-28px)", opacity: 0 },
    right:  { transform: "translateX(28px)",  opacity: 0 },
    scale:  { transform: "scale(0.94)",        opacity: 0 },
  }[from];
  return (
    <Box
      ref={ref}
      sx={{
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                     transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...(visible ? { opacity: 1, transform: "none" } : base),
      }}
    >
      {children}
    </Box>
  );
};

// ── Animated counter ──────────────────────────────────────────────────────────
const AnimatedNumber: FC<{ target: string; color: string; visible: boolean; delay: number }> = ({
  target, color, visible, delay,
}) => {
  const [display, setDisplay] = useState("0");

  // Derived values computed outside the effect so they are stable references
  // and can be safely listed in the dependency array.
  const numMatch   = /^\d+/.test(target);
  const num        = numMatch ? parseInt(target, 10) : 0;
  const suffix     = target.replace(/^\d+/, ""); // e.g. "+" or " wks" or ""

  useEffect(() => {
    // Non-numeric targets (e.g. "6 wks" won't parse cleanly) — show as-is.
    if (!visible) return;
    if (!numMatch) { setDisplay(target); return; }

    let rafId: number;
    let start: number | null = null;
    const duration = 1200;

    const step = (ts: number) => {
      if (!start) start = ts;
      const prog  = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setDisplay(`${Math.round(eased * num)}${suffix}`);
      if (prog < 1) { rafId = requestAnimationFrame(step); }
    };

    const timer = setTimeout(() => { rafId = requestAnimationFrame(step); }, delay);

    // Cleanup: cancel both the timeout and any pending RAF
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [visible, target, delay, numMatch, num, suffix]);

  return (
    <Typography sx={{
      fontSize: { xs: "22px", sm: "28px" }, fontWeight: 500,
      color, lineHeight: 1,
      transition: "color 0.4s ease",
      fontVariantNumeric: "tabular-nums",
    }}>
      {display}
    </Typography>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export const SecondGeneralSection: FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const T = getTokens(isDark);

  // Stats counter fires once when the strip enters view
  const { ref: statsRef, visible: statsVisible } = useInView(0.3);

  const STATS = [
    { num: "50+",   label: "Clients shipped"   },
    { num: "12+",   label: "Countries"         },
    { num: "6 wks", label: "Avg. MVP delivery" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: T.bg,
        borderTop: `0.5px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
        px: { xs: "24px", sm: "48px", lg: "80px" },
        py: { xs: "100px", sm: "130px", md: "160px" },
        transition: "background-color 0.5s ease, border-color 0.5s ease",
      }}
    >
      {/* Background grid */}
      <Box sx={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(${T.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${T.gridLine} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        zIndex: 0, pointerEvents: "none",
      }} />

      {/* Centre radial glow */}
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "400px",
        background: T.radialGlow,
        zIndex: 0, pointerEvents: "none",
        transition: "background 0.5s ease",
      }} />

      {/* Content */}
      <Stack alignItems="center" textAlign="center" gap={4} sx={{ position: "relative", zIndex: 2 }}>

        {/* Eyebrow */}
        <Reveal delay={0}>
          <Typography sx={{
            fontSize: "11px", color: T.eyebrow,
            letterSpacing: "0.10em", textTransform: "uppercase", fontWeight: 500,
            transition: "color 0.4s ease",
          }}>
            ✦ Let's talk
          </Typography>
        </Reveal>

        {/* Headline block */}
        <Box>
          <Reveal delay={80}>
            <Typography sx={{
              fontSize: { xs: "36px", sm: "52px", md: "72px", lg: "88px" },
              fontWeight: 600, color: T.headline,
              lineHeight: 0.95, letterSpacing: "-0.03em",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              transition: "color 0.4s ease",
            }}>
              Ready to ship
            </Typography>
          </Reveal>

          <Reveal delay={160}>
            <Typography sx={{
              fontSize: { xs: "36px", sm: "52px", md: "72px", lg: "88px" },
              fontWeight: 600, lineHeight: 0.95, letterSpacing: "-0.03em",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              ...(isDark
                ? { color: "transparent", WebkitTextStroke: `1.5px ${T.headlineStroke}` }
                : { color: T.headlineFaded }
              ),
              transition: "color 0.4s ease",
            }}>
              production AI?
            </Typography>
          </Reveal>
        </Box>

        {/* Subtext */}
        <Reveal delay={240}>
          <Typography sx={{
            fontSize: { xs: "14px", sm: "16px" }, color: T.subText,
            maxWidth: "440px", lineHeight: 1.8,
            fontFamily: "'Georgia', serif", fontStyle: "italic",
            transition: "color 0.4s ease",
          }}>
            We build architecture first, ship with discipline, and deliver
            production-grade AI systems that matter. Let's start with a
            conversation.
          </Typography>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={320} from="scale">
          <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
            <Button
              component={Link} to="/contact" endIcon={<RightArrow />}
              sx={{
                px: "28px", py: "13px",
                backgroundColor: T.ctaPrimaryBg,
                color:           T.ctaPrimaryText,
                fontSize: "14px", fontWeight: 500,
                textTransform: "none", borderRadius: "8px",
                letterSpacing: "0.01em",
                transition: "background-color 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: isDark
                  ? "0 4px 20px rgba(255,244,227,0.12)"
                  : "0 4px 20px rgba(0,25,50,0.18)",
                "&:hover": {
                  backgroundColor: T.ctaPrimaryHover,
                  transform: "translateY(-2px)",
                  boxShadow: isDark
                    ? "0 8px 32px rgba(255,244,227,0.18)"
                    : "0 8px 32px rgba(0,25,50,0.26)",
                },
                "&:active": { transform: "scale(0.97)" },
                "& .MuiButton-endIcon svg": { filter: T.ctaPrimaryIcon },
              }}
            >
              Contact Us Now
            </Button>

            <Button
              component={Link} to="/about"
              sx={{
                px: "28px", py: "13px",
                backgroundColor: "transparent",
                color: T.ctaSecText,
                fontSize: "14px", fontWeight: 400,
                textTransform: "none", borderRadius: "8px",
                border: `0.5px solid ${T.ctaSecBorder}`,
                letterSpacing: "0.01em",
                transition: "color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  color:       T.ctaSecHoverText,
                  borderColor: T.ctaSecHoverBorder,
                  transform:   "translateY(-2px)",
                },
                "&:active": { transform: "scale(0.97)" },
              }}
            >
              Learn about us
            </Button>
          </Stack>
        </Reveal>

        {/* Social proof strip — animated counters */}
        <Box
          ref={statsRef}
          sx={{
            mt: "16px", pt: "32px",
            borderTop: `0.5px solid ${T.statsDivider}`,
            width: "100%", maxWidth: "560px",
            display: "flex", justifyContent: "center",
            gap: { xs: "28px", sm: "56px" },
            transition: "border-color 0.4s ease",
          }}
        >
          {STATS.map(({ num, label }, i) => (
            <Box
              key={label}
              textAlign="center"
              sx={{
                opacity:   statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms,
                             transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms`,
              }}
            >
              <AnimatedNumber
                target={num}
                color={T.statsNum}
                visible={statsVisible}
                delay={i * 120}
              />
              <Typography sx={{
                fontSize: "11px", color: T.statsLabel,
                mt: "6px", letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "color 0.4s ease",
              }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

      </Stack>
    </Box>
  );
};