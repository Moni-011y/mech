import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import MechanicalViewer from '../MechanicalViewer/MechanicalViewer';
import DraftingWorkflowVideoPlayer from './DraftingWorkflowVideoPlayer';
import { ArrowLeftIcon, ArrowRightIcon, ArrowDownIcon, CheckIcon } from './WorkflowIcons';

// ─────────────────────────────────────────────────────────────────────────────
// 10 DRAFTING WORKFLOW STAGES (Mechanical Industrial Book, Page 33)
// ─────────────────────────────────────────────────────────────────────────────
export interface DraftingStageData {
  id: number;
  name: string;
  desc: string;
  bookTopic: string;
  deliverables: string[];
  standardsRef: string;
}

export const DRAFTING_STAGES: DraftingStageData[] = [
  {
    id: 1,
    name: '3D Model',
    desc: 'Start with the 3D CAD model of the component.',
    bookTopic: 'Parametric CAD Solid Geometry',
    deliverables: [
      'Parametric 3D solid part / assembly model',
      'Neutral exchange geometry (STEP AP242 / IGES)',
      'Verified feature tree (Extrude, Revolve, Cutouts)',
      'Accurate mass properties & material assignment'
    ],
    standardsRef: 'ISO 16792 / ASME Y14.41 (Digital Product Definition)'
  },
  {
    id: 2,
    name: '2D Drawing Creation',
    desc: 'Convert the CAD model into a manufacturing-ready engineering drawing.',
    bookTopic: 'Sheet Setup & Projection System',
    deliverables: [
      'Standard sheet size selection (ISO A0–A4 or ASME A–E)',
      'Drawing scale ratio (1:1 full size, 1:2, 2:1)',
      'Projection method standard (1st Angle vs 3rd Angle)',
      'Border margins, zoning grid & trim marks'
    ],
    standardsRef: 'ISO 5457 (Drawing Sheets) • ISO 5456 (Projection Methods)'
  },
  {
    id: 3,
    name: 'Orthographic Views',
    desc: 'Show front, top, right-side, left-side, bottom, and rear views.',
    bookTopic: 'Multi-View Engineering Projection',
    deliverables: [
      'Front View (Principal / most characteristic view)',
      'Top View (Plan view aligned vertically with front)',
      'Right & Left Side Views (Profile views)',
      'Auxiliary views for true-shape inclined surfaces'
    ],
    standardsRef: 'ISO 128-30 / ASME Y14.3 (Multi-View Projections)'
  },
  {
    id: 4,
    name: 'Section Views',
    desc: 'Reveal internal features that cannot be seen from the outside.',
    bookTopic: 'Internal Cavity Cutting Planes',
    deliverables: [
      'Full Section (Cutting plane across entire body)',
      'Half Section (Quarter cutout for symmetrical components)',
      'Offset Section (Stepped plane passing through multiple holes)',
      '45° Cross-hatch patterns matching material grade'
    ],
    standardsRef: 'ISO 128-40 / 50 (Section Cuts & Cross-Hatching)'
  },
  {
    id: 5,
    name: 'Dimensions & Tolerances',
    desc: 'Define component dimensions and acceptable dimensional variation.',
    bookTopic: 'Nominal Sizes & Permissible Limits',
    deliverables: [
      'Functional baseline & chain dimension callouts',
      'Bilateral (±0.02 mm) & Unilateral (+0.05/-0.00) limits',
      'Standard ISO hole/shaft fits (e.g. H7/g6, H7/p6)',
      'Clear clearance for CNC turning, milling, and grinding'
    ],
    standardsRef: 'ISO 286 (Limits & Fits) • ASME Y14.5 (Dimensioning)'
  },
  {
    id: 6,
    name: 'GD&T',
    desc: 'Specify geometric dimensioning and tolerancing requirements.',
    bookTopic: 'Feature Control Frames & Datum Reference',
    deliverables: [
      'Datum Reference Framework (Primary A, Secondary B, Tertiary C)',
      'True Position (⌖) with MMC material modifier',
      'Perpendicularity (⟂), Flatness (⏥), Runout (↗)',
      'Elimination of ambiguous dimensional tolerance stack-ups'
    ],
    standardsRef: 'ASME Y14.5-2018 • ISO 1101 (Geometrical Tolerancing)'
  },
  {
    id: 7,
    name: 'Surface Finish',
    desc: 'Specify the required quality of machined surfaces.',
    bookTopic: 'Roughness & Machining Textures',
    deliverables: [
      'Roughness Average Ra values (e.g. Ra 1.6 µm, Ra 0.8 µm ground)',
      'Machining lay directions (Perpendicular, Parallel, Circular)',
      'Material removal allowance symbols (Mandatory, Prohibited)',
      'Bearing journal and seal seat micro-finish callouts'
    ],
    standardsRef: 'ISO 1302 / ASME Y14.36 (Surface Texture Symbols)'
  },
  {
    id: 8,
    name: 'Material & Manufacturing Notes',
    desc: 'Include material specifications and manufacturing-related requirements.',
    bookTopic: 'Metallurgy & Process Specifications',
    deliverables: [
      'Raw material designation (e.g. EN8, AISI 4140, 6061-T6)',
      'Heat treatment specs (Induction hardened 52–56 HRC)',
      'Surface coating / Plating (Black oxide, zinc plating, anodizing)',
      'General shop notes (Break all sharp edges 0.5 mm max)'
    ],
    standardsRef: 'ASTM Material Standards • ISO 2768 (General Tolerances)'
  },
  {
    id: 9,
    name: 'Title Block & Revision',
    desc: 'Display drawing identification and revision information.',
    bookTopic: 'Administrative Metadata & Revision Tracking',
    deliverables: [
      'Part Name, Drawing Number, Sheet Scale (1:1)',
      'Design verification sign-offs (Drawn, Checked, Approved)',
      'First/Third Angle Projection symbol block',
      'Revision History table (Rev 0 Initial Release, Rev A, ECO #)'
    ],
    standardsRef: 'ISO 7200 / ASME Y14.1 (Title Blocks & Revision Tables)'
  },
  {
    id: 10,
    name: 'Final Manufacturing Drawing',
    desc: 'Present the completed drawing with the information required to manufacture and inspect the component.',
    bookTopic: 'Production Release & Quality Sign-Off',
    deliverables: [
      'Fully validated 2D manufacturing blueprint package',
      'First Article Inspection (FAI) balloon drawing mapping',
      'CMM inspection routine reference coordinates',
      'Official engineering release stamp to machine shop & procurement'
    ],
    standardsRef: 'ISO 9001 / AS9102 (First Article Inspection Standards)'
  }
];

