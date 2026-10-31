import { useState, useEffect } from 'react';
import OrthographicProjectionVideoPlayer from './OrthographicProjectionVideoPlayer';
import Anatomy3DExperience from './Anatomy3DExperience';

interface DraftingKnowledgeHubProps {
  onBack?: () => void;
}

export default function DraftingKnowledgeHub({ onBack }: DraftingKnowledgeHubProps) {
  // Navigation active section
  const [activeSection, setActiveSection] = useState('drafting-overview');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Section 5: Selected Drawing Type
  const [selectedDrawingType, setSelectedDrawingType] = useState<'ortho' | 'iso' | 'section' | 'detail' | 'assembly' | 'schematic' | 'mfg'>('ortho');
  // Orthographic view display mode (video vs schematic)
  const [orthoViewMode, setOrthoViewMode] = useState<'video' | 'schematic'>('video');
  // Sectional cutaway view type
  const [activeCutawayType, setActiveCutawayType] = useState<'full' | 'half' | 'offset' | 'revolved'>('full');

  // Section 6: Selected Drawing View
  const [activeView, setActiveView] = useState<'front' | 'top' | 'side' | 'iso' | 'section'>('front');


  // Section 8: Standards expandable groups
  const [expandedStandard, setExpandedStandard] = useState<'asme' | 'iso' | 'both'>('both');

  // Section 9: Title Block sample selected
  const [activeTitleBlockSample, setActiveTitleBlockSample] = useState<'bracket' | 'shaft'>('bracket');

  // Section 10: Workflow active step
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  // Section 12: Interactive Checklists
  const [bestPracticesChecks, setBestPracticesChecks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const [releaseChecks, setReleaseChecks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false,
    5: true,
    6: false,
    7: true,
    8: false,
    9: false,
    10: false,
  });

  // Track scroll position for Back to Top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const toggleReleaseCheck = (id: number) => {
    setReleaseChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBestPracticeCheck = (id: number) => {
    setBestPracticesChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const releaseCompletedCount = Object.values(releaseChecks).filter(Boolean).length;
  const releaseProgressPercent = Math.round((releaseCompletedCount / 10) * 100);

  return (
    <div className="space-y-12 pb-20 animate-fadeIn text-text-primary">
      {/* ─────────────────────────────────────────────────────────────
          1. STICKY SUB-NAVIGATION & HEADER BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-border shadow-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-border text-text-primary text-xs font-semibold border border-border transition focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Back to Topics"
              >
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Topics</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-text-secondary pl-2 border-l border-border">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>DRAFTING HUB</span>
            </div>
          </div>

          {/* Quick jump navigation links */}
          <nav className="flex items-center gap-1 sm:gap-2 shrink-0 text-xs font-medium">
            {[
              { id: 'drafting-overview', label: 'Overview' },
              { id: 'drafting-types', label: 'Drawing Types' },
              { id: 'drafting-views', label: 'Views' },
              { id: 'drafting-anatomy', label: 'Anatomy' },
              { id: 'drafting-standards', label: 'Standards' },
              { id: 'drafting-titleblock', label: 'Title Block' },
              { id: 'drafting-workflow', label: 'Workflow' },
              { id: 'drafting-bestpractices', label: 'Best Practices' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-2.5 py-1 rounded-md transition whitespace-nowrap text-xs ${
                  activeSection === item.id
                    ? 'bg-accent/15 text-accent border border-accent/40 font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-hero" className="relative rounded-2xl overflow-hidden bg-surface border border-border p-6 sm:p-10 shadow-xl">
        {/* Technical Blueprint Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px), linear-gradient(to right, rgba(20,184,166,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,184,166,0.08) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Info Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Engineering Drawing Standards • ISO / ASME
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
                ENGINEERING <span className="text-accent underline decoration-accent/40 underline-offset-8">DRAFTING</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-accent/90 italic pt-1">
                “Transforming 3D CAD models into accurate, manufacturing-ready engineering drawings.”
              </p>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
              Engineering Drafting communicates component geometry, dimensions, tolerances, materials, manufacturing requirements, and inspection information. It acts as the legal, contractual graphic language bridging conceptual mechanical design with physical precision machining and quality assurance.
            </p>

            {/* 3 Compact Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-surface-elevated/80 border border-border hover:border-accent/50 transition shadow-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-accent text-base">📡</span>
                  <h4 className="text-xs font-bold text-text-primary">Technical Communication</h4>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Universal graphic language across design, machining, and assembly teams.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated/80 border border-border hover:border-accent/50 transition shadow-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-accent text-base">🎯</span>
                  <h4 className="text-xs font-bold text-text-primary">Manufacturing Accuracy</h4>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Unambiguous dimensions, fits, and surface textures for zero-defect production.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated/80 border border-border hover:border-accent/50 transition shadow-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-accent text-base">🔍</span>
                  <h4 className="text-xs font-bold text-text-primary">Quality Inspection</h4>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Defines GD&T datum reference frames and CMM verification criteria.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Blueprint-Inspired CAD Drawing Animation Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-[#0a1120] border-2 border-accent/40 rounded-xl p-4 shadow-2xl relative overflow-hidden group">
              {/* CAD Crosshair grid */}
              <div className="flex justify-between items-center text-[10px] font-mono text-accent/70 pb-2 border-b border-accent/20">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  CAD VIEWPORT [ORTHOGRAPHIC 1st ANGLE]
                </span>
                <span>SCALE 1:2</span>
              </div>

              {/* Blueprint Vector Illustration */}
              <div className="py-4 flex justify-center">
                <svg viewBox="0 0 320 200" className="w-full h-auto text-accent">
                  <defs>
                    <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20, 184, 166, 0.12)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="320" height="200" fill="url(#cadGrid)" />

                  {/* Centerlines (Chain line) */}
                  <line x1="20" y1="95" x2="150" y2="95" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="10 3 2 3" opacity="0.6" />
                  <line x1="85" y1="30" x2="85" y2="160" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="10 3 2 3" opacity="0.6" />

                  {/* FRONT VIEW (Stepped Shaft / Flange) */}
                  <g>
                    {/* Outer Profile */}
                    <rect x="40" y="60" width="90" height="70" fill="rgba(20, 184, 166, 0.08)" stroke="#14b8a6" strokeWidth="1.8" />
                    <rect x="55" y="45" width="60" height="100" fill="rgba(20, 184, 166, 0.05)" stroke="#14b8a6" strokeWidth="1.8" />
                    {/* Center Bore (Hidden lines) */}
                    <line x1="40" y1="80" x2="130" y2="80" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 2" />
                    <line x1="40" y1="110" x2="130" y2="110" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 2" />
                    {/* Dimension Line */}
                    <line x1="30" y1="45" x2="30" y2="145" stroke="#94a3b8" strokeWidth="0.8" />
                    <line x1="26" y1="45" x2="38" y2="45" stroke="#94a3b8" strokeWidth="0.8" />
                    <line x1="26" y1="145" x2="38" y2="145" stroke="#94a3b8" strokeWidth="0.8" />
                    <text x="14" y="100" fill="#94a3b8" fontSize="8" fontFamily="monospace" transform="rotate(-90 14 100)">⌀100 h7</text>
                  </g>

                  {/* SIDE VIEW (Concentric Circles) */}
                  <g transform="translate(220, 95)">
                    <circle r="48" fill="rgba(20, 184, 166, 0.06)" stroke="#14b8a6" strokeWidth="1.8" />
                    <circle r="32" fill="none" stroke="#14b8a6" strokeWidth="1.4" />
                    <circle r="15" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 2" />
                    {/* Center crosshair */}
                    <line x1="-55" y1="0" x2="55" y2="0" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="8 2 2 2" opacity="0.7" />
                    <line x1="0" y1="-55" x2="0" y2="55" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="8 2 2 2" opacity="0.7" />
                    {/* Bolt circle holes */}
                    <circle cx="0" cy="-32" r="3" fill="#38bdf8" />
                    <circle cx="32" cy="0" r="3" fill="#38bdf8" />
                    <circle cx="0" cy="32" r="3" fill="#38bdf8" />
                    <circle cx="-32" cy="0" r="3" fill="#38bdf8" />
                  </g>

                  {/* Isometric Preview inset top right */}
                  <g transform="translate(230, 25)">
                    <polygon points="15,0 35,10 20,20 0,10" fill="rgba(20,184,166,0.2)" stroke="#14b8a6" strokeWidth="1" />
                    <polygon points="0,10 20,20 20,35 0,25" fill="rgba(20,184,166,0.3)" stroke="#14b8a6" strokeWidth="1" />
                    <polygon points="20,20 35,10 35,25 20,35" fill="rgba(20,184,166,0.4)" stroke="#14b8a6" strokeWidth="1" />
                  </g>

                  {/* Corner datum marker */}
                  <polygon points="280,180 300,180 290,165" fill="#14b8a6" opacity="0.8" />
                  <text x="290" y="195" fill="#14b8a6" fontSize="9" fontFamily="monospace" textAnchor="middle">DATUM [A]</text>
                </svg>
              </div>

              {/* View labels */}
              <div className="grid grid-cols-2 text-center text-[10px] font-mono text-text-secondary pt-2 border-t border-accent/20">
                <span className="text-accent">FRONT ELEVATION</span>
                <span className="text-accent">RIGHT PROFILE VIEW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WHAT IS ENGINEERING DRAFTING? (OVERVIEW & PROFESSIONALS)
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-overview" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">FOUNDATION & ROLE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">What Is Engineering Drafting?</h2>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-secondary">
            Universal Manufacturing Language
          </div>
        </div>

        {/* Primary definition quote card */}
        <div className="p-5 rounded-xl bg-accent/5 border border-accent/20 space-y-2">
          <p className="text-sm sm:text-base text-text-primary leading-relaxed font-medium">
            “Engineering Drafting converts CAD models into manufacturing-ready engineering drawings. It communicates the shape, size, materials, manufacturing requirements, assembly details, and functional requirements of a component.”
          </p>
          <p className="text-xs text-text-secondary">
            Without technical drafting, 3D CAD remains merely a digital visual concept. A drafting blueprint embeds legal tolerancing, fit relationships, surface requirements, and quality control specifications necessary for fabrication.
          </p>
        </div>

        {/* 6 Professionals who use engineering drawings */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <span className="text-accent">👥</span> Professionals Who Rely on Engineering Drawings
            </h3>
            <span className="text-[11px] font-mono text-text-secondary">6 Cross-Functional Roles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                role: 'Design Engineers',
                icon: '✏️',
                desc: 'Translate design concepts into unambiguous geometric models, functional datums, and tolerance stacks.',
              },
              {
                role: 'Manufacturing Engineers',
                icon: '🏭',
                desc: 'Select optimal machining sequences, design jigs and fixtures, and establish tooling requirements.',
              },
              {
                role: 'Production Teams',
                icon: '⚙️',
                desc: 'Execute shop-floor turning, milling, grinding, bending, and welding per drawing specifications.',
              },
              {
                role: 'Quality Engineers',
                icon: '🛡️',
                desc: 'Formulate inspection plans, define gauge requirements, and verify GD&T callouts and tolerances.',
              },
              {
                role: 'CNC Programmers',
                icon: '💻',
                desc: 'Extract part coordinates, bore sizes, chamfers, and thread pitches to generate precise G-code paths.',
              },
              {
                role: 'Inspectors',
                icon: '📏',
                desc: 'Perform First Article Inspection (FAI) and Coordinate Measuring Machine (CMM) dimensional verification.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-elevated border border-border/80 hover:border-accent/40 transition-all space-y-1.5 group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl p-1 rounded-lg bg-surface border border-border/60 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition">
                    {item.role}
                  </h4>
                </div>
                <p className="text-[11px] text-text-secondary leading-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. TYPES OF ENGINEERING DRAWINGS (EXPLORE DRAWING TYPES)
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-types" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">TAXONOMY & APPLICATION</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Explore Drawing Types</h2>
          </div>
          <p className="text-xs font-mono text-text-secondary max-w-sm">
            Select a drawing category to inspect technical properties, multi-view diagrams, and shop-floor examples.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ortho', label: 'Orthographic Drawing', badge: 'Multi-View 2D' },
            { id: 'iso', label: 'Isometric Drawing', badge: '3D Pictorial' },
            { id: 'section', label: 'Sectional Drawing', badge: 'Cutaways & Bores' },
            { id: 'detail', label: 'Detail Drawing', badge: 'Part Fabrication' },
            { id: 'assembly', label: 'Assembly Drawing', badge: 'BOM & Balloons' },
            { id: 'schematic', label: 'Schematic Drawing', badge: 'Systems Logic' },
            { id: 'mfg', label: 'Manufacturing Drawing', badge: 'Production Specs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDrawingType(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border ${
                selectedDrawingType === tab.id
                  ? 'bg-accent text-background border-accent font-bold shadow-md'
                  : 'bg-surface-elevated text-text-secondary border-border hover:text-text-primary hover:border-accent/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                selectedDrawingType === tab.id ? 'bg-background/20 text-background' : 'bg-surface text-text-secondary'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Details Panel based on Selected Drawing Type */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border space-y-6">
          {/* A. ORTHOGRAPHIC DRAWING */}
          {selectedDrawingType === 'ortho' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-accent">A. Orthographic Drawing</h3>
                  <p className="text-xs text-text-secondary">
                    Represents a three-dimensional component through multiple mutually perpendicular two-dimensional projection planes.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
                  ISO 128 / ASME Y14.3
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-text-secondary">
                  <p>
                    By projecting parallel visual rays perpendicular to projection planes, orthographic views eliminate perspective distortion and allow exact 1:1 true dimensional measurements of faces, edges, and hole coordinates.
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Standard Multi-View Layout:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <strong className="text-accent block">1. Front View</strong>
                        Principal elevation displaying primary contour & key features.
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <strong className="text-accent block">2. Top View</strong>
                        Plan view aligned directly above (or below) front view.
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <strong className="text-accent block">3. Right-Side View</strong>
                        Profile view revealing lateral thickness and boss heights.
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <strong className="text-accent block">4. Left-Side View</strong>
                        Opposing profile view for asymmetrical features.
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <strong className="text-accent block">5. Bottom View</strong>
                        Inverted baseline view showing underside pockets.
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <strong className="text-accent block">6. Rear View</strong>
                        Backside elevation for mounting patterns and connectors.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-surface rounded-xl border border-accent/30 space-y-1">
                    <strong className="text-accent text-xs font-bold block">Primary Industrial Applications:</strong>
                    <p className="text-xs text-text-secondary">
                      Manufacturing production blueprints, CNC 3-axis/5-axis milling setups, sheet metal punching & laser cutting, machine components fabrication, and CMM quality inspection routines.
                    </p>
                  </div>
                </div>

                {/* 3D to 2D Orthographic Projection Arrangement Simulation Video */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  {orthoViewMode === 'video' ? (
                    <div className="flex flex-col gap-2">
                      <OrthographicProjectionVideoPlayer
                        onToggleDiagram={() => setOrthoViewMode('schematic')}
                        showDiagramToggle={true}
                      />
                      <p className="text-[10px] font-mono text-text-secondary text-center">
                        Direct perpendicular projection ensures true lengths, hole alignments, and precise dimensional coordinates.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-background p-4 rounded-xl border border-border flex flex-col items-center relative group">
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-accent">ORTHOGRAPHIC PROJECTION ARRANGEMENT</span>
                        <button
                          onClick={() => setOrthoViewMode('video')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-[11px] font-mono font-bold border border-accent/40 transition"
                        >
                          <span>🎥</span>
                          <span>Watch 3D Video</span>
                        </button>
                      </div>
                      <svg viewBox="0 0 260 220" className="w-full h-auto text-accent">
                        {/* Top View */}
                        <g transform="translate(40, 20)">
                          <rect x="0" y="0" width="80" height="50" fill="rgba(20, 184, 166, 0.1)" stroke="#14b8a6" strokeWidth="1.5" />
                          <circle cx="40" cy="25" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                          <text x="40" y="-5" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">TOP VIEW</text>
                        </g>
                        {/* Vertical Alignment projector line */}
                        <line x1="80" y1="70" x2="80" y2="90" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 3" />

                        {/* Front View */}
                        <g transform="translate(40, 90)">
                          <rect x="0" y="0" width="80" height="60" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1.8" />
                          {/* Hidden bore lines */}
                          <line x1="30" y1="0" x2="30" y2="60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
                          <line x1="50" y1="0" x2="50" y2="60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
                          {/* Stepped shoulder */}
                          <polyline points="0,35 40,35 40,0" fill="none" stroke="#14b8a6" strokeWidth="1.5" />
                          <text x="40" y="75" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">FRONT VIEW</text>
                        </g>
                        {/* Horizontal Alignment projector line */}
                        <line x1="120" y1="120" x2="150" y2="120" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 3" />

                        {/* Right Side View */}
                        <g transform="translate(150, 90)">
                          <rect x="0" y="0" width="60" height="60" fill="rgba(20, 184, 166, 0.1)" stroke="#14b8a6" strokeWidth="1.5" />
                          <line x1="0" y1="35" x2="60" y2="35" stroke="#14b8a6" strokeWidth="1.2" />
                          <line x1="30" y1="0" x2="30" y2="60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
                          <text x="30" y="75" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">SIDE VIEW</text>
                        </g>

                        {/* 45-degree miter line visual indicator */}
                        <line x1="120" y1="20" x2="120" y2="70" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" />
                        <line x1="120" y1="20" x2="210" y2="20" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" />
                        <line x1="150" y1="70" x2="200" y2="20" stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 3" />
                      </svg>
                      <p className="text-[10px] font-mono text-text-secondary text-center mt-1">
                        Direct perpendicular projection ensures true lengths and precise angle measurement.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* B. ISOMETRIC DRAWING */}
          {selectedDrawingType === 'iso' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-accent">B. Isometric Drawing</h3>
                  <p className="text-xs text-text-secondary">
                    Communicates a component's three-dimensional pictorial form in a single integrated view with 30° horizontal axes.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
                  Axonometric Pictorial
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-text-secondary">
                  <p>
                    Isometric projection draws three mutually perpendicular principal coordinate axes such that they appear equally inclined at <strong className="text-accent">120° apart</strong> (with the two receding axes tilted at 30° to the horizontal baseline).
                  </p>
                  <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
                    <h4 className="text-xs font-bold text-text-primary uppercase">Key Technical Characteristics:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Equal foreshortening along all three principal axes (isometric scale ratio ≈ 0.816 or nominal 1:1 isometric drawings).</li>
                      <li>Eliminates vanishing point distortion found in architectural perspective drawings.</li>
                      <li>Enables instant spatial comprehension for non-drafting personnel, assembly technicians, and procurement managers.</li>
                      <li>Non-isometric lines (slanted cuts) must be plotted from endpoints along principal axes.</li>
                    </ul>
                  </div>
                  <p className="text-xs text-text-secondary">
                    While 2D orthographic views provide exact machining coordinates, the isometric view is placed in the upper-right corner of modern engineering drawings as an essential reference model.
                  </p>
                </div>

                {/* Isometric Technical Diagram */}
                <div className="lg:col-span-5 bg-background p-4 rounded-xl border border-border flex flex-col items-center">
                  <span className="text-[10px] font-mono text-accent mb-2">ISOMETRIC AXES & COMPONENT BLOCK</span>
                  <svg viewBox="0 0 240 200" className="w-full h-auto text-accent">
                    {/* Isometric axes */}
                    <line x1="120" y1="110" x2="120" y2="25" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="120" y1="110" x2="210" y2="162" stroke="#3b82f6" strokeWidth="1.5" />
                    <line x1="120" y1="110" x2="30" y2="162" stroke="#10b981" strokeWidth="1.5" />

                    {/* 30 degree baseline indicators */}
                    <line x1="30" y1="110" x2="210" y2="110" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 3" />
                    <text x="180" y="105" fill="#94a3b8" fontSize="8" fontFamily="monospace">30°</text>
                    <text x="50" y="105" fill="#94a3b8" fontSize="8" fontFamily="monospace">30°</text>

                    {/* 3D Machined Block */}
                    <g transform="translate(0, 5)">
                      {/* Top Face */}
                      <polygon points="120,50 170,79 120,108 70,79" fill="rgba(20, 184, 166, 0.25)" stroke="#14b8a6" strokeWidth="1.8" />
                      {/* Left Face */}
                      <polygon points="70,79 120,108 120,158 70,129" fill="rgba(20, 184, 166, 0.4)" stroke="#14b8a6" strokeWidth="1.8" />
                      {/* Right Face */}
                      <polygon points="120,108 170,79 170,129 120,158" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1.8" />
                      {/* Stepped cutout in isometric */}
                      <polygon points="95,65 120,79 120,95 95,80" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.2" />
                    </g>
                    <text x="120" y="20" fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle">Z AXIS (VERTICAL)</text>
                    <text x="215" y="170" fill="#3b82f6" fontSize="9" fontFamily="monospace">X AXIS (30°)</text>
                    <text x="25" y="170" fill="#10b981" fontSize="9" fontFamily="monospace">Y AXIS (30°)</text>
                  </svg>
                  <p className="text-[10px] font-mono text-text-secondary text-center mt-2">
                    Three axes equally inclined at 120° — provides instant spatial depth without perspective convergence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* C. SECTIONAL DRAWING */}
          {selectedDrawingType === 'section' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-accent">C. Sectional Drawing</h3>
                  <p className="text-xs text-text-secondary">
                    Represents a component as if cut through an imaginary plane, revealing internal cavities, bearings, counterbores, and rib structures.
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {(['full', 'half', 'offset', 'revolved'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveCutawayType(type)}
                      className={`px-2 py-1 rounded text-[11px] font-mono uppercase transition ${
                        activeCutawayType === type
                          ? 'bg-accent text-background font-bold'
                          : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6 Sectional Types Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
                {[
                  { name: 'Full Section', desc: 'Cutting plane passes entirely through the component.' },
                  { name: 'Half Section', desc: '1/4 cutaway for symmetrical cylindrical components.' },
                  { name: 'Offset Section', desc: 'Stepped plane passing through non-collinear features.' },
                  { name: 'Broken-Out Section', desc: 'Localized partial cutaway bounded by irregular break line.' },
                  { name: 'Revolved Section', desc: 'Cross-section turned 90° directly onto the longitudinal view.' },
                  { name: 'Removed Section', desc: 'Cross-section shifted outside view boundaries for clarity.' },
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface border border-border space-y-1">
                    <strong className="text-accent text-[11px] block">{s.name}</strong>
                    <p className="text-[10px] text-text-secondary leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Gearbox Cutaway Technical Illustration */}
              <div className="p-4 rounded-xl bg-background border border-border space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs font-mono gap-2">
                  <span className="text-accent font-bold flex items-center gap-1.5">
                    <span>⚙️</span> INDUSTRIAL GEARBOX HOUSING CUTAWAY (A-A)
                  </span>
                  <span className="text-text-secondary">Cross-Hatching: Cast Iron 45° Uniform Pitch</span>
                </div>

                <div className="flex justify-center py-2">
                  <svg viewBox="0 0 340 180" className="w-full max-w-lg h-auto">
                    <defs>
                      <pattern id="hatchPattern" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="8" stroke="#14b8a6" strokeWidth="1" opacity="0.6" />
                      </pattern>
                      <pattern id="shaftHatch" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="6" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
                      </pattern>
                    </defs>

                    {/* Outer Housing Section cut */}
                    <path
                      d="M 30,30 L 140,30 L 140,55 L 80,55 L 80,125 L 140,125 L 140,150 L 30,150 Z"
                      fill="url(#hatchPattern)"
                      stroke="#14b8a6"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M 310,30 L 200,30 L 200,55 L 260,55 L 260,125 L 200,125 L 200,150 L 310,150 Z"
                      fill="url(#hatchPattern)"
                      stroke="#14b8a6"
                      strokeWidth="1.8"
                    />

                    {/* Drive Shaft in Center (Not cross-hatched per engineering standard ISO 128) */}
                    <rect x="20" y="75" width="300" height="30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1.8" />
                    {/* Shaft Centerline */}
                    <line x1="10" y1="90" x2="330" y2="90" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="8 2 2 2" />

                    {/* Spur Gear Mounted on Shaft */}
                    <rect x="150" y="40" width="40" height="100" fill="url(#shaftHatch)" stroke="#38bdf8" strokeWidth="1.5" />
                    {/* Gear Teeth Callouts */}
                    <line x1="150" y1="40" x2="190" y2="40" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="150" y1="140" x2="190" y2="140" stroke="#38bdf8" strokeWidth="2" />

                    {/* Deep Groove Ball Bearings Left & Right */}
                    <g transform="translate(60, 55)">
                      <rect x="0" y="0" width="20" height="20" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="10" cy="10" r="6" fill="#cbd5e1" />
                    </g>
                    <g transform="translate(60, 105)">
                      <rect x="0" y="0" width="20" height="20" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="10" cy="10" r="6" fill="#cbd5e1" />
                    </g>
                    <g transform="translate(260, 55)">
                      <rect x="0" y="0" width="20" height="20" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="10" cy="10" r="6" fill="#cbd5e1" />
                    </g>
                    <g transform="translate(260, 105)">
                      <rect x="0" y="0" width="20" height="20" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="10" cy="10" r="6" fill="#cbd5e1" />
                    </g>

                    {/* Feature Annotations */}
                    <text x="50" y="22" fill="#14b8a6" fontSize="9" fontFamily="monospace">HOUSING (CAST IRON)</text>
                    <line x1="70" y1="45" x2="70" y2="30" stroke="#94a3b8" strokeWidth="0.8" />
                    <text x="170" y="25" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">SPUR PINION</text>
                    <text x="70" y="170" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">BEARING 6205</text>
                    <text x="270" y="170" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">BEARING 6205</text>
                  </svg>
                </div>
                <p className="text-[11px] text-text-secondary italic text-center">
                  Standard Section Rule: Solid shafts, bolts, keys, gear teeth, and bearing balls are never cross-sectioned longitudinally.
                </p>
              </div>
            </div>
          )}

          {/* D. DETAIL DRAWING */}
          {selectedDrawingType === 'detail' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-accent">D. Detail Drawing</h3>
                  <p className="text-xs text-text-secondary">
                    Provides complete manufacturing data for an individual component, including dimensions, tolerances, surface finishes, and local magnified callouts.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
                  Single Component Definition
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3 text-xs sm:text-sm text-text-secondary">
                  <p>
                    A detail drawing describes a single part completely so that a machinist can manufacture it without reference to any other drawing.
                  </p>
                  <div className="p-3 bg-surface rounded-xl border border-border space-y-2 text-xs">
                    <strong className="text-text-primary font-bold block">Must Include:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Nominal sizes and bilateral/unilateral limits (e.g. ⌀25 +0.021 / +0.008 mm).</li>
                      <li>Geometric tolerances (concentricity, perpendicularity, runout).</li>
                      <li>Surface texture callouts (e.g., ground seal seat Ra 0.4 µm vs turned body Ra 3.2 µm).</li>
                      <li>Material grade, heat treatment hardness (e.g., 58–62 HRC), and corrosion coatings.</li>
                      <li><strong className="text-accent">Detail View Callout (e.g., DETAIL B - SCALE 4:1):</strong> Magnified circular boundary displaying fine undercut grooves, O-ring chamfers, or thread relief.</li>
                    </ul>
                  </div>
                </div>

                {/* Detail View Callout Diagram */}
                <div className="lg:col-span-5 bg-background p-4 rounded-xl border border-border flex flex-col items-center">
                  <span className="text-[10px] font-mono text-accent mb-2">DETAIL VIEW CALLOUT [SCALE 4:1]</span>
                  <svg viewBox="0 0 220 180" className="w-full h-auto text-accent">
                    {/* Main Part with Circle Callout */}
                    <rect x="20" y="50" width="70" height="40" fill="rgba(20, 184, 166, 0.1)" stroke="#14b8a6" strokeWidth="1.5" />
                    <rect x="90" y="58" width="20" height="24" fill="rgba(20, 184, 166, 0.1)" stroke="#14b8a6" strokeWidth="1.5" />
                    {/* Circle Callout 'B' */}
                    <circle cx="90" cy="58" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
                    <text x="108" y="50" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>

                    {/* Magnified Detail B Bubble */}
                    <g transform="translate(150, 100)">
                      <circle cx="0" cy="0" r="45" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.8" />
                      {/* Stepped undercut fillet magnified */}
                      <path d="M -30,-20 L 0,-20 A 8 8 0 0 1 8,-12 L 8,25 L -30,25 Z" fill="rgba(20,184,166,0.2)" stroke="#14b8a6" strokeWidth="1.8" />
                      {/* Radius callout */}
                      <line x1="8" y1="-12" x2="25" y2="-28" stroke="#38bdf8" strokeWidth="1" />
                      <text x="28" y="-28" fill="#38bdf8" fontSize="8" fontFamily="monospace">R 1.2 ±0.1</text>
                      <text x="0" y="38" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">DETAIL B (4:1)</text>
                    </g>

                    {/* Leader arrow connecting callout to magnified view */}
                    <line x1="98" y1="68" x2="135" y2="85" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                  </svg>
                  <p className="text-[10px] font-mono text-text-secondary text-center mt-1">
                    Detail views magnify intricate undercut radii and grinding reliefs without enlarging the full sheet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* E. ASSEMBLY DRAWING */}
          {selectedDrawingType === 'assembly' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-accent">E. Assembly Drawing</h3>
                  <p className="text-xs text-text-secondary">
                    Shows multiple components combined in their working relationship, complete with balloon part numbers and Bill of Materials (BOM).
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
                  Product Level Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-3 text-xs sm:text-sm text-text-secondary">
                  <p>
                    Assembly drawings show how individual detail-drawn parts fit together. Rather than displaying every internal machining tolerance, they focus on overall envelope dimensions, center-to-center distances, mounting hole patterns, and item balloon numbers.
                  </p>
                  <div className="p-3 bg-surface rounded-xl border border-border space-y-2 text-xs">
                    <strong className="text-accent font-bold block">Bill of Materials (BOM) Integration:</strong>
                    <p className="text-text-secondary">
                      Every part is tagged with a circular item balloon pointing to the component via a leader line with a dot or arrowhead. The balloon number corresponds directly to the drawing's Bill of Materials table.
                    </p>
                  </div>
                </div>

                {/* Assembly Drawing Visual with Balloon Numbers */}
                <div className="lg:col-span-6 bg-background p-4 rounded-xl border border-border">
                  <div className="flex justify-between items-center text-[10px] font-mono text-accent mb-2">
                    <span>ASSEMBLY VIEW WITH ITEM BALLOONS</span>
                    <span>BOM SUMMARY</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <svg viewBox="0 0 160 140" className="w-full h-auto">
                      {/* Bracket Base (Part 1) */}
                      <path d="M 20,90 L 140,90 L 140,110 L 20,110 Z" fill="rgba(20,184,166,0.2)" stroke="#14b8a6" strokeWidth="1.5" />
                      {/* Bushing (Part 2) */}
                      <rect x="50" y="45" width="60" height="45" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1.5" />
                      {/* Pin / Bolt (Part 3) */}
                      <rect x="70" y="25" width="20" height="85" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1.5" />

                      {/* Balloon 1 */}
                      <circle cx="20" cy="50" r="10" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" />
                      <text x="20" y="53" fill="#14b8a6" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">1</text>
                      <line x1="28" y1="56" x2="45" y2="90" stroke="#14b8a6" strokeWidth="1" />

                      {/* Balloon 2 */}
                      <circle cx="135" cy="40" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="135" y="43" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">2</text>
                      <line x1="126" y1="44" x2="105" y2="65" stroke="#38bdf8" strokeWidth="1" />

                      {/* Balloon 3 */}
                      <circle cx="80" cy="10" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="80" y="13" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">3</text>
                      <line x1="80" y1="20" x2="80" y2="25" stroke="#f59e0b" strokeWidth="1" />
                    </svg>

                    {/* Integrated BOM Mini-table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] font-mono border border-border">
                        <thead>
                          <tr className="bg-surface text-accent border-b border-border">
                            <th className="p-1 text-left">ITEM</th>
                            <th className="p-1 text-left">PART NAME</th>
                            <th className="p-1 text-right">QTY</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          <tr>
                            <td className="p-1 text-accent font-bold">1</td>
                            <td className="p-1 text-text-primary">Base Bracket</td>
                            <td className="p-1 text-right">1</td>
                          </tr>
                          <tr>
                            <td className="p-1 text-accent font-bold">2</td>
                            <td className="p-1 text-text-primary">Bronze Bushing</td>
                            <td className="p-1 text-right">1</td>
                          </tr>
                          <tr>
                            <td className="p-1 text-accent font-bold">3</td>
                            <td className="p-1 text-text-primary">Dowel Pivot Pin</td>
                            <td className="p-1 text-right">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* F. SCHEMATIC DRAWING */}
          {selectedDrawingType === 'schematic' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-accent">F. Schematic Drawing</h3>
                  <p className="text-xs text-text-secondary">
                    Uses standardized graphic symbols and interconnected flow lines to represent the functional logic of fluid power, electrical circuits, and pneumatic automation.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
                  Functional Logic & Systems
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Electrical Systems */}
                <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <h4 className="font-bold text-accent text-sm">Electrical Systems</h4>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Represents wiring harnesses, relays, motor controllers, circuit breakers, PLCs, and power distribution paths using standardized IEEE / IEC electrical symbols.
                  </p>
                  <span className="inline-block text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-background">
                    Standard: IEC 60617 / IEEE 315
                  </span>
                </div>

                {/* Hydraulic Systems */}
                <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💧</span>
                    <h4 className="font-bold text-accent text-sm">Hydraulic Systems</h4>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Maps high-pressure fluid flow, variable displacement pumps, directional control valves, hydraulic cylinders, pressure relief valves, and oil reservoirs.
                  </p>
                  <span className="inline-block text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-background">
                    Standard: ISO 1219-1 (Fluid Power)
                  </span>
                </div>

                {/* Pneumatic Systems */}
                <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💨</span>
                    <h4 className="font-bold text-accent text-sm">Pneumatic Systems</h4>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Illustrates compressed air supplies, FRL units (Filter-Regulator-Lubricator), solenoid pilot valves, rotary actuators, and pneumatic air cylinders.
                  </p>
                  <span className="inline-block text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-background">
                    Standard: ISO 1219-2 (Systems Circuit)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-surface rounded-xl border border-accent/20 text-xs text-text-secondary flex items-center justify-between">
                <span><strong>Core Applications:</strong> Industrial automation cells, CNC machine hydraulics, robotic arm end-effectors, and packaging lines.</span>
                <span className="text-accent font-mono text-[11px] shrink-0 font-bold">Non-Geometric • Pure System Logic</span>
              </div>
            </div>
          )}

          {/* G. MANUFACTURING DRAWING */}
          {selectedDrawingType === 'mfg' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-accent">G. Manufacturing Drawing</h3>
                  <p className="text-xs text-text-secondary">
                    Contains all geometric, metallurgical, dimensional, surface, and inspection tolerances required to fabricate and verify a production component.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
                  Shop-Floor Release Ready
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-text-secondary">
                  <p>
                    A manufacturing drawing is the authoritative technical contract between engineering and production. It leaves zero room for ambiguity or machine operator guesswork.
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Example Manufacturing Specification Card:</h4>
                    <div className="p-4 bg-background rounded-xl border border-accent/40 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                        <span className="text-text-secondary">Material Specification:</span>
                        <strong className="text-accent font-bold">EN24 (High-Tensile Alloy Steel)</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                        <span className="text-text-secondary">General Tolerance:</span>
                        <strong className="text-text-primary font-bold">ISO 2768 - mK (Medium)</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                        <span className="text-text-secondary">Surface Finish:</span>
                        <strong className="text-amber-400 font-bold">Ra 3.2 µm (Turned / Milled)</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Geometric Tolerance:</span>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface border border-accent/50 text-accent font-bold">
                          <span>⌖</span>
                          <span>Position ⌀0.05 mm | A | B | C</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-text-secondary block italic">
                      * Illustrated as an educational reference example from the engineering learning curriculum, not a universal specification.
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 p-4 rounded-xl bg-surface border border-border space-y-2">
                  <h4 className="text-xs font-bold text-text-primary uppercase">Manufacturing Release Checklist Items:</h4>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">✓</span>
                      <span>Raw stock dimensions defined with machining allowances.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">✓</span>
                      <span>Heat treatment callouts (e.g., Hardened & Tempered to 28–32 HRC).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">✓</span>
                      <span>Surface treatment specs (Black Phosphated or Hard Chrome Plated).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">✓</span>
                      <span>Deburring & edge relief note: &quot;Break all sharp edges 0.3–0.5 mm max&quot;.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TYPES OF DRAWING VIEWS (UNDERSTANDING DRAWING VIEWS)
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-views" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">PROJECTION ORIENTATIONS</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Understanding Drawing Views</h2>
          </div>
          <p className="text-xs font-mono text-text-secondary">
            Select a view card below to highlight its geometry, role, and projection rules.
          </p>
        </div>

        {/* 5 Interactive View Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              id: 'front',
              num: '1',
              title: 'Front View',
              desc: 'Primary representation showing the most characteristic contour.',
              badge: 'Principal Elevation',
            },
            {
              id: 'top',
              num: '2',
              title: 'Top View',
              desc: 'Shows upper profile, hole patterns, and depth relationships.',
              badge: 'Plan Projection',
            },
            {
              id: 'side',
              num: '3',
              title: 'Side View',
              desc: 'Communicates lateral features, thicknesses, and flange steps.',
              badge: 'Profile View',
            },
            {
              id: 'iso',
              num: '4',
              title: 'Isometric View',
              desc: 'Visualizes 3D form and overall spatial comprehension.',
              badge: '3D Axonometric',
            },
            {
              id: 'section',
              num: '5',
              title: 'Section View',
              desc: 'Reveals internal stepped bores, wall thicknesses, and cavities.',
              badge: 'Cutaway Cut',
            },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`p-4 rounded-xl text-left transition flex flex-col justify-between space-y-2 border ${
                activeView === view.id
                  ? 'bg-accent/15 border-accent shadow-lg shadow-accent/10'
                  : 'bg-surface-elevated border-border hover:border-accent/40'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    activeView === view.id ? 'bg-accent text-background' : 'bg-surface text-text-secondary'
                  }`}>
                    VIEW #{view.num}
                  </span>
                  <span className="text-[10px] font-mono text-accent">{view.badge}</span>
                </div>
                <h4 className="text-xs font-bold text-text-primary">{view.title}</h4>
                <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">{view.desc}</p>
              </div>
              <div className="text-[10px] font-mono text-accent font-semibold pt-1 border-t border-border/50">
                {activeView === view.id ? 'ACTIVE VIEWPOINT •' : 'SELECT VIEW →'}
              </div>
            </button>
          ))}
        </div>

        {/* Viewport Display highlighting selected view */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-wider">
              INSPECTION VIEW DETAIL
            </span>
            <h3 className="text-xl font-bold text-text-primary">
              {activeView === 'front' && '1. Front View (Principal Elevation)'}
              {activeView === 'top' && '2. Top View (Plan View)'}
              {activeView === 'side' && '3. Right-Side View (Profile)'}
              {activeView === 'iso' && '4. Isometric Pictorial View'}
              {activeView === 'section' && '5. Full Section View (Section A-A)'}
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {activeView === 'front' &&
                'The front view represents the component in its primary operating or manufacturing position. It is chosen to reveal the maximum number of characteristic contours, stepped profiles, and primary datum reference faces.'}
              {activeView === 'top' &&
                'Aligned directly above the front view in 3rd angle projection (or below in 1st angle projection). It clearly displays horizontal hole centerlines, mounting pitch distances, and outer width.'}
              {activeView === 'side' &&
                'Communicates lateral thickness, keyway depths, and vertical rib profiles. Aligned horizontally with the front view so horizontal projector lines coincide exactly.'}
              {activeView === 'iso' &&
                'Drawn at 30° receding horizontal angles. While not scaled for direct dimension measurement, it prevents misinterpretation of complex intersections and undercuts.'}
              {activeView === 'section' &&
                'Exposes internal features by cutting away the front half of the component. Cross-hatch lines at 45° clearly distinguish solid metal from empty counterbores and cooling channels.'}
            </p>

            <div className="p-3 bg-surface rounded-xl border border-border text-xs font-mono space-y-1">
              <span className="text-accent font-bold block">Drafting Rule:</span>
              <p className="text-text-secondary">
                All orthographic views must maintain strict vertical and horizontal alignment. Dimensions should be placed between views rather than duplicated.
              </p>
            </div>
          </div>

          {/* Interactive SVG View Renderer */}
          <div className="lg:col-span-7 bg-background p-6 rounded-xl border border-border flex items-center justify-center">
            <svg viewBox="0 0 320 200" className="w-full h-auto text-accent">
              <rect width="320" height="200" fill="#090d16" rx="8" />

              {/* Active highlighted geometry based on activeView */}
              {activeView === 'front' && (
                <g transform="translate(100, 40)">
                  <rect x="0" y="0" width="120" height="90" fill="rgba(20, 184, 166, 0.25)" stroke="#14b8a6" strokeWidth="2.5" />
                  <rect x="25" y="20" width="70" height="70" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1.8" />
                  {/* Center bore hidden lines */}
                  <line x1="45" y1="0" x2="45" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1="75" y1="0" x2="75" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1="60" y1="-10" x2="60" y2="100" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="8 2 2 2" />
                  <text x="60" y="115" fill="#14b8a6" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    FRONT VIEW [PRINCIPAL]
                  </text>
                </g>
              )}

              {activeView === 'top' && (
                <g transform="translate(100, 35)">
                  <rect x="0" y="0" width="120" height="70" fill="rgba(20, 184, 166, 0.25)" stroke="#14b8a6" strokeWidth="2.5" />
                  <circle cx="60" cy="35" r="18" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="0" y1="35" x2="120" y2="35" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="8 2 2 2" />
                  <line x1="60" y1="-5" x2="60" y2="75" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="8 2 2 2" />
                  <text x="60" y="95" fill="#14b8a6" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    TOP PLAN VIEW
                  </text>
                </g>
              )}

              {activeView === 'side' && (
                <g transform="translate(120, 40)">
                  <rect x="0" y="0" width="80" height="90" fill="rgba(20, 184, 166, 0.25)" stroke="#14b8a6" strokeWidth="2.5" />
                  <line x1="0" y1="35" x2="80" y2="35" stroke="#14b8a6" strokeWidth="1.8" />
                  <line x1="40" y1="-10" x2="40" y2="100" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="8 2 2 2" />
                  <text x="40" y="115" fill="#14b8a6" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    RIGHT SIDE PROFILE
                  </text>
                </g>
              )}

              {activeView === 'iso' && (
                <g transform="translate(160, 95)">
                  <polygon points="0,-45 50,-16 0,13 -50,-16" fill="rgba(20,184,166,0.3)" stroke="#14b8a6" strokeWidth="2" />
                  <polygon points="-50,-16 0,13 0,55 -50,26" fill="rgba(20,184,166,0.4)" stroke="#14b8a6" strokeWidth="2" />
                  <polygon points="0,13 50,-16 50,26 0,55" fill="rgba(20,184,166,0.2)" stroke="#14b8a6" strokeWidth="2" />
                  <text x="0" y="75" fill="#14b8a6" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    ISOMETRIC 3D VIEW (30° RECEDING)
                  </text>
                </g>
              )}

              {activeView === 'section' && (
                <g transform="translate(100, 40)">
                  <defs>
                    <pattern id="secHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#14b8a6" strokeWidth="1" />
                    </pattern>
                  </defs>
                  {/* Left solid metal section */}
                  <rect x="0" y="0" width="40" height="90" fill="url(#secHatch)" stroke="#14b8a6" strokeWidth="2" />
                  {/* Right solid metal section */}
                  <rect x="80" y="0" width="40" height="90" fill="url(#secHatch)" stroke="#14b8a6" strokeWidth="2" />
                  {/* Center internal bore cavity (No hatch) */}
                  <rect x="40" y="15" width="40" height="60" fill="#090d16" stroke="#14b8a6" strokeWidth="1.5" />
                  <line x1="60" y1="-10" x2="60" y2="100" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="8 2 2 2" />
                  <text x="60" y="115" fill="#14b8a6" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    SECTION A-A (INTERNAL CAVITY EXPOSED)
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. IMPORTANT ELEMENTS (ANATOMY OF A MANUFACTURING DRAWING)
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-anatomy" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">SHEET ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Anatomy of a Manufacturing Drawing</h2>
          </div>
          <p className="text-xs font-mono text-text-secondary">
            Click any annotated marker on the drawing sheet to explore its manufacturing purpose.
          </p>
        </div>

        {/* Interactive 3D Engineering Learning Experience */}
        <Anatomy3DExperience />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. ENGINEERING DRAWING STANDARDS (ASME, ISO & BIS)
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-standards" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">COMPLIANCE & GOVERNANCE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Engineering Drawing Standards</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExpandedStandard(expandedStandard === 'asme' ? 'both' : 'asme')}
              className={`px-3 py-1 rounded-lg text-xs font-mono border transition ${
                expandedStandard === 'asme' ? 'bg-accent text-background font-bold border-accent' : 'bg-surface-elevated text-text-secondary border-border'
              }`}
            >
              ASME ONLY
            </button>
            <button
              onClick={() => setExpandedStandard(expandedStandard === 'iso' ? 'both' : 'iso')}
              className={`px-3 py-1 rounded-lg text-xs font-mono border transition ${
                expandedStandard === 'iso' ? 'bg-accent text-background font-bold border-accent' : 'bg-surface-elevated text-text-secondary border-border'
              }`}
            >
              ISO ONLY
            </button>
            <button
              onClick={() => setExpandedStandard('both')}
              className={`px-3 py-1 rounded-lg text-xs font-mono border transition ${
                expandedStandard === 'both' ? 'bg-accent text-background font-bold border-accent' : 'bg-surface-elevated text-text-secondary border-border'
              }`}
            >
              EXPAND BOTH
            </button>
          </div>
        </div>

        {/* Two Expandable Standard Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ASME Standards Group */}
          {(expandedStandard === 'asme' || expandedStandard === 'both') && (
            <div className="p-5 rounded-xl bg-surface-elevated border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <h3 className="font-bold text-text-primary text-base">ASME Standards (North America)</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  AMERICAN NATIONAL STANDARDS
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { code: 'ASME Y14.5', title: 'Dimensioning and Tolerancing (GD&T)', desc: 'The global benchmark for geometric tolerancing, datum reference frames, and MMC modifiers.' },
                  { code: 'ASME Y14.1', title: 'Drawing Sheet Size and Format', desc: 'Standardizes ANSI imperial sheet sizes (A: 8.5×11", B: 11×17", C, D, E) and title block layouts.' },
                  { code: 'ASME Y14.3', title: 'Multiview and Sectional-View Drawings', desc: 'Standardizes third-angle orthographic projection, auxiliary views, and section cutting planes.' },
                ].map((std, i) => (
                  <div key={i} className="p-3 rounded-lg bg-surface border border-border/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-accent font-mono">{std.code}</span>
                    </div>
                    <h5 className="text-xs font-semibold text-text-primary">{std.title}</h5>
                    <p className="text-[11px] text-text-secondary">{std.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ISO Standards Group */}
          {(expandedStandard === 'iso' || expandedStandard === 'both') && (
            <div className="p-5 rounded-xl bg-surface-elevated border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <h3 className="font-bold text-text-primary text-base">ISO Standards (International)</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  INTERNATIONAL ORGANIZATION FOR STANDARDIZATION
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {[
                  { code: 'ISO 128', title: 'General Principles of Presentation', desc: 'Linework conventions, view directions, cut sections, and cross-hatching rules.' },
                  { code: 'ISO 129-1', title: 'Technical Product Documentation: Dimensioning', desc: 'General principles of linear, angular, and radius dimensioning.' },
                  { code: 'ISO 1101', title: 'Geometrical Product Specifications (GPS) — Tolerancing', desc: 'Geometrical tolerancing of form, orientation, location, and runout.' },
                  { code: 'ISO 2768', title: 'General Tolerances (Parts 1 & 2)', desc: 'Standard general tolerances for linear dimensions and geometrical features without individual callouts.' },
                  { code: 'ISO 5455', title: 'Technical Drawings: Scales', desc: 'Designation of recommended scales (1:1, 1:2, 1:5, 2:1, 5:1, etc.).' },
                  { code: 'ISO 5456', title: 'Projection Methods (Parts 1–4)', desc: 'Orthographic, axonometric, and central projection guidelines (First Angle standard).' },
                  { code: 'ISO 5457', title: 'Drawing Sheet Sizes and Layout', desc: 'Standard A0–A4 metrics, trimming marks, borders, and margins.' },
                  { code: 'ISO 7200', title: 'Data Fields in Title Blocks and Document Headers', desc: 'Mandatory and optional title block metadata and traceability fields.' },
                ].map((std, i) => (
                  <div key={i} className="p-3 rounded-lg bg-surface border border-border/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-accent font-mono">{std.code}</span>
                    </div>
                    <h5 className="text-xs font-semibold text-text-primary">{std.title}</h5>
                    <p className="text-[11px] text-text-secondary">{std.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BIS / IS Standards Note for Indian Engineering */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇮🇳</span>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Bureau of Indian Standards (BIS / IS Standards)
            </h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            In Indian mechanical and industrial engineering, relevant <strong className="text-accent">IS / BIS standards</strong> (such as <strong className="text-text-primary">IS 10714 / SP 46: Engineering Drawing Practice for Schools and Colleges</strong> and IS 2062 for structural steel specifications) are harmonized closely with ISO standards. When preparing drawings for Indian defense, railway (RDSO), automotive, or public sector manufacturing, compliance with Bureau of Indian Standards guidelines is mandatory.
          </p>
        </div>

        {/* Comparison Panel: ASME vs ISO Practice Differences */}
        <div className="p-5 rounded-xl bg-surface-elevated border border-accent/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">⚖️</span>
            <h4 className="text-sm font-bold text-text-primary">Technical Comparison: ASME vs ISO Practices</h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            ASME and ISO approaches differ in specific GD&T symbols, default envelope principles (Rule #1 in ASME vs Independency Principle in ISO 8015 unless modified with E symbol), datum reference syntax, and projection systems (ISO typically utilizes First Angle Projection, whereas ASME standardizes on Third Angle Projection).
          </p>
          <div className="p-3 bg-surface rounded-lg border border-border text-xs font-mono text-accent">
            <strong>Important Industry Rule:</strong> Never mix ASME and ISO rules arbitrarily on the same drawing. Always adhere strictly to the drafting standard formally designated in the drawing title block or customer contract requirements.
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TITLE BLOCK CREATION & INTERACTIVE SAMPLES
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-titleblock" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">METADATA & TRACEABILITY</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Understanding the Drawing Title Block</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTitleBlockSample('bracket')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                activeTitleBlockSample === 'bracket'
                  ? 'bg-accent text-background border-accent'
                  : 'bg-surface-elevated text-text-secondary border-border hover:text-text-primary'
              }`}
            >
              SAMPLE 1: MOUNTING BRACKET
            </button>
            <button
              onClick={() => setActiveTitleBlockSample('shaft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                activeTitleBlockSample === 'shaft'
                  ? 'bg-accent text-background border-accent'
                  : 'bg-surface-elevated text-text-secondary border-border hover:text-text-primary'
              }`}
            >
              SAMPLE 2: DRIVE SHAFT
            </button>
          </div>
        </div>

        {/* Definition */}
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
            “A title block is an information panel, normally located in the bottom-right corner of an engineering drawing. It identifies the drawing and records details required for interpretation, approval, revision control, and traceability.”
          </p>
        </div>

        {/* Interactive Title Block Renderer */}
        <div className="p-5 rounded-2xl bg-background border-2 border-accent/40 shadow-xl space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-accent border-b border-border/60 pb-2">
            <span>
              {activeTitleBlockSample === 'bracket' ? 'SAMPLE 1 • LASAK-MECH-001' : 'SAMPLE 2 • DS-001'}
            </span>
            <span className="text-text-secondary">STANDARDS: ISO 7200 / ISO 5457 / ISO 5455</span>
          </div>

          {/* SAMPLE 1: MOUNTING BRACKET */}
          {activeTitleBlockSample === 'bracket' && (
            <div className="border-2 border-accent/60 rounded-lg overflow-hidden bg-surface text-xs font-mono">
              {/* Row 1: Company Header */}
              <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-border/80">
                <div className="sm:col-span-7 p-3 border-b sm:border-b-0 sm:border-r border-border/80 bg-accent/10">
                  <span className="text-[10px] text-accent block font-bold">COMPANY NAME:</span>
                  <span className="text-sm font-black text-text-primary tracking-wide">LASAK Technologies Pvt. Ltd.</span>
                </div>
                <div className="sm:col-span-5 p-3 flex flex-col justify-center bg-surface-elevated">
                  <span className="text-[10px] text-text-secondary block">DRAWING NUMBER:</span>
                  <span className="text-sm font-black text-accent">LASAK-MECH-001</span>
                </div>
              </div>

              {/* Row 2: Part Name & Material */}
              <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-border/80">
                <div className="sm:col-span-6 p-2.5 border-b sm:border-b-0 sm:border-r border-border/80">
                  <span className="text-[10px] text-text-secondary block">DRAWING TITLE / PART NAME:</span>
                  <span className="font-bold text-text-primary">Mounting Bracket</span>
                </div>
                <div className="sm:col-span-6 p-2.5">
                  <span className="text-[10px] text-text-secondary block">MATERIAL:</span>
                  <span className="font-bold text-text-primary">Mild Steel – IS 2062</span>
                </div>
              </div>

              {/* Row 3: Scales, Projection, Sheet */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border/80 divide-x divide-border/80">
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">SCALE:</span>
                  <span className="font-bold text-accent">1:2</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">SHEET SIZE:</span>
                  <span className="font-bold text-text-primary">A3</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">PROJECTION:</span>
                  <span className="font-bold text-text-primary flex items-center gap-1">
                    First Angle ⦶
                  </span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">REVISION:</span>
                  <span className="font-bold text-amber-400">Rev. 01</span>
                </div>
              </div>

              {/* Row 4: Sign-offs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-border/80 divide-y sm:divide-y-0 sm:divide-x divide-border/80 bg-surface-elevated/40">
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">DRAWN BY:</span>
                  <span className="font-semibold text-text-primary">S. Gautham</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">CHECKED BY:</span>
                  <span className="font-semibold text-text-primary">Mechanical Design Engineer</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">APPROVED BY:</span>
                  <span className="font-semibold text-accent">Project Manager</span>
                </div>
              </div>

              {/* Row 5: Surface Finish, Weight, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">SURFACE FINISH:</span>
                  <span className="font-semibold text-text-primary">Ra 3.2 µm</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">CALCULATED WEIGHT:</span>
                  <span className="font-semibold text-text-primary">1.25 kg</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">RELEASE DATE:</span>
                  <span className="font-semibold text-text-primary">24-07-2026</span>
                </div>
              </div>
            </div>
          )}

          {/* SAMPLE 2: DRIVE SHAFT */}
          {activeTitleBlockSample === 'shaft' && (
            <div className="border-2 border-accent/60 rounded-lg overflow-hidden bg-surface text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-border/80">
                <div className="sm:col-span-7 p-3 border-b sm:border-b-0 sm:border-r border-border/80 bg-accent/10">
                  <span className="text-[10px] text-accent block font-bold">DRAWING TITLE / PART NAME:</span>
                  <span className="text-sm font-black text-text-primary tracking-wide">Drive Shaft</span>
                </div>
                <div className="sm:col-span-5 p-3 flex flex-col justify-center bg-surface-elevated">
                  <span className="text-[10px] text-text-secondary block">DRAWING NUMBER:</span>
                  <span className="text-sm font-black text-accent">DS-001</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-border/80">
                <div className="sm:col-span-6 p-2.5 border-b sm:border-b-0 sm:border-r border-border/80">
                  <span className="text-[10px] text-text-secondary block">MATERIAL GRADE:</span>
                  <span className="font-bold text-text-primary">EN8 (Medium Carbon Steel)</span>
                </div>
                <div className="sm:col-span-6 p-2.5">
                  <span className="text-[10px] text-text-secondary block">GENERAL TOLERANCE:</span>
                  <span className="font-bold text-accent">ISO 2768-m</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border/80 divide-x divide-border/80">
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">SCALE:</span>
                  <span className="font-bold text-accent">1:1 (Full Size)</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">SHEET SIZE:</span>
                  <span className="font-bold text-text-primary">A3</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">PROJECTION:</span>
                  <span className="font-bold text-text-primary">First Angle ⦶</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">REVISION:</span>
                  <span className="font-bold text-emerald-400">Rev 00 (Initial Release)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/80 bg-surface-elevated/40">
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">DRAWN BY:</span>
                  <span className="font-semibold text-text-primary">Design Engineer</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">CHECKED BY:</span>
                  <span className="font-semibold text-text-primary">Senior Engineer</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-text-secondary block">APPROVED BY:</span>
                  <span className="font-semibold text-accent">Engineering Manager</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-[10px] font-mono text-text-secondary gap-2 pt-1">
            <span>* Illustrative educational title blocks based on mechanical engineering reference curriculum.</span>
            <span className="text-accent">Standards: ISO 7200 (Data fields) • ISO 5457 (Layout) • ISO 5455 (Scales)</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. INDUSTRY DRAFTING WORKFLOW (10-STAGE INTERACTIVE STEPPER)
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-workflow" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">EXECUTION PIPELINE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Industry Drafting Workflow</h2>
          </div>
          <div className="px-3 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold">
            10 Standard Industry Stages
          </div>
        </div>

        {/* Horizontal Stepper (Desktop) / Vertical Stepper (Mobile) */}
        <div className="space-y-4">
          {/* Step Pill Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
            {[
              '1. 3D Model',
              '2. 2D Drawing',
              '3. Ortho Views',
              '4. Section Views',
              '5. Dimensions',
              '6. GD&T',
              '7. Surface Finish',
              '8. Notes & Matl',
              '9. Title Block',
              '10. Release',
            ].map((name, i) => {
              const stepNum = i + 1;
              const isSelected = activeWorkflowStep === stepNum;
              return (
                <button
                  key={stepNum}
                  onClick={() => setActiveWorkflowStep(stepNum)}
                  className={`p-2 rounded-lg text-center transition flex flex-col items-center border text-[11px] font-mono ${
                    isSelected
                      ? 'bg-accent text-background font-bold border-accent shadow-md'
                      : 'bg-surface-elevated text-text-secondary border-border hover:border-accent/40'
                  }`}
                >
                  <span className="text-xs font-bold">0{stepNum}</span>
                  <span className="truncate w-full mt-0.5">{name.replace(/^\d+\.\s*/, '')}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          <div className="p-6 rounded-2xl bg-surface-elevated border border-border space-y-4">
            {[
              {
                step: 1,
                title: 'Stage 1: 3D Model Preparation',
                desc: 'Start with the fully constrained 3D parametric CAD solid model of the component or assembly.',
                details: 'Ensure complete feature tree generation, verify zero interference with mating parts, assign physical material density, and export neutral STEP/IGES models.',
                standard: 'ISO 16792 / ASME Y14.41',
              },
              {
                step: 2,
                title: 'Stage 2: 2D Drawing Creation & Sheet Setup',
                desc: 'Convert the CAD model into a manufacturing-ready drawing sheet environment.',
                details: 'Select standard ISO sheet size (A0–A4), choose drawing scale (1:1, 1:2, 2:1), establish projection standard (First Angle vs Third Angle), and generate drawing borders with grid zoning.',
                standard: 'ISO 5457 / ISO 5456',
              },
              {
                step: 3,
                title: 'Stage 3: Orthographic Views Generation',
                desc: 'Project front, top, right-side, left-side, bottom, and rear views.',
                details: 'Select the most characteristic orientation for the Front View (Principal elevation). Project perpendicular views in strict horizontal and vertical alignment with hidden lines displayed where necessary.',
                standard: 'ISO 128-30 / ASME Y14.3',
              },
              {
                step: 4,
                title: 'Stage 4: Section Views & Internal Cutaways',
                desc: 'Reveal internal features, bores, counterbores, and wall thicknesses.',
                details: 'Cut through complex features using Full, Half, Offset, or Revolved section planes. Apply standardized 45° cross-hatching to distinguish solid metal from voids.',
                standard: 'ISO 128-40 / 50',
              },
              {
                step: 5,
                title: 'Stage 5: Dimensions and Tolerances',
                desc: 'Define component geometry sizes and acceptable dimensional variation.',
                details: 'Apply baseline and chain dimensions without creating redundant loops. Specify bilateral/unilateral limits and ISO hole/shaft fits (e.g. H7/g6).',
                standard: 'ISO 286 / ASME Y14.5',
              },
              {
                step: 6,
                title: 'Stage 6: GD&T (Geometric Dimensioning & Tolerancing)',
                desc: 'Specify geometric limits and control variation without restricting machining method.',
                details: 'Establish Datum Reference Framework (Primary A, Secondary B, Tertiary C). Apply feature control frames for Position (⌖), Flatness (⏥), Perpendicularity (⟂), and Runout.',
                standard: 'ASME Y14.5-2018 / ISO 1101',
              },
              {
                step: 7,
                title: 'Stage 7: Surface Finish Callouts',
                desc: 'Specify the required micro-roughness quality of machined faces.',
                details: 'Add surface roughness symbols indicating Ra values (e.g. Ra 3.2 µm turned, Ra 0.8 µm ground bearing seat), machining lay direction, and material removal rules.',
                standard: 'ISO 1302 / ASME Y14.36',
              },
              {
                step: 8,
                title: 'Stage 8: Material and Manufacturing Notes',
                desc: 'Include metallurgy designation, heat treatment, and shop-floor notes.',
                details: 'Specify raw material grade (EN24, IS 2062), hardness (58–62 HRC), protective plating (zinc, black oxide), and general notes like &quot;Break all sharp edges 0.5 mm max&quot;.',
                standard: 'ASTM / ISO 2768',
              },
              {
                step: 9,
                title: 'Stage 9: Title Block & Revision Verification',
                desc: 'Verify drawing identification, signatures, scale, and revision records.',
                details: 'Ensure complete sign-offs for Drawn By, Checked By, and Approved By. Verify projection symbol, drawing number, and initial revision status (Rev 00).',
                standard: 'ISO 7200 / ASME Y14.1',
              },
              {
                step: 10,
                title: 'Stage 10: Final Manufacturing Drawing Release',
                desc: 'Present the fully validated blueprint package for production release and CMM inspection.',
                details: 'Produce First Article Inspection (FAI) balloon drawing, coordinate measuring coordinates, and official engineering release stamps for production procurement.',
                standard: 'ISO 9001 / AS9102',
              },
            ]
              .filter((s) => s.step === activeWorkflowStep)
              .map((step) => (
                <div key={step.step} className="space-y-3 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/50 pb-2">
                    <h3 className="text-base font-bold text-accent">{step.title}</h3>
                    <span className="text-xs font-mono text-text-secondary bg-surface px-2.5 py-1 rounded border border-border">
                      {step.standard}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary font-medium">{step.desc}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{step.details}</p>

                  <div className="flex justify-between items-center pt-3 border-t border-border/50">
                    <button
                      onClick={() => setActiveWorkflowStep((prev) => (prev > 1 ? prev - 1 : 10))}
                      className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition"
                    >
                      ← Previous Stage
                    </button>
                    <span className="text-xs font-mono text-accent">Stage {step.step} of 10</span>
                    <button
                      onClick={() => setActiveWorkflowStep((prev) => (prev < 10 ? prev + 1 : 1))}
                      className="px-3 py-1.5 rounded-lg bg-accent text-background text-xs font-bold transition hover:opacity-90"
                    >
                      Next Stage →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Concluding Concept Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/15 via-surface-elevated to-surface border-2 border-accent/40 space-y-2 text-center">
          <h3 className="text-base sm:text-lg font-black text-accent tracking-wide uppercase">
            Engineering Drafting = Visual Communication + Manufacturing Information
          </h3>
          <p className="text-xs sm:text-sm text-text-primary max-w-3xl mx-auto italic">
            “A good engineering drawing allows the designer, machinist, manufacturer, and quality inspector to interpret the component consistently and without ambiguity.”
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. BENEFITS OF ENGINEERING DRAFTING
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-benefits" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">VALUE PROPOSITION</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Benefits of Engineering Drafting</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/50 transition-all space-y-2 group shadow-sm">
            <span className="text-2xl p-2 rounded-lg bg-surface border border-border inline-block group-hover:scale-110 transition-transform">
              💬
            </span>
            <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition">Clear Communication</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Communicates design intent consistently across diverse engineering, machining, assembly, and customer teams without language barriers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/50 transition-all space-y-2 group shadow-sm">
            <span className="text-2xl p-2 rounded-lg bg-surface border border-border inline-block group-hover:scale-110 transition-transform">
              🎯
            </span>
            <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition">Manufacturing Accuracy</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Helps fabrication teams manufacture components precisely to drawing requirements, minimizing scrap, re-work, and costly tooling modifications.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/50 transition-all space-y-2 group shadow-sm">
            <span className="text-2xl p-2 rounded-lg bg-surface border border-border inline-block group-hover:scale-110 transition-transform">
              🔬
            </span>
            <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition">Inspection Support</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Provides unambiguous datum references and geometric tolerances for quality teams and CMM operators to verify compliance authoritatively.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/50 transition-all space-y-2 group shadow-sm">
            <span className="text-2xl p-2 rounded-lg bg-surface border border-border inline-block group-hover:scale-110 transition-transform">
              📁
            </span>
            <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition">Documentation Control</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Supports systematic revision tracking, Engineering Change Orders (ECO), legal accountability, and long-term product lifecycle records.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. INDUSTRY BEST PRACTICES & DESIGN-RELEASE CHECKLIST
          ───────────────────────────────────────────────────────────── */}
      <section id="drafting-bestpractices" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">QUALITY GOVERNANCE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">Industry Best Practices & Release Gate</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-secondary">Release Gate Status:</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              releaseProgressPercent === 100 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {releaseProgressPercent}% VERIFIED
            </span>
          </div>
        </div>

        {/* 10 Industry Best Practices List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <span className="text-accent">📋</span> 10 Core Industry Best Practices
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { id: 1, text: 'Maintain rigorous revision control across CAD models and drawings.' },
              { id: 2, text: 'Follow the designated ISO or ASME drafting standards consistently.' },
              { id: 3, text: 'Apply GD&T where required to prevent ambiguous linear tolerance stack-ups.' },
              { id: 4, text: 'Validate the structural design through simulation (FEA/CFD) where appropriate.' },
              { id: 5, text: 'Prepare an accurate Bill of Materials (BOM) linking to every component balloon.' },
              { id: 6, text: 'Maintain standardized company drawing sheet templates and line-weight styles.' },
              { id: 7, text: 'Create consistent title blocks with complete sign-offs and projection symbols.' },
              { id: 8, text: 'Document design changes thoroughly via Engineering Change Orders (ECO).' },
              { id: 9, text: 'Conduct cross-functional peer design reviews before production release.' },
              { id: 10, text: 'Maintain accessible, organized project drawing records and neutral STEP archives.' },
            ].map((bp) => (
              <div
                key={bp.id}
                onClick={() => toggleBestPracticeCheck(bp.id)}
                className={`p-3 rounded-xl border text-xs transition cursor-pointer flex items-center gap-3 ${
                  bestPracticesChecks[bp.id]
                    ? 'bg-surface-elevated border-accent/40 text-text-primary'
                    : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!bestPracticesChecks[bp.id]}
                  onChange={() => toggleBestPracticeCheck(bp.id)}
                  className="rounded border-border text-accent focus:ring-accent cursor-pointer w-4 h-4"
                />
                <span className="font-medium">{bp.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final Design-Release Verification Checklist with Progress */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-accent/40 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-accent flex items-center gap-2">
                <span>🛡️</span> Final Design-Release Verification Gate
              </h3>
              <p className="text-xs text-text-secondary">
                Mandatory checks before stamping drawings for shop-floor machining and procurement release.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold text-accent">{releaseCompletedCount} / 10 Completed</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-surface border border-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-300"
              style={{ width: `${releaseProgressPercent}%` }}
            />
          </div>

          {/* 10 Checklist Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {[
              { id: 1, label: 'CAD model completed & fully constrained.' },
              { id: 2, label: 'Engineering drawing views generated & aligned.' },
              { id: 3, label: 'Dimensions verified with zero missing callouts.' },
              { id: 4, label: 'GD&T applied where required with datum references.' },
              { id: 5, label: 'Tolerances and fits checked against machining capabilities.' },
              { id: 6, label: 'BOM prepared & balloon numbers mapped.' },
              { id: 7, label: 'Title block verified with material, scale, and projection.' },
              { id: 8, label: 'Engineering analysis completed where applicable.' },
              { id: 9, label: 'Design review approved by Lead Mechanical Engineer.' },
              { id: 10, label: 'Final release documentation stamped & archived.' },
            ].map((item) => (
              <label
                key={item.id}
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 transition cursor-pointer ${
                  releaseChecks[item.id]
                    ? 'bg-accent/10 border-accent/40 text-text-primary'
                    : 'bg-surface border-border text-text-secondary hover:border-accent/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!releaseChecks[item.id]}
                  onChange={() => toggleReleaseCheck(item.id)}
                  className="rounded border-border text-accent focus:ring-accent cursor-pointer w-4 h-4"
                />
                <span className={releaseChecks[item.id] ? 'font-semibold text-text-primary' : ''}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-accent text-background shadow-xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Back to Top"
        >
          <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
