import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import MechanicalViewer from '../MechanicalViewer/MechanicalViewer';
import AnalysisWorkflowVideoPlayer from './AnalysisWorkflowVideoPlayer';
import {
  CadModelStageIcon,
  MaterialAssignmentStageIcon,
  MeshingStageIcon,
  BoundaryConditionsStageIcon,
  LoadApplicationStageIcon,
  SolverExecutionStageIcon,
  ResultInterpretationStageIcon,
  OptimizationStageIcon,
  StaticStructuralIcon,
  ThermalAnalysisIcon,
  FatigueAnalysisIcon,
  VibrationAnalysisIcon,
  CfdAnalysisIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
  CloseIcon,
} from './WorkflowIcons';

export interface AnalysisStageData {
  id: number;
  numberStr: string;
  name: string;
  shortDesc: string;
  desc: string;
  keyPoints: string[];
  icon: React.ComponentType<{ className?: string; size?: number }>;
  category: string;
  toolsAndStandards: string;
  deliverable: string;
}

export const ANALYSIS_WORKFLOW_STAGES: AnalysisStageData[] = [
  {
    id: 1,
    numberStr: '01',
    name: 'CAD Model',
    shortDesc: 'Prepare the 3D CAD model of the component or assembly for engineering analysis.',
    desc: 'Prepare the 3D CAD model of the component or assembly for engineering analysis. Remove non-structural cosmetic features, verify geometry water-tightness, and ensure clean solid topologies suitable for element discretization.',
    keyPoints: [
      'Geometry clean-up & defeaturing (removing non-essential fillets/small chamfers)',
      'Mid-surface generation for thin-walled sheet metal structures',
      'Solid continuum volume verification for accurate discretization',
      'Neutral STEP AP242 / Parasolid CAD export for solver geometry import',
    ],
    icon: CadModelStageIcon,
    category: 'PRE-PROCESSING',
    toolsAndStandards: 'SolidWorks, PTC Creo, Siemens NX, STEP AP242, IGES',
    deliverable: 'Clean Defeatured CAD Solid Geometry',
  },
  {
    id: 2,
    numberStr: '02',
    name: 'Material Assignment',
    shortDesc: 'Assign suitable material properties to the CAD model for the intended analysis.',
    desc: 'Assign suitable material properties to the CAD model for the intended analysis. Specify physical, elastic, thermal, and plastic material behavior required by the governing numerical equations.',
    keyPoints: [
      'Modulus of Elasticity (Young’s Modulus E) & Poisson’s Ratio (ν)',
      'Mass density (ρ) for inertial & gravitational load calculations',
      'Yield strength (σy) and Ultimate Tensile Strength (UTS)',
      'Thermal expansion coefficients & S-N fatigue curve parameters',
    ],
    icon: MaterialAssignmentStageIcon,
    category: 'MATERIAL PROPERTIES',
    toolsAndStandards: 'ASTM Material Standards, ISO Material Database, MatWeb Libraries',
    deliverable: 'Constitutive Material Property Definition',
  },
  {
    id: 3,
    numberStr: '03',
    name: 'Meshing',
    shortDesc: 'Divide the geometry into smaller elements to enable numerical analysis.',
    desc: 'Divide the geometry into smaller elements to enable numerical analysis. Discretize the solid continuous continuum into finite elements connected at nodes to construct the stiffness matrix.',
    keyPoints: [
      'Element selection: 10-node Tetrahedral or 20-node Hexahedral brick elements',
      'Global element sizing & localized mesh refinement at stress concentration zones',
      'Aspect ratio, Jacobian, skewness, and element distortion quality checks',
      'Mesh convergence study to verify independence of results from mesh density',
    ],
    icon: MeshingStageIcon,
    category: 'DISCRETIZATION',
    toolsAndStandards: 'Tetrahedral / Hexahedral Mesh Algorithms, Convergence Criteria',
    deliverable: 'Converged Finite Element Mesh (Nodes & Elements)',
  },
  {
    id: 4,
    numberStr: '04',
    name: 'Boundary Conditions',
    shortDesc: 'Define the supports, constraints, and relevant model conditions.',
    desc: 'Define the supports, constraints, and relevant model conditions. Restrict rigid-body degrees of freedom (translation and rotation) to accurately mimic the physical mounting and assembly environment.',
    keyPoints: [
      'Fixed supports (locking all 6 translational & rotational DOFs)',
      'Pin joints, cylindrical supports, and frictionless sliding planes',
      'Symmetry boundary conditions to reduce computational domain by half',
      'Contact formulations between mating parts (bonded, no-separation, frictional)',
    ],
    icon: BoundaryConditionsStageIcon,
    category: 'CONSTRAINTS',
    toolsAndStandards: 'Degrees of Freedom (DOF) Rules, Kinematic Constraints',
    deliverable: 'Physically Constrained Kinematic Boundary Framework',
  },
  {
    id: 5,
    numberStr: '05',
    name: 'Load Application',
    shortDesc: 'Apply the required forces, loads, or operating conditions to the model.',
    desc: 'Apply the required forces, loads, or operating conditions to the model. Represent real-world service conditions including mechanical forces, pressures, moments, and environmental accelerations.',
    keyPoints: [
      'Concentrated force vectors and distributed surface pressures',
      'Torque and rotational bending moments applied through remote connection points',
      'Gravitational acceleration (1G = 9.81 m/s²) and centrifugal body forces',
      'Thermal temperature gradient loads and dynamic cyclic load profiles',
    ],
    icon: LoadApplicationStageIcon,
    category: 'LOADING',
    toolsAndStandards: 'Operational Duty Cycles, ISO/ASME Load Standards',
    deliverable: 'Defined Force Vectors, Pressure & Operating Payload',
  },
  {
    id: 6,
    numberStr: '06',
    name: 'Solver Execution',
    shortDesc: "Execute the solver to calculate the component's response under the defined conditions.",
    desc: "Execute the solver to calculate the component's response under the defined conditions. Solve the global matrix equation [K]{u} = {F} to compute nodal displacements, reaction forces, and internal stresses.",
    keyPoints: [
      'Stiffness matrix formulation: [K]{u} = {F} (Stiffness × Displacement = Force)',
      'Direct sparse matrix inversion and iterative preconditioned conjugate gradient solvers',
      'Nonlinear Newton-Raphson iteration for contact, geometric, or material plasticity',
      'Solver residual convergence monitoring and equilibrium verification',
    ],
    icon: SolverExecutionStageIcon,
    category: 'SOLVER COMPUTE',
    toolsAndStandards: 'Sparse Matrix Solvers, FEA Finite Element Engine Algorithms',
    deliverable: 'Computed Displacement, Strain & Stress Vector Fields',
  },
  {
    id: 7,
    numberStr: '07',
    name: 'Result Interpretation',
    shortDesc: 'Evaluate the analysis results, including total deformation, equivalent stress, factor of safety, and life prediction where applicable.',
    desc: 'Evaluate the analysis results, including total deformation, equivalent stress, factor of safety, and life prediction where applicable. Compare computed values against design limits to evaluate structural integrity.',
    keyPoints: [
      'Total deformation contour map (verifying maximum deflection is within allowable limits)',
      'von Mises equivalent stress distribution (identifying peak stress locations)',
      'Factor of Safety (FoS) evaluation against material yield strength (target FoS ≥ 2.0)',
      'Predicted fatigue life & damage accumulation under cyclic operational history',
    ],
    icon: ResultInterpretationStageIcon,
    category: 'POST-PROCESSING',
    toolsAndStandards: 'von Mises Yield Criterion, Wöhler S-N Curves, Goodman Diagram',
    deliverable: 'Structural Verification & Performance Assessment Dossier',
  },
  {
    id: 8,
    numberStr: '08',
    name: 'Optimization',
    shortDesc: 'Review the results and identify opportunities to improve the design while meeting engineering requirements.',
    desc: 'Review the results and identify opportunities to improve the design while meeting engineering requirements. Iterate geometry to reduce component mass, eliminate high-stress hot spots, and ensure manufacturing viability.',
    keyPoints: [
      'Identify low-stress material regions for weight reduction and material savings',
      'Increase fillet radii and add gussets to disperse stress concentrations',
      'Parametric wall thickness optimization while maintaining minimum FoS ≥ 2.0',
      'Design for Manufacturability (DFM) verification for casting, forging, or machining',
    ],
    icon: OptimizationStageIcon,
    category: 'DESIGN ITERATION',
    toolsAndStandards: 'Topology Optimization, Parametric Design Iteration, DFM Guidelines',
    deliverable: 'Optimized Manufacturing-Ready Engineering Design',
  },
];

