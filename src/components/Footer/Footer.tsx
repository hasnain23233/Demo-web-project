import { FC, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import logoLight from "../../assets/lightLogo.png";
import logoDark from "../../assets/darkLogo.png";
import FacebookLight from "../../assets/Images/SocialIcons/FacebookLight.png";
import FacebookDark from "../../assets/Images/SocialIcons/FacebookDark.png";
import InstaLight from "../../assets/Images/SocialIcons/InstaLight.png";
import InstaDark from "../../assets/Images/SocialIcons/InstaDark.png";
import XLight from "../../assets/Images/SocialIcons/XLight.png";
import XDark from "../../assets/Images/SocialIcons/XDark.png";
import LinkedInLight from "../../assets/Images/SocialIcons/LinkedInLight.png";
import LinkedInDark from "../../assets/Images/SocialIcons/LinkedInDark.png";
import { useThemeMode } from "../../theme/theme";
import { RightArrow } from "../../assets/Icons";

// ─── Data ──────────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "Company",
    links: [
      { label: "About Us",  to: "/about"     },
      { label: "Products",  to: "/products"  },
      { label: "Solutions", to: "/solutions" },
      { label: "Resources", to: "/resources" },
      { label: "Use Cases", to: "/use-cases" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy Policy",   to: "/privacy-policy"   },
      { label: "Imprint",          to: "/imprint"          },
      { label: "Data Protection",  to: "/data-protection"  },
    ],
  },
  {
    label: "Support",
    links: [
      { label: "FAQ",        to: "/faq"          },
      { label: "Help Center", to: "/help-support" },
      { label: "Contact Us", to: "/contact"      },
    ],
  },
];

const SOCIAL_ITEMS = [
  { key: "facebook", label: "FB", href: "https://facebook.com"  },
  { key: "linkedin", label: "LI", href: "https://linkedin.com"  },
  { key: "x",        label: "X",  href: "https://twitter.com"   },
  { key: "insta",    label: "IG", href: "https://instagram.com" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FooterLinkProps { label: string; to: string; isLight: boolean }
const FooterLink: FC<FooterLinkProps> = ({ label, to, isLight }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      fontSize: "14px",
      color: isLight ? "#6a7a9a" : "#4a4a4a",
      textDecoration: "none",
      lineHeight: 1,
      letterSpacing: "0.01em",
      transition: "color 0.2s",
      "&:hover": { color: isLight ? "#0d0d0d" : "#ffffff" },
    }}
  >
    {label}
  </Box>
);

interface ColLabelProps { children: string; isLight: boolean }
const ColLabel: FC<ColLabelProps> = ({ children, isLight }) => (
  <Typography sx={{
    fontSize: "11px", fontWeight: 600,
    color: isLight ? "#0d0d0d" : "#ffffff",
    letterSpacing: "0.1em", textTransform: "uppercase", mb: "6px",
    transition: "color 0.4s ease",
  }}>
    {children}
  </Typography>
);

// ─── Main Footer ──────────────────────────────────────────────────────────────

