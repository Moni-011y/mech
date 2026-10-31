import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import MechanicalViewer from '../MechanicalViewer/MechanicalViewer';
import DesignWorkflowVideoPlayer from './DesignWorkflowVideoPlayer';
import {
  CustomerRequirementIcon,
  ConceptDevelopmentIcon,
  DesignCalculationIcon,
  Modeling3DIcon,
  EngineeringDrawingIcon,
  GdtApplicationIcon,
  BomCreationIcon,
  EngineeringAnalysisIcon,
  PrototypeManufacturingIcon,
  TestingIcon,
  FinalProductionIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
  CheckIcon,
  CloseIcon,
} from './WorkflowIcons';

export interface WorkflowStageData {
  id: number;
  numberStr: string;
  name: string;
  shortDesc: string;
  desc: string;
  keyPoints: string[];
  icon: React.ComponentType<{ className?: string; size?: number }>;
  category: string;
  toolsAndStandards: string;
  milestone: string;
}

export const INDUSTRIAL_PIPELINE_STAGES: WorkflowStageData[] = [
  {
    id: 1,
    numberStr: '01',
    name: 'Customer Requirement',
    shortDesc: "Identify customer needs, intended application, functional performance, safety, and constraints.",
    desc: "Identify the customer's needs, intended application, functional requirements, expected performance, safety considerations, manufacturing constraints, and economic requirements.",
    keyPoints: [
      'Functional and performance requirements',
      'Safety and reliability considerations',
      'Manufacturing feasibility',
      'Cost and application constraints',
    ],
    icon: CustomerRequirementIcon,
    category: 'REQUIREMENTS',
    toolsAndStandards: 'Voice of Customer (VoC), PRD, QFD Matrix, ISO 9001',
    milestone: 'Customer Requirements Specification Sign-off',
  },
  {
    id: 2,
    numberStr: '02',
    name: 'Concept Development',
    shortDesc: 'Develop and evaluate product concepts to identify innovative, feasible design solutions.',
    desc: 'Develop and evaluate product concepts to identify suitable design solutions. Consider innovative ideas, feasibility, functionality, and manufacturing practicality.',
    keyPoints: [
      'Idea generation',
      'Concept exploration',
      'Feasibility evaluation',
      'Concept selection',
    ],
    icon: ConceptDevelopmentIcon,
    category: 'CONCEPT',
    toolsAndStandards: 'Morphological Charts, Pugh Matrix, Hand Sketches, DFM Heuristics',
    milestone: 'Conceptual Design Review & Architecture Freeze',
  },
  {
    id: 3,
    numberStr: '03',
    name: 'Design Calculation',
    shortDesc: 'Perform design calculations to establish suitable engineering dimensions and parameters.',
    desc: 'Perform the design calculations required to establish suitable engineering dimensions and design parameters. Present calculations as a supporting engineering activity without inventing formulas, numerical results, or specifications not supplied by the reference material.',
    keyPoints: [
      'Engineering design parameters',
      'Dimensional considerations',
      'Design verification inputs',
      'Preparation for detailed modeling',
    ],
    icon: DesignCalculationIcon,
    category: 'CALCULATION',
    toolsAndStandards: 'AGMA 2001-D04, Shigley Mechanical Engineering Design, ISO 6336',
    milestone: 'Engineering Calculation Dossier Approval',
  },
  {
    id: 4,
    numberStr: '04',
    name: '3D Modeling',
    shortDesc: 'Create a three-dimensional CAD model to visualize, modify, and prepare for manufacturing.',
    desc: 'Create a three-dimensional CAD representation of the component. The model helps visualize the design, make modifications, and prepare for drawings, manufacturing, and engineering analysis.',
    keyPoints: [
      'Parametric CAD modeling',
      'Solid geometry creation',
      'Extrude, Revolve, Sweep, and Loft',
      'Pattern features and model modifications',
    ],
    icon: Modeling3DIcon,
    category: 'CAD MODELING',
    toolsAndStandards: 'Extrude, Revolve, Sweep, Loft, Pattern • SolidWorks, PTC Creo, NX',
    milestone: '3D CAD Model Verification & Interference Clearance',
  },
  {
    id: 5,
    numberStr: '05',
    name: 'Engineering Drawing',
    shortDesc: 'Convert the 3D model into a manufacturing-ready drawing with dimensions and tolerances.',
    desc: "Convert the 3D CAD model into a manufacturing-ready engineering drawing that communicates the component's geometry, dimensions, material details, tolerances, and manufacturing requirements.",
    keyPoints: [
      'Drawing views and projections',
      'Dimensions and annotations',
      'Material specifications',
      'Manufacturing documentation',
    ],
    icon: EngineeringDrawingIcon,
    category: 'DRAFTING',
    toolsAndStandards: 'ASME Y14.3, ISO 128, 1st & 3rd Angle Projections, Section Views',
    milestone: 'Manufacturing Drawing Package Release',
  },
  {
    id: 6,
    numberStr: '06',
    name: 'GD&T Application',
    shortDesc: 'Apply Geometric Dimensioning and Tolerancing to control allowable geometric variation.',
    desc: 'Apply Geometric Dimensioning and Tolerancing (GD&T) to communicate the allowable geometric variation of manufactured components and establish the required relationships between features.',
    keyPoints: [
      'Datum references',
      'Form tolerances',
      'Orientation tolerances',
      'Location and profile tolerances',
      'Runout tolerances',
    ],
    icon: GdtApplicationIcon,
    category: 'TOLERANCING',
    toolsAndStandards: 'ASME Y14.5-2018, ISO 1101, Feature Control Frames, MMC/LMC/RFS',
    milestone: 'GD&T & Tolerance Stack-up Validation Sign-off',
  },
  {
    id: 7,
    numberStr: '07',
    name: 'BOM Creation',
    shortDesc: 'Prepare the Bill of Materials listing components, parts, materials, and hardware.',
    desc: 'Prepare the Bill of Materials (BOM), listing the components, parts, materials, and hardware required for the product.',
    keyPoints: [
      'Part number',
      'Component name',
      'Material',
      'Quantity',
      'Weight and remarks',
    ],
    icon: BomCreationIcon,
    category: 'DOCUMENTATION',
    toolsAndStandards: 'ASME Y14.34, EBOM & MBOM Architecture, PLM / ERP Integration',
    milestone: 'BOM Release to Procurement & Production Planning',
  },
  {
    id: 8,
    numberStr: '08',
    name: 'Engineering Analysis',
    shortDesc: 'Evaluate design performance and behavior under operating conditions before manufacturing.',
    desc: 'Evaluate the expected behavior of the design under relevant operating conditions before manufacturing. Use appropriate engineering analysis methods to understand performance and identify opportunities for design improvement.',
    keyPoints: [
      'Static structural analysis',
      'Thermal analysis',
      'Fatigue analysis',
      'Vibration analysis',
      'Computational Fluid Dynamics (CFD)',
    ],
    icon: EngineeringAnalysisIcon,
    category: 'SIMULATION',
    toolsAndStandards: 'FEA Matrix Solvers, CFD Navier-Stokes, von Mises Yield Criterion',
    milestone: 'Engineering Analysis & Structural Verification Sign-off',
  },
  {
    id: 9,
    numberStr: '09',
    name: 'Prototype Manufacturing',
    shortDesc: 'Manufacture a physical prototype to evaluate form, functionality, assembly, and feasibility.',
    desc: "Manufacture a physical prototype based on the approved design information. The prototype helps evaluate the design's physical form, functionality, assembly, and practical manufacturability.",
    keyPoints: [
      'Prototype preparation',
      'Physical component development',
      'Assembly evaluation',
      'Manufacturing feasibility',
    ],
    icon: PrototypeManufacturingIcon,
    category: 'PROTOTYPING',
    toolsAndStandards: 'CNC 3/5-Axis Machining, Additive SLS/FDM, CAM G-code, FAI Tooling',
    milestone: 'Physical Prototype Handover & Fit-Check Approval',
  },
  {
    id: 10,
    numberStr: '10',
    name: 'Testing',
    shortDesc: 'Test the prototype against functional and performance requirements to drive improvements.',
    desc: 'Test the prototype against the intended functional and performance requirements. Record observations, identify issues, and use the findings to support design improvements.',
    keyPoints: [
      'Functional validation',
      'Performance evaluation',
      'Identification of design issues',
      'Feedback for improvement',
    ],
    icon: TestingIcon,
    category: 'VALIDATION',
    toolsAndStandards: 'ASTM / ISO Testing Standards, Strain Gauges, ALT Life Cycling, Vibration Shaker',
    milestone: 'Functional Performance Qualification Passed',
  },
  {
    id: 11,
    numberStr: '11',
    name: 'Final Production',
    shortDesc: 'Finalize approved engineering drawings, BOM, and documentation for commercial production.',
    desc: 'Finalize the design documentation and move the validated design toward production, using the approved engineering information and manufacturing requirements.',
    keyPoints: [
      'Final design review',
      'Approved engineering drawings',
      'Completed BOM and documentation',
      'Production readiness',
    ],
    icon: FinalProductionIcon,
    category: 'MANUFACTURING',
    toolsAndStandards: 'ISO 9001, PPAP Documentation, QC Inspection Routines, SOP Work Instructions',
    milestone: 'Commercial Production Release Handover',
  },
];

