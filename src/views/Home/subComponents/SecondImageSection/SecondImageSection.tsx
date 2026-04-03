import { FC } from "react";
import { Box, Grid2 as Grid, Stack, Typography } from "@mui/material";
import Icon1 from "../../../../assets/Images/Icon1.png";
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

// ── Section label — themed ──────────────────────────────────────────────────
interface SectionLabelProps {
  label: string;
  index: string;
  isLight: boolean;
}

const SectionLabel: FC<SectionLabelProps> = ({ label, index, isLight }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "20px" }}>
    <Typography sx={{
      fontSize: "11px",
      color: isLight ? "#8a9ab8" : "#444444",
      fontWeight: 500, letterSpacing: "0.06em", fontFamily: "monospace",
      transition: "color 0.4s ease",
    }}>
      {index}
    </Typography>
    <Box sx={{
      flex: 1, height: "0.5px",
      backgroundColor: isLight ? "#d0dff7" : "#1e1e1e",
      transition: "background-color 0.4s ease",
    }} />
    <Typography sx={{
      fontSize: "11px",
      color: isLight ? "#8a9ab8" : "#444444",
      letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
      transition: "color 0.4s ease",
    }}>
      {label}
    </Typography>
  </Box>
);

export const SecondImageSection: FC = () => {
  const { mode } = useThemeMode();
  const isLight = mode === "light";

  const CodeImage4 = isLight ? CodeImage4LightExtraction : CodeImage4Dark;
  const CodeImage5 = isLight ? CodeImage5Light           : CodeImage5Dark;
  const CodeImage6 = isLight ? CodeImage6Light           : CodeImage6Dark;

  // ── Derived tokens ──────────────────────────────────────────────────────
  const bgColor          = isLight ? "#f5f7fb"   : "#040404";
  const borderColor      = isLight ? "#d0dff7"   : "#1a1a1a";
  const cardBg           = isLight ? "#ffffff"   : "#080808";
  const headlineColor    = isLight ? "#0d0d0d"   : "#ffffff";
  const headlineFaded    = isLight ? "#b0b8cc"   : "#444444";
  const bodyColor        = isLight ? "#4a4545"   : "#555555";
  const eyebrowColor     = isLight ? "#8a9ab8"   : "#444444";
  const dividerColor     = isLight ? "#d0dff7"   : "#1a1a1a";
  const checkBorder      = isLight ? "#ccd8f0"   : "#2a2a2a";
  const checkBg          = isLight ? "#eef3fc"   : "#0f0f0f";
  const checkDot         = isLight ? "#8faad8"   : "#555555";
  const featureText      = isLight ? "#4a5a7a"   : "#666666";
  const imgContBorder    = isLight ? "#d0dff7"   : "#1a1a1a";
  const imgBorder        = isLight ? "#d0dff7"   : "#1e1e1e";
  const imgBorderHover   = isLight ? "#8faad8"   : "#333333";
  const topGlow          = isLight
    ? "linear-gradient(90deg, transparent, rgba(0,100,255,0.12), transparent)"
    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)";
  const imgShadow        = isLight
    ? "0 16px 48px rgba(0,60,180,0.1), 0 4px 12px rgba(0,0,0,0.06)"
    : "0 32px 64px rgba(0,0,0,0.7)";

  return (
    <Box sx={{
      backgroundColor: bgColor,
      px: { xs: "24px", sm: "48px", lg: "80px" },
      py: { xs: "80px", sm: "100px", md: "130px" },
      transition: "background-color 0.4s ease",
    }}>

      {/* ── Block 1: Text left, Image right ── */}
      <Grid container spacing={{ xs: 6, md: 12 }} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionLabel label="Capabilities" index="03" isLight={isLight} />
          <Stack direction="column" gap={3}>
            <Typography sx={{
              fontSize: { xs: "28px", sm: "36px", md: "42px" },
              fontWeight: 500, color: headlineColor,
              lineHeight: 1.15, letterSpacing: "-0.02em",
              fontFamily: "'Georgia', serif",
              transition: "color 0.4s ease",
            }}>
              Intelligent extraction,{" "}
              <Box component="span" sx={{ color: headlineFaded, transition: "color 0.4s ease" }}>
                at any scale.
              </Box>
            </Typography>
            {[
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
              "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            ].map((text, i) => (
              <Typography key={i} sx={{
                fontSize: "15px", color: bodyColor,
                lineHeight: 1.8, maxWidth: "440px",
                transition: "color 0.4s ease",
              }}>
                {text}
              </Typography>
            ))}
          </Stack>

          {/* Feature list */}
          <Box sx={{
            mt: "36px", pt: "28px",
            borderTop: `0.5px solid ${dividerColor}`,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px",
            transition: "border-color 0.4s ease",
          }}>
            {FEATURE_ITEMS.map((item) => (
              <Box key={item} sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box sx={{
                  width: "16px", height: "16px", borderRadius: "4px",
                  border: `0.5px solid ${checkBorder}`,
                  backgroundColor: checkBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background-color 0.4s ease, border-color 0.4s ease",
                }}>
                  <Box sx={{
                    width: "6px", height: "6px", borderRadius: "2px",
                    backgroundColor: checkDot, transition: "background-color 0.4s ease",
                  }} />
                </Box>
                <Typography sx={{
                  fontSize: "13px", color: featureText,
                  lineHeight: 1.4, transition: "color 0.4s ease",
                }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{
            position: "relative",
            display: "flex", justifyContent: "center", alignItems: "center",
            borderRadius: "16px", overflow: "hidden",
            border: `0.5px solid ${imgContBorder}`,
            backgroundColor: cardBg,
            p: { xs: 2, sm: 3 },
            boxShadow: isLight ? "0 8px 32px rgba(0,60,180,0.07)" : "none",
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}>
            {/* Top glow line */}
            <Box sx={{
              position: "absolute", top: 0, left: "50%",
              transform: "translateX(-50%)",
              width: "60%", height: "1px",
              background: topGlow,
            }} />
            <Box
              component="img" src={CodeImage4}
              sx={{
                width: { xs: "80vw", sm: "38vw", md: "30vw" },
                borderRadius: "10px",
                border: `0.5px solid ${imgBorder}`,
                boxShadow: imgShadow,
                transition: "border-color 0.4s ease",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* ── Divider ── */}
      <Box sx={{
        my: { xs: "80px", sm: "100px", md: "130px" },
        height: "0.5px",
        backgroundColor: dividerColor,
        transition: "background-color 0.4s ease",
      }} />

      {/* ── Block 2: Centred heading + side-by-side images ── */}
      <Stack direction="column" alignItems="center" gap={0}>
        <Typography sx={{
          fontSize: "11px", color: eyebrowColor,
          letterSpacing: "0.08em", textTransform: "uppercase",
          fontWeight: 500, mb: "20px",
          transition: "color 0.4s ease",
        }}>
          ✦ In action
        </Typography>

        <Typography sx={{
          fontSize: { xs: "28px", sm: "40px", md: "52px" },
          fontWeight: 500, color: headlineColor,
          lineHeight: 1.1, letterSpacing: "-0.02em",
          fontFamily: "'Georgia', serif",
          textAlign: "center", maxWidth: "640px", mb: "16px",
          transition: "color 0.4s ease",
        }}>
          See it work in{" "}
          <Box component="span" sx={{ color: headlineFaded, transition: "color 0.4s ease" }}>
            real time.
          </Box>
        </Typography>

        <Typography sx={{
          fontSize: { xs: "14px", sm: "16px" }, color: bodyColor,
          textAlign: "center", maxWidth: "480px",
          lineHeight: 1.7, mb: { xs: "40px", sm: "56px" },
          transition: "color 0.4s ease",
        }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since.
        </Typography>

        {/* Side-by-side images */}
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
              border: `0.5px solid ${imgBorder}`,
              backgroundColor: cardBg,
              p: { xs: 1.5, sm: 2 },
              flex: "1 1 0",
              maxWidth: { xs: "80vw", sm: "38vw" },
              boxShadow: isLight ? "0 4px 20px rgba(0,60,180,0.06)" : "none",
              transition: "border-color 0.25s ease, background-color 0.4s ease",
              "&:hover": { borderColor: imgBorderHover },
            }}>
              {/* Top glow line */}
              <Box sx={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: "50%", height: "1px",
                background: topGlow,
              }} />
              <Box
                component="img" src={src}
                sx={{
                  width: "100%", display: "block",
                  borderRadius: "10px",
                  border: `0.5px solid ${imgBorder}`,
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