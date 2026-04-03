import { FC, useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import * as THREE from "three";
import { Snowflake, Sparkles } from "lucide-react";
import { useThemeMode } from "../../../../theme/theme";
import lightMode from '../../../../assets/Images/CodeImages/CodeImage1Light.png'
import darkMode from '../../../../assets/Images/CodeImages/CodeImage1Dark.png'

import { PerformanceNodes } from '../../../../components/model3DAnimation'

import Code2ImageDark from '../../../../assets/Images/CodeImages/Code2ImageDark.gif'
import CodeImage3LightChat from '../../../../assets/Images/CodeImages/CodeImage3LightChat.gif'

const getTokens = (isDark: boolean) => ({
  bg:            isDark ? "#000c2e" : "#f0f4ff",
  cardBg:        isDark ? "#000c2e" : "#ffffff",
  cardBgAlt:     isDark ? "#020e38" : "#f8faff",
  border:        isDark ? "#1a2a5e" : "#c2d0f0",
  stroke:        isDark ? "rgba(255,255,255,0.10)" : "rgba(0,12,46,0.12)",
  primaryText:   isDark ? "#ffffff" : "#000c2e",
  secondaryText: isDark ? "#6b7fa8" : "#3a4e78",
  fadedText:     isDark ? "#2e4a8a" : "#a0aec0",
  accent:        isDark ? "#4a9eff" : "#0055cc",
  accentGlow:    isDark ? "rgba(74,158,255,0.12)" : "rgba(0,85,204,0.08)",
  tagBg:         isDark ? "#020e38" : "#eef3fc",
  pillBorder:    isDark ? "#1a2a5e" : "#c2d0f0",
  particlePrimary:   isDark ? 0x4a9eff : 0x0055cc,
  particleSecondary: isDark ? 0x1a3a7a : 0x3a5a9e,
  glowTop:       isDark
    ? "linear-gradient(90deg, transparent, rgba(74,158,255,0.18), transparent)"
    : "linear-gradient(90deg, transparent, rgba(0,85,204,0.30), transparent)",
  boxShadow:     isDark
    ? "none"
    : "0 8px 40px rgba(0,40,160,0.08), 0 2px 8px rgba(0,0,0,0.04)",
});

const TopGlow: FC<{ tokens: ReturnType<typeof getTokens> }> = ({ tokens }) => (
  <Box
    sx={{
      position: "absolute", top: 0, left: "50%",
      transform: "translateX(-50%)",
      width: "60%", height: "1px",
      background: tokens.glowTop,
      pointerEvents: "none",
      zIndex: 2,
    }}
  />
);

const CornerAccents: FC<{ color: string }> = ({ color }) => (
  <>
    <Box sx={{ position: "absolute", top: "16px", left: "16px", width: "20px", height: "20px", borderTop: `0.5px solid ${color}`, borderLeft: `0.5px solid ${color}`, zIndex: 2 }} />
    <Box sx={{ position: "absolute", bottom: "16px", right: "16px", width: "20px", height: "20px", borderBottom: `0.5px solid ${color}`, borderRight: `0.5px solid ${color}`, zIndex: 2 }} />
  </>
);

interface ColdAnimationProps {
  type: "frost-nodes" | "crystal-cage";
  isDark: boolean;
}

const ColdAnimation: FC<ColdAnimationProps> = ({ type, isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width  = container.clientWidth  || 300;
    const height = container.clientHeight || 300;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    let animationFrameId: number;

    const primaryColor   = isDark ? 0x4a9eff : 0x0055cc;
    const secondaryColor = isDark ? 0x1a3a7a : 0x3a5a9e;

    if (type === "frost-nodes") {
      const particleCount = 180;
      const positions  = new Float32Array(particleCount * 3);
      const colors     = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      const baseColor = new THREE.Color(isDark ? 0x4a9eff : 0x0055cc);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

        colors[i * 3]     = baseColor.r;
        colors[i * 3 + 1] = baseColor.g;
        colors[i * 3 + 2] = baseColor.b;

        velocities[i * 3]     = (Math.random() - 0.5) * 0.005;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color",    new THREE.BufferAttribute(colors,    3));

      const material = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.8 : 0.65,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });

      const points = new THREE.Points(geometry, material);
      group.add(points);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: isDark ? 0.18 : 0.22,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lines);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const pos = points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3]     += velocities[i * 3];
          pos[i * 3 + 1] += velocities[i * 3 + 1];
          pos[i * 3 + 2] += velocities[i * 3 + 2];
          if (Math.abs(pos[i * 3])     > 4) velocities[i * 3]     *= -1;
          if (Math.abs(pos[i * 3 + 1]) > 4) velocities[i * 3 + 1] *= -1;
          if (Math.abs(pos[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1;
        }
        points.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.position.needsUpdate  = true;
        group.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();

    } else {
      const outerGeo  = new THREE.IcosahedronGeometry(2, 0);
      const outerMat  = new THREE.MeshBasicMaterial({
        color: secondaryColor, wireframe: true, transparent: true,
        opacity: isDark ? 0.4 : 0.35,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      group.add(outerMesh);

      const innerGeo  = new THREE.OctahedronGeometry(1, 0);
      const innerMat  = new THREE.MeshBasicMaterial({
        color: primaryColor, wireframe: true, transparent: true,
        opacity: isDark ? 0.6 : 0.55,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerMesh);

      const ringGeo = new THREE.RingGeometry(2.5, 2.6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: primaryColor, side: THREE.DoubleSide, transparent: true,
        opacity: isDark ? 0.2 : 0.18,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        group.rotation.y     += 0.002;
        group.rotation.x     += 0.001;
        innerMesh.rotation.y -= 0.005;
        renderer.render(scene, camera);
      };
      animate();
    }

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [type, isDark]);

  return (
    <Box
      ref={containerRef}
      sx={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
    />
  );
};

export const FirstImageSection: FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const T = getTokens(isDark);

  return (
    <Box
      sx={{
        backgroundColor: T.bg,
        px: { xs: "24px", sm: "48px", lg: "80px" },
        py: { xs: "80px", sm: "100px", md: "130px" },
        transition: "background-color 0.4s ease",
      }}
    >

      {/* ══════════════════════════════════════
          BLOCK 1 — Bento grid
      ══════════════════════════════════════ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "5fr 4fr" },
          gap: "1px",
          backgroundColor: T.border,
          border: `2px solid ${isDark ? "#ffffff" : "#000c2e"}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: T.boxShadow,
          transition: "border-color 0.4s ease, background-color 0.4s ease",
        }}
      >
        {/* ── Cell: Heading + text ── */}
        <Box
          sx={{
            backgroundColor: T.bg,
            p: { xs: "32px", sm: "40px", md: "48px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "32px",
            position: "relative",
            transition: "background-color 0.4s ease",
          }}
        >
          <TopGlow tokens={T} />

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography sx={{ fontSize: "11px", color: T.secondaryText, fontFamily: "monospace", letterSpacing: "0.06em", transition: "color 0.4s ease" }}>
              01
            </Typography>
            <Box sx={{ width: "40px", height: "0.5px", backgroundColor: T.stroke }} />
            <Typography sx={{ fontSize: "11px", color: T.secondaryText, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, transition: "color 0.4s ease" }}>
              How it works
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "30px", sm: "38px", md: "46px", lg: "52px" },
                fontWeight: 500,
                color: T.primaryText,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontFamily: "'Georgia', serif",
                mb: "12px",
                transition: "color 0.4s ease",
              }}
            >
              Built for scale,
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "30px", sm: "38px", md: "46px", lg: "52px" },
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontFamily: "'Georgia', serif",
                color: T.fadedText,
                transition: "color 0.4s ease",
              }}
            >
              not just for demos.
            </Typography>
          </Box>

          <Typography sx={{ fontSize: "15px", color: T.secondaryText, lineHeight: 1.8, maxWidth: "420px", transition: "color 0.4s ease" }}>
            Deploy production-grade code with automated icy particle pipelines. Maintain a rigid architectural core while harnessing the flow of AI generation.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["Production-grade", "Scalable", "AI-native"].map((tag) => (
              <Box
                key={tag}
                sx={{
                  px: "12px", py: "5px",
                  border: `0.5px solid ${T.pillBorder}`,
                  borderRadius: "99px",
                  backgroundColor: T.tagBg,
                  transition: "background-color 0.4s ease, border-color 0.4s ease",
                }}
              >
                <Typography sx={{ fontSize: "12px", color: T.secondaryText, transition: "color 0.4s ease" }}>
                  {tag}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Cell: 3D frost-nodes animation ── */}
        <Box
          sx={{
            backgroundColor: T.cardBg,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: "28px", sm: "32px" },
            minHeight: { xs: "300px", md: "420px" },
            overflow: "hidden",
            transition: "background-color 0.4s ease",
          }}
        >
          <TopGlow tokens={T} />

          {/* Radial glow */}
          <Box
            sx={{
              position: "absolute", top: "40%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "280px", height: "280px",
              background: `radial-gradient(ellipse, ${T.accentGlow} 0%, transparent 65%)`,
              pointerEvents: "none",
            }}
          />

          <ColdAnimation type="frost-nodes" isDark={isDark} />

            {/* ── Mode-aware image ── */}
