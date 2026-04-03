import { FC, useState, useEffect, useRef } from "react";
import { Box, Grid2 as Grid, Stack, Typography } from "@mui/material";
import * as THREE from "three";
import { useThemeMode } from "../../../../theme/theme";

const PRINCIPLES = [
  {
    index: "01", title: "Ship or die.",
    body: "Every engagement ends with working software in the wild — not a prototype collecting dust.",
    hue: 0.1, speed: 3.0,
  },
  {
    index: "02", title: "AI-first, always.",
    body: "Intelligence isn't a feature. It's the foundation, wired into every product from day one.",
    hue: 0.5, speed: 6.0,
  },
  {
    index: "03", title: "Radical ownership.",
    body: "We treat your roadmap like it's ours. No ticket-pushers — just engineers who give a damn.",
    hue: 0.8, speed: 1.5,
  },
  {
    index: "04", title: "Results, not reports.",
    body: "You measure us by working software, not status updates. Done when it ships and works.",
    hue: 0.3, speed: 4.5,
  },
];

export const FirstGeneralSection: FC = () => {
  const { mode } = useThemeMode();
  const isLight = mode === "light";

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef  = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const materialsRef = useRef<THREE.PointsMaterial[]>([]);

  // ── Theme tokens ────────────────────────────────────────────────────────
  const bgColor       = isLight ? "#FFF4E3" : "#161616";
  const borderColor   = isLight ? "#d9c9b0" : "#2a2a2a";
  const eyebrowColor  = isLight ? "#001932" : "#BBC0C6";
  const headlineColor = isLight ? "#001932" : "#FFF4E3";
  const headlineFaded = isLight ? "#BBC0C6" : "#3a3a3a";
  const subTextColor  = isLight ? "#4a4a6a" : "#BBC0C6";
  const gridGapColor  = isLight ? "#d9c9b0" : "#2a2a2a";
  const gridBorder    = isLight ? "#001932" : "#FFF4E3";
  const cardBg        = isLight ? "#FFF4E3" : "#161616";
  const cardHoverBg   = isLight ? "rgba(0,25,50,0.03)" : "rgba(255,244,227,0.03)";
  const indexColor    = isLight ? "#6a6a6a" : "#3a3a3a";
  const titleColor    = isLight ? "#001932" : "#FFF4E3";
  const bodyColor     = isLight ? "#4a4a6a" : "#BBC0C6";

  const defaultParticleColor = isLight ? 0x001932 : 0x2a2a2a;

  useEffect(() => {
    if (!containerRef.current) return;

    const width  = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 500;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const group = new THREE.Group();
    scene.add(group);

    const ringCount = 4;
    const particleSystems: THREE.Points[] = [];
    materialsRef.current = [];

    for (let r = 0; r < ringCount; r++) {
      const geometry  = new THREE.BufferGeometry();
      const count     = 400;
      const positions = new Float32Array(count * 3);
      const radius    = 10 + r * 4;

      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const rand  = (Math.random() - 0.5) * 1.5;
        positions[i * 3]     = Math.cos(theta) * radius + rand;
        positions[i * 3 + 1] = Math.sin(theta) * radius + rand;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.15,
        color: defaultParticleColor,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      materialsRef.current.push(material);
      const points = new THREE.Points(geometry, material);
      group.add(points);
      particleSystems.push(points);
    }

    const clock = new THREE.Clock();

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particleSystems.forEach((system, idx) => {
        const baseSpeed    = PRINCIPLES[idx].speed;
        const currentSpeed = hoveredIndex === idx ? baseSpeed * 2.5 : baseSpeed * 0.5;
        system.rotation.z  = t * 0.05 * currentSpeed * (idx % 2 === 0 ? 1 : -1);
        system.rotation.x  = Math.sin(t * 0.2) * 0.2;

        const material = materialsRef.current[idx];
        if (material) {
          if (hoveredIndex === idx) {
            material.size    = 0.25;
            material.opacity = 0.9;
            material.color.lerp(new THREE.Color().setHSL(PRINCIPLES[idx].hue, 1.0, 0.5), 0.1);
          } else {
            material.size    = 0.12;
            material.opacity = isLight ? 0.35 : 0.40;
            material.color.lerp(new THREE.Color(defaultParticleColor), 0.05);
          }
        }
      });

      group.rotation.y = Math.sin(t * 0.1) * 0.3;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hoveredIndex, mode]);

  return (
    <Box sx={{
      backgroundColor: bgColor,
      borderTop:    `0.5px solid ${borderColor}`,
      borderBottom: `0.5px solid ${borderColor}`,
      px: { xs: "24px", sm: "48px", lg: "80px" },
      py: { xs: "80px", sm: "100px", md: "130px" },
      position: "relative", overflow: "hidden",
      transition: "background-color 0.4s ease, border-color 0.4s ease",
    }}>
      {/* Three.js background */}
      <Box ref={containerRef} sx={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
        opacity: isLight ? 0.45 : 0.65,
        transition: "opacity 0.4s ease",
      }} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          gap={4}
          mb={{ xs: "56px", md: "72px" }}
        >
          <Box>
            <Typography sx={{
              fontSize: "11px", color: eyebrowColor,
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontWeight: 600, mb: "16px",
              transition: "color 0.4s ease",
            }}>
              ✦ Why we're different
            </Typography>
            <Typography sx={{
              fontSize: { xs: "32px", sm: "44px", md: "56px" },
              fontWeight: 500, color: headlineColor,
              lineHeight: 1.1, letterSpacing: "-0.02em",
              fontFamily: "'Georgia', serif", maxWidth: "520px",
              transition: "color 0.4s ease",
            }}>
              We don't consult.{" "}
              <Box component="span" sx={{ color: headlineFaded, transition: "color 0.4s ease" }}>
                We build.
              </Box>
            </Typography>
          </Box>

          <Typography sx={{
            fontSize: "15px", color: subTextColor,
            lineHeight: 1.75, maxWidth: "340px",
            transition: "color 0.4s ease",
          }}>
            Born from frustration with agencies that talk about AI but can't ship
            it. We're engineers who live at the intersection of research and
            production reality.
          </Typography>
        </Stack>

        {/* Principles grid */}
        <Grid container spacing={{ xs: "1px", md: "1px" }} sx={{
          backgroundColor: gridGapColor,
          border: `2px solid ${gridBorder}`,
          transition: "background-color 0.4s ease, border-color 0.4s ease",
        }}>
          {PRINCIPLES.map((p, i) => (
            <Grid key={p.index} size={{ xs: 12, sm: 6 }}>
              <Box
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  p: { xs: "28px", sm: "36px" },
                  backgroundColor: cardBg,
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "crosshair",
                  position: "relative",
                  "&:hover": { backgroundColor: cardHoverBg },
                }}
              >
                {/* Accent bar */}
                <Box sx={{
                  position: "absolute", top: 0, left: 0,
                  width: "4px", height: "100%",
                  backgroundColor: hoveredIndex === i
                    ? `hsl(${p.hue * 360}, 70%, 45%)`
                    : "transparent",
                  transition: "background-color 0.3s ease",
                }} />

                <Typography sx={{
                  fontSize: "11px",
                  color: hoveredIndex === i
                    ? `hsl(${p.hue * 360}, 70%, 45%)`
                    : indexColor,
                  fontFamily: "monospace", mb: "20px",
                  letterSpacing: "0.04em",
                  transition: "color 0.3s ease",
                }}>
                  {p.index}
                </Typography>

                <Typography sx={{
                  fontSize: { xs: "18px", sm: "20px" },
                  fontWeight: 500, color: titleColor,
                  mb: "12px", letterSpacing: "-0.01em",
                  transition: "color 0.4s ease",
                }}>
                  {p.title}
                </Typography>

                <Typography sx={{
                  fontSize: "14px", color: bodyColor,
                  lineHeight: 1.75, transition: "color 0.4s ease",
                }}>
                  {p.body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};