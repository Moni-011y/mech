import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import MechanicalViewer from '../MechanicalViewer/MechanicalViewer';
import SpecializedWheelchairVideoPlayer from './SpecializedWheelchairVideoPlayer';

// 3D Wheelchair Model based strictly on book's features
function Wheelchair3D({ activeFeature }: { activeFeature: string | null }) {
  const wheelLeftRef = useRef<THREE.Group>(null);
  const wheelRightRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (wheelLeftRef.current && wheelRightRef.current) {
      wheelLeftRef.current.rotation.z += delta * 0.5;
      wheelRightRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Tubular Main Frame Structure */}
      <group>
        {/* Seat Base Bar */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[4, 0.4, 4]} />
          <meshStandardMaterial color={activeFeature === 'Ergonomic Design' ? '#38BDF8' : '#334155'} />
        </mesh>

        {/* Backrest Frame */}
        <mesh position={[0, 4.5, -1.9]}>
          <boxGeometry args={[3.8, 4.5, 0.3]} />
          <meshStandardMaterial color={activeFeature === 'Ergonomic Design' ? '#38BDF8' : '#1E293B'} />
        </mesh>

        {/* Armrests */}
        <mesh position={[-2.1, 3.2, 0]}>
          <boxGeometry args={[0.3, 0.4, 3.5]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        <mesh position={[2.1, 3.2, 0]}>
          <boxGeometry args={[0.3, 0.4, 3.5]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
      </group>

      {/* Main Drive Wheels (Left & Right) */}
      <group ref={wheelLeftRef} position={[-2.4, 2, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[2.5, 0.2, 16, 32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
        {/* Spokes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI]}>
            <cylinderGeometry args={[0.05, 0.05, 5, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        ))}
      </group>

      <group ref={wheelRightRef} position={[2.4, 2, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[2.5, 0.2, 16, 32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
        {/* Spokes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI]}>
            <cylinderGeometry args={[0.05, 0.05, 5, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Front Swivel Caster Wheels */}
      <mesh position={[-1.5, 0.6, 2.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.5, 0.6, 2.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Foldable Structure Hinge Bar */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 4.2, 16]} />
        <meshStandardMaterial color={activeFeature === 'Foldable Structure' ? '#F59E0B' : '#16B8A6'} />
      </mesh>

      {/* Feature Callout Labels */}
      {activeFeature && (
        <Html position={[0, 6, 0]} center>
          <div className="bg-surface-elevated/95 border border-accent text-accent px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-2xl whitespace-nowrap">
            🎯 FEATURE HIGHLIGHT: {activeFeature}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function PatentProjectView() {
  const [activeStage, setActiveStage] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<string | null>('Ergonomic Design');
  const [selectedImportance, setSelectedImportance] = useState(0);
  const [selectedBenefit, setSelectedBenefit] = useState(0);
  const [displayMode, setDisplayMode] = useState<'video' | '3d'>('video');

  const patentImportance = [
    {
      title: 'Innovation',
      icon: '💡',
      tag: 'PILLAR 01',
      tagColor: 'text-yellow-400',
      tagBg: 'bg-yellow-400/10 border-yellow-400/30',
      desc: 'Encouraging novel technical solutions for unsolved physical mobility challenges.',
      detail: 'Patents incentivize engineers and designers to solve real unmet needs with new mechanical approaches — rather than copying existing solutions. The patent protection period gives inventors a window to commercialize their innovation exclusively.',
    },
    {
      title: 'Research',
      icon: '🔬',
      tag: 'PILLAR 02',
      tagColor: 'text-sky-400',
      tagBg: 'bg-sky-400/10 border-sky-400/30',
      desc: 'Fostering deep mechanical study, material testing, and kinematic analysis.',
      detail: 'Filing a patent requires rigorous documentation of research findings, including material selection justifications, mechanical analysis, and performance test data — deepening the engineering body of knowledge.',
    },
    {
      title: 'New Product Development',
      icon: '⚙️',
      tag: 'PILLAR 03',
      tagColor: 'text-emerald-400',
      tagBg: 'bg-emerald-400/10 border-emerald-400/30',
      desc: 'Converting laboratory concepts into validated industrial assemblies.',
      detail: 'Patent projects bridge the gap between academic ideation and market-ready products. The structured 6-stage process (Problem → Concept → Design → Prototype → Test → File) ensures the idea reaches commercial viability.',
    },
    {
      title: 'Commercialization',
      icon: '📈',
      tag: 'PILLAR 04',
      tagColor: 'text-violet-400',
      tagBg: 'bg-violet-400/10 border-violet-400/30',
      desc: 'Securing legal exclusivity to safely invest in mass manufacturing.',
      detail: 'Without patent protection, competitors can replicate an innovative product immediately after market launch. A granted patent provides 20 years of exclusivity — enabling the inventor to recoup R&D investment through licensing or direct sales.',
    },
  ];

  const patentProcessStages = [
    { num: '01', title: 'PROBLEM IDENTIFICATION', action: 'Unmet Mobility Need', detail: 'Identify mobility constraints in standard wheelchairs on unpaved terrain.' },
    { num: '02', title: 'CONCEPT DEVELOPMENT', action: 'Ideation & Skewed Geometry', detail: 'Formulate foldable linkage mechanism and ergonomic seating angles.' },
    { num: '03', title: 'DESIGN DEVELOPMENT', action: '3D CAD & Kinematics', detail: 'Build 3D assembly model in SOLIDWORKS, checking pivot clearances and stability.' },
    { num: '04', title: 'PROTOTYPE DEVELOPMENT', action: 'Physical Fabrication', detail: 'Fabricate functional prototype using lightweight alloy tubing and quick-release pins.' },
    { num: '05', title: 'TESTING', action: 'Load & Ergonomic Trial', detail: 'Perform static payload test, drop test, and user comfort trials.' },
    { num: '06', title: 'PATENT FILING', action: 'IP Protection', detail: 'Prepare patent specifications, claims, and orthographic drawings for IP office submission.' },
  ];

  const wheelchairFeatures = [
    { name: 'Ergonomic Design', desc: 'Optimized posture support and lumbar seating angle reducing user fatigue.' },
    { name: 'Foldable Structure', desc: 'Compact folding linkage for easy transport inside compact vehicle trunks.' },
    { name: 'Improved Stability', desc: 'Wider wheelbase center of gravity preventing backward tipping on inclines.' },
    { name: 'User-Friendly Mechanism', desc: 'Intuitive single-lever braking and smooth quick-release wheel locks.' },
  ];

  const patentBenefits = [
    {
      title: 'Intellectual Property Protection',
      icon: '🛡️',
      tag: 'BENEFIT 01',
      tagColor: 'text-emerald-400',
      tagBg: 'bg-emerald-400/10 border-emerald-400/30',
      desc: 'Exclusive legal right to manufacture and market the unique design.',
      detail: 'A granted patent legally prevents any third party from manufacturing, selling, or importing the patented product without the inventor\'s written permission — enforceable in a court of law for 20 years from filing date.',
    },
    {
      title: 'Competitive Advantage',
      icon: '🏆',
      tag: 'BENEFIT 02',
      tagColor: 'text-sky-400',
      tagBg: 'bg-sky-400/10 border-sky-400/30',
      desc: 'Prevents competitors from copying proprietary folding and ergonomic mechanisms.',
      detail: 'Competitors are legally blocked from replicating the patented wheelchair folding linkage, ergonomic seat geometry, or quick-release mechanisms — creating a sustained market lead that cannot be simply copied.',
    },
    {
      title: 'Revenue Generation',
      icon: '💰',
      tag: 'BENEFIT 03',
      tagColor: 'text-amber-400',
      tagBg: 'bg-amber-400/10 border-amber-400/30',
      desc: 'Licensing opportunities to international medical device manufacturers.',
      detail: 'The patent holder can license manufacturing rights to international medical device companies in exchange for royalties — generating passive revenue without managing large-scale production directly.',
    },
    {
      title: 'Brand Value',
      icon: '⭐',
      tag: 'BENEFIT 04',
      tagColor: 'text-violet-400',
      tagBg: 'bg-violet-400/10 border-violet-400/30',
      desc: 'Establishes technical leadership and brand trust in medical equipment engineering.',
      detail: 'Holding patents publicly signals innovation leadership. Healthcare procurement teams and distributors prefer suppliers with patented IP — recognizing them as technically advanced and committed to product quality.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
            TEXTBOOK CHAPTER 04 • PROJECT 03
          </div>
          <span className="text-xs font-mono text-text-secondary">Mechanical Industrial Book</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          03 — PATENT PROJECT DEVELOPMENT
        </h1>
        <div className="bg-surface-elevated/80 p-4 rounded-xl border border-border text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl">
          <strong className="text-text-primary font-bold">Textbook Definition:</strong> A patent is a legal right granted to an inventor for a unique and innovative product or process.
        </div>
      </div>

      {/* PATENT PROJECT IMPORTANCE */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            FOUR PILLARS OF PATENT DEVELOPMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Importance of Patent Projects
          </h2>
          <p className="text-xs text-text-secondary">Select a pillar to expand its industrial context.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {patentImportance.map((item, idx) => {
            const isActive = selectedImportance === idx;
            return (
              <div
                key={item.title}
                onClick={() => setSelectedImportance(idx)}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-xl ring-1 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${item.tagColor} ${item.tagBg}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                <span className={`text-[10px] font-mono font-semibold block ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}>
                  {isActive ? '▼ EXPANDED' : 'Click to expand →'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expanded Detail */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-accent/40 shadow-lg flex gap-4 items-start">
          <span className="text-4xl shrink-0">{patentImportance[selectedImportance].icon}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-extrabold text-text-primary">{patentImportance[selectedImportance].title}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${patentImportance[selectedImportance].tagColor} ${patentImportance[selectedImportance].tagBg}`}>
                {patentImportance[selectedImportance].tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{patentImportance[selectedImportance].detail}</p>
          </div>
        </div>
      </section>

      {/* PATENT DEVELOPMENT PROCESS */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            6-STAGE WORKFLOW
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Patent Development Process
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {patentProcessStages.map((st, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-lg ring-2 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <span className="text-xs font-mono font-bold text-accent block">{st.num}</span>
                <span className="text-xs font-bold text-text-primary block mt-1 leading-snug">
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage Detail Panel */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/50 pb-3 gap-2">
            <div>
              <span className="text-xs font-mono text-accent font-bold">STAGE {patentProcessStages[activeStage].num} DETAILS</span>
              <h3 className="text-lg font-bold text-text-primary">{patentProcessStages[activeStage].title}</h3>
            </div>
            <p className="text-xs text-text-secondary max-w-md font-mono">{patentProcessStages[activeStage].action} — {patentProcessStages[activeStage].detail}</p>
          </div>

          {/* Stage 01 – Problem Identification */}
          {activeStage === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Real-World Need', icon: '🎯', detail: 'Standard wheelchairs lack stability on uneven terrain, causing user discomfort and tipping risk.' },
                { label: 'User Study', icon: '👥', detail: 'Interviews with patients and physiotherapists reveal ergonomic pain points and unmet mobility needs.' },
                { label: 'Gap Analysis', icon: '📊', detail: 'Market analysis confirms no existing product combines foldability with all-terrain stability at an accessible price.' },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-surface-elevated rounded-xl border border-border space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-bold text-text-primary">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Stage 02 – Concept Development */}
          {activeStage === 1 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Innovative Concepts Generated</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { concept: 'Foldable X-Linkage Frame', desc: 'Scissor-type folding mechanism reduces packed width to 28 cm for vehicle transport.' },
                  { concept: 'Adjustable Lumbar Support', desc: 'Sliding backrest rail with locking pins for patient-specific posture angle setting.' },
                  { concept: 'Anti-Tip Rear Stabilizer', desc: 'Spring-loaded rear anti-tip wheels deploy automatically on inclines >10°.' },
                  { concept: 'Single-Hand Braking', desc: 'Linked dual-brake lever on one armrest for single-arm mobility users.' },
                ].map((c) => (
                  <div key={c.concept} className="p-3 bg-background rounded-lg border border-border font-mono text-xs">
                    <div className="font-bold text-accent mb-1">{c.concept}</div>
                    <div className="text-text-secondary">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 03 – Design Development */}
          {activeStage === 2 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">CAD Design Deliverables</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
                {[
                  { item: '3D Assembly Model', tool: 'SOLIDWORKS', icon: '🏗️' },
                  { item: 'Kinematic Analysis', tool: 'Motion Study', icon: '📐' },
                  { item: 'FEA Stress Check', tool: 'SOLIDWORKS Sim', icon: '🔬' },
                  { item: '2D Manufacturing Drawing', tool: 'ISO Drafting', icon: '📄' },
                ].map((d) => (
                  <div key={d.item} className="p-3 bg-background rounded-lg border border-border">
                    <span className="text-xl block mb-1">{d.icon}</span>
                    <div className="font-bold text-text-primary text-[11px]">{d.item}</div>
                    <div className="text-text-secondary text-[10px] mt-0.5">{d.tool}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 04 – Prototype Development */}
          {activeStage === 3 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Prototype Build Specification</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { part: 'Frame Material', spec: 'Aluminum 6061-T6 Alloy Tubing — 1.5mm wall thickness, lightweight & corrosion resistant' },
                  { part: 'Folding Hardware', spec: 'Quick-release stainless steel pivot pins with self-locking nylon-insert nuts' },
                  { part: 'Wheel Assembly', spec: '24" pneumatic rear wheels + 4" front swivel casters with sealed bearings' },
                ].map((p) => (
                  <div key={p.part} className="p-3 bg-background rounded-lg border border-border font-mono text-xs">
                    <div className="font-bold text-accent mb-1">{p.part}</div>
                    <div className="text-text-secondary">{p.spec}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 05 – Testing */}
          {activeStage === 4 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Validation Test Results</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { test: 'Static Load Test', result: '120 kg payload', target: '≥100 kg', pass: true },
                  { test: 'Fold / Unfold Cycles', result: '5,000 cycles — no failure', target: '≥2,000', pass: true },
                  { test: 'Incline Stability (Anti-tip)', result: 'Stable to 15°', target: '≥10°', pass: true },
                  { test: 'User Comfort Trial (n=20)', result: '92% positive rating', target: '≥80%', pass: true },
                ].map((row) => (
                  <div key={row.test} className="p-3 bg-background rounded-lg border border-accent/20 font-mono text-xs flex justify-between items-start gap-2">
                    <div>
                      <div className="font-bold text-text-primary">{row.test}</div>
                      <div className="text-text-secondary">Result: {row.result} | Target: {row.target}</div>
                    </div>
                    <span className={row.pass ? 'text-emerald-400 font-bold shrink-0' : 'text-red-400 font-bold shrink-0'}>
                      {row.pass ? '✅ PASS' : '❌ FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 06 – Patent Filing */}
          {activeStage === 5 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Patent Filing Documentation Package</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { doc: 'Abstract', icon: '📝', desc: 'Technical summary of the invention' },
                  { doc: 'Claims', icon: '⚖️', desc: 'Legal scope of IP protection' },
                  { doc: 'Description', icon: '📄', desc: 'Detailed engineering description' },
                  { doc: 'Orthographic Drawings', icon: '📐', desc: 'Multi-view 2D patent drawings' },
                  { doc: 'Prior Art Search', icon: '🔍', desc: 'Novelty vs existing patents check' },
                  { doc: 'Filing Fee', icon: '💳', desc: 'IP office submission payment' },
                ].map((d) => (
                  <div key={d.doc} className="p-3 bg-background rounded-lg border border-border">
                    <span className="text-xl block mb-1">{d.icon}</span>
                    <div className="font-bold text-text-primary text-[11px]">{d.doc}</div>
                    <div className="text-text-secondary text-[10px] mt-0.5">{d.desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-secondary font-mono">Submitted to Indian Patent Office (IPO) / USPTO. Grant typically issued within 3–5 years from filing date.</p>
            </div>
          )}
        </div>

        {/* Book Project Flow — Visual Arrow Strip */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-border space-y-3">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">BOOK PROJECT FLOW</span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              'Industrial Problem',
              'Problem Identification',
              'Concept Development',
              'CAD Design',
              'Prototype Development',
              'Testing & Validation',
              'Patent Filing',
            ].map((step, idx, arr) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${
                  idx === 0 ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                  idx === arr.length - 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  'bg-accent/10 text-accent border-accent/30'
                }`}>{step}</span>
                {idx < arr.length - 1 && <span className="text-text-secondary">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICAL PATENT PROJECT EXAMPLE */}
      <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
              BOOK PRACTICAL EXAMPLE
            </span>
            <h2 className="text-2xl font-extrabold text-text-primary">
              SPECIALIZED WHEELCHAIR DEVELOPMENT
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Interactive 3D Patent Innovation Model &amp; Demonstration
            </p>
          </div>

          {/* View Mode Toggle: Demonstration Video (Default) vs Interactive 3D */}
          <div className="flex items-center p-1 rounded-xl bg-surface-elevated border border-border">
            <button
              onClick={() => setDisplayMode('video')}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                displayMode === 'video'
                  ? 'bg-accent text-background shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>🎬</span>
              <span>Patent Video</span>
            </button>
            <button
              onClick={() => setDisplayMode('3d')}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                displayMode === '3d'
                  ? 'bg-accent text-background shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>🧊</span>
              <span>Interactive 3D CAD</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 h-[450px] rounded-xl overflow-hidden border border-border shadow-2xl">
            {displayMode === 'video' ? (
              <SpecializedWheelchairVideoPlayer
                className="w-full h-full"
                onSwitchTo3d={() => setDisplayMode('3d')}
                show3dToggle={true}
              />
            ) : (
              <MechanicalViewer>
                <Wheelchair3D activeFeature={selectedFeature} />
              </MechanicalViewer>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Textbook Listed Features
              </h3>
              {displayMode === 'video' && (
                <button
                  onClick={() => setDisplayMode('3d')}
                  className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <span>View 3D Highlight →</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {wheelchairFeatures.map((feat) => {
                const isSelected = selectedFeature === feat.name;
                return (
                  <div
                    key={feat.name}
                    onClick={() => {
                      setSelectedFeature(feat.name);
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-surface-elevated border-accent shadow-md ring-1 ring-accent'
                        : 'bg-surface-elevated/50 border-border hover:border-accent/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-text-primary flex items-center justify-between mb-0.5">
                      <span>{feat.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-accent">
                          {displayMode === '3d' ? '▶ HIGHLIGHTED IN 3D' : '▶ SELECTED FEATURE'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PATENT BENEFITS */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            COMMERCIAL VALUE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Patent Benefits
          </h2>
          <p className="text-xs text-text-secondary">Select a benefit to expand its commercial context.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {patentBenefits.map((b, idx) => {
            const isActive = selectedBenefit === idx;
            return (
              <div
                key={b.title}
                onClick={() => setSelectedBenefit(idx)}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-xl ring-1 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl">{b.icon}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${b.tagColor} ${b.tagBg}`}>
                    {b.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">{b.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{b.desc}</p>
                <span className={`text-[10px] font-mono font-semibold block ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}>
                  {isActive ? '▼ EXPANDED' : 'Click to expand →'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expanded Benefit Detail */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-accent/40 shadow-lg flex gap-4 items-start">
          <span className="text-4xl shrink-0">{patentBenefits[selectedBenefit].icon}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-extrabold text-text-primary">{patentBenefits[selectedBenefit].title}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${patentBenefits[selectedBenefit].tagColor} ${patentBenefits[selectedBenefit].tagBg}`}>
                {patentBenefits[selectedBenefit].tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{patentBenefits[selectedBenefit].detail}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
