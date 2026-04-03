import { FC, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useThemeMode } from "../theme/theme";

const LABELS = [
  "MCP Protocol", "AI Agents", "LangGraph", "Vector DB", "Pinecone",
  "RAG Pipeline", "Multimodal", "Fine-Tuning", "GPT-4o", "Claude 4",
  "Llama 4", "Embeddings", "FastAPI", "Next.js 15", "PyTorch"
];

const COLORS: [number, number, number][] = [
  [74, 158, 255], [120, 180, 255], [80, 220, 180], [160, 130, 255], [255, 160, 80],
  [80, 200, 255], [200, 120, 255], [80, 240, 160], [255, 120, 120], [120, 220, 255],
  [255, 200, 80], [100, 180, 255], [80, 255, 180], [200, 160, 255], [255, 140, 100]
];

interface Node3D { x: number; y: number; z: number; }

export const PerformanceNodes: FC = () => {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const rotRef       = useRef({ x: 0.3, y: 0.5, targetX: 0.3, targetY: 0.5, autoY: 0 });
  const dragRef      = useRef({ active: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas    = canvasRef.current!;
    const container = containerRef.current!;
    const ctx       = canvas.getContext("2d")!;

    const nodes3D: Node3D[] = LABELS.map((_, i) => {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / LABELS.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      };
    });

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
      const fov   = 2.5;
      const scale = fov / (fov + z2);
      const unit  = Math.min(cw, ch) * 0.36;
      return { sx: cw / 2 + x1 * scale * unit, sy: ch / 2 + y2 * scale * unit, z: z2, scale };
    };

    const draw = () => {
      const rot = rotRef.current;
      rot.x += (rot.targetX - rot.x) * 0.04;
      rot.y += (rot.targetY - rot.y) * 0.04;
      if (!dragRef.current.active) rot.autoY += 0.004;

      const rx  = rot.x;
      const ry  = rot.y + rot.autoY;
      const dpr = devicePixelRatio;
      const cw  = canvas.width  / dpr;
      const ch  = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const proj = nodes3D.map((n, i) => ({ ...project(n, rx, ry, cw, ch), i }));

      // Connections
      for (let i = 0; i < nodes3D.length; i++) {
        for (let j = i + 1; j < nodes3D.length; j++) {
          const a  = proj[i], b = proj[j];
          const dx = nodes3D[i].x - nodes3D[j].x;
          const dy = nodes3D[i].y - nodes3D[j].y;
          const dz = nodes3D[i].z - nodes3D[j].z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist > 1.05) continue;
          const zAvg  = (a.z + b.z) / 2;
          const alpha = (0.06 + (1 - dist / 1.05) * 0.14) * (0.5 + (zAvg + 1) * 0.25) * (isDark ? 1.0 : 0.7);
          const [cr, cg, cb] = COLORS[i];
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // Sort back → front
      proj.sort((a, b) => a.z - b.z);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of proj) {
        const { sx, sy, z, scale, i } = p;
        const r            = scale * 6 + 2;
        const [cr, cg, cb] = COLORS[i];
        const brightness   = (0.4 + (z + 1) * 0.3) * (isDark ? 1 : 0.85);
        const alpha        = (0.55 + (z + 1) * 0.22) * (isDark ? 1.0 : 0.85);
        const ddx = sx - mx, ddy = sy - my;
        const hit = Math.sqrt(ddx*ddx + ddy*ddy) < r + 16;

        // Glow
        if (hit) {
          ctx.beginPath();
          ctx.arc(sx, sy, r + 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${isDark ? 0.12 : 0.18})`;
          ctx.fill();
        }

        // Dot
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(cr*brightness)},${Math.round(cg*brightness)},${Math.round(cb*brightness)},${alpha})`;
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${isDark ? 0.6 : 0.8})`;
        ctx.lineWidth   = hit ? 1.5 : 0.8;
        ctx.stroke();

        // Label pill
        const labelAlpha = Math.max(0, (z + 0.6) * 0.9 + (hit ? 0.5 : 0));
        if (labelAlpha > 0.05) {
          ctx.font = "400 10px monospace";
          ctx.textAlign = "center";
          const lw = ctx.measureText(LABELS[i]).width;
          const nodeLabelBg = isDark ? "0,0,0" : "255,255,255";
          const nodeLabelAlpha = isDark ? 0.55 : 0.75;
          ctx.fillStyle = `rgba(${nodeLabelBg},${nodeLabelAlpha * Math.min(1, labelAlpha)})`;
          ctx.beginPath();
          (ctx as any).roundRect(sx - lw/2 - 6, sy + r + 4, lw + 12, 16, 8);
          ctx.fill();
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, labelAlpha * 1.1)})`;
          ctx.fillText(LABELS[i], sx, sy + r + 16);
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (dragRef.current.active) {
        rotRef.current.targetY += (e.clientX - dragRef.current.lastX) * 0.008;
        rotRef.current.targetX += (e.clientY - dragRef.current.lastY) * 0.008;
        rotRef.current.targetX  = Math.max(-1.2, Math.min(1.2, rotRef.current.targetX));
        dragRef.current.lastX   = e.clientX;
        dragRef.current.lastY   = e.clientY;
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      container.style.cursor = "grabbing";
    };
    const onMouseUp    = () => { dragRef.current.active = false; container.style.cursor = "crosshair"; };
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
      rotRef.current.targetY += (t.clientX - dragRef.current.lastX) * 0.008;
      rotRef.current.targetX += (t.clientY - dragRef.current.lastY) * 0.008;
      rotRef.current.targetX  = Math.max(-1.2, Math.min(1.2, rotRef.current.targetX));
      dragRef.current.lastX   = t.clientX;
      dragRef.current.lastY   = t.clientY;
    };
    const onTouchEnd = () => {
      dragRef.current.active  = false;
      mouseRef.current        = { x: -9999, y: -9999 };
    };

    container.addEventListener("mousemove",  onMouseMove);
    container.addEventListener("mousedown",  onMouseDown);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup",       onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove",  onTouchMove,  { passive: false });
    container.addEventListener("touchend",   onTouchEnd);
    window.addEventListener("resize", resize);

    container.style.cursor = "crosshair";
    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove",  onMouseMove);
      container.removeEventListener("mousedown",  onMouseDown);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup",       onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove",  onTouchMove);
      container.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "400px", sm: "480px", md: "560px" },
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </Box>
  );
};