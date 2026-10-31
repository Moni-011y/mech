import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  link: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  { id: '1', title: 'Involute Gear Kinematics', category: 'Gear Lab', desc: 'Module, pitch diameter, addendum, dedendum, and gear ratio calculations.', link: '/gear-lab' },
  { id: '2', title: 'Spur Gear vs Helical Gear', category: 'Gear Lab', desc: 'Comparison of parallel vs angled tooth gear geometries and meshing.', link: '/gear-lab' },
  { id: '3', title: 'Feature Control Frame (FCF)', category: 'GD&T', desc: 'Geometric characteristic symbols, tolerance values, modifiers, and datums.', link: '/gdt-lab' },
  { id: '4', title: 'ASME Y14.5 Dimensioning', category: 'Standards', desc: 'Standard rules for geometric dimensioning and tolerancing.', link: '/standards' },
  { id: '5', title: 'ISO 286 Hole/Shaft Fits', category: 'Standards', desc: 'Calculates clearance, transition, and interference fit limits in microns.', link: '/standards' },
  { id: '6', title: 'Engineering Workflow Pipeline', category: 'Workflow', desc: '11-stage industrial product development process from requirement to production.', link: '/workflow' },
  { id: '7', title: 'Gearbox Reverse Engineering', category: 'Projects', desc: 'Step-by-step physical gear measurement, module estimation, and CAD reconstruction.', link: '/projects' },
  { id: '8', title: 'Wheelchair Frame FEA Analysis', category: 'Projects', desc: 'Static structural FEA simulation, equivalent stress, deformation, and factor of safety.', link: '/projects' },
  { id: '9', title: 'Bill of Materials (BOM)', category: 'Topics', desc: 'EBOM, MBOM, Service BOM, single-level, and multi-level assembly BOM trees.', link: '/bom-calculator' },
  { id: '10', title: 'Drawing Title Block Studio', category: 'Topics', desc: 'ISO/ASME compliant drawing sheet title blocks, projection angles, and revisions.', link: '/topics' },
];

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger search modal open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? SEARCH_DATABASE
    : SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (link: string) => {
    navigate(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-surface-elevated">
          <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            placeholder="Type to search topics, formulas, CAD models, GD&T, standards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-text-primary text-sm font-medium outline-none placeholder:text-text-secondary"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-text-secondary hover:text-text-primary bg-surface rounded border border-border"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto divide-y divide-border/40 flex-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-text-secondary text-sm">
              No matching topics or CAD resources found.
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.link)}
                className="p-3 hover:bg-surface-elevated rounded-lg cursor-pointer transition group flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition shrink-0">
                  Open →
                </span>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-surface-elevated border-t border-border text-[11px] text-text-secondary flex justify-between items-center font-mono">
          <span>Search MECH INDUSTRIAL Engineering Knowledge Base</span>
          <span>{results.length} Topics Available</span>
        </div>
      </div>
    </div>
  );
}
