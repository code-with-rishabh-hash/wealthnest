export function getCSS(T) {
    return `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
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
}
//# sourceMappingURL=css-generator.js.map