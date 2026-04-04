import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import model3D from './../models/models/earth2.glb?url';
import { useThemeMode } from "./../theme/theme"; // ← same as footer.tsx

// ── Theme tokens — exact same pattern as footer.tsx ───────────────────────────
const getTokens = (isDark: boolean) => ({
  pageBg:         isDark ? "#161616"                        : "#FFF4E3",
  canvasBg:       isDark
    ? "radial-gradient(ellipse at 50% 45%, #001932 0%, #060e1a 60%, #161616 100%)"
    : "radial-gradient(ellipse at 50% 45%, #ddeeff 0%, #eaf2fb 55%, #FFF4E3 100%)",
  border:         isDark ? "#2a2a2a"                        : "#d9c9b0",
  borderHover:    isDark ? "#3a3a3a"                        : "#c4b49a",
  headingColor:   isDark ? "#FFF4E3"                        : "#001932",
  headingMuted:   isDark ? "#BBC0C6"                        : "#4a7fa5",
  bodyText:       isDark ? "#4a4a6a"                        : "#4a5a6a",
  labelColor:     isDark ? "#BBC0C6"                        : "#4a7fa5",
  statValue:      isDark ? "#FFF4E3"                        : "#001932",
  statLabel:      isDark ? "#BBC0C6"                        : "#4a7fa5",
  divider:        isDark ? "#2a2a2a"                        : "#d9c9b0",
  gridLine:       isDark ? "rgba(187,192,198,0.03)"         : "rgba(0,25,50,0.04)",
  particle:       isDark ? "rgba(187,192,198,"              : "rgba(0,100,180,",
  ringA:          isDark ? "rgba(187,192,198,0.06)"         : "rgba(0,100,180,0.07)",
  ringB:          isDark ? "rgba(0,25,50,0.5)"              : "rgba(209,232,255,0.6)",
  scanline:       isDark ? "rgba(187,192,198,0.012)"        : "rgba(0,100,180,0.04)",
  bracketColor:   isDark ? "#2a2a2a"                        : "#c4b49a",
  dotColor:       isDark ? "#BBC0C6"                        : "#4a7fa5",
  dotGlow:        isDark ? "0 0 7px #BBC0C6"                : "0 0 7px rgba(0,100,180,0.5)",
  hintText:       isDark ? "#2a2a2a"                        : "#c4b49a",
  topLabel:       isDark ? "#3a3a3a"                        : "#bbc8d4",
  pillBorder:     isDark ? "#2a2a2a"                        : "#d9c9b0",
  pillBorderActive: isDark ? "#BBC0C6"                      : "#001932",
  pillBgActive:   isDark ? "rgba(187,192,198,0.1)"          : "rgba(0,25,50,0.07)",
  pillText:       isDark ? "#4a4a6a"                        : "#4a5a6a",
  pillTextActive: isDark ? "#FFF4E3"                        : "#001932",
  featureBg:      isDark ? "rgba(187,192,198,0.02)"         : "rgba(0,25,50,0.025)",
  featureLabel:   isDark ? "#BBC0C6"                        : "#4a7fa5",
  featureDesc:    isDark ? "#4a4a6a"                        : "#4a5a6a",
  ctaPrimBg:      isDark ? "#FFF4E3"                        : "#001932",
  ctaPrimText:    isDark ? "#161616"                        : "#FFF4E3",
  ctaSecBorder:   isDark ? "#2a2a2a"                        : "#d9c9b0",
  ctaSecText:     isDark ? "#BBC0C6"                        : "#4a7fa5",
  badgeBorder:    isDark ? "#2a2a2a"                        : "#d9c9b0",
  badgeText:      isDark ? "#BBC0C6"                        : "#4a7fa5",
  statsBg:        isDark ? "rgba(255,255,255,0.01)"         : "rgba(0,25,50,0.02)",
});

// ── Model (unchanged) ─────────────────────────────────────────────────────────
function Model() {
  const gltf = useGLTF(model3D);
  return <primitive object={gltf.scene} scale={1} />;
}

