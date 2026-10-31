import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import MechanicalViewer from '../MechanicalViewer/MechanicalViewer';
import NpdTransformationVideoPlayer from './NpdTransformationVideoPlayer';

// 3D Product Transformation Mesh (Idea -> Concept -> CAD -> Analysis -> Prototype -> Production)
function NpdTransformation3D({ npdStage }: { npdStage: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  // Render different visual modes depending on active NPD stage
  const renderMaterial = () => {
    switch (npdStage) {
      case 0: // IDEA: Wireframe cloud
        return <meshStandardMaterial color="#38BDF8" wireframe wireframeLinewidth={2} />;
      case 1: // FEASIBILITY: Concept translucent mesh
        return <meshStandardMaterial color="#F59E0B" transparent opacity={0.4} />;
      case 2: // DESIGN: Solid CAD parametric mesh
        return <meshStandardMaterial color="#16B8A6" metalness={0.7} roughness={0.2} />;
      case 3: // ANALYSIS: FEA Stress Heatmap colors
        return <meshStandardMaterial color="#EF4444" roughness={0.5} />;
      case 4: // PROTOTYPE: 3D printed layer texture
        return <meshStandardMaterial color="#A855F7" roughness={0.9} wireframe />;
      case 5: // PRODUCTION: Polished anodized chrome assembly
      default:
        return <meshStandardMaterial color="#0EA5E9" metalness={0.95} roughness={0.05} />;
    }
  };

  const stageLabels = [
    '💡 STAGE 01: IDEA (CONCEPTUAL POINT CLOUD)',
    '🔬 STAGE 02: FEASIBILITY (LAYOUT ENVELOPE)',
    '📐 STAGE 03: DESIGN (3D SOLID CAD MODEL)',
    '📈 STAGE 04: ANALYSIS (FEA STRESS VALIDATION)',
    '🖨️ STAGE 05: PROTOTYPE (ADDITIVE FABRICATION)',
    '🚀 STAGE 06: PRODUCTION (MASS MANUFACTURING)',
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Central Mechanical Turbine Impeller housing representing the product */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[3, 0.9, 128, 32]} />
        {renderMaterial()}
      </mesh>

      <Html position={[0, 5, 0]} center>
        <div className="bg-surface-elevated/90 border border-accent text-accent px-3 py-1 rounded text-xs font-mono font-bold shadow-xl whitespace-nowrap">
          {stageLabels[npdStage]}
        </div>
      </Html>
    </group>
  );
}