interface DraftingPipelineProps {
  onBack?: () => void;
  initialStageId?: number;
}

export default function DraftingPipeline({ onBack, initialStageId = 1 }: DraftingPipelineProps) {
  const [selectedStageId, setSelectedStageId] = useState<number>(initialStageId);
  const [hoveredStageId, setHoveredStageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'serpentine' | 'matrix'>('serpentine');
  const [standard, setStandard] = useState<'ISO' | 'ASME'>('ISO');
  const [viewType, setViewType] = useState<'FRONT' | 'TOP' | 'SIDE' | 'ISOMETRIC' | 'SECTION'>('FRONT');
  const [sectionType, setSectionType] = useState<'FULL' | 'HALF' | 'OFFSET' | 'REVOLVED'>('FULL');
  const [mediaMode, setMediaMode] = useState<'video' | '3d'>('video');

  const shouldReduceMotion = useReducedMotion();

  const selectedStage = DRAFTING_STAGES.find((s) => s.id === selectedStageId) || DRAFTING_STAGES[0];
  const isFinalStage = selectedStageId === 10;
  const progressPercent = Math.round((selectedStageId / DRAFTING_STAGES.length) * 100);

  const handlePrevStage = () => {
    setSelectedStageId((prev) => (prev > 1 ? prev - 1 : DRAFTING_STAGES.length));
  };

  const handleNextStage = () => {
    setSelectedStageId((prev) => (prev < DRAFTING_STAGES.length ? prev + 1 : 1));
  };

  const handleRestart = () => {
    setSelectedStageId(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedStageId(id);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextStage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevStage();
    }
  };

  // Serpentine Row 1: Stages 1, 2, 3, 4, 5 (Left to Right)
  const row1 = DRAFTING_STAGES.slice(0, 5);
  // Serpentine Row 2: Stages 10, 9, 8, 7, 6 (Right to Left: Column 5 has 6, Col 4 has 7, Col 3 has 8, Col 2 has 9, Col 1 has 10)
  const row2Stage6 = DRAFTING_STAGES[5];
  const row2Stage7 = DRAFTING_STAGES[6];
  const row2Stage8 = DRAFTING_STAGES[7];
  const row2Stage9 = DRAFTING_STAGES[8];
  const row2Stage10 = DRAFTING_STAGES[9];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.35, ease: 'easeOut' },
    },
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="engineering-drafting-workflow">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & CONTROLS BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface p-5 sm:p-7 rounded-2xl border border-border shadow-xl space-y-5 relative overflow-hidden">
        {/* Subtle technical grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#2dd4bf 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-elevated hover:bg-border text-text-primary text-xs font-semibold border border-border transition focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Back to main workflow section"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 text-accent" />
                  <span>Workflow Categories</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold font-mono tracking-wide">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                BOOK PAGE 33 • DRAFTING DISCIPLINE
              </span>
              <span className="text-xs font-mono text-text-secondary">
                STAGE {selectedStageId.toString().padStart(2, '0')} OF 10
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Engineering Drafting Workflow
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
              From 3D CAD models to manufacturing-ready engineering drawings.
            </p>
          </div>

          {/* Right actions: Standards selector & View switch */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            {/* ISO vs ASME */}
            <div className="inline-flex bg-surface-elevated p-1 rounded-xl border border-border text-xs font-bold">
              <button
                onClick={() => setStandard('ISO')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  standard === 'ISO' ? 'bg-accent text-background shadow' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                ISO Standard
              </button>
              <button
                onClick={() => setStandard('ASME')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  standard === 'ASME' ? 'bg-accent text-background shadow' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                ASME Standard
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex bg-surface-elevated p-1 rounded-xl border border-border">
              <button
                onClick={() => setViewMode('serpentine')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'serpentine'
                    ? 'bg-accent text-background shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title="View serpentine sequence diagram"
                aria-pressed={viewMode === 'serpentine'}
              >
                <span>🗺️</span>
                <span>Flow Map</span>
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'matrix'
                    ? 'bg-accent text-background shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title="View all 10 stages matrix"
                aria-pressed={viewMode === 'matrix'}
              >
                <span>📑</span>
                <span>All 10 Stages</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Stepper Bar */}
        <div className="pt-2 border-t border-border/60 space-y-2 relative z-10">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-text-secondary flex items-center gap-2">
              <span className="text-accent font-bold">Sequence Progression:</span>
              <span className="text-text-primary font-semibold truncate max-w-[200px] sm:max-w-none">
                {selectedStage.name}
              </span>
            </span>
            <span className="text-accent font-bold">{progressPercent}% Completed</span>
          </div>

          <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden border border-border p-0.5">
            <div
              className="h-full bg-gradient-to-r from-accent via-accent-bright to-accent rounded-full transition-all duration-500 ease-out shadow-sm shadow-accent/50"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Quick Step Indicator Pills */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
            {DRAFTING_STAGES.map((st) => {
              const isSelected = st.id === selectedStageId;
              const isPast = st.id < selectedStageId;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStageId(st.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition shrink-0 border ${
                    isSelected
                      ? 'bg-accent text-background border-accent shadow-md shadow-accent/20 scale-105'
                      : isPast
                      ? 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25'
                      : 'bg-surface-elevated text-text-secondary border-border hover:text-text-primary hover:border-text-secondary/50'
                  }`}
                  title={`${st.id}. ${st.name}`}
                  aria-label={`Jump to Stage ${st.id}: ${st.name}`}
                >
                  {st.id.toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. VIEW MODE: SERPENTINE WORKFLOW DIAGRAM (DESKTOP) & VERTICAL (MOBILE)
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'serpentine' ? (
        <div className="space-y-6">
          {/* DESKTOP SERPENTINE FLOW (5 stages Row 1, 5 stages Row 2: 1024px+) */}
          <div className="hidden lg:block bg-surface p-8 rounded-2xl border border-border shadow-xl relative overflow-hidden">
            {/* Technical grid blueprint lines */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #16B8A6 1px, transparent 1px), linear-gradient(to bottom, #16B8A6 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-10 relative z-10"
            >
              {/* ── ROW 1: Stages 01 → 02 → 03 → 04 → 05 (Left to Right) ── */}
              <div className="relative">
                <div className="grid grid-cols-5 gap-5 items-stretch">
                  {row1.map((stage, idx) => (
                    <div key={stage.id} className="relative flex items-center">
                      <DraftingStageNode
                        stage={stage}
                        isSelected={stage.id === selectedStageId}
                        isHovered={stage.id === hoveredStageId}
                        onSelect={() => setSelectedStageId(stage.id)}
                        onHover={(hov) => setHoveredStageId(hov ? stage.id : null)}
                        onKeyDown={(e) => handleKeyDown(e, stage.id)}
                      />
                      {/* Horizontal right arrow between 1-2, 2-3, 3-4, 4-5 */}
                      {idx < 4 && (
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                          <DraftingConnector
                            direction="right"
                            isActive={stage.id < selectedStageId}
                            isHighlighted={hoveredStageId === stage.id || hoveredStageId === stage.id + 1}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Turn connector from Stage 5 (Row 1 End) down to Stage 6 (Row 2 Start) on Column 5 */}
                <div className="absolute right-[9%] -bottom-10 w-8 h-10 z-20 pointer-events-none flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-0.5 h-6 transition-colors duration-300 ${
                        selectedStageId >= 6 ? 'bg-accent' : 'bg-border'
                      }`}
                    />
                    <ArrowDownIcon
                      className={`w-4 h-4 transition-colors duration-300 ${
                        selectedStageId >= 6 ? 'text-accent' : 'text-steel'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ── ROW 2: Stages 10 ← 09 ← 08 ← 07 ← 06 (Right to Left Serpentine) ── */}
              <div className="relative pt-4">
                <div className="grid grid-cols-5 gap-5 items-stretch">
                  {/* Column 1: Stage 10 (Final Manufacturing Drawing) */}
                  <div className="relative flex items-center">
                    <DraftingStageNode
                      stage={row2Stage10}
                      isSelected={row2Stage10.id === selectedStageId}
                      isHovered={row2Stage10.id === hoveredStageId}
                      onSelect={() => setSelectedStageId(row2Stage10.id)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage10.id : null)}
                      onKeyDown={(e) => handleKeyDown(e, row2Stage10.id)}
                    />
                  </div>

                  {/* Column 2: Stage 9 (Title Block & Revision) */}
                  <div className="relative flex items-center">
                    <DraftingStageNode
                      stage={row2Stage9}
                      isSelected={row2Stage9.id === selectedStageId}
                      isHovered={row2Stage9.id === hoveredStageId}
                      onSelect={() => setSelectedStageId(row2Stage9.id)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage9.id : null)}
                      onKeyDown={(e) => handleKeyDown(e, row2Stage9.id)}
                    />
                    {/* Left arrow to Column 1 (Stage 10) */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <DraftingConnector
                        direction="left"
                        isActive={selectedStageId >= 10}
                        isHighlighted={hoveredStageId === 9 || hoveredStageId === 10}
                      />
                    </div>
                  </div>

                  {/* Column 3: Stage 8 (Material & Mfg Notes) */}
                  <div className="relative flex items-center">
                    <DraftingStageNode
                      stage={row2Stage8}
                      isSelected={row2Stage8.id === selectedStageId}
                      isHovered={row2Stage8.id === hoveredStageId}
                      onSelect={() => setSelectedStageId(row2Stage8.id)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage8.id : null)}
                      onKeyDown={(e) => handleKeyDown(e, row2Stage8.id)}
                    />
                    {/* Left arrow to Column 2 (Stage 9) */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <DraftingConnector
                        direction="left"
                        isActive={selectedStageId >= 9}
                        isHighlighted={hoveredStageId === 8 || hoveredStageId === 9}
                      />
                    </div>
                  </div>

                  {/* Column 4: Stage 7 (Surface Finish) */}
                  <div className="relative flex items-center">
                    <DraftingStageNode
                      stage={row2Stage7}
                      isSelected={row2Stage7.id === selectedStageId}
                      isHovered={row2Stage7.id === hoveredStageId}
                      onSelect={() => setSelectedStageId(row2Stage7.id)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage7.id : null)}
                      onKeyDown={(e) => handleKeyDown(e, row2Stage7.id)}
                    />
                    {/* Left arrow to Column 3 (Stage 8) */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <DraftingConnector
                        direction="left"
                        isActive={selectedStageId >= 8}
                        isHighlighted={hoveredStageId === 7 || hoveredStageId === 8}
                      />
                    </div>
                  </div>

                  {/* Column 5: Stage 6 (GD&T) */}
                  <div className="relative flex items-center">
                    <DraftingStageNode
                      stage={row2Stage6}
                      isSelected={row2Stage6.id === selectedStageId}
                      isHovered={row2Stage6.id === hoveredStageId}
                      onSelect={() => setSelectedStageId(row2Stage6.id)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage6.id : null)}
                      onKeyDown={(e) => handleKeyDown(e, row2Stage6.id)}
                    />
                    {/* Left arrow to Column 4 (Stage 7) */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <DraftingConnector
                        direction="left"
                        isActive={selectedStageId >= 7}
                        isHighlighted={hoveredStageId === 6 || hoveredStageId === 7}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MOBILE / TABLET VERTICAL TIMELINE (< 1024px) */}
          <div className="block lg:hidden bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-xl">
            <div className="relative pl-6 sm:pl-8 space-y-5">
              {/* Continuous vertical connecting line */}
              <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-6 w-0.5 bg-border -z-0">
                <div
                  className="w-full bg-accent transition-all duration-300"
                  style={{
                    height: `${((selectedStageId - 1) / (DRAFTING_STAGES.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {DRAFTING_STAGES.map((stage) => {
                const isSelected = stage.id === selectedStageId;
                const isPast = stage.id < selectedStageId;

                return (
                  <div key={stage.id} className="relative z-10 flex items-start gap-3.5">
                    {/* Node Dot / Icon Badge */}
                    <button
                      onClick={() => setSelectedStageId(stage.id)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center -ml-3.5 sm:-ml-4 border transition shrink-0 ${
                        isSelected
                          ? 'bg-accent text-background border-accent shadow-lg shadow-accent/30 ring-4 ring-accent/20'
                          : isPast
                          ? 'bg-surface-elevated text-accent border-accent'
                          : 'bg-surface-elevated text-steel border-border hover:border-text-secondary'
                      }`}
                      aria-label={`Select Stage ${stage.id}: ${stage.name}`}
                    >
                      <span className="text-[10px] font-mono font-black">{stage.id}</span>
                    </button>

                    {/* Stage Card Body */}
                    <div
                      onClick={() => setSelectedStageId(stage.id)}
                      className={`flex-1 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition text-left ${
                        isSelected
                          ? 'bg-accent/10 border-accent shadow-lg shadow-accent/10 ring-1 ring-accent'
                          : 'bg-surface-elevated border-border hover:border-steel/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-accent">
                          STAGE {stage.id.toString().padStart(2, '0')}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-accent text-background">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-text-primary leading-snug">
                        {stage.name}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            VIEW MODE: ALL 10 STAGES MATRIX
            ───────────────────────────────────────────────────────────── */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5"
        >
          {DRAFTING_STAGES.map((stage) => {
            const isSelected = stage.id === selectedStageId;

            return (
              <motion.div
                key={stage.id}
                variants={cardVariants}
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-accent/15 border-accent shadow-lg shadow-accent/15 ring-1 ring-accent'
                    : 'bg-surface border-border hover:border-accent/50 hover:bg-surface-elevated'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-elevated border border-border text-accent">
                      STAGE {stage.id.toString().padStart(2, '0')}
                    </span>
                    <DraftingStageIcon stageId={stage.id} className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-xs font-bold text-text-primary leading-snug">{stage.name}</h3>
                  <p className="text-[11px] text-text-secondary leading-snug line-clamp-3">{stage.desc}</p>
                </div>

                <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-steel flex justify-between items-center">
                  <span className="truncate max-w-[90px]">{stage.bookTopic}</span>
                  <span className="text-accent font-bold">{isSelected ? '● Active' : 'Inspect →'}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE STAGE DETAIL INSPECTOR & TECHNICAL SCHEMATIC
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-accent/40 shadow-2xl relative overflow-hidden ring-1 ring-accent/30 space-y-6">
        {/* Glow accent halo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/60 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent text-background flex items-center justify-center shrink-0 shadow-lg shadow-accent/25">
              <DraftingStageIcon stageId={selectedStage.id} className="w-6 h-6 text-background" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                  ACTIVE STAGE {selectedStage.id.toString().padStart(2, '0')} OF 10
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                {selectedStage.name}
              </h3>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrevStage}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-border text-text-primary text-xs font-bold border border-border flex items-center gap-1.5 transition active:scale-95"
              aria-label="Previous stage"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5 text-accent" />
              <span>Previous Stage</span>
            </button>
            <button
              onClick={handleNextStage}
              className="px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-bright text-background text-xs font-extrabold flex items-center gap-1.5 transition shadow-md shadow-accent/20 active:scale-95"
              aria-label="Next stage"
            >
              <span>Next Stage</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary Stage Description */}
        <div className="p-4 bg-surface-elevated/70 rounded-xl border border-border/70">
          <p className="text-sm sm:text-base text-text-primary font-medium leading-relaxed">
            {selectedStage.desc}
          </p>
        </div>

        {/* Technical Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Deliverables & Specifications (Left Column) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                <span>📐</span>
                <span>Drafting Deliverables & Drawing Content</span>
              </h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                {selectedStage.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="text-text-primary font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                <span className="text-[10px] text-accent uppercase tracking-wider block font-bold">
                  Book Chapter Focus:
                </span>
                <span className="text-text-primary font-semibold block leading-tight">
                  {selectedStage.bookTopic}
                </span>
              </div>

              <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                <span className="text-[10px] text-accent uppercase tracking-wider block font-bold">
                  Standard Reference:
                </span>
                <span className="text-text-primary font-semibold block leading-tight truncate">
                  {selectedStage.standardsRef}
                </span>
              </div>
            </div>

            {/* Stage 3 Specific View Switcher */}
            {selectedStage.id === 3 && (
              <div className="p-4 bg-surface-elevated rounded-xl border border-accent/30 space-y-2.5">
                <span className="text-xs font-bold text-accent uppercase block">
                  Orthographic Principal Views Selector:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['FRONT', 'TOP', 'SIDE', 'ISOMETRIC', 'SECTION'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setViewType(v)}
                      className={`py-1.5 rounded text-[10px] font-bold border transition ${
                        viewType === v ? 'bg-accent text-background border-accent' : 'bg-surface border-border text-text-secondary'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stage 4 Specific Section Types */}
            {selectedStage.id === 4 && (
              <div className="p-4 bg-surface-elevated rounded-xl border border-accent/30 space-y-2.5">
                <span className="text-xs font-bold text-accent uppercase block">
                  Sectional Cutting Plane Types:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['FULL', 'HALF', 'OFFSET', 'REVOLVED'] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSectionType(sec)}
                      className={`py-1.5 rounded text-[10px] font-bold border transition ${
                        sectionType === sec ? 'bg-accent text-background border-accent' : 'bg-surface border-border text-text-secondary'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Video Simulation / 3D CAD Twin (Right Column) */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-steel px-1">
              <span>{mediaMode === 'video' ? 'Real-World Process Simulation' : 'Technical CAD Representation'}</span>
              <span className="text-accent">
                {mediaMode === 'video' ? 'Drafting Workflow Video' : `Stage ${selectedStage.id} Geometry`}
              </span>
            </div>

            {mediaMode === 'video' ? (
              <DraftingWorkflowVideoPlayer
                stageName={selectedStage.name}
                stageNumber={selectedStage.id}
                onSwitchTo3d={() => setMediaMode('3d')}
                show3dToggle={true}
                className="w-full h-[360px] sm:h-[400px] rounded-xl"
              />
            ) : (
              <div className="h-[360px] sm:h-[400px] w-full rounded-xl overflow-hidden border border-border bg-background relative shadow-inner">
                {/* Switch back to video button */}
                <button
                  onClick={() => setMediaMode('video')}
                  className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/30 transition backdrop-blur-md"
                >
                  <span>🎥</span>
                  <span>Watch Workflow Video</span>
                </button>

                <MechanicalViewer>
                  <mesh position={[0, 0, 0]}>
                    {selectedStage.id === 1 ? (
                      <boxGeometry args={[11, 11, 11]} />
                    ) : selectedStage.id === 4 || viewType === 'SECTION' ? (
                      <cylinderGeometry args={[5, 5, 14, 32]} />
                    ) : selectedStage.id === 5 ? (
                      <cylinderGeometry args={[4.5, 4.5, 16, 32]} />
                    ) : selectedStage.id === 6 ? (
                      <torusGeometry args={[6, 2.2, 16, 64]} />
                    ) : (
                      <cylinderGeometry args={[5, 5, 15, 32]} />
                    )}
                    <meshStandardMaterial
                      color={selectedStage.id === 10 ? '#2DD4BF' : '#16B8A6'}
                      metalness={0.4}
                      roughness={0.3}
                      wireframe={selectedStage.id === 4 || viewType === 'SECTION'}
                    />
                  </mesh>
                </MechanicalViewer>

                {/* Viewport Overlay Tag */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-surface/85 backdrop-blur border border-border text-[10px] font-mono text-text-secondary">
                  {selectedStage.id === 1
                    ? '3D Parametric CAD Solid'
                    : selectedStage.id === 4
                    ? `Internal Cavity Cross-Section: ${sectionType}`
                    : selectedStage.id === 5
                    ? 'Precision Machined Shaft: Ø30 ±0.02 mm'
                    : 'Orthographic CAD Viewport'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. COMPLETION STATE (STAGE 10)
            ───────────────────────────────────────────────────────────── */}
        {isFinalStage && (
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-accent/15 via-surface-elevated to-accent/10 border-2 border-accent shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-background flex items-center justify-center font-bold text-lg shadow-md shadow-accent/30">
                <CheckIcon className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-accent uppercase">
                  WORKFLOW COMPLETION STATE • FINAL DELIVERABLE
                </span>
                <h4 className="text-lg sm:text-xl font-black text-text-primary tracking-tight">
                  Engineering Drafting = Visual Communication + Manufacturing Information
                </h4>
              </div>
            </div>

            <p className="text-sm text-text-secondary font-medium italic border-l-2 border-accent pl-4 py-1 leading-relaxed">
              “A good engineering drawing should allow the designer, machinist, manufacturer, and quality inspector to understand the component consistently, without ambiguity.”
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono text-accent font-semibold">
                ✓ All 10 stages completed from 3D Model to Production Handover.
              </span>

              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-bright text-background font-black text-xs transition shadow-lg shadow-accent/25 flex items-center gap-2 active:scale-95"
              >
                <span>↺</span>
                <span>Restart Workflow</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE DRAFTING STAGE NODE FOR SERPENTINE FLOW
// ─────────────────────────────────────────────────────────────────────────────
interface DraftingStageNodeProps {
  stage: DraftingStageData;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function DraftingStageNode({
  stage,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onKeyDown,
}: DraftingStageNodeProps) {
  return (
    <div
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Stage ${stage.id}: ${stage.name}`}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onKeyDown={onKeyDown}
      className={`w-full h-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 relative flex flex-col justify-between space-y-3 group focus:outline-none focus:ring-2 focus:ring-accent ${
        isSelected
          ? 'bg-accent/15 border-accent shadow-xl shadow-accent/20 ring-1 ring-accent -translate-y-1'
          : isHovered
          ? 'bg-surface-elevated border-accent/60 -translate-y-1 shadow-lg shadow-black/40'
          : 'bg-surface-elevated/90 border-border hover:border-steel'
      }`}
    >
      {/* Top Header: Badge & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded transition ${
            isSelected ? 'bg-accent text-background shadow-sm' : 'bg-surface text-accent border border-border'
          }`}
        >
          STAGE {stage.id.toString().padStart(2, '0')}
        </span>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
            isSelected
              ? 'bg-accent text-background shadow-md shadow-accent/30'
              : isHovered
              ? 'bg-accent/20 text-accent'
              : 'bg-surface text-steel group-hover:text-text-primary'
          }`}
        >
          <DraftingStageIcon stageId={stage.id} className="w-4 h-4" />
        </div>
      </div>

      {/* Title & Short Description */}
      <div className="space-y-1 flex-1">
        <h3
          className={`text-xs font-bold tracking-tight line-clamp-1 transition ${
            isSelected ? 'text-accent font-extrabold' : 'text-text-primary group-hover:text-accent-bright'
          }`}
        >
          {stage.name}
        </h3>
        <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
          {stage.desc}
        </p>
      </div>

      {/* Bottom Status Tag */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-steel">
        <span className="truncate max-w-[100px]">{stage.bookTopic}</span>
        <span className={isSelected ? 'text-accent font-bold' : 'group-hover:text-accent'}>
          {isSelected ? '● Active' : 'Inspect →'}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERPENTINE DIRECTIONAL CONNECTOR ARROW
// ─────────────────────────────────────────────────────────────────────────────
interface DraftingConnectorProps {
  direction: 'right' | 'left' | 'down';
  isActive: boolean;
  isHighlighted: boolean;
}

function DraftingConnector({ direction, isActive, isHighlighted }: DraftingConnectorProps) {
  const colorClass = isHighlighted
    ? 'text-accent-bright scale-110 drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]'
    : isActive
    ? 'text-accent'
    : 'text-steel/50';

  return (
    <div className={`transition-all duration-300 ${colorClass}`}>
      {direction === 'right' && <ArrowRightIcon className="w-5 h-5 stroke-[2.5]" />}
      {direction === 'left' && <ArrowLeftIcon className="w-5 h-5 stroke-[2.5]" />}
      {direction === 'down' && <ArrowDownIcon className="w-5 h-5 stroke-[2.5]" />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE ICONS HELPER
// ─────────────────────────────────────────────────────────────────────────────
function DraftingStageIcon({ stageId, className = 'w-4 h-4' }: { stageId: number; className?: string }) {
  switch (stageId) {
    case 1: // 3D Model
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m21 16-9 5-9-5V8l9-5 9 5v8Z" />
          <path d="m3.27 6.96 8.73 4.9 8.73-4.9" />
          <path d="M12 22.08V12" />
        </svg>
      );
    case 2: // 2D Drawing Creation
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" x2="21" y1="9" y2="9" />
          <line x1="9" x2="9" y1="21" y2="9" />
        </svg>
      );
    case 3: // Orthographic Views
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case 4: // Section Views
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" x2="12" y1="3" y2="21" />
          <line x1="12" x2="18" y1="7" y2="13" />
          <line x1="12" x2="19" y1="12" y2="19" />
        </svg>
      );
    case 5: // Dimensions & Tolerances
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 5v14" />
          <path d="M21 5v14" />
          <path d="M3 12h18" />
          <path d="m6 9-3 3 3 3" />
          <path d="m18 9 3 3-3 3" />
        </svg>
      );
    case 6: // GD&T
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" x2="12" y1="3" y2="21" />
          <line x1="3" x2="21" y1="12" y2="12" />
        </svg>
      );
    case 7: // Surface Finish
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m3 16 6-12 6 12h6" />
          <line x1="3" x2="21" y1="20" y2="20" />
        </svg>
      );
    case 8: // Material & Manufacturing Notes
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
      );
    case 9: // Title Block & Revision
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <rect x="12" y="14" width="9" height="7" />
          <line x1="12" x2="21" y1="17" y2="17" />
          <line x1="16" x2="16" y1="14" y2="21" />
        </svg>
      );
    case 10: // Final Manufacturing Drawing
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
