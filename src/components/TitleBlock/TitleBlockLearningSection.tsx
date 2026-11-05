import { useState, useEffect } from 'react';

interface TitleBlockLearningSectionProps {
  onBackToTopics?: () => void;
}

export default function TitleBlockLearningSection({ onBackToTopics }: TitleBlockLearningSectionProps) {
  const [activeSection, setActiveSection] = useState<string>('tb-hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Anatomy Marker selection (1 to 15)
  const [selectedMarker, setSelectedMarker] = useState<number>(1);

  // Field details expanded card
  const [expandedField, setExpandedField] = useState<string | null>('company');

  // Interactive sample title block active inspected field
  const [inspectedSampleField, setInspectedSampleField] = useState<string>('partName');

  // Quick Review Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const correctQuizAnswers: Record<number, string> = {
    1: 'B',
    2: 'B',
    3: 'C',
    4: 'B',
    5: 'B',
  };

  const handleSelectAnswer = (qNum: number, option: string) => {
    if (submittedQuiz) return;
    setQuizAnswers((prev) => ({ ...prev, [qNum]: option }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setSubmittedQuiz(false);
  };

  const quizScore = Object.keys(correctQuizAnswers).reduce((acc, q) => {
    const qNum = Number(q);
    return acc + (quizAnswers[qNum] === correctQuizAnswers[qNum] ? 1 : 0);
  }, 0);

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
            {onBackToTopics && (
              <button
                onClick={onBackToTopics}
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
              <span>CHAPTER 11 • TITLE BLOCK CREATION</span>
            </div>
          </div>

          {/* Quick jump navigation links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar text-xs font-medium">
            {[
              { id: 'tb-hero', label: 'Overview' },
              { id: 'tb-purpose', label: '9 Purposes' },
              { id: 'tb-anatomy', label: 'Anatomy' },
              { id: 'tb-fields', label: 'Field Details' },
              { id: 'tb-sample-studio', label: 'Sample Studio' },
              { id: 'tb-shaft-example', label: 'Drive Shaft' },
              { id: 'tb-revision-flow', label: 'Revisions' },
              { id: 'tb-quiz', label: 'Quick Quiz' },
              { id: 'tb-takeaways', label: 'Takeaways' },
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
          2. HERO SECTION — TITLE BLOCK CREATION
          ───────────────────────────────────────────────────────────── */}
      <section
        id="tb-hero"
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
          {/* Left Column: Heading & Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              ENGINEERING DRAWING DOCUMENTATION
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              TITLE BLOCK <span className="text-accent underline decoration-accent/40 underline-offset-8">CREATION</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-accent/90 italic">
              “Learn how engineering drawing information is organized, identified, reviewed, and controlled through a professional mechanical drawing title block.”
            </p>

            <p className="text-sm text-text-secondary leading-relaxed pt-1">
              A title block is an information panel generally located at the bottom-right corner of a mechanical engineering drawing. It contains essential information about the drawing, component, company, designer, scale, material, revision, and approval details.
            </p>

            <p className="text-xs text-text-secondary leading-relaxed">
              It helps engineers, designers, manufacturers, and inspectors identify, understand, control, and manage a drawing. Its primary importance is in providing legal identification, revision control, and manufacturing traceability across the product lifecycle.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-text-secondary">
              <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border">ISO 7200 Title Blocks</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border">ASME Y14.1 Formats</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border">ISO 5457 Sheet Layouts</span>
            </div>
          </div>

          {/* Right Column: Blueprint-Style Drawing Sheet with Highlighted Title Block */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#090d16] border-2 border-accent/40 rounded-xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] font-mono text-accent pb-2 border-b border-border/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  DRAWING SHEET LAYOUT (ISO A3)
                </span>
                <span>ZONE D4</span>
              </div>

              {/* Vector Blueprint Drawing */}
              <svg viewBox="0 0 320 220" className="w-full h-auto text-accent">
                {/* Outer Paper Boundary */}
                <rect x="5" y="5" width="310" height="210" rx="3" fill="#070b12" stroke="#334155" strokeWidth="1" />
                {/* Inner Border Margin */}
                <rect x="18" y="18" width="284" height="184" fill="none" stroke="#14b8a6" strokeWidth="1.2" />

                {/* Drawing Viewport Graphics (Front & Side view silhouettes) */}
                <g transform="translate(35, 35)">
                  {/* Front Elevation */}
                  <rect x="0" y="20" width="70" height="50" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1.5" />
                  <circle cx="35" cy="45" r="12" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                  <line x1="35" y1="10" x2="35" y2="80" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="6 2 2 2" />
                  <line x1="-10" y1="45" x2="80" y2="45" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="6 2 2 2" />
                  {/* Dimensions */}
                  <line x1="0" y1="10" x2="70" y2="10" stroke="#94a3b8" strokeWidth="0.8" />
                  <text x="35" y="6" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">120 mm</text>

                  {/* Side Profile */}
                  <rect x="100" y="20" width="30" height="50" fill="rgba(20, 184, 166, 0.1)" stroke="#14b8a6" strokeWidth="1.2" />
                  <text x="115" y="80" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">PROFILE</text>
                </g>

                {/* HIGHLIGHTED TITLE BLOCK (Bottom-Right Corner) */}
                <g transform="translate(130, 130)">
                  {/* Glowing Outline */}
                  <rect x="0" y="0" width="172" height="72" fill="#0f172a" stroke="#14b8a6" strokeWidth="2" />
                  <rect x="0" y="0" width="172" height="72" fill="rgba(20, 184, 166, 0.12)" />

                  {/* Internal Grid Lines */}
                  <line x1="0" y1="24" x2="172" y2="24" stroke="#14b8a6" strokeWidth="1" />
                  <line x1="0" y1="48" x2="172" y2="48" stroke="#14b8a6" strokeWidth="1" />
                  <line x1="90" y1="0" x2="90" y2="48" stroke="#14b8a6" strokeWidth="1" />
                  <line x1="130" y1="48" x2="130" y2="72" stroke="#14b8a6" strokeWidth="1" />

                  {/* Content inside title block */}
                  <text x="6" y="10" fill="#94a3b8" fontSize="5" fontFamily="monospace">COMPANY:</text>
                  <text x="6" y="19" fill="#14b8a6" fontSize="7" fontFamily="monospace" fontWeight="bold">LASAK Tech</text>

                  <text x="96" y="10" fill="#94a3b8" fontSize="5" fontFamily="monospace">PART NAME:</text>
                  <text x="96" y="19" fill="#cbd5e1" fontSize="7" fontFamily="monospace" fontWeight="bold">Mounting Bracket</text>

                  <text x="6" y="34" fill="#94a3b8" fontSize="5" fontFamily="monospace">DRG NO:</text>
                  <text x="6" y="43" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">LASAK-MECH-001</text>

                  <text x="96" y="34" fill="#94a3b8" fontSize="5" fontFamily="monospace">MATERIAL:</text>
                  <text x="96" y="43" fill="#cbd5e1" fontSize="7" fontFamily="monospace">EN8 Steel</text>

                  <text x="6" y="58" fill="#94a3b8" fontSize="5" fontFamily="monospace">SCALE: 1:2</text>
                  <text x="6" y="67" fill="#94a3b8" fontSize="5" fontFamily="monospace">SHEET: A3</text>
                  <text x="65" y="63" fill="#f59e0b" fontSize="6" fontFamily="monospace">REV: 01</text>

                  <text x="136" y="58" fill="#94a3b8" fontSize="5" fontFamily="monospace">PROJECTION:</text>
                  <text x="136" y="67" fill="#14b8a6" fontSize="7" fontFamily="monospace">1st Angle ⦶</text>
                </g>

                {/* Callout Indicator to Title Block */}
                <line x1="100" y1="165" x2="125" y2="165" stroke="#14b8a6" strokeWidth="1.2" strokeDasharray="2 2" />
                <circle cx="100" cy="165" r="3" fill="#14b8a6" />
                <text x="95" y="180" fill="#14b8a6" fontSize="7" fontFamily="monospace" textAnchor="end">TITLE BLOCK</text>
              </svg>

              <div className="text-[10px] font-mono text-text-secondary text-center">
                Standard Location: Lower-right corner of sheet border per ISO 7200 & ASME Y14.1.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION — PURPOSE OF A TITLE BLOCK (9 PURPOSES)
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-purpose" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="border-b border-border/60 pb-3 space-y-1">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            FUNCTIONAL IMPORTANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Why Is a Title Block Important?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            A mechanical drawing title block serves nine essential legal, manufacturing, and configuration management functions:
          </p>
        </div>

        {/* 9 Icon-Based Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              num: 1,
              title: 'Identify the Part or Assembly',
              icon: '🧩',
              desc: 'Specifies the official part name (e.g. Motor Mounting Bracket, Drive Shaft) so personnel immediately know what component is depicted.',
            },
            {
              num: 2,
              title: 'Identify the Drawing Number',
              icon: '🔢',
              desc: 'Assigns a distinct, unique alphanumeric drawing number (e.g. LASAK-MECH-001) for ERP, PDM, and PLM database traceability.',
            },
            {
              num: 3,
              title: 'Specify the Material',
              icon: '🔬',
              desc: 'Identifies the exact raw stock or alloy grade (EN8, Mild Steel IS 2062, SS304, Al 6061) required for fabrication.',
            },
            {
              num: 4,
              title: 'Mention the Drawing Scale',
              icon: '📐',
              desc: 'States the proportional ratio between the printed/drawn geometry and actual physical dimensions (1:1, 1:2, 2:1).',
            },
            {
              num: 5,
              title: 'Identify Designer & Checker',
              icon: '✍️',
              desc: 'Records the signatures/names of the drafter (Drawn By) and checking engineer (Checked By) for quality assurance.',
            },
            {
              num: 6,
              title: 'Record Revision History',
              icon: '🔄',
              desc: 'Logs the current version number (Rev 00, Rev 01) linked to Engineering Change Orders (ECO) to prevent machining obsolete parts.',
            },
            {
              num: 7,
              title: 'Specify Drawing Sheet Size',
              icon: '📄',
              desc: 'Indicates the designated standard paper format (A0, A1, A2, A3, A4) for correct scaling during printing and plotting.',
            },
            {
              num: 8,
              title: 'Provide Company & Project Information',
              icon: '🏢',
              desc: 'Establishes intellectual property ownership, corporate branding, legal copyrights, and customer project codes.',
            },
            {
              num: 9,
              title: 'Maintain Drawing Control & Traceability',
              icon: '🛡️',
              desc: 'Serves as a binding technical contract between engineering, procurement, machining, and final quality inspection.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-accent/50 transition-all space-y-2 group shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-1.5 rounded-lg bg-surface border border-border group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-bold">
                    ROLE 0{item.num}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent transition">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pt-1 border-t border-border/40">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION — ANATOMY OF A TITLE BLOCK (INTERACTIVE SHEET)
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-anatomy" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">SHEET ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Anatomy of a Title Block
            </h2>
          </div>
          <span className="text-xs font-mono text-text-secondary">
            Click any numbered marker below to inspect that specific field
          </span>
        </div>

        {/* Interactive Drawing Sheet Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left/Main: Visual Sheet Drawing with 15 Markers */}
          <div className="lg:col-span-8 bg-[#070b14] p-4 sm:p-6 rounded-2xl border-2 border-accent/40 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-accent">
              <span>INTERACTIVE DRAWING SHEET • ISO 7200 NUMBERED FIELDS</span>
              <span>CLICK A NUMBERED MARKER</span>
            </div>

            {/* Title Block Detailed Schematic Grid with Numbered Markers */}
            <div className="border-2 border-accent rounded-lg p-3 bg-surface text-xs font-mono space-y-2">
              <div className="text-[10px] text-accent/80 font-bold uppercase tracking-wider pb-1 border-b border-border">
                TITLE BLOCK REGION (BOTTOM-RIGHT OF SHEET)
              </div>

              {/* Row 1: Company (1) & Part Name (2) */}
              <div className="grid grid-cols-12 gap-2 border-b border-border pb-2">
                <div
                  onClick={() => setSelectedMarker(1)}
                  className={`col-span-6 p-2 rounded cursor-pointer transition border ${
                    selectedMarker === 1 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary">1. COMPANY / LOGO</span>
                    <span className="w-4 h-4 rounded-full bg-accent text-background flex items-center justify-center text-[9px] font-bold">1</span>
                  </div>
                  <strong className="text-xs block text-text-primary">LASAK Technologies Pvt. Ltd.</strong>
                </div>

                <div
                  onClick={() => setSelectedMarker(2)}
                  className={`col-span-6 p-2 rounded cursor-pointer transition border ${
                    selectedMarker === 2 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary">2. DRAWING TITLE / PART NAME</span>
                    <span className="w-4 h-4 rounded-full bg-accent text-background flex items-center justify-center text-[9px] font-bold">2</span>
                  </div>
                  <strong className="text-xs block text-text-primary">Motor Mounting Bracket</strong>
                </div>
              </div>

              {/* Row 2: Drawing No (3) & Material (4) */}
              <div className="grid grid-cols-12 gap-2 border-b border-border pb-2">
                <div
                  onClick={() => setSelectedMarker(3)}
                  className={`col-span-6 p-2 rounded cursor-pointer transition border ${
                    selectedMarker === 3 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary">3. DRAWING NUMBER</span>
                    <span className="w-4 h-4 rounded-full bg-accent text-background flex items-center justify-center text-[9px] font-bold">3</span>
                  </div>
                  <strong className="text-xs block text-accent">LASAK-MECH-001</strong>
                </div>

                <div
                  onClick={() => setSelectedMarker(4)}
                  className={`col-span-6 p-2 rounded cursor-pointer transition border ${
                    selectedMarker === 4 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary">4. MATERIAL</span>
                    <span className="w-4 h-4 rounded-full bg-accent text-background flex items-center justify-center text-[9px] font-bold">4</span>
                  </div>
                  <strong className="text-xs block text-text-primary">EN8 (Medium Carbon Steel)</strong>
                </div>
              </div>

              {/* Row 3: Scale (5), Sheet Size (6), Drawn By (7), Checked By (8) */}
              <div className="grid grid-cols-12 gap-2 border-b border-border pb-2">
                <div
                  onClick={() => setSelectedMarker(5)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 5 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">5. SCALE</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">5</span>
                  </div>
                  <span className="text-xs font-bold block text-text-primary">1:2</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(6)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 6 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">6. SHEET</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">6</span>
                  </div>
                  <span className="text-xs font-bold block text-text-primary">A3</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(7)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 7 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">7. DRAWN BY</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">7</span>
                  </div>
                  <span className="text-[11px] font-semibold block text-text-primary truncate">S. Gautham</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(8)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 8 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">8. CHECKED BY</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">8</span>
                  </div>
                  <span className="text-[11px] font-semibold block text-text-primary truncate">Design Engr</span>
                </div>
              </div>

              {/* Row 4: Approved By (9), Date (10), Revision (11), Projection (12) */}
              <div className="grid grid-cols-12 gap-2 border-b border-border pb-2">
                <div
                  onClick={() => setSelectedMarker(9)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 9 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">9. APPROVED</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">9</span>
                  </div>
                  <span className="text-[11px] font-semibold block text-text-primary truncate">Manager</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(10)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 10 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">10. DATE</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">10</span>
                  </div>
                  <span className="text-[11px] font-semibold block text-text-primary">24-07-2026</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(11)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 11 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">11. REVISION</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">11</span>
                  </div>
                  <span className="text-[11px] font-bold block text-amber-400">Rev. 01</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(12)}
                  className={`col-span-3 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 12 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">12. PROJECTION</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">12</span>
                  </div>
                  <span className="text-[11px] font-bold block text-text-primary">1st Angle ⦶</span>
                </div>
              </div>

              {/* Row 5: General Tolerance (13), Surface Finish (14), Weight (15) */}
              <div className="grid grid-cols-12 gap-2">
                <div
                  onClick={() => setSelectedMarker(13)}
                  className={`col-span-4 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 13 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">13. GENERAL TOL</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">13</span>
                  </div>
                  <span className="text-[11px] font-bold block text-text-primary">ISO 2768-m</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(14)}
                  className={`col-span-4 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 14 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">14. FINISH</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">14</span>
                  </div>
                  <span className="text-[11px] font-bold block text-text-primary">Ra 3.2 µm</span>
                </div>

                <div
                  onClick={() => setSelectedMarker(15)}
                  className={`col-span-4 p-1.5 rounded cursor-pointer transition border ${
                    selectedMarker === 15 ? 'bg-accent/20 border-accent text-accent' : 'bg-surface-elevated border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-secondary">15. WEIGHT</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-accent text-background flex items-center justify-center text-[8px] font-bold">15</span>
                  </div>
                  <span className="text-[11px] font-bold block text-text-primary">1.25 kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right/Side: Field Explanation Card for Selected Marker */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-surface-elevated border border-accent/40 space-y-4 shadow-lg">
            <div className="border-b border-border/60 pb-3">
              <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">
                FIELD INSPECTION POPUP
              </span>
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2 mt-1">
                <span className="w-6 h-6 rounded-full bg-accent text-background flex items-center justify-center text-xs font-bold">
                  {selectedMarker}
                </span>
                <span>
                  {selectedMarker === 1 && 'Company Name / Logo'}
                  {selectedMarker === 2 && 'Drawing Title / Part Name'}
                  {selectedMarker === 3 && 'Drawing Number'}
                  {selectedMarker === 4 && 'Material'}
                  {selectedMarker === 5 && 'Scale'}
                  {selectedMarker === 6 && 'Sheet Size'}
                  {selectedMarker === 7 && 'Drawn By'}
                  {selectedMarker === 8 && 'Checked By'}
                  {selectedMarker === 9 && 'Approved By'}
                  {selectedMarker === 10 && 'Date'}
                  {selectedMarker === 11 && 'Revision Number'}
                  {selectedMarker === 12 && 'Projection Method'}
                  {selectedMarker === 13 && 'General Tolerance'}
                  {selectedMarker === 14 && 'Surface Finish'}
                  {selectedMarker === 15 && 'Calculated Weight'}
                </span>
              </h3>
            </div>

            <div className="text-xs text-text-secondary leading-relaxed space-y-2">
              {selectedMarker === 1 && (
                <>
                  <p><strong>Definition:</strong> Identifies the organization responsible for the drawing.</p>
                  <p><strong>Source Example:</strong> LASAK Technologies Pvt. Ltd.</p>
                  <p><strong>Practical Application:</strong> Proves corporate copyright ownership and supplier legal accountability.</p>
                </>
              )}
              {selectedMarker === 2 && (
                <>
                  <p><strong>Definition:</strong> Describes what the drawing represents clearly and descriptively.</p>
                  <p><strong>Source Example:</strong> Motor Mounting Bracket</p>
                  <p><strong>Other Book Examples:</strong> Shaft Assembly, Gear Housing, Conveyor Roller, Pump Base, Bearing Housing.</p>
                </>
              )}
              {selectedMarker === 3 && (
                <>
                  <p><strong>Definition:</strong> A unique identification number assigned to avoid confusion across ERP and engineering archives.</p>
                  <p><strong>Source Example:</strong> LASAK-MECH-001</p>
                  <p><strong>Deconstruction:</strong> LASAK = Company, MECH = Mechanical discipline, 001 = Sequential drawing number.</p>
                </>
              )}
              {selectedMarker === 4 && (
                <>
                  <p><strong>Definition:</strong> Specifies the raw material grade required for component fabrication.</p>
                  <p><strong>Source Example:</strong> Material: EN8 (or Mild Steel – IS 2062).</p>
                  <p><strong>Other Examples:</strong> SS304, Aluminium 6061, EN19, Cast Iron, Nylon.</p>
                </>
              )}
              {selectedMarker === 5 && (
                <>
                  <p><strong>Definition:</strong> Indicates the ratio between drawing size and actual physical component dimensions.</p>
                  <p><strong>Source Example:</strong> Scale 1:2 (Half actual size).</p>
                  <p><strong>Rule:</strong> The scale never overrides specified dimensions and tolerances.</p>
                </>
              )}
              {selectedMarker === 6 && (
                <>
                  <p><strong>Definition:</strong> Specifies standard ISO drawing sheet format dimensions (A0 to A4).</p>
                  <p><strong>Source Example:</strong> Sheet: A3 (297 × 420 mm).</p>
                  <p><strong>Application:</strong> Commonly used for detailed mechanical assembly drawings in the book.</p>
                </>
              )}
              {selectedMarker === 7 && (
                <>
                  <p><strong>Definition:</strong> Identifies the design engineer or drafter who created the CAD drawing.</p>
                  <p><strong>Source Example:</strong> Drawn By: S. Gautham.</p>
                </>
              )}
              {selectedMarker === 8 && (
                <>
                  <p><strong>Definition:</strong> Identifies the person who thoroughly verifies drawing accuracy prior to sign-off.</p>
                  <p><strong>Verification Items:</strong> Dimensions, Tolerances, GD&T, Material, Drawing standards, and Manufacturing feasibility.</p>
                  <p><strong>Source Example:</strong> Checked By: Senior Design Engineer.</p>
                </>
              )}
              {selectedMarker === 9 && (
                <>
                  <p><strong>Definition:</strong> Authorized authority approving the blueprint for formal production release.</p>
                  <p><strong>Source Example:</strong> Approved By: Engineering Manager.</p>
                </>
              )}
              {selectedMarker === 10 && (
                <>
                  <p><strong>Definition:</strong> The calendar date associated with drawing creation, checking, and approval sign-off.</p>
                  <p><strong>Source Example:</strong> 24-07-2026.</p>
                </>
              )}
              {selectedMarker === 11 && (
                <>
                  <p><strong>Definition:</strong> Indicates the active version of the drawing to prevent obsolete fabrication.</p>
                  <p><strong>Source Example:</strong> REV 01 (Hole diameter modified).</p>
                </>
              )}
              {selectedMarker === 12 && (
                <>
                  <p><strong>Definition:</strong> Designates the projection view arrangement system used (First vs Third Angle).</p>
                  <p><strong>Source Example:</strong> First Angle Projection (Standard in India & Europe).</p>
                </>
              )}
              {selectedMarker === 13 && (
                <>
                  <p><strong>Definition:</strong> Establishes default permissible deviations for dimensions lacking individual tolerances.</p>
                  <p><strong>Source Example:</strong> ISO 2768-m (e.g. ±0.1mm for 0-30mm, ±0.2mm for 30-100mm, ±0.3mm for 100-300mm).</p>
                </>
              )}
              {selectedMarker === 14 && (
                <>
                  <p><strong>Definition:</strong> Declares general allowable surface roughness average.</p>
                  <p><strong>Source Example:</strong> General Surface Finish: Ra 3.2 µm.</p>
                </>
              )}
              {selectedMarker === 15 && (
                <>
                  <p><strong>Definition:</strong> Displays calculated mass from 3D CAD solid density for shipping and freight calculation.</p>
                  <p><strong>Source Example:</strong> Weight: 1.25 kg.</p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-text-secondary flex justify-between">
              <span>Standard: ISO 7200 / ASME Y14.1</span>
              <span className="text-accent font-bold">Field #{selectedMarker}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. DETAILED LEARNING CARDS FOR ALL TITLE BLOCK FIELDS (A to N)
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-fields" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="border-b border-border/60 pb-3 space-y-1">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            COMPREHENSIVE CURRICULUM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Understanding Every Title Block Field
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            In-depth definitions, practical source examples, and standards guidance for all 14 title block fields:
          </p>
        </div>

        {/* 14 Detailed Expandable Field Cards */}
        <div className="space-y-3">
          {[
            {
              id: 'company',
              letter: 'A',
              title: 'Company Name / Logo',
              summary: 'Identifies the organization responsible for the drawing and asserts intellectual property.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Identifies the organization responsible for the drawing. A company logo may also be placed in this section.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono">
                    <span className="text-accent font-bold">Source Example:</span> LASAK Technologies Pvt. Ltd.
                  </div>
                  <p><strong className="text-text-primary">Application:</strong> Identifies the drawing owner, legal entity, and customer project partner.</p>
                </div>
              ),
            },
            {
              id: 'title',
              letter: 'B',
              title: 'Drawing Title / Part Name',
              summary: 'Describes what the drawing represents clearly and descriptively.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Describes what the drawing represents. The name should be clear, concise, and descriptive.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono text-accent font-bold">
                    Highlighted Example: PART NAME: MOTOR MOUNTING BRACKET
                  </div>
                  <p><strong className="text-text-primary">Other Book Examples:</strong> Mounting Bracket, Shaft Assembly, Gear Housing, Conveyor Roller, Pump Base, Bearing Housing.</p>
                </div>
              ),
            },
            {
              id: 'drgno',
              letter: 'C',
              title: 'Drawing Number',
              summary: 'A unique identification number assigned to avoid confusion across production archives.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>A unique identification number assigned to the drawing. Each drawing must have a unique number to avoid confusion.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono space-y-1">
                    <span className="text-accent font-bold">Example Numbering System: LASAK-MECH-001</span>
                    <ul className="list-disc list-inside text-text-secondary pl-1 space-y-0.5">
                      <li><strong>LASAK</strong> = Company Designation</li>
                      <li><strong>MECH</strong> = Mechanical Engineering Department</li>
                      <li><strong>001</strong> = Serial Sequential Component Number</li>
                    </ul>
                  </div>
                </div>
              ),
            },
            {
              id: 'material',
              letter: 'D',
              title: 'Material',
              summary: 'Specifies the metallurgical alloy used to manufacture the component.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Specifies the material used to manufacture the component. The exact material specification is required for purchasing and heat treatment.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono">
                    <span className="text-accent font-bold">Primary Example:</span> Material: EN8 (Medium carbon steel)
                  </div>
                  <p><strong className="text-text-primary">Book Material Library:</strong> Mild Steel, Stainless Steel SS304, Aluminium 6061, EN8, EN19, Cast Iron, Nylon.</p>
                </div>
              ),
            },
            {
              id: 'scale',
              letter: 'E',
              title: 'Scale',
              summary: 'Indicates the relationship between drawing size and actual component size.',
              content: (
                <div className="space-y-3 text-xs text-text-secondary">
                  <p>Indicates the relationship between drawing size and actual component size.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                    <div className="p-2 rounded bg-background border border-border text-center">
                      <span className="text-accent font-bold block text-sm">1:1</span>
                      <span className="text-[10px]">Full Size</span>
                    </div>
                    <div className="p-2 rounded bg-background border border-border text-center">
                      <span className="text-accent font-bold block text-sm">1:2</span>
                      <span className="text-[10px]">Half Actual Size</span>
                    </div>
                    <div className="p-2 rounded bg-background border border-border text-center">
                      <span className="text-accent font-bold block text-sm">2:1</span>
                      <span className="text-[10px]">Twice Actual Size</span>
                    </div>
                    <div className="p-2 rounded bg-background border border-border text-center">
                      <span className="text-accent font-bold block text-sm">5:1</span>
                      <span className="text-[10px]">Five Times Size</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-accent/10 border border-accent/30 text-accent font-medium">
                    “The scale does not replace the dimensions shown on the drawing. Manufacturing should always be based on the specified dimensions and tolerances.”
                  </div>
                </div>
              ),
            },
            {
              id: 'sheet',
              letter: 'F',
              title: 'Sheet Size',
              summary: 'Specifies standard ISO paper dimensions for scaling and plotting.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Specifies the size of the drawing sheet. A3 is commonly used for detailed mechanical drawings in the book, although the appropriate size depends on drawing complexity.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-center">
                    <div className="p-1.5 rounded bg-background border border-border">A0 (841×1189)</div>
                    <div className="p-1.5 rounded bg-background border border-border">A1 (594×841)</div>
                    <div className="p-1.5 rounded bg-background border border-border">A2 (420×594)</div>
                    <div className="p-1.5 rounded bg-accent/20 border border-accent text-accent font-bold">A3 (297×420) ★</div>
                    <div className="p-1.5 rounded bg-background border border-border">A4 (210×297)</div>
                  </div>
                </div>
              ),
            },
            {
              id: 'drawn',
              letter: 'G',
              title: 'Drawn By',
              summary: 'Identifies the design drafter who modeled the CAD part and generated views.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Identifies the person who created the CAD model and technical drawing.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono">
                    <span className="text-accent font-bold">Source Example:</span> Drawn By: S. Gautham
                  </div>
                </div>
              ),
            },
            {
              id: 'checked',
              letter: 'H',
              title: 'Checked By',
              summary: 'Identifies the senior verification engineer inspecting technical compliance.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Identifies the person responsible for checking the drawing. Verifies:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[11px]">
                    <span className="p-1.5 rounded bg-background border border-border">✓ Dimensions</span>
                    <span className="p-1.5 rounded bg-background border border-border">✓ Tolerances</span>
                    <span className="p-1.5 rounded bg-background border border-border">✓ GD&T</span>
                    <span className="p-1.5 rounded bg-background border border-border">✓ Material</span>
                    <span className="p-1.5 rounded bg-background border border-border">✓ Standards</span>
                    <span className="p-1.5 rounded bg-background border border-border">✓ Feasibility</span>
                  </div>
                  <div className="p-2 rounded bg-background border border-border font-mono text-xs">
                    <span className="text-accent font-bold">Source Example:</span> Checked By: Senior Design Engineer
                  </div>
                </div>
              ),
            },
            {
              id: 'approved',
              letter: 'I',
              title: 'Approved By',
              summary: 'Authorized manager giving formal administrative release for manufacturing.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Identifies the authorized person who approves the drawing for production release and procurement.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono">
                    <span className="text-accent font-bold">Source Example:</span> Approved By: Engineering Manager
                  </div>
                </div>
              ),
            },
            {
              id: 'date',
              letter: 'J',
              title: 'Date',
              summary: 'Calendar stamp recording drawing sign-off and revision timestamps.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>The date associated with drawing creation, checking, or approval.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono">
                    <span className="text-accent font-bold">Book Example Date:</span> 24-07-2026
                  </div>
                </div>
              ),
            },
            {
              id: 'revision',
              letter: 'K',
              title: 'Revision Number',
              summary: 'Shows the current version of the drawing to prevent obsolete fabrication.',
              content: (
                <div className="space-y-3 text-xs text-text-secondary">
                  <p>Shows the current version of the drawing. A revision table is generally included near the title block.</p>
                  <div className="p-2.5 rounded bg-background border border-border overflow-x-auto">
                    <table className="w-full font-mono text-[11px] divide-y divide-border">
                      <thead>
                        <tr className="text-accent">
                          <th className="p-1 text-left">REV</th>
                          <th className="p-1 text-left">Description</th>
                          <th className="p-1 text-left">Date</th>
                          <th className="p-1 text-left">Drawn</th>
                          <th className="p-1 text-left">Approved</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        <tr>
                          <td className="p-1 font-bold text-emerald-400">00</td>
                          <td className="p-1">Initial Release</td>
                          <td className="p-1">24-07-2026</td>
                          <td className="p-1">SG</td>
                          <td className="p-1">AM</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-bold text-amber-400">01</td>
                          <td className="p-1">Hole Size Modified</td>
                          <td className="p-1">24-07-2026</td>
                          <td className="p-1">SG</td>
                          <td className="p-1">AM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ),
            },
            {
              id: 'projection',
              letter: 'L',
              title: 'Projection Method',
              summary: 'Designates whether First Angle or Third Angle projection is used.',
              content: (
                <div className="space-y-3 text-xs text-text-secondary">
                  <p>Indicates the method used to represent the views in the drawing. The appropriate projection symbol must be shown.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                    <div className="p-3 rounded bg-background border border-border space-y-1">
                      <strong className="text-accent block">First Angle Projection ⦶</strong>
                      <p className="text-[11px]">Commonly used in India and Europe. Object is placed between observer and projection plane.</p>
                    </div>
                    <div className="p-3 rounded bg-background border border-border space-y-1">
                      <strong className="text-accent block">Third Angle Projection ⦵</strong>
                      <p className="text-[11px]">Commonly used in the United States and Canada. Projection plane is between observer and object.</p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'generalTol',
              letter: 'M',
              title: 'General Tolerance',
              summary: 'Defines permissible deviations for non-toleranced linear dimensions.',
              content: (
                <div className="space-y-3 text-xs text-text-secondary">
                  <p>A title block may include general tolerance information covering all nominal dimensions not specifically toleranced.</p>
                  <div className="grid grid-cols-3 gap-2 font-mono text-center text-[11px]">
                    <div className="p-2 rounded bg-background border border-border">
                      <span className="text-accent font-bold block">±0.1 mm</span>
                      <span>0 to 30 mm</span>
                    </div>
                    <div className="p-2 rounded bg-background border border-border">
                      <span className="text-accent font-bold block">±0.2 mm</span>
                      <span>30 to 100 mm</span>
                    </div>
                    <div className="p-2 rounded bg-background border border-border">
                      <span className="text-accent font-bold block">±0.3 mm</span>
                      <span>100 to 300 mm</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-accent/10 border border-accent/30 text-accent font-medium">
                    “The actual tolerance scheme should be based on the drawing's specified standard and company practice.”
                  </div>
                </div>
              ),
            },
            {
              id: 'surface',
              letter: 'N',
              title: 'Surface Finish',
              summary: 'Specifies general baseline roughness average for machined faces.',
              content: (
                <div className="space-y-2 text-xs text-text-secondary">
                  <p>Specifies the general surface roughness requirement. Individual surfaces may have specific surface-finish symbols shown directly on the drawing.</p>
                  <div className="p-2.5 rounded bg-background border border-border font-mono">
                    <span className="text-accent font-bold">Source Example:</span> General Surface Finish: Ra 3.2 µm
                  </div>
                </div>
              ),
            },
          ].map((field) => (
            <div
              key={field.id}
              onClick={() => setExpandedField(expandedField === field.id ? null : field.id)}
              className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                expandedField === field.id
                  ? 'bg-surface-elevated border-accent shadow-md'
                  : 'bg-surface border-border hover:border-accent/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent text-background flex items-center justify-center text-[10px] font-bold font-mono">
                    {field.letter}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary">{field.title}</h4>
                </div>
                <span className="text-[10px] font-mono text-accent">
                  {expandedField === field.id ? 'CLOSE ▲' : 'DETAILS ▼'}
                </span>
              </div>
              <p className="text-xs text-text-secondary">{field.summary}</p>

              {expandedField === field.id && (
                <div className="pt-2 border-t border-border/50 animate-fadeIn">
                  {field.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION — INTERACTIVE SAMPLE TITLE BLOCK (STUDIO)
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-sample-studio" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">SAMPLE CAD ENVIRONMENT</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Interactive Sample Title Block: Motor Mounting Bracket
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-accent/10 text-accent border border-accent/20 font-bold shrink-0">
            LASAK-MECH-001
          </span>
        </div>

        {/* Clear Notice Banner */}
        <div className="p-3 rounded-lg bg-surface-elevated border border-border text-xs text-text-secondary flex items-start gap-2">
          <span className="text-accent font-bold">ℹ️</span>
          <span>
            <strong>Illustrative Title Block — Actual fields and values depend on the drawing and company requirements.</strong> Click any field in the grid below to inspect its detailed definition.
          </span>
        </div>

        {/* Interactive Title Block Layout */}
        <div className="border-2 border-accent rounded-xl overflow-hidden bg-background text-xs font-mono shadow-xl">
          {/* Row 1: Company Header */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-border">
            <div
              onClick={() => setInspectedSampleField('company')}
              className={`sm:col-span-7 p-3 border-b sm:border-b-0 sm:border-r border-border cursor-pointer transition ${
                inspectedSampleField === 'company' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">COMPANY:</span>
              <strong className="text-sm font-black text-accent tracking-wide">LASAK Technologies Pvt. Ltd.</strong>
            </div>
            <div
              onClick={() => setInspectedSampleField('drgNo')}
              className={`sm:col-span-5 p-3 flex flex-col justify-center cursor-pointer transition ${
                inspectedSampleField === 'drgNo' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">DRAWING NUMBER:</span>
              <strong className="text-sm font-black text-text-primary">LASAK-MECH-001</strong>
            </div>
          </div>

          {/* Row 2: Part Name & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-border">
            <div
              onClick={() => setInspectedSampleField('partName')}
              className={`sm:col-span-6 p-2.5 border-b sm:border-b-0 sm:border-r border-border cursor-pointer transition ${
                inspectedSampleField === 'partName' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">PART NAME:</span>
              <strong className="font-bold text-text-primary text-xs">Motor Mounting Bracket</strong>
            </div>
            <div
              onClick={() => setInspectedSampleField('material')}
              className={`sm:col-span-6 p-2.5 cursor-pointer transition ${
                inspectedSampleField === 'material' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">MATERIAL:</span>
              <strong className="font-bold text-text-primary text-xs">EN8 (Also: Mild Steel – IS 2062)</strong>
            </div>
          </div>

          {/* Row 3: Scale, Sheet Size, Projection, Revision */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border divide-x divide-border">
            <div
              onClick={() => setInspectedSampleField('scale')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'scale' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">SCALE:</span>
              <strong className="text-accent font-bold">1:2</strong>
            </div>
            <div
              onClick={() => setInspectedSampleField('sheet')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'sheet' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">SHEET SIZE:</span>
              <strong className="text-text-primary font-bold">A3</strong>
            </div>
            <div
              onClick={() => setInspectedSampleField('projection')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'projection' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">PROJECTION:</span>
              <strong className="text-text-primary font-bold">First Angle ⦶</strong>
            </div>
            <div
              onClick={() => setInspectedSampleField('revision')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'revision' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">REVISION:</span>
              <strong className="text-amber-400 font-bold">01</strong>
            </div>
          </div>

          {/* Row 4: Sign-offs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div
              onClick={() => setInspectedSampleField('drawnBy')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'drawnBy' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">DRAWN BY:</span>
              <span className="font-semibold text-text-primary">S. Gautham</span>
            </div>
            <div
              onClick={() => setInspectedSampleField('checkedBy')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'checkedBy' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">CHECKED BY:</span>
              <span className="font-semibold text-text-primary">Design Engineer</span>
            </div>
            <div
              onClick={() => setInspectedSampleField('approvedBy')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'approvedBy' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">APPROVED BY:</span>
              <span className="font-semibold text-accent">Manager</span>
            </div>
          </div>

          {/* Row 5: General Tol, Surface Finish, Weight, Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
            <div
              onClick={() => setInspectedSampleField('generalTol')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'generalTol' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">GENERAL TOL:</span>
              <span className="font-bold text-text-primary">ISO 2768-m</span>
            </div>
            <div
              onClick={() => setInspectedSampleField('surface')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'surface' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">SURFACE FINISH:</span>
              <span className="font-bold text-text-primary">Ra 3.2 µm</span>
            </div>
            <div
              onClick={() => setInspectedSampleField('weight')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'weight' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">WEIGHT:</span>
              <span className="font-bold text-text-primary">1.25 kg</span>
            </div>
            <div
              onClick={() => setInspectedSampleField('date')}
              className={`p-2 cursor-pointer transition ${
                inspectedSampleField === 'date' ? 'bg-accent/20' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <span className="text-[9px] text-text-secondary block">DATE:</span>
              <span className="font-bold text-text-primary">24-07-2026</span>
            </div>
          </div>
        </div>

        {/* Selected Field Quick Inspector Card */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-accent/40 text-xs font-mono space-y-1">
          <span className="text-accent font-bold uppercase block">
            SELECTED FIELD ANALYSIS: {inspectedSampleField.toUpperCase()}
          </span>
          <p className="text-text-secondary">
            {inspectedSampleField === 'company' && 'Identifies the legal drawing creator: LASAK Technologies Pvt. Ltd.'}
            {inspectedSampleField === 'partName' && 'Motor Mounting Bracket describes a structural bracket used to secure an electric motor.'}
            {inspectedSampleField === 'drgNo' && 'LASAK-MECH-001 represents the primary part number indexed in company PLM systems.'}
            {inspectedSampleField === 'material' && 'EN8 represents medium carbon steel with 0.36-0.44% Carbon, ideal for shafts and brackets.'}
            {inspectedSampleField === 'scale' && '1:2 means 1 unit measured on the plotted sheet equals 2 units on the physical component.'}
            {inspectedSampleField === 'sheet' && 'A3 (297 x 420 mm) provides ideal drawing real estate for detailed bracket multi-views.'}
            {inspectedSampleField === 'projection' && 'First Angle Projection places top view below front view and left view on the right.'}
            {inspectedSampleField === 'revision' && 'Revision 01 documents post-release engineering modifications (e.g. mounting hole sizes).'}
            {inspectedSampleField === 'drawnBy' && 'S. Gautham created the parametric CAD solid and drafting sheet.'}
            {inspectedSampleField === 'checkedBy' && 'Design Engineer performed tolerance stackup and GD&T verification.'}
            {inspectedSampleField === 'approvedBy' && 'Manager gave formal sign-off for shop-floor machining.'}
            {inspectedSampleField === 'generalTol' && 'ISO 2768-m establishes medium tolerance class for unstated dimensions.'}
            {inspectedSampleField === 'surface' && 'Ra 3.2 µm specifies typical fine turned/milled surface texture.'}
            {inspectedSampleField === 'weight' && '1.25 kg calculated from CAD solid volume multiplied by steel density.'}
            {inspectedSampleField === 'date' && '24-07-2026 stamps the release date for traceability.'}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION — PRACTICAL MECHANICAL DRAFTING EXAMPLE: DRIVE SHAFT
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-shaft-example" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="border-b border-border/60 pb-3 space-y-1">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            WORKED BOOK EXAMPLE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Practical Example: Drive Shaft
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Metadata Details */}
          <div className="lg:col-span-5 space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Part Name:</span>
                <strong className="text-text-primary">Drive Shaft</strong>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Drawing No.:</span>
                <strong className="text-accent">DS-001</strong>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Material:</span>
                <strong className="text-text-primary">EN8</strong>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Scale:</span>
                <strong className="text-accent">1:1 (Full Size)</strong>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Sheet:</span>
                <strong className="text-text-primary">A3</strong>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Projection:</span>
                <strong className="text-text-primary">First Angle</strong>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Drawn By:</span>
                <span>Design Engineer</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Checked By:</span>
                <span>Senior Engineer</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Approved By:</span>
                <span className="text-accent">Engineering Manager</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-text-secondary">Revision:</span>
                <span className="text-emerald-400 font-bold">Rev 00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">General Tolerance:</span>
                <span>ISO 2768-m</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed pt-1">
              “The drawing itself would then contain the views, dimensions, tolerances, GD&T symbols, surface finish symbols, and other manufacturing information required to manufacture and inspect the shaft.”
            </p>
          </div>

          {/* Right: Technical Shaft Vector Drawing */}
          <div className="lg:col-span-7 bg-[#090d16] p-5 rounded-2xl border border-border flex flex-col items-center space-y-3">
            <span className="text-[10px] font-mono text-accent">ILLUSTRATIVE DRIVE SHAFT DRAWING [DS-001]</span>
            <svg viewBox="0 0 340 160" className="w-full h-auto text-accent">
              {/* Shaft Centerline */}
              <line x1="20" y1="80" x2="320" y2="80" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="8 2 2 2" />

              {/* Stepped Shaft Geometry */}
              {/* Journal Left */}
              <rect x="40" y="65" width="60" height="30" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1.5" />
              {/* Center Bearing Seat */}
              <rect x="100" y="50" width="100" height="60" fill="rgba(20, 184, 166, 0.25)" stroke="#14b8a6" strokeWidth="1.8" />
              {/* Keyway slot on center seat */}
              <rect x="120" y="50" width="40" height="8" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
              {/* Journal Right */}
              <rect x="200" y="65" width="80" height="30" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1.5" />

              {/* Dimensions */}
              <line x1="40" y1="35" x2="280" y2="35" stroke="#94a3b8" strokeWidth="0.8" />
              <line x1="40" y1="30" x2="40" y2="40" stroke="#94a3b8" strokeWidth="0.8" />
              <line x1="280" y1="30" x2="280" y2="40" stroke="#94a3b8" strokeWidth="0.8" />
              <text x="160" y="28" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">TOTAL LENGTH = 240 mm</text>

              {/* Diameter callouts */}
              <text x="70" y="115" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">⌀30 h6</text>
              <text x="150" y="130" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">⌀60 k6 (SEAT)</text>
              <text x="240" y="115" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">⌀30 h6</text>

              {/* Mini Title Block at corner */}
              <rect x="230" y="125" width="100" height="30" fill="#0f172a" stroke="#14b8a6" strokeWidth="1" />
              <text x="235" y="136" fill="#14b8a6" fontSize="6" fontFamily="monospace">PART: DRIVE SHAFT</text>
              <text x="235" y="145" fill="#cbd5e1" fontSize="6" fontFamily="monospace">DRG: DS-001 | 1:1</text>
              <text x="235" y="152" fill="#94a3b8" fontSize="5" fontFamily="monospace">REV 00 | EN8</text>
            </svg>
            <p className="text-[10px] font-mono text-text-secondary text-center">
              Clean orthographic projection with nominal dimensions, GD&T runout, and integrated DS-001 title block.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. SECTION — REVISION CONTROL EXPLAINED VISUALLY
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-revision-flow" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="border-b border-border/60 pb-3 space-y-1">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            LIFECYCLE VERSIONING
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            How Drawing Revisions Are Recorded
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Revision details help users identify the current drawing version and track documented design changes.
          </p>
        </div>

        {/* Visual Timeline (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {[
            {
              rev: 'REV 00',
              title: 'Initial Release',
              desc: 'Original drawing approved and released to manufacturing for prototype tooling.',
              badge: 'ORIGINAL',
              color: 'text-emerald-400',
            },
            {
              rev: 'REV 01',
              title: 'Hole Diameter Modified',
              desc: 'Mounting clearance holes enlarged from ⌀8.5mm to ⌀10.5mm for bolt standardisation.',
              badge: 'ECO-101',
              color: 'text-blue-400',
            },
            {
              rev: 'REV 02',
              title: 'Material Changed',
              desc: 'Specified material upgraded from Mild Steel to EN8 to increase shear yield strength.',
              badge: 'ECO-102',
              color: 'text-amber-400',
            },
            {
              rev: 'REV 03',
              title: 'GD&T Updated',
              desc: 'Perpendicularity and true position feature control frames added to bearing seats.',
              badge: 'ECO-103',
              color: 'text-purple-400',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2 relative shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className={`text-base font-black font-mono ${item.color}`}>{item.rev}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border">
                  {item.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
              <p className="text-[11px] text-text-secondary leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-secondary italic text-center">
          * Revision tracking prevents obsolete blueprints from reaching shop-floor CNC operators and vendors.
        </p>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. QUICK REVIEW QUIZ (5 QUESTIONS)
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-quiz" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
              ASSESSMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              Quick Review Quiz
            </h2>
          </div>
          {submittedQuiz && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                Score: {quizScore} / 5 ({Math.round((quizScore / 5) * 100)}%)
              </span>
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono font-semibold text-text-primary hover:border-accent transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* 5 Questions */}
        <div className="space-y-4">
          {[
            {
              qNum: 1,
              question: 'Where is a title block generally located on a mechanical engineering drawing?',
              options: [
                { key: 'A', text: 'Top-left corner' },
                { key: 'B', text: 'Bottom-right corner' },
                { key: 'C', text: 'Center of the drawing' },
                { key: 'D', text: 'Outside the drawing sheet' },
              ],
              explanation: 'Per ISO 7200 and ASME Y14.1, title blocks are conventionally placed in the bottom-right corner of the drawing border for easy indexing when sheets are folded.',
            },
            {
              qNum: 2,
              question: 'What is the main purpose of a drawing number?',
              options: [
                { key: 'A', text: 'To specify material hardness' },
                { key: 'B', text: 'To uniquely identify a drawing' },
                { key: 'C', text: 'To determine drawing scale' },
                { key: 'D', text: 'To specify surface finish' },
              ],
              explanation: 'The drawing number uniquely identifies the drawing and links it with PDM/PLM systems and Bill of Materials entries.',
            },
            {
              qNum: 3,
              question: 'What does a scale of 1:2 represent?',
              options: [
                { key: 'A', text: 'Full-size drawing' },
                { key: 'B', text: 'Drawing twice the actual size' },
                { key: 'C', text: 'Drawing half the actual size' },
                { key: 'D', text: 'Drawing five times the actual size' },
              ],
              explanation: 'In 1:2 scale, one unit on the drawing represents two units on the actual physical component (reduction scale).',
            },
            {
              qNum: 4,
              question: "What does the revision number identify?",
              options: [
                { key: 'A', text: 'The component weight' },
                { key: 'B', text: "The drawing's current version" },
                { key: 'C', text: 'The sheet size' },
                { key: 'D', text: 'The projection angle alone' },
              ],
              explanation: 'The revision number identifies the exact version status and tracks documented changes approved via Engineering Change Orders (ECO).',
            },
            {
              qNum: 5,
              question: 'Who approves a drawing for release?',
              options: [
                { key: 'A', text: 'Any person viewing the drawing' },
                { key: 'B', text: 'The authorized approving person' },
                { key: 'C', text: 'The material supplier in every case' },
                { key: 'D', text: 'The CAD software' },
              ],
              explanation: 'Formal release requires the signature of the authorized approving engineer or manager responsible for product release.',
            },
          ].map((q) => {
            const selected = quizAnswers[q.qNum];
            const isCorrect = selected === correctQuizAnswers[q.qNum];
            return (
              <div key={q.qNum} className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                  <span className="text-accent font-mono mr-1.5">Question {q.qNum}:</span>
                  {q.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => {
                    let btnClass = 'bg-surface border-border text-text-secondary hover:border-accent/40';
                    if (submittedQuiz) {
                      if (opt.key === correctQuizAnswers[q.qNum]) {
                        btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (selected === opt.key) {
                        btnClass = 'bg-red-500/20 border-red-500 text-red-300';
                      }
                    } else if (selected === opt.key) {
                      btnClass = 'bg-accent/20 border-accent text-accent font-bold';
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectAnswer(q.qNum, opt.key)}
                        disabled={submittedQuiz}
                        className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${btnClass}`}
                      >
                        <span className="font-mono font-bold">{opt.key}.</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {submittedQuiz && (
                  <div className={`p-2.5 rounded text-xs leading-relaxed ${
                    isCorrect ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
                  }`}>
                    <strong>{isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Button */}
        {!submittedQuiz && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setSubmittedQuiz(true)}
              disabled={Object.values(quizAnswers).some((ans) => ans === null)}
              className="px-6 py-2.5 rounded-xl bg-accent text-background font-bold text-xs uppercase tracking-wider transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Submit Quiz & View Results
            </button>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FINAL KEY TAKEAWAYS
          ───────────────────────────────────────────────────────────── */}
      <section id="tb-takeaways" className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-md">
        <div className="border-b border-border/60 pb-3">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
            SUMMARY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
            Key Takeaways
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            { title: 'Identification & Traceability', desc: 'A title block provides drawing identification and legal traceability throughout production and lifecycle maintenance.' },
            { title: 'Part Name & Drawing Number', desc: 'Drawing title and unique drawing number uniquely identify the component in enterprise ERP and PLM databases.' },
            { title: 'Essential Manufacturing Specs', desc: 'Material, scale, sheet size, projection, general tolerances, and surface finish communicate core machining information.' },
            { title: 'Drawing Governance & Control', desc: 'Drawn-by, checked-by, approved-by, date, and revision fields ensure accountability and prevent outdated production.' },
            { title: 'Adherence to Standards', desc: 'Title blocks must follow designated standards (ISO 7200, ASME Y14.1) and specific customer or company requirements.' },
            { title: 'Mandatory Release Verification', desc: 'Always verify the title block details thoroughly against the assembly before final drawing release.' },
          ].map((t, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5 shadow-sm">
              <span className="text-accent font-mono text-xs font-bold">0{idx + 1}</span>
              <h3 className="text-xs font-bold text-text-primary">{t.title}</h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">{t.desc}</p>
            </div>
          ))}
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
