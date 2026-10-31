import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchModal from '../Search/SearchModal';
import TopicsMegaMenu from './TopicsMegaMenu';
import StandardsDropdown from './StandardsDropdown';

export default function Navbar() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<'workflow' | 'projects' | 'topics' | 'standards' | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const workflowOptions = [
    {
      title: 'DESIGN ENGINEER',
      subtitle: 'From Customer Requirement to Final Production',
      stages: '11 Stages',
      icon: '⚙️',
      link: '/workflow?tab=design-engineer',
    },
    {
      title: 'DRAFTING',
      subtitle: 'From 3D Model to Manufacturing-Ready Engineering Drawing',
      stages: '10 Stages',
      icon: '📐',
      link: '/workflow?tab=drafting',
    },
    {
      title: 'ANALYSE PROJECT WORKFLOW',
      subtitle: 'Validate the Design Before Manufacturing (FEA/CFD)',
      stages: '8 Stages',
      icon: '📊',
      link: '/workflow?tab=analyse-project',
    },
  ];

  const projectOptions = [
    {
      num: '01',
      title: 'REVERSE ENGINEERING',
      subtitle: 'Recovering Engineering Data from an Existing Product',
      icon: '🔍',
      link: '/projects?tab=reverse-engineering',
    },
    {
      num: '02',
      title: 'RETROFITTING PROJECTS',
      subtitle: 'Upgrading Existing Machines and Systems',
      icon: '🔧',
      link: '/projects?tab=retrofitting',
    },
    {
      num: '03',
      title: 'PATENT PROJECT DEVELOPMENT',
      subtitle: 'Specialized Wheelchair Development & IP Protection',
      icon: '📜',
      link: '/projects?tab=patent-project',
    },
    {
      num: '04',
      title: 'NEW PRODUCT DEVELOPMENT',
      subtitle: 'From Idea to Commercial Product',
      icon: '🚀',
      link: '/projects?tab=npd',
    },
    {
      num: '05',
      title: 'INDUSTRIAL 3D MODELING',
      subtitle: 'Creating Virtual Representations of Physical Components',
      icon: '📦',
      link: '/projects?tab=3d-modeling',
    },
  ];


  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <nav className="border-b border-border bg-surface-elevated/90 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-black text-background text-xl shadow-lg shadow-accent/20 group-hover:scale-105 transition">
              M
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-wider text-text-primary block leading-none">
                MECH INDUSTRIAL
              </span>
              <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase block mt-0.5">
                CAD & Mechanical Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition ${
                isActive('/') ? 'bg-accent text-background shadow-md shadow-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              HOME
            </Link>

            {/* WORKFLOW Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('workflow')}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'workflow' ? null : 'workflow')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition flex items-center gap-1 ${
                  isActive('/workflow') ? 'bg-accent text-background shadow-md shadow-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                WORKFLOW
                <span className="text-[10px]">▼</span>
              </button>

              {activeDropdown === 'workflow' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-surface-elevated border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-3 py-1.5 border-b border-border/50 text-[10px] font-mono uppercase text-text-secondary">
                    Industrial Engineering Workflows (Book Ch. 1 & 7)
                  </div>
                  <div className="space-y-1 mt-1">
                    {workflowOptions.map((opt) => (
                      <Link
                        key={opt.title}
                        to={opt.link}
                        onClick={() => setActiveDropdown(null)}
                        className="p-2.5 rounded-lg bg-surface/50 hover:bg-surface hover:border-accent/40 border border-transparent transition flex items-start gap-3 group"
                      >
                        <span className="text-lg bg-surface-elevated p-1.5 rounded-lg border border-border shrink-0">
                          {opt.icon}
                        </span>
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition">
                              {opt.title}
                            </h4>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                              {opt.stages}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{opt.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PROJECTS Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('projects')}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'projects' ? null : 'projects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition flex items-center gap-1 ${
                  isActive('/projects') ? 'bg-accent text-background shadow-md shadow-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                PROJECTS
                <span className="text-[10px]">▼</span>
              </button>

              {activeDropdown === 'projects' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-surface-elevated border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-3 py-1.5 border-b border-border/50 text-[10px] font-mono uppercase text-text-secondary">
                    Industrial Projects & Case Studies (Textbook)
                  </div>
                  <div className="space-y-1 mt-1">
                    {projectOptions.map((opt) => (
                      <Link
                        key={opt.num}
                        to={opt.link}
                        onClick={() => setActiveDropdown(null)}
                        className="p-2.5 rounded-lg bg-surface/50 hover:bg-surface hover:border-accent/40 border border-transparent transition flex items-start gap-3 group"
                      >
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20 shrink-0">
                          {opt.num}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition">
                            {opt.title}
                          </h4>
                          <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{opt.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TOPICS Dropdown (Mega Menu) */}
            <TopicsMegaMenu
              isOpen={activeDropdown === 'topics'}
              onClose={() => setActiveDropdown(null)}
              onToggle={() => setActiveDropdown(activeDropdown === 'topics' ? null : 'topics')}
            />

            {/* INDUSTRIAL STANDARDS Dropdown */}
            <StandardsDropdown
              isOpen={activeDropdown === 'standards'}
              onClose={() => setActiveDropdown(null)}
              onToggle={() => setActiveDropdown(activeDropdown === 'standards' ? null : 'standards')}
            />

            <Link
              to="/gear-lab"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition ${
                isActive('/gear-lab') ? 'bg-accent text-background shadow-md shadow-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              3D LAB
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/50 text-xs font-medium transition"
            >
              <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search CAD & Topics...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-surface-elevated rounded border border-border">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-border space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded bg-surface border border-border text-text-primary">HOME</Link>
              <Link to="/workflow" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded bg-surface border border-border text-text-primary">WORKFLOW</Link>
              <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded bg-surface border border-border text-text-primary">PROJECTS</Link>
              <Link to="/topics" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded bg-surface border border-border text-text-primary">TOPICS</Link>
              <Link to="/standards/gdt" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded bg-surface border border-border text-text-primary">GD&amp;T</Link>
              <Link to="/standards/tolerance" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded bg-surface border border-border text-text-primary">TOLERANCE</Link>
              <Link to="/gear-lab" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded bg-accent text-background">3D LAB</Link>
            </div>
          </div>
        )}
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
