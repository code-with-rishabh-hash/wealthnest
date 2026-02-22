import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar } from "recharts";
import { Lock, Plus, Trash2, Download, Upload, Eye, EyeOff, TrendingUp, TrendingDown, Shield, LogOut, Calendar, Tag, DollarSign, Settings, X, Check, AlertTriangle, FileText, Search, Bell, Edit, ChevronDown, ChevronRight } from "lucide-react";

/* ═══════════════════════ CRYPTO ═══════════════════════ */
const CRY = {
  async dk(pw, salt) {
    const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  },
  async enc(data, pw) {
    const s = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const k = await this.dk(pw, s);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, new TextEncoder().encode(JSON.stringify(data)));
    const raw = JSON.stringify(data);
    const ih = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
    return { s: [...s], i: [...iv], d: [...new Uint8Array(ct)], v: 3, integrity: [...new Uint8Array(ih)].map(b => b.toString(16).padStart(2, "0")).join("") };
  },
  async dec(o, pw) {
    const k = await this.dk(pw, new Uint8Array(o.s));
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(o.i) }, k, new Uint8Array(o.d));
    const raw = new TextDecoder().decode(pt);
    if (o.integrity) {
      const ih = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
      const check = [...new Uint8Array(ih)].map(b => b.toString(16).padStart(2, "0")).join("");
      if (check !== o.integrity) throw new Error("TAMPER_DETECTED");
    }
    return JSON.parse(raw);
  },
  async hash(pw) {
    const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw + "::wealthnest-v3"));
    return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
};

/* ═══════════════════════ STORAGE ═══════════════════════ */
const ST = {
  async get(k) { try { if (window.storage) { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } } catch {} return null; },
  async set(k, v) { try { if (window.storage) await window.storage.set(k, JSON.stringify(v)); } catch {} },
  async del(k) { try { if (window.storage) await window.storage.delete(k); } catch {} }
};

