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

// ── Reusable theme toggle pill ────────────────────────────────
const ThemeToggle: React.FC<{ mode: "light" | "dark"; onToggle: () => void }> = ({ mode, onToggle }) => {
  const theme = useTheme();
  return (
    <Box onClick={onToggle} sx={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      width: "60px", height: "30px",
      backgroundColor: theme.palette.custom.surfaceSubtle,
      border: `0.5px solid ${theme.palette.custom.borderFaint}`,
      borderRadius: "15px", cursor: "pointer",
      position: "relative", px: "5px",
      "&:hover": { borderColor: theme.palette.custom.borderSubtle },
      transition: "border-color 0.2s",
    }}>
      <Box sx={{
        position: "absolute", top: "50%",
        left: mode === "dark" ? "34px" : "4px",
        transform: "translateY(-50%)",
        width: "22px", height: "22px",
        backgroundColor: theme.palette.text.primary,
        borderRadius: "50%", zIndex: 2,
        transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }} />
      <LightMode sx={{ color: theme.palette.text.disabled, fontSize: "14px", zIndex: 1 }} />
      <Brightness2 sx={{ color: theme.palette.text.disabled, fontSize: "14px", zIndex: 1, transform: "rotate(150deg)" }} />
    </Box>
  );
};

// ── Main Navbar ───────────────────────────────────────────────
export const Navbar: React.FC<Props> = (props) => {
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const logo = mode === "light" ? logoLight : logoDark;
  const isActive = (item: string) => location.pathname === `/${item.toLowerCase()}`;

  // Palette shorthands
  const bg        = theme.palette.background.default;
  const bgPaper   = theme.palette.background.paper;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const border    = theme.palette.custom.borderFaint;
  const borderSub = theme.palette.custom.borderSubtle;
  const surface   = theme.palette.custom.surfaceSubtle;

  useEffect(() => {
    const onScroll = () => setScrolled(globalThis.scrollY > 20);
    globalThis.addEventListener("scroll", onScroll);
    return () => globalThis.removeEventListener("scroll", onScroll);
  }, []);

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

  // ── Mobile drawer ─────────────────────────────────────────
  const drawer = (
    <Box sx={{ height: "100%", backgroundColor: bgPaper, display: "flex", flexDirection: "column", padding: "28px 24px" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box component="img" src={logo} alt="logo"
          sx={{ width: "100px", height: "auto" }} />
        <IconButton onClick={handleDrawerToggle}
          sx={{ color: textPri, border: `0.5px solid ${border}`, borderRadius: "8px", padding: "6px", "&:hover": { backgroundColor: surface } }}>
          <Close sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      {/* Nav links */}
      <List sx={{ flex: 1, p: 0 }}>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              component={Link} to={`/${item.toLowerCase()}`} onClick={handleDrawerToggle}
              sx={{
                py: "14px", px: 0,
                borderBottom: `0.5px solid ${border}`,
                color: isActive(item) ? textPri : textSec,
                "&:hover": { backgroundColor: "transparent", color: textPri },
                "& .MuiListItemText-primary": { fontSize: "15px", fontWeight: isActive(item) ? 500 : 400 },
              }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                <Box sx={{ width: "20px", height: "1px", backgroundColor: isActive(item) ? textPri : border }} />
                <ListItemText primary={item} />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom: CTA + toggle */}
      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button component={Link} to="/contact" onClick={handleDrawerToggle} endIcon={<RightArrow />}
          sx={{
            width: "100%", py: "12px",
            border: `0.5px solid ${borderSub}`, borderRadius: "8px",
            color: textPri, fontSize: "13px", fontWeight: 500, textTransform: "none",
            "&:hover": { backgroundColor: surface },
          }}>
          Book a Demo
        </Button>
        <ThemeToggle mode={mode} onToggle={toggleMode} />
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{
        backgroundColor: scrolled
          ? mode === "dark" ? "rgba(4,4,4,0.92)" : "rgba(255,255,255,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `0.5px solid ${border}` : "0.5px solid transparent",
        boxShadow: "none",
        transition: "all 0.35s ease",
        padding: { xs: "0 20px", sm: "0 48px", lg: "0 80px" },
      }}>
        <Toolbar sx={{ px: "0 !important", minHeight: { xs: "64px", md: "72px" }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* Logo */}
          <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Box component="img" src={logo} alt="logo"
              sx={{ width: { xs: "90px", md: "110px" }, height: "auto",
                    "&:hover": { opacity: 0.8 }, transition: "opacity 0.2s" }} />
          </Box>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "4px" }}>
            {navItems.map((item) => (
              <Button key={item} component={Link} to={`/${item.toLowerCase()}`}
                sx={{
                  color: isActive(item) ? textPri : textSec,
                  fontSize: "13px", fontWeight: isActive(item) ? 500 : 400,
                  textTransform: "none", px: "14px", py: "6px", borderRadius: "6px",
                  "&:hover": { color: textPri, backgroundColor: surface },
                  position: "relative",
                  "&::after": isActive(item) ? {
                    content: '""', position: "absolute", bottom: "2px",
                    left: "50%", transform: "translateX(-50%)",
                    width: "4px", height: "4px", borderRadius: "50%", backgroundColor: textPri,
                  } : {},
                }}>
                {item}
              </Button>
            ))}
          </Box>

          {/* Desktop right: toggle + CTA */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "16px" }}>
            <ThemeToggle mode={mode} onToggle={toggleMode} />
            <Button component={Link} to="/contact" endIcon={<RightArrow />}
              sx={{
                px: "18px", py: "8px",
                border: `0.5px solid ${borderSub}`,
                borderRadius: "8px", color: textPri,
                fontSize: "13px", fontWeight: 500, textTransform: "none",
                "&:hover": { backgroundColor: textPri, color: bg, borderColor: textPri },
              }}>
              Book a Demo
            </Button>
          </Box>

          {/* Mobile hamburger */}
          <IconButton edge="start" onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, color: textPri, border: `0.5px solid ${border}`, borderRadius: "8px", padding: "8px", "&:hover": { backgroundColor: surface } }}>
            {React.createElement(mode === "light" ? MenuIconLight : MenuIconDark)}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Box component="nav">
        <Drawer container={container} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, backgroundColor: bgPaper, border: "none", borderRight: `0.5px solid ${border}` },
          }}>
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};