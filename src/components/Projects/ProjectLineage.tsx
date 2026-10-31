import { Link } from 'react-router-dom';

interface ProjectLineageProps {
  currentTab: string;
}

const LINEAGE_STEPS = [
  { id: 'reverse-engineering', label: 'REVERSE ENG.', num: '01', desc: 'Physical Part → CAD Data' },
  { id: '3d-modeling', label: 'CAD MODELING', num: '05', desc: 'Virtual 3D Geometry' },
  { id: 'drafting-link', label: 'DRAFTING', num: '2D', desc: 'GD&T & Specifications', isExternal: true, link: '/workflow?tab=drafting' },
  { id: 'retrofitting', label: 'RETROFITTING', num: '02', desc: 'Machine Upgrade' },
  { id: 'analysis-link', label: 'ANALYSIS', num: 'FEA', desc: 'Structural Validation', isExternal: true, link: '/workflow?tab=analyse-project' },
  { id: 'patent-project', label: 'PATENT DEV.', num: '03', desc: 'IP & Prototype' },
  { id: 'npd', label: 'NPD LAUNCH', num: '04', desc: 'Idea → Commercial Product' },
];

export default function ProjectLineage({ currentTab }: ProjectLineageProps) {
  return (
    <div className="bg-surface p-4 sm:p-6 rounded-xl border border-border shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border/50 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase">
            INDUSTRIAL ENGINEERING PIPELINE
          </span>
          <h3 className="text-sm font-bold text-text-primary">Connected Project Lineage & Lifecycle</h3>
        </div>
        <div className="text-[11px] font-mono text-text-secondary flex items-center gap-1.5 bg-surface-elevated px-2.5 py-1 rounded border border-border">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Book Lifecycle Integration
        </div>
      </div>

      {/* Pipeline Nodes */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[760px] justify-between relative py-2">
          {/* Animated Connecting Line behind nodes */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-accent via-cyan-400 to-accent -translate-y-1/2 z-0 opacity-40 animate-pulse" />

          {LINEAGE_STEPS.map((step) => {
            const isActive = step.id === currentTab;

            const content = (
              <div
                className={`relative z-10 flex flex-col items-center p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-lg shadow-accent/20 ring-2 ring-accent scale-105'
                    : 'bg-surface-elevated/80 border-border hover:border-accent/50 hover:bg-surface-elevated'
                }`}
              >
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mb-1 ${
                    isActive ? 'bg-accent text-background' : 'bg-surface text-accent border border-accent/20'
                  }`}
                >
                  {step.num}
                </span>
                <span className="text-xs font-bold text-text-primary text-center whitespace-nowrap">
                  {step.label}
                </span>
                <span className="text-[10px] text-text-secondary font-mono mt-0.5 whitespace-nowrap">
                  {step.desc}
                </span>
              </div>
            );

            if (step.isExternal && step.link) {
              return (
                <Link key={step.id} to={step.link}>
                  {content}
                </Link>
              );
            }

            return (
              <Link key={step.id} to={`/projects?tab=${step.id}`}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