// Analysis sub-workflow steps for Stage 08 Highlight
export const ANALYSIS_SUB_WORKFLOW = [
  { step: 1, title: 'CAD Model', desc: 'Prepare clean 3D solid geometry for finite element discretization.' },
  { step: 2, title: 'Material Assignment', desc: 'Assign elastic modulus, Poisson ratio, density, and yield strength.' },
  { step: 3, title: 'Meshing', desc: 'Discretize solid geometry into tetrahedral or hexahedral elements.' },
  { step: 4, title: 'Boundary Conditions', desc: 'Define fixed constraints, pin joints, and frictionless supports.' },
  { step: 5, title: 'Load Application', desc: 'Apply force vectors, pressure, torque, or gravity payloads.' },
  { step: 6, title: 'Solver Execution', desc: 'Execute matrix solver algorithms to solve structural equations.' },
  { step: 7, title: 'Result Interpretation', desc: 'Evaluate von Mises stress heatmap, deformation, and Factor of Safety.' },
  { step: 8, title: 'Design Optimization', desc: 'Iterate geometry to optimize mass while maintaining FoS ≥ 2.0.' },
];

// Output categories for Stage 08
export const ANALYSIS_OUTPUT_CATEGORIES = [
  {
    name: 'Total Deformation',
    icon: '📏',
    metric: 'Max 0.42 mm Deflection',
    subtext: 'Calculated along cantilever arm under peak operational load',
    status: 'Within Tolerable Limits',
  },
  {
    name: 'Equivalent Stress',
    icon: '⚡',
    metric: 'von Mises 142.6 MPa',
    subtext: 'Below material yield strength (AISI 1045 steel: 310 MPa)',
    status: 'Safe Stress Level',
  },
  {
    name: 'Factor of Safety',
    icon: '🛡️',
    metric: 'FoS = 2.17',
    subtext: 'Exceeds target threshold (FoS ≥ 2.0 industrial guideline)',
    status: 'Approved Design Margin',
  },
  {
    name: 'Predicted Fatigue Life',
    icon: '⏳',
    metric: '1.45 × 10⁶ Cycles',
    subtext: 'High-cycle endurance prediction based on S-N stress curve',
    status: 'Meets Duty Cycle Life',
  },
];

