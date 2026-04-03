import { FC } from "react";
import { Box, Grid2 as Grid, Stack, Typography } from "@mui/material";
import CodeImage4LightExtraction from "../../../../assets/Images/CodeImages/CodeImage4LightExtraction.gif";
import CodeImage4Dark from "../../../../assets/Images/CodeImages/codeImage4DarkExtraction.gif";
import CodeImage5Light from "../../../../assets/Images/CodeImages/Code5imageLight.gif";
import CodeImage5Dark from "../../../../assets/Images/CodeImages/codeImage5Dark.gif";
import CodeImage6Light from "../../../../assets/Images/CodeImages/Code6imageLight.gif";
import CodeImage6Dark from "../../../../assets/Images/CodeImages/codeImage6Dark.gif";
import { useThemeMode } from "../../../../theme/theme";

const FEATURE_ITEMS = [
  "Automated data extraction",
  "Real-time processing",
  "Multi-modal support",
  "Enterprise-ready APIs",
];

// ── Design tokens ─────────────────────────────────────────────────────────────
// Dark  → client-requested deep navy + white palette
// Light → clean white + navy (cleanly inverted mirror)
const getTokens = (isDark: boolean) => ({
  bg:            isDark ? "#000c2e" : "#f0f4ff",
  border:        isDark ? "#1a2a5e" : "#c2d0f0",
  cardBg:        isDark ? "#000c2e" : "#ffffff",
  cardBgAlt:     isDark ? "#020e38" : "#f8faff",
  headline:      isDark ? "#ffffff" : "#000c2e",
  headlineFaded: isDark ? "#2e4a8a" : "#a0aec0",
  body:          isDark ? "#6b7fa8" : "#3a4e78",
  eyebrow:       isDark ? "#5a7ab5" : "#5a7ab5",
  divider:       isDark ? "#1a2a5e" : "#c2d0f0",
  checkBorder:   isDark ? "#1a2a5e" : "#c2d0f0",
  checkBg:       isDark ? "#020e38" : "#eef3fc",
  checkDot:      isDark ? "#4a7fff" : "#5a7ab5",
  featureText:   isDark ? "#6b7fa8" : "#3a4e78",
  stroke:        isDark ? "rgba(255,255,255,0.10)" : "rgba(0,12,46,0.10)",
  imgBorder:     isDark ? "#1a2a5e" : "#c2d0f0",
  imgBorderHover:isDark ? "#4a7fff" : "#7a9ad8",
  topGlow:       isDark
    ? "linear-gradient(90deg, transparent, rgba(74,158,255,0.18), transparent)"
    : "linear-gradient(90deg, transparent, rgba(0,85,204,0.25), transparent)",
  imgShadow:     isDark
    ? "0 32px 64px rgba(0,0,0,0.5)"
    : "0 16px 48px rgba(0,40,160,0.09), 0 4px 12px rgba(0,0,0,0.05)",
  boxShadow:     isDark
    ? "none"
    : "0 8px 32px rgba(0,40,160,0.07)",
});

// ── Section label ─────────────────────────────────────────────────────────────
interface SectionLabelProps {
  label: string;
  index: string;
  tokens: ReturnType<typeof getTokens>;
}

const SectionLabel: FC<SectionLabelProps> = ({ label, index, tokens: T }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "20px" }}>
    <Typography sx={{
      fontSize: "11px", color: T.eyebrow,
      fontWeight: 500, letterSpacing: "0.06em", fontFamily: "monospace",
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
      letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
      transition: "color 0.4s ease",
    }}>
      {label}
    </Typography>
  </Box>
);

// ── Top glow line ─────────────────────────────────────────────────────────────
const TopGlow: FC<{ glow: string }> = ({ glow }) => (
  <Box sx={{
    position: "absolute", top: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "60%", height: "1px",
    background: glow,
    zIndex: 2,
  }} />
);

