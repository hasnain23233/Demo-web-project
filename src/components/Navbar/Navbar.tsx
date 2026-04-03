import React, { useState, useEffect } from "react";
import {
  AppBar, Box, CssBaseline, Drawer, IconButton,
  List, ListItem, ListItemButton, ListItemText,
  Toolbar, Button, useTheme,
} from "@mui/material";
import { LightMode, Brightness2, Close } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { MenuIconLight, MenuIconDark, RightArrow } from "../../assets/Icons";
import logoLight from "../../assets/lightLogo.png";
import logoDark from "../../assets/darkLogo.png";
import { useThemeMode } from "../../theme/theme";

interface Props { window?: () => Window; }
const drawerWidth = 280;
const navItems = ["About", "Products", "Solutions", "Resources", "Use Cases"];

// ── Design tokens ─────────────────────────────────────────────────────────────
// Dark  → client-requested deep navy + white palette
// Light → clean white + navy (cleanly inverted mirror)
const getTokens = (isDark: boolean) => ({
  // AppBar backgrounds
  scrolledBg:      isDark ? "rgba(0,12,46,0.94)"  : "rgba(240,244,255,0.94)",
  border:          isDark ? "#1a2a5e"              : "#c2d0f0",
  // Text
  textPrimary:     isDark ? "#ffffff"              : "#000c2e",
  textSecondary:   isDark ? "#5a7ab5"              : "#3a4e78",
  // Surfaces
  surfaceSubtle:   isDark ? "#020e38"              : "#e4ecff",
  // Nav active dot
  activeDot:       isDark ? "#ffffff"              : "#000c2e",
  // CTA button
  ctaBorder:       isDark ? "#1a2a5e"              : "#c2d0f0",
  ctaHoverBg:      isDark ? "#ffffff"              : "#000c2e",
  ctaHoverText:    isDark ? "#000c2e"              : "#ffffff",
  ctaHoverBorder:  isDark ? "#ffffff"              : "#000c2e",
  // Theme toggle pill
  toggleBg:        isDark ? "#020e38"              : "#e4ecff",
  toggleBorder:    isDark ? "#1a2a5e"              : "#c2d0f0",
  toggleBorderHover: isDark ? "#4a7fff"            : "#7a9ad8",
  toggleKnob:      isDark ? "#ffffff"              : "#000c2e",
  toggleIcon:      isDark ? "#2e4a8a"              : "#8a9ab8",
  // Drawer
  drawerBg:        isDark ? "#000c2e"              : "#ffffff",
  drawerBorder:    isDark ? "#1a2a5e"              : "#c2d0f0",
  drawerLinkBorder:isDark ? "#1a2a5e"              : "#c2d0f0",
  drawerActiveLine:isDark ? "#ffffff"              : "#000c2e",
  // Mobile icon btn
  iconBtnBorder:   isDark ? "#1a2a5e"              : "#c2d0f0",
  iconBtnHoverBg:  isDark ? "#020e38"              : "#e4ecff",
});

// ── Theme toggle pill ─────────────────────────────────────────────────────────
const ThemeToggle: React.FC<{ mode: "light" | "dark"; onToggle: () => void; isDark: boolean }> = ({ mode, onToggle, isDark }) => {
  const T = getTokens(isDark);
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "60px", height: "30px",
        backgroundColor: T.toggleBg,
        border: `0.5px solid ${T.toggleBorder}`,
        borderRadius: "15px", cursor: "pointer",
        position: "relative", px: "5px",
        "&:hover": { borderColor: T.toggleBorderHover },
        transition: "border-color 0.2s ease, background-color 0.4s ease",
      }}
    >
      <Box sx={{
        position: "absolute", top: "50%",
        left: mode === "dark" ? "34px" : "4px",
        transform: "translateY(-50%)",
        width: "22px", height: "22px",
        backgroundColor: T.toggleKnob,
        borderRadius: "50%", zIndex: 2,
        transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1), background-color 0.4s ease",
      }} />
      <LightMode sx={{ color: T.toggleIcon, fontSize: "14px", zIndex: 1 }} />
      <Brightness2 sx={{ color: T.toggleIcon, fontSize: "14px", zIndex: 1, transform: "rotate(150deg)" }} />
    </Box>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────────────