export default function NpdView() {
  const [activeNpdStage, setActiveNpdStage] = useState(2);
  const [selectedBenefit, setSelectedBenefit] = useState(0);
  const [displayMode, setDisplayMode] = useState<'video' | '3d'>('video');

  const npdTimeline = [
    { num: '01', title: 'IDEA GENERATION', action: 'Market Need & Brainstorming', desc: 'Identify market gap for lightweight, high-efficiency mechanical drive units.' },
    { num: '02', title: 'FEASIBILITY STUDY', action: 'Technical & Commercial Audit', desc: 'Evaluate manufacturing costs, material availability, and preliminary ROI calculations.' },
    { num: '03', title: 'DESIGN PHASE', action: '3D CAD & Drafting', desc: 'Create 3D assembly models, detailed part drawings, and GD&T specifications in CAD.' },
    { num: '04', title: 'ANALYSIS PHASE', action: 'FEA & Simulation', desc: 'Perform FEA stress analysis, thermal checks, and flow simulations before building physical tooling.' },
    { num: '05', title: 'PROTOTYPE DEVELOPMENT', action: 'Rapid Prototyping', desc: 'Fabricate physical prototype via SLA/SLS 3D printing and CNC machining for functional bench testing.' },
    { num: '06', title: 'PRODUCTION LAUNCH', action: 'Tooling & Mass Production', desc: 'Cut production molds, calibrate CNC turning lines, and launch commercial sales.' },
  ];

  const npdBenefits = [
    {
      title: 'Business Growth',
      icon: '📈',
      tag: 'BENEFIT 01',
      tagColor: 'text-emerald-400',
      tagBg: 'bg-emerald-400/10 border-emerald-400/30',
      desc: 'Expands product catalog and opens brand-new industrial revenue streams.',
      detail: 'Bringing a new product to market opens entirely new customer segments and distribution channels. The Electric Load Vehicle, for example, taps into the rapidly growing electric logistics sector — diversifying revenue beyond existing product lines.',
    },
    {
      title: 'Innovation',
      icon: '💡',
      tag: 'BENEFIT 02',
      tagColor: 'text-yellow-400',
      tagBg: 'bg-yellow-400/10 border-yellow-400/30',
      desc: 'Pushes engineering capabilities with state-of-the-art materials and geometry.',
      detail: 'NPD forces engineers to explore new materials, manufacturing methods, and design topologies. The structured 6-stage process (Idea → Production) ensures that each innovation is rigorously validated before commercialization.',
    },
    {
      title: 'Customer Satisfaction',
      icon: '🤝',
      tag: 'BENEFIT 03',
      tagColor: 'text-sky-400',
      tagBg: 'bg-sky-400/10 border-sky-400/30',
      desc: 'Solves client pain points with higher efficiency and tailored features.',
      detail: 'Products developed through NPD are grounded in real user needs identified at the Idea Generation stage. Iterative prototyping and testing ensures the final product genuinely solves the customer problem better than existing alternatives.',
    },
    {
      title: 'Market Expansion',
      icon: '🌐',
      tag: 'BENEFIT 04',
      tagColor: 'text-violet-400',
      tagBg: 'bg-violet-400/10 border-violet-400/30',
      desc: 'Enables entry into fast-growing high-precision industrial sectors.',
      detail: 'A validated new product with a complete engineering documentation package (CAD, drawings, BOM, test reports) can be launched into new geographic markets or industrial verticals — significantly expanding the company\'s addressable market.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
            TEXTBOOK CHAPTER 05 • PROJECT 04
          </div>
          <span className="text-xs font-mono text-text-secondary">Mechanical Industrial Book</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          04 — NEW PRODUCT DEVELOPMENT (NPD)
        </h1>
        <p className="text-base sm:text-lg text-accent font-semibold italic">
          "From Idea to Commercial Product"
        </p>
        <div className="bg-surface-elevated/80 p-4 rounded-xl border border-border text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl">
          <strong className="text-text-primary font-bold">Textbook Definition:</strong> New Product Development is the process of transforming an idea into a commercial product.
        </div>
      </div>

      {/* NPD STAGES TIMELINE */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            6-STAGE PRODUCT DEVELOPMENT TIMELINE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            NPD Stages & Timeline
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {npdTimeline.map((st, idx) => {
            const isActive = activeNpdStage === idx;
            return (
              <button
                key={st.num}
                onClick={() => setActiveNpdStage(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-lg ring-2 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <span className="text-xs font-mono font-bold text-accent block">{st.num}</span>
                <span className="text-xs font-bold text-text-primary block mt-1 leading-snug">
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage Detail Panel */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/50 pb-3 gap-2">
            <div>
              <span className="text-xs font-mono text-accent font-bold">STAGE {npdTimeline[activeNpdStage].num} DETAILS</span>
              <h3 className="text-lg font-bold text-text-primary">{npdTimeline[activeNpdStage].title}</h3>
            </div>
            <p className="text-xs text-text-secondary max-w-md font-mono">{npdTimeline[activeNpdStage].action} — {npdTimeline[activeNpdStage].desc}</p>
          </div>

          {/* Stage 01 – Idea Generation */}
          {activeNpdStage === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Market Research', icon: '📊', detail: 'Identify gaps in the load transport market — demand for 750 kg electric cargo vehicles in last-mile logistics.' },
                { label: 'Brainstorming', icon: '💡', detail: 'Cross-functional team session generating product concepts for the Electric Load Vehicle chassis and powertrain.' },
                { label: 'Product Concept', icon: '🎯', detail: 'Define target specifications: 750 kg payload, electric drive, foldable hood, lightweight chassis structure.' },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-surface-elevated rounded-xl border border-border space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-bold text-text-primary">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Stage 02 – Feasibility Study */}
          {activeNpdStage === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { aspect: 'Technical Feasibility', status: 'GO', detail: 'Aluminum space frame chassis achievable with available CNC and welding processes. Motor/battery specs confirmed from supplier.' },
                { aspect: 'Commercial Feasibility', status: 'GO', detail: 'Target selling price ₹4.8 L achievable at 200+ units/yr. Break-even at 120 units.' },
                { aspect: 'Manufacturing Feasibility', status: 'GO', detail: 'Hood sheet metal pressing, chassis tube welding jig, and final assembly line all available in-house.' },
                { aspect: 'Regulatory Feasibility', status: 'REVIEW', detail: 'AIS-138 electric vehicle homologation required. Timeline: 6 months from prototype sign-off.' },
              ].map((item) => (
                <div key={item.aspect} className="p-3 bg-surface-elevated rounded-xl border border-border font-mono text-xs flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-text-primary">{item.aspect}</div>
                    <div className="text-text-secondary mt-0.5">{item.detail}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.status === 'GO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stage 03 – Design Phase */}
          {activeNpdStage === 2 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">CAD Design Activities — Electric Load Vehicle</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                {[
                  { task: 'Hood Design', icon: '🛡️', detail: 'Sheet metal hood panels with press-formed radii and hinged access' },
                  { task: 'Chassis Design', icon: '🔧', detail: '75×50×4 RHS steel space frame, MIG welded, jig-built' },
                  { task: 'Motor Mount', icon: '⚡', detail: 'BLDC hub motor mounting bracket with vibration damping pads' },
                  { task: 'Body Assembly', icon: '📝', detail: 'Full 3D assembly with BOM, mates, and exploded view drawing' },
                ].map((d) => (
                  <div key={d.task} className="p-3 bg-background rounded-lg border border-border">
                    <span className="text-xl block mb-1">{d.icon}</span>
                    <div className="font-bold text-text-primary text-[11px]">{d.task}</div>
                    <div className="text-text-secondary text-[10px] mt-0.5">{d.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 04 – Analysis Phase */}
          {activeNpdStage === 3 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Structural Analysis Results</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { test: 'Chassis Static Load (750 kg)', result: 'Max stress 187 MPa', target: 'FoS ≥ 2.5 (Yield 345 MPa)', pass: true },
                  { test: 'Hood Panel Torsion', result: 'Deflection 1.2 mm', target: '≤2 mm max', pass: true },
                  { test: 'Weld Joint FEA', result: 'Stress concentration 210 MPa', target: '≤250 MPa', pass: true },
                  { test: 'Modal Analysis (1st mode)', result: '28.4 Hz', target: '≥20 Hz (above road excitation)', pass: true },
                ].map((row) => (
                  <div key={row.test} className="p-3 bg-background rounded-lg border border-accent/20 font-mono text-xs flex justify-between items-start gap-2">
                    <div>
                      <div className="font-bold text-text-primary">{row.test}</div>
                      <div className="text-text-secondary">Result: {row.result} | Target: {row.target}</div>
                    </div>
                    <span className={row.pass ? 'text-emerald-400 font-bold shrink-0' : 'text-red-400 font-bold shrink-0'}>
                      {row.pass ? '✅ PASS' : '❌ FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 05 – Prototype Development */}
          {activeNpdStage === 4 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Prototype Build — Electric Load Vehicle (Unit 01)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { phase: 'Chassis Fabrication', icon: '🔧', detail: 'Tube cutting, jig alignment, MIG welding, grinding, and powder coat priming' },
                  { phase: 'Hood Forming', icon: '🛡️', detail: 'Sheet metal press forming, hemming, and spot welding of hood skin panels' },
                  { phase: 'Assembly & Wiring', icon: '⚡', detail: 'Motor, battery pack, controller, and instrument panel wiring loom installation' },
                ].map((item) => (
                  <div key={item.phase} className="p-3 bg-background rounded-lg border border-border font-mono text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-bold text-accent">{item.phase}</span>
                    </div>
                    <div className="text-text-secondary">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 06 – Production Launch */}
          {activeNpdStage === 5 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Production Launch — Manufacturing Support</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { dept: 'Production Planning', icon: '📋', items: ['Line balancing study', 'Cycle time 4.5 hr/unit', 'Batch size: 20 units/month'] },
                  { dept: 'Quality System', icon: '🔬', items: ['PPAP documentation', 'Control plan per IATF 16949', 'Final inspection checklist'] },
                  { dept: 'Manufacturing Support', icon: '🔧', items: ['Jig & fixture drawings', 'CNC program release', 'Operator work instructions'] },
                ].map((pkg) => (
                  <div key={pkg.dept} className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{pkg.icon}</span>
                      <span className="text-xs font-bold text-text-primary">{pkg.dept}</span>
                    </div>
                    <ul className="space-y-1">
                      {pkg.items.map((item) => (
                        <li key={item} className="text-[11px] text-text-secondary font-mono flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-secondary font-mono">Production launch complete. Electric Load Vehicle enters commercial market. NPD cycle closed.</p>
            </div>
          )}
        </div>

        {/* NPD Process Flow — Book Arrow Strip */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-border space-y-3">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">NPD PROCESS FLOW — BOOK CHAPTER 5</span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              'Idea Generation',
              'Feasibility Study',
              'Design Phase',
              'Analysis Phase',
              'Prototype Development',
              'Production Launch',
            ].map((step, idx, arr) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${
                  idx === 0 ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                  idx === arr.length - 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  'bg-accent/10 text-accent border-accent/30'
                }`}>{step}</span>
                {idx < arr.length - 1 && <span className="text-text-secondary">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK EXAMPLE: ELECTRIC LOAD VEHICLE */}
      <section className="bg-surface-elevated p-5 rounded-2xl border border-accent/30 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">BOOK — CHAPTER 5 EXAMPLE PROJECT</span>
          <span className="h-px flex-1 bg-accent/20" />
          <span className="text-xs font-mono text-text-secondary">NPD Example</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-extrabold text-text-primary">ELECTRIC LOAD VEHICLE</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">Capacity: 750 Kg</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">Electric Drive</span>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">New Product Development</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              The textbook presents the Electric Load Vehicle as the NPD example project. The vehicle has a 750 kg payload capacity and is developed through the full 6-stage NPD process — from idea generation through to production launch, with the following engineering activities:
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { activity: 'Hood Design', icon: '🛡️', desc: 'Sheet metal hood panel design with press-formed geometry, hinges, and sealing flanges.', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/30' },
            { activity: 'Chassis Design', icon: '🔧', desc: 'Structural steel space frame chassis engineered to carry 750 kg payload over varied terrain.', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
            { activity: 'Structural Analysis', icon: '🔬', desc: 'FEA stress analysis of chassis welds and hood panels to validate design safety factor.', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
            { activity: 'Manufacturing Support', icon: '🏭', desc: 'Production jigs, CNC programs, work instructions, and quality control documents for the launch.', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
          ].map((item) => (
            <div key={item.activity} className={`p-4 rounded-xl border ${item.bg} space-y-2`}>
              <div className={`flex items-center gap-2 font-bold text-sm ${item.color}`}>
                <span>{item.icon}</span>{item.activity}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NPD VISUALIZATION WORKSPACE */}
      <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
              MECHANICAL PRODUCT TRANSFORMATION
            </span>
            <h2 className="text-2xl font-extrabold text-text-primary">
              IDEA → CONCEPT → CAD → ANALYSIS → PROTOTYPE → PRODUCTION
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Watch the mechanical product transition seamlessly through engineering phases.
            </p>
          </div>

          {/* View Mode Toggle: Transformation Video (Default) vs Interactive 3D */}
          <div className="flex items-center p-1 rounded-xl bg-surface-elevated border border-border">
            <button
              onClick={() => setDisplayMode('video')}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                displayMode === 'video'
                  ? 'bg-accent text-background shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>🎬</span>
              <span>Transformation Video</span>
            </button>
            <button
              onClick={() => setDisplayMode('3d')}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                displayMode === '3d'
                  ? 'bg-accent text-background shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>🧊</span>
              <span>Interactive 3D Stages</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 h-[450px] rounded-xl overflow-hidden border border-border shadow-2xl">
            {displayMode === 'video' ? (
              <NpdTransformationVideoPlayer
                className="w-full h-full"
                onSwitchTo3d={() => setDisplayMode('3d')}
                show3dToggle={true}
              />
            ) : (
              <MechanicalViewer>
                <NpdTransformation3D npdStage={activeNpdStage} />
              </MechanicalViewer>
            )}
          </div>

          <div className="lg:col-span-4 bg-surface-elevated p-5 rounded-xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Stage Engineering Inputs / Outputs
              </h3>
              {displayMode === 'video' && (
                <button
                  onClick={() => setDisplayMode('3d')}
                  className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <span>View 3D Stage →</span>
                </button>
              )}
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="text-accent font-bold">Stage Input:</div>
                <div className="text-text-secondary mt-0.5">
                  {activeNpdStage === 0 && 'Market feedback & pain points'}
                  {activeNpdStage === 1 && 'Conceptual hand sketches'}
                  {activeNpdStage === 2 && 'Parametric CAD feature tree'}
                  {activeNpdStage === 3 && 'FEA mesh & load vectors'}
                  {activeNpdStage === 4 && '3D STEP file for additive build'}
                  {activeNpdStage === 5 && 'Validated prototype test data'}
                </div>
              </div>

              <div>
                <div className="text-accent font-bold">Stage Output:</div>
                <div className="text-text-primary mt-0.5 font-semibold">
                  {activeNpdStage === 0 && 'Project charter & target specs'}
                  {activeNpdStage === 1 && 'Feasibility report & budget'}
                  {activeNpdStage === 2 && '3D CAD solid & 2D drawings'}
                  {activeNpdStage === 3 && 'FEA stress heatmap (FoS >= 2.5)'}
                  {activeNpdStage === 4 && 'Physical bench test sample'}
                  {activeNpdStage === 5 && 'Mass production commercial unit'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NPD BENEFITS */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            TEXTBOOK LISTED BENEFITS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            NPD Benefits
          </h2>
          <p className="text-xs text-text-secondary">Select a benefit to expand its engineering context.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {npdBenefits.map((b, idx) => {
            const isActive = selectedBenefit === idx;
            return (
              <div
                key={b.title}
                onClick={() => setSelectedBenefit(idx)}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-xl ring-1 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl">{b.icon}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${b.tagColor} ${b.tagBg}`}>
                    {b.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">{b.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{b.desc}</p>
                <span className={`text-[10px] font-mono font-semibold block ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}>
                  {isActive ? '▼ EXPANDED' : 'Click to expand →'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expanded Benefit Detail */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-accent/40 shadow-lg flex gap-4 items-start">
          <span className="text-4xl shrink-0">{npdBenefits[selectedBenefit].icon}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-extrabold text-text-primary">{npdBenefits[selectedBenefit].title}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${npdBenefits[selectedBenefit].tagColor} ${npdBenefits[selectedBenefit].tagBg}`}>
                {npdBenefits[selectedBenefit].tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{npdBenefits[selectedBenefit].detail}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
