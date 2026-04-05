import { FC, useEffect, useRef, useState } from "react";
import { Box, Grid2 as Grid, Stack, Typography } from "@mui/material";
import CodeImage4LightExtraction from "../../../../assets/Images/CodeImages/CodeImage4LightExtraction.gif";
import CodeImage4Dark            from "../../../../assets/Images/CodeImages/codeImage4DarkExtraction.gif";
import CodeImage5Light           from "../../../../assets/Images/CodeImages/Code5imageLight.gif";
import CodeImage5Dark            from "../../../../assets/Images/CodeImages/codeImage5Dark.gif";
import CodeImage6Light           from "../../../../assets/Images/CodeImages/Code6imageLight.gif";
import CodeImage6Dark            from "../../../../assets/Images/CodeImages/codeImage6Dark.gif";
import { useThemeMode } from "../../../../theme/theme";

// ── Design tokens (your exact palette) ───────────────────────────────────────
const getTokens = (isDark: boolean) => ({
  bg:             isDark ? "#161616" : "#FFF4E3",
  border:         isDark ? "#2a2a2a" : "#d9c9b0",
  cardBg:         isDark ? "#1e1e1e" : "#FFFFFF",
  cardBgAlt:      isDark ? "#161616" : "#FFF4E3",
  headline:       isDark ? "#FFF4E3" : "#001932",
  headlineFaded:  isDark ? "#3a3a3a" : "#BBC0C6",
  body:           isDark ? "#BBC0C6" : "#4a4a6a",
  eyebrow:        isDark ? "#BBC0C6" : "#4a4a6a",
  divider:        isDark ? "#2a2a2a" : "#d9c9b0",
  checkBorder:    isDark ? "#2a2a2a" : "#d9c9b0",
  checkBg:        isDark ? "#161616" : "#FFF4E3",
  checkDot:       isDark ? "#BBC0C6" : "#001932",
  featureText:    isDark ? "#BBC0C6" : "#4a4a6a",
  imgBorder:      isDark ? "#2a2a2a" : "#d9c9b0",
  imgBorderHover: isDark ? "#BBC0C6" : "#001932",
  topGlow:        isDark
    ? "linear-gradient(90deg, transparent, rgba(187,192,198,0.14), transparent)"
    : "linear-gradient(90deg, transparent, rgba(0,25,50,0.22), transparent)",
  imgShadow:      isDark
    ? "0 24px 48px rgba(0,0,0,0.55)"
    : "0 12px 40px rgba(0,25,50,0.10), 0 2px 8px rgba(0,0,0,0.04)",
  boxShadow:      isDark
    ? "none"
    : "0 6px 28px rgba(0,25,50,0.07)",
  gridLine:       isDark ? "rgba(187,192,198,0.025)" : "rgba(0,25,50,0.035)",
});

const FEATURE_ITEMS = [
  "Automated data extraction",
  "Real-time processing",
  "Multi-modal support",
  "Enterprise-ready APIs",
];