export const Navbar: React.FC<Props> = (props) => {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";
  const T = getTokens(isDark);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location = useLocation();

  const logo = isDark ? logoDark : logoLight;
  const isActive = (item: string) =>
    location.pathname === `/${item.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(globalThis.scrollY > 20);
    globalThis.addEventListener("scroll", onScroll);
    return () => globalThis.removeEventListener("scroll", onScroll);
  }, []);

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

  // ── Mobile drawer ─────────────────────────────────────────────────────────
  const drawer = (
    <Box sx={{
      height: "100%",
      backgroundColor: T.drawerBg,
      display: "flex", flexDirection: "column",
      padding: "28px 24px",
      transition: "background-color 0.4s ease",
    }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box component="img" src={logo} alt="logo" sx={{ width: "100px", height: "auto" }} />
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: T.textPrimary,
            border: `0.5px solid ${T.iconBtnBorder}`,
            borderRadius: "8px", padding: "6px",
            transition: "background-color 0.2s ease, border-color 0.2s ease",
            "&:hover": { backgroundColor: T.iconBtnHoverBg },
          }}
        >
          <Close sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      {/* Nav links */}
      <List sx={{ flex: 1, p: 0 }}>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <ListItem key={item} disablePadding>
              <ListItemButton
                component={Link}
                to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={handleDrawerToggle}
                sx={{
                  py: "14px", px: 0,
                  borderBottom: `0.5px solid ${T.drawerLinkBorder}`,
                  color: active ? T.textPrimary : T.textSecondary,
                  "&:hover": { backgroundColor: "transparent", color: T.textPrimary },
                  "& .MuiListItemText-primary": {
                    fontSize: "15px",
                    fontWeight: active ? 500 : 400,
                    transition: "color 0.2s ease",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                  <Box sx={{
                    width: "20px", height: "1px",
                    backgroundColor: active ? T.drawerActiveLine : T.drawerLinkBorder,
                    transition: "background-color 0.2s ease",
                  }} />
                  <ListItemText primary={item} />
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom: CTA + toggle */}
      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          component={Link} to="/contact" onClick={handleDrawerToggle}
          endIcon={<RightArrow />}
          sx={{
            width: "100%", py: "12px",
            border: `0.5px solid ${T.ctaBorder}`,
            borderRadius: "8px",
            color: T.textPrimary,
            fontSize: "13px", fontWeight: 500, textTransform: "none",
            transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
            "&:hover": {
              backgroundColor: T.ctaHoverBg,
              color: T.ctaHoverText,
              borderColor: T.ctaHoverBorder,
            },
          }}
        >
          Book a Demo
        </Button>
        <ThemeToggle mode={mode} onToggle={toggleMode} isDark={isDark} />
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: scrolled ? T.scrolledBg : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled
            ? `0.5px solid ${T.border}`
            : "0.5px solid transparent",
          boxShadow: "none",
          transition: "background-color 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
          padding: { xs: "0 20px", sm: "0 48px", lg: "0 80px" },
        }}
      >
        <Toolbar sx={{
          px: "0 !important",
          minHeight: { xs: "64px", md: "72px" },
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>

          {/* Logo */}
          <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Box
              component="img" src={logo} alt="logo"
              sx={{
                width: { xs: "90px", md: "110px" }, height: "auto",
                transition: "opacity 0.2s ease",
                "&:hover": { opacity: 0.75 },
              }}
            />
          </Box>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "4px" }}>
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Button
                  key={item}
                  component={Link}
                  to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  sx={{
                    color: active ? T.textPrimary : T.textSecondary,
                    fontSize: "13px",
                    fontWeight: active ? 500 : 400,
                    textTransform: "none",
                    px: "14px", py: "6px",
                    borderRadius: "6px",
                    transition: "color 0.2s ease, background-color 0.2s ease",
                    "&:hover": { color: T.textPrimary, backgroundColor: T.surfaceSubtle },
                    position: "relative",
                    "&::after": active ? {
                      content: '""',
                      position: "absolute",
                      bottom: "2px", left: "50%",
                      transform: "translateX(-50%)",
                      width: "4px", height: "4px",
                      borderRadius: "50%",
                      backgroundColor: T.activeDot,
                    } : {},
                  }}
                >
                  {item}
                </Button>
              );
            })}
          </Box>

          {/* Desktop right: toggle + CTA */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "16px" }}>
            <ThemeToggle mode={mode} onToggle={toggleMode} isDark={isDark} />
            <Button
              component={Link} to="/contact"
              endIcon={<RightArrow />}
              sx={{
                px: "18px", py: "8px",
                border: `0.5px solid ${T.ctaBorder}`,
                borderRadius: "8px",
                color: T.textPrimary,
                fontSize: "13px", fontWeight: 500, textTransform: "none",
                transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                "&:hover": {
                  backgroundColor: T.ctaHoverBg,
                  color: T.ctaHoverText,
                  borderColor: T.ctaHoverBorder,
                },
              }}
            >
              Book a Demo
            </Button>
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              color: T.textPrimary,
              border: `0.5px solid ${T.iconBtnBorder}`,
              borderRadius: "8px", padding: "8px",
              transition: "background-color 0.2s ease, border-color 0.2s ease",
              "&:hover": { backgroundColor: T.iconBtnHoverBg },
            }}
          >
            {React.createElement(isDark ? MenuIconDark : MenuIconLight)}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: T.drawerBg,
              border: "none",
              borderRight: `0.5px solid ${T.drawerBorder}`,
              transition: "background-color 0.4s ease, border-color 0.4s ease",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};