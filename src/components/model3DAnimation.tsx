import { FC, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

// ─── Replace with your real import ───────────────────────────────────────────
// import { useThemeMode } from "../theme/theme";
const useThemeMode = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setMode(mq.matches ? "dark" : "light");
    const h = (e: MediaQueryListEvent) => setMode(e.matches ? "dark" : "light");
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return { mode };
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const LABELS = [
  "MCP Protocol", "AI Agents",   "LangGraph",   "Vector DB",   "Pinecone",
  "RAG Pipeline", "Multimodal",  "Fine-Tuning", "GPT-4o",      "Claude 4",
  "Llama 4",      "Embeddings",  "FastAPI",     "Next.js 15",  "PyTorch",
];

const NODE_META: { color: [number, number, number] }[] = [
  { color: [74,  158, 255] }, // MCP Protocol
  { color: [120, 210, 255] }, // AI Agents
  { color: [74,  158, 255] }, // LangGraph
  { color: [32,  210, 160] }, // Vector DB
  { color: [32,  210, 160] }, // Pinecone
  { color: [74,  158, 255] }, // RAG Pipeline
  { color: [255, 185,  60] }, // Multimodal
  { color: [255, 185,  60] }, // Fine-Tuning
  { color: [255, 185,  60] }, // GPT-4o
  { color: [255, 185,  60] }, // Claude 4
  { color: [255, 185,  60] }, // Llama 4
  { color: [32,  210, 160] }, // Embeddings
  { color: [255, 105, 105] }, // FastAPI
  { color: [255, 105, 105] }, // Next.js 15
  { color: [255, 105, 105] }, // PyTorch
];

interface Node3D { x: number; y: number; z: number }

// ─── Component ────────────────────────────────────────────────────────────────

export const PerformanceNodes: FC = () => {
  const { mode } = useThemeMode();
  // We don't actually need to vary anything by theme since bg is always black.
  // We keep the hook in case you want to adjust something later.

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const rotRef       = useRef({ x: 0.3, y: 0.5, targetX: 0.3, targetY: 0.5, autoY: 0 });
  const dragRef      = useRef({ active: false, lastX: 0, lastY: 0 });
  const hoveredRef   = useRef<number | null>(null);
  const clickedRef   = useRef<number | null>(null);
  const pulseRef     = useRef<{ edgeI: number; edgeJ: number; t: number }[]>([]);
  const timeRef      = useRef(0);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fibonacci sphere distribution
    const nodes3D: Node3D[] = LABELS.map((_, i) => {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / LABELS.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      };
    });

    // Pre-compute edges
    const edges: { i: number; j: number; dist: number }[] = [];
    for (let i = 0; i < nodes3D.length; i++) {
      for (let j = i + 1; j < nodes3D.length; j++) {
        const dx = nodes3D[i].x - nodes3D[j].x;
        const dy = nodes3D[i].y - nodes3D[j].y;
        const dz = nodes3D[i].z - nodes3D[j].z;
        const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d <= 1.1) edges.push({ i, j, dist: d });
      }
    }

    const resize = () => {
      const r = container.getBoundingClientRect();
      canvas.width        = r.width  * devicePixelRatio;
      canvas.height       = r.height * devicePixelRatio;
      canvas.style.width  = r.width  + "px";
      canvas.style.height = r.height + "px";
    };

    const project = (n: Node3D, rx: number, ry: number, cw: number, ch: number) => {
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1   = n.x * cosY - n.z * sinY;
      const z1   = n.x * sinY + n.z * cosY;
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y2   = n.y * cosX - z1 * sinX;
      const z2   = n.y * sinX + z1 * cosX;
      const fov   = 2.8;
      const scale = fov / (fov + z2);
      const unit  = Math.min(cw, ch) * 0.38;
      return {
        sx: cw / 2 + x1 * scale * unit,
        sy: ch / 2 + y2 * scale * unit,
        z:  z2,
        scale,
      };
    };

    // Spawn travelling pulses
    const pulseTimer = setInterval(() => {
      if (edges.length === 0) return;
      const e = edges[Math.floor(Math.random() * edges.length)];
      pulseRef.current.push({ edgeI: e.i, edgeJ: e.j, t: 0 });
    }, 600);

    const draw = () => {
      timeRef.current += 0.008;
      const time    = timeRef.current;
      const hovered = hoveredRef.current;
      const clicked = clickedRef.current;

      const rot = rotRef.current;
      rot.x += (rot.targetX - rot.x) * 0.04;
      rot.y += (rot.targetY - rot.y) * 0.04;
      if (!dragRef.current.active) rot.autoY += 0.003;

      const rx  = rot.x;
      const ry  = rot.y + rot.autoY;
      const dpr = devicePixelRatio;
      const cw  = canvas.width  / dpr;
      const ch  = canvas.height / dpr;

      // ── Black background — same in both themes ────────────────────────────
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      const proj = nodes3D.map((n, i) => ({ ...project(n, rx, ry, cw, ch), i }));

      // ── Subtle centre glow for atmosphere ─────────────────────────────────
      const glow = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.min(cw, ch) * 0.5);
      glow.addColorStop(0,   "rgba(40,60,120,0.10)");
      glow.addColorStop(0.5, "rgba(20,30,70,0.05)");
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, cw, ch);

      // ── Edges ─────────────────────────────────────────────────────────────
      for (const edge of edges) {
        const a         = proj[edge.i];
        const b         = proj[edge.j];
        const zAvg      = (a.z + b.z) / 2;
        const depth     = 0.20 + (zAvg + 1) * 0.40;   // 0.20 – 1.00
        const proximity = 1 - edge.dist / 1.1;          // 0 – 1
        const isActive  = (
          edge.i === hovered || edge.j === hovered ||
          edge.i === clicked || edge.j === clicked
        );

        // On black bg, moderate alpha is plenty — lines are clearly visible
        const baseAlpha = (0.28 + proximity * 0.40) * depth;  // 0.06 – 0.68
        const alpha     = isActive ? Math.min(0.95, baseAlpha * 2.8) : baseAlpha;

        const [cr,  cg,  cb ] = NODE_META[edge.i].color;
        const [cr2, cg2, cb2] = NODE_META[edge.j].color;

        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);

        if (isActive) {
          const grd = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
          grd.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
          grd.addColorStop(1, `rgba(${cr2},${cg2},${cb2},${alpha})`);
          ctx.strokeStyle = grd;
          ctx.lineWidth   = 1.8;
        } else {
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.lineWidth   = 1.0;
        }
        ctx.stroke();
      }

      // ── Travelling pulses ─────────────────────────────────────────────────
      pulseRef.current = pulseRef.current.filter(p => p.t < 1);
      for (const pulse of pulseRef.current) {
        pulse.t += 0.014;
        const a  = proj[pulse.edgeI];
        const b  = proj[pulse.edgeJ];
        const px = a.sx + (b.sx - a.sx) * pulse.t;
        const py = a.sy + (b.sy - a.sy) * pulse.t;
        const [cr, cg, cb] = NODE_META[pulse.edgeI].color;
        // Trail
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.90 * (1 - pulse.t)})`;
        ctx.fill();
        // Small glow around pulse
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 10);
        pg.addColorStop(0, `rgba(${cr},${cg},${cb},${0.30 * (1 - pulse.t)})`);
        pg.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      }

      // ── Nodes — sorted back → front ───────────────────────────────────────
      const sorted = [...proj].sort((a, b) => a.z - b.z);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      let newHovered: number | null = null;

      for (const p of sorted) {
        const { sx, sy, z, scale, i } = p;
        const baseR = scale * 7 + 2.5;
        const [cr, cg, cb] = NODE_META[i].color;
        const isHov = i === hovered;
        const isSel = i === clicked;
        const depth = 0.40 + (z + 1) * 0.30;

        const ddx = sx - mx, ddy = sy - my;
        if (Math.sqrt(ddx*ddx + ddy*ddy) < baseR + 18) newHovered = i;

        const r = isHov || isSel ? baseR * 1.32 : baseR;

        // Outer glow — extra visible on black
        const glowSize = r + (isSel ? 22 : isHov ? 16 : 0);
        if (isHov || isSel) {
          const gr = ctx.createRadialGradient(sx, sy, r * 0.2, sx, sy, glowSize);
          gr.addColorStop(0, `rgba(${cr},${cg},${cb},${isSel ? 0.40 : 0.24})`);
          gr.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        // Always-on subtle ambient glow so nodes feel lit
        const ambientGlow = ctx.createRadialGradient(sx, sy, r * 0.5, sx, sy, r + 8);
        ambientGlow.addColorStop(0, `rgba(${cr},${cg},${cb},${0.08 * depth})`);
        ambientGlow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = ambientGlow;
        ctx.fill();

        // Pulsing selection ring
        if (isSel) {
          const pulse = Math.sin(time * 4) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, r + 7 + pulse * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.50 * (1 - pulse)})`;
          ctx.lineWidth   = 1.5;
          ctx.stroke();
        }

        // Node radial fill
        const hi = Math.min(255, Math.round(cr * 1.4));
        const gi = Math.min(255, Math.round(cg * 1.4));
        const bi = Math.min(255, Math.round(cb * 1.4));
        const lo = (v: number) => Math.round(v * 0.50);
        const nf = ctx.createRadialGradient(
          sx - r * 0.30, sy - r * 0.30, r * 0.05,
          sx, sy, r,
        );
        const fa = isHov || isSel
          ? 0.96
          : 0.62 + (z + 1) * 0.19;
        nf.addColorStop(0, `rgba(${hi},${gi},${bi},${fa})`);
        nf.addColorStop(1, `rgba(${lo(cr)},${lo(cg)},${lo(cb)},${fa})`);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = nf;
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${
          isHov || isSel ? 1.0 : 0.65 * depth
        })`;
        ctx.lineWidth = isHov || isSel ? 1.6 : 0.9;
        ctx.stroke();

        // Specular highlight
        ctx.beginPath();
        ctx.arc(sx - r * 0.28, sy - r * 0.28, r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fill();

        // Label pill
        const depthAlpha = Math.max(0, (z + 0.5) * 0.9);
        const la = isHov || isSel ? 1.0 : depthAlpha;
        if (la > 0.06) {
          const label = LABELS[i];
          ctx.font      = `${isHov || isSel ? 500 : 400} 10px monospace`;
          ctx.textAlign = "center";
          const tw = ctx.measureText(label).width;
          const lx = sx - tw / 2 - 7;
          const ly = sy + r + 5;
          const lw = tw + 14;
          const lh = 17;

          // Dark pill on black bg — slightly lighter so it reads
          ctx.fillStyle = `rgba(18,22,36,${0.88 * Math.min(1, la)})`;
          ctx.beginPath();
          (ctx as any).roundRect(lx, ly, lw, lh, 9);
          ctx.fill();

          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${Math.min(1, la) * 0.60})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          (ctx as any).roundRect(lx, ly, lw, lh, 9);
          ctx.stroke();

          ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, la * 1.1)})`;
          ctx.fillText(label, sx, ly + 12);
        }
      }

      hoveredRef.current = newHovered;
      container.style.cursor = newHovered !== null
        ? "pointer"
        : dragRef.current.active ? "grabbing" : "grab";

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    // ── Events ────────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (dragRef.current.active) {
        rotRef.current.targetY += (e.clientX - dragRef.current.lastX) * 0.007;
        rotRef.current.targetX += (e.clientY - dragRef.current.lastY) * 0.007;
        rotRef.current.targetX  = Math.max(-1.3, Math.min(1.3, rotRef.current.targetX));
        dragRef.current.lastX   = e.clientX;
        dragRef.current.lastY   = e.clientY;
      }
    };
    const onMouseDown  = (e: MouseEvent) => {
      dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    };
    const onMouseUp    = () => { dragRef.current.active = false; };
    const onClick      = () => {
      const h = hoveredRef.current;
      clickedRef.current = h === clickedRef.current ? null : h;
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      dragRef.current = { active: true, lastX: t.clientX, lastY: t.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      const r = container.getBoundingClientRect();
      mouseRef.current = { x: t.clientX - r.left, y: t.clientY - r.top };
      rotRef.current.targetY += (t.clientX - dragRef.current.lastX) * 0.007;
      rotRef.current.targetX += (t.clientY - dragRef.current.lastY) * 0.007;
      rotRef.current.targetX  = Math.max(-1.3, Math.min(1.3, rotRef.current.targetX));
      dragRef.current.lastX   = t.clientX;
      dragRef.current.lastY   = t.clientY;
    };
    const onTouchEnd = () => {
      dragRef.current.active  = false;
      mouseRef.current        = { x: -9999, y: -9999 };
    };

    container.addEventListener("mousemove",  onMouseMove);
    container.addEventListener("mousedown",  onMouseDown);
    container.addEventListener("mouseup",    onMouseUp);
    container.addEventListener("click",      onClick);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup",       onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove",  onTouchMove,  { passive: false });
    container.addEventListener("touchend",   onTouchEnd);
    window.addEventListener("resize", resize);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(pulseTimer);
      container.removeEventListener("mousemove",  onMouseMove);
      container.removeEventListener("mousedown",  onMouseDown);
      container.removeEventListener("mouseup",    onMouseUp);
      container.removeEventListener("click",      onClick);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup",       onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove",  onTouchMove);
      container.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position:        "relative",
        width:           "100%",
        height:          { xs: "400px", sm: "480px", md: "560px" },
        overflow:        "hidden",
        backgroundColor: "#000000",   // ← always black, both themes
        borderRadius:    "16px",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Legend */}
      <Box sx={{
        position:      "absolute",
        bottom:        "14px",
        left:          "16px",
        display:       "flex",
        flexDirection: "column",
        gap:           "5px",
        pointerEvents: "none",
      }}>
        {[
          { label: "Protocol / Infra",  color: "74,158,255"  },
          { label: "Data / Embeddings", color: "32,210,160"  },
          { label: "Models",            color: "255,185,60"  },
          { label: "Frameworks",        color: "255,105,105" },
        ].map(({ label, color }) => (
          <Box key={label} sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Box sx={{
              width:        "7px",
              height:       "7px",
              borderRadius: "50%",
              background:   `rgb(${color})`,
              flexShrink:   0,
              boxShadow:    `0 0 5px rgb(${color})`,
            }} />
            <Box sx={{
              fontSize:   "10px",
              fontFamily: "Nasalization",
              color:      "rgba(255,255,255,0.45)",
            }}>
              {label}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Hint */}
      <Box sx={{
        position:      "absolute",
        top:           "14px",
        right:         "16px",
        fontSize:      "10px",
        fontFamily: "Nasalization"  ,
        color:         "rgba(255,255,255,0.22)",
        pointerEvents: "none",
        userSelect:    "none",
      }}>
        drag · click to select
      </Box>
    </Box>
  );
};

export default PerformanceNodes;