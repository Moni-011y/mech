import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const GdtIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <rect x="2" y="8" width="28" height="16" rx="2" />
    <line x1="9" y1="8" x2="9" y2="24" />
    <line x1="18" y1="8" x2="18" y2="24" />
    <line x1="24" y1="8" x2="24" y2="24" />
    <circle cx="5.5" cy="16" r="1.5" />
    <circle cx="13.5" cy="16" r="2.5" />
    <line x1="13.5" y1="13.5" x2="13.5" y2="18.5" />
    <line x1="11" y1="16" x2="16" y2="16" />
  </svg>
);

const ToleranceIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <line x1="16" y1="3" x2="16" y2="29" />
    <line x1="8" y1="3" x2="24" y2="3" />
    <line x1="10" y1="29" x2="22" y2="29" />
    <line x1="5" y1="16" x2="11" y2="16" strokeDasharray="2 2" />
    <circle cx="16" cy="16" r="2.5" fill="currentColor" fillOpacity="0.2" />
    <line x1="20" y1="10" x2="27" y2="10" />
    <line x1="20" y1="22" x2="27" y2="22" />
    <line x1="23" y1="10" x2="23" y2="22" strokeDasharray="3 2" />
  </svg>
);

const STANDARDS_MENU = [
  {
    id: 'gdt',
    title: 'GD&T FUNDAMENTALS',
    link: '/standards/gdt',
    desc: 'Geometric Dimensioning & Tolerancing — Symbols, Datums, Feature Control Frames, 3D Viz Lab',
    detail: '15 Symbols · Datums · FCF Builder · 3D Interactive Lab',
    Icon: GdtIcon,
  },
  {
    id: 'tolerance',
    title: 'TOLERANCE',
    link: '/standards/tolerance',
    desc: 'Dimensional Limits, Fits, Clearance & Interference — Interactive Shaft & Hole 3D Lab',
    detail: 'Limits · Fits · Clearance · Interference · 3D Shaft/Hole',
    Icon: ToleranceIcon,
  },
];

interface StandardsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export default function StandardsDropdown({ isOpen, onClose, onToggle }: StandardsDropdownProps) {
  const location = useLocation();
  const [lineAnim, setLineAnim] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLineAnim(false);
      const t = setTimeout(() => setLineAnim(true), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const isActiveRoute = location.pathname.startsWith('/standards');

  return (
    <div className="relative" ref={menuRef} onMouseEnter={() => { if (!isOpen) onToggle(); }}>
      <button
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent ${
          isOpen || isActiveRoute
            ? 'bg-accent text-background shadow-md shadow-accent/20'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
        }`}
      >
        STANDARDS
        <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          onMouseLeave={onClose}
          className="absolute left-1/2 top-full mt-2 w-[480px] bg-[#0D1117] border border-border/80 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{
            transform: 'translateX(-50%)',
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(22,184,166,0.06) 0%, transparent 50%)',
          }}
        >
          {/* Blueprint sweep header */}
          <div className="relative px-4 py-3 border-b border-border/60 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(22,184,166,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,184,166,0.08) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                transform: lineAnim ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.4s ease-out',
              }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                  INDUSTRIAL STANDARDS
                </span>
              </div>
              <span className="text-[9px] font-mono text-text-secondary">ISO · ASME · DIN</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-3 space-y-2">
            {STANDARDS_MENU.map((item) => {
              const isActive = location.pathname.startsWith(item.link);
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  onClick={onClose}
                  role="menuitem"
                  className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-accent ${
                    isActive
                      ? 'bg-accent/10 border-accent/60 shadow-md'
                      : 'bg-surface/30 border-transparent hover:bg-surface hover:border-accent/40'
                  }`}
                >
                  {/* Technical Line Icon */}
                  <div
                    className={`shrink-0 p-2 rounded-lg border transition ${
                      isActive
                        ? 'bg-accent/20 border-accent/60 text-accent'
                        : 'bg-surface-elevated border-border text-text-secondary group-hover:border-accent/40 group-hover:text-accent'
                    }`}
                  >
                    <item.Icon />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm font-black tracking-wider transition ${
                          isActive ? 'text-accent' : 'text-text-primary group-hover:text-accent'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`text-xs font-mono transition-transform duration-150 shrink-0 ${
                          isActive
                            ? 'translate-x-1 text-accent'
                            : 'text-text-secondary group-hover:translate-x-1 group-hover:text-accent'
                        }`}
                      >
                        →
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      {item.detail}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer disclaimer */}
          <div className="px-4 py-2 border-t border-border/40 text-[9px] font-mono text-text-secondary/50 text-center">
            Educational visualization — verify production requirements against the applicable engineering drawing & standard.
          </div>
        </div>
      )}
    </div>
  );
}
