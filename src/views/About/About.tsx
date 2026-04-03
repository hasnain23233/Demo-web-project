import { useEffect, useRef, useState, useCallback, FC } from "react";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem {
  num: number;
  suffix: string;
  label: string;
}

interface ValueItem {
  num: string;
  color: string;
  rgb: string;
  title: string;
  desc: string;
}

interface TimelineItem {
  year: string;
  color: string;
  title: string;
  body: string;
}

interface TeamMember {
  num: string;
  emoji: string;
  color: string;
  rgb: string;
  name: string;
  role: string;
  bio: string;
}

interface OrbitConfig {
  radius: number;
  speed: number;
  tilt: number;
  color: number;
  size: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TECH_ITEMS: string[] = [
  "GPT-4o", "Claude API", "LangChain", "LangGraph", "CrewAI", "MCP Protocol",
  "RAG Pipelines", "AI Agents", "Pinecone", "FastAPI", "Next.js", "PyTorch",
  "HuggingFace", "Llama 4", "Mistral", "LlamaIndex", "Weaviate", "ChromaDB",
];

const STATS: StatItem[] = [
  { num: 12000, suffix: "+", label: "Users Active" },
  { num: 98,    suffix: "%", label: "Accuracy Rate" },
  { num: 4.2,   suffix: "B", label: "Tokens / Month" },
];

const VALUES: ValueItem[] = [
  { num: "01", color: "#0a84ff", rgb: "10,132,255", title: "Depth over breadth",
    desc: "We build systems that go 10 layers deep rather than skimming across surfaces. Depth is where intelligence lives." },
  { num: "02", color: "#30d158", rgb: "48,209,88",  title: "Permanence by design",
    desc: "Every stratum we lay is meant to last. We don't ship MVPs — we ship foundations that compound over years." },
  { num: "03", color: "#ff9f0a", rgb: "255,159,10", title: "Radical transparency",
    desc: "Our models explain their reasoning. Our team explains their decisions. No black boxes — anywhere in the stack." },
  { num: "04", color: "#bf5af2", rgb: "191,90,242", title: "Human intelligence first",
    desc: "AI amplifies humans — it doesn't replace them. Every product we ship makes the person using it measurably smarter." },
  { num: "05", color: "#ff375f", rgb: "255,55,95",  title: "Speed with intention",
    desc: "We move fast — but only in the right direction. Velocity without clarity is just noise. Clarity is our moat." },
  { num: "06", color: "#64d2ff", rgb: "100,210,255", title: "Open by default",
    desc: "We contribute to open research, open tooling, and open dialogue. The best intelligence ecosystems are built together." },
];

const TIMELINE: TimelineItem[] = [
  { year: "Q1 2023", color: "#0a84ff", title: "The idea crystallises",
    body: "Three researchers at MIT ask a simple question: what if AI could remember everything — like rock strata remember geological time? A whiteboard session becomes a founding thesis." },
  { year: "Q3 2023", color: "#30d158", title: "$4.2M seed & the Stratum Engine™",
    body: "Raised seed funding from Sequoia and Benchmark. First prototype demonstrates 94% recall accuracy across 10,000-document knowledge bases. Team grows to 11." },
  { year: "Q1 2024", color: "#ff9f0a", title: "Public beta — 12,000 users in 90 days",
    body: "Opened to 1,000 beta users. Word-of-mouth drove the user base to 12,000 in 90 days without a single paid ad. The stratum model resonated immediately." },
  { year: "Q3 2024", color: "#bf5af2", title: "Series A & enterprise push",
    body: "Closed $18M Series A. Launched enterprise tier with multi-agent strata, SOC 2 compliance, and real-time collaborative knowledge graphs. First Fortune 500 signed." },
  { year: "Now",     color: "#64d2ff", title: "Building the next layer",
    body: "Working on cross-session persistent memory at global scale, multi-modal strata, and the world's first AI with genuine long-term relationship memory." },
];

const TEAM: TeamMember[] = [
  { num: "01", emoji: "🦊", color: "#0a84ff", rgb: "10,132,255",
    name: "Aria Chen",    role: "CEO & Co-Founder",
    bio: "Former ML lead at DeepMind. PhD in Computational Cognition, MIT. Obsessed with persistent memory systems." },
  { num: "02", emoji: "🐺", color: "#30d158", rgb: "48,209,88",
    name: "Marcus Reyes", role: "CTO & Co-Founder",
    bio: "Distributed systems at Stripe & Anthropic. Architect of the Stratum Engine™ powering Fossilite at scale." },
  { num: "03", emoji: "🦅", color: "#ff9f0a", rgb: "255,159,10",
    name: "Yuna Park",    role: "Head of Research",
    bio: "14 published papers on RAG. Leads a team of 8 PhDs pushing the frontier of retrieval-augmented generation." },
  { num: "04", emoji: "🦁", color: "#bf5af2", rgb: "191,90,242",
    name: "Sam Okafor",   role: "Head of Design",
    bio: "Crafted interfaces at Apple and Figma. Believes design is the geology of human experience — layers matter." },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return [ref, isInView];
}

// ─── Background Canvas ────────────────────────────────────────────────────────
const BgCanvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const GRID_COLS = 28, GRID_ROWS = 18;
    let W = 0, H = 0, t = 0;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 2e-4,
      vy: (Math.random() - 0.5) * 2e-4,
      r: Math.random() * 1.2 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    const RINGS = [
      { r: 320, ry: 0.18, speed: 0.25,  alpha: 0.018, thick: 0.8 },
      { r: 230, ry: 0.22, speed: -0.18, alpha: 0.025, thick: 0.6 },
      { r: 160, ry: 0.28, speed: 0.30,  alpha: 0.030, thick: 0.5 },
    ];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.width  = window.innerWidth  * dpr;
      H = canvas.height = window.innerHeight * dpr;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      t += 0.007;
      const dpr = window.devicePixelRatio || 1;
      const w = W / dpr, h = H / dpr;
      const mx = mouseRef.current.x * w, my = mouseRef.current.y * h;
      const tiltX = (mouseRef.current.y - 0.5) * 0.25;
      const tiltY = (mouseRef.current.x - 0.5) * 0.25;
      const dc = "255,255,255";

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cw = w / GRID_COLS, rh = h / GRID_ROWS;
      for (let r = 0; r <= GRID_ROWS; r++) {
        for (let c = 0; c <= GRID_COLS; c++) {
          const bx = c * cw, by = r * rh;
          const wave = Math.sin(c * 0.35 + t * 1.1) * 12 + Math.cos(r * 0.42 + t * 0.7) * 8;
          const persp = 1 + tiltX * (r / GRID_ROWS - 0.5) * 0.5 + tiltY * (c / GRID_COLS - 0.5) * 0.5;
          const x = bx + tiltY * (bx - w / 2) * 0.03;
          const y = by + wave * persp + tiltX * (by - h / 2) * 0.03;
          const bright = 0.5 + 0.5 * Math.sin(c * 0.4 + r * 0.3 + t * 0.8);
          const dm = Math.hypot(x - mx, y - my) / 110;
          const glow = Math.max(0, 1 - dm);
          ctx.beginPath();
          ctx.arc(x, y, 0.7 + glow * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dc},${0.03 + bright * 0.04 + glow * 0.15})`;
          ctx.fill();
        }
      }

      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.phase) * 7e-5;
        p.y += p.vy + Math.cos(t + p.phase * 0.7) * 5e-5;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x * w, ay = a.y * h;
        const dm = Math.hypot(ax - mx, ay - my);
        const boost = Math.max(0, 1 - dm / 120);
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx2 = b.x * w, by2 = b.y * h;
          const d = Math.hypot(ax - bx2, ay - by2);
          if (d < 90) {
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx2, by2);
            ctx.strokeStyle = `rgba(${dc},${(1 - d / 90) * 0.08 + boost * 0.18})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(ax, ay, a.r + boost * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dc},${0.2 + boost * 0.5})`;
        ctx.fill();
      }

      const cx2 = w / 2, cy2 = h * 0.42;
      for (const rg of RINGS) {
        const angle = rg.speed * t;
        const scaleY = rg.ry + tiltX * 0.06;
        ctx.beginPath();
        ctx.ellipse(cx2 + tiltY * rg.r * 0.12, cy2 + tiltX * rg.r * 0.06, rg.r, rg.r * scaleY, angle, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${dc},${rg.alpha})`;
        ctx.lineWidth = rg.thick; ctx.stroke();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
};

