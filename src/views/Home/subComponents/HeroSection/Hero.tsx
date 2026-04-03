// src/pages/home/subComponents/Hero.tsx
import { FC } from "react";
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

export const Hero: FC = () => {
  const { mode } = useThemeMode();

  const isLight = mode === "light";

  // ── Theme: Cream / Midnight / Grey Cloud / Black ──────────────────────────
  const bgColor           = isLight ? "#FFF4E3"  : "#161616";
  const primaryText       = isLight ? "#001932"  : "#FFF4E3";
  const secondaryText     = isLight ? "#4a4a4a"  : "#BBC0C6";
  const badgeBg           = isLight ? "#f5ede0"  : "#1e1e1e";
  const badgeBorder       = isLight ? "#d9c9b0"  : "#2e2e2e";
  const badgeDot          = isLight ? "#001932"  : "#BBC0C6";
  const badgeLabel        = isLight ? "#4a5a6a"  : "#BBC0C6";
  const ctaPrimaryBg      = isLight ? "#001932"  : "#FFF4E3";
  const ctaPrimaryText    = isLight ? "#FFF4E3"  : "#001932";
  const ctaPrimaryHover   = isLight ? "#002a4a"  : "#e8ddd0";
  const ctaSecBorder      = isLight ? "#c0b8ac"  : "#2e2e2e";
  const ctaSecText        = isLight ? "#4a5a6a"  : "#BBC0C6";
  const ctaSecHoverText   = isLight ? "#001932"  : "#FFF4E3";
  const ctaSecHoverBorder = isLight ? "#001932"  : "#BBC0C6";
  const statsDivider      = isLight ? "#d9c9b0"  : "#2a2a2a";
  const statsNumColor     = isLight ? "#001932"  : "#FFF4E3";
  const statsLabelColor   = isLight ? "#7a7a7a"  : "#BBC0C6";
  const tickerBg          = isLight ? "#f5ede0"  : "#111111";
  const tickerBorder      = isLight ? "#d9c9b0"  : "#222222";
  const tickerPillBg      = isLight ? "#FFF4E3"  : "#1a1a1a";
  const tickerPillBorder  = isLight ? "#d9c9b0"  : "#2a2a2a";
  const tickerText        = isLight ? "#6a6a6a"  : "#BBC0C6";

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
      }}
    >
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
              ...(isLight
                ? { color: "#BBC0C6" }
                : { color: "transparent", WebkitTextStroke: "1px rgba(255,244,227,0.35)" }
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