import { useState } from 'react';
import CadFeatureSimulator from './CadFeatureSimulator/CadFeatureSimulator';
import ErrorBoundary from '../ErrorBoundary';


export default function Industrial3dModelingView() {
  const [activeBottleOp, setActiveBottleOp] = useState(4);
  const [selectedBenefit, setSelectedBenefit] = useState(0);

  const modelingBenefits = [
    {
      title: 'Visualization',
      icon: '👁️',
      tag: 'BENEFIT 01',
      tagColor: 'text-sky-400',
      tagBg: 'bg-sky-400/10 border-sky-400/30',
      desc: 'Understand product appearance before manufacturing.',
      detail: 'A 3D model provides a photorealistic 360° virtual inspection of the component before a single rupee is spent on raw material. Design reviews are conducted on-screen, catching aesthetic and functional issues early.',
    },
    {
      title: 'Design Modification',
      icon: '✏️',
      tag: 'BENEFIT 02',
      tagColor: 'text-amber-400',
      tagBg: 'bg-amber-400/10 border-amber-400/30',
      desc: 'Easily implement design changes without redrawing.',
      detail: 'Parametric CAD models store all dimensions as editable parameters. Changing a single value — such as wall thickness or fillet radius — automatically updates all dependent features, drawings, and assemblies in seconds.',
    },
    {
      title: 'Manufacturing Support',
      icon: '🏭',
      tag: 'BENEFIT 03',
      tagColor: 'text-emerald-400',
      tagBg: 'bg-emerald-400/10 border-emerald-400/30',
      desc: 'Generate accurate production data directly from the model.',
      detail: 'CAM software reads the 3D solid directly to generate CNC G-code toolpaths. 3D printing software slices the STL mesh for additive manufacturing. 2D engineering drawings with GD&T are derived from the same model — eliminating re-entry errors.',
    },
    {
      title: 'Simulation Readiness',
      icon: '📈',
      tag: 'BENEFIT 04',
      tagColor: 'text-violet-400',
      tagBg: 'bg-violet-400/10 border-violet-400/30',
      desc: 'Support FEA, CFD, and engineering analysis.',
      detail: 'A clean CAD solid is the starting point for FEA stress analysis, CFD fluid simulation, and kinematic motion studies. The 3D model geometry defines the mesh domain, load application surfaces, and constraint datums for all simulation types.',
    },
  ];



  const waterBottleOps = [
    { num: '01', name: 'SKETCHING', desc: 'Draw 2D circular profile on datum plane.' },
    { num: '02', name: 'EXTRUSION', desc: 'Extrude circular sketch into base cylinder geometry.' },
    { num: '03', name: 'SHELL FEATURE', desc: 'Remove top face and hollow out internal wall thickness (1.5 mm).' },
    { num: '04', name: 'FILLET APPLICATION', desc: 'Apply smooth radii to sharp body edges and shoulder transitions.' },
    { num: '05', name: 'DRAFT CREATION', desc: 'Apply 2° draft angle to vertical walls for injection mold ejection.' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
            TEXTBOOK CHAPTER 06 • PROJECT 05
          </div>
          <span className="text-xs font-mono text-text-secondary">Mechanical Industrial Book</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          05 — INDUSTRIAL 3D MODELING
        </h1>
        <p className="text-base sm:text-lg text-accent font-semibold italic">
          "Creating Virtual Representations of Physical Components"
        </p>
        <div className="bg-surface-elevated/80 p-4 rounded-xl border border-border text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl">
          <strong className="text-text-primary font-bold">Textbook Definition:</strong> 3D Modeling is the process of creating virtual representations of physical components.
        </div>
      </div>

      {/* 3D MODELING BENEFITS */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            FOUR CORE ADVANTAGES
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">3D Modeling Benefits</h2>
          <p className="text-xs text-text-secondary">Select a benefit to expand its engineering context.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modelingBenefits.map((b, idx) => {
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

        {/* Expanded Detail */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-accent/40 shadow-lg flex gap-4 items-start">
          <span className="text-4xl shrink-0">{modelingBenefits[selectedBenefit].icon}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-extrabold text-text-primary">{modelingBenefits[selectedBenefit].title}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${modelingBenefits[selectedBenefit].tagColor} ${modelingBenefits[selectedBenefit].tagBg}`}>
                {modelingBenefits[selectedBenefit].tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{modelingBenefits[selectedBenefit].detail}</p>
          </div>
        </div>
      </section>

      {/* INDUSTRIAL DESIGN WORKFLOW — BOOK CHAPTER 6 */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            BOOK — CHAPTER 6 DESIGN WORKFLOW
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Industrial 3D Modeling Workflow</h2>
          <p className="text-xs text-text-secondary">The complete engineering workflow from customer requirement to final production.</p>
        </div>

        <div className="bg-surface-elevated p-5 rounded-2xl border border-border shadow-lg space-y-4">
          {/* Arrow flow — two rows for readability */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              { step: 'Customer Requirement', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
              { step: 'Concept Development', color: 'bg-accent/10 text-accent border-accent/30' },
              { step: 'Design Calculation', color: 'bg-accent/10 text-accent border-accent/30' },
              { step: '3D Modeling', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
              { step: 'Engineering Drawing', color: 'bg-accent/10 text-accent border-accent/30' },
              { step: 'GD&T Application', color: 'bg-accent/10 text-accent border-accent/30' },
              { step: 'BOM Creation', color: 'bg-accent/10 text-accent border-accent/30' },
              { step: 'Engineering Analysis', color: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
              { step: 'Prototype Manufacturing', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
              { step: 'Testing', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
              { step: 'Final Production', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
            ].map(({ step, color }, idx, arr) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${color}`}>{step}</span>
                {idx < arr.length - 1 && <span className="text-text-secondary">→</span>}
              </span>
            ))}
          </div>

          {/* Workflow phase legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/50">
            {[
              { phase: 'Requirements', steps: 'Customer Req → Concept', color: 'text-red-400', dot: 'bg-red-400' },
              { phase: '3D Design', steps: 'Design Calc → 3D Model → Drawing', color: 'text-sky-400', dot: 'bg-sky-400' },
              { phase: 'Documentation', steps: 'GD&T → BOM → Analysis', color: 'text-violet-400', dot: 'bg-violet-400' },
              { phase: 'Validation', steps: 'Prototype → Testing → Production', color: 'text-emerald-400', dot: 'bg-emerald-400' },
            ].map((p) => (
              <div key={p.phase} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${p.dot}`} />
                <div>
                  <div className={`text-[11px] font-bold font-mono ${p.color}`}>{p.phase}</div>
                  <div className="text-[10px] text-text-secondary font-mono">{p.steps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMON 3D MODELING FEATURES DEMO */}
      <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            INTERACTIVE CAD FEATURE SIMULATOR
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Common 3D Modeling Features
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Explore live procedural CAD operations — watch 2D profiles, guide curves, and sweep trajectories form realistic mechanical geometry in real-time.
          </p>
        </div>

        <ErrorBoundary fallbackTitle="3D CAD Simulator Component Error">
          <CadFeatureSimulator />
        </ErrorBoundary>
      </section>

      {/* INDUSTRIAL 3D MODELING PRACTICAL EXAMPLE */}
      <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
              TEXTBOOK PRACTICAL EXAMPLE
            </span>
            <h2 className="text-2xl font-extrabold text-text-primary">
              WATER BOTTLE DESIGN
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Step-by-step modeling operational feature tree timeline.
            </p>
          </div>
        </div>

        {/* Operational Timeline Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {waterBottleOps.map((op, idx) => {
            const isActive = activeBottleOp === idx;
            return (
              <button
                key={op.num}
                onClick={() => setActiveBottleOp(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-lg ring-2 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <span className="text-xs font-mono font-bold text-accent block">{op.num}</span>
                <span className="text-xs font-bold text-text-primary block mt-1 leading-snug">
                  {op.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 h-[450px] rounded-xl overflow-hidden border border-border bg-black flex items-center justify-center">
            <video
              src="/gemini_generated_video_50ebb29b.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-full object-contain"
            />
          </div>

          <div className="lg:col-span-4 bg-surface-elevated p-5 rounded-xl border border-border space-y-4">
            <div>
              <span className="text-xs font-mono text-accent font-bold">STEP {waterBottleOps[activeBottleOp].num} OPERATION</span>
              <h3 className="text-base font-bold text-text-primary mt-0.5">{waterBottleOps[activeBottleOp].name}</h3>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">{waterBottleOps[activeBottleOp].desc}</p>
            </div>

            <div className="pt-3 border-t border-border/50 space-y-2">
              <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">CAD Operation Detail</div>

              {activeBottleOp === 0 && (
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { label: 'Sketch Plane', value: 'Top Plane (Datum A)' },
                    { label: 'Profile', value: 'Circle Ø50 mm (bottle OD)' },
                    { label: 'Constraint', value: 'Fully defined — origin concentric' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between gap-2">
                      <span className="text-text-secondary">{r.label}</span>
                      <span className="text-text-primary font-bold text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeBottleOp === 1 && (
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { label: 'Extrude Depth', value: '200 mm (bottle height)' },
                    { label: 'Direction', value: 'Blind — upward from sketch' },
                    { label: 'Result', value: 'Solid cylinder base body' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between gap-2">
                      <span className="text-text-secondary">{r.label}</span>
                      <span className="text-text-primary font-bold text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeBottleOp === 2 && (
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { label: 'Shell Thickness', value: '1.5 mm wall' },
                    { label: 'Open Face', value: 'Top circular face removed' },
                    { label: 'Result', value: 'Hollow PET-grade container' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between gap-2">
                      <span className="text-text-secondary">{r.label}</span>
                      <span className="text-text-primary font-bold text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeBottleOp === 3 && (
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { label: 'Body Fillet', value: 'R5 mm (all body edges)' },
                    { label: 'Shoulder Fillet', value: 'R8 mm (neck transition)' },
                    { label: 'Purpose', value: 'Ergonomic grip & mold fill' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between gap-2">
                      <span className="text-text-secondary">{r.label}</span>
                      <span className="text-text-primary font-bold text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeBottleOp === 4 && (
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { label: 'Draft Angle', value: '2° per side (all walls)' },
                    { label: 'Pull Direction', value: 'Along Y-axis (mold open dir.)' },
                    { label: 'Purpose', value: 'Injection mold ejection clearance' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between gap-2">
                      <span className="text-text-secondary">{r.label}</span>
                      <span className="text-text-primary font-bold text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
