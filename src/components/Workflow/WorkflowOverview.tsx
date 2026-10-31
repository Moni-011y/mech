import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRightIcon } from './WorkflowIcons';

interface WorkflowOverviewProps {
  onSelectCategory: (category: 'design-engineer' | 'drafting' | 'analyse-project') => void;
}

export default function WorkflowOverview({ onSelectCategory }: WorkflowOverviewProps) {
  const shouldReduceMotion = useReducedMotion();

  const categories = [
    {
      id: 'design-engineer' as const,
      icon: '⚙️',
      badge: '11 STAGES • PIPELINE',
      title: 'Design Engineer',
      subtitle: 'From Customer Requirements to Final Production',
      desc: 'Complete 11-stage industrial product development pipeline covering customer specs, concept exploration, 3D parametric CAD modeling, GD&T, BOM, prototyping, testing, and production handover.',
      stagesCount: 11,
      standards: 'ASME Y14.5 • ISO 1101 • AGMA',
      buttonText: 'Explore 11-Stage Pipeline',
      isPrimary: true,
      highlights: [
        'Customer Requirement & PRD sign-off',
        'Parametric 3D CAD modeling & assemblies',
        'Geometric Dimensioning & Tolerancing (GD&T)',
        'Engineering Analysis & Prototype Validation'
      ]
    },
    {
      id: 'drafting' as const,
      icon: '📐',
      badge: '10 STAGES • CHAPTER 7',
      title: 'Drafting Principles',
      subtitle: 'From 3D Model to Manufacturing Drawing',
      desc: 'Technical drawings communicating shape, size, materials, manufacturing tolerances, and functional requirements for machining and quality inspection.',
      stagesCount: 10,
      standards: 'ISO 128 • ASME Y14.3 • 1st/3rd Angle',
      buttonText: 'Explore Drafting Workflow',
      isPrimary: false,
      highlights: [
        '1st vs 3rd Angle Orthographic projection',
        'Full, Half & Offset Section views',
        'Bilateral and unilateral dimensional limits',
        'Title block, revision control & release'
      ]
    },
    {
      id: 'analyse-project' as const,
      icon: '📊',
      badge: '8 STAGES • FEA / CFD',
      title: 'Engineering Analysis',
      subtitle: 'From CAD Preparation to Design Optimization',
      desc: 'Systematic 8-stage engineering analysis process predicting structural deformation, von Mises stress, safety factor, and fatigue life before manufacturing.',
      stagesCount: 8,
      standards: 'FEA Solver • Static Structural • CFD',
      buttonText: 'Explore Analysis Workflow',
      isPrimary: false,
      highlights: [
        'Mesh element discretization & convergence',
        'Kinematic boundary constraints & 150 kg payload',
        'Stiffness matrix formulation [K]{u} = {F}',
        'von Mises stress, FoS & fatigue life prediction'
      ]
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="workflow-categories-overview">
      {/* Intro Banner */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          TEXTBOOK CHAPTERS 1 & 7 • INDUSTRIAL WORKFLOW METHODOLOGY
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-text-primary">
          Industrial Mechanical Engineering Workflows
        </h2>
        <p className="text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
          Select a workflow domain below to explore its structured engineering pipeline, sequence of deliverables, interactive 3D viewports, and industry-standard practices.
        </p>
      </div>

      {/* Category Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={cardVariants}
            className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between space-y-6 transition-all duration-300 relative group ${
              cat.isPrimary
                ? 'bg-surface border-accent/50 shadow-xl shadow-accent/10 ring-1 ring-accent/30 hover:border-accent hover:shadow-accent/20'
                : 'bg-surface border-border hover:border-accent/40 shadow-lg'
            }`}
          >
            {/* Top Badges & Icon */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    cat.isPrimary
                      ? 'bg-accent/20 border-accent/40 text-accent'
                      : 'bg-surface-elevated border-border text-steel'
                  }`}
                >
                  {cat.badge}
                </span>
                <span className="text-3xl">{cat.icon}</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-text-primary group-hover:text-accent transition">
                  {cat.title}
                </h3>
                <span className="text-xs font-mono text-accent block mt-0.5">
                  "{cat.subtitle}"
                </span>
                <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-3 border-t border-border/50 space-y-2">
                <span className="text-[10px] font-mono font-bold text-steel uppercase tracking-wider block">
                  Core Disciplines:
                </span>
                <ul className="space-y-1.5 text-xs text-text-secondary">
                  {cat.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-border/40 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-steel">
                <span>Standards:</span>
                <span className="text-text-primary font-semibold">{cat.standards}</span>
              </div>

              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-98 ${
                  cat.isPrimary
                    ? 'bg-accent text-background hover:bg-accent-bright shadow-accent/20'
                    : 'bg-surface-elevated text-text-primary hover:bg-border border border-border hover:border-accent'
                }`}
              >
                <span>{cat.buttonText}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
