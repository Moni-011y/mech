import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export interface TopicMenuItem {
  id: string;
  title: string;
  link: string;
  icon?: string;
  badge?: string;
  desc?: string;
  children?: TopicMenuItem[];
}

export const TOPICS_MENU_TREE: TopicMenuItem[] = [
  {
    id: 'engineering-drafting',
    title: 'ENGINEERING DRAFTING',
    link: '/topics/engineering-drafting',
    icon: '📐',
    desc: 'Orthographic, Isometric, Sectional, Detail & Assembly Drawings',
  },
  {
    id: 'bom',
    title: 'BILL OF MATERIALS',
    link: '/topics/bom',
    icon: '📋',
    desc: 'BOM Hierarchy, EBOM, MBOM & Service Documentation',
    children: [
      {
        id: 'bom-types',
        title: 'TYPES',
        link: '/topics/bom/types',
        desc: 'EBOM, MBOM, Single-Level & Multi-Level BOMs',
      },
      {
        id: 'bom-standards',
        title: 'STANDARDS',
        link: '/topics/bom/standards',
        desc: 'ISO 7573 & ASME Y14.34 BOM Formatting Rules',
      },
    ],
  },
  {
    id: 'title-block',
    title: 'TITLE BLOCK',
    link: '/topics/title-block',
    icon: '📄',
    desc: 'ISO 7200 / ASME Y14.1 Technical Drawing Title Block Studio',
  },
  {
    id: 'engineering-analysis',
    title: 'ENGINEERING ANALYSIS',
    link: '/topics/engineering-analysis',
    icon: '📈',
    desc: 'FEA Stress Heatmaps, Factor of Safety & Kinematics',
  },
  {
    id: 'gears',
    title: 'GEARS',
    link: '/topics/gears',
    icon: '⚙️',
    desc: 'Comprehensive Gear Engineering, Tooth Mechanics & Calculations',
    children: [
      {
        id: 'gears-terminology',
        title: 'TERMINOLOGY',
        link: '/topics/gears/terminology',
        desc: 'Module, Pitch Dia, Addendum, Dedendum, Pressure Angle',
      },
      {
        id: 'gears-types',
        title: 'TYPES',
        link: '/topics/gears/types',
        desc: '6 Industrial Gear Geometry Types',
        children: [
          { id: 'spur-gear', title: 'SPUR GEAR', link: '/topics/gears/types/spur', desc: 'Parallel shaft power transmission' },
          { id: 'helical-gear', title: 'HELICAL GEAR', link: '/topics/gears/types/helical', desc: 'High-speed, low-noise angled teeth' },
          { id: 'bevel-gear', title: 'BEVEL GEAR', link: '/topics/gears/types/bevel', desc: 'Intersecting 90° shaft transmission' },
          { id: 'worm-gear', title: 'WORM GEAR', link: '/topics/gears/types/worm', desc: 'High gear ratio self-locking drive' },
          { id: 'rack-and-pinion', title: 'RACK AND PINION', link: '/topics/gears/types/rack-and-pinion', desc: 'Rotary to linear motion transformation' },
          { id: 'internal-gear', title: 'INTERNAL GEAR', link: '/topics/gears/types/internal', desc: 'Planetary gear set ring configuration' },
        ],
      },
      {
        id: 'gears-selection',
        title: 'GEAR SELECTION',
        link: '/topics/gears/selection',
        desc: 'Application-based gear type & material selection',
      },
      {
        id: 'gears-ratio',
        title: 'GEAR RATIO',
        link: '/topics/gears/ratio',
        desc: 'Speed reduction & torque multiplication formulas',
      },
      {
        id: 'gears-speed-calculation',
        title: 'SPEED CALCULATION',
        link: '/topics/gears/speed-calculation',
        desc: 'RPM, Pitch Line Velocity (v), Transmission Output',
      },
      {
        id: 'gears-module',
        title: 'MODULE',
        link: '/topics/gears/module',
        desc: 'Module (m = d/Z) sizing & ISO pitch standards',
      },
      {
        id: 'gears-manual-calculation',
        title: 'MANUAL CALCULATION',
        link: '/topics/gears/calculation',
        desc: 'Step-by-step gear design calculations',
        children: [
          { id: 'pair-and-other-gears', title: 'PAIR AND OTHER GEARS', link: '/topics/gears/calculation/pair-and-other-gears', desc: 'Mating gear center distance & backlash' },
          { id: 'gear-calculations', title: 'GEAR CALCULATIONS', link: '/topics/gears/calculation/calculations', desc: 'Lewis Bending Stress & Contact Fatigue' },
        ],
      },
      {
        id: 'gears-how-to-draw',
        title: 'HOW TO DRAW',
        link: '/topics/gears/how-to-draw',
        desc: '2D Involute tooth profile drafting procedure',
      },
      {
        id: 'gears-reverse-engineering',
        title: 'REVERSE ENGINEERING',
        link: '/topics/gears/reverse-engineering',
        desc: 'Gear measurement & CAD replacement workflow',
        children: [
          { id: 're-workflow', title: 'WORKFLOW', link: '/topics/gears/reverse-engineering/workflow', desc: 'Physical gear sampling to CNC production' },
          { id: 're-procedure', title: 'PROCEDURE', link: '/topics/gears/reverse-engineering/procedure', desc: 'Span measurement & pin over wire micrometer' },
          { id: 're-drawing-req', title: 'DRAWING REQUIREMENTS', link: '/topics/gears/reverse-engineering/drawing-requirements', desc: 'Gear data table & GD&T runout callouts' },
        ],
      },
    ],
  },
  {
    id: 'sheet-metal',
    title: 'SHEET METAL',
    link: '/topics/sheet-metal',
    icon: '✂️',
    badge: 'COMING SOON',
    desc: 'K-Factor, Bend Allowance, Flat Pattern & Press Brake',
  },
];

