import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';
import IndustrialPipeline from '../components/Workflow/IndustrialPipeline';
import DraftingPipeline from '../components/Workflow/DraftingPipeline';
import WorkflowOverview from '../components/Workflow/WorkflowOverview';
import EngineeringAnalysisWorkflow from '../components/Workflow/EngineeringAnalysisWorkflow';

type WorkflowTab = 'overview' | 'design-engineer' | 'drafting' | 'analyse-project';

export default function Workflow() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as WorkflowTab) || 'design-engineer';
  const [activeTab, setActiveTab] = useState<WorkflowTab>(initialTab);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') as WorkflowTab;
    if (tabParam && ['overview', 'design-engineer', 'drafting', 'analyse-project'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const changeTab = (tab: WorkflowTab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      setSearchParams({ tab: 'overview' });
    } else {
      setSearchParams({ tab });
    }
  };

  // Section 1: Design Engineer State
  const [deResponsibility, setDeResponsibility] = useState('Product Development');

  // Section 2: Checklist State (Persisted in localStorage)
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('mech_de_checklist');
    return saved
      ? JSON.parse(saved)
      : {
          cadModel: false,
          drafting: false,
          dimensions: false,
          gdt: false,
          tolerances: false,
          bom: false,
          titleBlock: false,
          analysis: false,
          designReview: false,
          finalRelease: false,
        };
  });

  useEffect(() => {
    localStorage.setItem('mech_de_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistCount = Object.values(checklist).filter(Boolean).length;
  const checklistPercent = Math.round((checklistCount / 10) * 100);

  // Design Engineer Responsibilities (Book Chapter 1)
  const deResponsibilities: Record<string, { desc: string; icon: string }> = {
    'Product Development': {
      desc: 'Creating new products from concept to manufacturing stage.',
      icon: '💡',
    },
    'Product Modification': {
      desc: 'Improving existing products based on customer requirements.',
      icon: '🔧',
    },
    'Drafting and Documentation': {
      desc: 'Preparing manufacturing drawings and technical documentation.',
      icon: '📐',
    },
    'Design Validation': {
      desc: 'Ensuring designs meet functional requirements.',
      icon: '✅',
    },
    Coordination: {
      desc: 'Working with production, quality, procurement, and customers.',
      icon: '🤝',
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8 flex-1">
        {/* Top Header & Visual Sub-Tabs */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold tracking-wider uppercase">
            TEXTBOOK CHAPTERS 1 & 7 • INDUSTRIAL WORKFLOWS
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                {activeTab === 'overview' && 'WORKFLOW DISCIPLINES'}
                {activeTab === 'design-engineer' && 'INDUSTRIAL DESIGN ENGINEERING PIPELINE'}
                {activeTab === 'drafting' && 'DRAFTING'}
                {activeTab === 'analyse-project' && 'ENGINEERING ANALYSIS PROJECT WORKFLOW'}
              </h1>
              <p className="text-sm text-text-secondary mt-1 font-mono">
                {activeTab === 'overview' && '"Structured Industrial Engineering Process Frameworks"'}
                {activeTab === 'design-engineer' && '"From customer requirements to final production — a structured engineering design process."'}
                {activeTab === 'drafting' && '"From 3D Model to Manufacturing-Ready Engineering Drawing"'}
                {activeTab === 'analyse-project' && '"From CAD preparation to design optimization — a systematic process for evaluating engineering performance before manufacturing."'}
              </p>
            </div>

            {/* Visual Workflow Map Top Selectors */}
            <div className="inline-flex bg-surface p-1 rounded-xl border border-border shadow-md">
              <button
                onClick={() => changeTab('overview')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                  activeTab === 'overview'
                    ? 'bg-accent text-background shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📋 OVERVIEW
              </button>
              <button
                onClick={() => changeTab('design-engineer')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                  activeTab === 'design-engineer'
                    ? 'bg-accent text-background shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                ⚙️ DESIGN ENGINEER
              </button>
              <button
                onClick={() => changeTab('drafting')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                  activeTab === 'drafting'
                    ? 'bg-accent text-background shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📐 DRAFTING
              </button>
              <button
                onClick={() => changeTab('analyse-project')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                  activeTab === 'analyse-project'
                    ? 'bg-accent text-background shadow-md shadow-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📊 ANALYSE PROJECT
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 0: OVERVIEW / WORKFLOW CATEGORIES HUB                 */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <WorkflowOverview onSelectCategory={(cat) => changeTab(cat)} />
        )}

        {/* ========================================================= */}
        {/* TAB 1: DESIGN ENGINEER WORKFLOW — Industrial Pipeline     */}
        {/* ========================================================= */}
        {activeTab === 'design-engineer' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Secondary link to Engineering Analysis workflow */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Chapter 1 • Design Engineering
                </span>
              </div>
              <button
                onClick={() => changeTab('analyse-project')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-elevated text-text-secondary hover:text-accent text-xs font-mono font-bold border border-border hover:border-accent/50 transition shadow-sm"
                title="Switch to 8-Stage Engineering Analysis Project Workflow"
              >
                <span>📊</span>
                <span>View Engineering Analysis Workflow (8 Stages) →</span>
              </button>
            </div>

            {/* 11-Stage Industrial Pipeline — Primary Design Engineer Content */}
            <IndustrialPipeline onBack={() => changeTab('overview')} />

            {/* Textbook Intro Box */}
            <div className="bg-surface p-6 rounded-xl border border-border space-y-4 shadow">
              <h2 className="text-lg font-bold text-accent uppercase tracking-wider">
                Book Definition: What is Design Engineering?
              </h2>
              <p className="text-sm text-text-primary leading-relaxed">
                As defined in <strong>Chapter 1 of Mechanical Industrial Book</strong>, Design Engineering is the process of creating <strong>Products, Machines, Tools, Equipment, and Systems</strong> that fulfill:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold font-mono">
                <div className="p-3 bg-surface-elevated rounded-lg border border-border text-center text-accent">
                  1. Functional Requirements
                </div>
                <div className="p-3 bg-surface-elevated rounded-lg border border-border text-center text-accent">
                  2. Manufacturing Requirements
                </div>
                <div className="p-3 bg-surface-elevated rounded-lg border border-border text-center text-accent">
                  3. Safety Requirements
                </div>
                <div className="p-3 bg-surface-elevated rounded-lg border border-border text-center text-accent">
                  4. Economic Requirements
                </div>
              </div>
            </div>

            {/* Design Engineer Responsibilities (Workstation) */}
            <div className="bg-surface p-6 rounded-xl border border-border space-y-4 shadow">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Design Engineer Responsibilities (Click to inspect)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {Object.keys(deResponsibilities).map((key) => {
                  const item = deResponsibilities[key];
                  const isSelected = deResponsibility === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setDeResponsibility(key)}
                      className={`p-4 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-accent/15 border-accent text-text-primary shadow-lg shadow-accent/10 ring-1 ring-accent'
                          : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h4 className="text-xs font-bold leading-snug">{key}</h4>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-surface-elevated rounded-xl border border-border text-xs text-text-primary">
                <span className="font-bold text-accent uppercase block mb-1">
                  Selected Responsibility: {deResponsibility}
                </span>
                <p className="text-text-secondary">{deResponsibilities[deResponsibility].desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DRAFTING WORKFLOW                                   */}
        {/* ========================================================= */}
        {activeTab === 'drafting' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 10-Stage Interactive Engineering Drafting Pipeline (Book Page 33) */}
            <DraftingPipeline onBack={() => changeTab('overview')} />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ANALYSE PROJECT WORKFLOW                           */}
        {/* ========================================================= */}
        {activeTab === 'analyse-project' && (
          <div className="space-y-8 animate-fadeIn">
            <EngineeringAnalysisWorkflow onBackToOverview={() => changeTab('overview')} useVideoPlayer={true} />
          </div>
        )}

        {/* ========================================================= */}
        {/* DESIGN ENGINEER CHECKLIST (Book Reference)                */}
        {/* ========================================================= */}
        <div className="bg-surface p-6 rounded-xl border border-border space-y-6 shadow">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-accent tracking-wider uppercase">
                DESIGN ENGINEER'S CHECKLIST
              </h3>
              <p className="text-xs text-text-secondary">
                Track compliance prior to final drawing release and production handover.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                {checklistCount} of 10 Completed ({checklistPercent}%)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${checklistPercent}%` }}
            ></div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'cadModel', label: 'CAD Model Completed' },
              { key: 'drafting', label: 'Drafting Completed' },
              { key: 'dimensions', label: 'Dimensions Verified' },
              { key: 'gdt', label: 'GD&T Applied' },
              { key: 'tolerances', label: 'Tolerances Checked' },
              { key: 'bom', label: 'BOM Prepared' },
              { key: 'titleBlock', label: 'Title Block Verified' },
              { key: 'analysis', label: 'Analysis Completed' },
              { key: 'designReview', label: 'Design Review Approved' },
              { key: 'finalRelease', label: 'Final Release Document Prepared' },
            ].map((item) => {
              const isChecked = checklist[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleChecklistItem(item.key)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                    isChecked
                      ? 'bg-accent/10 border-accent/40 text-text-primary'
                      : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs border ${
                      isChecked ? 'bg-accent text-background border-accent' : 'bg-surface border-border'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
