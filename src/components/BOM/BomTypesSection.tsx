import { useState, useEffect, Suspense } from 'react';
import EngineeringAssembly3D from './EngineeringAssembly3D';

interface BomTypesSectionProps {
  onBackToBom?: () => void;
}

export default function BomTypesSection({ onBackToBom }: BomTypesSectionProps) {
  const [activeSection, setActiveSection] = useState<string>('bom-types-hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // EBOM Interactive Selection
  const [selectedEbomChip, setSelectedEbomChip] = useState<string>('cad');

  // 3D Assembly panel selection
  const [selected3DPanel, setSelected3DPanel] = useState<'cad' | 'assembly' | 'parts' | 'material' | 'specs' | null>(null);

  // MBOM Interactive Stepper Step
  const [activeMbomStep, setActiveMbomStep] = useState<number>(1);

  // Service BOM Component Selection
  const [selectedServicePart, setSelectedServicePart] = useState<string | null>('seal');

  // Single-Level BOM Node Selection
  const [selectedSingleLevelNode, setSelectedSingleLevelNode] = useState<string>('housing');

  // Multi-Level BOM Tree Expansion State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    gearbox: true,
    motor: true,
  });
  const [selectedMultiLevelNode, setSelectedMultiLevelNode] = useState<string>('gearbox');

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAll = () => {
    setExpandedNodes({
      gearbox: true,
      motor: true,
    });
  };

  const collapseAll = () => {
    setExpandedNodes({
      gearbox: false,
      motor: false,
    });
  };

  // Scroll spy & back-to-top handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
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

  return (
    <div className="space-y-12 pb-16 text-text-primary animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
          1. STICKY SUB-NAVIGATION & HEADER BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border border-border rounded-xl shadow-md p-3 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onBackToBom && (
              <button
                onClick={onBackToBom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-border text-text-primary text-xs font-semibold border border-border transition focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Back to BOM Overview"
              >
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to BOM Hub</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-text-secondary pl-2 border-l border-border">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>BOM TYPES & STRUCTURES</span>
            </div>
          </div>

          {/* Quick jump navigation links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar text-xs font-medium">
            {[
              { id: 'bom-types-hero', label: 'Overview' },
              { id: 'bom-ebom', label: '01 EBOM' },
              { id: 'bom-mbom', label: '02 MBOM' },
              { id: 'bom-service', label: '03 Service BOM' },
              { id: 'bom-comparison', label: 'Comparison' },
              { id: 'bom-structures', label: 'Structures' },
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
          2. HERO SECTION & 3 SUMMARY CARDS
          ───────────────────────────────────────────────────────────── */}
      <section id="bom-types-hero" className="relative rounded-2xl overflow-hidden bg-surface border border-border p-6 sm:p-10 shadow-xl space-y-8">
        {/* Technical Blueprint Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px), linear-gradient(to right, rgba(20,184,166,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,184,166,0.06) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Product Lifecycle Management (PLM) • BOM Hierarchy
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
            TYPES OF <span className="text-accent underline decoration-accent/40 underline-offset-8">BILL OF MATERIALS (BOM)</span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-accent/90 italic">
            “Understand how engineering, manufacturing, and service teams organize product components throughout the product lifecycle.”
          </p>

          <p className="text-sm text-text-secondary leading-relaxed pt-1">
            A Bill of Materials (BOM) is a structured list of components and materials associated with a product or assembly. Different BOM types support engineering design, manufacturing operations, and maintenance activities.
          </p>
        </div>

        {/* 3 Summary Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Card 1: EBOM */}
          <div className="p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/60 transition shadow-md flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-lg bg-surface border border-border text-accent group-hover:scale-110 transition-transform">
                  📐
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  DESIGN & CAD
                </span>
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition">
                Engineering BOM (EBOM)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Design and engineering structure representing functional CAD geometry, part numbers, and tolerance specifications.
              </p>
            </div>
            <button
              onClick={() => scrollToSection('bom-ebom')}
              className="inline-flex items-center justify-between text-xs font-mono font-semibold text-accent hover:text-accent/80 pt-2 border-t border-border/60 transition"
            >
              <span>Explore Details</span>
              <span>↓</span>
            </button>
          </div>

          {/* Card 2: MBOM */}
          <div className="p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/60 transition shadow-md flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-lg bg-surface border border-border text-amber-400 group-hover:scale-110 transition-transform">
                  🏭
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  PRODUCTION & ROUTING
                </span>
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition">
                Manufacturing BOM (MBOM)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Manufacturing and production requirements detailing raw stock, machining steps, subassemblies, and shop-floor sequences.
              </p>
            </div>
            <button
              onClick={() => scrollToSection('bom-mbom')}
              className="inline-flex items-center justify-between text-xs font-mono font-semibold text-accent hover:text-accent/80 pt-2 border-t border-border/60 transition"
            >
              <span>Explore Details</span>
              <span>↓</span>
            </button>
          </div>

          {/* Card 3: Service BOM */}
          <div className="p-5 rounded-xl bg-surface-elevated border border-border hover:border-accent/60 transition shadow-md flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-lg bg-surface border border-border text-emerald-400 group-hover:scale-110 transition-transform">
                  🔧
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  MAINTENANCE & SPARES
                </span>
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition">
                Service BOM
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Maintenance and replacement parts catalog organizing wear items, seals, bearings, and field-service assemblies.
              </p>
            </div>
            <button
              onClick={() => scrollToSection('bom-service')}
              className="inline-flex items-center justify-between text-xs font-mono font-semibold text-accent hover:text-accent/80 pt-2 border-t border-border/60 transition"
            >
              <span>Explore Details</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION 01 — ENGINEERING BOM (EBOM)
          ───────────────────────────────────────────────────────────── */}
      <section id="bom-ebom" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">LIFECYCLE STAGE 01</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              01 — Engineering Bill of Materials (EBOM)
            </h2>
          </div>
          <div className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-secondary">
            Primary Origin: 3D CAD Solid Assembly
          </div>
        </div>

        {/* Description & Usage Flow */}
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-text-primary font-medium">
            “Created mainly by the Design / Engineering Department.”
          </p>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
            The EBOM represents the product as designed by mechanical engineers. It reflects the functional architecture in the CAD software, capturing solid models, part numbers, raw materials, engineering tolerances, and parent-child kinematic assembly relationships.
          </p>

          {/* Highlighted Usage Flow Banner */}
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
              HIGHLIGHTED USAGE FLOW:
            </span>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-text-primary font-mono">
              <span className="px-2.5 py-1 rounded bg-surface border border-border">Product Design</span>
              <span className="text-accent">➔</span>
              <span className="px-2.5 py-1 rounded bg-surface border border-border">Engineering</span>
              <span className="text-accent">➔</span>
              <span className="px-2.5 py-1 rounded bg-accent text-background">Design Review</span>
            </div>
          </div>
        </div>

        {/* Visual Chips / Compact Icon Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Core Elements of the EBOM:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'cad', icon: '🧊', label: 'CAD Components', desc: '3D parametric solid bodies, STEP AP242 geometry, and feature models.' },
              { id: 'parts', icon: '🔢', label: 'Part Numbers', desc: 'Unique engineering item identification numbers for enterprise PLM.' },
              { id: 'material', icon: '🔬', label: 'Material', desc: 'Physical alloy designation, tensile specs, and material density.' },
              { id: 'specs', icon: '📋', label: 'Design Specifications', desc: 'GD&T feature control frames, bilateral limits, and fit classes.' },
              { id: 'assembly', icon: '🧩', label: 'Assembly Structure', desc: 'Functional subassembly hierarchy and geometric mating constraints.' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedEbomChip(chip.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                  selectedEbomChip === chip.id
                    ? 'bg-accent/15 border-accent shadow-md'
                    : 'bg-surface-elevated border-border hover:border-accent/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{chip.icon}</span>
                  <span className="text-xs font-bold text-text-primary">{chip.label}</span>
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-2">{chip.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Engineering Assembly Diagram */}
        <div className="p-5 rounded-2xl bg-[#060d1a] border border-[#1e3a5f] flex flex-col space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center w-full text-[11px] font-mono text-[#14b8a6]">
            <span className="font-bold tracking-wider">ENGINEERING ASSEMBLY REVEAL &amp; DEFINITION DIAGRAM</span>
            <span className="text-[#64748b]">Focus: Product Functional Architecture</span>
          </div>

          {/* 3D Scene */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[380px] text-xs font-mono text-[#14b8a6]">
                <span className="animate-pulse">Loading 3D scene…</span>
              </div>
            }
          >
            <EngineeringAssembly3D
              selectedPanel={selected3DPanel}
              onPanelSelect={(id) => {
                setSelected3DPanel(id as typeof selected3DPanel);
                if (id) setSelectedEbomChip(id);
              }}
            />
          </Suspense>

          {/* Five Engineering Information Panels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {([
              { id: 'cad',      icon: '🧊', label: 'CAD COMPONENTS',    sub: 'Solid 3D Geometry',          detail: 'STEP AP242 parametric solids, feature-based models, assembly mates.', color: '#14b8a6' },
              { id: 'assembly', icon: '🧩', label: 'ASSEMBLY STRUCTURE', sub: 'Component hierarchy',          detail: 'Kinematic mates, parent-child hierarchy, DOF constraints.',             color: '#38bdf8' },
              { id: 'parts',    icon: '🔢', label: 'PART NUMBERS',       sub: 'e.g. ENG-402-A',             detail: 'ENG-401 Housing · ENG-402-A Shaft · ENG-403 Plate · ENG-404 Bolt.',   color: '#a78bfa' },
              { id: 'material', icon: '🔬', label: 'MATERIAL',           sub: 'Steel / EN8 / Al 6061',      detail: 'EN8 shaft 580 MPa UTS, Al 6061-T6 plates, Grade 8.8 fasteners.',      color: '#fb923c' },
              { id: 'specs',    icon: '📋', label: 'DESIGN SPECS',       sub: 'GD\u0026T \u0026 Fits Limits', detail: 'H7/f7 clearance fit, ±0.05 bilateral tol., Ra 1.6 µm finish.',        color: '#4ade80' },
            ] as const).map((panel) => {
              const active = selected3DPanel === panel.id;
              return (
                <button
                  key={panel.id}
                  onClick={() => {
                    const next = active ? null : panel.id;
                    setSelected3DPanel(next);
                    if (next) setSelectedEbomChip(next);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1 group ${
                    active
                      ? 'bg-[#0f172a] shadow-lg'
                      : 'bg-[#0a0f1e] border-[#1e3a5f] hover:border-opacity-60'
                  }`}
                  style={{
                    borderColor: active ? panel.color : undefined,
                    boxShadow: active ? `0 0 16px ${panel.color}30` : undefined,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{panel.icon}</span>
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider"
                      style={{ color: panel.color }}
                    >
                      {panel.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94a3b8] font-mono">{panel.sub}</span>
                  {active && (
                    <p className="text-[10px] text-[#cbd5e1] leading-snug mt-1 border-t border-[#1e3a5f] pt-1">
                      {panel.detail}
                    </p>
                  )}
                  <span
                    className="text-[9px] font-mono mt-auto"
                    style={{ color: panel.color }}
                  >
                    {active ? '● HIGHLIGHTED' : 'CLICK TO INSPECT →'}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#64748b] text-center max-w-lg mx-auto">
            The EBOM focuses exclusively on the engineering definition and functional configuration of a product prior to manufacturing planning.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION 02 — MANUFACTURING BOM (MBOM)
          ───────────────────────────────────────────────────────────── */}
      <section id="bom-mbom" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">LIFECYCLE STAGE 02</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              02 — Manufacturing Bill of Materials (MBOM)
            </h2>
          </div>
          <div className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-secondary">
            Primary Origin: Process & Operations Planning
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-text-primary font-medium">
            “Used by the Manufacturing Department.”
          </p>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
            The MBOM takes the design from the EBOM and reconstructs it around the actual shop-floor production routing, including raw billets, machining operations, consumables (coolants, lubricants), tooling fixtures, and assembly staging.
          </p>
        </div>

        {/* Organized Grid: 5 Core MBOM Items */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Manufacturing BOM Items:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { title: 'Raw Materials', icon: '🧱', desc: 'Bar stock, sheet plates, castings, and forgings with machining allowance.' },
              { title: 'Manufacturing Components', icon: '⚙️', desc: 'Custom in-house turned, milled, punched, and welded components.' },
              { title: 'Purchased Components', icon: '📦', desc: 'Off-the-shelf standard parts: fasteners, O-rings, bearings, and motors.' },
              { title: 'Subassemblies', icon: '🪛', desc: 'Weldments, sub-units, and pre-assembled mechanical modules.' },
              { title: 'Manufacturing Sequence', icon: '🔄', desc: 'Operations routing: cutting, turning, milling, hardening, and finishing.' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5 shadow-sm">
                <span className="text-xl">{item.icon}</span>
                <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                <p className="text-[11px] text-text-secondary leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prominent Manufacturing Sequence Visual (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-accent/40 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">
                PRODUCTION ROUTING PIPELINE
              </span>
              <h3 className="text-base font-bold text-text-primary">
                Manufacturing Sequence
              </h3>
            </div>
            <span className="text-xs font-mono text-text-secondary">
              Raw Material ➔ Machining ➔ Heat Treatment ➔ Surface Treatment ➔ Assembly
            </span>
          </div>

          {/* Stepper Display */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative pt-2">
            {[
              {
                step: 1,
                name: 'Raw Material',
                icon: '🧱',
                label: 'Billet / Stock Selection',
                details: 'Allocate certified raw bar stock or casting with calculated machining envelope.',
              },
              {
                step: 2,
                name: 'Machining',
                icon: '⚙️',
                label: 'CNC Turning & Milling',
                details: 'Generate toolpaths, establish datum faces, rough out material, and finish dimensions.',
              },
              {
                step: 3,
                name: 'Heat Treatment',
                icon: '🔥',
                label: 'Hardening & Tempering',
                details: 'Thermal cycle (e.g. induction hardening 52–56 HRC) for core toughness and wear resistance.',
              },
              {
                step: 4,
                name: 'Surface Treatment',
                icon: '✨',
                label: 'Plating / Coating',
                details: 'Apply anodizing, phosphating, zinc plating, or black oxide corrosion protection.',
              },
              {
                step: 5,
                name: 'Assembly',
                icon: '🧩',
                label: 'Final Integration',
                details: 'Press-fit bearings, torque fasteners to spec, and complete functional quality verification.',
              },
            ].map((st) => {
              const isSelected = activeMbomStep === st.step;
              return (
                <div
                  key={st.step}
                  onClick={() => setActiveMbomStep(st.step)}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-accent/15 border-accent shadow-md'
                      : 'bg-surface border-border hover:border-accent/40'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl p-1.5 rounded-lg bg-surface-elevated border border-border">
                        {st.icon}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-accent text-background' : 'bg-surface-elevated text-text-secondary'
                      }`}>
                        STEP 0{st.step}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-text-primary">{st.name}</h4>
                    <span className="text-[10px] font-mono text-accent block">{st.label}</span>
                    <p className="text-[11px] text-text-secondary leading-snug">{st.details}</p>
                  </div>

                  <div className="text-[10px] font-mono text-accent font-semibold pt-1 border-t border-border/40">
                    {isSelected ? 'ACTIVE STAGE •' : 'VIEW DETAILS →'}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-text-secondary italic text-center pt-1">
            The MBOM organizes every component, consumable, and operation strictly according to how the product is fabricated on the shop floor.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION 03 — SERVICE BOM (SERVICE BILL OF MATERIALS)
          ───────────────────────────────────────────────────────────── */}
      <section id="bom-service" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">LIFECYCLE STAGE 03</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              03 — Service Bill of Materials (Service BOM)
            </h2>
          </div>
          <div className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-secondary">
            Primary Origin: Aftermarket & Field Service
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-text-primary font-medium">
            “Used for maintenance and repair.”
          </p>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
            A Service BOM filters the complete product structure down to the components that can be inspected, serviced, overhauled, or replaced in the field. Unlike an EBOM or MBOM, it omits non-serviceable welded features and highlights wear-prone maintenance parts.
          </p>
        </div>

        {/* Maintenance Example: Pump */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/50 pb-3">
            <div>
              <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider">
                FIELD SERVICE CASE STUDY
              </span>
              <h3 className="text-lg font-bold text-text-primary">
                Example: Pump — Maintenance and Replacement Components
              </h3>
            </div>
            <span className="text-xs font-mono text-text-secondary">
              Industrial Centrifugal Pump Overhaul Kit
            </span>
          </div>

          {/* Interactive Pump Service Components Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                id: 'seal',
                name: 'Mechanical Seal',
                icon: '🔘',
                serviceType: 'Critical Wear Item',
                desc: 'An example of a component identified for service, maintenance, or replacement to prevent fluid leakage along the rotating drive shaft.',
              },
              {
                id: 'bearing',
                name: 'Bearing',
                icon: '⭕',
                serviceType: 'Periodic Replacement',
                desc: 'An example of a component identified for service, maintenance, or replacement after specified operating hours to ensure low-friction shaft rotation.',
              },
              {
                id: 'impeller',
                name: 'Impeller',
                icon: '🌀',
                serviceType: 'Hydraulic Wear Item',
                desc: 'An example of a component identified for service, maintenance, or replacement subject to fluid erosion, cavitation, and abrasive wear over time.',
              },
              {
                id: 'gasket',
                name: 'Gasket',
                icon: '🔲',
                serviceType: 'Single-Use Seal',
                desc: 'An example of a component identified for service, maintenance, or replacement during every casing disassembly to maintain pressure boundary.',
              },
              {
                id: 'oring',
                name: 'O-Ring',
                icon: '⭕',
                serviceType: 'Elastomeric Seal',
                desc: 'An example of a component identified for service, maintenance, or replacement during scheduled preventive overhaul intervals.',
              },
            ].map((part) => {
              const isSelected = selectedServicePart === part.id;
              return (
                <div
                  key={part.id}
                  onClick={() => setSelectedServicePart(part.id)}
                  onMouseEnter={() => setSelectedServicePart(part.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 group ${
                    isSelected
                      ? 'bg-accent/15 border-accent shadow-md'
                      : 'bg-surface border-border hover:border-accent/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl p-1.5 rounded-lg bg-surface-elevated border border-border group-hover:scale-110 transition-transform">
                        {part.icon}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-accent font-semibold">
                        SPARE PART
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition">
                      {part.name}
                    </h4>
                    <span className="text-[10px] font-mono text-text-secondary block mt-0.5">
                      {part.serviceType}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-snug pt-1 border-t border-border/40">
                    {part.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Simplified Technical Pump Graphic */}
          <div className="p-4 rounded-xl bg-background border border-border flex flex-col items-center space-y-2">
            <span className="text-[10px] font-mono text-accent">PUMP ASSEMBLY CROSS-SECTION WITH SERVICE PART LOCATIONS</span>
            <svg viewBox="0 0 360 140" className="w-full max-w-md h-auto text-accent">
              {/* Pump Outer Casing */}
              <path d="M 40,30 L 160,30 L 220,10 L 250,10 L 250,50 L 220,50 L 160,70 L 160,110 L 40,110 Z" fill="rgba(20,184,166,0.1)" stroke="#14b8a6" strokeWidth="1.5" />
              {/* Rotating Shaft */}
              <rect x="20" y="65" width="280" height="12" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              {/* Impeller (Center) */}
              <path d="M 80,40 L 110,40 L 95,100 L 70,100 Z" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="90" y="25" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">IMPELLER</text>
              <line x1="90" y1="28" x2="90" y2="40" stroke="#38bdf8" strokeWidth="0.8" />

              {/* Mechanical Seal */}
              <rect x="140" y="55" width="12" height="32" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              <text x="146" y="105" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">MECH. SEAL</text>
              <line x1="146" y1="95" x2="146" y2="87" stroke="#f59e0b" strokeWidth="0.8" />

              {/* Bearings Left & Right */}
              <rect x="190" y="58" width="16" height="26" fill="#10b981" stroke="#059669" strokeWidth="1" />
              <rect x="250" y="58" width="16" height="26" fill="#10b981" stroke="#059669" strokeWidth="1" />
              <text x="220" y="105" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">BEARINGS</text>
              <line x1="205" y1="95" x2="198" y2="84" stroke="#10b981" strokeWidth="0.8" />
              <line x1="235" y1="95" x2="252" y2="84" stroke="#10b981" strokeWidth="0.8" />

              {/* Gasket / O-Ring at Casing Flange */}
              <line x1="160" y1="30" x2="160" y2="70" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 2" />
              <text x="175" y="22" fill="#ef4444" fontSize="8" fontFamily="monospace">GASKET / O-RING</text>
            </svg>
            <p className="text-[10px] font-mono text-text-secondary text-center">
              * Hover or click on any component card above to review its field maintenance function.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. COMPARE THE THREE BOM TYPES (WHICH BOM SERVES WHICH PURPOSE?)
          ───────────────────────────────────────────────────────────── */}
      <section id="bom-comparison" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">CROSS-FUNCTIONAL ANALYSIS</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Which BOM Serves Which Purpose?
            </h2>
          </div>
          <span className="text-xs font-mono text-text-secondary">
            Lifecycle Purpose Comparison
          </span>
        </div>

        {/* 3 Comparison Cards (Clean Cards instead of a crowded table) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* EBOM Card */}
          <div className="p-6 rounded-2xl bg-surface-elevated border-2 border-blue-500/30 hover:border-blue-500 transition shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    📐
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Engineering BOM</h3>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">EBOM</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Primary Department:</span>
                  <strong className="text-text-primary text-xs font-semibold">Design / Engineering</strong>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Main Focus:</span>
                  <p className="text-text-primary text-xs leading-relaxed mt-0.5">
                    CAD components, part numbers, materials, design specifications, and assembly structure.
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Used During:</span>
                  <div className="mt-1 p-2 rounded-lg bg-surface border border-border text-blue-400 font-mono text-[11px] font-bold">
                    Product Design ➔ Engineering ➔ Design Review
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-text-secondary pt-3 border-t border-border/60">
              Defines: "How the product is designed to function"
            </div>
          </div>

          {/* MBOM Card */}
          <div className="p-6 rounded-2xl bg-surface-elevated border-2 border-amber-500/30 hover:border-amber-500 transition shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    🏭
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Manufacturing BOM</h3>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">MBOM</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Primary Department:</span>
                  <strong className="text-text-primary text-xs font-semibold">Manufacturing / Production</strong>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Main Focus:</span>
                  <p className="text-text-primary text-xs leading-relaxed mt-0.5">
                    Raw materials, manufacturing components, purchased components, subassemblies, and manufacturing sequence.
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Used During:</span>
                  <div className="mt-1 p-2 rounded-lg bg-surface border border-border text-amber-400 font-mono text-[11px] font-bold">
                    Process Planning ➔ Fabrication ➔ Shop Assembly
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-text-secondary pt-3 border-t border-border/60">
              Defines: "How the product is fabricated and built"
            </div>
          </div>

          {/* Service BOM Card */}
          <div className="p-6 rounded-2xl bg-surface-elevated border-2 border-emerald-500/30 hover:border-emerald-500 transition shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    🔧
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Service BOM</h3>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">SERVICE BOM</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Primary Purpose:</span>
                  <strong className="text-text-primary text-xs font-semibold">Maintenance and Repair</strong>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Main Focus:</span>
                  <p className="text-text-primary text-xs leading-relaxed mt-0.5">
                    Replacement parts, spare parts, and service components (seals, bearings, wear rings).
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">Used During:</span>
                  <div className="mt-1 p-2 rounded-lg bg-surface border border-border text-emerald-400 font-mono text-[11px] font-bold">
                    Preventive Maintenance ➔ Field Service ➔ Overhaul
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-text-secondary pt-3 border-t border-border/60">
              Defines: "How the product is maintained in service"
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION 08 — BOM STRUCTURES (SINGLE-LEVEL VS MULTI-LEVEL)
          ───────────────────────────────────────────────────────────── */}
      <section id="bom-structures" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-8 shadow-md">
        <div className="border-b border-border/60 pb-4 space-y-1">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            ARCHITECTURAL TAXONOMY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            BOM STRUCTURES
          </h2>
          <p className="text-sm font-medium text-accent italic">
            “Explore how components are organized within an assembly.”
          </p>
        </div>

        {/* Conceptual Distinction Note */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-accent/20 flex items-start gap-3 text-xs">
          <span className="text-accent text-lg">💡</span>
          <div className="space-y-1">
            <strong className="text-text-primary font-bold">BOM Types vs. BOM Structures:</strong>
            <p className="text-text-secondary leading-relaxed">
              <strong>BOM Types</strong> (EBOM, MBOM, Service BOM) represent <em>who</em> uses the bill and for what lifecycle stage. In contrast, <strong>BOM Structures</strong> (Single-Level vs Multi-Level) define the <em>depth and hierarchy</em> of how assemblies are nested.
            </p>
          </div>
        </div>

        {/* Grid for Single-Level vs Multi-Level */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* A. Single-Level BOM */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-elevated border border-border space-y-4">
            <div className="space-y-1 border-b border-border/60 pb-3">
              <span className="text-[10px] font-mono text-accent font-bold uppercase">STRUCTURE A</span>
              <h3 className="text-lg font-bold text-text-primary">Single-Level BOM</h3>
              <p className="text-xs text-text-secondary italic">
                “Shows only the immediate components of an assembly.”
              </p>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              In a single-level BOM, only direct children (Level 1) of the parent assembly are visible. It provides a simple flat list for quick purchasing or kit packing.
            </p>

            {/* Interactive Single-Level Assembly Tree */}
            <div className="p-4 rounded-xl bg-background border border-border space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-surface border border-accent/40 font-bold text-accent">
                <span>📦</span>
                <span>MAIN ASSEMBLY (LEVEL 0)</span>
              </div>

              {/* Tree connectors and children */}
              <div className="pl-6 space-y-2 border-l-2 border-accent/40 ml-4">
                {[
                  { id: 'housing', label: 'Housing', icon: '🔲', desc: 'Main structural housing enclosure (Part 01)' },
                  { id: 'shaft', label: 'Shaft', icon: '🥢', desc: 'Center rotational drive shaft (Part 02)' },
                  { id: 'gear', label: 'Gear', icon: '⚙️', desc: 'Transmission spur gear (Part 03)' },
                  { id: 'bearing', label: 'Bearing', icon: '⭕', desc: 'Deep groove ball bearing (Part 04)' },
                ].map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedSingleLevelNode(node.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                      selectedSingleLevelNode === node.id
                        ? 'bg-accent/15 border-accent text-accent font-bold'
                        : 'bg-surface border-border/80 text-text-primary hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{node.icon}</span>
                      <span>├── {node.label}</span>
                    </div>
                    <span className="text-[10px] text-text-secondary">QTY: 1</span>
                  </div>
                ))}
              </div>

              {/* Node Detail Reveal */}
              <div className="p-2.5 rounded bg-surface border border-border text-[11px] text-text-secondary mt-2">
                <span className="text-accent font-bold block mb-0.5">Selected Node Details:</span>
                {selectedSingleLevelNode === 'housing' && 'Housing — Cast iron outer enclosure enclosing rotational shaft elements.'}
                {selectedSingleLevelNode === 'shaft' && 'Shaft — Precision turned steel shaft transmitting mechanical torque.'}
                {selectedSingleLevelNode === 'gear' && 'Gear — Machined spur gear providing designated speed reduction.'}
                {selectedSingleLevelNode === 'bearing' && 'Bearing — Rolling element supporting radial shaft loads.'}
              </div>
            </div>
          </div>

          {/* B. Multi-Level BOM */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-elevated border border-border space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-mono text-accent font-bold uppercase">STRUCTURE B</span>
                <h3 className="text-lg font-bold text-text-primary">Multi-Level BOM</h3>
                <p className="text-xs text-text-secondary italic">
                  “Shows the complete product structure, including subassemblies.”
                </p>
              </div>

              {/* Expand / Collapse Controls */}
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-2.5 py-1 rounded bg-surface border border-border text-[11px] font-mono font-semibold text-text-secondary hover:text-text-primary hover:border-accent transition"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2.5 py-1 rounded bg-surface border border-border text-[11px] font-mono font-semibold text-text-secondary hover:text-text-primary hover:border-accent transition"
                >
                  Collapse All
                </button>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Multi-level BOMs show full parent-child relationships across multiple nested tiers. Click any subassembly node with the toggle arrow to expand or collapse its constituent children.
            </p>

            {/* Interactive Expandable/Collapsible Tree */}
            <div className="p-4 rounded-xl bg-background border border-border font-mono text-xs space-y-2">
              {/* Root Node: MACHINE ASSEMBLY */}
              <div
                onClick={() => setSelectedMultiLevelNode('machine')}
                className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  selectedMultiLevelNode === 'machine'
                    ? 'bg-accent/20 border-accent text-accent font-bold'
                    : 'bg-surface border-border text-text-primary font-bold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🏭</span>
                  <span>MACHINE ASSEMBLY (TOP LEVEL 0)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-accent">TOP PRODUCT</span>
              </div>

              {/* Subassemblies indentation */}
              <div className="pl-5 space-y-2 border-l-2 border-accent/40 ml-3">
                {/* 1. Gearbox Assembly (Subassembly) */}
                <div className="space-y-1">
                  <div
                    onClick={() => {
                      toggleNode('gearbox');
                      setSelectedMultiLevelNode('gearbox');
                    }}
                    className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                      selectedMultiLevelNode === 'gearbox'
                        ? 'bg-accent/15 border-accent text-accent font-semibold'
                        : 'bg-surface border-border text-text-primary hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-accent text-[11px]">{expandedNodes['gearbox'] ? '▼' : '►'}</span>
                      <span>📂</span>
                      <span>├── Gearbox Assembly (Level 1 Subassembly)</span>
                    </div>
                    <span className="text-[10px] text-text-secondary">4 PARTS</span>
                  </div>

                  {/* Gearbox Children */}
                  {expandedNodes['gearbox'] && (
                    <div className="pl-6 space-y-1 border-l-2 border-accent/20 ml-4 animate-fadeIn">
                      {[
                        { id: 'gb-housing', label: 'Housing', icon: '🔲' },
                        { id: 'gb-shaft', label: 'Shaft', icon: '🥢' },
                        { id: 'gb-gear', label: 'Gear', icon: '⚙️' },
                        { id: 'gb-bearing', label: 'Bearing', icon: '⭕' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMultiLevelNode(item.id)}
                          className={`p-1.5 rounded text-[11px] cursor-pointer transition flex items-center justify-between ${
                            selectedMultiLevelNode === item.id
                              ? 'bg-accent/15 text-accent font-bold'
                              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{item.icon}</span>
                            <span>│   ├── {item.label}</span>
                          </span>
                          <span className="text-[10px]">Level 2</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Motor Assembly (Subassembly) */}
                <div className="space-y-1">
                  <div
                    onClick={() => {
                      toggleNode('motor');
                      setSelectedMultiLevelNode('motor');
                    }}
                    className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                      selectedMultiLevelNode === 'motor'
                        ? 'bg-accent/15 border-accent text-accent font-semibold'
                        : 'bg-surface border-border text-text-primary hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-accent text-[11px]">{expandedNodes['motor'] ? '▼' : '►'}</span>
                      <span>📂</span>
                      <span>├── Motor Assembly (Level 1 Subassembly)</span>
                    </div>
                    <span className="text-[10px] text-text-secondary">2 PARTS</span>
                  </div>

                  {/* Motor Children */}
                  {expandedNodes['motor'] && (
                    <div className="pl-6 space-y-1 border-l-2 border-accent/20 ml-4 animate-fadeIn">
                      {[
                        { id: 'm-motor', label: 'Motor', icon: '⚡' },
                        { id: 'm-coupling', label: 'Coupling', icon: '🔗' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMultiLevelNode(item.id)}
                          className={`p-1.5 rounded text-[11px] cursor-pointer transition flex items-center justify-between ${
                            selectedMultiLevelNode === item.id
                              ? 'bg-accent/15 text-accent font-bold'
                              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{item.icon}</span>
                            <span>│   ├── {item.label}</span>
                          </span>
                          <span className="text-[10px]">Level 2</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Base Frame (Individual Part at Level 1) */}
                <div
                  onClick={() => setSelectedMultiLevelNode('baseframe')}
                  className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    selectedMultiLevelNode === 'baseframe'
                      ? 'bg-accent/15 border-accent text-accent font-semibold'
                      : 'bg-surface border-border text-text-primary hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-transparent text-[11px]">▪</span>
                    <span>🏗️</span>
                    <span>└── Base Frame (Level 1 Component)</span>
                  </div>
                  <span className="text-[10px] text-text-secondary">PART</span>
                </div>
              </div>
            </div>

            {/* Concluding Note */}
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-primary italic">
              “Multi-level BOMs are commonly used for complex machines and product development.”
            </div>
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
