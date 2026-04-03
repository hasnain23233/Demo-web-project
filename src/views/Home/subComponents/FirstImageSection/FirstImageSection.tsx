import { FC, useEffect, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import * as THREE from "three";
import { Sun, Moon, Snowflake, Sparkles } from "lucide-react";
import CodeImage1Dark from '../../../../assets/Images/CodeImages/CodeImage1Dark.png'
import CodeImage1Light from '../../../../assets/Images/CodeImages/CodeImage1Light.png'
import { useThemeMode } from "../../../../theme/theme";

const TopGlow: FC<{ mode: "light" | "dark" }> = ({ mode }) => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "60%",
      height: "1px",
      background:
        mode === "dark"
          ? "linear-gradient(90deg, transparent, rgba(0,255,200,0.2), transparent)"
          : "linear-gradient(90deg, transparent, rgba(0,100,255,0.45), transparent)", // stronger in light
      pointerEvents: "none",
    }}
  />
);

interface ColdAnimationProps {
  type: "frost-nodes" | "crystal-cage";
  mode: "light" | "dark";
}

const ColdAnimation: FC<ColdAnimationProps> = ({ type }) => {
  const { mode, toggleMode } = useThemeMode();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    let animationFrameId: number;

    const isLight = mode === "light";
    const primaryColor = isLight ? 0x0a84ff : 0x00e5ff;
    const secondaryColor = isLight ? 0x0040dd : 0x70ffff;

    if (type === "frost-nodes") {
      const particleCount = 180;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

        const color = new THREE.Color(isLight ? 0x0055ff : 0x00f3ff);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        velocities[i * 3] = (Math.random() - 0.5) * 0.005;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: isLight ? 0.7 : 0.8,
        blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      group.add(points);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: isLight ? 0.25 : 0.2, // more visible in light
        blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      });

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lines);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        const positionArray = points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positionArray[i * 3] += velocities[i * 3];
          positionArray[i * 3 + 1] += velocities[i * 3 + 1];
          positionArray[i * 3 + 2] += velocities[i * 3 + 2];

          if (Math.abs(positionArray[i * 3]) > 4) velocities[i * 3] *= -1;
          if (Math.abs(positionArray[i * 3 + 1]) > 4) velocities[i * 3 + 1] *= -1;
          if (Math.abs(positionArray[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1;
        }
        points.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.position.needsUpdate = true;

        group.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();
    } else {
      const geometry = new THREE.IcosahedronGeometry(2, 0);
      const material = new THREE.MeshBasicMaterial({
        color: secondaryColor,
        wireframe: true,
        transparent: true,
        opacity: isLight ? 0.3 : 0.4, // slightly more visible in light
      });

      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);

      const innerGeo = new THREE.OctahedronGeometry(1, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        wireframe: true,
        transparent: true,
        opacity: isLight ? 0.55 : 0.6, // slightly more visible in light
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerMesh);

      const ringGeo = new THREE.RingGeometry(2.5, 2.6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isLight ? 0.18 : 0.2, // slightly more visible in light
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        group.rotation.y += 0.002;
        group.rotation.x += 0.001;
        innerMesh.rotation.y -= 0.005;
        renderer.render(scene, camera);
      };
      animate();
    }

    const handleResize = () => {
      if (!container) return;
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [type, mode]);

  return <Box ref={containerRef} sx={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />;
};

