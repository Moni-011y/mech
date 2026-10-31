import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';
import ProjectLineage from '../components/Projects/ProjectLineage';
import ReverseEngineeringView from '../components/Projects/ReverseEngineeringView';
import RetrofittingView from '../components/Projects/RetrofittingView';
import PatentProjectView from '../components/Projects/PatentProjectView';
import NpdView from '../components/Projects/NpdView';
import Industrial3dModelingView from '../components/Projects/Industrial3dModelingView';

const PROJECT_TABS = [
  {
    id: 'reverse-engineering',
    num: '01',
    title: 'REVERSE ENGINEERING',
    subtitle: 'Recovering Engineering Data from an Existing Product',
    desc: 'Extract design data from physical sample components to develop CAD solid models, engineering drawings, and manufacturing parameters.',
    icon: '🔍',
    bookRef: 'Chapter 02 • Reverse Engineering Methodology',
    objective: 'Develop manufacturing drawings from an existing sample component (Gear Hub Shaft).',
    inputs: ['Physical Sample Part', 'Metrology Point Cloud / Measurements', 'Material Hardness Specs'],
    outputs: ['3D Parametric STEP Solid Model', '2D Orthographic Drawings with GD&T', 'CNC Toolpath Manufacturing Plan'],
    keyConcepts: ['Metrology', 'Laser Scanning', 'Parametric Modeling', 'Concentricity & Runout'],
  },
  {
    id: 'retrofitting',
    num: '02',
    title: 'RETROFITTING PROJECTS',
    subtitle: 'Upgrading Existing Machines and Systems',
    desc: 'Upgrade legacy manual machinery with modern pneumatic actuators, PLCs, and digital controls for improved productivity.',
    icon: '🔧',
    bookRef: 'Chapter 03 • Industrial Machine Retrofitting',
    objective: 'Transform manual machine loading to a semi-automatic pneumatic loading system.',
    inputs: ['Legacy Machine Study', 'Cycle Time Audit', 'Pneumatic Actuator Specs'],
    outputs: ['3D Retrofit Assembly Model', 'Pneumatic Schematic Diagram', 'Safety Interlock PLC Logic'],
    keyConcepts: ['Pneumatics', 'PLC Logic', 'Cycle Time Reduction', 'Operator Safety Interlocks'],
  },
  {
    id: 'patent-project',
    num: '03',
    title: 'PATENT PROJECT DEVELOPMENT',
    subtitle: 'Specialized Wheelchair Development & IP Protection',
    desc: 'Transform technical innovations into legally protected patent assets and commercial medical device prototypes.',
    icon: '📜',
    bookRef: 'Chapter 04 • Patent Development & IP Protection',
    objective: 'Design a specialized ergonomic wheelchair with foldable structure and improved stability.',
    inputs: ['Unmet User Mobility Need', 'Ergonomic Body Mass Indexes', 'Folding Mechanism Concept'],
    outputs: ['Patented Structural Geometry', 'FEA Load Validation Report', 'Patent Application Drawings'],
    keyConcepts: ['Ergonomics', 'Folding Linkages', 'IP Exclusivity', 'Prototype Drop Testing'],
  },
  {
    id: 'npd',
    num: '04',
    title: 'NEW PRODUCT DEVELOPMENT',
    subtitle: 'From Idea to Commercial Product',
    desc: 'Structured 6-stage product timeline converting raw ideas into mass-produced industrial machinery.',
    icon: '🚀',
    bookRef: 'Chapter 05 • New Product Development Lifecycle',
    objective: 'Execute the 6-stage NPD timeline from idea generation to commercial mass production launch.',
    inputs: ['Market Research', 'Customer Pain Points', 'Target Unit Production Cost'],
    outputs: ['Mass Manufacturing Tooling', 'Commercial Unit Assembly', 'Production Line CAM Setup'],
    keyConcepts: ['Product Stage-Gate Timeline', 'Design for Manufacturability (DFM)', 'Cost Feasibility'],
  },
  {
    id: '3d-modeling',
    num: '05',
    title: 'INDUSTRIAL 3D MODELING',
    subtitle: 'Creating Virtual Representations of Physical Components',
    desc: 'Master core CAD operations (Extrude, Revolve, Sweep, Loft, Pattern) and step-by-step feature trees.',
    icon: '📦',
    bookRef: 'Chapter 06 • Parametric 3D Solid Modeling',
    objective: 'Build a parametric water bottle model using sketching, extrusion, shell, fillet, and draft features.',
    inputs: ['2D Dimensional Sketch', 'Shell Wall Thickness Specification', 'Mold Draft Angle Criteria'],
    outputs: ['Watertight Parametric Solid Geometry', 'CAM Tooling Cavity Mold', 'STL Mesh for 3D Printing'],
    keyConcepts: ['Parametric Feature Tree', 'Thin-Wall Shelling', 'Injection Mold Draft Angles'],
  },
];

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabId = searchParams.get('tab') || 'reverse-engineering';

  const currentTab = PROJECT_TABS.find((t) => t.id === currentTabId) || PROJECT_TABS[0];

  const handleSelectTab = (id: string) => {
    setSearchParams({ tab: id });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8 flex-1">
        {/* Page Top Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
            INTERACTIVE INDUSTRIAL ENGINEERING PROJECT LAB
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Industrial Engineering Projects
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-3xl">
            Explore textbook project chapters with interactive 3D viewports, practical case studies, metrology demos, and engineering workflows.
          </p>
        </div>

        {/* 5 Project Navigation Bar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PROJECT_TABS.map((tab) => {
            const isSelected = tab.id === currentTab.id;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface-elevated border-accent shadow-xl ring-2 ring-accent scale-[1.02]'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      {tab.num}
                    </span>
                    <span className="text-xl">{tab.icon}</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-text-primary mb-1">{tab.title}</h3>
                  <p className="text-[11px] text-text-secondary line-clamp-2 leading-tight">{tab.desc}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono">
                  <span className={isSelected ? 'text-accent font-bold' : 'text-text-secondary'}>
                    {isSelected ? 'ACTIVE VIEW' : 'EXPLORE PROJECT'}
                  </span>
                  <span className="text-accent">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Pipeline Connections */}
        <ProjectLineage currentTab={currentTab.id} />

        {/* Active Project View Component */}
        <div className="min-h-[500px]">
          {currentTab.id === 'reverse-engineering' && <ReverseEngineeringView />}
          {currentTab.id === 'retrofitting' && <RetrofittingView />}
          {currentTab.id === 'patent-project' && <PatentProjectView />}
          {currentTab.id === 'npd' && <NpdView />}
          {currentTab.id === '3d-modeling' && <Industrial3dModelingView />}
        </div>

        {/* Reusable Project Detail Layout Specifications & Metadata */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-6">
          <div className="border-b border-border/50 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                REUSABLE PROJECT SPECIFICATION SHEET
              </span>
              <h3 className="text-xl font-bold text-text-primary">
                {currentTab.num} — {currentTab.title} Metadata & References
              </h3>
            </div>
            <span className="text-xs font-mono text-text-secondary bg-surface-elevated px-3 py-1 rounded border border-border">
              {currentTab.bookRef}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Inputs */}
            <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2">
              <h4 className="font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                <span>📥</span> Project Inputs
              </h4>
              <ul className="space-y-1.5 text-text-secondary font-mono">
                {currentTab.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {inp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outputs */}
            <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2">
              <h4 className="font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                <span>📤</span> Project Outputs & Deliverables
              </h4>
              <ul className="space-y-1.5 text-text-primary font-mono">
                {currentTab.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {out}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Concepts & Related Navigation */}
            <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2">
              <h4 className="font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                <span>🔗</span> Related Topics & Standards
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentTab.keyConcepts.map((kc, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-background text-accent border border-accent/20 text-[10px] font-mono"
                  >
                    {kc}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-border/50 flex flex-wrap gap-2 text-[11px]">
                <Link to="/workflow?tab=drafting" className="text-accent hover:underline font-bold">
                  View Drafting Rules →
                </Link>
                <Link to="/gdt-lab" className="text-accent hover:underline font-bold">
                  GD&T Lab →
                </Link>
                <Link to="/standards" className="text-accent hover:underline font-bold">
                  ISO/ASME Standards →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
