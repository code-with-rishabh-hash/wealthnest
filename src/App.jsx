import { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from "react";
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Lock, Plus, Trash2, Download, Upload, Eye, EyeOff, TrendingUp, TrendingDown, Shield, LogOut, Calendar, Tag, DollarSign, Settings, X, Check, AlertTriangle, FileText, Search, Bell, Edit, Sun, Moon, CheckCircle, XCircle, Info, ShieldCheck, Wallet, PiggyBank, Users, Clock, Fingerprint, KeyRound } from "lucide-react";

/* ═══════════════════════ THEME SYSTEM ═══════════════════════ */
const THEMES = {
  dark: {
    isDark: true,
    bg: '#0b0d11',
    bgGrad: 'radial-gradient(ellipse at 30% 20%,#0f1f17 0%,#0b0d11 50%,#080a0e 100%)',
    surface: '#141720',
    surfaceAlt: '#1c1f29',
    border: 'rgba(255,255,255,0.06)',
    borderHover: 'rgba(255,255,255,0.12)',
    text: '#e2e8f0',
    textSoft: '#cbd5e1',
    textSec: '#8b95a8',
    textMut: '#525c6f',
    accent: '#34d399',
    accentDk: '#059669',
    accentBg: 'rgba(16,185,129,0.08)',
    accentBd: 'rgba(16,185,129,0.2)',
    success: '#22c55e',
    successBg: 'rgba(34,197,94,0.06)',
    danger: '#ef4444',
    dangerBg: 'rgba(239,68,68,0.08)',
    dangerTxt: '#fca5a5',
    warning: '#f59e0b',
    warningBg: 'rgba(245,158,11,0.06)',
    warningTxt: '#fbbf24',
    info: '#3b82f6',
    infoBg: 'rgba(59,130,246,0.06)',
    nominee: '#93c5fd',
    inputBg: 'rgba(255,255,255,0.04)',
    inputBd: 'rgba(255,255,255,0.1)',
    inputFocus: 'rgba(52,211,153,0.5)',
    inputTxt: '#e8e8e8',
    optBg: '#1a1d23',
    optTxt: '#ddd',
    headerBg: 'rgba(11,13,17,0.92)',
    scroll: 'rgba(255,255,255,0.08)',
    shadow: '0 8px 32px rgba(0,0,0,0.4)',
    cardShadow: 'none',
    chartAxis: '#555',
    chartLabel: '#aaa',
    tipBg: '#1c1f29',
    tipBd: 'rgba(255,255,255,0.1)',
    tipTxt: '#ddd',
    calFilter: 'invert(0.5)',
    ghostBg: 'rgba(255,255,255,0.04)',
    ghostBd: 'rgba(255,255,255,0.1)',
    ghostTxt: '#ccc',
    outlineTxt: '#6ee7b7',
    outlineBd: 'rgba(52,211,153,0.35)',
    cursor: 'rgba(255,255,255,0.05)',
    barLabel: '#fff',
    tagBg: c => c + '18',
    gradStart: '#1a3a2f',
    gradEnd: '#0d2420',
    expBg: c => c + '15',
  },
  light: {
    isDark: false,
    bg: '#f4f6fb',
    bgGrad: 'radial-gradient(ellipse at 30% 20%,#e0f5ee 0%,#f4f6fb 50%,#eee8f8 100%)',
    surface: '#ffffff',
    surfaceAlt: '#f8f9fc',
    border: 'rgba(0,0,0,0.07)',
    borderHover: 'rgba(0,0,0,0.14)',
    text: '#111827',
    textSoft: '#1f2937',
    textSec: '#4b5563',
    textMut: '#9ca3af',
    accent: '#059669',
    accentDk: '#047857',
    accentBg: 'rgba(5,150,105,0.05)',
    accentBd: 'rgba(5,150,105,0.2)',
    success: '#16a34a',
    successBg: 'rgba(22,163,74,0.06)',
    danger: '#dc2626',
    dangerBg: 'rgba(220,38,38,0.06)',
    dangerTxt: '#991b1b',
    warning: '#d97706',
    warningBg: 'rgba(217,119,6,0.06)',
    warningTxt: '#92400e',
    info: '#2563eb',
    infoBg: 'rgba(37,99,235,0.06)',
    nominee: '#1d4ed8',
    inputBg: '#f9fafb',
    inputBd: 'rgba(0,0,0,0.12)',
    inputFocus: 'rgba(5,150,105,0.5)',
    inputTxt: '#111827',
    optBg: '#ffffff',
    optTxt: '#333',
    headerBg: 'rgba(244,246,251,0.95)',
    scroll: 'rgba(0,0,0,0.12)',
    shadow: '0 8px 32px rgba(0,0,0,0.08)',
    cardShadow: '0 1px 3px rgba(0,0,0,0.06)',
    chartAxis: '#9ca3af',
    chartLabel: '#4b5563',
    tipBg: '#ffffff',
    tipBd: 'rgba(0,0,0,0.1)',
    tipTxt: '#333',
    calFilter: 'none',
    ghostBg: 'rgba(0,0,0,0.04)',
    ghostBd: 'rgba(0,0,0,0.1)',
    ghostTxt: '#4b5563',
    outlineTxt: '#059669',
    outlineBd: 'rgba(5,150,105,0.3)',
    cursor: 'rgba(0,0,0,0.04)',
    barLabel: '#fff',
    tagBg: c => c + '14',
    gradStart: '#e0f2f1',
    gradEnd: '#e8f5e9',
    expBg: c => c + '10',
  }
};

const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);

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