interface TopicsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export default function TopicsMegaMenu({ isOpen, onClose, onToggle }: TopicsMegaMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop active submenu state - both start null so ONLY main dropdown opens first!
  const [activeLevel1, setActiveLevel1] = useState<string | null>(null);
  const [activeLevel2, setActiveLevel2] = useState<string | null>(null);

  // Mobile accordion state - starts null so only main options show first
  const [mobileExpanded1, setMobileExpanded1] = useState<string | null>(null);
  const [mobileExpanded2, setMobileExpanded2] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset opened sub-dropdowns whenever the menu closes
  useEffect(() => {
    if (!isOpen) {
      setActiveLevel1(null);
      setActiveLevel2(null);
      setMobileExpanded1(null);
      setMobileExpanded2(null);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle clicking an option in the Main Dropdown (Level 1)
  const handleL1Click = (item: TopicMenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren) {
      // Toggle or open the sub-dropdown box for this option
      if (activeLevel1 === item.id) {
        setActiveLevel1(null);
        setActiveLevel2(null);
      } else {
        setActiveLevel1(item.id);
        setActiveLevel2(null);
      }
    } else {
      // Direct topic link - navigate & close
      navigate(item.link);
      onClose();
    }
  };

  // Handle clicking an option in the Sub Dropdown (Level 2)
  const handleL2Click = (sub: TopicMenuItem) => {
    const hasChildren = sub.children && sub.children.length > 0;
    if (hasChildren) {
      // Toggle or open the sub-sub-dropdown box for this sub-option
      if (activeLevel2 === sub.id) {
        setActiveLevel2(null);
      } else {
        setActiveLevel2(sub.id);
      }
    } else {
      // Direct subtopic link - navigate & close
      navigate(sub.link);
      onClose();
    }
  };

  // Find currently selected level items
  const currentL1 = TOPICS_MENU_TREE.find((item) => item.id === activeLevel1);
  const currentL2 = currentL1?.children?.find((item) => item.id === activeLevel2);

  return (
    <div className="relative" ref={containerRef}>
      {/* Top Bar Trigger Button */}
      <button
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        role="menuitem"
        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent ${
          isOpen || location.pathname.startsWith('/topics')
            ? 'bg-accent text-background shadow-md shadow-accent/20 font-black'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
        }`}
      >
        TOPICS
        <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* DESKTOP CASCADING DROPDOWNS (Hidden on Mobile) */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Topics Menu"
          onMouseLeave={onClose}
          className="hidden lg:flex items-start absolute left-0 top-full mt-1.5 z-50 animate-in fade-in duration-150"
        >
          {/* ═══════════════════════════════════════════════════
              BOX 1: MAIN DROPDOWN BOX (OPENS FIRST)
              ═══════════════════════════════════════════════════ */}
          <div className="w-80 sm:w-84 bg-[#0D1117]/95 border border-border/80 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl shrink-0">
            {/* Header */}
            <div className="px-3 py-1.5 mb-1.5 border-b border-border/50 flex items-center justify-between text-[10px] font-mono uppercase text-text-secondary">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                TOPICS MENU
              </span>
              <span className="text-[9px] text-accent/80 font-mono">
                Click option to expand
              </span>
            </div>

            {/* Main Options */}
            <div className="space-y-1 max-h-[75vh] overflow-y-auto pr-0.5">
              {TOPICS_MENU_TREE.map((item) => {
                const isSelected = activeLevel1 === item.id;
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleL1Click(item)}
                    role="menuitem"
                    aria-haspopup={hasChildren ? 'true' : 'false'}
                    aria-expanded={isSelected}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-surface border-accent/60 text-text-primary shadow-lg ring-1 ring-accent/40'
                        : 'bg-surface/30 border-transparent hover:bg-surface/70 text-text-secondary hover:text-text-primary hover:border-border/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <span className="text-base shrink-0 p-1.5 rounded-lg bg-surface-elevated/80 border border-border/50">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-accent' : 'group-hover:text-accent'}`}>
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-text-secondary truncate mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    {/* Expand indicator for items with sub-options */}
                    {hasChildren && (
                      <div
                        className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md border shrink-0 transition-all ${
                          isSelected
                            ? 'bg-accent/20 border-accent/50 text-accent font-bold'
                            : 'bg-surface/60 border-border/40 text-text-secondary group-hover:text-accent group-hover:border-accent/40'
                        }`}
                      >
                        <span className="text-[9px]">SUB</span>
                        <span className={`transition-transform duration-150 ${isSelected ? 'translate-x-0.5 font-bold' : ''}`}>›</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              BOX 2: SUB DROPDOWN BOX (OPENS AFTER CLICKING OPTION)
              ═══════════════════════════════════════════════════ */}
          {currentL1?.children && currentL1.children.length > 0 && (
            <div className="ml-2 w-80 sm:w-88 bg-[#0D1117]/95 border border-border/80 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl shrink-0 animate-in fade-in slide-in-from-left-2 duration-150">
              {/* Header */}
              <div className="px-3 py-1.5 mb-1.5 border-b border-border/50 flex items-center justify-between text-[10px] font-mono uppercase text-text-secondary">
                <div className="flex items-center gap-1.5 font-bold text-accent truncate">
                  <span>{currentL1.icon}</span>
                  <span className="truncate">{currentL1.title}</span>
                </div>
                <Link
                  to={currentL1.link}
                  onClick={onClose}
                  className="text-[9px] text-accent hover:underline lowercase font-mono shrink-0 ml-2 bg-accent/10 px-2 py-0.5 rounded border border-accent/30"
                >
                  view all →
                </Link>
              </div>

              {/* Sub-Options List */}
              <div className="space-y-1 max-h-[75vh] overflow-y-auto pr-0.5">
                {currentL1.children.map((sub) => {
                  const isSelected = activeLevel2 === sub.id;
                  const hasChildren = sub.children && sub.children.length > 0;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleL2Click(sub)}
                      role="menuitem"
                      aria-haspopup={hasChildren ? 'true' : 'false'}
                      aria-expanded={isSelected}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-surface border-accent/60 text-text-primary shadow-lg ring-1 ring-accent/40'
                          : 'bg-surface/30 border-transparent hover:bg-surface/70 text-text-secondary hover:text-text-primary hover:border-border/60'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className={`text-xs font-bold transition-colors ${isSelected ? 'text-accent' : 'text-text-primary group-hover:text-accent'}`}>
                          {sub.title}
                        </div>
                        {sub.desc && (
                          <p className="text-[10px] text-text-secondary truncate mt-0.5">{sub.desc}</p>
                        )}
                      </div>

                      {hasChildren ? (
                        <div
                          className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md border shrink-0 transition-all ${
                            isSelected
                              ? 'bg-accent/20 border-accent/50 text-accent font-bold'
                              : 'bg-surface/60 border-border/40 text-text-secondary group-hover:text-accent group-hover:border-accent/40'
                          }`}
                        >
                          <span className="text-[9px]">TYPES</span>
                          <span className={`transition-transform duration-150 ${isSelected ? 'translate-x-0.5 font-bold' : ''}`}>›</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-secondary/60 group-hover:text-accent font-mono transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              BOX 3: 3RD LEVEL SUB DROPDOWN BOX (OPENS AFTER CLICKING SUB-OPTION)
              ═══════════════════════════════════════════════════ */}
          {currentL2?.children && currentL2.children.length > 0 && (
            <div className="ml-2 w-72 sm:w-80 bg-[#0D1117]/95 border border-border/80 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl shrink-0 animate-in fade-in slide-in-from-left-2 duration-150">
              {/* Header */}
              <div className="px-3 py-1.5 mb-1.5 border-b border-border/50 flex items-center justify-between text-[10px] font-mono uppercase text-text-secondary">
                <span className="font-bold text-accent truncate">{currentL2.title}</span>
                <Link
                  to={currentL2.link}
                  onClick={onClose}
                  className="text-[9px] text-accent hover:underline lowercase font-mono shrink-0 ml-2 bg-accent/10 px-2 py-0.5 rounded border border-accent/30"
                >
                  overview →
                </Link>
              </div>

              {/* 3rd Level Options */}
              <div className="space-y-1 max-h-[75vh] overflow-y-auto pr-0.5">
                {currentL2.children.map((child) => {
                  const isActive = location.pathname === child.link;

                  return (
                    <Link
                      key={child.id}
                      to={child.link}
                      onClick={onClose}
                      role="menuitem"
                      className={`p-2.5 rounded-xl border transition-all block group ${
                        isActive
                          ? 'bg-accent/15 border-accent text-accent font-bold'
                          : 'bg-surface/30 hover:bg-surface/80 border-transparent hover:border-accent/40 text-text-primary'
                      }`}
                    >
                      <div className="text-xs font-bold group-hover:text-accent transition flex items-center justify-between">
                        <span>{child.title}</span>
                        <span className="text-[11px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                      {child.desc && (
                        <p className="text-[10px] text-text-secondary truncate mt-0.5">{child.desc}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOBILE ACCORDION (Shown on Mobile when Menu is Open) */}
      {isOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-full mt-2 bg-[#0D1117] border border-border rounded-xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in duration-150">
          <div className="px-2 py-1 text-[10px] font-mono text-accent font-bold uppercase border-b border-border/50 flex items-center justify-between">
            <span>TOPICS MENU</span>
            <span className="text-text-secondary font-normal">Tap to expand</span>
          </div>

          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {TOPICS_MENU_TREE.map((l1) => {
              const isL1Expanded = mobileExpanded1 === l1.id;
              const hasL1Children = l1.children && l1.children.length > 0;

              return (
                <div key={l1.id} className="rounded-lg border border-border/60 bg-surface/40 overflow-hidden">
                  <div
                    onClick={() => {
                      if (hasL1Children) {
                        setMobileExpanded1(isL1Expanded ? null : l1.id);
                      } else {
                        navigate(l1.link);
                        onClose();
                      }
                    }}
                    className="p-2.5 flex items-center justify-between cursor-pointer font-bold text-xs text-text-primary hover:text-accent"
                  >
                    <div className="flex items-center gap-2">
                      <span>{l1.icon}</span>
                      <span>{l1.title}</span>
                      {l1.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {l1.badge}
                        </span>
                      )}
                    </div>
                    {hasL1Children && (
                      <span className={`text-xs font-mono transition-transform duration-200 ${isL1Expanded ? 'rotate-90 text-accent' : ''}`}>
                        ›
                      </span>
                    )}
                  </div>

                  {/* Level 2 Submenu */}
                  {isL1Expanded && l1.children && (
                    <div className="bg-surface-elevated/70 border-t border-border/40 p-2 space-y-1 text-xs">
                      {l1.children.map((l2) => {
                        const isL2Expanded = mobileExpanded2 === l2.id;
                        const hasL2Children = l2.children && l2.children.length > 0;

                        return (
                          <div key={l2.id} className="rounded border border-border/30 bg-background/50">
                            <div
                              onClick={() => {
                                if (hasL2Children) {
                                  setMobileExpanded2(isL2Expanded ? null : l2.id);
                                } else {
                                  navigate(l2.link);
                                  onClose();
                                }
                              }}
                              className="p-2 flex items-center justify-between cursor-pointer font-semibold text-xs text-text-primary hover:text-accent"
                            >
                              <span>{l2.title}</span>
                              {hasL2Children && (
                                <span className={`text-xs font-mono transition-transform duration-200 ${isL2Expanded ? 'rotate-90 text-accent' : ''}`}>
                                  ›
                                </span>
                              )}
                            </div>

                            {/* Level 3 Submenu */}
                            {isL2Expanded && l2.children && (
                              <div className="bg-surface/80 border-t border-border/30 p-1.5 space-y-1">
                                {l2.children.map((l3) => (
                                  <Link
                                    key={l3.id}
                                    to={l3.link}
                                    onClick={onClose}
                                    className="block p-1.5 rounded hover:bg-accent/20 text-[11px] font-mono text-text-secondary hover:text-accent"
                                  >
                                    • {l3.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