// ── Canvas particles ──────────────────────────────────────────────────────────
function Particles({ particleBase }: { particleBase: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.4 + 0.08,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${particleBase}${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [particleBase]);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ── Rotating dashed ring ──────────────────────────────────────────────────────
function Ring({ size, color, duration, reverse = false }: {
  size: number; color: string; duration: number; reverse?: boolean;
}) {
  return (
    <div style={{
      position: "absolute", width: size, height: size,
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none", zIndex: 0,
      animation: `${reverse ? "ringR" : "ringF"} ${duration}s linear infinite`,
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={size/2 - 2}
          fill="none" stroke={color} strokeWidth="0.5"
          strokeDasharray="5 16" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Stat badge ────────────────────────────────────────────────────────────────
function Stat({ value, label, delay, T }: {
  value: string; label: string; delay: string;
  T: ReturnType<typeof getTokens>;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
      animation: "fadeUp 0.7s ease both", animationDelay: delay,
    }}>
      <span style={{
        fontSize: "22px", fontWeight: 700,
        color: T.statValue,
        fontFamily: "'Georgia','Times New Roman',serif",
        letterSpacing: "-0.03em", lineHeight: 1,
        transition: "color 0.4s ease",
      }}>{value}</span>
      <span style={{
        fontSize: "9px", color: T.statLabel,
        fontFamily: "'DM Mono','Courier New',monospace",
        letterSpacing: "2px", textTransform: "uppercase",
        transition: "color 0.4s ease",
      }}>{label}</span>
    </div>
  );
}

// ── Feature pill ──────────────────────────────────────────────────────────────
function Pill({ icon, label, active, onClick, T }: {
  icon: string; label: string; active: boolean;
  onClick: () => void; T: ReturnType<typeof getTokens>;
}) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "7px",
      padding: "8px 16px",
      border: `0.5px solid ${active ? T.pillBorderActive : T.pillBorder}`,
      borderRadius: "99px",
      background: active ? T.pillBgActive : "transparent",
      color: active ? T.pillTextActive : T.pillText,
      fontSize: "11px",
      fontFamily: "'DM Mono','Courier New',monospace",
      letterSpacing: "1.5px", textTransform: "uppercase",
      cursor: "pointer",
      transition: "all 0.25s ease",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: "13px" }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Model3D() {
  const { mode } = useThemeMode();          // ← same hook as footer.tsx
  const isDark = mode === "dark";
  const T = getTokens(isDark);

  const [activeFeature, setActiveFeature] = useState(0);
  const [hovered, setHovered] = useState(false);

  const features = [
    {
      icon: "🌍",
      label: "Global Reach",
      desc: "Deploy across 6 continents with sub-20ms latency. Our distributed infrastructure ensures your users always connect to the nearest node.",
    },
    {
      icon: "🛰️",
      label: "Real-time Data",
      desc: "Live satellite feeds, geospatial analytics, and planetary intelligence updated every 30 seconds — no caching, no delay.",
    },
    {
      icon: "🔗",
      label: "Integration",
      desc: "Connect to any existing system via REST, GraphQL, or WebSocket. 200+ pre-built connectors for enterprise platforms.",
    },
    {
      icon: "🌿",
      label: "Sustainability",
      desc: "Carbon-neutral infrastructure powered by renewable energy. Every compute cycle offset and tracked in real time.",
    },
  ];

  const css = `
    @keyframes ringF    { to { transform: translate(-50%,-50%) rotate(360deg);  } }
    @keyframes ringR    { to { transform: translate(-50%,-50%) rotate(-360deg); } }
    @keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
    @keyframes pulse    { 0%,100%{opacity:0.35} 50%{opacity:1} }
    @keyframes scanline { 0%{top:-22%} 100%{top:112%} }
    @keyframes orbitDot {
      0%   { transform: rotate(0deg)   translateX(180px) rotate(0deg);   }
      100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
    }
    @keyframes orbitDot2 {
      0%   { transform: rotate(120deg)  translateX(220px) rotate(-120deg);  }
      100% { transform: rotate(480deg)  translateX(220px) rotate(-480deg); }
    }
  `;

  return (
    <div style={{
      width: "100%",
      background: T.pageBg,
      fontFamily: "'DM Mono','Courier New',monospace",
      overflow: "hidden",
      transition: "background 0.4s ease",
    }}>
      <style>{css}</style>

      {/* ══ HEADER ═══════════════════════════════════════════════════════ */}
      <div style={{
        textAlign: "center",
        padding: "80px 24px 52px",
        animation: "fadeUp 0.8s ease both",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "5px 16px",
          border: `0.5px solid ${T.badgeBorder}`,
          borderRadius: "99px", marginBottom: "28px",
          transition: "border-color 0.4s ease",
        }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: T.dotColor, boxShadow: T.dotGlow,
            display: "inline-block",
            animation: "pulse 2.2s ease infinite",
            transition: "background 0.4s ease",
          }} />
          <span style={{
            fontSize: "9px", color: T.badgeText,
            letterSpacing: "3px",
            transition: "color 0.4s ease",
          }}>
            PLANETARY INTELLIGENCE
          </span>
        </div>

        <h2 style={{
          fontSize: "clamp(34px, 5.5vw, 62px)",
          fontWeight: 600, lineHeight: 1.06,
          letterSpacing: "-0.045em",
          color: T.headingColor,
          fontFamily: "'Georgia','Times New Roman',serif",
          margin: "0 0 18px",
          transition: "color 0.4s ease",
        }}>
          Connected to every<br />
          <span style={{ color: T.headingMuted, transition: "color 0.4s ease" }}>
            corner of the world.
          </span>
        </h2>

        <p style={{
          fontSize: "14px", color: T.bodyText,
          lineHeight: 1.85, maxWidth: "480px",
          margin: "0 auto", letterSpacing: "0.02em",
          transition: "color 0.4s ease",
        }}>
          Drag and rotate the globe. Our infrastructure spans every continent,
          delivering intelligence at the speed of light.
        </p>
      </div>

      {/* ══ CONTENT GRID ═════════════════════════════════════════════════ */}
      <div style={{
        maxWidth: "1140px", margin: "0 auto",
        padding: "0 24px 96px",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "28px",
      }}>

        {/* ── Globe canvas ── */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            height: "clamp(380px, 56vw, 600px)",
            borderRadius: "18px",
            border: `0.5px solid ${hovered ? T.borderHover : T.border}`,
            overflow: "hidden",
            background: T.canvasBg,
            transition: "border-color 0.35s ease, background 0.4s ease",
            cursor: "grab",
            animation: "fadeUp 0.9s ease 0.15s both",
          }}
        >
          {/* Particles */}
          <Particles particleBase={T.particle} />

          {/* Rotating rings */}
          <Ring size={440} color={T.ringA}  duration={30} />
          <Ring size={320} color={T.ringA}  duration={22} reverse />
          <Ring size={600} color={T.ringB}  duration={45} />

          {/* Orbiting dots */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: "8px", height: "8px", marginTop: "-4px", marginLeft: "-4px",
            zIndex: 1, pointerEvents: "none",
            animation: "orbitDot 18s linear infinite",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: T.dotColor, opacity: 0.6,
              boxShadow: `0 0 6px ${T.dotColor}`,
            }} />
          </div>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: "6px", height: "6px", marginTop: "-3px", marginLeft: "-3px",
            zIndex: 1, pointerEvents: "none",
            animation: "orbitDot2 28s linear infinite",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: T.dotColor, opacity: 0.4,
            }} />
          </div>

          {/* Grid overlay */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            backgroundImage: `
              linear-gradient(${T.gridLine} 1px, transparent 1px),
              linear-gradient(90deg, ${T.gridLine} 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            transition: "background-image 0.4s ease",
          }} />

          {/* Scanline sweep */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: "18%",
            background: `linear-gradient(to bottom, transparent, ${T.scanline}, transparent)`,
            zIndex: 1, pointerEvents: "none",
            animation: "scanline 7s linear infinite",
          }} />

          {/* Corner brackets */}
          {[
            { top:"14px",   left:"14px",   borderTop:`1px solid ${T.bracketColor}`,    borderLeft:`1px solid ${T.bracketColor}` },
            { top:"14px",   right:"14px",  borderTop:`1px solid ${T.bracketColor}`,    borderRight:`1px solid ${T.bracketColor}` },
            { bottom:"14px",left:"14px",   borderBottom:`1px solid ${T.bracketColor}`, borderLeft:`1px solid ${T.bracketColor}` },
            { bottom:"14px",right:"14px",  borderBottom:`1px solid ${T.bracketColor}`, borderRight:`1px solid ${T.bracketColor}` },
          ].map((s, i) => (
            <div key={i} style={{
              position: "absolute", width: 16, height: 16,
              zIndex: 3, pointerEvents: "none",
              transition: "border-color 0.4s ease", ...s,
            }} />
          ))}

          {/* Top-left label */}
          <div style={{
            position: "absolute", top: "18px", left: "20px",
            zIndex: 4, display: "flex", alignItems: "center", gap: "8px",
            pointerEvents: "none",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: T.dotColor, boxShadow: T.dotGlow,
              display: "inline-block",
              animation: "pulse 2.5s ease infinite",
              transition: "all 0.4s ease",
            }} />
            <span style={{
              fontSize: "9px", color: T.topLabel,
              letterSpacing: "3px",
              transition: "color 0.4s ease",
            }}>
              FOSSILITE · EARTH.GLB
            </span>
          </div>

          {/* Coordinates display — top right */}
          <div style={{
            position: "absolute", top: "18px", right: "20px",
            zIndex: 4, pointerEvents: "none",
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px",
          }}>
            <span style={{ fontSize: "8px", color: T.hintText, letterSpacing: "2px", transition: "color 0.4s ease" }}>
              LAT 23.4°N
            </span>
            <span style={{ fontSize: "8px", color: T.hintText, letterSpacing: "2px", transition: "color 0.4s ease" }}>
              LNG 54.7°E
            </span>
          </div>

          {/* Bottom hint */}
          <div style={{
            position: "absolute", bottom: "18px", right: "20px",
            zIndex: 4, pointerEvents: "none",
          }}>
            <span style={{ fontSize: "9px", color: T.hintText, letterSpacing: "2px", transition: "color 0.4s ease" }}>
              DRAG TO ROTATE
            </span>
          </div>

          {/* ── THE CANVAS — untouched ── */}
          <Canvas style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            zIndex: 2,
          }}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} />
            <Suspense fallback={null}>
              <Model />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </div>

        {/* ── Stats row ── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(20px, 5vw, 64px)",
          padding: "22px 28px",
          border: `0.5px solid ${T.border}`,
          borderRadius: "12px",
          background: T.statsBg,
          animation: "fadeUp 0.9s ease 0.3s both",
          transition: "border-color 0.4s ease, background 0.4s ease",
          flexWrap: "wrap",
        }}>
          <Stat value="195+"  label="Countries"  delay="0.35s" T={T} />
          <div style={{ width:"0.5px", background: T.divider, alignSelf:"stretch", transition:"background 0.4s ease" }} />
          <Stat value="2ms"   label="Avg Latency" delay="0.45s" T={T} />
          <div style={{ width:"0.5px", background: T.divider, alignSelf:"stretch", transition:"background 0.4s ease" }} />
          <Stat value="99.9%" label="Uptime"      delay="0.55s" T={T} />
          <div style={{ width:"0.5px", background: T.divider, alignSelf:"stretch", transition:"background 0.4s ease" }} />
          <Stat value="40PB"  label="Data / Day"  delay="0.65s" T={T} />
        </div>

        {/* ── Feature pills ── */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "18px",
          animation: "fadeUp 0.9s ease 0.4s both",
        }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {features.map((f, i) => (
              <Pill key={i} icon={f.icon} label={f.label}
                active={activeFeature === i}
                onClick={() => setActiveFeature(i)} T={T} />
            ))}
          </div>

          {/* Active feature card */}
          <div style={{
            padding: "22px 26px",
            border: `0.5px solid ${T.border}`,
            borderRadius: "10px",
            background: T.featureBg,
            transition: "all 0.3s ease",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
              <span style={{ fontSize: "18px" }}>{features[activeFeature].icon}</span>
              <span style={{
                fontSize: "10px", color: T.featureLabel,
                letterSpacing: "3px", textTransform: "uppercase",
                transition: "color 0.4s ease",
              }}>
                {features[activeFeature].label}
              </span>
            </div>
            <p style={{
              fontSize: "14px", color: T.featureDesc,
              lineHeight: 1.85, margin: 0, letterSpacing: "0.02em",
              transition: "color 0.4s ease",
            }}>
              {features[activeFeature].desc}
            </p>
          </div>
        </div>

        {/* ── CTA row ── */}
        <div style={{
          display: "flex", gap: "12px", flexWrap: "wrap",
          animation: "fadeUp 0.9s ease 0.5s both",
        }}>
          <a href="/contact" style={{
            padding: "13px 28px",
            background: T.ctaPrimBg, color: T.ctaPrimText,
            fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
            textDecoration: "none", borderRadius: "8px",
            fontFamily: "'DM Mono','Courier New',monospace",
            fontWeight: 600, transition: "all 0.25s ease",
          }}>
            Explore Coverage →
          </a>
          <a href="/solutions" style={{
            padding: "13px 28px",
            background: "transparent", color: T.ctaSecText,
            border: `0.5px solid ${T.ctaSecBorder}`,
            fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
            textDecoration: "none", borderRadius: "8px",
            fontFamily: "'DM Mono','Courier New',monospace",
            transition: "all 0.25s ease",
          }}>
            View Solutions
          </a>
        </div>
      </div>
    </div>
  );
}