/* ═══════════════════════ STORAGE (FIXED) ═══════════════════════ */
const ST = {
  async get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  async set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  async del(k) { try { localStorage.removeItem(k); } catch {} }
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

const MAX_ATTEMPTS = 5;
const SESSION_TIMEOUT = 15 * 60 * 1000;

/* ═══════════════════════ CSS GENERATOR ═══════════════════════ */
const getCSS = (T) => `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{margin:0;font-family:'DM Sans','Segoe UI',system-ui,sans-serif;background:${T.bg};color:${T.text};transition:background 0.3s ease,color 0.3s ease}
button,input,select,textarea{font-family:inherit}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes toastIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes toastOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100%)}}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:${T.scroll};border-radius:3px}
input[type="date"]::-webkit-calendar-picker-indicator{filter:${T.calFilter}}
select{appearance:none}select option{background:${T.optBg};color:${T.optTxt}}
textarea{resize:vertical}
@media(max-width:480px){.stat-grid{grid-template-columns:1fr 1fr !important}.chart-grid{grid-template-columns:1fr !important}}`;

/* ═══════════════════════ UI COMPONENTS ═══════════════════════ */
function Btn({ children, v = "primary", sz = "md", full, onClick, disabled, style: sx }) {
  const { T } = useTheme();
  const variants = {
    primary: { bg: `linear-gradient(135deg,${T.accent},${T.accentDk})`, c: "#fff" },
    success: { bg: "linear-gradient(135deg,#22c55e,#16a34a)", c: "#fff" },
    danger: { bg: "linear-gradient(135deg,#ef4444,#dc2626)", c: "#fff" },
    warn: { bg: "linear-gradient(135deg,#f59e0b,#d97706)", c: "#fff" },
    ghost: { bg: T.ghostBg, c: T.ghostTxt },
    outline: { bg: "transparent", c: T.outlineTxt }
  };
  const t = variants[v] || variants.primary;
  const pd = sz === "sm" ? "7px 13px" : sz === "lg" ? "14px 26px" : "10px 18px";
  const fs = sz === "sm" ? 12 : sz === "lg" ? 15 : 13;
  const bd = v === "ghost" ? `1px solid ${T.ghostBd}` : v === "outline" ? `1px solid ${T.outlineBd}` : "none";
  return (
    <div role="button" tabIndex={0} onClick={disabled ? undefined : onClick}
      onKeyDown={e => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick?.(); } }}
      style={{ background: t.bg, border: bd, borderRadius: 10, padding: pd, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, width: full ? "100%" : "auto", opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", userSelect: "none", ...sx }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: t.c, fontSize: fs, fontWeight: 700, fontFamily: "'DM Sans',system-ui,sans-serif", lineHeight: 1.2 }}>{children}</span>
    </div>
  );
}

function Fld({ label, icon: Ic, textarea, ...p }) {
  const { T } = useTheme();
  const El = textarea ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {Ic && !textarea && <Ic size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.textMut, pointerEvents: "none" }} />}
        <El {...p} autoComplete="off" style={{ width: "100%", padding: Ic && !textarea ? "10px 12px 10px 36px" : "10px 12px", background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 9, color: T.inputTxt, fontSize: 13, outline: "none", boxSizing: "border-box", minHeight: textarea ? 60 : undefined, transition: "border-color 0.2s", ...p.style }}
          onFocus={e => e.target.style.borderColor = T.inputFocus} onBlur={e => e.target.style.borderColor = T.inputBd} />
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, children, style: sx }) {
  const { T } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      <select value={value} onChange={onChange} style={{ width: "100%", padding: "10px 12px", background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 9, color: T.inputTxt, fontSize: 13, outline: "none", ...sx }}>{children}</select>
    </div>
  );
}

function Mdl({ open, onClose, title, children, mw, icon: Icon, iconColor }) {
  const { T } = useTheme();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", padding: "40px 16px", overflowY: "auto", animation: "fadeIn 0.15s" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: 18, width: "100%", maxWidth: mw || "520px", border: `1px solid ${T.border}`, boxShadow: T.shadow, animation: "slideUp 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, background: T.surface, borderRadius: "18px 18px 0 0", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {Icon && <Icon size={18} color={iconColor || T.accent} />}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{title}</h3>
          </div>
          <div onClick={onClose} style={{ background: T.ghostBg, borderRadius: 8, padding: 6, color: T.textSec, display: "flex", cursor: "pointer", transition: "background 0.15s" }}><X size={16} /></div>
        </div>
        <div style={{ padding: "16px 20px", maxHeight: "70vh", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, color = "#3498DB", style: sx }) {
  return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: color + "18", color, ...sx }}>{children}</span>;
}

