// src/components/CodeAnimation/CodeAnimation.tsx
import { useEffect, useRef, useState } from "react";
import { useThemeMode } from "../../theme/theme";

const getTokens = (isDark: boolean) => ({
  termBg:      isDark ? "#0d1117" : "#f8f4ee",
  headerBg:    isDark ? "#161b22" : "#ede5d8",
  headerBorder:isDark ? "#30363d" : "#d9c9b0",
  border:      isDark ? "#30363d" : "#d9c9b0",
  lineNum:     isDark ? "#3d4f5c" : "#c4b49a",
  lineHighBg:  isDark ? "#161f2e" : "#e8f0fa",
  cursorCol:   isDark ? "#58d68d" : "#1a7a3c",
  cursorGlow:  isDark ? "0 0 8px #58d68d, 0 0 20px rgba(88,214,141,0.25)"
                      : "0 0 6px rgba(26,122,60,0.5)",
  kw:    isDark ? "#ff7b72" : "#b91c1c",
  cls_:  isDark ? "#ffa657" : "#d97706",
  str_:  isDark ? "#a5d6ff" : "#0550ae",
  cmt:   isDark ? "#4a5568" : "#6b7280",
  bi:    isDark ? "#79c0ff" : "#0369a1",
  punc:  isDark ? "#e6edf3" : "#1e293b",
  num:   isDark ? "#79c0ff" : "#0369a1",
  self_: isDark ? "#ffa657" : "#9a3412",
  plain: isDark ? "#e6edf3" : "#1e293b",
  trafficR: "#ff5f57", trafficY: "#ffbd2e", trafficG: "#28c840",
  label: isDark ? "#4a5568" : "#b0a090",
});

// ── Tokeniser ─────────────────────────────────────────────────────────────────
type TT = "kw"|"cls_"|"str_"|"cmt"|"bi"|"punc"|"num"|"self_"|"plain";
type Tok = { t: TT; v: string };

const KW = new Set(["import","from","async","def","class","return","await",
  "if","else","for","in","while","try","except","with","as","True","False","None"]);
const BI = new Set(["print","len","range","list","dict","str","int","float",
  "bool","type","isinstance","super","id"]);

function tokenise(line: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    if (rest[0] === "#") { out.push({ t:"cmt", v: rest }); break; }
    const strM = rest.match(/^(f|b|r)?"""[\s\S]*?"""|^(f|b|r)?'(?:[^'\\]|\\.)*'|^(f|b|r)?"(?:[^"\\]|\\.)*"/);
    if (strM) { out.push({ t:"str_", v: strM[0] }); i += strM[0].length; continue; }
    const numM = rest.match(/^\d+\.?\d*/);
    if (numM) { out.push({ t:"num", v: numM[0] }); i += numM[0].length; continue; }
    const idM = rest.match(/^[a-zA-Z_]\w*/);
    if (idM) {
      const w = idM[0];
      if (KW.has(w))                  out.push({ t:"kw",   v: w });
      else if (w==="self"||w==="cls") out.push({ t:"self_",v: w });
      else if (BI.has(w))             out.push({ t:"bi",   v: w });
      else if (/^[A-Z]/.test(w))     out.push({ t:"cls_", v: w });
      else                            out.push({ t:"plain",v: w });
      i += w.length; continue;
    }
    out.push({ t:"punc", v: rest[0] }); i++;
  }
  return out;
}

// ── 6 lines of real TTEF code ─────────────────────────────────────────────────
const LINES = [
  `class TTEFAgent:`,
  `    def __init__(self, model: str = "fossilite-core-v3"):`,
  `        self.llm   = FossiliteLLM(model=model)`,
  `        self.tools = WebSearch(top_k=5, rerank=True)`,
  `        self.memory = EpisodicMemory(capacity=512)`,
  `        # Think → Execute → Reflect → repeat`,
];