// ─── Three.js 3D Stratum Engine ───────────────────────────────────────────────
const StratumEngine3D: FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const W = el.clientWidth, H = el.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const blueLight = new THREE.PointLight(0x0a84ff, 8, 20);
    blueLight.position.set(3, 3, 3);
    scene.add(blueLight);
    const greenLight = new THREE.PointLight(0x30d158, 5, 15);
    greenLight.position.set(-3, -2, 2);
    scene.add(greenLight);
    const purpleLight = new THREE.PointLight(0xbf5af2, 4, 12);
    purpleLight.position.set(0, 4, -2);
    scene.add(purpleLight);

    // Core dodecahedron
    const coreGeo = new THREE.DodecahedronGeometry(1.0, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x030a14,
      emissive: 0x0a84ff,
      emissiveIntensity: 0.12,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Wireframe dodecahedron
    const wireGeo = new THREE.DodecahedronGeometry(1.02, 0);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x0a84ff, wireframe: true, transparent: true, opacity: 0.3 });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Outer icosahedron shell
    const shellGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a2040, emissive: 0x0a84ff, emissiveIntensity: 0.04,
      metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0.08, side: THREE.BackSide,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    const outerWireGeo = new THREE.IcosahedronGeometry(1.72, 1);
    const outerWireMat = new THREE.MeshBasicMaterial({ color: 0x30d158, wireframe: true, transparent: true, opacity: 0.07 });
    const outerWire = new THREE.Mesh(outerWireGeo, outerWireMat);
    scene.add(outerWire);

    // Stratum rings
    const stratumColors = [0x0a84ff, 0x30d158, 0xff9f0a, 0xbf5af2, 0x64d2ff];
    const stratumRings: THREE.Mesh[] = [];
    stratumColors.forEach((col, i) => {
      const geo = new THREE.TorusGeometry(1.3 + i * 0.18, 0.012, 8, 80);
      const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55 - i * 0.07 });
      const torus = new THREE.Mesh(geo, mat);
      torus.rotation.x = Math.PI / 2 + (i - 2) * 0.25;
      torus.rotation.y = i * 0.4;
      stratumRings.push(torus);
      scene.add(torus);
    });

    // Orbiting satellites
    const orbits: OrbitConfig[] = [
      { radius: 2.2, speed: 0.6,  tilt: 0.3,  color: 0x0a84ff, size: 0.09 },
      { radius: 2.5, speed: -0.4, tilt: 1.1,  color: 0x30d158, size: 0.07 },
      { radius: 2.0, speed: 0.9,  tilt: -0.7, color: 0xff9f0a, size: 0.08 },
      { radius: 2.7, speed: -0.3, tilt: 0.6,  color: 0xbf5af2, size: 0.06 },
      { radius: 1.9, speed: 1.2,  tilt: -1.2, color: 0x64d2ff, size: 0.05 },
    ];

    const satellites = orbits.map(o => {
      const geo = new THREE.SphereGeometry(o.size, 12, 12);
      const mat = new THREE.MeshBasicMaterial({ color: o.color });
      const mesh = new THREE.Mesh(geo, mat);
      const haloGeo = new THREE.SphereGeometry(o.size * 2.5, 8, 8);
      const haloMat = new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: 0.12 });
      mesh.add(new THREE.Mesh(haloGeo, haloMat));
      scene.add(mesh);
      return { mesh, ...o };
    });

    orbits.forEach(o => {
      const geo = new THREE.TorusGeometry(o.radius, 0.004, 4, 100);
      const mat = new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: 0.1 });
      const torus = new THREE.Mesh(geo, mat);
      torus.rotation.x = o.tilt;
      scene.add(torus);
    });

    // Floating nodes
    interface NodeData extends THREE.Mesh {
      userData: { basePos: THREE.Vector3; phase: number; speed: number };
    }
    const nodes: NodeData[] = [];
    for (let i = 0; i < 20; i++) {
      const phi   = Math.acos(-1 + (2 * i) / 20);
      const theta = Math.sqrt(20 * Math.PI) * phi;
      const r     = 2.9 + Math.random() * 0.6;
      const geo   = new THREE.OctahedronGeometry(0.04, 0);
      const col   = stratumColors[i % stratumColors.length];
      const mat   = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5 + Math.random() * 0.4 });
      const node  = new THREE.Mesh(geo, mat) as NodeData;
      node.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
      node.userData = { basePos: node.position.clone(), phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5 };
      nodes.push(node);
      scene.add(node);
    }

    // Center glow sphere
    const coreInnerGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreInnerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a84ff, emissive: 0x0a84ff, emissiveIntensity: 0.8,
      metalness: 1, roughness: 0, transparent: true, opacity: 0.9,
    });
    const coreInner = new THREE.Mesh(coreInnerGeo, coreInnerMat);
    scene.add(coreInner);

    // Mouse
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseRef.current.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };
    el.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.008;

      camera.rotation.x += (mouseRef.current.y * 0.4 - camera.rotation.x) * 0.04;
      camera.rotation.y += (mouseRef.current.x * 0.4 - camera.rotation.y) * 0.04;

      core.rotation.x += 0.004;
      core.rotation.y += 0.006;
      wireMesh.rotation.x -= 0.003;
      wireMesh.rotation.y -= 0.005;
      shell.rotation.x += 0.002;
      shell.rotation.y -= 0.003;
      outerWire.rotation.x -= 0.002;
      outerWire.rotation.y += 0.004;

      stratumRings.forEach((ring, i) => {
        ring.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
        ring.rotation.x += 0.001 * (i % 2 === 0 ? -1 : 1);
      });

      satellites.forEach((s, i) => {
        const angle = t * s.speed + (i * Math.PI * 2) / satellites.length;
        s.mesh.position.set(
          Math.cos(angle) * s.radius,
          Math.sin(angle * 0.7) * s.radius * Math.sin(s.tilt),
          Math.sin(angle) * s.radius * Math.cos(s.tilt * 0.5),
        );
      });

      nodes.forEach(n => {
        const pulse = Math.sin(t * n.userData.speed + n.userData.phase) * 0.06;
        n.position.copy(n.userData.basePos).multiplyScalar(1 + pulse);
        n.rotation.x += 0.02;
        n.rotation.y += 0.015;
      });

      coreInnerMat.emissiveIntensity = 0.7 + Math.sin(t * 2.5) * 0.25;
      coreInner.scale.setScalar(1 + Math.sin(t * 3) * 0.06);

      blueLight.position.set(
        Math.cos(t * 0.7) * 4,
        Math.sin(t * 0.5) * 3,
        Math.sin(t * 0.9) * 3,
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100%", height: 420, position: "relative" }}>
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.08em", pointerEvents: "none", whiteSpace: "nowrap",
      }}>
        STRATUM ENGINE™ — INTERACTIVE 3D
      </div>
    </div>
  );
};