function StatCard({ label, value, sub, Icon, color, bg }) {
  const { T } = useTheme();
  return (
    <div style={{ background: bg || T.ghostBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow, transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: T.textSec, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        {Icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: color + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={16} color={color} /></div>}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
      {sub && <span style={{ fontSize: 11, color: T.textMut, marginTop: 2, display: "block" }}>{sub}</span>}
    </div>
  );
}

/* ═══════════════════════ CONFIRM DIALOG ═══════════════════════ */
function ConfirmDlg({ open, title, message, confirmText, cancelText, variant, onConfirm, onCancel }) {
  const { T } = useTheme();
  if (!open) return null;
  const colors = {
    danger: { bg: T.dangerBg, color: T.danger, Ic: AlertTriangle },
    warn: { bg: T.warningBg, color: T.warning, Ic: AlertTriangle },
    info: { bg: T.infoBg, color: T.info, Ic: Info },
  };
  const c = colors[variant] || colors.danger;
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: 20, animation: "fadeIn 0.15s" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: 20, width: "100%", maxWidth: 400, padding: "32px 28px", border: `1px solid ${T.border}`, boxShadow: T.shadow, animation: "slideUp 0.2s", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <c.Ic size={28} color={c.color} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn v="ghost" full onClick={onCancel}>{cancelText || "Cancel"}</Btn>
          <Btn v={variant === "danger" ? "danger" : variant === "warn" ? "warn" : "primary"} full onClick={onConfirm}>{confirmText || "Confirm"}</Btn>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ TOAST SYSTEM ═══════════════════════ */
function ToastContainer({ toasts }) {
  const { T } = useTheme();
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 380, width: "calc(100% - 32px)", pointerEvents: "none" }}>
      {toasts.map(t => {
        const styles = {
          success: { bg: T.isDark ? 'rgba(22,163,74,0.15)' : 'rgba(22,163,74,0.08)', bd: T.success + '30', color: T.success, Ic: CheckCircle },
          error: { bg: T.isDark ? 'rgba(220,38,38,0.15)' : 'rgba(220,38,38,0.08)', bd: T.danger + '30', color: T.danger, Ic: XCircle },
          warning: { bg: T.isDark ? 'rgba(217,119,6,0.15)' : 'rgba(217,119,6,0.08)', bd: T.warning + '30', color: T.warning, Ic: AlertTriangle },
          info: { bg: T.isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)', bd: T.info + '30', color: T.info, Ic: Info },
        };
        const s = styles[t.type] || styles.success;
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: T.surface, border: `1px solid ${s.bd}`, boxShadow: T.shadow, animation: "toastIn 0.3s ease", pointerEvents: "auto" }}>
            <s.Ic size={20} color={s.color} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: T.text, lineHeight: 1.4 }}>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════ AUTH ═══════════════════════ */
function Auth({ onUnlock }) {
  const { T, theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState("detect");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [cur, setCur] = useState("\u20B9");
  const [attempts, setAttempts] = useState(0);
  const [wiped, setWiped] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!window.isSecureContext) {
      setErr("Warning: This page is not served over HTTPS. Encryption requires a secure context.");
    }
    (async () => {
      const att = await ST.get("wn:attempts");
      if (att && att >= MAX_ATTEMPTS) { await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts"); setWiped(true); setMode("setup"); return; }
      if (att) setAttempts(att);
      const h = await ST.get("wn:hash");
      setMode(h ? "login" : "setup");
    })();
  }, []);

  const doSetup = async () => {
    if (pw.length < 8) return setErr("Minimum 8 characters required");
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
          setErr("\u{1F6A8} SECURITY WIPE: " + MAX_ATTEMPTS + " failed attempts. All data destroyed.");
          setWiped(true); setMode("setup");
        } else {
          setErr("\u{1F512} Wrong password. " + (MAX_ATTEMPTS - newAtt) + " attempt" + (MAX_ATTEMPTS - newAtt !== 1 ? "s" : "") + " remaining before data wipe.");
        }
        setBusy(false); return;
      }
      const enc = await ST.get("wn:data");
      if (!enc) { setErr("No encrypted data found. Vault may have been reset."); setBusy(false); return; }
      try {
        const data = await CRY.dec(enc, pw);
        await ST.set("wn:attempts", 0);
        onUnlock(data, pw);
      } catch (e) {
        if (e.message === "TAMPER_DETECTED") {
          await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts");
          setErr("\u{1F6A8} TAMPER DETECTED: Data integrity check failed. Vault wiped for security.");
          setWiped(true); setMode("setup");
        } else throw e;
      }
    } catch (e) { if (!wiped) setErr("Decryption failed. Please try again."); }
    setBusy(false);
  };

  const doReset = async () => {
    await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts");
    setMode("setup"); setPw(""); setPw2(""); setErr(""); setConfirmReset(false); setWiped(false); setAttempts(0);
  };

  if (mode === "detect") return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: T.bg, flexDirection: "column", gap: 12 }}>
      <style>{getCSS(T)}</style>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s infinite" }}>
        <Shield size={20} color={T.accent} />
      </div>
      <p style={{ color: T.textMut, fontSize: 13 }}>Opening WealthNest...</p>
    </div>
  );

  const str = pw.length >= 12 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw) ? 4
    : pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? 3
    : pw.length >= 8 ? 2 : pw.length >= 4 ? 1 : 0;
  const strLabels = ["", "Weak", "Fair", "Strong", "Very Strong"];
  const strColors = ["", "#ef4444", "#f59e0b", "#22c55e", "#10b981"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bgGrad, padding: 20 }}>
      <style>{getCSS(T)}</style>

      {/* Theme toggle */}
      <div onClick={toggleTheme} style={{ position: "fixed", top: 16, right: 16, zIndex: 100, cursor: "pointer", padding: 10, borderRadius: 12, background: T.ghostBg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
        {T.isDark ? <Sun size={18} color={T.textSec} /> : <Moon size={18} color={T.textSec} />}
      </div>

      <div style={{ width: "100%", maxWidth: 420, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: "40px 32px", boxShadow: T.shadow }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 18px", background: `linear-gradient(135deg,${T.gradStart},${T.gradEnd})`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.accentBd}` }}>
            <ShieldCheck size={34} color={T.accent} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: -0.5 }}>WealthNest</h1>
          <p style={{ fontSize: 13, color: T.textSec, marginTop: 6 }}>
            {mode === "setup" ? "\u{1F512} Create your family\u2019s secure vault" : "\u{1F513} Unlock your family vault"}
          </p>
          <p style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>Private \u00B7 Encrypted \u00B7 Family Wealth Manager</p>
        </div>

        {wiped && (
          <div style={{ padding: "12px 14px", background: T.dangerBg, borderRadius: 12, marginBottom: 16, fontSize: 12, color: T.dangerTxt, display: "flex", alignItems: "flex-start", gap: 8, border: `1px solid ${T.danger}20` }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Previous vault data was wiped due to security policy. Create a new vault below.</span>
          </div>
        )}

        {mode === "setup" && (
          <div style={{ marginBottom: 18, padding: "14px 16px", borderRadius: 12, background: T.accentBg, border: `1px solid ${T.accentBd}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Fingerprint size={18} color={T.accent} style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6 }}>
              <strong style={{ color: T.accent }}>AES-256-GCM</strong> encryption with <strong style={{ color: T.accent }}>PBKDF2 600K</strong> iterations. Data integrity verified on every unlock. Auto-wipe after {MAX_ATTEMPTS} failed attempts.
            </p>
          </div>
        )}

        {mode === "login" && attempts > 0 && (
          <div style={{ padding: "10px 14px", background: T.warningBg, borderRadius: 12, marginBottom: 14, display: "flex", gap: 8, alignItems: "center", border: `1px solid ${T.warning}20` }}>
            <AlertTriangle size={16} color={T.warning} />
            <span style={{ fontSize: 12, color: T.warningTxt, fontWeight: 500 }}>{"\u26A0"} Failed attempts: {attempts}/{MAX_ATTEMPTS}</span>
          </div>
        )}

        <div style={{ position: "relative" }}>
          <Fld label={"\u{1F511} Master Password"} icon={Lock} type={show ? "text" : "password"} placeholder="Enter master password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && (mode === "login" ? doLogin() : null)} />
          <div onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: 30, padding: 4, cursor: "pointer", color: T.textMut }}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</div>
        </div>

        {mode === "setup" && (<>
          <Fld label={"\u{1F510} Confirm Password"} icon={Lock} type="password" placeholder="Re-enter password" value={pw2} onChange={e => { setPw2(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && doSetup()} />
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{"\u{1F4B1}"} Currency</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CURS.map(c => <div key={c} onClick={() => setCur(c)} style={{ padding: "7px 16px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", background: c === cur ? T.accentBg : T.ghostBg, border: c === cur ? `2px solid ${T.accent}` : `1px solid ${T.border}`, color: c === cur ? T.accent : T.textMut, transition: "all 0.15s" }}>{c}</div>)}
            </div>
          </div>
        </>)}

        {err && (
          <div style={{ padding: "10px 14px", background: T.dangerBg, borderRadius: 12, marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start", border: `1px solid ${T.danger}20` }}>
            <AlertTriangle size={15} color={T.danger} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: T.dangerTxt, lineHeight: 1.5 }}>{err}</span>
          </div>
        )}

        <Btn v="success" sz="lg" full onClick={mode === "setup" ? doSetup : doLogin} disabled={busy}>
          {busy ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "pulse 0.8s linear infinite" }} />
              Encrypting...
            </span>
          ) : mode === "setup" ? (
            <><ShieldCheck size={18} /> Create Family Vault</>
          ) : (
            <><Lock size={18} /> Unlock Vault</>
          )}
        </Btn>

        {mode === "setup" && pw.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= str ? strColors[str] : T.ghostBg, transition: "background 0.3s" }} />)}</div>
            <p style={{ fontSize: 11, color: strColors[str] || T.textMut, marginTop: 4, fontWeight: 500 }}>{strLabels[str]}</p>
            {str < 3 && pw.length >= 4 && (
              <p style={{ fontSize: 10, color: T.textMut, marginTop: 2 }}>
                Tip: Use 12+ characters with uppercase, numbers & symbols for maximum security
              </p>
            )}
          </div>
        )}

        {mode === "login" && (
          <p style={{ textAlign: "center", marginTop: 16 }}>
            <span onClick={() => setConfirmReset(true)} style={{ fontSize: 11, color: T.danger, cursor: "pointer", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>{"\u{1F5D1}"} Reset vault</span>
          </p>
        )}
      </div>

      <ConfirmDlg
        open={confirmReset}
        title="Reset Vault?"
        message="This will PERMANENTLY DELETE all encrypted data, including investments, bank accounts, and transaction history. This action cannot be undone."
        confirmText="Delete Everything"
        cancelText="Keep Data"
        variant="danger"
        onConfirm={doReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

/* ═══════════════════════ MAIN APP ═══════════════════════ */
function App_Main({ initialData, password, onLogout }) {
  const { T, theme, toggleTheme } = useTheme();
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
  const [confirmDlg, setConfirmDlg] = useState(null);
  const [toasts, setToasts] = useState([]);
  const lastActivity = useRef(Date.now());
  const cur = data.currency || "\u20B9";

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const askConfirm = useCallback((title, message, onYes, variant = "danger", confirmText, cancelText) => {
    setConfirmDlg({ title, message, onYes, variant, confirmText, cancelText });
  }, []);

  const CRD = { background: T.isDark ? 'rgba(255,255,255,0.025)' : '#ffffff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.cardShadow };

  // Session timeout
  useEffect(() => {
    const check = setInterval(() => {
      if (Date.now() - lastActivity.current > SESSION_TIMEOUT) { onLogout(); }
    }, 30000);
    const resetTimer = () => { lastActivity.current = Date.now(); };
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => { clearInterval(check); window.removeEventListener("click", resetTimer); window.removeEventListener("keydown", resetTimer); window.removeEventListener("touchstart", resetTimer); };
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
        try { new Notification("WealthNest - Maturity Alert", { body: inv.name + " matures in " + d + " day" + (d !== 1 ? "s" : "") + " (" + fm(inv.principal, cur) + ")" }); } catch {}
      }
    });
  }, [data.investments, cur]);

  const save = useCallback(async (newData) => {
    setSaving(true);
    const updated = { ...newData, lastModified: Date.now() };
    setData(updated);
    try {
      await ST.set("wn:data", await CRY.enc(updated, password));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); toast("Failed to save data", "error"); }
    setSaving(false);
  }, [password, toast]);

  // ── CRUD helpers ──
  const addInv = (inv) => { save({ ...data, investments: [...(data.investments || []), { ...inv, id: uid(), createdAt: Date.now() }] }); toast("\u{2705} Investment added successfully"); };
  const updInv = (id, upd) => { save({ ...data, investments: data.investments.map(i => i.id === id ? { ...i, ...upd, lastUpdated: Date.now() } : i) }); toast("\u{2705} Investment updated"); };
  const delInv = (id) => askConfirm("Delete Investment", "Are you sure you want to delete this investment? This action cannot be undone.", () => { save({ ...data, investments: data.investments.filter(i => i.id !== id) }); toast("\u{1F5D1} Investment deleted"); });
  const addBank = (b) => { save({ ...data, bankAccounts: [...(data.bankAccounts || []), { ...b, id: uid() }] }); toast("\u{2705} Bank account added"); };
  const updBank = (id, upd) => { save({ ...data, bankAccounts: data.bankAccounts.map(b => b.id === id ? { ...b, ...upd } : b) }); toast("\u{2705} Bank account updated"); };
  const delBank = (id) => askConfirm("Delete Bank Account", "Are you sure you want to delete this bank account? This action cannot be undone.", () => { save({ ...data, bankAccounts: data.bankAccounts.filter(b => b.id !== id) }); toast("\u{1F5D1} Bank account deleted"); });
  const addTx = (tx) => { save({ ...data, transactions: [{ ...tx, id: uid(), ts: Date.now() }, ...(data.transactions || [])] }); toast(tx.type === "income" ? "\u{1F4B0} Income recorded" : "\u{1F4B8} Expense recorded"); };
  const delTx = (id) => { save({ ...data, transactions: data.transactions.filter(t => t.id !== id) }); };

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
    invs.filter(i => i.status !== "closed").forEach(i => { m[i.type] = (m[i.type] || 0) + (i.currentValue || i.principal || 0); });
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
    toast("\u{1F4BE} Encrypted backup downloaded", "success");
  };

  const doImport = () => {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".json";
    inp.onchange = async e => {
      try {
        const dec = await CRY.dec(JSON.parse(await e.target.files[0].text()), password);
        askConfirm("Import Backup", "This will merge imported data with your existing vault. Duplicate records will be skipped. Continue?", async () => {
          const merged = { ...data };
          const eIds = new Set((merged.investments || []).map(i => i.id));
          (dec.investments || []).forEach(i => { if (!eIds.has(i.id)) merged.investments.push(i); });
          const bIds = new Set((merged.bankAccounts || []).map(b => b.id));
          (dec.bankAccounts || []).forEach(b => { if (!bIds.has(b.id)) merged.bankAccounts.push(b); });
          const tIds = new Set((merged.transactions || []).map(t => t.id));
          (dec.transactions || []).forEach(t => { if (!tIds.has(t.id)) merged.transactions.push(t); });
          save(merged); toast("\u{2705} Import successful! Data merged.", "success");
        }, "info", "Import Data", "Cancel");
      } catch { toast("\u{274C} Import failed. Wrong password or invalid file.", "error"); }
    }; inp.click();
  };

  const TABS = [
    { id: "overview", label: "Overview", Ic: Shield, emoji: "\u{1F3E0}" },
    { id: "investments", label: "Investments", Ic: TrendingUp, emoji: "\u{1F4C8}" },
    { id: "banks", label: "Bank Accounts", Ic: Wallet, emoji: "\u{1F3E6}" },
    { id: "nominees", label: "By Nominee", Ic: Users, emoji: "\u{1F465}" },
    { id: "maturity", label: "Maturity", Ic: Calendar, emoji: "\u{1F4C5}" },
    { id: "expenses", label: "Expenses", Ic: PiggyBank, emoji: "\u{1F4B8}" },
    { id: "settings", label: "Settings", Ic: Settings, emoji: "\u{2699}" }
  ];

  // ── Investment Form ──
  const InvForm = ({ initial, onSave, onCancel }) => {
    const [f, setF] = useState(initial || { type: "fd", name: "", institution: "", accountNo: "", principal: 0, currentValue: 0, interestRate: 0, startDate: "", maturityDate: "", nominee: "", notes: "", status: "active" });
    const u = (k, v) => setF(p => ({ ...p, [k]: v }));
    return (<>
      <Sel label={"\u{1F4CB} Investment Type"} value={f.type} onChange={e => u("type", e.target.value)}>
        {INV_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
      </Sel>
      <Fld label={"\u{270F} Name / Description"} value={f.name} onChange={e => u("name", e.target.value)} placeholder="e.g. SBI FD - 2 Year" />
      <Fld label={"\u{1F3E6} Institution / Bank"} value={f.institution} onChange={e => u("institution", e.target.value)} placeholder="e.g. State Bank of India" />
      <Fld label={"\u{1F4C4} Account / Folio Number"} value={f.accountNo} onChange={e => u("accountNo", e.target.value)} placeholder="Account number" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Fld label={"\u{1F4B0} Principal Amount"} icon={DollarSign} type="number" value={f.principal || ""} onChange={e => u("principal", parseFloat(e.target.value) || 0)} />
        <Fld label={"\u{1F4B5} Current Value"} icon={DollarSign} type="number" value={f.currentValue || ""} onChange={e => u("currentValue", parseFloat(e.target.value) || 0)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Fld label={"\u{1F4CA} Interest %"} type="number" value={f.interestRate || ""} onChange={e => u("interestRate", parseFloat(e.target.value) || 0)} placeholder="%" />
        <Fld label={"\u{1F4C5} Start Date"} type="date" value={f.startDate} onChange={e => u("startDate", e.target.value)} />
        <Fld label={"\u{1F4C5} Maturity Date"} type="date" value={f.maturityDate} onChange={e => u("maturityDate", e.target.value)} />
      </div>
      <Fld label={"\u{1F464} Nominee Name"} value={f.nominee} onChange={e => u("nominee", e.target.value)} placeholder="Full name of nominee" />
      <Sel label={"\u{1F4CC} Status"} value={f.status} onChange={e => u("status", e.target.value)}>
        <option value="active">{"\u{2705}"} Active</option><option value="matured">{"\u{1F4C5}"} Matured</option><option value="closed">{"\u{1F512}"} Closed / Redeemed</option>
      </Sel>
      <Fld label={"\u{1F4DD} Notes"} textarea value={f.notes} onChange={e => u("notes", e.target.value)} placeholder="Any additional details..." />
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Btn v="success" full onClick={() => onSave(f)}>
          <Check size={16} /> {initial ? "Update Investment" : "Add Investment"}
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
      <Fld label={"\u{1F3E6} Bank Name"} value={f.bankName} onChange={e => u("bankName", e.target.value)} placeholder="e.g. HDFC Bank" />
      <Fld label={"\u{1F4C4} Account Number"} value={f.accountNo} onChange={e => u("accountNo", e.target.value)} placeholder="Account number" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Sel label={"\u{1F4CB} Account Type"} value={f.type} onChange={e => u("type", e.target.value)}>
          {BANK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Sel>
        <Fld label={"\u{1F4B0} Balance"} icon={DollarSign} type="number" value={f.balance || ""} onChange={e => u("balance", parseFloat(e.target.value) || 0)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Fld label={"\u{1F4CD} Branch"} value={f.branch} onChange={e => u("branch", e.target.value)} placeholder="Branch name" />
        <Fld label={"\u{1F3F7} IFSC Code"} value={f.ifsc} onChange={e => u("ifsc", e.target.value)} placeholder="IFSC" />
      </div>
      <Fld label={"\u{1F464} Nominee"} value={f.nominee} onChange={e => u("nominee", e.target.value)} placeholder="Nominee name" />
      <Fld label={"\u{1F4DD} Notes"} textarea value={f.notes} onChange={e => u("notes", e.target.value)} placeholder="Additional details..." />
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Btn v="success" full onClick={() => onSave(f)}><Check size={16} /> {initial ? "Update Account" : "Add Account"}</Btn>
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
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: T.ghostBg, borderRadius: 12, padding: 4 }}>
        {["expense", "income"].map(t => <div key={t} onClick={() => { u("type", t); u("category", ""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, textTransform: "capitalize", textAlign: "center", cursor: "pointer", background: f.type === t ? (t === "expense" ? T.dangerBg : T.successBg) : "transparent", color: f.type === t ? (t === "expense" ? T.danger : T.success) : T.textMut, transition: "all 0.15s" }}>{t === "expense" ? "\u{1F4B8}" : "\u{1F4B0}"} {t}</div>)}
      </div>
      <Fld label={"\u{1F4B2} Amount"} icon={DollarSign} type="number" placeholder="0.00" value={f.amount} onChange={e => u("amount", e.target.value)} />
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{"\u{1F3F7}"} Category</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 6 }}>
          {cats.map(c => <div key={c.id} onClick={() => u("category", c.id)} style={{ padding: "9px 7px", borderRadius: 10, cursor: "pointer", border: f.category === c.id ? `2px solid ${c.color}` : `1px solid ${T.border}`, background: f.category === c.id ? T.expBg(c.color) : T.ghostBg, fontSize: 11, fontWeight: f.category === c.id ? 600 : 400, color: f.category === c.id ? (T.isDark ? "#fff" : c.color) : T.textSec, display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}><span style={{ fontSize: 14 }}>{c.icon}</span> {c.label}</div>)}
        </div>
      </div>
      <Fld label={"\u{1F4C5} Date"} icon={Calendar} type="date" value={f.date} onChange={e => u("date", e.target.value)} />
      <Fld label={"\u{1F4DD} Note"} icon={Tag} value={f.note} onChange={e => u("note", e.target.value)} placeholder="Details..." />
      <Btn v={f.type === "income" ? "success" : "danger"} full onClick={() => { if (f.amount && f.category) { onSave({ ...f, amount: parseFloat(f.amount) }); } else { toast("Please fill amount and category", "warning"); } }}>
        <Plus size={16} /> Add {f.type === "income" ? "Income" : "Expense"}
      </Btn>
    </>);
  };

  const NOM_COLORS = ["#3498DB", "#E74C3C", "#2ECC71", "#9B59B6", "#E67E22", "#1ABC9C", "#F1C40F", "#607D8B"];

  // Custom tooltip for charts
  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: T.tipBg, border: `1px solid ${T.tipBd}`, borderRadius: 10, padding: "10px 14px", boxShadow: T.shadow }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.tipTxt, marginBottom: 4 }}>{label || payload[0]?.name}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 12, color: T.tipTxt }}>{fm(p.value, cur)}</p>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, transition: "background 0.3s" }}>
      <style>{getCSS(T)}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: T.headerBg, backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.border}`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={17} color={T.accent} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>WealthNest</span>
          {saving && <Badge color={T.warning}>{"\u23F3"} Saving...</Badge>}
          {saved && !saving && <Badge color={T.success}>{"\u2705"} Encrypted</Badge>}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div onClick={() => setShowAlerts(!showAlerts)} style={{ position: "relative", cursor: "pointer", padding: 8, borderRadius: 10, background: alerts.length > 0 ? T.warningBg : "transparent" }}>
            <Bell size={17} color={alerts.length > 0 ? T.warning : T.textMut} />
            {alerts.length > 0 && <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />}
          </div>
          <div onClick={toggleTheme} style={{ cursor: "pointer", padding: 8, borderRadius: 10, background: T.ghostBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {T.isDark ? <Sun size={17} color={T.textSec} /> : <Moon size={17} color={T.textSec} />}
          </div>
          <Btn v="ghost" sz="sm" onClick={doExport}><Download size={14} /></Btn>
          <Btn v="ghost" sz="sm" onClick={doImport}><Upload size={14} /></Btn>
          <Btn v="ghost" sz="sm" onClick={onLogout} style={{ borderColor: T.danger + "30" }}><LogOut size={14} color={T.danger} /></Btn>
        </div>
      </header>

      {/* Maturity Alerts Dropdown */}
      {showAlerts && alerts.length > 0 && (
        <div style={{ background: T.warningBg, borderBottom: `1px solid ${T.warning}20`, padding: "14px 16px", animation: "slideDown 0.2s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.warningTxt }}>{"\u{1F514}"} Upcoming Maturities ({alerts.length})</span>
            <div onClick={() => setShowAlerts(false)} style={{ cursor: "pointer", color: T.textMut, padding: 4 }}><X size={16} /></div>
          </div>
          {alerts.map(inv => {
            const d = daysUntil(inv.maturityDate);
            const urgency = d <= 0 ? T.danger : d <= 7 ? T.warning : T.info;
            return (
              <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{inv.name}</span>
                  {inv.nominee && <span style={{ fontSize: 11, color: T.textMut, marginLeft: 8 }}>Nominee: {inv.nominee}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{fm(inv.principal, cur)}</span>
                  <Badge color={urgency}>{d <= 0 ? "MATURED" : d + "d left"}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <nav style={{ display: "flex", gap: 2, padding: "10px 16px", borderBottom: `1px solid ${T.border}`, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: tab === t.id ? 600 : 500, cursor: "pointer", background: tab === t.id ? T.accentBg : "transparent", color: tab === t.id ? T.accent : T.textSec, whiteSpace: "nowrap", transition: "all 0.15s", minHeight: 38, border: tab === t.id ? `1px solid ${T.accentBd}` : "1px solid transparent" }}>
            <span style={{ fontSize: 14 }}>{t.emoji}</span> {t.label}
            {t.id === "maturity" && alerts.length > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10, marginLeft: 2 }}>{alerts.length}</span>}
          </div>
        ))}
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 16px 60px" }}>

        {/* ════════ OVERVIEW ════════ */}
        {tab === "overview" && (<>
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 22 }}>
            <StatCard label={"\u{1F4BC} Total Portfolio"} value={fm(totalPortfolio, cur)} Icon={TrendingUp} color={T.success} bg={T.successBg} />
            <StatCard label={"\u{1F3E6} Bank Balance"} value={fm(totalBanks, cur)} Icon={Wallet} color={T.info} bg={T.infoBg} />
            <StatCard label={"\u{1F4B0} Total Wealth"} value={fm(totalPortfolio + totalBanks, cur)} Icon={ShieldCheck} color={T.accent} bg={T.accentBg} />
            <StatCard label={"\u{1F4CA} Active Investments"} value={String(invs.filter(i => i.status !== "closed").length)} sub={invs.filter(i => i.status === "closed").length + " closed"} Icon={FileText} color={T.warning} bg={T.warningBg} />
          </div>

          {alerts.length > 0 && (
            <div style={{ ...CRD, background: T.warningBg, borderColor: T.warning + "20", marginBottom: 18 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: T.warningTxt, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>{"\u{26A0}\u{FE0F}"} Investments Maturing Soon</h4>
              {alerts.slice(0, 5).map(inv => { const d = daysUntil(inv.maturityDate); return (
                <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
                  <span style={{ color: T.text }}>{invInfo(inv.type).icon} {inv.name} {inv.nominee && <span style={{ color: T.textMut }}>({inv.nominee})</span>}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: T.text, fontWeight: 500 }}>{fm(inv.principal, cur)}</span><Badge color={d <= 0 ? T.danger : d <= 7 ? T.warning : T.info}>{d <= 0 ? "MATURED" : d + " days"}</Badge></div>
                </div>
              ); })}
            </div>
          )}

          <div className="chart-grid" style={{ display: "grid", gridTemplateColumns: portfolioByType.length > 0 ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 18 }}>
            {portfolioByType.length > 0 && (
              <div style={CRD}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>{"\u{1F4CA}"} Portfolio by Type</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={portfolioByType} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">{portfolioByType.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
                  <Tooltip content={<ChartTooltip />} /></PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10 }}>{portfolioByType.map(c => (
                  <div key={c.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                    <span style={{ color: T.textSec, display: "flex", alignItems: "center", gap: 6 }}><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />{c.icon} {c.label}</span>
                    <span style={{ color: T.text, fontWeight: 500 }}>{fm(c.value, cur)}</span>
                  </div>
                ))}</div>
              </div>
            )}
            {portfolioByNominee.length > 0 && (
              <div style={CRD}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>{"\u{1F465}"} Wealth by Nominee</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={portfolioByNominee} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fill: T.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: T.chartLabel, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: T.cursor }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>{portfolioByNominee.map((e, i) => <Cell key={i} fill={NOM_COLORS[i % NOM_COLORS.length]} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {invs.length === 0 && banks.length === 0 && (
            <div style={{ ...CRD, textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u{1F3E6}"}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }}>Welcome to WealthNest</h3>
              <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, maxWidth: 360, margin: "0 auto 20px" }}>Start by adding your investments and bank accounts. Your data is encrypted with AES-256-GCM and never leaves your device.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <Btn onClick={() => { setTab("investments"); setModal("add-inv"); }}><Plus size={15} /> Add Investment</Btn>
                <Btn v="outline" onClick={() => { setTab("banks"); setModal("add-bank"); }}><Plus size={15} /> Add Bank Account</Btn>
              </div>
            </div>
          )}
        </>)}

        {/* ════════ INVESTMENTS ════════ */}
        {tab === "investments" && (<>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <Btn onClick={() => setModal("add-inv")}><Plus size={15} /> Add Investment</Btn>
            <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textMut }} />
              <input placeholder="Search investments..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: "100%", padding: "10px 12px 10px 34px", background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "10px 12px", background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 12, outline: "none" }}>
              <option value="all">All Types</option>
              {INV_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
            <select value={filterNominee} onChange={e => setFilterNominee(e.target.value)} style={{ padding: "10px 12px", background: T.inputBg, border: `1px solid ${T.inputBd}`, borderRadius: 10, color: T.inputTxt, fontSize: 12, outline: "none" }}>
              <option value="all">All Nominees</option>
              {nominees.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <p style={{ fontSize: 12, color: T.textSec, marginBottom: 12 }}>{"\u{1F4CB}"} {filteredInvs.length} investment{filteredInvs.length !== 1 ? "s" : ""} {"\u00B7"} Total: {fm(filteredInvs.filter(i => i.status !== "closed").reduce((s, i) => s + (i.currentValue || i.principal || 0), 0), cur)}</p>

          {filteredInvs.length === 0 ? (
            <div style={{ ...CRD, textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F4C8}"}</div>
              <p style={{ color: T.textSec, fontSize: 13 }}>No investments found. Add your first investment to get started.</p>
            </div>
          ) : filteredInvs.map(inv => {
            const ti = invInfo(inv.type);
            const d = inv.maturityDate ? daysUntil(inv.maturityDate) : null;
            return (
              <div key={inv.id} style={{ ...CRD, marginBottom: 12, borderColor: inv.status === "closed" ? T.border : d !== null && d <= 30 && d >= 0 ? T.warning + "30" : T.border, opacity: inv.status === "closed" ? 0.65 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 18 }}>{ti.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{inv.name || ti.label}</span>
                      <Badge color={ti.color}>{ti.label}</Badge>
                      {inv.status === "closed" && <Badge color={T.danger}>{"\u{1F512}"} Closed</Badge>}
                      {inv.status === "matured" && <Badge color={T.warning}>{"\u{1F4C5}"} Matured</Badge>}
                      {d !== null && d <= 30 && d > 0 && inv.status === "active" && <Badge color={T.warning}>{"\u{23F3}"} {d}d to maturity</Badge>}
                      {d !== null && d <= 0 && inv.status === "active" && <Badge color={T.danger}>{"\u{1F534}"} MATURED</Badge>}
                    </div>
                    <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.8 }}>
                      {inv.institution && <span>{inv.institution} {"\u00B7"} </span>}
                      {inv.accountNo && <span>A/C: {inv.accountNo} {"\u00B7"} </span>}
                      {inv.interestRate > 0 && <span>{inv.interestRate}% {"\u00B7"} </span>}
                      {inv.nominee && <span style={{ color: T.nominee }}>{"\u{1F464}"} {inv.nominee}</span>}
                    </div>
                    {inv.startDate && <div style={{ fontSize: 11, color: T.textMut, marginTop: 3 }}>{"\u{1F4C5}"} {fmDate(inv.startDate)}{inv.maturityDate ? " \u2192 " + fmDate(inv.maturityDate) : ""}</div>}
                    {inv.notes && <div style={{ fontSize: 11, color: T.textMut, marginTop: 3, fontStyle: "italic" }}>{"\u{1F4DD}"} {inv.notes}</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.success }}>{fm(inv.currentValue || inv.principal, cur)}</div>
                    {inv.currentValue && inv.principal && inv.currentValue !== inv.principal && (
                      <div style={{ fontSize: 11, color: inv.currentValue > inv.principal ? T.success : T.danger, fontWeight: 500 }}>
                        {inv.currentValue > inv.principal ? "\u{2B06}" : "\u{2B07}"} {inv.currentValue > inv.principal ? "+" : ""}{fm(inv.currentValue - inv.principal, cur)} ({((inv.currentValue - inv.principal) / inv.principal * 100).toFixed(1)}%)
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
                      <div onClick={() => { setEditItem(inv); setModal("edit-inv"); }} style={{ background: T.infoBg, borderRadius: 8, padding: 7, color: T.info, cursor: "pointer", display: "flex" }}><Edit size={14} /></div>
                      <div onClick={() => delInv(inv.id)} style={{ background: T.dangerBg, borderRadius: 8, padding: 7, color: T.danger, cursor: "pointer", display: "flex" }}><Trash2 size={14} /></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>)}

        {/* ════════ BANK ACCOUNTS ════════ */}
        {tab === "banks" && (<>
          <Btn onClick={() => setModal("add-bank")} style={{ marginBottom: 18 }}><Plus size={15} /> Add Bank Account</Btn>
          {banks.length === 0 ? (
            <div style={{ ...CRD, textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F3E6}"}</div>
              <p style={{ color: T.textSec, fontSize: 13 }}>No bank accounts added yet. Add your first bank account to track your balances.</p>
            </div>
          ) : banks.map(b => (
            <div key={b.id} style={{ ...CRD, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 18 }}>{"\u{1F3E6}"}</span> {b.bankName}</div>
                  <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.8 }}>
                    {"\u{1F4C4}"} A/C: {b.accountNo} {"\u00B7"} {b.type}
                    {b.branch && <span> {"\u00B7"} {"\u{1F4CD}"} {b.branch}</span>}
                    {b.ifsc && <span> {"\u00B7"} IFSC: {b.ifsc}</span>}
                    {b.nominee && <span> {"\u00B7"} <span style={{ color: T.nominee }}>{"\u{1F464}"} {b.nominee}</span></span>}
                  </div>
                  {b.notes && <div style={{ fontSize: 11, color: T.textMut, marginTop: 3, fontStyle: "italic" }}>{"\u{1F4DD}"} {b.notes}</div>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.info }}>{fm(b.balance, cur)}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
                    <div onClick={() => { setEditItem(b); setModal("edit-bank"); }} style={{ background: T.infoBg, borderRadius: 8, padding: 7, color: T.info, cursor: "pointer", display: "flex" }}><Edit size={14} /></div>
                    <div onClick={() => delBank(b.id)} style={{ background: T.dangerBg, borderRadius: 8, padding: 7, color: T.danger, cursor: "pointer", display: "flex" }}><Trash2 size={14} /></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>)}

        {/* ════════ BY NOMINEE ════════ */}
        {tab === "nominees" && (<>
          {nominees.length === 0 ? (
            <div style={{ ...CRD, textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F465}"}</div>
              <p style={{ color: T.textSec, fontSize: 13 }}>No nominees found. Add nominees when creating investments or bank accounts.</p>
            </div>
          ) : nominees.map((nom, ni) => {
            const nInvs = invs.filter(i => i.nominee === nom && i.status !== "closed");
            const nBanks = banks.filter(b => b.nominee === nom);
            const total = nInvs.reduce((s, i) => s + (i.currentValue || i.principal || 0), 0) + nBanks.reduce((s, b) => s + (b.balance || 0), 0);
            const nc = NOM_COLORS[ni % NOM_COLORS.length];
            return (
              <div key={nom} style={{ ...CRD, marginBottom: 14, borderColor: nc + "30" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: nc + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: nc }}>{nom[0]}</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{nom}</div>
                      <div style={{ fontSize: 12, color: T.textSec }}>{nInvs.length} investment{nInvs.length !== 1 ? "s" : ""} {"\u00B7"} {nBanks.length} bank account{nBanks.length !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: nc }}>{fm(total, cur)}</div>
                </div>
                {nInvs.map(inv => (
                  <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${T.border}`, fontSize: 12 }}>
                    <span style={{ color: T.textSoft }}>{invInfo(inv.type).icon} {inv.name || invInfo(inv.type).label} <span style={{ color: T.textMut }}>({inv.institution})</span></span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: T.text, fontWeight: 500 }}>{fm(inv.currentValue || inv.principal, cur)}</span>
                      {inv.maturityDate && <Badge color={daysUntil(inv.maturityDate) <= 30 ? T.warning : T.textMut}>{fmDate(inv.maturityDate)}</Badge>}
                    </div>
                  </div>
                ))}
                {nBanks.map(b => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${T.border}`, fontSize: 12 }}>
                    <span style={{ color: T.textSoft }}>{"\u{1F3E6}"} {b.bankName} ({b.type})</span>
                    <span style={{ color: T.text, fontWeight: 500 }}>{fm(b.balance, cur)}</span>
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
            const Section = ({ title, items, color, emoji }) => items.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>{emoji} {title} <span style={{ fontSize: 12, fontWeight: 400, color: T.textSec }}>({items.length})</span></h4>
                {items.map(inv => { const d = daysUntil(inv.maturityDate); return (
                  <div key={inv.id} style={{ ...CRD, padding: "14px 18px", marginBottom: 8, borderColor: color + "25" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{invInfo(inv.type).icon} {inv.name}</span>
                        <div style={{ fontSize: 12, color: T.textSec, marginTop: 3 }}>{inv.institution} {inv.nominee && <span>{"\u00B7"} <span style={{ color: T.nominee }}>{"\u{1F464}"} {inv.nominee}</span></span>}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: T.success }}>{fm(inv.principal, cur)}</div>
                        <div style={{ fontSize: 11, color, fontWeight: 500, marginTop: 2 }}>{"\u{1F4C5}"} {fmDate(inv.maturityDate)} {d >= 0 ? "(" + d + "d)" : "(" + Math.abs(d) + "d overdue)"}</div>
                      </div>
                    </div>
                  </div>
                ); })}
              </div>
            );
            return (<>
              {activeInvs.length === 0 && (
                <div style={{ ...CRD, textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F4C5}"}</div>
                  <p style={{ color: T.textSec, fontSize: 13 }}>No investments with maturity dates.</p>
                </div>
              )}
              <Section title="Overdue / Already Matured" items={past} color={T.danger} emoji={"\u{1F534}"} />
              <Section title="Maturing Within 30 Days" items={soon} color={T.warning} emoji={"\u{1F7E0}"} />
              <Section title="Maturing in 1\u20133 Months" items={upcoming} color={T.info} emoji={"\u{1F535}"} />
              <Section title="Maturing Later" items={later} color={T.success} emoji={"\u{1F7E2}"} />
            </>);
          })()}
        </>)}

        {/* ════════ EXPENSES ════════ */}
        {tab === "expenses" && (<>
          <Btn onClick={() => setModal("add-tx")} style={{ marginBottom: 16 }}><Plus size={15} /> Add Transaction</Btn>
          {(() => {
            const cm = mk(new Date());
            const mt = txns.filter(t => mk(t.date) === cm);
            const inc = mt.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
            const exp2 = mt.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
            return (<>
              <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label={"\u{1F4B0} Month Income"} value={fm(inc, cur)} color={T.success} bg={T.successBg} />
                <StatCard label={"\u{1F4B8} Month Expenses"} value={fm(exp2, cur)} color={T.danger} bg={T.dangerBg} />
                <StatCard label={"\u{1F4CA} Net"} value={fm(inc - exp2, cur)} color={inc - exp2 >= 0 ? T.success : T.danger} bg={inc - exp2 >= 0 ? T.successBg : T.dangerBg} />
              </div>
              <div style={CRD}>
                {txns.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "36px 20px" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{"\u{1F4B8}"}</div>
                    <p style={{ color: T.textSec, fontSize: 13 }}>No transactions yet. Start tracking your income and expenses.</p>
                  </div>
                ) : txns.slice(0, 30).map(tx => { const c = catInfo(tx.category, tx.type); return (
                  <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: T.tagBg(c.color), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{c.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: T.textMut }}>{tx.note ? tx.note + " \u00B7 " : ""}{tx.date}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: tx.type === "income" ? T.success : T.danger }}>{tx.type === "income" ? "+" : "\u2212"}{fm(tx.amount, cur)}</span>
                      <div onClick={() => delTx(tx.id)} style={{ background: T.dangerBg, borderRadius: 7, padding: 5, color: T.danger, cursor: "pointer", display: "flex" }}><Trash2 size={12} /></div>
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
            <h4 style={{ fontSize: 14, fontWeight: 600, color: T.textSec, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>{"\u{1F512}"} Security Overview</h4>
            {[
              ["\u{1F510} Encryption", "AES-256-GCM", T.success],
              ["\u{1F511} Key Derivation", "PBKDF2 (600K iterations)", T.success],
              ["\u{1F6E1} Integrity Check", "SHA-256 on every unlock", T.success],
              ["\u{1F4A3} Auto-Wipe", MAX_ATTEMPTS + " failed attempts", T.warning],
              ["\u{23F1} Session Timeout", "15 min inactivity", T.warning],
              ["\u{1F4B1} Currency", cur, T.text],
              ["\u{1F4BC} Investments", String(invs.length), T.text],
              ["\u{1F3E6} Bank Accounts", String(banks.length), T.text]
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${T.border}` }}>
                <span style={{ color: T.textSec }}>{k}</span>
                <span style={{ color: c, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ ...CRD, marginTop: 16, background: T.accentBg, borderColor: T.accentBd, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <ShieldCheck size={20} color={T.accent} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.7 }}>
              <strong style={{ color: T.accent }}>{"\u{1F6E1}"} Zero-Knowledge Architecture:</strong> Your master password is never stored. Data integrity is verified with SHA-256 on every unlock. Any modification to encrypted data triggers automatic wipe. {MAX_ATTEMPTS} wrong passwords permanently wipes everything. Session auto-locks after 15 minutes of inactivity.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn v="outline" full onClick={doExport}><Download size={16} /> {"\u{1F4BE}"} Export Backup</Btn>
            <Btn v="outline" full onClick={doImport}><Upload size={16} /> {"\u{1F4E5}"} Import Backup</Btn>
          </div>

          <Btn v="danger" full onClick={() => askConfirm(
            "Emergency Wipe",
            "This will PERMANENTLY DELETE all encrypted data including investments, bank accounts, and transaction history. This action cannot be undone.",
            async () => { await ST.del("wn:hash"); await ST.del("wn:data"); await ST.del("wn:attempts"); onLogout(); },
            "danger",
            "\u{1F4A3} Wipe All Data",
            "Keep Data"
          )} style={{ marginTop: 12 }}><Trash2 size={16} /> {"\u{1F4A3}"} Emergency Wipe</Btn>
        </>)}
      </main>

      {/* ═══════════════ MODALS ═══════════════ */}
      <Mdl open={modal === "add-inv"} onClose={() => setModal(null)} title="Add Investment" mw="560px" icon={Plus} iconColor={T.success}>
        <InvForm onSave={inv => { addInv(inv); setModal(null); }} onCancel={() => setModal(null)} />
      </Mdl>
      <Mdl open={modal === "edit-inv"} onClose={() => { setModal(null); setEditItem(null); }} title="Edit Investment" mw="560px" icon={Edit} iconColor={T.info}>
        {editItem && <InvForm initial={editItem} onSave={inv => { updInv(editItem.id, inv); setModal(null); setEditItem(null); }} onCancel={() => { setModal(null); setEditItem(null); }} />}
      </Mdl>
      <Mdl open={modal === "add-bank"} onClose={() => setModal(null)} title="Add Bank Account" icon={Plus} iconColor={T.success}>
        <BankForm onSave={b => { addBank(b); setModal(null); }} onCancel={() => setModal(null)} />
      </Mdl>
      <Mdl open={modal === "edit-bank"} onClose={() => { setModal(null); setEditItem(null); }} title="Edit Bank Account" icon={Edit} iconColor={T.info}>
        {editItem && <BankForm initial={editItem} onSave={b => { updBank(editItem.id, b); setModal(null); setEditItem(null); }} onCancel={() => { setModal(null); setEditItem(null); }} />}
      </Mdl>
      <Mdl open={modal === "add-tx"} onClose={() => setModal(null)} title="Add Transaction" icon={Plus} iconColor={T.success}>
        <TxForm onSave={tx => { addTx(tx); setModal(null); }} onCancel={() => setModal(null)} />
      </Mdl>

      {/* Confirm Dialog */}
      <ConfirmDlg
        open={!!confirmDlg}
        title={confirmDlg?.title}
        message={confirmDlg?.message}
        confirmText={confirmDlg?.confirmText}
        cancelText={confirmDlg?.cancelText}
        variant={confirmDlg?.variant}
        onConfirm={() => { confirmDlg?.onYes(); setConfirmDlg(null); }}
        onCancel={() => setConfirmDlg(null)}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ═══════════════════════ ROOT ═══════════════════════ */
export default function App() {
  const [s, setS] = useState({ p: "auth" });
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("wn:theme") || "dark"; } catch { return "dark"; }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem("wn:theme", next); } catch {}
      return next;
    });
  }, []);

  const T = THEMES[theme] || THEMES.dark;

  const handleLogout = useCallback(() => {
    setS({ p: "auth" });
  }, []);

  return (
    <ThemeCtx.Provider value={{ T, theme, toggleTheme }}>
      {s.p === "auth"
        ? <Auth onUnlock={(d, pw) => setS({ p: "app", d, pw })} />
        : <App_Main initialData={s.d} password={s.pw} onLogout={handleLogout} />
      }
    </ThemeCtx.Provider>
  );
}