export const Footer: FC = () => {
  const { mode } = useThemeMode();
  const isLight = mode === "light";
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  // ── Derived tokens ──────────────────────────────────────────────────────
  const bgColor           = isLight ? "#f0f5ff"           : "#050505";
  const borderColor       = isLight ? "#d0dff7"           : "#1c1c1c";
  const taglineColor      = isLight ? "#6a7a9a"           : "#3a3a3a";
  const socialBtnBorder   = isLight ? "#ccd8f0"           : "#1e1e1e";
  const socialBtnHoverBg  = isLight ? "#e0eaff"           : "#111111";
  const socialBtnHoverBorder = isLight ? "#8faad8"        : "#3a3a3a";
  const socialIconFilter  = isLight ? "brightness(0)"     : "brightness(10)";

  const inputContBg       = isLight ? "#ffffff"           : "#080808";
  const inputContBorder   = isLight ? "#d0dff7"           : "#1e1e1e";
  const inputContFocus    = isLight ? "#8faad8"           : "#333333";
  const inputColor        = isLight ? "#0d0d0d"           : "#888888";
  const placeholderColor  = isLight ? "#a0aec0"           : "#2e2e2e";
  const inputDivider      = isLight ? "#d0dff7"           : "#1e1e1e";

  const newsletterDesc    = isLight ? "#6a7a9a"           : "#3a3a3a";
  const newsletterDisclaim= isLight ? "#9aaac0"           : "#272727";

  const sendBtnActiveBg   = isLight ? "#0a1a3a"           : "#ffffff";
  const sendBtnActiveIcon = isLight ? "#ffffff"           : "#000000";
  const sendBtnActiveHover= isLight ? "#0d2255"           : "#e8e8e8";
  const sendBtnIdleIcon   = isLight ? "#a0aec0"           : "#2e2e2e";

  // Wordmark ghost row
  const wordmarkColor     = isLight ? "transparent"       : "#474545";
  const wordmarkStroke    = isLight ? "#ccd8f0"           : "#1a1a1a";

  // Bottom bar
  const copyrightColor    = isLight ? "#8a9ab8"           : "#474545";
  const legalLinkColor    = isLight ? "#a0aec0"           : "#2a2a2a";
  const legalLinkHover    = isLight ? "#0d0d0d"           : "#474545";

  const logo = isLight ? logoLight : logoDark;

  const socialSrc: Record<string, string> = {
    facebook: isLight ? FacebookLight : FacebookDark,
    linkedin: isLight ? LinkedInLight : LinkedInDark,
    x:        isLight ? XLight        : XDark,
    insta:    isLight ? InstaLight    : InstaDark,
  };

  return (
    <Box sx={{
      backgroundColor: bgColor,
      borderTop: `0.5px solid ${borderColor}`,
      px: { xs: "24px", sm: "48px", lg: "80px" },
      transition: "background-color 0.4s ease, border-color 0.4s ease",
    }}>

      {/* ══ ROW 1 — Logo / Nav columns / Newsletter ══════════════════════ */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "240px 1fr 280px" },
        gap: { xs: "48px", sm: "40px", lg: "64px" },
        py: { xs: "56px", sm: "72px", md: "88px" },
        borderBottom: `0.5px solid ${borderColor}`,
        alignItems: "start",
        transition: "border-color 0.4s ease",
      }}>

        {/* — Logo + tagline + social ——————————— */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box component={RouterLink} to="/" sx={{ display: "inline-flex", textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Fossilite logo"
              sx={{
                width: "110px",
                height: "auto",
                // Dark logo: show as-is. Light logo: invert to dark for light bg
                filter: isLight ? "none" : "none",
              }}
            />
          </Box>

          <Typography sx={{
            fontSize: "13px", color: taglineColor,
            lineHeight: 1.8, maxWidth: "220px",
            transition: "color 0.4s ease",
          }}>
            Production-grade AI systems built for companies defining what's next.
          </Typography>

          {/* Social icons */}
          <Box sx={{ display: "flex", gap: "6px", mt: "4px" }}>
            {SOCIAL_ITEMS.map(({ key, href }) => (
              <Box
                key={key}
                component={RouterLink}
                to={href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: "32px", height: "32px",
                  border: `0.5px solid ${socialBtnBorder}`,
                  borderRadius: "7px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s, background-color 0.2s",
                  "&:hover": {
                    borderColor: socialBtnHoverBorder,
                    backgroundColor: socialBtnHoverBg,
                  },
                }}
              >
                <Box
                  component="img"
                  src={socialSrc[key]}
                  alt={key}
                  sx={{
                    width: "13px", height: "13px",
                    objectFit: "contain",
                    opacity: isLight ? 0.5 : 0.35,
                    filter: socialIconFilter,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 0.9 },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* — Nav columns ————————————————————— */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: { xs: "32px", sm: "24px", md: "40px" },
          gridColumn: { xs: "1", sm: "1 / -1", lg: "auto" },
        }}>
          {NAV_GROUPS.map((group) => (
            <Box key={group.label} sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <ColLabel isLight={isLight}>{group.label}</ColLabel>
              {group.links.map((link) => (
                <FooterLink key={link.label} label={link.label} to={link.to} isLight={isLight} />
              ))}
            </Box>
          ))}
        </Box>

        {/* — Newsletter ————————————————————— */}
        <Box sx={{
          display: "flex", flexDirection: "column", gap: "16px",
          gridColumn: { xs: "1", sm: "1 / -1", lg: "auto" },
        }}>
          <Box>
            <ColLabel isLight={isLight}>Newsletter</ColLabel>
            <Typography sx={{
              fontSize: "13px", color: newsletterDesc,
              lineHeight: 1.7, mt: "6px",
              transition: "color 0.4s ease",
            }}>
              Get the latest updates on AI development, tools, and releases.
            </Typography>
          </Box>

          {/* Input row */}
          <Box sx={{
            border: `0.5px solid ${inputContBorder}`,
            borderRadius: "10px",
            backgroundColor: inputContBg,
            display: "flex", alignItems: "center", overflow: "hidden",
            transition: "border-color 0.2s, background-color 0.4s ease",
            "&:focus-within": { borderColor: inputContFocus },
            boxShadow: isLight ? "0 2px 8px rgba(0,60,180,0.05)" : "none",
          }}>
            <TextField
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="standard"
              sx={{
                flex: 1, px: "14px",
                "& .MuiInput-root": {
                  fontSize: "13px",
                  color: inputColor,
                  "&::before, &::after": { display: "none" },
                },
                "& input": { py: "12px" },
                "& input::placeholder": { color: placeholderColor, opacity: 1 },
              }}
            />
            <Box
              onClick={() => { /* handle submit */ }}
              sx={{
                width: "42px", height: "42px",
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: email.trim() ? sendBtnActiveBg : "transparent",
                borderLeft: `0.5px solid ${inputDivider}`,
                cursor: "pointer", flexShrink: 0,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: email.trim()
                    ? sendBtnActiveHover
                    : (isLight ? "#eef3fc" : "#0f0f0f"),
                },
              }}
            >
              <RightArrow sx={{
                fontSize: "15px",
                color: email.trim() ? sendBtnActiveIcon : sendBtnIdleIcon,
                transition: "color 0.2s",
              }} />
            </Box>
          </Box>

          <Typography sx={{
            fontSize: "11px", color: newsletterDisclaim,
            lineHeight: 1.6, transition: "color 0.4s ease",
          }}>
            No spam. Unsubscribe any time.
          </Typography>
        </Box>
      </Box>

      {/* ══ ROW 2 — Ghost wordmark ════════════════════════════════════════ */}
      <Box sx={{
        py: { xs: "36px", md: "48px" },
        borderBottom: `0.5px solid ${borderColor}`,
        overflow: "hidden", display: "flex", alignItems: "center",
        transition: "border-color 0.4s ease",
      }}>
        <Typography sx={{
          fontSize: { xs: "17vw", sm: "15vw", md: "13vw", lg: "11vw" },
          fontWeight: 500, lineHeight: 1, letterSpacing: "-0.04em",
          fontFamily: "'Georgia', serif",
          // Light: fully hollow outline; Dark: faded solid fill + stroke
          color: wordmarkColor,
          WebkitTextStroke: { xs: `1px ${wordmarkStroke}`, md: `1.5px ${wordmarkStroke}` },
          userSelect: "none", whiteSpace: "nowrap",
          transition: "color 0.4s ease",
        }}>
          FOSSILITE
        </Typography>
      </Box>

      {/* ══ ROW 3 — Bottom bar ═══════════════════════════════════════════ */}
      <Box sx={{
        py: "20px",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: "12px",
      }}>
        <Typography sx={{
          fontSize: "12px", color: copyrightColor,
          letterSpacing: "0.02em", transition: "color 0.4s ease",
        }}>
          © {currentYear} Fossilite. All rights reserved.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {["Privacy Policy", "Terms", "Cookies"].map((item) => (
            <Box
              key={item}
              component={RouterLink}
              to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              sx={{
                fontSize: "12px",
                color: legalLinkColor,
                textDecoration: "none", letterSpacing: "0.02em",
                transition: "color 0.2s",
                "&:hover": { color: legalLinkHover },
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      </Box>

    </Box>
  );
};