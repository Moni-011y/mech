import { useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Navbar from '../components/Navigation/Navbar';
import MechanicalViewer from '../components/MechanicalViewer/MechanicalViewer';
import DraftingKnowledgeHub from '../components/Drafting/DraftingKnowledgeHub';
import BomTypesSection from '../components/BOM/BomTypesSection';
import BomStandardsSection from '../components/BOM/BomStandardsSection';
import TitleBlockLearningSection from '../components/TitleBlock/TitleBlockLearningSection';
import EngineeringAnalysisSection from '../components/Analysis/EngineeringAnalysisSection';
import GearsHub from '../components/Gear/GearsHub';

// Mini 3D Gear for the GEARS Card
function MiniGear3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.8;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[3, 3, 1.2, 24]} />
        <meshStandardMaterial color="#16B8A6" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Gear teeth */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 3.1, 0, Math.sin(angle) * 3.1]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.3, 1.2, 0.5]} />
            <meshStandardMaterial color="#0D9488" metalness={0.9} roughness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Topics() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // Gear Calculation Tool State
  const [calcModule, setCalcModule] = useState(2.5);
  const [calcTeeth1, setCalcTeeth1] = useState(20);
  const [calcTeeth2, setCalcTeeth2] = useState(60);
  const [calcRpmIn, setCalcRpmIn] = useState(1500);

  const pitchDia1 = calcModule * calcTeeth1;
  const pitchDia2 = calcModule * calcTeeth2;
  const centerDist = (pitchDia1 + pitchDia2) / 2;
  const gearRatio = calcTeeth2 / calcTeeth1;
  const rpmOut = calcRpmIn / gearRatio;

  // Render content based on active route path
  const isRoute = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8 flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <Link to="/" className="hover:text-accent">HOME</Link>
          <span>/</span>
          <Link to="/topics" className="hover:text-accent font-bold text-text-primary">TOPICS</Link>
          {pathname !== '/topics' && (
            <>
              <span>/</span>
              <span className="text-accent uppercase font-bold">
                {pathname.replace('/topics/', '').replace(/\//g, ' ► ')}
              </span>
            </>
          )}
        </div>

        {/* Page Header (Only on /topics hub overview) */}
        {pathname === '/topics' && (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
              PRIMARY TEXTBOOK CURRICULUM & KNOWLEDGE BASE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Mechanical Engineering Topics Hub
            </h1>
            <p className="text-sm sm:text-base text-text-secondary max-w-3xl">
              Derived directly from "Mechanical Industrial Book" & "Gear Concepts Book". Explore drafting standards, BOM structures, Title Block studios, FEA analysis, and Gear mechanics.
            </p>
          </div>
        )}

        {/* TOPICS HUB INDEX OVERVIEW (Shown on /topics or as navigation cards) */}
        {pathname === '/topics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: ENGINEERING DRAFTING */}
              <div
                onClick={() => navigate('/topics/engineering-drafting')}
                className="bg-surface p-6 rounded-2xl border border-border hover:border-accent/60 transition-all cursor-pointer space-y-3 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">📐</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      CHAPTER 01
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition">
                    ENGINEERING DRAFTING
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Orthographic projections, isometric drawings, sectional views, detail drawings, and manufacturing assembly drawings.
                  </p>
                </div>
                <div className="text-xs font-mono text-accent font-bold pt-2 flex items-center justify-between border-t border-border/40">
                  <span>EXPLORE DRAFTING</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 2: BILL OF MATERIALS */}
              <div
                onClick={() => navigate('/topics/bom')}
                className="bg-surface p-6 rounded-2xl border border-border hover:border-accent/60 transition-all cursor-pointer space-y-3 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">📋</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      TYPES & STANDARDS
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition">
                    BILL OF MATERIALS (BOM)
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    EBOM vs MBOM hierarchy, single-level vs multi-level trees, ISO 7573 & ASME Y14.34 formatting rules.
                  </p>
                </div>
                <div className="text-xs font-mono text-accent font-bold pt-2 flex items-center justify-between border-t border-border/40">
                  <span>EXPLORE BOM TYPES & STANDARDS</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 3: TITLE BLOCK */}
              <div
                onClick={() => navigate('/topics/title-block')}
                className="bg-surface p-6 rounded-2xl border border-border hover:border-accent/60 transition-all cursor-pointer space-y-3 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">📄</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      ISO 7200 / ASME Y14.1
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition">
                    TITLE BLOCK STUDIO
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Interactive engineering blueprint title block generator with projection symbols, revisions, and scale specs.
                  </p>
                </div>
                <div className="text-xs font-mono text-accent font-bold pt-2 flex items-center justify-between border-t border-border/40">
                  <span>OPEN TITLE BLOCK EDITOR</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 4: ENGINEERING ANALYSIS */}
              <div
                onClick={() => navigate('/topics/engineering-analysis')}
                className="bg-surface p-6 rounded-2xl border border-border hover:border-accent/60 transition-all cursor-pointer space-y-3 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">📈</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      FEA & KINEMATICS
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition">
                    ENGINEERING ANALYSIS
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Finite Element Analysis (FEA) stress heatmaps, von Mises stress evaluation, Factor of Safety (FoS), and CFD flow dynamics.
                  </p>
                </div>
                <div className="text-xs font-mono text-accent font-bold pt-2 flex items-center justify-between border-t border-border/40">
                  <span>EXPLORE FEA ANALYSIS</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 5: GEARS (WITH MINI 3D GEAR PREVIEW) */}
              <div
                onClick={() => navigate('/topics/gears')}
                className="bg-surface p-6 rounded-2xl border border-accent/50 shadow-2xl hover:border-accent transition-all cursor-pointer space-y-3 group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">⚙️</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-background font-bold">
                      MINIATURE 3D MODEL
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-text-primary group-hover:text-accent transition">
                    GEARS ENGINEERING
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Terminology, 6 gear types (Spur, Helical, Bevel, Worm, Rack & Pinion, Internal), speed calculations, and reverse engineering.
                  </p>
                </div>

                {/* Miniature 3D Viewport */}
                <div className="h-32 rounded-xl overflow-hidden border border-border my-2 bg-background">
                  <MechanicalViewer>
                    <MiniGear3D />
                  </MechanicalViewer>
                </div>

                <div className="text-xs font-mono text-accent font-bold pt-2 flex items-center justify-between border-t border-border/40">
                  <span>OPEN GEARS HUB</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 6: SHEET METAL (COMING SOON) */}
              <div className="bg-surface/50 p-6 rounded-2xl border border-border/60 opacity-80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">✂️</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      STATUS: COMING SOON
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">SHEET METAL</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    K-Factor calculation, bend allowance, bend deduction, flat pattern unwrapping, and press brake tooling selection.
                  </p>
                </div>
                <div className="text-xs font-mono text-amber-400 font-semibold pt-2 border-t border-border/40">
                  ⏳ UNDER DEVELOPMENT
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. ENGINEERING DRAFTING VIEW */}
        {isRoute('/topics/engineering-drafting') && (
          <DraftingKnowledgeHub onBack={() => navigate('/topics')} />
        )}

        {/* 2. BILL OF MATERIALS (BOM) VIEW */}
        {isRoute('/topics/bom') && (
          <div className="space-y-6">
            <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
                <div>
                  <span className="text-xs font-mono text-accent font-bold">CHAPTER 01 • BOM STRUCTURE</span>
                  <h2 className="text-2xl font-bold text-text-primary">BILL OF MATERIALS (BOM)</h2>
                </div>
                <div className="flex gap-2 text-xs font-mono">
                  <Link
                    to="/topics/bom/types"
                    className={`px-3 py-1.5 rounded border font-bold transition ${
                      pathname === '/topics/bom/types'
                        ? 'bg-accent text-background border-accent shadow-sm'
                        : 'bg-surface-elevated border-border text-accent hover:border-accent'
                    }`}
                  >
                    BOM TYPES
                  </Link>
                  <Link
                    to="/topics/bom/standards"
                    className={`px-3 py-1.5 rounded border font-bold transition ${
                      pathname === '/topics/bom/standards'
                        ? 'bg-accent text-background border-accent shadow-sm'
                        : 'bg-surface-elevated border-border text-accent hover:border-accent'
                    }`}
                  >
                    BOM STANDARDS
                  </Link>
                </div>
              </div>

              {/* Sub-view: Types or Standards */}
              {pathname === '/topics/bom/types' ? (
                <BomTypesSection onBackToBom={() => navigate('/topics/bom')} />
              ) : pathname === '/topics/bom/standards' ? (
                <BomStandardsSection onBackToBom={() => navigate('/topics/bom')} />
              ) : (
                <p className="text-xs text-text-secondary leading-relaxed">
                  Select BOM Types or Standards above to inspect textbook specification rules.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 3. TITLE BLOCK VIEW */}
        {isRoute('/topics/title-block') && (
          <TitleBlockLearningSection onBackToTopics={() => navigate('/topics')} />
        )}

        {/* 4. ENGINEERING ANALYSIS VIEW */}
        {isRoute('/topics/engineering-analysis') && (
          <EngineeringAnalysisSection onBack={() => navigate('/topics')} />
        )}

        {/* 5. GEARS HUB & SUBTOPICS VIEW */}
        {isRoute('/topics/gears') && (
          <GearsHub onBackToTopics={() => navigate('/topics')} />
        )}

        {/* 6. SHEET METAL VIEW */}
        {isRoute('/topics/sheet-metal') && (
          <div className="bg-surface p-8 rounded-2xl border border-border text-center space-y-4">
            <span className="text-3xl">✂️</span>
            <h2 className="text-2xl font-bold text-amber-400">SHEET METAL MODULE</h2>
            <span className="inline-block px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
              STATUS: COMING SOON
            </span>
            <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
              K-Factor calculations, bend allowance, bend deduction, flat pattern DXF unwrapping, and press brake punch/die selection modules are under active development.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