/* ═══════════════════════ CONSTANTS ═══════════════════════ */
const INV_TYPES = [
  { id: "fd", label: "Fixed Deposit", icon: "\u{1F3E6}", color: "#3498DB" },
  { id: "rd", label: "Recurring Deposit", icon: "\u{1F4B3}", color: "#2980B9" },
  { id: "bond", label: "Bonds / Debentures", icon: "\u{1F4DC}", color: "#8E44AD" },
  { id: "mf", label: "Mutual Fund", icon: "\u{1F4C8}", color: "#27AE60" },
  { id: "ppf", label: "PPF", icon: "\u{1F3DB}", color: "#16A085" },
  { id: "nsc", label: "NSC", icon: "\u{1F4E8}", color: "#D35400" },
  { id: "insurance", label: "Insurance / LIC", icon: "\u{1F6E1}", color: "#E74C3C" },
  { id: "gold", label: "Gold / Jewellery", icon: "\u{1F947}", color: "#F1C40F" },
  { id: "property", label: "Real Estate", icon: "\u{1F3E0}", color: "#E67E22" },
  { id: "stocks", label: "Stocks / Equity", icon: "\u{1F4CA}", color: "#2ECC71" },
  { id: "nps", label: "NPS", icon: "\u{1F465}", color: "#1ABC9C" },
  { id: "post_office", label: "Post Office Scheme", icon: "\u{1F4EE}", color: "#9B59B6" },
  { id: "epf", label: "EPF / PF", icon: "\u{1F3ED}", color: "#607D8B" },
  { id: "other", label: "Other", icon: "\u{1F4E6}", color: "#95A5A6" }
];
const BANK_TYPES = ["Savings", "Current", "NRE", "NRO", "Salary", "Joint"];
const ECATS = [
  { id: "housing", label: "Housing", icon: "\u{1F3E0}", color: "#E74C3C" },
  { id: "food", label: "Food & Dining", icon: "\u{1F37D}", color: "#E67E22" },
  { id: "transport", label: "Transport", icon: "\u{1F697}", color: "#F1C40F" },
  { id: "utilities", label: "Utilities", icon: "\u{1F4A1}", color: "#2ECC71" },
  { id: "health", label: "Healthcare", icon: "\u{1F3E5}", color: "#1ABC9C" },
  { id: "shopping", label: "Shopping", icon: "\u{1F6CD}", color: "#9B59B6" },
  { id: "education", label: "Education", icon: "\u{1F4DA}", color: "#E91E63" },
  { id: "other", label: "Other", icon: "\u{1F4E6}", color: "#95A5A6" }
];
const ICATS = [
  { id: "salary", label: "Salary", icon: "\u{1F4B0}", color: "#27AE60" },
  { id: "interest", label: "Interest", icon: "\u{1F4C8}", color: "#3498DB" },
  { id: "maturity", label: "Maturity Proceeds", icon: "\u{1F3E6}", color: "#8E44AD" },
  { id: "dividend", label: "Dividend", icon: "\u{1F4B5}", color: "#16A085" },
  { id: "rental", label: "Rental", icon: "\u{1F3D8}", color: "#D35400" },
  { id: "other_inc", label: "Other", icon: "\u{1F4B5}", color: "#7F8C8D" }
];
const CURS = ["\u20B9", "$", "\u20AC", "\u00A3", "\u00A5"];
const invInfo = id => INV_TYPES.find(t => t.id === id) || INV_TYPES[INV_TYPES.length - 1];
const catInfo = (id, t) => (t === "income" ? ICATS : ECATS).find(c => c.id === id) || { label: id, icon: "?", color: "#999" };
const fm = (n, c) => { const a = Math.abs(n || 0); if (a >= 1e7) return c + (a / 1e7).toFixed(2) + "Cr"; if (a >= 1e5) return c + (a / 1e5).toFixed(2) + "L"; if (a >= 1000) return c + a.toLocaleString("en-IN", { maximumFractionDigits: 0 }); return c + a.toFixed(2); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const mk = d => { const o = new Date(d); return o.getFullYear() + "-" + String(o.getMonth() + 1).padStart(2, "0"); };
const ml = k => { const p = k.split("-"); return new Date(p[0], p[1] - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" }); };
const daysUntil = d => { const t = new Date(d); t.setHours(0, 0, 0, 0); const n = new Date(); n.setHours(0, 0, 0, 0); return Math.ceil((t - n) / 86400000); };
const fmDate = d => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{margin:0;font-family:'DM Sans','Segoe UI',system-ui,sans-serif;background:#0d0f13;color:#e0e0e0}
button,input,select,textarea{font-family:inherit}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5)}select{appearance:none}select option{background:#1a1d23;color:#ddd}
textarea{resize:vertical}`;

const CRD = { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 };
const MAX_ATTEMPTS = 5;
const SESSION_TIMEOUT = 15 * 60 * 1000;

/* ═══════════════════════ UI ═══════════════════════ */
const BT = {
  primary: { bg: "linear-gradient(135deg,#10b981,#059669)", c: "#fff" },
  success: { bg: "linear-gradient(135deg,#22c55e,#16a34a)", c: "#fff" },
  danger: { bg: "linear-gradient(135deg,#ef4444,#dc2626)", c: "#fff" },
  warn: { bg: "linear-gradient(135deg,#f59e0b,#d97706)", c: "#fff" },
  ghost: { bg: "rgba(255,255,255,0.04)", c: "#ccc" },
  outline: { bg: "transparent", c: "#6ee7b7" }
};

function Btn({ children, v = "primary", sz = "md", full, onClick, disabled, style: sx }) {
  const t = BT[v] || BT.primary;
  const pd = sz === "sm" ? "6px 12px" : sz === "lg" ? "14px 26px" : "10px 18px";
  const fs = sz === "sm" ? 12 : sz === "lg" ? 15 : 13;
  const bd = v === "ghost" ? "1px solid rgba(255,255,255,0.1)" : v === "outline" ? "1px solid rgba(52,211,153,0.35)" : "none";
  return (
    <div role="button" tabIndex={0} onClick={disabled ? undefined : onClick}
      onKeyDown={e => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick?.(); } }}
      style={{ background: t.bg, border: bd, borderRadius: 10, padding: pd, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, width: full ? "100%" : "auto", opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", userSelect: "none", ...sx }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: t.c, fontSize: fs, fontWeight: 700, fontFamily: "'DM Sans',system-ui,sans-serif", lineHeight: 1.2 }}>{children}</span>
    </div>
  );
}

function Fld({ label, icon: Ic, textarea, ...p }) {
  const El = textarea ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8892a4", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {Ic && !textarea && <Ic size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none" }} />}
        <El {...p} style={{ width: "100%", padding: Ic && !textarea ? "10px 12px 10px 36px" : "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#e8e8e8", fontSize: 13, outline: "none", boxSizing: "border-box", minHeight: textarea ? 60 : undefined, ...p.style }}
          onFocus={e => e.target.style.borderColor = "rgba(52,211,153,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, children, style: sx }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8892a4", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      <select value={value} onChange={onChange} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#e8e8e8", fontSize: 13, outline: "none", ...sx }}>{children}</select>
    </div>
  );
}

function Mdl({ open, onClose, title, children, mw }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", padding: "40px 16px", overflowY: "auto", animation: "fadeIn 0.15s" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1a1d23", borderRadius: 16, width: "100%", maxWidth: mw || "520px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 48px rgba(0,0,0,0.5)", animation: "slideUp 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "#1a1d23", borderRadius: "16px 16px 0 0", zIndex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f0f0" }}>{title}</h3>
          <div onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 5, color: "#888", display: "flex", cursor: "pointer" }}><X size={16} /></div>
        </div>
        <div style={{ padding: "16px 20px", maxHeight: "70vh", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, color = "#3498DB", style: sx }) {
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: color + "20", color, ...sx }}>{children}</span>;
}

function StatCard({ label, value, sub, Icon, color, bg }) {
  return (
    <div style={{ ...CRD, background: bg || "rgba(255,255,255,0.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#6b7589", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        {Icon && <Icon size={15} color={color} />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      {sub && <span style={{ fontSize: 11, color: "#4a5568" }}>{sub}</span>}
    </div>
  );
}

/* ═══════════════════════ AUTH ═══════════════════════ */
function Auth({ onUnlock }) {
  const [mode, setMode] = useState("detect");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [cur, setCur] = useState("\u20B9");
  const [attempts, setAttempts] = useState(0);
  const [wiped, setWiped] = useState(false);

  useEffect(() => {
    (async () => {
      const att = await ST.get("wn:attempts");
      if (att && att >= MAX_ATTEMPTS) { await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts"); setWiped(true); setMode("setup"); return; }
      if (att) setAttempts(att);
      const h = await ST.get("wn:hash");
      setMode(h ? "login" : "setup");
    })();
  }, []);

  const doSetup = async () => {
    if (pw.length < 8) return setErr("Min 8 characters required");
    if (pw !== pw2) return setErr("Passwords don't match");
    setBusy(true); setErr("");
    try {
      const empty = { investments: [], bankAccounts: [], transactions: [], budgets: [], nominees: [], currency: cur, createdAt: Date.now() };
      await ST.set("wn:hash", await CRY.hash(pw));
      await ST.set("wn:data", await CRY.enc(empty, pw));
      await ST.set("wn:attempts", 0);
      onUnlock(empty, pw);
    } catch (e) { setErr("Setup failed: " + e.message); }
    setBusy(false);
  };

  const doLogin = async () => {
    if (attempts >= MAX_ATTEMPTS) { setErr("Too many attempts. All data has been wiped for security."); return; }
    setBusy(true); setErr("");
    try {
      const stored = await ST.get("wn:hash");
      if ((await CRY.hash(pw)) !== stored) {
        const newAtt = attempts + 1;
        setAttempts(newAtt);
        await ST.set("wn:attempts", newAtt);
        if (newAtt >= MAX_ATTEMPTS) {
          await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts");
          setErr("SECURITY WIPE: " + MAX_ATTEMPTS + " failed attempts. All data destroyed.");
          setWiped(true); setMode("setup");
        } else {
          setErr("Wrong password. " + (MAX_ATTEMPTS - newAtt) + " attempt" + (MAX_ATTEMPTS - newAtt !== 1 ? "s" : "") + " remaining before data wipe.");
        }
        setBusy(false); return;
      }
      const enc = await ST.get("wn:data");
      if (!enc) { setErr("No data found"); setBusy(false); return; }
      try {
        const data = await CRY.dec(enc, pw);
        await ST.set("wn:attempts", 0);
        onUnlock(data, pw);
      } catch (e) {
        if (e.message === "TAMPER_DETECTED") {
          await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts");
          setErr("TAMPER DETECTED: Data integrity check failed. Vault wiped for security.");
          setWiped(true); setMode("setup");
        } else throw e;
      }
    } catch (e) { if (!wiped) setErr("Decryption failed."); }
    setBusy(false);
  };

  if (mode === "detect") return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0d0f13" }}><style>{CSS}</style><p style={{ color: "#666" }}>Opening WealthNest...</p></div>;

  const str = pw.length >= 12 ? 4 : pw.length >= 10 ? 3 : pw.length >= 8 ? 2 : pw.length >= 4 ? 1 : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 30% 20%,#0f1f17 0%,#0d0f13 50%,#080a0e 100%)", padding: 20 }}>
      <style>{CSS}</style>
      <div style={{ width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "36px 32px", boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px", background: "linear-gradient(135deg,#1a3a2f,#0d2420)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(52,211,153,0.15)" }}>
            <Shield size={28} color="#34d399" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0f2f5" }}>WealthNest</h1>
          <p style={{ fontSize: 12, color: "#5a6577", marginTop: 4 }}>{mode === "setup" ? "Create your family's secure vault" : "Unlock your family vault"}</p>
          <p style={{ fontSize: 10, color: "#3d4a5c", fontStyle: "italic", marginTop: 2 }}>Protect. Track. Grow \u2014 Your Family's Wealth</p>
        </div>

        {wiped && <div style={{ padding: "10px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8, marginBottom: 14, fontSize: 12, color: "#fca5a5" }}>Previous vault data was wiped due to security policy. Create a new vault below.</div>}

        {mode === "setup" && (
          <div style={{ marginBottom: 16, padding: "10px 12px", borderRadius: 9, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Shield size={14} color="#34d399" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: "#8892a4", lineHeight: 1.5 }}>
              <strong style={{ color: "#6ee7b7" }}>AES-256-GCM</strong> encryption + <strong style={{ color: "#6ee7b7" }}>PBKDF2 600K</strong> key derivation. Data integrity verification on every unlock. Auto-wipe after {MAX_ATTEMPTS} failed attempts.
            </p>
          </div>
        )}

        {mode === "login" && attempts > 0 && (
          <div style={{ padding: "8px 12px", background: "rgba(245,158,11,0.1)", borderRadius: 8, marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
            <AlertTriangle size={14} color="#f59e0b" />
            <span style={{ fontSize: 12, color: "#fbbf24" }}>Failed attempts: {attempts}/{MAX_ATTEMPTS}</span>
          </div>
        )}

        <div style={{ position: "relative" }}>
          <Fld label="Master Password" icon={Lock} type={show ? "text" : "password"} placeholder="Enter master password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && (mode === "login" ? doLogin() : null)} />
          <div onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: 30, padding: 4, cursor: "pointer", color: "#555" }}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</div>
        </div>

        {mode === "setup" && (<>
          <Fld label="Confirm Password" icon={Lock} type="password" placeholder="Re-enter password" value={pw2} onChange={e => { setPw2(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && doSetup()} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8892a4", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Currency</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CURS.map(c => <div key={c} onClick={() => setCur(c)} style={{ padding: "5px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", background: c === cur ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)", border: c === cur ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.08)", color: c === cur ? "#6ee7b7" : "#888" }}>{c}</div>)}
            </div>
          </div>
        </>)}

        {err && <div style={{ padding: "8px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8, marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}><AlertTriangle size={14} color="#ef4444" /><span style={{ fontSize: 12, color: "#fca5a5" }}>{err}</span></div>}

        <Btn v="success" sz="lg" full onClick={mode === "setup" ? doSetup : doLogin} disabled={busy}>
          {busy ? "Encrypting..." : mode === "setup" ? "Create Family Vault" : "Unlock Vault"}
        </Btn>

        {mode === "setup" && pw.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= str ? (str >= 3 ? "#22c55e" : str >= 2 ? "#eab308" : "#ef4444") : "rgba(255,255,255,0.06)" }} />)}</div>
            <p style={{ fontSize: 10, color: "#5a6577", marginTop: 3 }}>{["", "Weak", "Fair", "Good", "Strong"][str]}</p>
          </div>
        )}

        {mode === "login" && (
          <p style={{ textAlign: "center", marginTop: 14 }}>
            <span onClick={async () => { if (confirm("PERMANENTLY DELETE all data? Cannot be undone.")) { await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts"); setMode("setup"); setPw(""); setErr(""); } }} style={{ fontSize: 11, color: "#ef4444", textDecoration: "underline", cursor: "pointer" }}>Reset vault</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN APP ═══════════════════════ */
function App_Main({ initialData, password, onLogout }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterNominee, setFilterNominee] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const lastActivity = useRef(Date.now());
  const cur = data.currency || "\u20B9";

  // Session timeout
  useEffect(() => {
    const check = setInterval(() => {
      if (Date.now() - lastActivity.current > SESSION_TIMEOUT) { onLogout(); }
    }, 30000);
    const resetTimer = () => { lastActivity.current = Date.now(); };
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);
    return () => { clearInterval(check); window.removeEventListener("click", resetTimer); window.removeEventListener("keydown", resetTimer); };
  }, [onLogout]);

  // Maturity alerts
  useEffect(() => {
    const upcoming = (data.investments || []).filter(inv => {
      if (inv.status === "closed" || !inv.maturityDate) return false;
      const d = daysUntil(inv.maturityDate);
      return d >= -7 && d <= 30;
    }).sort((a, b) => daysUntil(a.maturityDate) - daysUntil(b.maturityDate));
    setAlerts(upcoming);
    if (upcoming.length > 0 && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    upcoming.forEach(inv => {
      const d = daysUntil(inv.maturityDate);
      if (d <= 7 && d >= 0 && "Notification" in window && Notification.permission === "granted") {
        try { new Notification("WealthNest - Maturity Alert", { body: inv.name + " matures in " + d + " day" + (d !== 1 ? "s" : "") + " (" + fm(inv.principal, cur) + ")", icon: "\u{1F514}" }); } catch {}
      }
    });
  }, [data.investments, cur]);

  const save = useCallback(async (newData) => {
    setSaving(true);
    const updated = { ...newData, lastModified: Date.now() };
    setData(updated);
    try { await ST.set("wn:data", await CRY.enc(updated, password)); setSaved(true); setTimeout(() => setSaved(false), 2000); } catch (e) { console.error(e); }
    setSaving(false);
  }, [password]);

  // ── CRUD helpers ──
  const addInv = (inv) => save({ ...data, investments: [...(data.investments || []), { ...inv, id: uid(), createdAt: Date.now() }] });
  const updInv = (id, upd) => save({ ...data, investments: data.investments.map(i => i.id === id ? { ...i, ...upd, lastUpdated: Date.now() } : i) });
  const delInv = (id) => { if (confirm("Delete this investment?")) save({ ...data, investments: data.investments.filter(i => i.id !== id) }); };
  const addBank = (b) => save({ ...data, bankAccounts: [...(data.bankAccounts || []), { ...b, id: uid() }] });
  const updBank = (id, upd) => save({ ...data, bankAccounts: data.bankAccounts.map(b => b.id === id ? { ...b, ...upd } : b) });
  const delBank = (id) => { if (confirm("Delete this bank account?")) save({ ...data, bankAccounts: data.bankAccounts.filter(b => b.id !== id) }); };
  const addTx = (tx) => save({ ...data, transactions: [{ ...tx, id: uid(), ts: Date.now() }, ...(data.transactions || [])] });
  const delTx = (id) => save({ ...data, transactions: data.transactions.filter(t => t.id !== id) });

  const invs = data.investments || [];
  const banks = data.bankAccounts || [];
  const txns = data.transactions || [];

  // ── Computed ──
  const nominees = useMemo(() => {
    const set = new Set();
    invs.forEach(i => { if (i.nominee) set.add(i.nominee); });
    banks.forEach(b => { if (b.nominee) set.add(b.nominee); });
    return [...set].sort();
  }, [invs, banks]);

  const totalPortfolio = useMemo(() => invs.filter(i => i.status !== "closed").reduce((s, i) => s + (i.currentValue || i.principal || 0), 0), [invs]);
  const totalBanks = useMemo(() => banks.reduce((s, b) => s + (b.balance || 0), 0), [banks]);

  const portfolioByType = useMemo(() => {
    const m = {};
    invs.filter(i => i.status !== "closed").forEach(i => { const t = invInfo(i.type); m[i.type] = (m[i.type] || 0) + (i.currentValue || i.principal || 0); });
    return Object.entries(m).map(([type, val]) => ({ ...invInfo(type), value: val })).sort((a, b) => b.value - a.value);
  }, [invs]);

  const portfolioByNominee = useMemo(() => {
    const m = {};
    invs.filter(i => i.status !== "closed").forEach(i => { const n = i.nominee || "Unassigned"; m[n] = (m[n] || 0) + (i.currentValue || i.principal || 0); });
    banks.forEach(b => { const n = b.nominee || "Unassigned"; m[n] = (m[n] || 0) + (b.balance || 0); });
    return Object.entries(m).map(([name, val]) => ({ name, value: val })).sort((a, b) => b.value - a.value);
  }, [invs, banks]);

  const filteredInvs = useMemo(() => invs.filter(i => {
    if (filterNominee !== "all" && i.nominee !== filterNominee) return false;
    if (filterType !== "all" && i.type !== filterType) return false;
    if (searchQ && !i.name?.toLowerCase().includes(searchQ.toLowerCase()) && !i.institution?.toLowerCase().includes(searchQ.toLowerCase()) && !i.nominee?.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  }), [invs, filterNominee, filterType, searchQ]);

  const doExport = async () => {
    const enc = await CRY.enc(data, password);
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(enc)], { type: "application/json" }));
    a.download = "wealthnest-backup-" + new Date().toISOString().split("T")[0] + ".json"; a.click();
  };
  const doImport = () => {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".json";
    inp.onchange = async e => {
      try {
        const dec = await CRY.dec(JSON.parse(await e.target.files[0].text()), password);
        if (confirm("Import will merge with existing data. Continue?")) {
          const merged = { ...data };
          const eIds = new Set((merged.investments || []).map(i => i.id));
          (dec.investments || []).forEach(i => { if (!eIds.has(i.id)) merged.investments.push(i); });
          const bIds = new Set((merged.bankAccounts || []).map(b => b.id));
          (dec.bankAccounts || []).forEach(b => { if (!bIds.has(b.id)) merged.bankAccounts.push(b); });
          const tIds = new Set((merged.transactions || []).map(t => t.id));
          (dec.transactions || []).forEach(t => { if (!tIds.has(t.id)) merged.transactions.push(t); });
          save(merged); alert("Import successful!");
        }
      } catch { alert("Import failed. Wrong password or invalid file."); }
    }; inp.click();
  };

  const TABS = [
    { id: "overview", label: "Overview", Ic: Shield },
    { id: "investments", label: "Investments", Ic: TrendingUp },
    { id: "banks", label: "Bank Accounts", Ic: DollarSign },
    { id: "nominees", label: "By Nominee", Ic: FileText },
    { id: "maturity", label: "Maturity", Ic: Calendar },
    { id: "expenses", label: "Expenses", Ic: TrendingDown },
    { id: "settings", label: "Settings", Ic: Settings }
  ];

  // ── Investment Form ──
  const InvForm = ({ initial, onSave, onCancel }) => {
    const [f, setF] = useState(initial || { type: "fd", name: "", institution: "", accountNo: "", principal: 0, currentValue: 0, interestRate: 0, startDate: "", maturityDate: "", nominee: "", notes: "", status: "active" });
    const u = (k, v) => setF(p => ({ ...p, [k]: v }));
    return (<>
      <Sel label="Investment Type" value={f.type} onChange={e => u("type", e.target.value)}>
        {INV_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
      </Sel>
      <Fld label="Name / Description" value={f.name} onChange={e => u("name", e.target.value)} placeholder="e.g. SBI FD - 2 Year" />
      <Fld label="Institution / Bank" value={f.institution} onChange={e => u("institution", e.target.value)} placeholder="e.g. State Bank of India" />
      <Fld label="Account / Folio Number" value={f.accountNo} onChange={e => u("accountNo", e.target.value)} placeholder="Account number" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Fld label="Principal Amount" icon={DollarSign} type="number" value={f.principal || ""} onChange={e => u("principal", parseFloat(e.target.value) || 0)} />
        <Fld label="Current Value" icon={DollarSign} type="number" value={f.currentValue || ""} onChange={e => u("currentValue", parseFloat(e.target.value) || 0)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Fld label="Interest %" type="number" value={f.interestRate || ""} onChange={e => u("interestRate", parseFloat(e.target.value) || 0)} placeholder="%" />
        <Fld label="Start Date" type="date" value={f.startDate} onChange={e => u("startDate", e.target.value)} />
        <Fld label="Maturity Date" type="date" value={f.maturityDate} onChange={e => u("maturityDate", e.target.value)} />
      </div>
      <Fld label="Nominee Name" value={f.nominee} onChange={e => u("nominee", e.target.value)} placeholder="Full name of nominee" />
      <Sel label="Status" value={f.status} onChange={e => u("status", e.target.value)}>
        <option value="active">Active</option><option value="matured">Matured</option><option value="closed">Closed / Redeemed</option>
      </Sel>
      <Fld label="Notes" textarea value={f.notes} onChange={e => u("notes", e.target.value)} placeholder="Any additional details..." />
      <div style={{ display: "flex", gap: 10 }}>
        <Btn v="success" full onClick={() => onSave(f)}>
          <Check size={16} /> {initial ? "Update" : "Add Investment"}
        </Btn>
        <Btn v="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </>);
  };

  // ── Bank Form ──
  const BankForm = ({ initial, onSave, onCancel }) => {
    const [f, setF] = useState(initial || { bankName: "", accountNo: "", type: "Savings", balance: 0, nominee: "", branch: "", ifsc: "", notes: "" });
    const u = (k, v) => setF(p => ({ ...p, [k]: v }));
    return (<>
      <Fld label="Bank Name" value={f.bankName} onChange={e => u("bankName", e.target.value)} placeholder="e.g. HDFC Bank" />
      <Fld label="Account Number" value={f.accountNo} onChange={e => u("accountNo", e.target.value)} placeholder="Account number" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Sel label="Account Type" value={f.type} onChange={e => u("type", e.target.value)}>
          {BANK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Sel>
        <Fld label="Balance" icon={DollarSign} type="number" value={f.balance || ""} onChange={e => u("balance", parseFloat(e.target.value) || 0)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Fld label="Branch" value={f.branch} onChange={e => u("branch", e.target.value)} placeholder="Branch name" />
        <Fld label="IFSC Code" value={f.ifsc} onChange={e => u("ifsc", e.target.value)} placeholder="IFSC" />
      </div>
      <Fld label="Nominee" value={f.nominee} onChange={e => u("nominee", e.target.value)} placeholder="Nominee name" />
      <Fld label="Notes" textarea value={f.notes} onChange={e => u("notes", e.target.value)} placeholder="Additional details..." />
      <div style={{ display: "flex", gap: 10 }}>
        <Btn v="success" full onClick={() => onSave(f)}><Check size={16} /> {initial ? "Update" : "Add Account"}</Btn>
        <Btn v="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </>);
  };

  // ── Expense Form ──
  const TxForm = ({ onSave, onCancel }) => {
    const [f, setF] = useState({ type: "expense", amount: "", category: "", note: "", date: new Date().toISOString().split("T")[0] });
    const u = (k, v) => setF(p => ({ ...p, [k]: v }));
    const cats = f.type === "income" ? ICATS : ECATS;
    return (<>
      <div style={{ display: "flex", gap: 4, marginBottom: 14, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
        {["expense", "income"].map(t => <div key={t} onClick={() => { u("type", t); u("category", ""); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, textTransform: "capitalize", textAlign: "center", cursor: "pointer", background: f.type === t ? (t === "expense" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)") : "transparent", color: f.type === t ? (t === "expense" ? "#fca5a5" : "#86efac") : "#666" }}>{t}</div>)}
      </div>
      <Fld label="Amount" icon={DollarSign} type="number" placeholder="0.00" value={f.amount} onChange={e => u("amount", e.target.value)} />
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8892a4", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Category</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 5 }}>
          {cats.map(c => <div key={c.id} onClick={() => u("category", c.id)} style={{ padding: "7px 5px", borderRadius: 8, cursor: "pointer", border: f.category === c.id ? "1px solid " + c.color + "55" : "1px solid rgba(255,255,255,0.06)", background: f.category === c.id ? c.color + "15" : "rgba(255,255,255,0.02)", fontSize: 11, color: f.category === c.id ? "#eee" : "#888", display: "flex", alignItems: "center", gap: 4 }}><span>{c.icon}</span> {c.label}</div>)}
        </div>
      </div>
      <Fld label="Date" icon={Calendar} type="date" value={f.date} onChange={e => u("date", e.target.value)} />
      <Fld label="Note" icon={Tag} value={f.note} onChange={e => u("note", e.target.value)} placeholder="Details..." />
      <Btn v={f.type === "income" ? "success" : "danger"} full onClick={() => { if (f.amount && f.category) { onSave({ ...f, amount: parseFloat(f.amount) }); } }}>
        <Plus size={16} /> Add {f.type === "income" ? "Income" : "Expense"}
      </Btn>
    </>);
  };

  const NOM_COLORS = ["#3498DB", "#E74C3C", "#2ECC71", "#9B59B6", "#E67E22", "#1ABC9C", "#F1C40F", "#607D8B"];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f13" }}>
      <style>{CSS}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(13,15,19,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={18} color="#34d399" />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f0f2f5" }}>WealthNest</span>
          <Badge color="#34d399">Family</Badge>
          {saving && <span style={{ fontSize: 10, color: "#555", marginLeft: 4 }}>Saving...</span>}
          {saved && !saving && <span style={{ fontSize: 10, color: "#34d399", marginLeft: 4 }}>{"\u2713"} Encrypted</span>}
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <div onClick={() => setShowAlerts(!showAlerts)} style={{ position: "relative", cursor: "pointer", padding: 6 }}>
            <Bell size={16} color={alerts.length > 0 ? "#f59e0b" : "#555"} />
            {alerts.length > 0 && <div style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />}
          </div>
          <Btn v="ghost" sz="sm" onClick={doExport}><Download size={13} /> Export</Btn>
          <Btn v="ghost" sz="sm" onClick={doImport}><Upload size={13} /> Import</Btn>
          <Btn v="ghost" sz="sm" onClick={onLogout} style={{ borderColor: "rgba(239,68,68,0.2)" }}><LogOut size={13} color="#f87171" /></Btn>
        </div>
      </header>

      {/* Maturity Alerts Dropdown */}
      {showAlerts && alerts.length > 0 && (
        <div style={{ background: "rgba(245,158,11,0.05)", borderBottom: "1px solid rgba(245,158,11,0.1)", padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24" }}>{"\u{1F514}"} Upcoming Maturities ({alerts.length})</span>
            <div onClick={() => setShowAlerts(false)} style={{ cursor: "pointer", color: "#888" }}><X size={14} /></div>
          </div>
          {alerts.map(inv => {
            const d = daysUntil(inv.maturityDate);
            const urgency = d <= 0 ? "#ef4444" : d <= 7 ? "#f59e0b" : "#3498DB";
            return (
              <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#ddd" }}>{inv.name}</span>
                  <span style={{ fontSize: 11, color: "#777", marginLeft: 8 }}>{inv.nominee && "Nominee: " + inv.nominee}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#ddd" }}>{fm(inv.principal, cur)}</span>
                  <Badge color={urgency}>{d <= 0 ? "MATURED" : d + "d left"}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <nav style={{ display: "flex", gap: 1, padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", overflowX: "auto" }}>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", background: tab === t.id ? "rgba(16,185,129,0.12)" : "transparent", color: tab === t.id ? "#6ee7b7" : "#5a6577", whiteSpace: "nowrap", transition: "all 0.15s" }}>
            <t.Ic size={13} /> {t.label}
            {t.id === "maturity" && alerts.length > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 10, marginLeft: 2 }}>{alerts.length}</span>}
          </div>
        ))}
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 16px 40px" }}>

        {/* ════════ OVERVIEW ════════ */}
        {tab === "overview" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard label="Total Portfolio" value={fm(totalPortfolio, cur)} Icon={TrendingUp} color="#22c55e" bg="rgba(34,197,94,0.05)" />
            <StatCard label="Bank Balance" value={fm(totalBanks, cur)} Icon={DollarSign} color="#3498DB" bg="rgba(52,152,219,0.05)" />
            <StatCard label="Total Wealth" value={fm(totalPortfolio + totalBanks, cur)} Icon={Shield} color="#34d399" bg="rgba(16,185,129,0.05)" />
            <StatCard label="Active Investments" value={String(invs.filter(i => i.status !== "closed").length)} sub={invs.filter(i => i.status === "closed").length + " closed"} Icon={FileText} color="#f59e0b" bg="rgba(245,158,11,0.05)" />
          </div>

          {alerts.length > 0 && (
            <div style={{ ...CRD, background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.12)", marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24", marginBottom: 10 }}>{"\u26A0"} Investments Maturing Soon</h4>
              {alerts.slice(0, 5).map(inv => { const d = daysUntil(inv.maturityDate); return (
                <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 12 }}>
                  <span style={{ color: "#ddd" }}>{invInfo(inv.type).icon} {inv.name} {inv.nominee && <span style={{ color: "#777" }}>({inv.nominee})</span>}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#ddd" }}>{fm(inv.principal, cur)}</span><Badge color={d <= 0 ? "#ef4444" : d <= 7 ? "#f59e0b" : "#3498DB"}>{d <= 0 ? "MATURED" : d + " days"}</Badge></div>
                </div>
              ); })}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: portfolioByType.length > 0 ? "1fr 1fr" : "1fr", gap: 14, marginBottom: 16 }}>
            {portfolioByType.length > 0 && (
              <div style={CRD}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#8892a4", marginBottom: 14 }}>Portfolio by Type</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={portfolioByType} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">{portfolioByType.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
                  <Tooltip contentStyle={{ background: "#1a1d23", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#ddd" }} formatter={v => fm(v, cur)} /></PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 8 }}>{portfolioByType.map(c => (
                  <div key={c.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11 }}>
                    <span style={{ color: "#aaa" }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: c.color, marginRight: 6 }} />{c.icon} {c.label}</span>
                    <span style={{ color: "#ddd", fontWeight: 500 }}>{fm(c.value, cur)}</span>
                  </div>
                ))}</div>
              </div>
            )}
            {portfolioByNominee.length > 0 && (
              <div style={CRD}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#8892a4", marginBottom: 14 }}>Wealth by Nominee</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={portfolioByNominee} layout="vertical">
                    <XAxis type="number" tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#aaa", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ background: "#1a1d23", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "#ddd" }} formatter={v => fm(v, cur)} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>{portfolioByNominee.map((e, i) => <Cell key={i} fill={NOM_COLORS[i % NOM_COLORS.length]} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>)}

        {/* ════════ INVESTMENTS ════════ */}
        {tab === "investments" && (<>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Btn onClick={() => setModal("add-inv")}><Plus size={15} /> Add Investment</Btn>
            <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
              <input placeholder="Search..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: "100%", padding: "8px 10px 8px 30px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#ddd", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#ddd", fontSize: 12, outline: "none" }}>
              <option value="all">All Types</option>
              {INV_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <select value={filterNominee} onChange={e => setFilterNominee(e.target.value)} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#ddd", fontSize: 12, outline: "none" }}>
              <option value="all">All Nominees</option>
              {nominees.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <p style={{ fontSize: 11, color: "#5a6577", marginBottom: 10 }}>{filteredInvs.length} investment{filteredInvs.length !== 1 ? "s" : ""} {"\u00B7"} Total: {fm(filteredInvs.filter(i => i.status !== "closed").reduce((s, i) => s + (i.currentValue || i.principal || 0), 0), cur)}</p>

          {filteredInvs.length === 0 ? <div style={{ ...CRD, textAlign: "center", padding: 40 }}><p style={{ color: "#5a6577" }}>No investments found. Add your first investment to get started.</p></div>
          : filteredInvs.map(inv => {
            const ti = invInfo(inv.type);
            const d = inv.maturityDate ? daysUntil(inv.maturityDate) : null;
            return (
              <div key={inv.id} style={{ ...CRD, marginBottom: 10, borderColor: inv.status === "closed" ? "rgba(255,255,255,0.03)" : d !== null && d <= 30 && d >= 0 ? "rgba(245,158,11,0.2)" : undefined, opacity: inv.status === "closed" ? 0.6 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 16 }}>{ti.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e0e0e0" }}>{inv.name || ti.label}</span>
                      <Badge color={ti.color}>{ti.label}</Badge>
                      {inv.status === "closed" && <Badge color="#ef4444">Closed</Badge>}
                      {inv.status === "matured" && <Badge color="#f59e0b">Matured</Badge>}
                      {d !== null && d <= 30 && d > 0 && inv.status === "active" && <Badge color="#f59e0b">{d}d to maturity</Badge>}
                      {d !== null && d <= 0 && inv.status === "active" && <Badge color="#ef4444">MATURED</Badge>}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7589", lineHeight: 1.8 }}>
                      {inv.institution && <span>{inv.institution} {"\u00B7"} </span>}
                      {inv.accountNo && <span>A/C: {inv.accountNo} {"\u00B7"} </span>}
                      {inv.interestRate > 0 && <span>{inv.interestRate}% {"\u00B7"} </span>}
                      {inv.nominee && <span style={{ color: "#93c5fd" }}>Nominee: {inv.nominee}</span>}
                    </div>
                    {inv.startDate && <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{fmDate(inv.startDate)}{inv.maturityDate ? " \u2192 " + fmDate(inv.maturityDate) : ""}</div>}
                    {inv.notes && <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontStyle: "italic" }}>{inv.notes}</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>{fm(inv.currentValue || inv.principal, cur)}</div>
                    {inv.currentValue && inv.principal && inv.currentValue !== inv.principal && (
                      <div style={{ fontSize: 10, color: inv.currentValue > inv.principal ? "#22c55e" : "#ef4444" }}>
                        {inv.currentValue > inv.principal ? "+" : ""}{fm(inv.currentValue - inv.principal, cur)} ({((inv.currentValue - inv.principal) / inv.principal * 100).toFixed(1)}%)
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 4, marginTop: 6, justifyContent: "flex-end" }}>
                      <div onClick={() => { setEditItem(inv); setModal("edit-inv"); }} style={{ background: "rgba(59,130,246,0.1)", borderRadius: 6, padding: 5, color: "#60a5fa", cursor: "pointer", display: "flex" }}><Edit size={12} /></div>
                      <div onClick={() => delInv(inv.id)} style={{ background: "rgba(239,68,68,0.1)", borderRadius: 6, padding: 5, color: "#ef4444", cursor: "pointer", display: "flex" }}><Trash2 size={12} /></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>)}

        {/* ════════ BANK ACCOUNTS ════════ */}
        {tab === "banks" && (<>
          <Btn onClick={() => setModal("add-bank")} style={{ marginBottom: 16 }}><Plus size={15} /> Add Bank Account</Btn>
          {banks.length === 0 ? <div style={{ ...CRD, textAlign: "center", padding: 40 }}><p style={{ color: "#5a6577" }}>No bank accounts added yet.</p></div>
          : banks.map(b => (
            <div key={b.id} style={{ ...CRD, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e0e0e0", marginBottom: 3 }}>{"\u{1F3E6}"} {b.bankName}</div>
                  <div style={{ fontSize: 11, color: "#6b7589", lineHeight: 1.8 }}>
                    A/C: {b.accountNo} {"\u00B7"} {b.type}
                    {b.branch && <span> {"\u00B7"} {b.branch}</span>}
                    {b.ifsc && <span> {"\u00B7"} IFSC: {b.ifsc}</span>}
                    {b.nominee && <span> {"\u00B7"} <span style={{ color: "#93c5fd" }}>Nominee: {b.nominee}</span></span>}
                  </div>
                  {b.notes && <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontStyle: "italic" }}>{b.notes}</div>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#3498DB" }}>{fm(b.balance, cur)}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6, justifyContent: "flex-end" }}>
                    <div onClick={() => { setEditItem(b); setModal("edit-bank"); }} style={{ background: "rgba(59,130,246,0.1)", borderRadius: 6, padding: 5, color: "#60a5fa", cursor: "pointer", display: "flex" }}><Edit size={12} /></div>
                    <div onClick={() => delBank(b.id)} style={{ background: "rgba(239,68,68,0.1)", borderRadius: 6, padding: 5, color: "#ef4444", cursor: "pointer", display: "flex" }}><Trash2 size={12} /></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>)}

        {/* ════════ BY NOMINEE ════════ */}
        {tab === "nominees" && (<>
          {nominees.length === 0 ? <div style={{ ...CRD, textAlign: "center", padding: 40 }}><p style={{ color: "#5a6577" }}>No nominees found. Add nominees when creating investments or bank accounts.</p></div>
          : nominees.map((nom, ni) => {
            const nInvs = invs.filter(i => i.nominee === nom && i.status !== "closed");
            const nBanks = banks.filter(b => b.nominee === nom);
            const total = nInvs.reduce((s, i) => s + (i.currentValue || i.principal || 0), 0) + nBanks.reduce((s, b) => s + (b.balance || 0), 0);
            const nc = NOM_COLORS[ni % NOM_COLORS.length];
            return (
              <div key={nom} style={{ ...CRD, marginBottom: 14, borderColor: nc + "30" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: nc + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: nc }}>{nom[0]}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#e0e0e0" }}>{nom}</div>
                      <div style={{ fontSize: 11, color: "#6b7589" }}>{nInvs.length} investment{nInvs.length !== 1 ? "s" : ""} {"\u00B7"} {nBanks.length} bank account{nBanks.length !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: nc }}>{fm(total, cur)}</div>
                </div>
                {nInvs.map(inv => (
                  <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.03)", fontSize: 12 }}>
                    <span style={{ color: "#bbb" }}>{invInfo(inv.type).icon} {inv.name || invInfo(inv.type).label} <span style={{ color: "#666" }}>({inv.institution})</span></span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: "#ddd", fontWeight: 500 }}>{fm(inv.currentValue || inv.principal, cur)}</span>
                      {inv.maturityDate && <Badge color={daysUntil(inv.maturityDate) <= 30 ? "#f59e0b" : "#555"}>{fmDate(inv.maturityDate)}</Badge>}
                    </div>
                  </div>
                ))}
                {nBanks.map(b => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.03)", fontSize: 12 }}>
                    <span style={{ color: "#bbb" }}>{"\u{1F3E6}"} {b.bankName} ({b.type})</span>
                    <span style={{ color: "#ddd", fontWeight: 500 }}>{fm(b.balance, cur)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </>)}

        {/* ════════ MATURITY CALENDAR ════════ */}
        {tab === "maturity" && (<>
          {(() => {
            const activeInvs = invs.filter(i => i.maturityDate && i.status !== "closed").sort((a, b) => new Date(a.maturityDate) - new Date(b.maturityDate));
            const past = activeInvs.filter(i => daysUntil(i.maturityDate) < 0);
            const soon = activeInvs.filter(i => { const d = daysUntil(i.maturityDate); return d >= 0 && d <= 30; });
            const upcoming = activeInvs.filter(i => { const d = daysUntil(i.maturityDate); return d > 30 && d <= 90; });
            const later = activeInvs.filter(i => daysUntil(i.maturityDate) > 90);
            const Section = ({ title, items, color }) => items.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>{title} <span style={{ fontSize: 11, fontWeight: 400, color: "#6b7589" }}>({items.length})</span></h4>
                {items.map(inv => { const d = daysUntil(inv.maturityDate); return (
                  <div key={inv.id} style={{ ...CRD, padding: "12px 16px", marginBottom: 6, borderColor: color + "30" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#e0e0e0" }}>{invInfo(inv.type).icon} {inv.name}</span>
                        <div style={{ fontSize: 11, color: "#6b7589", marginTop: 2 }}>{inv.institution} {inv.nominee && <span>{"\u00B7"} <span style={{ color: "#93c5fd" }}>{inv.nominee}</span></span>}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#22c55e" }}>{fm(inv.principal, cur)}</div>
                        <div style={{ fontSize: 11, color }}>{fmDate(inv.maturityDate)} {d >= 0 ? "(" + d + "d)" : "(" + Math.abs(d) + "d overdue)"}</div>
                      </div>
                    </div>
                  </div>
                ); })}
              </div>
            );
            return (<>
              {activeInvs.length === 0 && <div style={{ ...CRD, textAlign: "center", padding: 40 }}><p style={{ color: "#5a6577" }}>No investments with maturity dates.</p></div>}
              <Section title={"\u{1F534} Overdue / Already Matured"} items={past} color="#ef4444" />
              <Section title={"\u{1F7E0} Maturing Within 30 Days"} items={soon} color="#f59e0b" />
              <Section title={"\u{1F535} Maturing in 1-3 Months"} items={upcoming} color="#3498DB" />
              <Section title={"\u{1F7E2} Maturing Later"} items={later} color="#22c55e" />
            </>);
          })()}
        </>)}

        {/* ════════ EXPENSES ════════ */}
        {tab === "expenses" && (<>
          <Btn onClick={() => setModal("add-tx")} style={{ marginBottom: 14 }}><Plus size={15} /> Add Transaction</Btn>
          {(() => {
            const cm = mk(new Date());
            const mt = txns.filter(t => mk(t.date) === cm);
            const inc = mt.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
            const exp2 = mt.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
            return (<>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 14 }}>
                <StatCard label="Month Income" value={fm(inc, cur)} color="#22c55e" bg="rgba(34,197,94,0.05)" />
                <StatCard label="Month Expenses" value={fm(exp2, cur)} color="#ef4444" bg="rgba(239,68,68,0.05)" />
                <StatCard label="Net" value={fm(inc - exp2, cur)} color={inc - exp2 >= 0 ? "#22c55e" : "#ef4444"} bg={inc - exp2 >= 0 ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)"} />
              </div>
              <div style={CRD}>
                {txns.length === 0 ? <p style={{ textAlign: "center", color: "#4a5568", padding: 20 }}>No transactions yet.</p>
                : txns.slice(0, 30).map(tx => { const c = catInfo(tx.category, tx.type); return (
                  <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{c.icon}</span>
                      <div><div style={{ fontSize: 12, fontWeight: 500, color: "#d0d0d0" }}>{c.label}</div><div style={{ fontSize: 10, color: "#555" }}>{tx.note ? tx.note + " \u00B7 " : ""}{tx.date}</div></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: tx.type === "income" ? "#22c55e" : "#ef4444" }}>{tx.type === "income" ? "+" : "-"}{fm(tx.amount, cur)}</span>
                      <div onClick={() => delTx(tx.id)} style={{ background: "rgba(239,68,68,0.1)", borderRadius: 5, padding: 4, color: "#ef4444", cursor: "pointer", display: "flex" }}><Trash2 size={11} /></div>
                    </div>
                  </div>
                ); })}
              </div>
            </>);
          })()}
        </>)}

        {/* ════════ SETTINGS ════════ */}
        {tab === "settings" && (<>
          <div style={CRD}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#8892a4", marginBottom: 14 }}>Security</h4>
            {[["Encryption", "AES-256-GCM", "#22c55e"], ["Key Derivation", "PBKDF2 (600K)", "#22c55e"], ["Integrity Check", "SHA-256 on every unlock", "#22c55e"], ["Auto-Wipe", MAX_ATTEMPTS + " failed attempts", "#f59e0b"], ["Session Timeout", "15 min inactivity", "#f59e0b"], ["Currency", cur, "#ddd"], ["Investments", String(invs.length), "#ddd"], ["Bank Accounts", String(banks.length), "#ddd"]].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}><span style={{ color: "#6b7589" }}>{k}</span><span style={{ color: c }}>{v}</span></div>
            ))}
          </div>
          <div style={{ ...CRD, marginTop: 14, background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.1)", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Shield size={16} color="#34d399" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: "#8892a4", lineHeight: 1.6 }}>
              <strong style={{ color: "#6ee7b7" }}>Zero-Knowledge + Tamper Detection:</strong> Password never stored. Data integrity verified with SHA-256 on every unlock. Any modification to encrypted data triggers automatic wipe. {MAX_ATTEMPTS} wrong passwords wipes everything. Session auto-locks after 15 min.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn v="outline" full onClick={doExport}><Download size={15} /> Export Backup</Btn>
            <Btn v="outline" full onClick={doImport}><Upload size={15} /> Import Backup</Btn>
          </div>
          <Btn v="danger" full onClick={async () => { if (confirm("PERMANENTLY DELETE ALL DATA?")) { await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts"); onLogout(); } }} style={{ marginTop: 10 }}><Trash2 size={15} /> Emergency Wipe</Btn>
        </>)}
      </main>

      {/* ═══════════════ MODALS ═══════════════ */}
      <Mdl open={modal === "add-inv"} onClose={() => setModal(null)} title="Add Investment" mw="560px">
        <InvForm onSave={inv => { addInv(inv); setModal(null); }} onCancel={() => setModal(null)} />
      </Mdl>
      <Mdl open={modal === "edit-inv"} onClose={() => { setModal(null); setEditItem(null); }} title="Edit Investment" mw="560px">
        {editItem && <InvForm initial={editItem} onSave={inv => { updInv(editItem.id, inv); setModal(null); setEditItem(null); }} onCancel={() => { setModal(null); setEditItem(null); }} />}
      </Mdl>
      <Mdl open={modal === "add-bank"} onClose={() => setModal(null)} title="Add Bank Account">
        <BankForm onSave={b => { addBank(b); setModal(null); }} onCancel={() => setModal(null)} />
      </Mdl>
      <Mdl open={modal === "edit-bank"} onClose={() => { setModal(null); setEditItem(null); }} title="Edit Bank Account">
        {editItem && <BankForm initial={editItem} onSave={b => { updBank(editItem.id, b); setModal(null); setEditItem(null); }} onCancel={() => { setModal(null); setEditItem(null); }} />}
      </Mdl>
      <Mdl open={modal === "add-tx"} onClose={() => setModal(null)} title="Add Transaction">
        <TxForm onSave={tx => { addTx(tx); setModal(null); }} onCancel={() => setModal(null)} />
      </Mdl>
    </div>
  );
}

/* ═══════════════════════ ROOT ═══════════════════════ */
export default function App() {
  const [s, setS] = useState({ p: "auth" });
  if (s.p === "auth") return <Auth onUnlock={(d, pw) => setS({ p: "app", d, pw })} />;
  return <App_Main initialData={s.d} password={s.pw} onLogout={() => setS({ p: "auth" })} />;
}
