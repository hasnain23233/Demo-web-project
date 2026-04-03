import { FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { RightArrow } from "../../../../assets/Icons";
import { useThemeMode } from "../../../../theme/theme";

export const SecondGeneralSection: FC = () => {
  const { mode } = useThemeMode();
  const isLight = mode === "light";

  // ── Derived tokens ──────────────────────────────────────────────────────
  const bgColor          = isLight ? "#f0f5ff"   : "#080808";
  const borderColor      = isLight ? "#d0dff7"   : "#1a1a1a";
  const eyebrowColor     = isLight ? "#8a9ab8"   : "#444444";
  const headlineColor    = isLight ? "#0d0d0d"   : "#ffffff";
  const subTextColor     = isLight ? "#4a4545"   : "#555555";
  const statsDivider     = isLight ? "#d0dff7"   : "#1a1a1a";
  const statsNumColor    = isLight ? "#0d0d0d"   : "#ffffff";
  const statsLabelColor  = isLight ? "#8a9ab8"   : "#444444";

  // Background grid lines
  const gridLineColor    = isLight
    ? "rgba(0,80,200,0.04)"
    : "rgba(255,255,255,0.025)";

  // Radial glow
  const radialGlow       = isLight
    ? "radial-gradient(ellipse at center, rgba(0,80,200,0.06) 0%, transparent 65%)"
    : "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 65%)";

  // Primary CTA
  const ctaPrimaryBg     = isLight ? "#0a1a3a"   : "#ffffff";
  const ctaPrimaryText   = isLight ? "#ffffff"   : "#000000";
  const ctaPrimaryHover  = isLight ? "#0d2255"   : "#e0e0e0";
  const ctaPrimaryIcon   = isLight ? "none"      : "invert(1)";

  // Secondary CTA
  const ctaSecBorder     = isLight ? "#ccd8f0"   : "#2e2e2e";
  const ctaSecText       = isLight ? "#4a5a7a"   : "#666666";
  const ctaSecHoverText  = isLight ? "#0d0d0d"   : "#ffffff";
  const ctaSecHoverBorder= isLight ? "#8faad8"   : "#555555";

  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        borderTop: `0.5px solid ${borderColor}`,
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
          linear-gradient(${gridLineColor} 1px, transparent 1px),
          linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        zIndex: 0, pointerEvents: "none",
      }} />

      {/* Center radial glow */}
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "400px",
        background: radialGlow,
        zIndex: 0, pointerEvents: "none",
      }} />

      {/* Content */}
      <Stack alignItems="center" textAlign="center" gap={4} sx={{ position: "relative", zIndex: 2 }}>

        {/* Eyebrow */}
        <Typography sx={{
          fontSize: "11px", color: eyebrowColor,
          letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
          transition: "color 0.4s ease",
        }}>
          ✦ Let's talk
        </Typography>

        {/* Headline */}
        <Box>
          <Typography sx={{
            fontSize: { xs: "36px", sm: "52px", md: "72px", lg: "88px" },
            fontWeight: 500, color: headlineColor,
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
            // Dark: hollow stroke. Light: solid muted colour
            ...(isLight
              ? { color: "#b0b8cc" }
              : { color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.3)" }
            ),
            transition: "color 0.4s ease",
          }}>
            production AI?
          </Typography>
        </Box>

        {/* Subtext */}
        <Typography sx={{
          fontSize: { xs: "14px", sm: "16px" }, color: subTextColor,
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
              backgroundColor: ctaPrimaryBg,
              color: ctaPrimaryText,
              fontSize: "14px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              letterSpacing: "0.01em",
              transition: "background-color 0.3s ease",
              "&:hover": { backgroundColor: ctaPrimaryHover },
              "& .MuiButton-endIcon svg": { filter: ctaPrimaryIcon },
            }}
          >
            Contact Us Now
          </Button>
          <Button
            component={Link} to="/about"
            sx={{
              px: "24px", py: "12px",
              backgroundColor: "transparent",
              color: ctaSecText,
              fontSize: "14px", fontWeight: 400,
              textTransform: "none", borderRadius: "8px",
              border: `0.5px solid ${ctaSecBorder}`,
              letterSpacing: "0.01em",
              transition: "color 0.2s, border-color 0.2s",
              "&:hover": { color: ctaSecHoverText, borderColor: ctaSecHoverBorder },
            }}
          >
            Learn about us
          </Button>
        </Stack>

        {/* Social proof strip */}
        <Box sx={{
          mt: "16px", pt: "32px",
          borderTop: `0.5px solid ${statsDivider}`,
          width: "100%", maxWidth: "560px",
          display: "flex", justifyContent: "center",
          gap: { xs: "28px", sm: "48px" },
          transition: "border-color 0.4s ease",
        }}>
          {[
            { num: "50+",  label: "Clients shipped" },
            { num: "12+",  label: "Countries" },
            { num: "6 wks", label: "Avg. MVP delivery" },
          ].map(({ num, label }) => (
            <Box key={label} textAlign="center">
              <Typography sx={{
                fontSize: { xs: "18px", sm: "24px" }, fontWeight: 500,
                color: statsNumColor, lineHeight: 1,
                transition: "color 0.4s ease",
              }}>
                {num}
              </Typography>
              <Typography sx={{
                fontSize: "11px", color: statsLabelColor,
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