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

// ─── Data ─────────────────────────────────────────────────────────────────────

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
      { label: "Privacy Policy",  to: "/privacy-policy"  },
      { label: "Imprint",         to: "/imprint"         },
      { label: "Data Protection", to: "/data-protection" },
    ],
  },
  {
    label: "Support",
    links: [
      { label: "FAQ",         to: "/faq"          },
      { label: "Help Center", to: "/help-support" },
      { label: "Contact Us",  to: "/contact"      },
    ],
  },
];

const SOCIAL_ITEMS = [
  { key: "facebook", href: "https://facebook.com"  },
  { key: "linkedin", href: "https://linkedin.com"  },
  { key: "x",        href: "https://twitter.com"   },
  { key: "insta",    href: "https://instagram.com" },
];

// ── Design tokens ─────────────────────────────────────────────────────────────
// Dark  → client-requested deep navy + white palette
// Light → clean white + navy (cleanly inverted mirror)
const getTokens = (isDark: boolean) => ({
  bg:                   isDark ? "#000c2e" : "#f0f4ff",
  border:               isDark ? "#1a2a5e" : "#c2d0f0",
  tagline:              isDark ? "#6b7fa8" : "#3a4e78",
  // Column labels & copyright
  colLabel:             isDark ? "#ffffff" : "#000c2e",
  copyright:            isDark ? "#5a7ab5" : "#5a7ab5",
  // Nav links
  linkColor:            isDark ? "#5a7ab5" : "#3a4e78",
  linkHover:            isDark ? "#ffffff" : "#000c2e",
  // Social buttons
  socialBorder:         isDark ? "#1a2a5e" : "#c2d0f0",
  socialHoverBorder:    isDark ? "#4a7fff" : "#7a9ad8",
  socialHoverBg:        isDark ? "#020e38" : "#e0eaff",
  socialIconFilter:     isDark ? "brightness(10)" : "brightness(0)",
  socialOpacity:        isDark ? 0.35 : 0.5,
  // Newsletter input
  inputBg:              isDark ? "#020e38" : "#ffffff",
  inputBorder:          isDark ? "#1a2a5e" : "#c2d0f0",
  inputFocusBorder:     isDark ? "#4a7fff" : "#7a9ad8",
  inputColor:           isDark ? "#ffffff" : "#000c2e",
  placeholder:          isDark ? "#2e4a8a" : "#a0aec0",
  inputDivider:         isDark ? "#1a2a5e" : "#c2d0f0",
  inputShadow:          isDark ? "none" : "0 2px 8px rgba(0,40,160,0.05)",
  newsletterDesc:       isDark ? "#6b7fa8" : "#3a4e78",
  newsletterDisclaim:   isDark ? "#2e4a8a" : "#9aaac0",
  // Send button
  sendActiveBg:         isDark ? "#ffffff" : "#000c2e",
  sendActiveIcon:       isDark ? "#000c2e" : "#ffffff",
  sendActiveHover:      isDark ? "#e0e8ff" : "#0d2255",
  sendIdleIcon:         isDark ? "#2e4a8a" : "#a0aec0",
  sendIdleHoverBg:      isDark ? "#020e38" : "#eef3fc",
  // Ghost wordmark
  wordmarkColor:        isDark ? "#1a2a5e" : "transparent",
  wordmarkStroke:       isDark ? "#1a2a5e" : "#c2d0f0",
  // Bottom bar legal links
  legalLink:            isDark ? "#2e4a8a" : "#8a9ab8",
  legalLinkHover:       isDark ? "#ffffff" : "#000c2e",
});

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FooterLinkProps { label: string; to: string; tokens: ReturnType<typeof getTokens> }
const FooterLink: FC<FooterLinkProps> = ({ label, to, tokens: T }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      fontSize: "14px",
      color: T.linkColor,
      textDecoration: "none",
      lineHeight: 1,
      letterSpacing: "0.01em",
      transition: "color 0.2s ease",
      "&:hover": { color: T.linkHover },
    }}
  >
    {label}
  </Box>
);

interface ColLabelProps { children: string; tokens: ReturnType<typeof getTokens> }
const ColLabel: FC<ColLabelProps> = ({ children, tokens: T }) => (
  <Typography sx={{
    fontSize: "11px", fontWeight: 600,
    color: T.colLabel,
    letterSpacing: "0.1em", textTransform: "uppercase", mb: "6px",
    transition: "color 0.4s ease",
  }}>
    {children}
  </Typography>
);

// ─── Main Footer ──────────────────────────────────────────────────────────────