export const FirstImageSection: FC = () => {
  const { mode, toggleMode } = useThemeMode();

  // ── FIXED: removed invalid hex-alpha values; used proper rgba() or solid hex ──
  const bgColor         = mode === "dark" ? "#040404"  : "#f5f7fb";          // removed trailing "e8"
  const cardBgColor     = mode === "dark" ? "#060606"  : "#ffffff";
  const borderColor     = mode === "dark" ? "#1a1a1a"  : "#d0dff7";          // soft blue-grey — not bright blue
  const primaryTextColor   = mode === "dark" ? "#ffffff"  : "#0d0d0d";
  const secondaryTextColor = mode === "dark" ? "#f3ecec"  : "#4a4545";       // removed trailing "e0"
  const strokeColor     = mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";

  // Light-mode accent colour used for tags, labels, monospace text, etc.
  const accentColor = mode === "dark" ? "#00ffcc" : "#0055ff";

  return (
    <Box
      sx={{
        backgroundColor: bgColor,
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
          backgroundColor: borderColor,
          border: `0.5px solid ${borderColor}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: mode === "dark" ? "none" : "0 10px 40px rgba(0,80,200,0.07), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Cell: Heading + text */}
        <Box
          sx={{
            backgroundColor: bgColor,
            p: { xs: "32px", sm: "40px", md: "48px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "32px",
            position: "relative",
          }}
        >
          <TopGlow mode={mode} />

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography
              sx={{ fontSize: "11px", color: secondaryTextColor, fontFamily: "monospace", letterSpacing: "0.06em" }}
            >
              01
            </Typography>
            <Box sx={{ width: "40px", height: "0.5px", backgroundColor: strokeColor }} />
            <Typography
              sx={{ fontSize: "11px", color: secondaryTextColor, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}
            >
              How it works
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "30px", sm: "38px", md: "46px", lg: "52px" },
                fontWeight: 500,
                color: primaryTextColor,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontFamily: "'Georgia', serif",
                mb: "12px",
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
                // FIXED: removed WebkitTextStroke on light — it made text blurry/hard to read.
                // Use a proper muted colour instead.
                color: mode === "dark" ? "rgba(255,255,255,0.25)" : "#a0aec0",
              }}
            >
              not just for demos.
            </Typography>
          </Box>

          <Typography sx={{ fontSize: "15px", color: secondaryTextColor, lineHeight: 1.8, maxWidth: "420px" }}>
            Deploy production-grade code with automated icy particle pipelines. Maintain a rigid architectural core while harnessing the flow of AI generation.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["Production-grade", "Scalable", "AI-native"].map((tag) => (
              <Box
                key={tag}
                sx={{
                  px: "12px", py: "5px",
                  border: `0.5px solid ${borderColor}`,
                  borderRadius: "99px",
                  // FIXED: in light mode white pill on white bg was invisible — use a tinted bg
                  backgroundColor: mode === "dark" ? cardBgColor : "#eef3fc",
                }}
              >
                <Typography sx={{ fontSize: "12px", color: secondaryTextColor }}>{tag}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Cell: 3D Animation + Images */}
        <Box
          sx={{
            backgroundColor: cardBgColor,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: "28px", sm: "32px" },
            gap: "12px",
            minHeight: { xs: "300px", md: "420px" },
            overflow: "hidden",
          }}
        >
          <TopGlow mode={mode} />
          <Box
            sx={{
              position: "absolute",
              top: "40%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "280px", height: "280px",
              // FIXED: stronger radial glow so it's actually visible on a white card
              background: mode === "dark"
                ? "radial-gradient(ellipse, rgba(0,255,200,0.06) 0%, transparent 65%)"
                : "radial-gradient(ellipse, rgba(0,100,255,0.08) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          {/* Background cold animation */}
          <ColdAnimation type="frost-nodes" mode={mode} />
 

          <Box sx={{ zIndex: 12, position: "absolute", bottom: "16px", left: "16px", display: "flex", alignItems: "center", gap: 1 }}>
            <Snowflake size={14} className="text-cyan-400 animate-spin-slow" />
            <Typography sx={{ fontSize: "10px", color: accentColor, fontFamily: "monospace" }}>
              LIVE: COLD FROST NODES SYSTEM
            </Typography>
          </Box>
        </Box>

        {/* Cell: Stats full-width bottom row */}
        <Box
          sx={{
            // FIXED: white card on white page — give light mode a very subtle tint
            backgroundColor: mode === "dark" ? cardBgColor : "#f8faff",
            gridColumn: { xs: "1", md: "1 / -1" },
            p: { xs: "24px 32px", sm: "28px 48px" },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            borderTop: `0.5px solid ${borderColor}`,
          }}
        >
          {[
            { num: "50+", label: "Products shipped" },
            { num: "40–60%", label: "Faster delivery" },
            { num: "100%", label: "Human reviewed" },
            { num: "0", label: "Vibe-coded lines" },
          ].map(({ num, label }, i) => (
            <Box
              key={label}
              sx={{
                flex: 1,
                px: { xs: "0", sm: "24px" },
                py: { xs: "16px", sm: "8px" },
                borderLeft: { xs: "none", sm: i === 0 ? "none" : `0.5px solid ${borderColor}` },
                borderTop: { xs: i === 0 ? "none" : `0.5px solid ${borderColor}`, sm: "none" },
              }}
            >
              <Typography
                sx={{ fontSize: { xs: "20px", sm: "24px" }, fontWeight: 500, color: primaryTextColor, lineHeight: 1, mb: "6px" }}
              >
                {num}
              </Typography>
              <Typography sx={{ fontSize: "11px", color: secondaryTextColor, letterSpacing: "0.04em" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          DIVIDER with center dot
      ══════════════════════════════════════ */}
      <Box
        sx={{
          my: { xs: "72px", sm: "96px", md: "120px" },
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box sx={{ flex: 1, height: "0.5px", backgroundColor: borderColor }} />
        <Box
          sx={{
            width: "6px", height: "6px",
            borderRadius: "50%",
            border: `0.5px solid ${secondaryTextColor}`,
            backgroundColor: cardBgColor,
          }}
        />
        <Box sx={{ flex: 1, height: "0.5px", backgroundColor: borderColor }} />
      </Box>

      {/* ══════════════════════════════════════
          BLOCK 2 — Split card with corner accents
      ══════════════════════════════════════ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: "1px",
          backgroundColor: borderColor,
          border: `0.5px solid ${borderColor}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: mode === "dark" ? "none" : "0 10px 40px rgba(0,80,200,0.07), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Cell: 3D Canvas cell instead of static image */}
        <Box
          sx={{
            backgroundColor: cardBgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: "32px", sm: "40px" },
            position: "relative",
            minHeight: { xs: "280px", md: "420px" },
            order: { xs: 2, md: 1 },
          }}
        >
          <TopGlow mode={mode} />
          {/* Corner accent — top left */}
          <Box sx={{ position: "absolute", top: "16px", left: "16px", width: "24px", height: "24px", borderTop: `0.5px solid ${secondaryTextColor}`, borderLeft: `0.5px solid ${secondaryTextColor}` }} />
          {/* Corner accent — bottom right */}
          <Box sx={{ position: "absolute", bottom: "16px", right: "16px", width: "24px", height: "24px", borderBottom: `0.5px solid ${secondaryTextColor}`, borderRight: `0.5px solid ${secondaryTextColor}` }} />

          <ColdAnimation type="crystal-cage" mode={mode} />

          <Box sx={{ zIndex: 12, position: "absolute", bottom: "16px", left: "16px", display: "flex", alignItems: "center", gap: 1 }}>
            <Sparkles size={14} className="text-blue-500 animate-pulse" />
            <Typography sx={{ fontSize: "10px", color: mode === "dark" ? "#70ffff" : "#0a84ff", fontFamily: "monospace" }}>
              LIVE: 3D CYBERNETIC GEOMETRY
            </Typography>
          </Box>
        </Box>

        {/* Text cell */}
        <Box
          sx={{
            backgroundColor: bgColor,
            p: { xs: "32px", sm: "40px", md: "48px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "28px",
            position: "relative",
            order: { xs: 1, md: 2 },
          }}
        >
          <TopGlow mode={mode} />

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography sx={{ fontSize: "11px", color: secondaryTextColor, fontFamily: "monospace", letterSpacing: "0.06em" }}>
              02
            </Typography>
            <Box sx={{ width: "40px", height: "0.5px", backgroundColor: strokeColor }} />
            <Typography sx={{ fontSize: "11px", color: secondaryTextColor, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
              Our approach
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: "30px", sm: "36px", md: "42px" },
                fontWeight: 500,
                color: primaryTextColor,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontFamily: "'Georgia', serif",
              }}
            >
              Engineers first.{" "}
              <Box
                component="span"
                // FIXED: was #999 in light (too washed out) — use a proper muted but legible tone
                sx={{ color: mode === "dark" ? "#444" : "#b0b8cc" }}
              >
                AI-enhanced.
              </Box>
            </Typography>
          </Box>

          <Stack gap={2}>
            <Typography sx={{ fontSize: "15px", color: secondaryTextColor, lineHeight: 1.8 }}>
              Our workflow eliminates the latency between design and deployment. Through advanced 3D generation and cold procedural shaders, we empower developers to materialize complete interfaces in the blink of an eye.
            </Typography>
          </Stack>

          {/* Metrics grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              backgroundColor: borderColor,
              border: `0.5px solid ${borderColor}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {[
              { num: "40–60%", label: "Faster delivery" },
              { num: "100%", label: "Human reviewed" },
            ].map(({ num, label }) => (
              <Box
                key={label}
                // FIXED: white on white — use tinted background for light mode metric cells
                sx={{ backgroundColor: mode === "dark" ? cardBgColor : "#f0f5ff", px: "20px", py: "18px" }}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: 500, color: primaryTextColor, lineHeight: 1, mb: "6px" }}>
                  {num}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: secondaryTextColor, letterSpacing: "0.04em" }}>
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