interface IndustrialPipelineProps {
  onBack?: () => void;
  initialStageId?: number;
}

export default function IndustrialPipeline({ onBack, initialStageId = 1 }: IndustrialPipelineProps) {
  const [selectedStageId, setSelectedStageId] = useState<number>(initialStageId);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(true);
  const [hoveredStageId, setHoveredStageId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'pipeline' | 'grid'>('pipeline');
  const [cadFeature, setCadFeature] = useState<'EXTRUDE' | 'REVOLVE' | 'SWEEP' | 'LOFT' | 'PATTERN'>('EXTRUDE');
  const [analysisActiveStep, setAnalysisActiveStep] = useState<number>(1);
  const [mediaMode, setMediaMode] = useState<'video' | '3d'>('video');

  const inspectorRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const selectedStage =
    INDUSTRIAL_PIPELINE_STAGES.find((s) => s.id === selectedStageId) || INDUSTRIAL_PIPELINE_STAGES[0];
  const progressPercent = Math.round((selectedStageId / INDUSTRIAL_PIPELINE_STAGES.length) * 100);

  const handleSelectStage = (id: number, autoScroll = false) => {
    setSelectedStageId(id);
    setIsDetailsExpanded(true);
    if (autoScroll && inspectorRef.current) {
      setTimeout(() => {
        inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  };

  const handlePrevStage = () => {
    setSelectedStageId((prev) => (prev > 1 ? prev - 1 : INDUSTRIAL_PIPELINE_STAGES.length));
  };

  const handleNextStage = () => {
    setSelectedStageId((prev) => (prev < INDUSTRIAL_PIPELINE_STAGES.length ? prev + 1 : 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight') {
        handleNextStage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevStage();
      } else if (e.key === 'Escape' && isDetailsExpanded) {
        setIsDetailsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isDetailsExpanded]);

  // Framer Motion Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.35, ease: 'easeOut' },
    },
  };

  // Row breakdown for 4-column desktop pipeline
  const row1 = INDUSTRIAL_PIPELINE_STAGES.slice(0, 4); // Stages 1, 2, 3, 4 (Left to Right)
  const row2Stage5 = INDUSTRIAL_PIPELINE_STAGES[4]; // Stage 5 (Col 4)
  const row2Stage6 = INDUSTRIAL_PIPELINE_STAGES[5]; // Stage 6 (Col 3)
  const row2Stage7 = INDUSTRIAL_PIPELINE_STAGES[6]; // Stage 7 (Col 2)
  const row2Stage8 = INDUSTRIAL_PIPELINE_STAGES[7]; // Stage 8 (Col 1)
  const row3Stage9 = INDUSTRIAL_PIPELINE_STAGES[8]; // Stage 9 (Col 1)
  const row3Stage10 = INDUSTRIAL_PIPELINE_STAGES[9]; // Stage 10 (Col 2)
  const row3Stage11 = INDUSTRIAL_PIPELINE_STAGES[10]; // Stage 11 (Col 3)

  return (
    <section
      id="industrial-design-engineering-pipeline"
      aria-label="Industrial Design Engineering Pipeline"
      className="space-y-8 animate-fadeIn"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. SECTION TITLE, SUBTITLE & REFINED INDUSTRIAL INTRO
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl relative overflow-hidden space-y-6">
        {/* Subtle engineering grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#16B8A6 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-4xl">
            {/* Tag Badge */}
            <div className="flex flex-wrap items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-elevated hover:bg-border text-text-primary text-xs font-semibold border border-border transition focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Back to workflow categories overview"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 text-accent" />
                  <span>Workflow Categories</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                11-STAGE INDUSTRIAL PIPELINE
              </span>
              <span className="text-xs font-mono text-text-secondary bg-surface-elevated px-2.5 py-0.5 rounded border border-border">
                STAGE {selectedStage.numberStr} OF 11 ACTIVE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight leading-tight">
              Industrial Design Engineering Pipeline
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-semibold text-accent-bright leading-relaxed">
              From customer requirements to final production — a structured engineering design process.
            </p>

            {/* Short Introduction */}
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed pt-1 border-t border-border/50">
              Explore the complete product development journey, from understanding customer needs and developing
              concepts to engineering validation, prototype testing, and final production. Each stage contributes to
              a reliable, manufacturable, and well-documented engineering design.
            </p>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto bg-surface-elevated p-1.5 rounded-xl border border-border">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'pipeline'
                  ? 'bg-accent text-background shadow-md shadow-accent/20 font-extrabold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
              title="View sequential connected process flow"
              aria-pressed={viewMode === 'pipeline'}
            >
              <span>🗺️</span>
              <span>Connected Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-accent text-background shadow-md shadow-accent/20 font-extrabold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
              title="View responsive grid of all 11 stage cards"
              aria-pressed={viewMode === 'grid'}
            >
              <span>📑</span>
              <span>All 11 Stages</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Flow Progression Stepper */}
        <div className="pt-4 border-t border-border/70 space-y-2.5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-accent font-bold">Pipeline Progression:</span>
              <span className="text-text-primary font-bold">
                Stage {selectedStage.numberStr} — {selectedStage.name}
              </span>
            </div>
            <span className="text-accent-bright font-bold">
              {progressPercent}% Complete ({selectedStageId} of 11 Stages)
            </span>
          </div>

          {/* Interactive Progress Bar */}
          <div className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden border border-border p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-accent via-accent-bright to-accent rounded-full transition-all duration-500 ease-out shadow-sm shadow-accent/50"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Quick-Jump Step Pills (1 to 11) */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
            {INDUSTRIAL_PIPELINE_STAGES.map((st) => {
              const isSelected = st.id === selectedStageId;
              const isPast = st.id < selectedStageId;

              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStage(st.id, true)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-accent text-background border-accent shadow-lg shadow-accent/25 scale-105 ring-2 ring-accent/30'
                      : isPast
                      ? 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25'
                      : 'bg-surface-elevated text-text-secondary border-border hover:text-text-primary hover:border-steel'
                  }`}
                  title={`Stage ${st.numberStr}: ${st.name}`}
                  aria-label={`Jump to Stage ${st.numberStr}: ${st.name}`}
                >
                  <span>{st.numberStr}</span>
                  <span className="hidden xl:inline text-[10px] font-normal truncate max-w-[80px]">
                    {st.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. WORKFLOW STAGES DISPLAY: PIPELINE VIEW vs GRID VIEW
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'pipeline' ? (
        <div className="space-y-6">
          {/* DESKTOP CONNECTED PIPELINE (Visible on lg+ screens: 1024px+) */}
          <div className="hidden lg:block bg-surface p-7 rounded-2xl border border-border shadow-xl relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#16B8A6 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8 relative z-10"
            >
              {/* ── ROW 1: Stages 01 → 02 → 03 → 04 (Left-to-Right) ── */}
              <div className="relative">
                <div className="grid grid-cols-4 gap-6 items-stretch">
                  {row1.map((stage, idx) => (
                    <div key={stage.id} className="relative flex items-center">
                      <StageCard
                        stage={stage}
                        isSelected={stage.id === selectedStageId}
                        isHovered={stage.id === hoveredStageId}
                        onSelect={() => handleSelectStage(stage.id, true)}
                        onHover={(hov) => setHoveredStageId(hov ? stage.id : null)}
                      />
                      {/* Horizontal right arrow between columns 1-2, 2-3, 3-4 */}
                      {idx < 3 && (
                        <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                          <ConnectorArrow
                            direction="right"
                            isActive={stage.id < selectedStageId}
                            isHighlighted={hoveredStageId === stage.id || hoveredStageId === stage.id + 1}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Down connector from Stage 4 (Row 1 End) to Stage 5 (Row 2 Start) on Column 4 */}
                <div className="absolute right-[11.5%] -bottom-8 w-8 h-8 z-20 pointer-events-none flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-0.5 h-4 transition-colors duration-300 ${
                        selectedStageId >= 5 ? 'bg-accent' : 'bg-border'
                      }`}
                    />
                    <ArrowDownIcon
                      className={`w-4 h-4 transition-colors duration-300 ${
                        selectedStageId >= 5 ? 'text-accent' : 'text-steel'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ── ROW 2: Stages 08 ← 07 ← 06 ← 05 (Right-to-Left) ── */}
              <div className="relative pt-4">
                <div className="grid grid-cols-4 gap-6 items-stretch">
                  {/* Column 1: Stage 8 */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage8}
                      isSelected={row2Stage8.id === selectedStageId}
                      isHovered={row2Stage8.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row2Stage8.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage8.id : null)}
                    />
                  </div>

                  {/* Column 2: Stage 7 */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage7}
                      isSelected={row2Stage7.id === selectedStageId}
                      isHovered={row2Stage7.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row2Stage7.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage7.id : null)}
                    />
                    {/* Left arrow to Column 1 (Stage 8) */}
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="left"
                        isActive={selectedStageId >= 8}
                        isHighlighted={hoveredStageId === 7 || hoveredStageId === 8}
                      />
                    </div>
                  </div>

                  {/* Column 3: Stage 6 */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage6}
                      isSelected={row2Stage6.id === selectedStageId}
                      isHovered={row2Stage6.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row2Stage6.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage6.id : null)}
                    />
                    {/* Left arrow to Column 2 (Stage 7) */}
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="left"
                        isActive={selectedStageId >= 7}
                        isHighlighted={hoveredStageId === 6 || hoveredStageId === 7}
                      />
                    </div>
                  </div>

                  {/* Column 4: Stage 5 */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage5}
                      isSelected={row2Stage5.id === selectedStageId}
                      isHovered={row2Stage5.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row2Stage5.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage5.id : null)}
                    />
                    {/* Left arrow to Column 3 (Stage 6) */}
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="left"
                        isActive={selectedStageId >= 6}
                        isHighlighted={hoveredStageId === 5 || hoveredStageId === 6}
                      />
                    </div>
                  </div>
                </div>

                {/* Down connector from Stage 8 (Row 2 End) to Stage 9 (Row 3 Start) on Column 1 */}
                <div className="absolute left-[11.5%] -bottom-8 w-8 h-8 z-20 pointer-events-none flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-0.5 h-4 transition-colors duration-300 ${
                        selectedStageId >= 9 ? 'bg-accent' : 'bg-border'
                      }`}
                    />
                    <ArrowDownIcon
                      className={`w-4 h-4 transition-colors duration-300 ${
                        selectedStageId >= 9 ? 'text-accent' : 'text-steel'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ── ROW 3: Stages 09 → 10 → 11 → Production Readiness (Left-to-Right) ── */}
              <div className="relative pt-4">
                <div className="grid grid-cols-4 gap-6 items-stretch">
                  {/* Column 1: Stage 9 */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row3Stage9}
                      isSelected={row3Stage9.id === selectedStageId}
                      isHovered={row3Stage9.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row3Stage9.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row3Stage9.id : null)}
                    />
                    {/* Right arrow to Column 2 (Stage 10) */}
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="right"
                        isActive={selectedStageId >= 10}
                        isHighlighted={hoveredStageId === 9 || hoveredStageId === 10}
                      />
                    </div>
                  </div>

                  {/* Column 2: Stage 10 */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row3Stage10}
                      isSelected={row3Stage10.id === selectedStageId}
                      isHovered={row3Stage10.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row3Stage10.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row3Stage10.id : null)}
                    />
                    {/* Right arrow to Column 3 (Stage 11) */}
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="right"
                        isActive={selectedStageId >= 11}
                        isHighlighted={hoveredStageId === 10 || hoveredStageId === 11}
                      />
                    </div>
                  </div>

                  {/* Column 3: Stage 11 */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row3Stage11}
                      isSelected={row3Stage11.id === selectedStageId}
                      isHovered={row3Stage11.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row3Stage11.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row3Stage11.id : null)}
                    />
                    {/* Right arrow to Pipeline Outcome Node */}
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="right"
                        isActive={selectedStageId === 11}
                        isHighlighted={hoveredStageId === 11}
                      />
                    </div>
                  </div>

                  {/* Column 4: Pipeline Gate / Production Readiness Card */}
                  <div className="relative flex items-center">
                    <div className="w-full h-full p-5 rounded-2xl border border-dashed border-accent/40 bg-accent/5 flex flex-col justify-center items-center text-center space-y-2.5">
                      <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-md shadow-accent/20">
                        <CheckIcon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase">
                        PIPELINE OUTCOME
                      </span>
                      <h4 className="text-xs font-extrabold text-text-primary">
                        Commercial Production Release
                      </h4>
                      <p className="text-[11px] text-text-secondary leading-tight">
                        Validated prototypes, approved engineering drawings, completed BOM, and manufacturing sign-off.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MOBILE & TABLET VERTICAL TIMELINE (Visible on screens < 1024px) */}
          <div className="block lg:hidden bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-xl">
            <div className="relative pl-6 sm:pl-8 space-y-5">
              {/* Continuous vertical connecting line */}
              <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-6 w-0.5 bg-border -z-0">
                <div
                  className="w-full bg-accent transition-all duration-300"
                  style={{
                    height: `${((selectedStageId - 1) / (INDUSTRIAL_PIPELINE_STAGES.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {INDUSTRIAL_PIPELINE_STAGES.map((stage) => {
                const isSelected = stage.id === selectedStageId;
                const isPast = stage.id < selectedStageId;
                const StageIcon = stage.icon;

                return (
                  <div key={stage.id} className="relative z-10 flex items-start gap-3.5">
                    {/* Node Dot / Icon Badge */}
                    <button
                      onClick={() => handleSelectStage(stage.id, true)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center -ml-4 sm:-ml-4.5 border transition shrink-0 ${
                        isSelected
                          ? 'bg-accent text-background border-accent shadow-lg shadow-accent/30 ring-4 ring-accent/20'
                          : isPast
                          ? 'bg-surface-elevated text-accent border-accent/60'
                          : 'bg-surface-elevated text-steel border-border hover:border-text-secondary'
                      }`}
                      aria-label={`Select Stage ${stage.numberStr}: ${stage.name}`}
                    >
                      <StageIcon className="w-4 h-4" />
                    </button>

                    {/* Stage Card Body */}
                    <div
                      onClick={() => handleSelectStage(stage.id, true)}
                      className={`flex-1 p-4 rounded-xl border cursor-pointer transition text-left space-y-2 ${
                        isSelected
                          ? 'bg-accent/10 border-accent shadow-lg shadow-accent/10 ring-1 ring-accent'
                          : 'bg-surface-elevated border-border hover:border-steel/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-accent">
                          STAGE {stage.numberStr} • {stage.category}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-accent text-background">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-text-primary leading-snug">
                        {stage.name}
                      </h3>

                      <p className="text-xs text-text-secondary leading-relaxed">
                        {stage.shortDesc}
                      </p>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-steel truncate max-w-[150px]">
                          {stage.keyPoints[0]}
                        </span>
                        <span className="text-xs font-bold text-accent flex items-center gap-1">
                          Explore Stage →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            GRID VIEW: ALL 11 STAGE CARDS SIMULTANEOUSLY
            ───────────────────────────────────────────────────────────── */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {INDUSTRIAL_PIPELINE_STAGES.map((stage) => {
            const isSelected = stage.id === selectedStageId;
            const StageIcon = stage.icon;

            return (
              <motion.div
                key={stage.id}
                variants={cardVariants}
                onClick={() => handleSelectStage(stage.id, true)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                  isSelected
                    ? 'bg-accent/15 border-accent shadow-xl shadow-accent/20 ring-1 ring-accent -translate-y-1'
                    : 'bg-surface border-border hover:border-accent/60 hover:bg-surface-elevated -translate-y-0.5 hover:shadow-lg'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded bg-surface-elevated border border-border text-accent">
                      STAGE {stage.numberStr}
                    </span>
                    <div
                      className={`p-2 rounded-xl transition ${
                        isSelected
                          ? 'bg-accent text-background shadow-md shadow-accent/30'
                          : 'bg-accent/10 text-accent group-hover:bg-accent/20'
                      }`}
                    >
                      <StageIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono uppercase text-steel tracking-wider block">
                      {stage.category}
                    </span>
                    <h3 className="text-base font-extrabold text-text-primary group-hover:text-accent-bright transition">
                      {stage.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                      {stage.shortDesc}
                    </p>
                  </div>

                  {/* Key Points Preview */}
                  <div className="pt-2 border-t border-border/50 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                      Key Points:
                    </span>
                    <ul className="space-y-1">
                      {stage.keyPoints.slice(0, 2).map((pt, i) => (
                        <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1.5">
                          <span className="text-accent">•</span>
                          <span className="truncate">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-steel">
                    {stage.keyPoints.length} Key Focus Areas
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStage(stage.id, true);
                    }}
                    className="font-bold text-accent group-hover:underline flex items-center gap-1"
                  >
                    Explore Stage →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. EXPANDABLE ACTIVE STAGE INSPECTOR & INTERACTIVE DETAILS PANEL
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={inspectorRef}
        className="bg-surface p-6 sm:p-8 rounded-2xl border border-accent/40 shadow-2xl relative overflow-hidden ring-1 ring-accent/30 space-y-6"
      >
        {/* Glow accent halo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/60 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent text-background flex items-center justify-center shrink-0 shadow-lg shadow-accent/25">
              <selectedStage.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                  ACTIVE STAGE {selectedStage.numberStr} OF 11 • {selectedStage.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                Stage {selectedStage.numberStr} — {selectedStage.name}
              </h2>
            </div>
          </div>

          {/* Previous / Next & Close controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handlePrevStage}
              className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-border text-text-primary text-xs font-bold border border-border flex items-center gap-1.5 transition active:scale-95"
              aria-label="Previous stage"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5 text-accent" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNextStage}
              className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-bright text-background text-xs font-extrabold flex items-center gap-1.5 transition shadow-md shadow-accent/20 active:scale-95"
              aria-label="Next stage"
            >
              <span>Next Stage</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="p-1.5 rounded-xl bg-surface-elevated hover:bg-border text-text-secondary hover:text-text-primary border border-border transition ml-1"
              title={isDetailsExpanded ? 'Collapse stage details' : 'Expand stage details'}
              aria-label="Toggle details view"
            >
              {isDetailsExpanded ? (
                <CloseIcon className="w-4 h-4 text-text-secondary" />
              ) : (
                <span className="text-xs font-bold px-1.5">Expand ▼</span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        <AnimatePresence>
          {isDetailsExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Detailed Stage Description Box (Exact Book Content) */}
              <div className="p-5 bg-surface-elevated/80 rounded-xl border border-border space-y-2">
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                  Stage Description & Engineering Scope:
                </span>
                <p className="text-sm sm:text-base text-text-primary font-medium leading-relaxed">
                  {selectedStage.desc}
                </p>
              </div>

              {/* 2-Column Technical Layout: Key Points & Visual Artifacts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Key Points & Standards */}
                <div className="lg:col-span-6 space-y-5">
                  {/* Key Points Card */}
                  <div className="p-5 bg-surface-elevated rounded-xl border border-border space-y-3 shadow-md">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>📌</span>
                        <span>Key Points & Core Deliverables</span>
                      </span>
                      <span className="text-[10px] font-mono text-steel">
                        {selectedStage.keyPoints.length} Verified Standards
                      </span>
                    </h3>

                    <ul className="space-y-2.5 text-xs">
                      {selectedStage.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-surface/70 border border-border/60 hover:border-accent/40 transition"
                        >
                          <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                            ✓
                          </span>
                          <span className="text-text-primary font-medium leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Supporting Standards & Milestone Sign-off */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                      <span className="text-[10px] text-accent uppercase tracking-wider block font-bold">
                        Methods & Standards:
                      </span>
                      <span className="text-text-primary font-semibold block leading-tight">
                        {selectedStage.toolsAndStandards}
                      </span>
                    </div>

                    <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                      <span className="text-[10px] text-accent uppercase tracking-wider block font-bold">
                        Stage Gate Milestone:
                      </span>
                      <span className="text-text-primary font-semibold block leading-tight">
                        {selectedStage.milestone}
                      </span>
                    </div>
                  </div>

                  {/* ──────────────────────────────────────────────────────────
                      STAGE 04 HIGHLIGHT: 5 Core CAD Features
                      ────────────────────────────────────────────────────────── */}
                  {selectedStage.id === 4 && (
                    <div className="p-4 bg-surface-elevated rounded-xl border border-accent/40 space-y-3">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                        CAD Modeling Features (Extrude, Revolve, Sweep, Loft, Pattern)
                      </span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {(['EXTRUDE', 'REVOLVE', 'SWEEP', 'LOFT', 'PATTERN'] as const).map((feat) => (
                          <button
                            key={feat}
                            onClick={() => setCadFeature(feat)}
                            className={`py-1.5 rounded text-[10px] font-bold border transition ${
                              cadFeature === feat
                                ? 'bg-accent text-background border-accent shadow-sm'
                                : 'bg-surface border-border text-text-secondary hover:text-text-primary'
                            }`}
                          >
                            {feat}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-text-secondary font-mono bg-background p-2.5 rounded border border-border/50">
                        {cadFeature === 'EXTRUDE' &&
                          'EXTRUDE: Creates 3D solid geometry by extending a closed 2D sketch profile linearly along a vector.'}
                        {cadFeature === 'REVOLVE' &&
                          'REVOLVE: Creates rotational geometry by revolving a 2D sketch profile 360° around an axial centerline.'}
                        {cadFeature === 'SWEEP' &&
                          'SWEEP: Creates solid bodies by sweeping a 2D planar profile curve along a continuous 3D trajectory guide.'}
                        {cadFeature === 'LOFT' &&
                          'LOFT: Creates complex transitional organic geometry blending between multiple distinct planar sketch profiles.'}
                        {cadFeature === 'PATTERN' &&
                          'PATTERN: Mathematically duplicates parametric features in linear grids, circular polar arrays, or curve-driven paths.'}
                      </p>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      STAGE 06 HIGHLIGHT: GD&T Feature Controls
                      ────────────────────────────────────────────────────────── */}
                  {selectedStage.id === 6 && (
                    <div className="p-4 bg-surface-elevated rounded-xl border border-accent/40 space-y-2 text-xs">
                      <span className="font-bold text-accent uppercase block tracking-wider">
                        ASME Y14.5 Feature Control Frame Architecture
                      </span>
                      <div className="p-3 bg-surface rounded-lg border border-border flex items-center justify-around font-mono text-center">
                        <div className="px-2 py-1 border-r border-border">
                          <span className="text-[9px] text-steel block">Symbol</span>
                          <span className="text-accent font-bold text-sm">⌖ (Position)</span>
                        </div>
                        <div className="px-2 py-1 border-r border-border">
                          <span className="text-[9px] text-steel block">Tolerance Zone</span>
                          <span className="text-text-primary font-bold">⌀ 0.05 Ⓜ</span>
                        </div>
                        <div className="px-2 py-1 border-r border-border">
                          <span className="text-[9px] text-steel block">Primary Datum</span>
                          <span className="text-accent font-bold">A</span>
                        </div>
                        <div className="px-2 py-1 border-r border-border">
                          <span className="text-[9px] text-steel block">Secondary</span>
                          <span className="text-accent font-bold">B</span>
                        </div>
                        <div className="px-2 py-1">
                          <span className="text-[9px] text-steel block">Tertiary</span>
                          <span className="text-accent font-bold">C</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-text-secondary block">
                        Establishes relationship between Datum references (A, B, C) and allowable feature boundary variations.
                      </span>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      STAGE 07 HIGHLIGHT: BOM Preview Table
                      ────────────────────────────────────────────────────────── */}
                  {selectedStage.id === 7 && (
                    <div className="p-4 bg-surface-elevated rounded-xl border border-accent/40 space-y-2">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                        Standard Bill of Materials (BOM) Structure
                      </span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] font-mono">
                          <thead>
                            <tr className="border-b border-border text-steel">
                              <th className="py-1">Part #</th>
                              <th className="py-1">Component</th>
                              <th className="py-1">Material</th>
                              <th className="py-1">Qty</th>
                              <th className="py-1">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40 text-text-secondary">
                            <tr>
                              <td className="py-1 text-accent">PRT-001</td>
                              <td>Involute Pinion</td>
                              <td>AISI 4140</td>
                              <td>1</td>
                              <td>Case Hardened</td>
                            </tr>
                            <tr>
                              <td className="py-1 text-accent">PRT-002</td>
                              <td>Spur Gear Wheel</td>
                              <td>AISI 1045</td>
                              <td>1</td>
                              <td>Hobbed & Shaved</td>
                            </tr>
                            <tr>
                              <td className="py-1 text-accent">STD-014</td>
                              <td>Keyway Pin (6x6x25)</td>
                              <td>C45 Carbon</td>
                              <td>2</td>
                              <td>DIN 6885 Form A</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Stage 08 Engineering Analysis Highlight & Media Player */}
                <div className="lg:col-span-6 space-y-4">
                  {/* ──────────────────────────────────────────────────────────
                      STAGE 08 ENGINEERING ANALYSIS DETAILED HIGHLIGHT (SECTION 6)
                      ────────────────────────────────────────────────────────── */}
                  {selectedStage.id === 8 ? (
                    <div className="p-5 bg-surface-elevated rounded-2xl border border-accent space-y-5 shadow-xl ring-1 ring-accent/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                            STAGE 08 MULTI-STEP PROCESS HIGHLIGHT
                          </span>
                          <h4 className="text-base font-extrabold text-text-primary">
                            Finite Element Analysis (FEA) Sub-Workflow
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-mono font-bold border border-accent/40">
                          8-Step Sequence
                        </span>
                      </div>

                      {/* Analysis Compact Visual Sub-Workflow Stepper */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono text-steel block">
                          Visual Sub-Workflow Sequence (Click to inspect each step):
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {ANALYSIS_SUB_WORKFLOW.map((step) => {
                            const isStepActive = analysisActiveStep === step.step;
                            return (
                              <button
                                key={step.step}
                                onClick={() => setAnalysisActiveStep(step.step)}
                                className={`p-2 rounded-lg border text-left transition ${
                                  isStepActive
                                    ? 'bg-accent text-background font-bold border-accent shadow-md shadow-accent/20 scale-102'
                                    : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-steel'
                                }`}
                              >
                                <span className="text-[9px] font-mono block opacity-75">
                                  0{step.step}
                                </span>
                                <span className="text-[11px] font-extrabold truncate block">
                                  {step.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Active Step Description */}
                        <div className="p-3 bg-surface rounded-xl border border-border text-xs space-y-1">
                          <span className="text-accent font-bold font-mono">
                            Step 0{analysisActiveStep}: {ANALYSIS_SUB_WORKFLOW[analysisActiveStep - 1].title}
                          </span>
                          <p className="text-text-secondary">
                            {ANALYSIS_SUB_WORKFLOW[analysisActiveStep - 1].desc}
                          </p>
                        </div>
                      </div>

                      {/* Example Output Categories */}
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-accent uppercase tracking-wider">
                            Example Output Categories (Illustrative Engineering Metrics):
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {ANALYSIS_OUTPUT_CATEGORIES.map((cat, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-surface border border-border hover:border-accent/40 transition space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                                <span className="flex items-center gap-1.5">
                                  <span>{cat.icon}</span>
                                  <span>{cat.name}</span>
                                </span>
                                <span className="text-[10px] font-mono text-accent">{cat.status}</span>
                              </div>
                              <div className="text-xs font-mono font-extrabold text-accent-bright">
                                {cat.metric}
                              </div>
                              <div className="text-[10px] text-steel leading-tight">{cat.subtext}</div>
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] text-text-secondary font-mono italic pt-1 text-center">
                          * Technical Note: Output categories illustrate the engineering simulation process framework; illustrative metrics only.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Live Process Simulation (Video / 3D Digital Twin) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-steel px-1">
                      <span>
                        {mediaMode === 'video'
                          ? 'Real-World Process Simulation'
                          : 'Interactive 3D Digital Twin Viewport'}
                      </span>
                      <span className="text-accent">
                        {mediaMode === 'video' ? 'Design Workflow Video' : `Stage ${selectedStage.numberStr} 3D Model`}
                      </span>
                    </div>

                    {mediaMode === 'video' ? (
                      <DesignWorkflowVideoPlayer
                        stageName={selectedStage.name}
                        stageNumber={selectedStage.id}
                        onSwitchTo3d={() => setMediaMode('3d')}
                        show3dToggle={true}
                        className="w-full h-[340px] sm:h-[380px] rounded-xl"
                      />
                    ) : (
                      <div className="h-[340px] sm:h-[380px] w-full rounded-xl overflow-hidden border border-border bg-background relative shadow-inner">
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
                            {selectedStage.id === 4 && cadFeature === 'REVOLVE' ? (
                              <cylinderGeometry args={[5, 5, 14, 32]} />
                            ) : selectedStage.id === 4 && cadFeature === 'PATTERN' ? (
                              <boxGeometry args={[10, 10, 10]} />
                            ) : selectedStage.id === 6 ? (
                              <torusGeometry args={[7, 2.5, 16, 64]} />
                            ) : selectedStage.id === 8 ? (
                              <boxGeometry args={[12, 12, 12]} />
                            ) : selectedStage.id === 9 || selectedStage.id === 10 ? (
                              <cylinderGeometry args={[6, 6, 12, 32]} />
                            ) : (
                              <boxGeometry args={[12, 12, 12]} />
                            )}
                            <meshStandardMaterial
                              color={
                                selectedStage.id === 8
                                  ? '#2DD4BF'
                                  : selectedStage.id === 11
                                  ? '#38BDF8'
                                  : '#16B8A6'
                              }
                              metalness={selectedStage.id >= 9 ? 0.8 : 0.4}
                              roughness={0.3}
                              wireframe={selectedStage.id === 8 && analysisActiveStep === 3}
                            />
                          </mesh>
                        </MechanicalViewer>

                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-surface/85 backdrop-blur border border-border text-[10px] font-mono text-text-secondary">
                          {selectedStage.id === 8
                            ? 'FEA Mesh Discretization Wireframe View'
                            : selectedStage.id === 4
                            ? `Parametric Solid Model: ${cadFeature}`
                            : `Parametric CAD Solid Viewport: Stage ${selectedStage.numberStr}`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Close / Collapse Banner Control */}
              <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-text-secondary font-mono">
                  Stage {selectedStage.numberStr} of 11 • Press <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded border border-border">←</kbd> or <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded border border-border">→</kbd> to navigate
                </span>
                <button
                  onClick={() => setIsDetailsExpanded(false)}
                  className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-border text-text-primary font-bold border border-border transition flex items-center gap-1.5"
                >
                  <CloseIcon className="w-3.5 h-3.5 text-accent" />
                  <span>Close Stage Details</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE STAGE CARD COMPONENT FOR DESKTOP ZIGZAG PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
interface StageCardProps {
  stage: WorkflowStageData;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

function StageCard({ stage, isSelected, isHovered, onSelect, onHover }: StageCardProps) {
  const StageIcon = stage.icon;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Stage ${stage.numberStr}: ${stage.name}`}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onKeyDown={handleKeyDown}
      className={`w-full h-full p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative flex flex-col justify-between space-y-3 group focus:outline-none focus:ring-2 focus:ring-accent ${
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
            isSelected
              ? 'bg-accent text-background shadow-sm'
              : 'bg-surface text-accent border border-border'
          }`}
        >
          STAGE {stage.numberStr}
        </span>
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
            isSelected
              ? 'bg-accent text-background shadow-md shadow-accent/30'
              : isHovered
              ? 'bg-accent/20 text-accent'
              : 'bg-surface text-steel group-hover:text-text-primary'
          }`}
        >
          <StageIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Title & Short Description */}
      <div className="space-y-1.5 flex-1">
        <h3
          className={`text-xs font-extrabold tracking-tight line-clamp-1 transition ${
            isSelected ? 'text-accent font-black' : 'text-text-primary group-hover:text-accent-bright'
          }`}
        >
          {stage.name}
        </h3>
        <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
          {stage.shortDesc}
        </p>
      </div>

      {/* Bottom Status / Explore Stage Action */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono">
        <span className="text-[10px] text-steel truncate max-w-[100px]">{stage.category}</span>
        <span
          className={`font-bold transition flex items-center gap-1 ${
            isSelected ? 'text-accent' : 'text-accent/80 group-hover:text-accent group-hover:underline'
          }`}
        >
          {isSelected ? '● Active' : 'Explore Stage →'}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DIRECTIONAL CONNECTOR ARROW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface ConnectorArrowProps {
  direction: 'right' | 'left' | 'down';
  isActive: boolean;
  isHighlighted: boolean;
}

function ConnectorArrow({ direction, isActive, isHighlighted }: ConnectorArrowProps) {
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
