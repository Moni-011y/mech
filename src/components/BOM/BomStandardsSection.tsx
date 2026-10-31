import { useState, useEffect } from 'react';

interface BomStandardsSectionProps {
  onBackToBom?: () => void;
}

export default function BomStandardsSection({ onBackToBom }: BomStandardsSectionProps) {
  const [activeSection, setActiveSection] = useState<string>('standards-hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Expanded state for the 4 Standards cards
  const [expandedCard, setExpandedCard] = useState<string | null>('asme');

  // Interactive SolidWorks Workflow active step
  const [activeSwStep, setActiveSwStep] = useState<number>(1);

  // Quick Review reveal answers state
  const [showAnswers, setShowAnswers] = useState(false);

  // Company rules checklist completed items (optional interactivity)
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({
    partNumbering: true,
    bomFormat: true,
    revisionControl: true,
    materialDescriptions: true,
    purchasedComponents: true,
    drawingRelease: true,
  });

  const toggleRuleCheck = (ruleKey: string) => {
    setCheckedRules((prev) => ({
      ...prev,
      [ruleKey]: !prev[ruleKey],
    }));
  };

  const toggleCard = (cardId: string) => {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
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
              <span>BOM STANDARDS & DOCUMENTATION</span>
            </div>
          </div>

          {/* Quick jump navigation links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar text-xs font-medium">
            {[
              { id: 'standards-hero', label: 'Overview' },
              { id: 'standards-cards', label: 'Core Standards' },
              { id: 'standards-company-rules', label: 'Company Rules' },
              { id: 'standards-example-table', label: 'Sample BOM' },
              { id: 'standards-solidworks-flow', label: 'SolidWorks Flow' },
              { id: 'standards-takeaways', label: 'Key Takeaways' },
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
      <section
        id="standards-hero"
        className="relative rounded-2xl overflow-hidden bg-surface border border-border p-6 sm:p-10 shadow-xl space-y-8"
      >
        {/* Subtle CAD / Blueprint grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px), linear-gradient(to right, rgba(20,184,166,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,184,166,0.06) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              ENGINEERING DOCUMENTATION
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              BOM STANDARDS & <span className="text-accent underline decoration-accent/40 underline-offset-8">DOCUMENTATION</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-accent/90 italic">
              “Understand the standards, documentation rules, and engineering practices that ensure accurate and consistent Bills of Materials.”
            </p>

            <p className="text-sm text-text-secondary leading-relaxed pt-1">
              BOM preparation follows established engineering documentation standards and company-specific drawing practices. Standards such as ASME Y14.34, ISO 7573, ISO 7200, and ISO 128 guide part identification, callout formatting, title block integration, and technical drawing representation across mechanical industries.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-text-secondary">
              <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border">ASME Y14.34 (Associated Lists)</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border">ISO 7573 (Parts Lists)</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border">ISO 7200 (Title Blocks)</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border">ISO 128 (Drawing Principles)</span>
            </div>
          </div>

          {/* Right Column: Engineering Assembly Connected to Structured BOM List Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#090d16] border-2 border-accent/40 rounded-xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] font-mono text-accent pb-2 border-b border-border/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  ASSEMBLY ➔ BOM MAPPING
                </span>
                <span>ISO 7573 / ASME Y14.34</span>
              </div>

              {/* Vector Blueprint Drawing */}
              <svg viewBox="0 0 320 180" className="w-full h-auto text-accent">
                {/* Left: 3D Assembly Silhouette */}
                <g transform="translate(20, 25)">
                  {/* Outer Housing */}
                  <rect x="0" y="30" width="80" height="70" rx="4" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1.5" />
                  {/* Center Shaft */}
                  <rect x="-10" y="55" width="100" height="20" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.2" />
                  {/* Pinion Gear */}
                  <rect x="25" y="38" width="30" height="54" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="40" y="120" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">3D CAD MODEL</text>

                  {/* Balloon 1 (Housing) */}
                  <circle cx="10" cy="15" r="9" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.2" />
                  <text x="10" y="18" fill="#14b8a6" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">1</text>
                  <line x1="10" y1="24" x2="20" y2="40" stroke="#14b8a6" strokeWidth="0.8" />

                  {/* Balloon 2 (Gear) */}
                  <circle cx="50" cy="15" r="9" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="50" y="18" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">2</text>
                  <line x1="50" y1="24" x2="40" y2="38" stroke="#f59e0b" strokeWidth="0.8" />
                </g>

                {/* Connecting Leader Line to BOM Table */}
                <path d="M 115,70 L 155,70 L 155,40 L 175,40" fill="none" stroke="#14b8a6" strokeWidth="1.2" strokeDasharray="3 2" />
                <circle cx="175" cy="40" r="3" fill="#14b8a6" />

                {/* Right: Structured BOM List Graphic */}
                <g transform="translate(175, 20)">
                  <rect x="0" y="0" width="130" height="135" rx="4" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.2" />
                  {/* Table Header */}
                  <rect x="0" y="0" width="130" height="22" rx="4" fill="rgba(20, 184, 166, 0.2)" />
                  <text x="10" y="14" fill="#14b8a6" fontSize="8" fontFamily="monospace" fontWeight="bold">ITEM</text>
                  <text x="40" y="14" fill="#14b8a6" fontSize="8" fontFamily="monospace" fontWeight="bold">PART NO</text>
                  <text x="100" y="14" fill="#14b8a6" fontSize="8" fontFamily="monospace" fontWeight="bold">QTY</text>
                  <line x1="0" y1="22" x2="130" y2="22" stroke="#14b8a6" strokeWidth="0.8" />

                  {/* Row 1 */}
                  <text x="12" y="38" fill="#14b8a6" fontSize="8" fontFamily="monospace">1</text>
                  <text x="40" y="38" fill="#cbd5e1" fontSize="8" fontFamily="monospace">PRT-001</text>
                  <text x="105" y="38" fill="#cbd5e1" fontSize="8" fontFamily="monospace">1</text>
                  <line x1="0" y1="45" x2="130" y2="45" stroke="#334155" strokeWidth="0.5" />

                  {/* Row 2 */}
                  <text x="12" y="60" fill="#f59e0b" fontSize="8" fontFamily="monospace">2</text>
                  <text x="40" y="60" fill="#cbd5e1" fontSize="8" fontFamily="monospace">PRT-002</text>
                  <text x="105" y="60" fill="#cbd5e1" fontSize="8" fontFamily="monospace">2</text>
                  <line x1="0" y1="67" x2="130" y2="67" stroke="#334155" strokeWidth="0.5" />

                  {/* Row 3 */}
                  <text x="12" y="82" fill="#38bdf8" fontSize="8" fontFamily="monospace">3</text>
                  <text x="40" y="82" fill="#cbd5e1" fontSize="8" fontFamily="monospace">PRT-003</text>
                  <text x="105" y="82" fill="#cbd5e1" fontSize="8" fontFamily="monospace">1</text>
                  <line x1="0" y1="89" x2="130" y2="89" stroke="#334155" strokeWidth="0.5" />

                  {/* Row 4 */}
                  <text x="12" y="104" fill="#10b981" fontSize="8" fontFamily="monospace">4</text>
                  <text x="40" y="104" fill="#cbd5e1" fontSize="8" fontFamily="monospace">PRT-004</text>
                  <text x="105" y="104" fill="#cbd5e1" fontSize="8" fontFamily="monospace">2</text>
                  <line x1="0" y1="111" x2="130" y2="111" stroke="#334155" strokeWidth="0.5" />

                  <text x="65" y="125" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">PARTS LIST (ISO 7573)</text>
                </g>
              </svg>

              <div className="text-[10px] font-mono text-text-secondary text-center">
                Drawing callout balloons correspond 1-to-1 with structured parts list records.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN STANDARDS AS 4 INTERACTIVE EXPANDABLE CARDS
          ───────────────────────────────────────────────────────────── */}
      <section id="standards-cards" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">FOUNDATIONAL FRAMEWORKS</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Core Engineering Documentation Standards
            </h2>
          </div>
          <span className="text-xs font-mono text-text-secondary">
            Click any card to expand full specifications
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          These international and national standards establish the graphical linework, title block metadata, and parts-list formatting rules. Each standard addresses a specific documentation scope within engineering drawings.
        </p>

        {/* 4 Premium Expandable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 — ASME Y14.34: Associated Lists */}
          <div
            onClick={() => toggleCard('asme')}
            className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
              expandedCard === 'asme'
                ? 'bg-surface-elevated border-accent shadow-lg'
                : 'bg-surface border-border hover:border-accent/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    📜
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase block">
                      ASME STANDARDS
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      ASME Y14.34
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-accent px-2 py-0.5 rounded bg-surface border border-border">
                  {expandedCard === 'asme' ? 'COLLAPSE ▲' : 'EXPAND ▼'}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-accent">Heading: Associated Lists</h4>
                <p className="text-xs text-text-primary leading-relaxed">
                  ASME Y14.34 provides guidance for associated lists that document parts and components related to engineering drawings.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5 pt-1 text-xs text-text-secondary">
                <strong className="text-[11px] font-bold text-text-primary uppercase tracking-wider block">
                  Key Points:
                </strong>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Supports documentation of parts and components associated with engineering drawings.</li>
                  <li>Helps organize component-related information.</li>
                  <li>Supports consistent engineering documentation practices.</li>
                </ul>
              </div>

              {/* Visual Preview / Expanded Details */}
              {expandedCard === 'asme' && (
                <div className="p-3.5 rounded-xl bg-background border border-border text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                    <span>VISUAL: DRAWING CONNECTED TO ASSOCIATED LIST</span>
                    <span>AMERICAN NATIONAL STANDARD</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Under ASME Y14.34, associated lists can be created as integral parts lists directly on the drawing sheet or as standalone documents (such as Parts Lists, Data Lists, Index Lists, and Wire Lists) referenced directly by drawing number.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-text-secondary pt-2 border-t border-border/40 flex justify-between items-center">
              <span>Scope: Associated Lists & Drawing Parts</span>
              <span className="text-accent">Click to toggle</span>
            </div>
          </div>

          {/* Card 2 — ISO 7573: Parts Lists */}
          <div
            onClick={() => toggleCard('iso7573')}
            className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
              expandedCard === 'iso7573'
                ? 'bg-surface-elevated border-accent shadow-lg'
                : 'bg-surface border-border hover:border-accent/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    📋
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                      INTERNATIONAL STANDARD
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      ISO 7573
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-accent px-2 py-0.5 rounded bg-surface border border-border">
                  {expandedCard === 'iso7573' ? 'COLLAPSE ▲' : 'EXPAND ▼'}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-accent">Heading: Parts Lists</h4>
                <p className="text-xs text-text-primary leading-relaxed">
                  ISO 7573 covers general principles for parts lists used in technical product documentation.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5 pt-1 text-xs text-text-secondary">
                <strong className="text-[11px] font-bold text-text-primary uppercase tracking-wider block">
                  Key Points:
                </strong>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Organizes the components belonging to a product or assembly.</li>
                  <li>Helps present parts-list information consistently.</li>
                  <li>Supports the preparation of structured technical documentation.</li>
                </ul>
              </div>

              {/* Visual Preview / Expanded Details */}
              {expandedCard === 'iso7573' && (
                <div className="p-3.5 rounded-xl bg-background border border-border text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                    <span>VISUAL: BOM TABLE WITH ITEM NUMBERS & QUANTITIES</span>
                    <span>GLOBAL PRESENTATION PRINCIPLE</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Specifies standard column headers including Item Number, Part Description, Quantity, Unit, Material Designation, and Reference Documents, ensuring immediate legibility by manufacturing and procurement personnel internationally.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-text-secondary pt-2 border-t border-border/40 flex justify-between items-center">
              <span>Scope: Product Assembly Parts Lists</span>
              <span className="text-accent">Click to toggle</span>
            </div>
          </div>

          {/* Card 3 — ISO 7200: Title Blocks & Document Headers */}
          <div
            onClick={() => toggleCard('iso7200')}
            className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
              expandedCard === 'iso7200'
                ? 'bg-surface-elevated border-accent shadow-lg'
                : 'bg-surface border-border hover:border-accent/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    🏷️
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                      METADATA & TRACEABILITY
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      ISO 7200
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-accent px-2 py-0.5 rounded bg-surface border border-border">
                  {expandedCard === 'iso7200' ? 'COLLAPSE ▲' : 'EXPAND ▼'}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-accent">Heading: Title Blocks & Document Headers</h4>
                <p className="text-xs text-text-primary leading-relaxed">
                  ISO 7200 specifies data fields used in title blocks and document headers to support consistent technical documentation.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5 pt-1 text-xs text-text-secondary">
                <strong className="text-[11px] font-bold text-text-primary uppercase tracking-wider block">
                  Key Points:
                </strong>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Provides a structured approach to document identification.</li>
                  <li>Supports consistent engineering drawing and document information.</li>
                  <li>Helps organize document-related data.</li>
                </ul>
              </div>

              {/* Visual Preview / Expanded Details */}
              {expandedCard === 'iso7200' && (
                <div className="p-3.5 rounded-xl bg-background border border-border text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                    <span>VISUAL: TITLE BLOCK INFORMATION FIELDS</span>
                    <span>DATA FIELDS SPECIFICATION</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Standardizes mandatory metadata fields: Legal Owner, Identification Number, Title, Approval Date, Document Type, Sheet Number, and Paper Size, linking drawing identification directly to the BOM index.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-text-secondary pt-2 border-t border-border/40 flex justify-between items-center">
              <span>Scope: Document Headers & Metadata Fields</span>
              <span className="text-accent">Click to toggle</span>
            </div>
          </div>

          {/* Card 4 — ISO 128: Technical Drawing Principles */}
          <div
            onClick={() => toggleCard('iso128')}
            className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
              expandedCard === 'iso128'
                ? 'bg-surface-elevated border-accent shadow-lg'
                : 'bg-surface border-border hover:border-accent/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    📐
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">
                      GRAPHICAL FOUNDATION
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      ISO 128
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-accent px-2 py-0.5 rounded bg-surface border border-border">
                  {expandedCard === 'iso128' ? 'COLLAPSE ▲' : 'EXPAND ▼'}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-accent">Heading: Technical Drawing Principles</h4>
                <p className="text-xs text-text-primary leading-relaxed">
                  ISO 128 establishes general principles for technical drawings and graphical representation.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5 pt-1 text-xs text-text-secondary">
                <strong className="text-[11px] font-bold text-text-primary uppercase tracking-wider block">
                  Key Points:
                </strong>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Supports consistent graphical representation in technical drawings.</li>
                  <li>Helps communicate engineering information clearly.</li>
                  <li>Provides drawing-related principles that complement engineering documentation.</li>
                </ul>
              </div>

              {/* Visual Preview / Expanded Details */}
              {expandedCard === 'iso128' && (
                <div className="p-3.5 rounded-xl bg-background border border-border text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                    <span>VISUAL: ORTHOGRAPHIC VIEWS & TECHNICAL LINEWORK</span>
                    <span>GENERAL PRESENTATION RULES</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Governs line types (continuous, dashed hidden, chain centerlines), projection views, sectional cutaways, and leader lines with balloon circles used to link assembly drawings to BOM records.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-text-secondary pt-2 border-t border-border/40 flex justify-between items-center">
              <span>Scope: Linework, Views & Graphic Presentation</span>
              <span className="text-accent">Click to toggle</span>
            </div>
          </div>
        </div>

        {/* Scope Clarification Note */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs text-text-secondary space-y-1">
          <strong className="text-accent font-bold block">Engineering Documentation Note:</strong>
          <p>
            Each standard addresses a specific aspect of technical product documentation (linework, parts lists, title blocks, associated lists). In industrial practice, engineers follow the integrated standard system adopted by their organization or customer contract.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. COMPANY & CUSTOMER-SPECIFIC BOM RULES
          ───────────────────────────────────────────────────────────── */}
      <section id="standards-company-rules" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="border-b border-border/60 pb-3 space-y-1">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            ORGANIZATIONAL ADAPTATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Company & Customer-Specific BOM Rules
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            In addition to published standards, organizations may follow their own documentation procedures and customer-specific requirements when preparing BOMs.
          </p>
        </div>

        {/* 6 Interactive Tiles / Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              key: 'partNumbering',
              title: 'Part Numbering',
              icon: '🔢',
              desc: 'Use the required part-number format to identify components.',
              details: 'Organizations typically use structured, semi-significant, or non-significant intelligent alphanumeric schemas (e.g. PRT-MECH-042).',
            },
            {
              key: 'bomFormat',
              title: 'BOM Format',
              icon: '📊',
              desc: 'Follow the specified column structure and presentation format.',
              details: 'Configures mandatory table column ordering, text alignment, fonts, and unit measurement systems (metric vs imperial).',
            },
            {
              key: 'revisionControl',
              title: 'Revision Control',
              icon: '🔄',
              desc: 'Maintain the correct revision information.',
              details: 'Tracks revision revisions (Rev 00, Rev A), Engineering Change Order (ECO) numbers, and historical release logs.',
            },
            {
              key: 'materialDescriptions',
              title: 'Material Descriptions',
              icon: '🔬',
              desc: 'Record material information using the required descriptions.',
              details: 'Designates exact certified alloy designations (e.g., IS 2062, AISI 4140, EN8, 6061-T6) rather than ambiguous generic terms.',
            },
            {
              key: 'purchasedComponents',
              title: 'Purchased Components',
              icon: '📦',
              desc: 'Identify purchased items according to the applicable documentation rules.',
              details: 'Documents Commercial Off-The-Shelf (COTS) vendor codes, standard fastener designations, and supplier part numbers.',
            },
            {
              key: 'drawingRelease',
              title: 'Drawing Release Procedures',
              icon: '✅',
              desc: "Follow the organization's required drawing review and release process.",
              details: 'Adheres to formal sign-offs (Drawn, Checked, Approved) and ERP/PLM database vault release workflows.',
            },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => toggleRuleCheck(item.key)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 group shadow-sm ${
                checkedRules[item.key]
                  ? 'bg-surface-elevated border-accent/40 text-text-primary'
                  : 'bg-surface border-border text-text-secondary hover:border-accent/30'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-1.5 rounded-lg bg-surface border border-border group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <input
                    type="checkbox"
                    checked={!!checkedRules[item.key]}
                    onChange={() => toggleRuleCheck(item.key)}
                    className="rounded border-border text-accent focus:ring-accent cursor-pointer w-4 h-4"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent transition">
                  {item.title}
                </h4>
                <p className="text-xs font-medium text-text-secondary">
                  {item.desc}
                </p>
              </div>

              <p className="text-[11px] text-text-secondary pt-2 border-t border-border/40 leading-snug">
                {item.details}
              </p>
            </div>
          ))}
        </div>

        {/* Highlighted Note Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-accent/10 via-surface-elevated to-surface border-2 border-accent/40 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">⚠️</span>
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
              Important Engineering Practice
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
            BOM formats and documentation procedures can vary between organizations and customers. Always follow the applicable company or customer drawing standard when preparing production documentation.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. VISUAL BOM DOCUMENTATION EXAMPLE
          ───────────────────────────────────────────────────────────── */}
      <section id="standards-example-table" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">STRUCTURED SAMPLE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Visual BOM Documentation Example
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
            ILLUSTRATIVE SAMPLE
          </span>
        </div>

        {/* Clear Notice Banner */}
        <div className="p-3 rounded-lg bg-surface-elevated border border-border text-xs text-text-secondary flex items-start gap-2">
          <span className="text-accent font-bold">ℹ️</span>
          <span>
            <strong>Illustrative Example — Not a prescribed standard format.</strong> Actual BOM columns, part numbers, material descriptions, revision fields, and formatting should follow the applicable organization or customer requirements.
          </span>
        </div>

        {/* Clean Engineering Dashboard Table */}
        <div className="border border-border rounded-xl overflow-hidden shadow-lg bg-surface-elevated">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono divide-y divide-border">
              <thead>
                <tr className="bg-surface text-accent font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Item No.</th>
                  <th className="py-3 px-4 text-left">Part Number</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text-primary">
                <tr className="hover:bg-accent/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-accent">1</td>
                  <td className="py-3 px-4 font-semibold">ASM-001</td>
                  <td className="py-3 px-4">Main Assembly</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-accent/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-accent">2</td>
                  <td className="py-3 px-4 font-semibold">PRT-001</td>
                  <td className="py-3 px-4">Housing</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-accent/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-accent">3</td>
                  <td className="py-3 px-4 font-semibold">PRT-002</td>
                  <td className="py-3 px-4">Shaft</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-accent/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-accent">4</td>
                  <td className="py-3 px-4 font-semibold">PRT-003</td>
                  <td className="py-3 px-4">Gear</td>
                  <td className="py-3 px-4 text-right font-bold">2</td>
                </tr>
                <tr className="hover:bg-accent/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-accent">5</td>
                  <td className="py-3 px-4 font-semibold">PRT-004</td>
                  <td className="py-3 px-4">Bearing</td>
                  <td className="py-3 px-4 text-right font-bold">2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          In typical production blueprints, additional columns such as Material Grade (e.g., Cast Iron, EN8), Unit of Measure (EA, KG), Finish (Ra 3.2), and Drawing Revision level are incorporated according to organizational standard templates.
        </p>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BOM CREATION IN SOLIDWORKS (WORKFLOW TIMELINE)
          ───────────────────────────────────────────────────────────── */}
      <section id="standards-solidworks-flow" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">CAD PRACTICAL APPLICATION</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              BOM Creation in SolidWorks
            </h2>
          </div>
          <span className="text-xs font-mono text-text-secondary">
            7 Sequential Steps
          </span>
        </div>

        {/* Step Indicator Cards (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {[
            {
              step: 1,
              name: 'Open Assembly',
              icon: '📂',
              desc: 'Open the required assembly model.',
            },
            {
              step: 2,
              name: 'Create Drawing',
              icon: '✏️',
              desc: 'Use the assembly to create an engineering drawing.',
            },
            {
              step: 3,
              name: 'Insert BOM',
              icon: '📋',
              desc: 'Insert the Bill of Materials into the drawing.',
            },
            {
              step: 4,
              name: 'Select Template',
              icon: '📐',
              desc: 'Choose the appropriate BOM template.',
            },
            {
              step: 5,
              name: 'Number Items',
              icon: '🔢',
              desc: 'Apply automatic item numbering.',
            },
            {
              step: 6,
              name: 'Add Balloons',
              icon: '🎈',
              desc: 'Link drawing callouts to BOM items.',
            },
            {
              step: 7,
              name: 'Verify BOM',
              icon: '🔍',
              desc: 'Check the item numbers, quantities, part descriptions, and consistency with the assembly.',
            },
          ].map((st) => {
            const isSelected = activeSwStep === st.step;
            return (
              <div
                key={st.step}
                onClick={() => setActiveSwStep(st.step)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-accent/15 border-accent shadow-md'
                    : 'bg-surface-elevated border-border hover:border-accent/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{st.icon}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-accent text-background' : 'bg-surface text-text-secondary'
                    }`}>
                      0{st.step}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-text-primary mt-1">{st.name}</h4>
                  <p className="text-[11px] text-text-secondary leading-snug">{st.desc}</p>
                </div>

                <div className="text-[9px] font-mono text-accent pt-1 border-t border-border/40">
                  {isSelected ? 'SELECTED •' : 'STEP 0' + st.step}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Template & Verification */}
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-primary text-center italic">
          “Follow the applicable company template and verify all BOM information before releasing the drawing.”
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. KEY TAKEAWAYS & QUICK REVIEW INTERACTION
          ───────────────────────────────────────────────────────────── */}
      <section id="standards-takeaways" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-8 shadow-md">
        <div className="border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            SUMMARY & RETENTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
            What You Should Remember
          </h2>
        </div>

        {/* 4 Concise Takeaway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
            <span className="text-2xl">📜</span>
            <h4 className="text-xs font-bold text-text-primary">Engineering Standards</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Engineering standards support consistent technical documentation across diverse global engineering and manufacturing teams.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
            <span className="text-2xl">📦</span>
            <h4 className="text-xs font-bold text-text-primary">Component Organization</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              BOMs organize component information associated with products and assemblies into unambiguous legal documentation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
            <span className="text-2xl">🏢</span>
            <h4 className="text-xs font-bold text-text-primary">Company & Customer Rules</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Company and customer requirements determine the applicable BOM format, numbering schema, and release procedures.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
            <span className="text-2xl">🔍</span>
            <h4 className="text-xs font-bold text-text-primary">Verification Before Release</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Always verify BOM details against the assembly and the applicable drawing requirements before formal manufacturing release.
            </p>
          </div>
        </div>

        {/* Compact Quick Review Interaction */}
        <div className="p-6 rounded-2xl bg-surface-elevated border border-accent/40 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/50 pb-3">
            <div>
              <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">
                KNOWLEDGE CHECK
              </span>
              <h3 className="text-base font-bold text-text-primary">
                Quick Review
              </h3>
            </div>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="px-3 py-1.5 rounded-lg bg-accent text-background text-xs font-mono font-bold transition hover:opacity-90 shadow-sm"
            >
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Question 1 */}
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-start gap-2 font-semibold text-text-primary">
                <span className="text-accent font-bold">Q1:</span>
                <span>Which standard covers general principles for parts lists used in technical product documentation?</span>
              </div>
              {showAnswers && (
                <div className="pl-6 pt-1 text-accent font-bold animate-fadeIn">
                  Answer: ISO 7573.
                </div>
              )}
            </div>

            {/* Question 2 */}
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-start gap-2 font-semibold text-text-primary">
                <span className="text-accent font-bold">Q2:</span>
                <span>Which standard addresses data fields in title blocks and document headers?</span>
              </div>
              {showAnswers && (
                <div className="pl-6 pt-1 text-accent font-bold animate-fadeIn">
                  Answer: ISO 7200.
                </div>
              )}
            </div>

            {/* Question 3 */}
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-start gap-2 font-semibold text-text-primary">
                <span className="text-accent font-bold">Q3:</span>
                <span>Why should the applicable company or customer drawing standard be followed?</span>
              </div>
              {showAnswers && (
                <div className="pl-6 pt-1 text-accent font-bold animate-fadeIn">
                  Answer: To ensure the BOM follows the required format and documentation procedures for the organization or customer.
                </div>
              )}
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