// 5 Types of Engineering Analysis
export const ANALYSIS_TYPES = [
  {
    id: 'structural',
    name: 'Static Structural Analysis',
    desc: 'Evaluates stress and deformation under steady-state operating loads.',
    icon: StaticStructuralIcon,
    badge: 'STRUCTURAL',
    keyMetric: 'von Mises Stress & Deflection',
    equation: '[K]{u} = {F}',
    application: 'Brackets, chassis, shafts, frames, and pressure vessels',
  },
  {
    id: 'thermal',
    name: 'Thermal Analysis',
    desc: 'Evaluates temperature distribution and heat dissipation across solid bodies.',
    icon: ThermalAnalysisIcon,
    badge: 'THERMAL',
    keyMetric: 'Temperature Gradients & Heat Flux',
    equation: 'q = -k ∇T',
    application: 'Heat sinks, brake rotors, engine blocks, and electronic enclosures',
  },
  {
    id: 'fatigue',
    name: 'Fatigue Analysis',
    desc: 'Evaluates predicted component life under cyclic loading and repeated stress reversals.',
    icon: FatigueAnalysisIcon,
    badge: 'FATIGUE LIFE',
    keyMetric: 'Cycles to Failure & Damage Index',
    equation: 'S_a = σ_f\' (2N_f)^b',
    application: 'Suspension springs, rotating axles, gear teeth, and linkage pins',
  },
  {
    id: 'vibration',
    name: 'Vibration Analysis',
    desc: 'Studies natural frequencies and vibration behavior to avoid resonance catastrophe.',
    icon: VibrationAnalysisIcon,
    badge: 'DYNAMICS',
    keyMetric: 'Modal Frequencies & Mode Shapes',
    equation: 'det([K] - ω²[M]) = 0',
    application: 'Rotating machinery, turbine blades, motor mounts, and brackets',
  },
  {
    id: 'cfd',
    name: 'Computational Fluid Dynamics (CFD)',
    desc: 'Evaluates fluid flow behavior, pressure drops, drag forces, and turbulence.',
    icon: CfdAnalysisIcon,
    badge: 'FLUID FLOW',
    keyMetric: 'Velocity Vectors & Pressure Contours',
    equation: '∂(ρu)/∂t + ∇·(ρuu) = -∇p + μ∇²u',
    application: 'Manifolds, cooling airducts, pumps, aerodynamic fairings, and valves',
  },
];

