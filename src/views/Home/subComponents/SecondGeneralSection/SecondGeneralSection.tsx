import { FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { RightArrow } from "../../../../assets/Icons";
import { useThemeMode } from "../../../../theme/theme";

// ── Design tokens ─────────────────────────────────────────────────────────────
// Dark  → client-requested deep navy + white palette
// Light → clean white + navy (cleanly inverted mirror)
const getTokens = (isDark: boolean) => ({
  bg:               isDark ? "#000c2e" : "#f0f4ff",
  border:           isDark ? "#1a2a5e" : "#c2d0f0",
  eyebrow:          isDark ? "#5a7ab5" : "#5a7ab5",
  headline:         isDark ? "#ffffff" : "#000c2e",
  headlineStroke:   isDark ? "rgba(255,255,255,0.18)" : undefined,
  headlineFaded:    isDark ? "#2e4a8a" : "#a0aec0",
  subText:          isDark ? "#6b7fa8" : "#3a4e78",
  statsDivider:     isDark ? "#1a2a5e" : "#c2d0f0",
  statsNum:         isDark ? "#ffffff" : "#000c2e",
  statsLabel:       isDark ? "#5a7ab5" : "#5a7ab5",
  gridLine:         isDark ? "rgba(74,158,255,0.04)" : "rgba(0,40,160,0.04)",
  radialGlow:       isDark
    ? "radial-gradient(ellipse at center, rgba(74,158,255,0.08) 0%, transparent 65%)"
    : "radial-gradient(ellipse at center, rgba(0,40,160,0.07) 0%, transparent 65%)",
  // Primary CTA
  ctaPrimaryBg:     isDark ? "#ffffff" : "#000c2e",
  ctaPrimaryText:   isDark ? "#000c2e" : "#ffffff",
  ctaPrimaryHover:  isDark ? "#e0e8ff" : "#0d2255",
  ctaPrimaryIcon:   isDark ? "invert(1)" : "none",
  // Secondary CTA
  ctaSecBorder:     isDark ? "#1a2a5e" : "#c2d0f0",
  ctaSecText:       isDark ? "#6b7fa8" : "#3a4e78",
  ctaSecHoverText:  isDark ? "#ffffff" : "#000c2e",
  ctaSecHoverBorder:isDark ? "#4a7fff" : "#7a9ad8",
});

export const SecondGeneralSection: FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const T = getTokens(isDark);

  return (
    <Box
      sx={{
        backgroundColor: T.bg,
        borderTop: `0.5px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
        px: { xs: "24px", sm: "48px", lg: "80px" },
        py: { xs: "100px", sm: "130px", md: "160px" },
        transition: "background-color 0.4s ease, border-color 0.4s ease",
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
      }} />

      {/* Content */}
      <Stack alignItems="center" textAlign="center" gap={4} sx={{ position: "relative", zIndex: 2 }}>

        {/* Eyebrow */}
        <Typography sx={{
          fontSize: "11px", color: T.eyebrow,
          letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
          transition: "color 0.4s ease",
        }}>
          ✦ Let's talk
        </Typography>

        {/* Headline */}
        <Box>
          <Typography sx={{
            fontSize: { xs: "36px", sm: "52px", md: "72px", lg: "88px" },
            fontWeight: 500, color: T.headline,
            lineHeight: 0.95, letterSpacing: "-0.03em",
            fontFamily: "'Georgia', serif",
            transition: "color 0.4s ease",
          }}>
            Ready to ship
          </Typography>
          <Typography sx={{
            fontSize: { xs: "36px", sm: "52px", md: "72px", lg: "88px" },
            fontWeight: 500, lineHeight: 0.95, letterSpacing: "-0.03em",
            fontFamily: "'Georgia', serif",
            // Dark: hollow stroke text. Light: solid muted navy tone.
            ...(isDark
              ? { color: "transparent", WebkitTextStroke: `1px ${T.headlineStroke}` }
              : { color: T.headlineFaded }
            ),
            transition: "color 0.4s ease",
          }}>
            production AI?
          </Typography>
        </Box>

        {/* Subtext */}
        <Typography sx={{
          fontSize: { xs: "14px", sm: "16px" }, color: T.subText,
          maxWidth: "440px", lineHeight: 1.75,
          transition: "color 0.4s ease",
        }}>
          We build architecture first, ship with discipline, and deliver
          production-grade AI systems that matter. Let's start with a
          conversation.
        </Typography>

        {/* CTAs */}
        <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
          <Button
            component={Link} to="/contact" endIcon={<RightArrow />}
            sx={{
              px: "24px", py: "12px",
              backgroundColor: T.ctaPrimaryBg,
              color: T.ctaPrimaryText,
              fontSize: "14px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              letterSpacing: "0.01em",
              transition: "background-color 0.3s ease",
              "&:hover": { backgroundColor: T.ctaPrimaryHover },
              "& .MuiButton-endIcon svg": { filter: T.ctaPrimaryIcon },
            }}
          >
            Contact Us Now
          </Button>
          <Button
            component={Link} to="/about"
            sx={{
              px: "24px", py: "12px",
              backgroundColor: "transparent",
              color: T.ctaSecText,
              fontSize: "14px", fontWeight: 400,
              textTransform: "none", borderRadius: "8px",
              border: `0.5px solid ${T.ctaSecBorder}`,
              letterSpacing: "0.01em",
              transition: "color 0.2s ease, border-color 0.2s ease",
              "&:hover": { color: T.ctaSecHoverText, borderColor: T.ctaSecHoverBorder },
            }}
          >
            Learn about us
          </Button>
        </Stack>

        {/* Social proof strip */}
        <Box sx={{
          mt: "16px", pt: "32px",
          borderTop: `0.5px solid ${T.statsDivider}`,
          width: "100%", maxWidth: "560px",
          display: "flex", justifyContent: "center",
          gap: { xs: "28px", sm: "48px" },
          transition: "border-color 0.4s ease",
        }}>
          {[
            { num: "50+",    label: "Clients shipped"    },
            { num: "12+",    label: "Countries"          },
            { num: "6 wks",  label: "Avg. MVP delivery"  },
          ].map(({ num, label }) => (
            <Box key={label} textAlign="center">
              <Typography sx={{
                fontSize: { xs: "18px", sm: "24px" }, fontWeight: 500,
                color: T.statsNum, lineHeight: 1,
                transition: "color 0.4s ease",
              }}>
                {num}
              </Typography>
              <Typography sx={{
                fontSize: "11px", color: T.statsLabel,
                mt: "6px", letterSpacing: "0.04em",
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