// ─── Icon Canvas ──────────────────────────────────────────────────────────────
interface IconCanvasProps { rgb: string; delay?: number; }

const IconCanvas: FC<IconCanvasProps> = ({ rgb, delay = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const [r, g, b] = rgb.split(",").map(Number);
    let t = delay;

    const draw = () => {
      ctx.clearRect(0, 0, 52, 52);
      const cx = 26, cy = 26;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = t + i * Math.PI / 3;
        const x = cx + 18 * Math.cos(a), y = cy + 18 * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${r},${g},${b},0.7)`;
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; ctx.fill();
      const ox = cx + 14 * Math.cos(-t * 1.4);
      const oy = cy + 14 * Math.sin(-t * 1.4);
      ctx.beginPath(); ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.6)`; ctx.fill();
      t += 0.025;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [rgb, delay]);

  return <canvas ref={canvasRef} width={52} height={52} style={{ width: 52, height: 52 }} />;
};

// ─── Stat Counter ─────────────────────────────────────────────────────────────
interface StatCounterProps { stat: StatItem; animate: boolean; }

const StatCounter: FC<StatCounterProps> = ({ stat, animate }) => {
  const [display, setDisplay] = useState<string>("0");

  useEffect(() => {
    if (!animate) return;
    const duration = 1800;
    const start = performance.now();
    const isFloat = !Number.isInteger(stat.num);
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const val = ease * stat.num;
      setDisplay((isFloat ? val.toFixed(1) : Math.round(val)) + stat.suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [animate, stat]);

  return <span>{display}</span>;
};

// ─── Tilt Card ────────────────────────────────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const TiltCard: FC<TiltCardProps> = ({ children, style, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return (
    <div
      ref={ref}
      style={{ transition: "transform 0.4s cubic-bezier(.16,1,.3,1)", ...style }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// ─── Ticker ───────────────────────────────────────────────────────────────────
const Ticker: FC = () => {
  const items = [...TECH_ITEMS, ...TECH_ITEMS];
  return (
    <div style={S.tickerWrap}>
      <div style={S.tickerTrack}>
        {items.map((item, i) => (
          <div key={i} style={S.tickerPill}>{item}</div>
        ))}
      </div>
    </div>
  );
};

// ─── Main About Component ─────────────────────────────────────────────────────
export default function About() {
  const [heroRef,     heroIn]     = useReveal(0.1);
  const [aboutRef,    aboutIn]    = useReveal(0.1);
  const [statsRef,    statsIn]    = useReveal(0.2);
  const [valuesRef,   valuesIn]   = useReveal(0.1);
  const [timelineRef, timelineIn] = useReveal(0.1);
  const [teamRef,     teamIn]     = useReveal(0.1);
  const [missionRef,  missionIn]  = useReveal(0.1);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.7, delay },
  });

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <BgCanvas />

      <main style={{ position: "relative", zIndex: 1 }}>

        {/* ── PAGE HERO ── */}
        <div ref={heroRef} style={S.pageHero}>
          <motion.div style={S.eyebrow} {...fadeUp(0.2)}>
            <span style={S.eyebrowLine} />
            About Fossilite AI
            <span style={S.eyebrowLine} />
          </motion.div>
          <motion.h1 style={S.heroH1} {...fadeUp(0.4)}>
            We build<br /><em style={{ fontStyle: "italic", color: "#555" }}>intelligence</em><br />that endures.
          </motion.h1>
          <motion.p style={S.heroSub} {...fadeUp(0.65)}>
            Not just software — knowledge systems that compound, remember, and evolve.
            Like geological strata, every layer adds depth.
          </motion.p>
          <motion.div style={S.scrollHint} {...fadeIn(1.4)}>
            <span style={S.scrollLabel}>SCROLL</span>
            <div style={S.scrollLine} />
          </motion.div>
        </div>

        <Ticker />

        {/* ── ABOUT + 3D MODEL ── */}
        <section style={S.section}>
          <div ref={aboutRef} style={S.aboutGrid}>
            <div>
              <motion.p style={S.secLabel} {...(aboutIn ? fadeUp(0) : { initial: { opacity: 0 } })}>Our origin</motion.p>
              <motion.h2 style={S.secTitle} {...(aboutIn ? fadeUp(0.1) : { initial: { opacity: 0 } })}>
                Intelligence<br />that <em style={{ fontStyle: "italic", color: "#555" }}>stands the<br />test of time</em>
              </motion.h2>
              <motion.p style={S.secBody} {...(aboutIn ? fadeUp(0.2) : { initial: { opacity: 0 } })}>
                Founded in 2023 by researchers from MIT and DeepMind, Fossilite AI was built on one
                radical belief: the best AI doesn't just answer — it remembers, layers, and evolves
                alongside you. Like geological strata recording Earth's history, every interaction
                adds a permanent stratum of knowledge.
              </motion.p>
              <div ref={statsRef} style={S.statsRow}>
                {STATS.map((stat, i) => (
                  <TiltCard key={i} style={S.stat}>
                    <div style={S.statNum}><StatCounter stat={stat} animate={statsIn} /></div>
                    <div style={S.statLabel}>{stat.label}</div>
                  </TiltCard>
                ))}
              </div>
            </div>
            <motion.div
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              {...(aboutIn ? fadeUp(0.25) : { initial: { opacity: 0 } })}
            >
              <StratumEngine3D />
            </motion.div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section style={{ ...S.section, paddingTop: 0 }}>
          <div ref={valuesRef}>
            <motion.p style={S.secLabel} {...(valuesIn ? fadeUp(0) : { initial: { opacity: 0 } })}>What we stand for</motion.p>
            <motion.h2 style={S.secTitle} {...(valuesIn ? fadeUp(0.1) : { initial: { opacity: 0 } })}>
              Core <em style={{ fontStyle: "italic", color: "#555" }}>values</em>
            </motion.h2>
            <div style={S.valuesGrid}>
              {VALUES.map((v, i) => (
                <motion.div key={i} {...(valuesIn ? fadeUp(0.05 * i) : { initial: { opacity: 0 } })}>
                  <TiltCard
                    style={{ ...S.valueCard, "--card-accent": v.color } as React.CSSProperties}
                    className="value-card-hover"
                  >
                    <span style={S.vNum}>{v.num}</span>
                    <div style={{ marginBottom: 20 }}><IconCanvas rgb={v.rgb} delay={i * 0.8} /></div>
                    <div style={S.vTitle}>{v.title}</div>
                    <div style={S.vDesc}>{v.desc}</div>
                    <div
                      style={{ ...S.vAccentLine, background: `linear-gradient(90deg,transparent,${v.color},transparent)` }}
                      className="value-accent-line"
                    />
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section style={{ ...S.section, paddingTop: 0 }}>
          <div ref={timelineRef}>
            <motion.p style={S.secLabel} {...(timelineIn ? fadeUp(0) : { initial: { opacity: 0 } })}>How we got here</motion.p>
            <motion.h2 style={S.secTitle} {...(timelineIn ? fadeUp(0.1) : { initial: { opacity: 0 } })}>
              The <em style={{ fontStyle: "italic", color: "#555" }}>strata</em><br />of our story
            </motion.h2>
            <div style={S.timeline}>
              <div style={S.timelineLine} />
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  style={S.tItem}
                  {...(timelineIn ? fadeUp(0.1 * i) : { initial: { opacity: 0 } })}
                  className="timeline-item"
                >
                  <div
                    style={{ ...S.tDot, borderColor: item.color, "--dot-color": item.color } as React.CSSProperties}
                    className="timeline-dot"
                  />
                  <div style={S.tContent}>
                    <div style={{ ...S.tYear, color: item.color }}>{item.year}</div>
                    <div style={S.tTitle} className="timeline-title">{item.title}</div>
                    <div style={S.tBody}>{item.body}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section style={{ ...S.section, paddingTop: 0 }}>
          <div ref={teamRef}>
            <motion.p style={S.secLabel} {...(teamIn ? fadeUp(0) : { initial: { opacity: 0 } })}>The minds behind it</motion.p>
            <motion.h2 style={S.secTitle} {...(teamIn ? fadeUp(0.1) : { initial: { opacity: 0 } })}>
              Our <em style={{ fontStyle: "italic", color: "#555" }}>core</em> team
            </motion.h2>
            <div style={S.teamGrid}>
              {TEAM.map((member, i) => (
                <motion.div key={i} {...(teamIn ? fadeUp(0.08 * i) : { initial: { opacity: 0 } })}>
                  <TiltCard style={S.teamCard} className="team-card-hover">
                    <div style={{
                      ...S.tAvatar,
                      background: `rgba(${member.rgb},0.12)`,
                      boxShadow: `0 8px 30px rgba(${member.rgb},0.15)`,
                    }}>
                      <span style={{ fontSize: 28 }}>{member.emoji}</span>
                      <div style={{ position: "absolute", inset: 0, borderRadius: 16, border: `0.5px solid rgba(${member.rgb},0.25)` }} />
                    </div>
                    <div style={S.tName}>{member.name}</div>
                    <div style={{ ...S.tRole, color: member.color }}>{member.role}</div>
                    <div style={S.tBio}>{member.bio}</div>
                    <div style={S.tCardNum}>{member.num}</div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section style={{ ...S.section, paddingTop: 0 }}>
          <div ref={missionRef}>
            <motion.div
              style={S.missionWrap}
              {...(missionIn ? fadeUp(0) : { initial: { opacity: 0 } })}
            >
              <div style={S.missionGlow} />
              <div style={S.missionQuote}>
                "We don't build AI that replaces human intelligence.<br />
                We build AI that <em style={{ fontStyle: "italic", color: "#555" }}>fossilises</em> it — preserving every layer<br />
                so nothing is ever lost to time."
              </div>
              <div style={S.missionAuthor}>— ARIA CHEN, CEO · FOSSILITE AI · 2023</div>
            </motion.div>
          </div>
        </section>

      </main>

      <Ticker /> 
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: {
    background: "#040404", color: "#ffffff",
    fontFamily: "'Outfit', sans-serif",
    overflowX: "hidden", cursor: "crosshair", minHeight: "100vh",
  },
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 48px", borderBottom: "0.5px solid #161616",
    backdropFilter: "blur(20px)", background: "rgba(4,4,4,0.85)",
  },
  navLogo: { fontFamily: "'DM Serif Display', serif", fontSize: 20, letterSpacing: "-0.02em", color: "#fff" },
  navLinks: { display: "flex", gap: 32 },
  navLink: { fontSize: 13, color: "#444", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" },
  navLinkActive: { color: "#fff" },
  navBadge: {
    fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#30d158",
    border: "0.5px solid rgba(48,209,88,0.25)", background: "rgba(48,209,88,0.07)",
    padding: "5px 12px", borderRadius: 99, letterSpacing: "0.06em",
  },
  pageHero: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", textAlign: "center",
    padding: "120px 48px 80px", position: "relative", zIndex: 1,
  },
  eyebrow: {
    fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.12em",
    color: "#444", textTransform: "uppercase", marginBottom: 32,
    display: "flex", alignItems: "center", gap: 16,
  },
  eyebrowLine: { flex: 1, height: "0.5px", background: "#2a2a2a", display: "block", minWidth: 40 },
  heroH1: {
    fontFamily: "'DM Serif Display', serif", fontSize: "clamp(52px,8vw,96px)",
    fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0,
  },
  heroSub: { fontSize: 16, color: "#666", maxWidth: 460, lineHeight: 1.8, marginTop: 28 },
  scrollHint: {
    position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  scrollLabel: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333", letterSpacing: "0.1em" },
  scrollLine: { width: "0.5px", height: 60, background: "linear-gradient(to bottom,#333,transparent)", animation: "scrollPulse 2s ease-in-out infinite" },
  section: { position: "relative", zIndex: 1, padding: "120px 48px", maxWidth: 1200, margin: "0 auto" },
  secLabel: { fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#444", textTransform: "uppercase", marginBottom: 20 },
  secTitle: { fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 },
  secBody: { fontSize: 16, color: "#666", lineHeight: 1.8, maxWidth: 520 },
  aboutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", marginBottom: 80 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#161616", border: "0.5px solid #161616", borderRadius: 12, overflow: "hidden", marginTop: 48 },
  stat: { background: "#080808", padding: "28px 24px", cursor: "default" },
  statNum: { fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#fff", marginBottom: 6 },
  statLabel: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" },
  valuesGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#161616", border: "0.5px solid #161616", borderRadius: 16, overflow: "hidden", marginTop: 64 },
  valueCard: { background: "#080808", padding: "40px 32px", position: "relative", overflow: "hidden", cursor: "default" },
  vNum: { position: "absolute", top: 32, right: 32, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#2a2a2a" },
  vTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, marginBottom: 12 },
  vDesc: { fontSize: 14, color: "#555", lineHeight: 1.75 },
  vAccentLine: { position: "absolute", top: 0, left: 0, right: 0, height: 1, opacity: 0, transition: "opacity 0.3s" },
  timeline: { marginTop: 64, position: "relative", paddingLeft: 24 },
  timelineLine: { position: "absolute", left: 0, top: 0, bottom: 0, width: "0.5px", background: "linear-gradient(to bottom,#0a84ff,#30d158,transparent)" },
  tItem: { paddingLeft: 40, paddingBottom: 56, position: "relative", cursor: "default" },
  tDot: { position: "absolute", left: -5, top: 4, width: 11, height: 11, borderRadius: "50%", background: "#040404", border: "1.5px solid #0a84ff", transition: "transform 0.3s,box-shadow 0.3s" },
  tContent: {},
  tYear: { fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em", marginBottom: 8 },
  tTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, marginBottom: 10, transition: "color 0.2s" },
  tBody: { fontSize: 14, color: "#555", lineHeight: 1.75, maxWidth: 540 },
  teamGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#161616", border: "0.5px solid #161616", borderRadius: 16, overflow: "hidden", marginTop: 64 },
  teamCard: { background: "#080808", padding: "36px 28px", position: "relative", overflow: "hidden", cursor: "default" },
  tAvatar: { width: 64, height: 64, borderRadius: 16, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "transform 0.4s cubic-bezier(.16,1,.3,1)" },
  tName: { fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400, marginBottom: 4 },
  tRole: { fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.06em", marginBottom: 14 },
  tBio: { fontSize: 13, color: "#555", lineHeight: 1.7 },
  tCardNum: { position: "absolute", bottom: 24, right: 24, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#2a2a2a" },
  missionWrap: { border: "0.5px solid #161616", borderRadius: 20, padding: "80px 64px", textAlign: "center", position: "relative", overflow: "hidden", background: "#080808", marginTop: 64 },
  missionGlow: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse,rgba(10,132,255,0.06) 0%,transparent 70%)", pointerEvents: "none" },
  missionQuote: { fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 400, lineHeight: 1.45, letterSpacing: "-0.01em", marginBottom: 32, position: "relative", zIndex: 1 },
  missionAuthor: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#444", letterSpacing: "0.06em", position: "relative", zIndex: 1 },
  tickerWrap: { borderTop: "0.5px solid #161616", borderBottom: "0.5px solid #161616", padding: "14px 0", overflow: "hidden", position: "relative", zIndex: 1, background: "#040404" },
  tickerTrack: { display: "flex", gap: 10, width: "max-content", animation: "ticker 30s linear infinite" },
  tickerPill: { padding: "5px 14px", border: "0.5px solid #1e1e1e", borderRadius: 99, background: "#080808", whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.04em" },
  footer: { borderTop: "0.5px solid #161616", padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 },
  footerMeta: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#333", letterSpacing: "0.06em" },
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #040404; }
  @keyframes scrollPulse {
    0%,100% { opacity: 0.4; transform: scaleY(1); }
    50%      { opacity: 1;   transform: scaleY(1.1); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .value-card-hover:hover .value-accent-line { opacity: 1 !important; }
  .timeline-item:hover .timeline-dot {
    transform: scale(1.5);
    box-shadow: 0 0 0 4px #040404, 0 0 0 6px var(--dot-color, #0a84ff);
  }
  .timeline-item:hover .timeline-title { color: var(--dot-color, #0a84ff); }
  a { cursor: crosshair; }
`;