// ── Shared: fires once when element enters viewport ───────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
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
  delay?: number;
  from?: "bottom" | "left" | "right" | "scale";
}
const Reveal: FC<RevealProps> = ({ children, delay = 0, from = "bottom" }) => {
  const { ref, visible } = useInView();
  const base = {
    bottom: { transform: "translateY(28px)", opacity: 0 },
    left:   { transform: "translateX(-32px)", opacity: 0 },
    right:  { transform: "translateX(32px)",  opacity: 0 },
    scale:  { transform: "scale(0.93)",        opacity: 0 },
  }[from];
  return (
    <Box
      ref={ref}
      sx={{
        transition: `opacity 0.78s cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                     transform 0.78s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...(visible ? { opacity: 1, transform: "none" } : base),
      }}
    >
      {children}
    </Box>
  );
};

// ── Image card with parallax-tilt on hover ────────────────────────────────────
interface ImageCardProps {
  src: string;
  glow: string;
  shadow: string;
  border: string;
  borderHover: string;
  cardBg: string;
  boxShadow: string;
  delay: number;
  maxW?: string | Record<string, string>;
}
const ImageCard: FC<ImageCardProps> = ({
  src, glow, shadow, border, borderHover, cardBg, boxShadow, delay, maxW,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: revealRef, visible } = useInView(0.1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    }
  };

  return (
    <Box
      ref={revealRef}
      sx={{
        flex: "1 1 0",
        maxWidth: maxW ?? { xs: "80vw", sm: "38vw" },
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(36px) scale(0.96)",
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                     transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <Box
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        sx={{
          position: "relative",
          borderRadius: "16px", overflow: "hidden",
          border: `0.5px solid ${border}`,
          backgroundColor: cardBg,
          p: { xs: 1.5, sm: 2 },
          boxShadow,
          transition: "border-color 0.3s ease, background-color 0.5s ease",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transitionProperty: "border-color, background-color, box-shadow",
          "&:hover": {
            borderColor: borderHover,
            boxShadow: shadow,
          },
          cursor: "default",
        }}
      >
        {/* Top glow line */}
        <Box sx={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "60%", height: "1px",
          background: glow, zIndex: 2,
        }} />

        <Box
          component="img"
          src={src}
          sx={{
            width: "100%", display: "block",
            borderRadius: "10px",
            border: `0.5px solid ${border}`,
            boxShadow: shadow,
            transition: "border-color 0.4s ease",
          }}
        />
      </Box>
    </Box>
  );
};

// ── Section label ─────────────────────────────────────────────────────────────
interface SectionLabelProps {
  label: string;
  index: string;
  T: ReturnType<typeof getTokens>;
}
const SectionLabel: FC<SectionLabelProps> = ({ label, index, T }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "24px" }}>
    <Typography sx={{
      fontSize: "11px", color: T.eyebrow,
      fontWeight: 500, letterSpacing: "0.08em", fontFamily: "Nasalization" ,
      transition: "color 0.4s ease",
    }}>
      {index}
    </Typography>
    <Box sx={{
      flex: 1, height: "0.5px",
      backgroundColor: T.divider,
      transition: "background-color 0.4s ease",
    }} />
    <Typography sx={{
      fontSize: "11px", color: T.eyebrow,
      letterSpacing: "0.10em", textTransform: "uppercase", fontWeight: 500,
      transition: "color 0.4s ease",
    }}>
      {label}
    </Typography>
  </Box>
);

// ── Staggered checklist item ──────────────────────────────────────────────────
const CheckItem: FC<{ item: string; delay: number; T: ReturnType<typeof getTokens>; visible: boolean }> = ({
  item, delay, T, visible,
}) => (
  <Box
    sx={{
      display: "flex", alignItems: "center", gap: "10px",
      opacity:   visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-16px)",
      transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                   transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}
  >
    <Box sx={{
      width: "16px", height: "16px", borderRadius: "4px",
      border: `0.5px solid ${T.checkBorder}`,
      backgroundColor: T.checkBg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      transition: "background-color 0.5s ease, border-color 0.5s ease",
    }}>
      <Box sx={{
        width: "6px", height: "6px", borderRadius: "2px",
        backgroundColor: T.checkDot,
        transition: "background-color 0.4s ease",
      }} />
    </Box>
    <Typography sx={{
      fontSize: "13px", color: T.featureText,
      lineHeight: 1.5, transition: "color 0.4s ease",
    }}>
      {item}
    </Typography>
  </Box>
);

// ── Main component ────────────────────────────────────────────────────────────
export const SecondImageSection: FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const T = getTokens(isDark);

  const CodeImage4 = isDark ? CodeImage4Dark : CodeImage4LightExtraction;
  const CodeImage5 = isDark ? CodeImage5Dark : CodeImage5Light;
  const CodeImage6 = isDark ? CodeImage6Dark : CodeImage6Light;

  const { ref: checkRef, visible: checkVisible } = useInView(0.2);

  return (
    <Box sx={{
      backgroundColor: T.bg,
      px: { xs: "24px", sm: "48px", lg: "80px" },
      py: { xs: "80px", sm: "100px", md: "130px" },
      position: "relative", overflow: "hidden",
      transition: "background-color 0.5s ease",
    }}>

      {/* Subtle background grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(${T.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${T.gridLine} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      <Box   sx={{ position: "relative", zIndex: 1 }}>

        {/* ══ BLOCK 1 — Text left, Image right ══════════════════════════════ */}
        <Grid id="resources" container spacing={{ xs: 6, md: 10 }} alignItems="center">

          {/* Left: text */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal from="left" delay={0}>
              <SectionLabel label="Capabilities" index="03" T={T} />
            </Reveal>

            <Stack direction="column" gap={3}>
              <Reveal from="left" delay={80}>
                <Typography sx={{
                  fontSize: { xs: "28px", sm: "36px", md: "44px" },
                  fontWeight: 600, color: T.headline,
                  lineHeight: 1.1, letterSpacing: "-0.02em",
                  fontFamily: "Nasalization" ,
                  transition: "color 0.4s ease",
                }}>
                  Intelligent extraction,{" "}
                  <Box component="span" sx={{
                    color: T.headlineFaded,
                    transition: "color 0.4s ease",
                  }}>
                    at any scale.
                  </Box>
                </Typography>
              </Reveal>

              {[
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
                "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
              ].map((text, i) => (
                <Reveal key={i} from="left" delay={160 + i * 80}>
                  <Typography sx={{
                    fontSize: "15px", color: T.body,
                    lineHeight: 1.85, maxWidth: "440px",
                    transition: "color 0.4s ease",
                  }}>
                    {text}
                  </Typography>
                </Reveal>
              ))}
            </Stack>

            {/* Checklist — staggered on scroll */}
            <Box
              ref={checkRef}
              sx={{
                mt: "36px", pt: "28px",
                borderTop: `0.5px solid ${T.divider}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                transition: "border-color 0.4s ease",
              }}
            >
              {FEATURE_ITEMS.map((item, i) => (
                <CheckItem
                  key={item}
                  item={item}
                  delay={i * 90}
                  T={T}
                  visible={checkVisible}
                />
              ))}
            </Box>
          </Grid>

          {/* Right: image with tilt */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ImageCard
              src={CodeImage4}
              glow={T.topGlow}
              shadow={T.imgShadow}
              border={T.imgBorder}
              borderHover={T.imgBorderHover}
              cardBg={T.cardBg}
              boxShadow={T.boxShadow}
              delay={200}
              maxW={{ xs: "90%", md: "90%" }}
            />
          </Grid>
        </Grid>

        {/* ══ DIVIDER ════════════════════════════════════════════════════════ */}
        <Box sx={{
          my: { xs: "80px", sm: "100px", md: "130px" },
          height: "0.5px",
          backgroundColor: T.divider,
          transition: "background-color 0.4s ease",
        }} />

        {/* ══ BLOCK 2 — Centred heading + side-by-side images ════════════════ */}
        <Stack id="use-cases" direction="column" alignItems="center" gap={0}>

          <Reveal delay={0}>
            <Typography sx={{
              fontSize: "11px", color: T.eyebrow,
              letterSpacing: "0.10em", textTransform: "uppercase",
              fontWeight: 500, mb: "20px",
              transition: "color 0.4s ease",
            }}>
              ✦ In action
            </Typography>
          </Reveal>

          <Reveal delay={80}>
            <Typography sx={{
              fontSize: { xs: "28px", sm: "40px", md: "52px" },
              fontWeight: 600, color: T.headline,
              lineHeight: 1.1, letterSpacing: "-0.02em",
              fontFamily: "Nasalization",
              textAlign: "center", maxWidth: "640px", mb: "16px",
              transition: "color 0.4s ease",
            }}>
              See it work in{" "}
              <Box component="span" sx={{ color: T.headlineFaded, transition: "color 0.4s ease" }}>
                real time.
              </Box>
            </Typography>
          </Reveal>

          <Reveal delay={160}>
            <Typography sx={{
              fontSize: { xs: "14px", sm: "16px" }, color: T.body,
              textAlign: "center", maxWidth: "480px",
              lineHeight: 1.75, mb: { xs: "40px", sm: "56px" },
              fontFamily: "Nasalization", fontStyle: "italic",
              transition: "color 0.4s ease",
            }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text ever
              since.
            </Typography>
          </Reveal>

          {/* Side-by-side image cards with tilt */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={{ xs: 3, xl: 5 }}
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            {[CodeImage5, CodeImage6].map((src, i) => (
              <ImageCard
                key={i}
                src={src}
                glow={T.topGlow}
                shadow={T.imgShadow}
                border={T.imgBorder}
                borderHover={T.imgBorderHover}
                cardBg={T.cardBg}
                boxShadow={T.boxShadow}
                delay={i * 120}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};