// ── Highlighted span row ──────────────────────────────────────────────────────
function Line({ text, lineNo, active, T }: {
  text: string; lineNo: number; active: boolean;
  T: ReturnType<typeof getTokens>;
}) {
  const indent  = text.match(/^( *)/)?.[1] ?? "";
  const content = text.slice(indent.length);
  const tokens  = tokenise(content);
  const colMap: Record<TT,string> = {
    kw:T.kw, cls_:T.cls_, str_:T.str_, cmt:T.cmt,
    bi:T.bi, punc:T.punc, num:T.num, self_:T.self_, plain:T.plain,
  };
  return (
    <div style={{
      display:"flex", minHeight:"22px",
      background: active ? T.lineHighBg : "transparent",
      borderLeft: `2px solid ${active ? T.cursorCol : "transparent"}`,
      transition:"background 0.3s, border-color 0.3s",
    }}>
      <span style={{
        width:"40px", minWidth:"40px", textAlign:"right", paddingRight:"18px",
        fontSize:"12px", lineHeight:"22px", color: active ? T.cursorCol : T.lineNum,
        userSelect:"none", transition:"color 0.3s",
      }}>{lineNo}</span>
      <span style={{
        fontSize:"13.5px", lineHeight:"22px", whiteSpace:"pre",
        fontFamily:"'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace",
      }}>
        <span style={{color:T.punc}}>{indent}</span>
        {tokens.map((tk,i)=>(
          <span key={i} style={{
            color:colMap[tk.t],
            fontStyle: tk.t==="cmt" ? "italic" : "normal",
          }}>{tk.v}</span>
        ))}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CodeAnimation() {
  const { mode }  = useThemeMode();
  const isDark    = mode === "dark";
  const T         = getTokens(isDark);

  const [doneLines,  setDoneLines]  = useState<string[]>([]);
  const [partial,    setPartial]    = useState("");
  const [cursorOn,   setCursorOn]   = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // blinking cursor
  useEffect(() => {
    const iv = setInterval(() => setCursorOn(v => !v), 500);
    return () => clearInterval(iv);
  }, []);

  // auto-start on mount, loop forever
  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;

    const clear = () => { if (timerRef.current) clearTimeout(timerRef.current); };

    const tick = () => {
      // all lines done → pause then restart
      if (lineIdx >= LINES.length) {
        timerRef.current = setTimeout(() => {
          setDoneLines([]); setPartial("");
          lineIdx = 0; charIdx = 0;
          tick();
        }, 1800);
        return;
      }

      const line = LINES[lineIdx];

      // line finished → commit, next line
      if (charIdx >= line.length) {
        const committed = line;
        setDoneLines(prev => [...prev, committed]);
        setPartial("");
        lineIdx++; charIdx = 0;
        const pause = committed.trim() === ""      ? 60
          : committed.trimStart().startsWith("#")  ? 90
          : committed.endsWith(":")                ? 55
          : 10;
        timerRef.current = setTimeout(tick, pause);
        return;
      }

      // type a burst of chars
      const burst = Math.floor(Math.random() * 5) + 3;
      const end   = Math.min(charIdx + burst, line.length);
      setPartial(line.slice(0, end));
      charIdx = end;

      const ch = line[charIdx - 1];
      const delay = /[({,=]/.test(ch) ? 30 : 13;
      timerRef.current = setTimeout(tick, delay);
    };

    tick();
    return clear;
  }, []);

  const activeLineNo = doneLines.length + 1;
  const hasPartial   = partial.length > 0 || doneLines.length < LINES.length;

  // partial line syntax rendering
  const renderPartial = () => {
    const indent  = partial.match(/^( *)/)?.[1] ?? "";
    const content = partial.slice(indent.length);
    const tokens  = tokenise(content);
    const colMap: Record<TT,string> = {
      kw:T.kw, cls_:T.cls_, str_:T.str_, cmt:T.cmt,
      bi:T.bi, punc:T.punc, num:T.num, self_:T.self_, plain:T.plain,
    };
    return (
      <>
        <span style={{color:T.punc}}>{indent}</span>
        {tokens.map((tk,i)=>(
          <span key={i} style={{
            color:colMap[tk.t],
            fontStyle: tk.t==="cmt" ? "italic" : "normal",
          }}>{tk.v}</span>
        ))}
        {/* block cursor */}
        <span style={{
          display:"inline-block", width:"8px", height:"15px",
          background: cursorOn ? T.cursorCol : "transparent",
          boxShadow:  cursorOn ? T.cursorGlow : "none",
          verticalAlign:"text-bottom", marginLeft:"1px",
          transition:"background 0.08s, box-shadow 0.08s",
        }}/>
      </>
    );
  };

  return (
    <div style={{
      border:`0.5px solid ${T.border}`,
      borderRadius:"14px", overflow:"hidden",
      boxShadow: isDark
        ? "0 24px 64px rgba(0,0,0,0.55)"
        : "0 12px 40px rgba(0,25,50,0.1)",
      transition:"border-color 0.4s, box-shadow 0.4s",
      fontFamily:"'DM Mono','Courier New',monospace",
      width:"100%", maxWidth:"680px", margin:"0 auto",
    }}>

      {/* ── title bar ── */}
      <div style={{
        background:T.headerBg, borderBottom:`0.5px solid ${T.headerBorder}`,
        padding:"11px 18px", display:"flex",
        alignItems:"center", justifyContent:"space-between",
        transition:"background 0.4s, border-color 0.4s",
      }}>
        <div style={{display:"flex", gap:"7px"}}>
          {[T.trafficR, T.trafficY, T.trafficG].map((c,i)=>(
            <div key={i} style={{width:"11px",height:"11px",borderRadius:"50%",background:c}}/>
          ))}
        </div>
        <span style={{fontSize:"12px", color:T.label, letterSpacing:"1px"}}>
          ttef_agent.py
        </span>
        <span style={{fontSize:"10px", color:T.label, letterSpacing:"1px"}}>
          Python 3.12
        </span>
      </div>

      {/* ── code area ── */}
      <div style={{
        background:T.termBg, padding:"14px 0 18px",
        transition:"background 0.4s",
        minHeight:"160px",
      }}>
        {doneLines.map((ln, i) => (
          <Line key={i} text={ln} lineNo={i+1} active={false} T={T} />
        ))}

        {/* currently typing line */}
        {hasPartial && doneLines.length < LINES.length && (
          <div style={{
            display:"flex", minHeight:"22px",
            background:T.lineHighBg,
            borderLeft:`2px solid ${T.cursorCol}`,
          }}>
            <span style={{
              width:"40px", minWidth:"40px", textAlign:"right", paddingRight:"18px",
              fontSize:"12px", lineHeight:"22px", color:T.cursorCol,
              userSelect:"none",
            }}>{activeLineNo}</span>
            <span style={{
              fontSize:"13.5px", lineHeight:"22px", whiteSpace:"pre",
              fontFamily:"'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace",
            }}>
              {renderPartial()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}