export const Footer: FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const T = getTokens(isDark);
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const logo = isDark ? logoDark : logoLight;

  const socialSrc: Record<string, string> = {
    facebook: isDark ? FacebookDark : FacebookLight,
    linkedin: isDark ? LinkedInDark : LinkedInLight,
    x:        isDark ? XDark        : XLight,
    insta:    isDark ? InstaDark    : InstaLight,
  };

  return (
    <Box sx={{
      backgroundColor: T.bg,
      borderTop: `0.5px solid ${T.border}`,
      px: { xs: "24px", sm: "48px", lg: "80px" },
      transition: "background-color 0.4s ease, border-color 0.4s ease",
    }}>

      {/* ══ ROW 1 — Logo / Nav columns / Newsletter ═════════════════════ */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "240px 1fr 280px" },
        gap: { xs: "48px", sm: "40px", lg: "64px" },
        py: { xs: "56px", sm: "72px", md: "88px" },
        borderBottom: `0.5px solid ${T.border}`,
        alignItems: "start",
        transition: "border-color 0.4s ease",
      }}>

        {/* — Logo + tagline + socials ——————————— */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box component={RouterLink} to="/" sx={{ display: "inline-flex", textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Fossilite logo"
              sx={{ width: "110px", height: "auto" }}
            />
          </Box>

          <Typography sx={{
            fontSize: "13px", color: T.tagline,
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
                  border: `0.5px solid ${T.socialBorder}`,
                  borderRadius: "7px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                  "&:hover": {
                    borderColor: T.socialHoverBorder,
                    backgroundColor: T.socialHoverBg,
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
                    opacity: T.socialOpacity,
                    filter: T.socialIconFilter,
                    transition: "opacity 0.2s ease",
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
              <ColLabel tokens={T}>{group.label}</ColLabel>
              {group.links.map((link) => (
                <FooterLink key={link.label} label={link.label} to={link.to} tokens={T} />
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
            <ColLabel tokens={T}>Newsletter</ColLabel>
            <Typography sx={{
              fontSize: "13px", color: T.newsletterDesc,
              lineHeight: 1.7, mt: "6px",
              transition: "color 0.4s ease",
            }}>
              Get the latest updates on AI development, tools, and releases.
            </Typography>
          </Box>

          {/* Input row */}
          <Box sx={{
            border: `0.5px solid ${T.inputBorder}`,
            borderRadius: "10px",
            backgroundColor: T.inputBg,
            display: "flex", alignItems: "center", overflow: "hidden",
            transition: "border-color 0.2s ease, background-color 0.4s ease",
            "&:focus-within": { borderColor: T.inputFocusBorder },
            boxShadow: T.inputShadow,
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
                  color: T.inputColor,
                  "&::before, &::after": { display: "none" },
                },
                "& input": { py: "12px" },
                "& input::placeholder": { color: T.placeholder, opacity: 1 },
              }}
            />
            <Box
              onClick={() => { /* handle submit */ }}
              sx={{
                width: "42px", height: "42px",
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: email.trim() ? T.sendActiveBg : "transparent",
                borderLeft: `0.5px solid ${T.inputDivider}`,
                cursor: "pointer", flexShrink: 0,
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: email.trim() ? T.sendActiveHover : T.sendIdleHoverBg,
                },
              }}
            >
              <RightArrow sx={{
                fontSize: "15px",
                color: email.trim() ? T.sendActiveIcon : T.sendIdleIcon,
                transition: "color 0.2s ease",
              }} />
            </Box>
          </Box>

          <Typography sx={{
            fontSize: "11px", color: T.newsletterDisclaim,
            lineHeight: 1.6, transition: "color 0.4s ease",
          }}>
            No spam. Unsubscribe any time.
          </Typography>
        </Box>
      </Box>

      {/* ══ ROW 2 — Ghost wordmark ══════════════════════════════════════ */}
      <Box sx={{
        py: { xs: "36px", md: "48px" },
        borderBottom: `0.5px solid ${T.border}`,
        overflow: "hidden", display: "flex", alignItems: "center",
        transition: "border-color 0.4s ease",
      }}>
        <Typography sx={{
          fontSize: { xs: "17vw", sm: "15vw", md: "13vw", lg: "11vw" },
          fontWeight: 500, lineHeight: 1, letterSpacing: "-0.04em",
          fontFamily: "'Georgia', serif",
          color: T.wordmarkColor,
          WebkitTextStroke: { xs: `1px ${T.wordmarkStroke}`, md: `1.5px ${T.wordmarkStroke}` },
          userSelect: "none", whiteSpace: "nowrap",
          transition: "color 0.4s ease",
        }}>
          FOSSILITE
        </Typography>
      </Box>

      {/* ══ ROW 3 — Bottom bar ══════════════════════════════════════════ */}
      <Box sx={{
        py: "20px",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: "12px",
      }}>
        <Typography sx={{
          fontSize: "12px", color: T.copyright,
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
                color: T.legalLink,
                textDecoration: "none", letterSpacing: "0.02em",
                transition: "color 0.2s ease",
                "&:hover": { color: T.legalLinkHover },
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