// ── Main component ────────────────────────────────────────────────────────────
export const SecondImageSection: FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const T = getTokens(isDark);

  const CodeImage4 = isDark ? CodeImage4Dark           : CodeImage4LightExtraction;
  const CodeImage5 = isDark ? CodeImage5Dark           : CodeImage5Light;
  const CodeImage6 = isDark ? CodeImage6Dark           : CodeImage6Light;

  return (
    <Box sx={{
      backgroundColor: T.bg,
      px: { xs: "24px", sm: "48px", lg: "80px" },
      py: { xs: "80px", sm: "100px", md: "130px" },
      transition: "background-color 0.4s ease",
    }}>

      {/* ══════════════════════════════════════
          BLOCK 1 — Text left, Image right
      ══════════════════════════════════════ */}
      <Grid container spacing={{ xs: 6, md: 12 }} alignItems="center">

        {/* Left: text + feature list */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel label="Capabilities" index="03" tokens={T} />
          <Stack direction="column" gap={3}>
            <Typography sx={{
              fontSize: { xs: "28px", sm: "36px", md: "42px" },
              fontWeight: 500, color: T.headline,
              lineHeight: 1.15, letterSpacing: "-0.02em",
              fontFamily: "'Georgia', serif",
              transition: "color 0.4s ease",
            }}>
              Intelligent extraction,{" "}
              <Box component="span" sx={{ color: T.headlineFaded, transition: "color 0.4s ease" }}>
                at any scale.
              </Box>
            </Typography>
            {[
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
              "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            ].map((text, i) => (
              <Typography key={i} sx={{
                fontSize: "15px", color: T.body,
                lineHeight: 1.8, maxWidth: "440px",
                transition: "color 0.4s ease",
              }}>
                {text}
              </Typography>
            ))}
          </Stack>

          {/* Feature checklist */}
          <Box sx={{
            mt: "36px", pt: "28px",
            borderTop: `0.5px solid ${T.divider}`,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px",
            transition: "border-color 0.4s ease",
          }}>
            {FEATURE_ITEMS.map((item) => (
              <Box key={item} sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box sx={{
                  width: "16px", height: "16px", borderRadius: "4px",
                  border: `0.5px solid ${T.checkBorder}`,
                  backgroundColor: T.checkBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "background-color 0.4s ease, border-color 0.4s ease",
                }}>
                  <Box sx={{
                    width: "6px", height: "6px", borderRadius: "2px",
                    backgroundColor: T.checkDot,
                    transition: "background-color 0.4s ease",
                  }} />
                </Box>
                <Typography sx={{
                  fontSize: "13px", color: T.featureText,
                  lineHeight: 1.4, transition: "color 0.4s ease",
                }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right: image card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{
            position: "relative",
            display: "flex", justifyContent: "center", alignItems: "center",
            borderRadius: "16px", overflow: "hidden",
            border: `0.5px solid ${T.imgBorder}`,
            backgroundColor: T.cardBg,
            p: { xs: 2, sm: 3 },
            boxShadow: T.boxShadow,
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}>
            <TopGlow glow={T.topGlow} />
            <Box
              component="img" src={CodeImage4}
              sx={{
                width: { xs: "80vw", sm: "38vw", md: "30vw" },
                borderRadius: "10px",
                border: `0.5px solid ${T.imgBorder}`,
                boxShadow: T.imgShadow,
                transition: "border-color 0.4s ease",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* ══════════════════════════════════════
          DIVIDER
      ══════════════════════════════════════ */}
      <Box sx={{
        my: { xs: "80px", sm: "100px", md: "130px" },
        height: "0.5px",
        backgroundColor: T.divider,
        transition: "background-color 0.4s ease",
      }} />

      {/* ══════════════════════════════════════
          BLOCK 2 — Centred heading + side-by-side images
      ══════════════════════════════════════ */}
      <Stack direction="column" alignItems="center" gap={0}>
        <Typography sx={{
          fontSize: "11px", color: T.eyebrow,
          letterSpacing: "0.08em", textTransform: "uppercase",
          fontWeight: 500, mb: "20px",
          transition: "color 0.4s ease",
        }}>
          ✦ In action
        </Typography>

        <Typography sx={{
          fontSize: { xs: "28px", sm: "40px", md: "52px" },
          fontWeight: 500, color: T.headline,
          lineHeight: 1.1, letterSpacing: "-0.02em",
          fontFamily: "'Georgia', serif",
          textAlign: "center", maxWidth: "640px", mb: "16px",
          transition: "color 0.4s ease",
        }}>
          See it work in{" "}
          <Box component="span" sx={{ color: T.headlineFaded, transition: "color 0.4s ease" }}>
            real time.
          </Box>
        </Typography>

        <Typography sx={{
          fontSize: { xs: "14px", sm: "16px" }, color: T.body,
          textAlign: "center", maxWidth: "480px",
          lineHeight: 1.7, mb: { xs: "40px", sm: "56px" },
          transition: "color 0.4s ease",
        }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since.
        </Typography>

        {/* Side-by-side image cards */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: 3, xl: 5 }}
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          {[CodeImage5, CodeImage6].map((src, i) => (
            <Box key={i} sx={{
              position: "relative",
              borderRadius: "14px", overflow: "hidden",
              border: `0.5px solid ${T.imgBorder}`,
              backgroundColor: T.cardBg,
              p: { xs: 1.5, sm: 2 },
              flex: "1 1 0",
              maxWidth: { xs: "80vw", sm: "38vw" },
              boxShadow: T.boxShadow,
              transition: "border-color 0.25s ease, background-color 0.4s ease",
              "&:hover": { borderColor: T.imgBorderHover },
            }}>
              <TopGlow glow={T.topGlow} />
              <Box
                component="img" src={src}
                sx={{
                  width: "100%", display: "block",
                  borderRadius: "10px",
                  border: `0.5px solid ${T.imgBorder}`,
                  transition: "border-color 0.4s ease",
                }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};