interface EngineeringAnalysisWorkflowProps {
  onBackToOverview?: () => void;
  onSwitchToIndustrialPipeline?: () => void;
  useVideoPlayer?: boolean;
}

export default function EngineeringAnalysisWorkflow({
  onBackToOverview,
  onSwitchToIndustrialPipeline,
  useVideoPlayer = false,
}: EngineeringAnalysisWorkflowProps) {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(true);
  const [hoveredStageId, setHoveredStageId] = useState<number | null>(null);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('structural');
  const [solverRunning, setSolverRunning] = useState<boolean>(false);
  const [solverProgress, setSolverProgress] = useState<number>(0);
  const [meshDensity, setMeshDensity] = useState<'coarse' | 'fine'>('coarse');
  const [viewMode, setViewMode] = useState<'pipeline' | 'grid'>('pipeline');

  const inspectorRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const selectedStage =
    ANALYSIS_WORKFLOW_STAGES.find((s) => s.id === selectedStageId) || ANALYSIS_WORKFLOW_STAGES[0];
  const progressPercent = Math.round((selectedStageId / ANALYSIS_WORKFLOW_STAGES.length) * 100);

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
    setSelectedStageId((prev) => (prev > 1 ? prev - 1 : ANALYSIS_WORKFLOW_STAGES.length));
  };

  const handleNextStage = () => {
    setSelectedStageId((prev) => (prev < ANALYSIS_WORKFLOW_STAGES.length ? prev + 1 : 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') {
        handleNextStage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevStage();
      } else if (e.key === 'Escape' && isDetailsExpanded) {
        setIsDetailsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDetailsExpanded]);

  // Solver simulation execution
  const runSolverSimulation = () => {
    setSolverRunning(true);
    setSolverProgress(0);
    const interval = setInterval(() => {
      setSolverProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSolverRunning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  // Framer Motion Animation Variants
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.35, ease: 'easeOut' },
    },
  };

  // Row breakdown for 4-column desktop pipeline (Row 1: Stages 1-4, Row 2: Stages 8-5 reverse or 5-8)
  const row1 = ANALYSIS_WORKFLOW_STAGES.slice(0, 4); // Stages 1, 2, 3, 4
  const row2Stage5 = ANALYSIS_WORKFLOW_STAGES[4]; // Stage 5
  const row2Stage6 = ANALYSIS_WORKFLOW_STAGES[5]; // Stage 6
  const row2Stage7 = ANALYSIS_WORKFLOW_STAGES[6]; // Stage 7
  const row2Stage8 = ANALYSIS_WORKFLOW_STAGES[7]; // Stage 8

  return (
    <section
      id="engineering-analysis-project-workflow"
      aria-label="Engineering Analysis Project Workflow"
      className="space-y-10 animate-fadeIn"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. SECTION HEADING, SUBTITLE & INTRODUCTION
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl relative overflow-hidden space-y-6">
        {/* Subtle engineering grid background */}
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
              {onBackToOverview && (
                <button
                  onClick={onBackToOverview}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-elevated hover:bg-border text-text-primary text-xs font-semibold border border-border transition focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Back to overview"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 text-accent" />
                  <span>Workflow Categories</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                8-STAGE ENGINEERING ANALYSIS WORKFLOW
              </span>
              <span className="text-xs font-mono text-text-secondary bg-surface-elevated px-2.5 py-0.5 rounded border border-border">
                STAGE {selectedStage.numberStr} OF 08 ACTIVE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight leading-tight">
              Engineering Analysis Project Workflow
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-semibold text-accent-bright leading-relaxed">
              From CAD preparation to design optimization — a systematic process for evaluating engineering performance before manufacturing.
            </p>

            {/* Introduction */}
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed pt-1 border-t border-border/50">
              Engineering analysis predicts how a component or structure behaves under real-world conditions before manufacturing. It helps engineers evaluate stress, deformation, safety, and performance, identify potential failures, and improve the design.
            </p>
          </div>

          {/* Action & View Switchers */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
            {onSwitchToIndustrialPipeline && (
              <button
                onClick={onSwitchToIndustrialPipeline}
                className="px-3.5 py-1.5 rounded-xl bg-surface-elevated hover:bg-border text-text-secondary hover:text-text-primary text-xs font-mono font-bold border border-border transition flex items-center gap-1.5 shadow-sm"
                title="View the 11-Stage Complete Product Pipeline"
              >
                <span>⚙️ Complete Industrial Pipeline (11 Stages) →</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-surface-elevated p-1.5 rounded-xl border border-border">
              <button
                onClick={() => setViewMode('pipeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'pipeline'
                    ? 'bg-accent text-background shadow-md shadow-accent/20 font-extrabold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title="Connected 8-Stage Pipeline View"
                aria-pressed={viewMode === 'pipeline'}
              >
                <span>🗺️</span>
                <span>Pipeline View</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-accent text-background shadow-md shadow-accent/20 font-extrabold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title="All 8 Stages Card Grid"
                aria-pressed={viewMode === 'grid'}
              >
                <span>📑</span>
                <span>All 8 Stages</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stepper Progress Bar & Stage Quick-Selector */}
        <div className="pt-4 border-t border-border/70 space-y-2.5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-accent font-bold">Analysis Progression:</span>
              <span className="text-text-primary font-bold">
                Stage {selectedStage.numberStr} — {selectedStage.name}
              </span>
            </div>
            <span className="text-accent-bright font-bold">
              {progressPercent}% Complete ({selectedStageId} of 8 Stages)
            </span>
          </div>

          {/* Progress Bar */}
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

          {/* Quick-Jump Step Pills (1 to 8) */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
            {ANALYSIS_WORKFLOW_STAGES.map((st) => {
              const isSelected = st.id === selectedStageId;
              const isPast = st.id < selectedStageId;

              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStage(st.id, true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 border flex items-center gap-2 ${
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
                  <span className="hidden md:inline text-[11px] font-normal truncate max-w-[120px]">
                    {st.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. THE 8 CONNECTED STAGES (PIPELINE vs GRID)
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'pipeline' ? (
        <div className="space-y-6">
          {/* DESKTOP CONNECTED 8-STAGE PIPELINE (Screens ≥ 1024px) */}
          <div className="hidden lg:block bg-surface p-7 rounded-2xl border border-border shadow-xl relative overflow-hidden">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8 relative z-10"
            >
              {/* Row 1: Stages 01 → 02 → 03 → 04 (Pre-Processing) */}
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

                {/* Turn arrow from Stage 4 (Row 1 End) to Stage 5 (Row 2 Start) on Column 4 */}
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

              {/* Row 2: Stages 08 ← 07 ← 06 ← 05 (Solver & Post-Processing Reverse Flow) */}
              <div className="relative pt-4">
                <div className="grid grid-cols-4 gap-6 items-stretch">
                  {/* Column 1: Stage 8 (Optimization) */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage8}
                      isSelected={row2Stage8.id === selectedStageId}
                      isHovered={row2Stage8.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row2Stage8.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage8.id : null)}
                    />
                  </div>

                  {/* Column 2: Stage 7 (Result Interpretation - HIGHLIGHTED) */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage7}
                      isSelected={row2Stage7.id === selectedStageId}
                      isHovered={row2Stage7.id === hoveredStageId}
                      isHighlightedStage={true}
                      onSelect={() => handleSelectStage(row2Stage7.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage7.id : null)}
                    />
                    {/* Left arrow to Stage 8 */}
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="left"
                        isActive={selectedStageId >= 8}
                        isHighlighted={hoveredStageId === 7 || hoveredStageId === 8}
                      />
                    </div>
                  </div>

                  {/* Column 3: Stage 6 (Solver Execution - HIGHLIGHTED) */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage6}
                      isSelected={row2Stage6.id === selectedStageId}
                      isHovered={row2Stage6.id === hoveredStageId}
                      isHighlightedStage={true}
                      onSelect={() => handleSelectStage(row2Stage6.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage6.id : null)}
                    />
                    {/* Left arrow to Stage 7 */}
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="left"
                        isActive={selectedStageId >= 7}
                        isHighlighted={hoveredStageId === 6 || hoveredStageId === 7}
                      />
                    </div>
                  </div>

                  {/* Column 4: Stage 5 (Load Application) */}
                  <div className="relative flex items-center">
                    <StageCard
                      stage={row2Stage5}
                      isSelected={row2Stage5.id === selectedStageId}
                      isHovered={row2Stage5.id === hoveredStageId}
                      onSelect={() => handleSelectStage(row2Stage5.id, true)}
                      onHover={(hov) => setHoveredStageId(hov ? row2Stage5.id : null)}
                    />
                    {/* Left arrow to Stage 6 */}
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                      <ConnectorArrow
                        direction="left"
                        isActive={selectedStageId >= 6}
                        isHighlighted={hoveredStageId === 5 || hoveredStageId === 6}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MOBILE & TABLET VERTICAL TIMELINE (Screens < 1024px) */}
          <div className="block lg:hidden bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-xl">
            <div className="relative pl-6 sm:pl-8 space-y-5">
              <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-6 w-0.5 bg-border -z-0">
                <div
                  className="w-full bg-accent transition-all duration-300"
                  style={{
                    height: `${((selectedStageId - 1) / (ANALYSIS_WORKFLOW_STAGES.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {ANALYSIS_WORKFLOW_STAGES.map((stage) => {
                const isSelected = stage.id === selectedStageId;
                const isPast = stage.id < selectedStageId;
                const StageIcon = stage.icon;

                return (
                  <div key={stage.id} className="relative z-10 flex items-start gap-3.5">
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
                          {stage.deliverable}
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
        /* GRID VIEW: ALL 8 STAGES SIMULTANEOUSLY */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {ANALYSIS_WORKFLOW_STAGES.map((stage) => {
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

                  <div className="pt-2 border-t border-border/50 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                      Deliverable:
                    </span>
                    <span className="text-[11px] text-text-primary font-medium block truncate">
                      {stage.deliverable}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-steel">
                    {stage.keyPoints.length} Procedures
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
          3. EXPANDABLE STAGE DETAIL INSPECTOR (WITH STAGE 6 & 7 VISUAL HIGHLIGHTS)
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={inspectorRef}
        className="bg-surface p-6 sm:p-8 rounded-2xl border border-accent/40 shadow-2xl relative overflow-hidden ring-1 ring-accent/30 space-y-6"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Panel Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/60 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent text-background flex items-center justify-center shrink-0 shadow-lg shadow-accent/25">
              <selectedStage.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                  STAGE {selectedStage.numberStr} OF 08 • {selectedStage.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                {selectedStage.numberStr}. {selectedStage.name}
              </h2>
            </div>
          </div>

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
              className="px-3 py-1.5 rounded-xl bg-accent hover:bg-accent-bright text-background text-xs font-extrabold flex items-center gap-1.5 transition shadow-md shadow-accent/20 active:scale-95"
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

        {/* Expandable Details Container */}
        <AnimatePresence>
          {isDetailsExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Detailed Description */}
              <div className="p-5 bg-surface-elevated/80 rounded-xl border border-border space-y-2">
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                  Stage Description & Engineering Context:
                </span>
                <p className="text-sm sm:text-base text-text-primary font-medium leading-relaxed">
                  {selectedStage.desc}
                </p>
              </div>

              {/* 2-Column Grid: Key Points & Interactive Technical Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Key Procedures & Standards */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 bg-surface-elevated rounded-xl border border-border space-y-3 shadow-md">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>📌</span>
                        <span>Stage Execution Procedures & Criteria</span>
                      </span>
                      <span className="text-[10px] font-mono text-steel">
                        {selectedStage.keyPoints.length} Key Steps
                      </span>
                    </h3>

                    <ul className="space-y-2.5 text-xs">
                      {selectedStage.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface/70 border border-border/60 hover:border-accent/40 transition"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                      <span className="text-[10px] text-accent uppercase tracking-wider block font-bold">
                        Tools & Governing Rules:
                      </span>
                      <span className="text-text-primary font-semibold block leading-tight">
                        {selectedStage.toolsAndStandards}
                      </span>
                    </div>

                    <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                      <span className="text-[10px] text-accent uppercase tracking-wider block font-bold">
                        Stage Output Deliverable:
                      </span>
                      <span className="text-text-primary font-semibold block leading-tight">
                        {selectedStage.deliverable}
                      </span>
                    </div>
                  </div>

                  {/* Stage-Specific Interactive Controls */}
                  {selectedStage.id === 3 && (
                    <div className="p-4 bg-surface-elevated rounded-xl border border-accent/40 space-y-2.5">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                        Interactive Mesh Density Toggle
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setMeshDensity('coarse')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                            meshDensity === 'coarse'
                              ? 'bg-accent text-background border-accent shadow-sm'
                              : 'bg-surface border-border text-text-secondary'
                          }`}
                        >
                          Coarse Mesh (Fast Iteration)
                        </button>
                        <button
                          onClick={() => setMeshDensity('fine')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                            meshDensity === 'fine'
                              ? 'bg-accent text-background border-accent shadow-sm'
                              : 'bg-surface border-border text-text-secondary'
                          }`}
                        >
                          Fine Mesh (High Precision Boundary Layer)
                        </button>
                      </div>
                      <span className="text-[11px] text-text-secondary block">
                        Discretization with quadratic tetrahedral elements ensures stress convergence across stress-riser fillets.
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Refined Technical Visuals (Stages 6 & 7 Highlights + 3D Viewport) */}
                <div className="lg:col-span-6 space-y-4">
                  {/* ──────────────────────────────────────────────────────────
                      STAGE 6 REFINED TECHNICAL VISUAL: SOLVER EXECUTION
                      ────────────────────────────────────────────────────────── */}
                  {selectedStage.id === 6 && (
                    <div className="p-5 bg-surface-elevated rounded-2xl border border-accent space-y-4 shadow-xl ring-1 ring-accent/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>Refined Technical Visual: Matrix Solver Engine</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-mono font-bold">
                          [K]{'{u}'} = {'{F}'}
                        </span>
                      </div>

                      {/* Mathematical Equation & Flow Schematics */}
                      <div className="p-4 bg-surface rounded-xl border border-border space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between text-text-secondary border-b border-border/50 pb-2">
                          <span>Global Equilibrium Matrix:</span>
                          <span className="text-accent-bright font-bold">[K] · {'{u}'} = {'{F}'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                          <div className="p-2 bg-surface-elevated rounded border border-border/60">
                            <span className="text-steel block text-[9px]">Matrix [K]</span>
                            <span className="text-text-primary font-bold">Stiffness Matrix</span>
                          </div>
                          <div className="p-2 bg-surface-elevated rounded border border-border/60">
                            <span className="text-steel block text-[9px]">Vector {'{u}'}</span>
                            <span className="text-accent font-bold">Nodal Displacements</span>
                          </div>
                          <div className="p-2 bg-surface-elevated rounded border border-border/60">
                            <span className="text-steel block text-[9px]">Vector {'{F}'}</span>
                            <span className="text-text-primary font-bold">Applied Load Vectors</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Solver Execution Simulator */}
                      <div className="space-y-3">
                        <button
                          disabled={solverRunning}
                          onClick={runSolverSimulation}
                          className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent-bright text-background font-extrabold text-xs transition shadow-md shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <span>{solverRunning ? '⏳ Factorizing Stiffness Matrix...' : '▶ Test Solver Execution Run'}</span>
                        </button>

                        {solverProgress > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-mono text-steel">
                              <span>Solver Status: {solverProgress === 100 ? 'Converged (Residual < 10⁻⁴)' : 'Computing...'}</span>
                              <span className="text-accent font-bold">{solverProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
                              <div
                                className="h-full bg-accent transition-all duration-300"
                                style={{ width: `${solverProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      STAGE 7 REFINED TECHNICAL VISUAL: RESULT INTERPRETATION
                      ────────────────────────────────────────────────────────── */}
                  {selectedStage.id === 7 && (
                    <div className="p-5 bg-surface-elevated rounded-2xl border border-accent space-y-4 shadow-xl ring-1 ring-accent/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                          <span>📊</span>
                          <span>Refined Technical Visual: Stress Gradient & FoS</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-mono font-bold">
                          Post-Processing
                        </span>
                      </div>

                      {/* von Mises Heatmap Color Legend */}
                      <div className="space-y-2 p-3.5 bg-surface rounded-xl border border-border">
                        <div className="flex justify-between text-[10px] font-mono text-steel">
                          <span>0.0 MPa (Min Stress)</span>
                          <span className="text-accent font-bold">von Mises Yield Spectrum</span>
                          <span className="text-red-400 font-bold">Peak Stress (Tensile Limit)</span>
                        </div>
                        {/* Gradient Bar */}
                        <div className="w-full h-3.5 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 via-teal-400 via-yellow-400 to-red-500 border border-border shadow-inner" />
                        <div className="flex justify-between text-[9px] font-mono text-steel pt-0.5">
                          <span>Blue: Elastic Unstressed</span>
                          <span>Teal/Yellow: Nominal Load</span>
                          <span>Red: Stress Concentration</span>
                        </div>
                      </div>

                      {/* 4 Output Categories Quick Cards */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 bg-surface rounded-lg border border-border space-y-0.5">
                          <span className="text-[10px] text-steel block">Total Deformation:</span>
                          <span className="text-accent-bright font-bold">Max 0.42 mm</span>
                        </div>
                        <div className="p-2.5 bg-surface rounded-lg border border-border space-y-0.5">
                          <span className="text-[10px] text-steel block">Equivalent Stress:</span>
                          <span className="text-accent-bright font-bold">142.6 MPa (Safe)</span>
                        </div>
                        <div className="p-2.5 bg-surface rounded-lg border border-border space-y-0.5">
                          <span className="text-[10px] text-steel block">Factor of Safety:</span>
                          <span className="text-emerald-400 font-bold">FoS = 2.17 (≥ 2.0)</span>
                        </div>
                        <div className="p-2.5 bg-surface rounded-lg border border-border space-y-0.5">
                          <span className="text-[10px] text-steel block">Fatigue Life:</span>
                          <span className="text-accent-bright font-bold">1.45 × 10⁶ Cycles</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video (Analyse Project tab) OR 3D Viewer (Design Engineer tab) */}
                  {useVideoPlayer ? (
                    <AnalysisWorkflowVideoPlayer
                      className="w-full h-[320px] sm:h-[360px]"
                      stageName={selectedStage.name}
                      stageNumber={selectedStage.numberStr}
                    />
                  ) : (
                    <div className="h-[320px] sm:h-[360px] w-full rounded-2xl overflow-hidden border border-border bg-background relative shadow-inner">
                      <MechanicalViewer>
                        <mesh position={[0, 0, 0]}>
                          <boxGeometry args={[12, 12, 12]} />
                          <meshStandardMaterial
                            color={
                              selectedStage.id === 7
                                ? '#2DD4BF'
                                : selectedStage.id === 6
                                ? '#38BDF8'
                                : selectedStage.id === 8
                                ? '#10B981'
                                : '#16B8A6'
                            }
                            metalness={0.5}
                            roughness={0.3}
                            wireframe={selectedStage.id === 3 || meshDensity === 'fine'}
                          />
                        </mesh>
                      </MechanicalViewer>

                      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-surface/90 backdrop-blur border border-border text-[10px] font-mono text-text-secondary flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span>
                          {selectedStage.id === 3
                            ? `FEA Mesh Discretization (${meshDensity} mesh)`
                            : selectedStage.id === 6
                            ? 'Matrix Solver Calculation State'
                            : selectedStage.id === 7
                            ? 'Equivalent von Mises Contour State'
                            : `3D Digital Geometry: Stage ${selectedStage.numberStr}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Bar */}
              <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-text-secondary font-mono">
                  Stage {selectedStage.numberStr} of 8 • Use <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded border border-border">←</kbd> and <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded border border-border">→</kbd> to cycle stages
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

      {/* ─────────────────────────────────────────────────────────────
          4. SECONDARY SECTION: TYPES OF ENGINEERING ANALYSIS (5 COMPACT CARDS)
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold tracking-wider uppercase">
            NUMERICAL METHODS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1">
            Types of Engineering Analysis
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Select an analysis discipline to inspect its physical parameters and governing equations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {ANALYSIS_TYPES.map((type) => {
            const isSelected = selectedAnalysisType === type.id;
            const TypeIcon = type.icon;

            return (
              <button
                key={type.id}
                onClick={() => setSelectedAnalysisType(type.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between space-y-3 group ${
                  isSelected
                    ? 'bg-accent/15 border-accent shadow-xl shadow-accent/20 ring-1 ring-accent -translate-y-1'
                    : 'bg-surface border-border hover:border-accent/50 hover:bg-surface-elevated'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-surface-elevated border border-border text-accent">
                      {type.badge}
                    </span>
                    <div
                      className={`p-1.5 rounded-lg transition ${
                        isSelected ? 'bg-accent text-background' : 'text-accent group-hover:scale-110'
                      }`}
                    >
                      <TypeIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xs font-extrabold text-text-primary group-hover:text-accent transition leading-snug">
                    {type.name}
                  </h3>

                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {type.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50 space-y-1">
                  <span className="text-[9px] font-mono text-steel block uppercase">
                    Governing Equation:
                  </span>
                  <span className="text-[10px] font-mono font-bold text-accent-bright block truncate">
                    {type.equation}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Analysis Type Deep-Dive Bar */}
        {(() => {
          const activeType = ANALYSIS_TYPES.find((t) => t.id === selectedAnalysisType) || ANALYSIS_TYPES[0];
          return (
            <div className="p-4 bg-surface rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-accent/20 text-accent">
                  <activeType.icon className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold text-text-primary">{activeType.name}</span>
                  <span className="text-text-secondary block text-[11px]">{activeType.application}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-steel">Key Focus:</span>
                <span className="text-accent font-bold bg-surface-elevated px-2.5 py-1 rounded border border-border">
                  {activeType.keyMetric}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. EXAMPLE PROJECT HIGHLIGHT: WHEELCHAIR FRAME ANALYSIS
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-accent/40 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-mono font-bold tracking-wider uppercase mb-1">
              EXAMPLE PROJECT HIGHLIGHT
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              Wheelchair Frame Analysis
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Structural FEA evaluation of a specialized tubular mobility chassis under occupant load conditions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-xs font-mono font-bold text-accent">
              Static Structural Discipline
            </span>
          </div>
        </div>

        {/* 2-Column Wheelchair Frame Technical Visual & Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Engineering Schematic Diagram */}
          <div className="lg:col-span-6 bg-surface-elevated p-5 rounded-2xl border border-border space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-steel">
              <span>Boundary Constraints & Loading Diagram</span>
              <span className="text-accent font-bold">150 kg Payload</span>
            </div>

            {/* Custom SVG Engineering Schematic of Wheelchair Chassis Under 150kg Payload */}
            <div className="w-full h-56 bg-background rounded-xl border border-border/70 flex items-center justify-center relative overflow-hidden p-4">
              <svg viewBox="0 0 400 220" className="w-full h-full text-text-primary select-none">
                {/* Background technical coordinate grid lines */}
                <defs>
                  <pattern id="analysisGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(48,54,61,0.4)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="220" fill="url(#analysisGrid)" />

                {/* Ground plane */}
                <line x1="20" y1="195" x2="380" y2="195" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                <text x="25" y="210" fill="#64748B" fontSize="9" fontFamily="monospace">GROUND CONTACT PLANE</text>

                {/* Rear Drive Wheel (Left Fixed Support) */}
                <circle cx="110" cy="140" r="50" fill="none" stroke="#64748B" strokeWidth="2.5" />
                <circle cx="110" cy="140" r="12" fill="#1E293B" stroke="#16B8A6" strokeWidth="2" />
                <path d="M100 195 l10 -10 l10 10 z" fill="#16B8A6" opacity="0.6" />
                <text x="65" y="145" fill="#2DD4BF" fontSize="9" fontFamily="monospace" fontWeight="bold">FIXED AXLE</text>

                {/* Front Swivel Caster Wheel (Pinned Support) */}
                <circle cx="310" cy="170" r="22" fill="none" stroke="#64748B" strokeWidth="2" />
                <circle cx="310" cy="170" r="6" fill="#1E293B" stroke="#16B8A6" strokeWidth="1.5" />
                <path d="M305 195 l5 -5 l5 5 z" fill="#16B8A6" opacity="0.6" />

                {/* Tubular Frame Structure */}
                {/* Lower Longitudinal Tube */}
                <line x1="110" y1="140" x2="310" y2="170" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
                {/* Vertical Seat Riser */}
                <line x1="150" y1="144" x2="150" y2="70" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
                {/* Front Seat Riser */}
                <line x1="260" y1="162" x2="260" y2="70" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
                {/* Seat Support Rails (LOAD APPLICATION ZONE) */}
                <line x1="140" y1="70" x2="270" y2="70" stroke="#2DD4BF" strokeWidth="6" strokeLinecap="round" />
                {/* Backrest Frame */}
                <line x1="150" y1="70" x2="130" y2="20" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />

                {/* 150 kg Static Load Force Arrows (pointing down to seat rails) */}
                <g>
                  {/* Force Arrow 1 */}
                  <line x1="175" y1="30" x2="175" y2="62" stroke="#F43F5E" strokeWidth="2.5" />
                  <polygon points="170,55 175,65 180,55" fill="#F43F5E" />
                  {/* Force Arrow 2 (Center) */}
                  <line x1="205" y1="20" x2="205" y2="62" stroke="#F43F5E" strokeWidth="3" />
                  <polygon points="199,53 205,65 211,53" fill="#F43F5E" />
                  {/* Force Arrow 3 */}
                  <line x1="235" y1="30" x2="235" y2="62" stroke="#F43F5E" strokeWidth="2.5" />
                  <polygon points="230,55 235,65 240,55" fill="#F43F5E" />

                  {/* Load Label Badge */}
                  <rect x="160" y="8" width="90" height="18" rx="4" fill="#1E293B" stroke="#F43F5E" strokeWidth="1" />
                  <text x="205" y="21" fill="#FDA4AF" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    LOAD: 150 kg
                  </text>
                </g>

                {/* Heatmap Stress Indicator Marker on High Stress Junction */}
                <circle cx="150" cy="144" r="8" fill="#EF4444" opacity="0.75" />
                <circle cx="150" cy="144" r="14" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="170" y="138" fill="#FCA5A5" fontSize="8" fontFamily="monospace">Junction Peak Stress</text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-steel">
              <span>Boundary: Fixed rear axle hub, pinned caster pivots</span>
              <span className="text-accent">Load Location: Seat support tubes</span>
            </div>
          </div>

          {/* Right: Analysis Parameters & Output Categories Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block">
                Analysis Setup Parameter:
              </span>
              <div className="p-3.5 bg-surface rounded-xl border border-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-text-primary block">Example Applied Load</span>
                  <span className="text-[11px] text-text-secondary">Static occupant payload uniformly distributed across seat frame</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-rose-400 font-mono">150 kg</span>
                  <span className="text-[10px] text-steel block font-mono">(~1,471.5 N)</span>
                </div>
              </div>
            </div>

            {/* The 4 Required Output Categories */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block">
                Analysis Output Categories (Evaluation Criteria):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Total Deformation */}
                <div className="p-3.5 bg-surface-elevated rounded-xl border border-border hover:border-accent/50 transition space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">1. Total Deformation</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">Displacement</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Evaluates maximum frame deflection under 150 kg load to prevent permanent sagging or wheel misalignment.
                  </p>
                </div>

                {/* 2. Equivalent Stress */}
                <div className="p-3.5 bg-surface-elevated rounded-xl border border-border hover:border-accent/50 transition space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">2. Equivalent Stress</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">von Mises</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Evaluates peak equivalent stress concentration across tube weld junctions against material yield threshold.
                  </p>
                </div>

                {/* 3. Factor of Safety */}
                <div className="p-3.5 bg-surface-elevated rounded-xl border border-border hover:border-accent/50 transition space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">3. Factor of Safety</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">FoS Margin</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Determines structural safety margin (Yield Strength / Peak von Mises Stress) to ensure FoS ≥ 2.0 design compliance.
                  </p>
                </div>

                {/* 4. Life Prediction */}
                <div className="p-3.5 bg-surface-elevated rounded-xl border border-border hover:border-accent/50 transition space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">4. Life Prediction</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">Fatigue S-N</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Estimates duty cycle endurance life under repeated cyclic vibration and terrain impacts before micro-crack initiation.
                  </p>
                </div>
              </div>
            </div>

            {/* Note stating illustrative representation */}
            <p className="text-[10px] font-mono text-steel italic bg-surface p-2.5 rounded-lg border border-border text-center">
              * Note: Parameters and output categories are displayed for engineering educational purposes only. Educational representation — not a claim of actual physical simulation data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE STAGE CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface StageCardProps {
  stage: AnalysisStageData;
  isSelected: boolean;
  isHovered: boolean;
  isHighlightedStage?: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

function StageCard({
  stage,
  isSelected,
  isHovered,
  isHighlightedStage = false,
  onSelect,
  onHover,
}: StageCardProps) {
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
          : isHighlightedStage
          ? 'bg-surface-elevated border-accent/40 hover:border-accent hover:shadow-lg'
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

      {/* Bottom Status / Explore Action */}
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
