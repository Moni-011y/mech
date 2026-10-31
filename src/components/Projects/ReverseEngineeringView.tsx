import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import MechanicalViewer from '../MechanicalViewer/MechanicalViewer';
import { useViewerStore } from '../../store/viewerStore';
import GearHubShaftVideoPlayer from './GearHubShaftVideoPlayer';

// 3D Gear Hub Shaft model
function GearHubShaft3D({ exploded, showDimensions, showDrawing }: { exploded: boolean; showDimensions: boolean; showDrawing: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gearRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.y += delta * 0.2;
    }
  });

  const explodeOffset = exploded ? 4 : 0;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Shaft Base */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 8, 32]} />
        <meshStandardMaterial color={showDrawing ? "#38BDF8" : "#94A3B8"} metalness={0.7} roughness={0.3} wireframe={showDrawing} />
      </mesh>

      {/* Shaft Step 2 */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 4, 32]} />
        <meshStandardMaterial color={showDrawing ? "#38BDF8" : "#CBD5E1"} metalness={0.8} roughness={0.2} wireframe={showDrawing} />
      </mesh>

      {/* Keyway Slot */}
      <mesh position={[0.9, 3, 0]}>
        <boxGeometry args={[0.6, 2.5, 0.4]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Press-fitted Spur Gear (Explodable) */}
      <group position={[0, 1 + explodeOffset, 0]}>
        <mesh ref={gearRef}>
          <cylinderGeometry args={[4.5, 4.5, 2, 24]} />
          <meshStandardMaterial color={showDrawing ? "#38BDF8" : "#16B8A6"} metalness={0.5} roughness={0.3} wireframe={showDrawing} />
        </mesh>
        
        {/* Gear Hub Center Ring */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 2.2, 32]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Teeth visual representations */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 4.6, 0, Math.sin(angle) * 4.6]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.4, 2, 0.6]} />
              <meshStandardMaterial color={showDrawing ? "#38BDF8" : "#0D9488"} metalness={0.6} roughness={0.3} wireframe={showDrawing} />
            </mesh>
          );
        })}
      </group>

      {/* 3D Measurement Dimension Callouts overlay */}
      {showDimensions && (
        <group>
          <Html position={[3.5, -2, 0]} center>
            <div className="bg-surface-elevated/90 border border-accent text-accent px-2 py-0.5 rounded text-[10px] font-mono shadow font-bold whitespace-nowrap">
              Ø50 mm Shaft OD
            </div>
          </Html>
          <Html position={[5.5, 1 + explodeOffset, 0]} center>
            <div className="bg-surface-elevated/90 border border-accent text-accent px-2 py-0.5 rounded text-[10px] font-mono shadow font-bold whitespace-nowrap">
              Ø90 mm Pitch Dia (Z=24, m=2)
            </div>
          </Html>
          <Html position={[-3, 3, 0]} center>
            <div className="bg-surface-elevated/90 border border-accent text-accent px-2 py-0.5 rounded text-[10px] font-mono shadow font-bold whitespace-nowrap">
              6x6 mm Keyway DIN 6885
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

export default function ReverseEngineeringView() {
  const [selectedWhy, setSelectedWhy] = useState(0);
  const [selectedApp, setSelectedApp] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [selectedTool, setSelectedTool] = useState('Vernier Caliper');
  const [selectedBenefit, setSelectedBenefit] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [projectDisplayMode, setProjectDisplayMode] = useState<'video' | '3d'>('video');

  const toggleDimensions = useViewerStore((s) => s.toggleDimensions);
  const showDimensions = useViewerStore((s) => s.dimensions);

  const whyRequiredCards = [
    {
      title: 'DRAWINGS UNAVAILABLE',
      icon: '📄❌',
      summary: 'Original blueprints are lost, destroyed, or were never archived.',
      explanation:
        'In many legacy manufacturing plants, physical paper drawings decompose or get misplaced over decades. Reverse engineering accurately measures the physical part to recreate complete technical drawings.',
    },
    {
      title: 'CAD FILES MISSING',
      icon: '💾❌',
      summary: 'Part was produced before 3D CAD modeling standards.',
      explanation:
        'Components fabricated prior to the 1990s lack modern 3D CAD files (.STEP/.IGES). Physical digitizing generates parametric models suitable for CNC machining and modern CAD operations.',
    },
    {
      title: 'SPARE PARTS OBSOLETE',
      icon: '⚙️⚠️',
      summary: 'Original OEM supplier is out of business or line discontinued.',
      explanation:
        'When machine breakdown occurs and replacement components cannot be purchased from original manufacturers, reverse engineering provides the exact geometry to manufacture local replacements.',
    },
    {
      title: 'IMPORTED COMPONENT LOCALIZATION',
      icon: '🌐✈️',
      summary: 'High import costs and long supply-chain lead times.',
      explanation:
        'Imported industrial machinery parts often carry extreme costs and months of import lead time. Local reverse engineering enables cost-effective domestic production with identical metallurgical specs.',
    },
    {
      title: 'PRODUCT IMPROVEMENT',
      icon: '🚀📈',
      summary: 'Analyze competitor design to optimize strength or weight.',
      explanation:
        'By performing failure analysis or benchmark scanning on existing products, mechanical design engineers identify stress points and optimize geometry for longer fatigue life and higher performance.',
    },
  ];

  const industrialApps = [
    {
      title: 'AUTOMOTIVE INDUSTRY',
      subtitle: 'Replacement spare parts',
      icon: '🚗',
      detail:
        'Digitizing hard-to-find vintage engine components, custom gear assemblies, and localized transmission gears for assembly line uptime.',
    },
    {
      title: 'MANUFACTURING INDUSTRY',
      subtitle: 'Machine component reproduction',
      icon: '🏭',
      detail:
        'Scanning worn steel rollers, drive sprockets, and internal casting housings to minimize industrial plant shutdown time.',
    },
    {
      title: 'AEROSPACE INDUSTRY',
      subtitle: 'Legacy part recreation',
      icon: '✈️',
      detail:
        'Recreating high-precision turbine blades, fuel nozzles, and structural aircraft brackets adhering to AS9100 quality standards.',
    },
    {
      title: 'MEDICAL INDUSTRY',
      subtitle: 'Customized prosthetic design',
      icon: '🩺',
      detail:
        'CT/3D scanning patient anatomy to design bio-compatible titanium implants, customized knee joints, and ergonomic orthopedic braces.',
    },
  ];

  const measurementTools = [
    {
      name: 'Vernier Caliper',
      precision: '±0.02 mm',
      use: 'Outside diameter (OD), inside diameter (ID), step height, and depth measurements.',
      demo: 'Measuring Gear Hub Shaft outer diameter (Ø50.00 mm) across turned bearing seats.',
    },
    {
      name: 'Micrometer',
      precision: '±0.001 mm',
      use: 'High-precision shaft journal thickness and keyway width measurement.',
      demo: 'Verifying parallel keyway width (6.002 mm) to maintain H7/js6 press fit tolerance.',
    },
    {
      name: 'Height Gauge',
      precision: '±0.01 mm',
      use: 'Surface plate height reference, shoulder distances, and vertical axial locations.',
      demo: 'Checking shaft step heights relative to granite surface plate zero datum.',
    },
    {
      name: 'CMM Machine',
      precision: '±0.0005 mm',
      use: 'Coordinate Measuring Machine touching 3D surfaces for GD&T concentricity & runout.',
      demo: 'Touch-probe inspecting gear pitch circle runout and shaft axis concentricity.',
    },
    {
      name: '3D Scanner',
      precision: '±0.015 mm',
      use: 'Non-contact optical laser scanning generating dense point clouds of complex surfaces.',
      demo: 'Capturing 1,500,000 mesh points across gear involute tooth curves in seconds.',
    },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'PRODUCT SELECTION',
      action: 'Identify physical sample',
      desc: 'Select existing gear hub shaft sample, clean surfaces, and establish reference datums for measurement.',
    },
    {
      num: '02',
      title: 'MEASUREMENT COLLECTION',
      action: 'Metrology & scanning',
      desc: 'Measure key dimensions using calipers, micrometers, CMM, or optical 3D scanners.',
    },
    {
      num: '03',
      title: 'CAD MODELING',
      action: '3D parametric solid model',
      desc: 'Reconstruct feature tree in SOLIDWORKS, Creo, CATIA, or NX CAD based on measured point cloud / dimensions.',
    },
    {
      num: '04',
      title: 'DRAFTING',
      action: '2D manufacturing drawing',
      desc: 'Generate engineering drawings with ISO/ASME dimensions, GD&T symbols, surface roughness, and material specs.',
    },
    {
      num: '05',
      title: 'VALIDATION',
      action: 'Dimension inspection',
      desc: 'Superimpose 3D CAD model against original physical component measurement points to confirm zero discrepancy.',
    },
    {
      num: '06',
      title: 'GD&T APPLICATION',
      action: 'Geometric tolerancing',
      desc: 'Apply GD&T symbols (runout, concentricity, perpendicularity) to the engineering drawing per ASME Y14.5 standard.',
    },
    {
      num: '07',
      title: 'MANUFACTURING SUPPORT',
      action: 'Production handover',
      desc: 'Release final drawing package to CNC machining, inspection, and quality teams for production of the reverse-engineered component.',
    },
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Cost Saving',
      tag: 'BENEFIT 01',
      tagColor: 'text-emerald-400',
      tagBg: 'bg-emerald-400/10 border-emerald-400/30',
      summary: 'No need to redesign the component from scratch.',
      detail:
        'Reverse engineering eliminates expensive design phases — prototype tooling, design iteration cycles, and FEA simulation costs are drastically reduced because accurate geometry is captured directly from the existing physical part.',
    },
    {
      icon: '⚡',
      title: 'Faster Development',
      tag: 'BENEFIT 02',
      tagColor: 'text-sky-400',
      tagBg: 'bg-sky-400/10 border-sky-400/30',
      summary: 'Reduces product development time significantly.',
      detail:
        'Converting a physical part directly to a CAD model via scanning compresses the development timeline from weeks to days. CNC programs can be generated almost immediately from the captured point cloud data.',
    },
    {
      icon: '🚀',
      title: 'Product Enhancement',
      tag: 'BENEFIT 03',
      tagColor: 'text-violet-400',
      tagBg: 'bg-violet-400/10 border-violet-400/30',
      summary: 'Allows modifications and improvements to existing designs.',
      detail:
        'Once the baseline CAD model is recreated, engineers can apply FEA stress analysis, optimize wall thickness, upgrade material grades, or redesign for additive manufacturing — all building on verified geometry.',
    },
    {
      icon: '📁',
      title: 'Documentation Recovery',
      tag: 'BENEFIT 04',
      tagColor: 'text-amber-400',
      tagBg: 'bg-amber-400/10 border-amber-400/30',
      summary: 'Restores missing engineering data and archives.',
      detail:
        'For legacy equipment where original drawings, CAD files, and specifications no longer exist, reverse engineering reconstructs the complete documentation package — reinstating a full engineering data traceability chain.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
            TEXTBOOK CHAPTER 02 • PROJECT 01
          </div>
          <span className="text-xs font-mono text-text-secondary">Mechanical Industrial Book</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          01 — REVERSE ENGINEERING
        </h1>
        <p className="text-base sm:text-lg text-accent font-semibold italic">
          "Recovering Engineering Data from an Existing Product"
        </p>
        <div className="bg-surface-elevated/80 p-4 rounded-xl border border-border text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl">
          <strong className="text-text-primary font-bold">Textbook Definition:</strong> Reverse Engineering is the process of extracting design information from an existing physical product and recreating its design data. Mechanical engineers study an existing component and develop CAD models, 2D drawings, and manufacturing data instead of designing from scratch.
        </div>
      </div>

      {/* WHY REVERSE ENGINEERING IS REQUIRED */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            INDUSTRIAL NECESSITY
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Why Reverse Engineering Is Required
          </h2>
          <p className="text-xs text-text-secondary">
            Select a condition below to view the textbook engineering justification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {whyRequiredCards.map((card, idx) => {
            const isSelected = selectedWhy === idx;
            return (
              <div
                key={card.title}
                onClick={() => setSelectedWhy(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface-elevated border-accent shadow-lg shadow-accent/10 ring-2 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div>
                  <span className="text-2xl mb-2 block">{card.icon}</span>
                  <h4 className="text-xs font-bold text-text-primary mb-1">{card.title}</h4>
                  <p className="text-[11px] text-text-secondary leading-snug">{card.summary}</p>
                </div>
                <span className="mt-3 text-[10px] font-mono text-accent font-semibold block">
                  {isSelected ? 'ACTIVE VIEW' : 'Click to inspect →'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Explanation Detail Card */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-accent/40 shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{whyRequiredCards[selectedWhy].icon}</span>
            <h3 className="text-sm font-bold text-accent">
              {whyRequiredCards[selectedWhy].title} — Textbook Context
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
            {whyRequiredCards[selectedWhy].explanation}
          </p>
        </div>
      </section>

      {/* INDUSTRIAL APPLICATIONS */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            SECTOR EXAMPLES
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Industrial Applications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industrialApps.map((app, idx) => {
            const isSelected = selectedApp === idx;
            return (
              <div
                key={app.title}
                onClick={() => setSelectedApp(idx)}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface-elevated border-accent shadow-xl ring-1 ring-accent'
                    : 'bg-surface border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                    SECTOR 0{idx + 1}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary mb-0.5">{app.title}</h4>
                <p className="text-xs font-semibold text-accent mb-2">{app.subtitle}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{app.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* REVERSE ENGINEERING PROCESS WORKFLOW */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            STEP-BY-STEP METHODOLOGY
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Reverse Engineering Process
          </h2>
        </div>

        {/* Workflow Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {workflowSteps.map((step, idx) => {
            const isActive = activeWorkflowStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-md ring-2 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold text-accent">{step.num}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-accent animate-ping" />}
                </div>
                <div className="text-xs font-bold text-text-primary">{step.title}</div>
                <div className="text-[10px] text-text-secondary truncate mt-0.5">{step.action}</div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Interactive View */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/50 pb-3 gap-2">
            <div>
              <span className="text-xs font-mono text-accent font-bold">
                STEP {workflowSteps[activeWorkflowStep].num} DETAILS
              </span>
              <h3 className="text-lg font-bold text-text-primary">
                {workflowSteps[activeWorkflowStep].title} — {workflowSteps[activeWorkflowStep].action}
              </h3>
            </div>
            <p className="text-xs text-text-secondary max-w-md">
              {workflowSteps[activeWorkflowStep].desc}
            </p>
          </div>

          {/* Interactive Environment depending on active stage */}
          {activeWorkflowStep === 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-elevated rounded-lg border border-border text-xs text-text-secondary">
                <strong className="text-accent font-bold">Product Selection Stage:</strong> Gear Hub Shaft identified from industrial lathe gearbox. Physical part cleaned, inspected for fracture wear, and mounted on inspection V-blocks.
              </div>
              <p className="text-xs text-text-secondary font-mono">
                Interactive 3D Preview: Rotate the component to inspect physical features.
              </p>
            </div>
          )}

          {activeWorkflowStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                Select Metrology Tool:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {measurementTools.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTool(t.name)}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition ${
                      selectedTool === t.name
                        ? 'bg-accent text-background border-accent'
                        : 'bg-surface-elevated text-text-primary border-border hover:border-accent/40'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              {(() => {
                const toolInfo = measurementTools.find((t) => t.name === selectedTool)!;
                return (
                  <div className="p-4 rounded-xl bg-surface-elevated border border-accent/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-text-primary">{toolInfo.name} Metrology Demo</h4>
                      <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20">
                        Accuracy: {toolInfo.precision}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{toolInfo.use}</p>
                    <div className="p-3 bg-background rounded-lg border border-border font-mono text-xs text-accent">
                      ▶ Demonstration: {toolInfo.demo}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {activeWorkflowStep === 2 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                Parametric CAD Software Reconstruction
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Reconstructing feature timeline using 3D CAD modeling software mentioned in textbook:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {['SOLIDWORKS', 'Creo Parametric', 'CATIA V5/V6', 'Siemens NX CAD'].map((cad) => (
                  <div key={cad} className="p-3 bg-background rounded-lg border border-border font-bold text-xs text-text-primary">
                    {cad}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeWorkflowStep === 3 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                Transition: 3D CAD Model → 2D Manufacturing Drawing
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-text-primary font-mono">
                <div className="p-3 bg-background rounded border border-border">📐 Dimensions (ISO 2768-m)</div>
                <div className="p-3 bg-background rounded border border-border">🎯 Tolerances (H7/js6 Fit)</div>
                <div className="p-3 bg-background rounded border border-border">⌖ GD&T Runout (0.02 A)</div>
                <div className="p-3 bg-background rounded border border-border">⚙️ Material (AISI 1045)</div>
              </div>
            </div>
          )}

          {activeWorkflowStep === 4 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                Validation: Physical Part vs CAD Model Comparison
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { dim: 'Gear Hub Pitch Dia', measured: '90.01 mm', spec: '90.00 mm', delta: '+0.01 mm', pass: true },
                  { dim: 'Shaft Journal OD', measured: '50.00 mm', spec: '50.00 mm', delta: '0.00 mm', pass: true },
                  { dim: 'Keyway Width', measured: '6.002 mm', spec: '6.000 mm', delta: '+0.002 mm', pass: true },
                  { dim: 'Total Shaft Length', measured: '119.98 mm', spec: '120.00 mm', delta: '-0.02 mm', pass: true },
                ].map((row) => (
                  <div key={row.dim} className="p-3 bg-background rounded-lg border border-accent/30 font-mono text-xs text-text-primary flex justify-between items-start gap-2">
                    <div>
                      <div className="font-bold text-text-primary">{row.dim}</div>
                      <div className="text-text-secondary">Measured: {row.measured} | CAD: {row.spec}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={row.pass ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{row.pass ? '✅ PASS' : '❌ FAIL'}</div>
                      <div className="text-text-secondary">Δ {row.delta}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-secondary font-mono">All dimensions within ISO 2768-m tolerance band. CAD model validated against physical sample.</p>
            </div>
          )}

          {activeWorkflowStep === 5 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                GD&amp;T Application — Geometric Tolerancing on Drawing
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { symbol: '⌖', name: 'Concentricity', value: 'Ø0.02 mm', datum: 'Datum A', desc: 'Gear bore axis aligned to shaft axis' },
                  { symbol: '↗', name: 'Runout (Circular)', value: '0.025 mm', datum: 'Datum A-B', desc: 'Gear face total runout at pitch circle' },
                  { symbol: '⊥', name: 'Perpendicularity', value: '0.03 mm', datum: 'Datum B', desc: 'Gear face perpendicular to shaft axis' },
                  { symbol: '∥', name: 'Parallelism', value: '0.02 mm', datum: 'Datum A', desc: 'Keyway walls parallel to shaft axis' },
                ].map((gdt) => (
                  <div key={gdt.name} className="p-3 bg-background rounded-lg border border-accent/20 font-mono text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{gdt.symbol}</span>
                      <span className="font-bold text-accent">{gdt.name}</span>
                      <span className="ml-auto bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20">{gdt.value}</span>
                    </div>
                    <div className="text-text-secondary">{gdt.desc}</div>
                    <div className="text-text-secondary mt-0.5">Datum Ref: {gdt.datum}</div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-secondary font-mono">GD&amp;T applied per ASME Y14.5-2018 standard on the Gear Hub Shaft manufacturing drawing.</p>
            </div>
          )}

          {activeWorkflowStep === 6 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                Manufacturing Support — Production Handover Package
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { dept: 'CNC Machining', icon: '🔧', items: ['CNC Turning (Shaft OD)', 'Gear Hobbing (Z=24, m=2)', 'Keyway Milling (6×6 DIN 6885)'] },
                  { dept: 'Quality Inspection', icon: '🔬', items: ['CMM Inspection Report', 'Surface Roughness (Ra 1.6)', 'Hardness Test (HRC 28-32)'] },
                  { dept: 'Documentation', icon: '📋', items: ['2D Drawing Release', 'BOM Entry (Part No. GHS-001)', 'Revision Control (Rev A)'] },
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
              <p className="text-[11px] text-text-secondary font-mono">Final drawing package released to production. Reverse engineering cycle complete — component ready for manufacturing.</p>
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS OF REVERSE ENGINEERING */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            TEXTBOOK — CHAPTER 2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Benefits of Reverse Engineering
          </h2>
          <p className="text-xs text-text-secondary">Select a benefit card to expand the industrial context.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, idx) => {
            const isActive = selectedBenefit === idx;
            return (
              <div
                key={b.title}
                onClick={() => setSelectedBenefit(idx)}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-3 ${
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
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-1">{b.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{b.summary}</p>
                </div>
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
          <span className="text-4xl shrink-0">{benefits[selectedBenefit].icon}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-extrabold text-text-primary">{benefits[selectedBenefit].title}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${benefits[selectedBenefit].tagColor} ${benefits[selectedBenefit].tagBg}`}>
                {benefits[selectedBenefit].tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{benefits[selectedBenefit].detail}</p>
          </div>
        </div>
      </section>

      {/* REVERSE ENGINEERING PRACTICAL PROJECT */}
      <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
              PRACTICAL BOOK CASE STUDY
            </span>
            <h2 className="text-2xl font-extrabold text-text-primary">
              GEAR HUB SHAFT PROJECT
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Objective: Develop manufacturing drawings from an existing sample component.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Video (Default) vs 3D CAD */}
            <div className="flex items-center p-1 rounded-xl bg-surface-elevated border border-border">
              <button
                onClick={() => setProjectDisplayMode('video')}
                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  projectDisplayMode === 'video'
                    ? 'bg-accent text-background shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>🎬</span>
                <span>Video Simulation</span>
              </button>
              <button
                onClick={() => setProjectDisplayMode('3d')}
                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  projectDisplayMode === '3d'
                    ? 'bg-accent text-background shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>🧊</span>
                <span>3D CAD Model</span>
              </button>
            </div>

            {projectDisplayMode === '3d' && (
              <>
                <button
                  onClick={() => setIsExploded(!isExploded)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    isExploded ? 'bg-accent text-background' : 'bg-surface-elevated border border-border text-text-primary'
                  }`}
                >
                  {isExploded ? 'ASSEMBLE PART' : 'EXPLODE GEAR'}
                </button>

                <button
                  onClick={toggleDimensions}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    showDimensions ? 'bg-accent text-background' : 'bg-surface-elevated border border-border text-text-primary'
                  }`}
                >
                  {showDimensions ? 'HIDE DIMENSIONS' : 'SHOW DIMENSIONS'}
                </button>

                <button
                  onClick={() => setIsDrawingMode(!isDrawingMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    isDrawingMode ? 'bg-cyan-400 text-background' : 'bg-surface-elevated border border-border text-text-primary'
                  }`}
                >
                  {isDrawingMode ? '3D SHADED VIEW' : '2D DRAWING WIREFRAME'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Video / 3D Viewport & Drawing Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 h-[450px] rounded-xl overflow-hidden border border-border">
            {projectDisplayMode === 'video' ? (
              <GearHubShaftVideoPlayer
                className="w-full h-full"
                onSwitchTo3d={() => setProjectDisplayMode('3d')}
                show3dToggle={true}
              />
            ) : (
              <MechanicalViewer>
                <GearHubShaft3D exploded={isExploded} showDimensions={showDimensions} showDrawing={isDrawingMode} />
              </MechanicalViewer>
            )}
          </div>

          {/* Project Details Panel */}
          <div className="lg:col-span-4 bg-surface-elevated p-5 rounded-xl border border-border space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border/50 pb-2">
              Book Project Activities
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary font-mono">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Measurement Collection (Micrometer & Caliper)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                CAD Modeling (SOLIDWORKS / Creo)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Draft Creation (Orthographic Projections)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                GD&T Application (Concentricity & Runout)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Manufacturing Support (CNC Turning & Hobbing)
              </li>
            </ul>

            <div className="p-3 bg-background rounded-lg border border-border space-y-1">
              <div className="text-[10px] font-mono text-accent font-bold uppercase">
                Component Specification Sheet
              </div>
              <div className="text-xs text-text-primary font-mono justify-between flex">
                <span>Material:</span> <span>Steel AISI 1045 (Medium Carbon)</span>
              </div>
              <div className="text-xs text-text-primary font-mono justify-between flex">
                <span>Gear Module:</span> <span>m = 2.0 mm</span>
              </div>
              <div className="text-xs text-text-primary font-mono justify-between flex">
                <span>Number of Teeth:</span> <span>Z = 24</span>
              </div>
              <div className="text-xs text-text-primary font-mono justify-between flex">
                <span>Shaft Journal:</span> <span>Ø50.00 mm (h6 tolerance)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