<Box
  component="img"
  src={isDark ? darkMode : lightMode}
  alt="Code preview"
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "80%", sm: "85%", md: "90%" },
    height: "auto",
    borderRadius: "10px",
    zIndex: 10,
    pointerEvents: "none",
    opacity: 0.92,
    transition: "opacity 0.4s ease",
  }}
/>

          <Box sx={{ zIndex: 12, position: "absolute", bottom: "16px", left: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Snowflake size={13} color={T.accent} />
            <Typography sx={{ fontSize: "10px", color: T.accent, fontFamily: "monospace", letterSpacing: "0.06em", transition: "color 0.4s ease" }}>
              LIVE: COLD FROST NODES SYSTEM
            </Typography>
          </Box>
        </Box>

        {/* ── Cell: Stats row ── */}
        <Box
          sx={{
            backgroundColor: T.cardBgAlt,
            gridColumn: { xs: "1", md: "1 / -1" },
            p: { xs: "24px 32px", sm: "28px 48px" },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            borderTop: `0.5px solid ${T.border}`,
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}
        >
          {[
            { num: "50+",    label: "Products shipped" },
            { num: "40–60%", label: "Faster delivery"  },
            { num: "100%",   label: "Human reviewed"   },
            { num: "0",      label: "Vibe-coded lines"  },
          ].map(({ num, label }, i) => (
            <Box
              key={label}
              sx={{
                flex: 1,
                px: { xs: "0", sm: "24px" },
                py: { xs: "16px", sm: "8px" },
                borderLeft: { xs: "none", sm: i === 0 ? "none" : `0.5px solid ${T.border}` },
                borderTop:  { xs: i === 0 ? "none" : `0.5px solid ${T.border}`, sm: "none" },
                transition: "border-color 0.4s ease",
              }}
            >
              <Typography sx={{ fontSize: { xs: "20px", sm: "24px" }, fontWeight: 500, color: T.primaryText, lineHeight: 1, mb: "6px", transition: "color 0.4s ease" }}>
                {num}
              </Typography>
              <Typography sx={{ fontSize: "11px", color: T.secondaryText, letterSpacing: "0.04em", transition: "color 0.4s ease" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          DIVIDER with centre dot
      ══════════════════════════════════════ */}
      <Box
        sx={{
          my: { xs: "72px", sm: "96px", md: "120px" },
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box sx={{ flex: 1, height: "0.5px", backgroundColor: T.border, transition: "background-color 0.4s ease" }} />
        <Box
          sx={{
            width: "6px", height: "6px",
            borderRadius: "50%",
            border: `0.5px solid ${T.secondaryText}`,
            backgroundColor: T.cardBg,
            transition: "border-color 0.4s ease, background-color 0.4s ease",
          }}
        />
        <Box sx={{ flex: 1, height: "0.5px", backgroundColor: T.border, transition: "background-color 0.4s ease" }} />
      </Box>

      {/* ══════════════════════════════════════
          BLOCK 2 — Split card
      ══════════════════════════════════════ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: "1px",
          backgroundColor: T.border,
          border: `2px solid ${isDark ? "#ffffff" : "#000c2e"}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: T.boxShadow,
          transition: "border-color 0.4s ease, background-color 0.4s ease",
        }}
      >
        {/* ── Cell: 3D crystal-cage animation ── */}
        <Box
          sx={{
            backgroundColor: T.cardBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: "32px", sm: "40px" },
            position: "relative",
            minHeight: { xs: "280px", md: "420px" },
            overflow: "hidden",
            order: { xs: 2, md: 1 },
            transition: "background-color 0.4s ease",
          }}
        >
          <TopGlow tokens={T} />
          <CornerAccents color={T.secondaryText} /> 
          
          <PerformanceNodes />

          <Box sx={{ zIndex: 12, position: "absolute", bottom: "16px", left: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={13} color={T.accent} />
            <Typography sx={{ fontSize: "10px", color: T.accent, fontFamily: "monospace", letterSpacing: "0.06em", transition: "color 0.4s ease" }}>
              LIVE: 3D CYBERNETIC GEOMETRY
            </Typography>
          </Box>
        </Box>

        {/* ── Cell: Text + metrics ── */}
        <Box
          sx={{
            backgroundColor: T.bg,
            p: { xs: "32px", sm: "40px", md: "48px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "28px",
            position: "relative",
            order: { xs: 1, md: 2 },
            transition: "background-color 0.4s ease",
          }}
        >
          <TopGlow tokens={T} />

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography sx={{ fontSize: "11px", color: T.secondaryText, fontFamily: "monospace", letterSpacing: "0.06em", transition: "color 0.4s ease" }}>
              02
            </Typography>
            <Box sx={{ width: "40px", height: "0.5px", backgroundColor: T.stroke }} />
            <Typography sx={{ fontSize: "11px", color: T.secondaryText, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, transition: "color 0.4s ease" }}>
              Our approach
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "30px", sm: "36px", md: "42px" },
              fontWeight: 500,
              color: T.primaryText,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontFamily: "'Georgia', serif",
              transition: "color 0.4s ease",
            }}
          >
            Engineers first.{" "}
            <Box component="span" sx={{ color: T.fadedText, transition: "color 0.4s ease" }}>
              AI-enhanced.
            </Box>
          </Typography>

          <Stack gap={2}>
            <Typography sx={{ fontSize: "15px", color: T.secondaryText, lineHeight: 1.8, transition: "color 0.4s ease" }}>
              Our workflow eliminates the latency between design and deployment. Through advanced 3D generation and cold procedural shaders, we empower developers to materialize complete interfaces in the blink of an eye.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              backgroundColor: T.border,
              border: `0.5px solid ${T.border}`,
              borderRadius: "12px",
              overflow: "hidden",
              transition: "background-color 0.4s ease, border-color 0.4s ease",
            }}
          >
            {[
              { num: "40–60%", label: "Faster delivery"  },
              { num: "100%",   label: "Human reviewed"   },
            ].map(({ num, label }) => (
              <Box
                key={label}
                sx={{ backgroundColor: T.cardBgAlt, px: "20px", py: "18px", transition: "background-color 0.4s ease" }}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: 500, color: T.primaryText, lineHeight: 1, mb: "6px", transition: "color 0.4s ease" }}>
                  {num}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: T.secondaryText, letterSpacing: "0.04em", transition: "color 0.4s ease" }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};