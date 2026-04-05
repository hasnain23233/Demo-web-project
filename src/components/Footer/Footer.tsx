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

// ── Design tokens — aligned to your palette ───────────────────────────────────
// Dark:  Black (#161616) bg, Cream (#FFF4E3) text, Grey Cloud (#BBC0C6) secondary
// Light: Cream (#FFF4E3) bg, Midnight (#001932) text, warm tan (#d9c9b0) borders
const getTokens = (isDark: boolean) => ({
  // Layout
  bg:                 isDark ? "#161616"              : "#FFF4E3",
  border:             isDark ? "#2a2a2a"              : "#d9c9b0",   // near-black / warm tan
  // Text hierarchy
  tagline:            isDark ? "#BBC0C6"              : "#4a4a6a",   // Grey Cloud / slate
  colLabel:           isDark ? "#FFF4E3"              : "#001932",   // Cream / Midnight
  copyright:          isDark ? "#BBC0C6"              : "#4a4a6a",
  // Nav links
  linkColor:          isDark ? "#BBC0C6"              : "#4a4a6a",
  linkHover:          isDark ? "#FFF4E3"              : "#001932",
  // Social
  socialBorder:       isDark ? "#2a2a2a"              : "#d9c9b0",
  socialHoverBorder:  isDark ? "#BBC0C6"              : "#001932",
  socialHoverBg:      isDark ? "#1e1e1e"              : "#f0e8da",
  socialIconFilter:   isDark ? "invert(1) brightness(0.85)" : "brightness(0)",
  socialOpacity:      isDark ? 0.7                    : 0.55,
  // Newsletter input
  inputBg:            isDark ? "#1e1e1e"              : "#FFFFFF",
  inputBorder:        isDark ? "#2a2a2a"              : "#d9c9b0",
  inputFocusBorder:   isDark ? "#BBC0C6"              : "#001932",
  inputColor:         isDark ? "#FFF4E3"              : "#001932",
  placeholder:        isDark ? "#3a3a3a"              : "#BBC0C6",
  inputDivider:       isDark ? "#2a2a2a"              : "#d9c9b0",
  inputShadow:        isDark ? "none"                 : "0 2px 8px rgba(0,25,50,0.05)",
  newsletterDesc:     isDark ? "#BBC0C6"              : "#4a4a6a",
  newsletterDisclaim: isDark ? "#3a3a3a"              : "#BBC0C6",
  // Send button
  sendActiveBg:       isDark ? "#FFF4E3"              : "#001932",
  sendActiveIcon:     isDark ? "#001932"              : "#FFF4E3",
  sendActiveHover:    isDark ? "#e0d8cc"              : "#0a2a4a",
  sendIdleIcon:       isDark ? "#3a3a3a"              : "#BBC0C6",
  sendIdleHoverBg:    isDark ? "#1e1e1e"              : "#f0e8da",
  // Ghost wordmark
  wordmarkColor:      isDark ? "#1e1e1e"              : "transparent",
  wordmarkStroke:     isDark ? "#2a2a2a"              : "#d9c9b0",
  // Bottom bar
  legalLink:          isDark ? "#3a3a3a"              : "#BBC0C6",
  legalLinkHover:     isDark ? "#FFF4E3"              : "#001932",
});

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FooterLinkProps { label: string; to: string; T: ReturnType<typeof getTokens> }
const FooterLink: FC<FooterLinkProps> = ({ label, to, T }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      fontSize: "13px",
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

interface ColLabelProps { children: string; T: ReturnType<typeof getTokens> }
const ColLabel: FC<ColLabelProps> = ({ children, T }) => (
  <Typography sx={{
    fontSize: "10px",
    fontWeight: 600,
    color: T.colLabel,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    mb: "4px",
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
  const hasEmail = email.trim().length > 0;
  const currentYear = new Date().getFullYear();

  const logo = isDark ? logoDark : logoLight;

  const socialSrc: Record<string, string> = {
    facebook: isDark ? FacebookDark : FacebookLight,
    linkedin: isDark ? LinkedInDark : LinkedInLight,
    x:        isDark ? XDark        : XLight,
    insta:    isDark ? InstaDark    : InstaLight,
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: T.bg,
        borderTop: `0.5px solid ${T.border}`,
        px: { xs: "24px", sm: "48px", lg: "80px" },
        transition: "background-color 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* ══ ROW 1 — Logo / Nav columns / Newsletter ══════════════════════ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "220px 1fr 280px" },
          gap: { xs: "48px", sm: "40px", lg: "64px" },
          py: { xs: "56px", sm: "72px", md: "88px" },
          borderBottom: `0.5px solid ${T.border}`,
          alignItems: "start",
          transition: "border-color 0.4s ease",
        }}
      >
        {/* — Logo + tagline + socials ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: "inline-flex", textDecoration: "none" }}
          >
            <Box
              component="img"
              src={logo}
              alt="Fossilite logo"
              sx={{ width: "110px", height: "auto" }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "13px",
              color: T.tagline,
              lineHeight: 1.8,
              maxWidth: "200px",
              transition: "color 0.4s ease",
              fontFamily: "Nasalization"
            }}
          >
            Production-grade AI systems built for companies defining what's next.
          </Typography>

          {/* Social icons */}
          <Box sx={{ display: "flex", gap: "6px", mt: "4px" }}>
            {SOCIAL_ITEMS.map(({ key, href }) => (
              <Box
                key={key}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: "32px",
                  height: "32px",
                  border: `0.5px solid ${T.socialBorder}`,
                  borderRadius: "7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                  "&:hover": {
                    borderColor: T.socialHoverBorder,
                    backgroundColor: T.socialHoverBg,
                    "& img": { opacity: 0.9 },
                  },
                }}
              >
                <Box
                  component="img"
                  src={socialSrc[key]}
                  alt={key}
                  sx={{
                    width: "13px",
                    height: "13px",
                    objectFit: "contain",
                    opacity: T.socialOpacity,
                    filter: T.socialIconFilter,
                    transition: "opacity 0.2s ease, filter 0.4s ease",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* — Nav columns ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: { xs: "32px", sm: "24px", md: "40px" },
            gridColumn: { xs: "1", sm: "1 / -1", lg: "auto" },
          }}
        >
          {NAV_GROUPS.map((group) => (
            <Box
              key={group.label}
              sx={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <ColLabel T={T}>{group.label}</ColLabel>
              {group.links.map((link) => (
                <FooterLink key={link.label} label={link.label} to={link.to} T={T} />
              ))}
            </Box>
          ))}
        </Box>

        {/* — Newsletter ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            gridColumn: { xs: "1", sm: "1 / -1", lg: "auto" },
          }}
        >
          <Box>
            <ColLabel T={T}>Newsletter</ColLabel>
            <Typography
              sx={{
                fontSize: "13px",
                color: T.newsletterDesc,
                lineHeight: 1.7,
                mt: "8px",
                transition: "color 0.4s ease",
              }}
            >
              Get the latest updates on AI development, tools, and releases.
            </Typography>
          </Box>

          {/* Input row */}
          <Box
            sx={{
              border: `0.5px solid ${T.inputBorder}`,
              borderRadius: "10px",
              backgroundColor: T.inputBg,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              transition:
                "border-color 0.25s ease, background-color 0.4s ease, box-shadow 0.25s ease",
              "&:focus-within": {
                borderColor: T.inputFocusBorder,
                boxShadow: isDark
                  ? "0 0 0 3px rgba(187,192,198,0.08)"
                  : "0 0 0 3px rgba(0,25,50,0.07)",
              },
              boxShadow: T.inputShadow,
            }}
          >
            <TextField
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="standard"
              type="email"
              inputProps={{ "aria-label": "Email for newsletter" }}
              sx={{
                flex: 1,
                px: "14px",
                "& .MuiInput-root": {
                  fontSize: "13px",
                  color: T.inputColor,
                  "&::before, &::after": { display: "none" },
                },
                "& input": { py: "12px", color: T.inputColor },
                "& input::placeholder": {
                  color: T.placeholder,
                  opacity: 1,
                },
              }}
            />

            <Box
              role="button"
              tabIndex={0}
              aria-label="Subscribe"
              onClick={() => { /* handle submit */ }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { /* handle submit */ } }}
              sx={{
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: hasEmail ? T.sendActiveBg : "transparent",
                borderLeft: `0.5px solid ${T.inputDivider}`,
                cursor: "pointer",
                flexShrink: 0,
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: hasEmail ? T.sendActiveHover : T.sendIdleHoverBg,
                },
              }}
            >
              <RightArrow
                sx={{
                  fontSize: "15px",
                  color: hasEmail ? T.sendActiveIcon : T.sendIdleIcon,
                  transition: "color 0.2s ease",
                }}
              />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: "11px",
              color: T.newsletterDisclaim,
              lineHeight: 1.6,
              transition: "color 0.4s ease",
              fontFamily: "Nasalization"
            }}
          >
            No spam. Unsubscribe any time.
          </Typography>
        </Box>
      </Box>

      {/* ══ ROW 2 — Ghost wordmark ══════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: "36px", md: "48px" },
          borderBottom: `0.5px solid ${T.border}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          transition: "border-color 0.4s ease",
        }}
      >
        <Typography
          aria-hidden="true"
          sx={{
            fontSize: { xs: "17vw", sm: "15vw", md: "13vw", lg: "11vw" },
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontFamily: "Nasalization",
            // Dark: filled with near-black so it reads as a ghost stamp
            // Light: transparent fill, only the stroke shows
            color: T.wordmarkColor,
            WebkitTextStroke: {
              xs:  `1px ${T.wordmarkStroke}`,
              md: `1.5px ${T.wordmarkStroke}`,
            },
            userSelect: "none",
            whiteSpace: "nowrap",
            transition: "color 0.4s ease",
          }}
        >
          FOSSILITE
        </Typography>
      </Box>

      {/* ══ ROW 3 — Bottom bar ══════════════════════════════════════════ */}
      <Box
        sx={{
          py: "20px",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: "12px",
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            color: T.copyright,
            letterSpacing: "0.02em",
            transition: "color 0.4s ease",
          }}
        >
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
                textDecoration: "none",
                letterSpacing: "0.02em",
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