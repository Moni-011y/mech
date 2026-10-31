import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import MechanicalViewer from '../MechanicalViewer/MechanicalViewer';
import PneumaticRetrofitVideoPlayer from './PneumaticRetrofitVideoPlayer';

// 3D Retrofitted Pneumatic Machine Model
function RetrofitMachine3D({ isAutomated, activeStage }: { isAutomated: boolean; activeStage: number }) {
  const pistonRef = useRef<THREE.Mesh>(null);
  const sensorRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pistonRef.current) {
      if (isAutomated) {
        // Continuous smooth back-and-forth pneumatic loading stroke
        pistonRef.current.position.z = Math.sin(state.clock.getElapsedTime() * 3) * 2.5;
      } else {
        pistonRef.current.position.z = 0;
      }
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Machine Frame Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[14, 1.5, 10]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Conveyor / Loading Bed */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[12, 0.6, 6]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mechanical Workpiece Container */}
      <mesh position={[-3, 2.5, 0]}>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial color="#16B8A6" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* PNEUMATIC RETROFIT PACKAGE (Highlighted when Automated) */}
      {isAutomated ? (
        <group position={[4, 2.5, 0]}>
          {/* Cylinder Housing */}
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.2, 1.2, 6, 32]} />
            <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Pneumatic Piston Shaft */}
          <mesh ref={pistonRef} position={[-2, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.5, 0.5, 5, 32]} />
            <meshStandardMaterial color="#E2E8F0" metalness={1.0} roughness={0.05} />
          </mesh>

          {/* Inductive Proximity Sensors */}
          <mesh ref={sensorRef} position={[-1, 1.8, 1.2]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} />
          </mesh>

          {/* Solenoid Control Valve Block */}
          <mesh position={[2, 1.5, 2]}>
            <boxGeometry args={[1.5, 2, 1.5]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>

          <Html position={[0, 3, 0]} center>
            <div className="bg-cyan-950/90 border border-cyan-400 text-cyan-300 px-2.5 py-1 rounded text-[10px] font-mono shadow-xl font-bold whitespace-nowrap">
              ⚡ SEMI-AUTOMATIC PNEUMATIC RETROFIT (ACTIVE)
            </div>
          </Html>
        </group>
      ) : (
        /* Legacy Manual Lever Handle */
        <group position={[4, 2.5, 0]}>
          <mesh rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.3, 0.3, 6, 16]} />
            <meshStandardMaterial color="#64748B" metalness={0.5} />
          </mesh>
          <mesh position={[-1.2, 3, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
          <Html position={[0, 3, 0]} center>
            <div className="bg-red-950/90 border border-red-500 text-red-300 px-2.5 py-1 rounded text-[10px] font-mono shadow-xl font-bold whitespace-nowrap">
              ✋ LEGACY MANUAL LOADING (HIGH OPERATOR FATIGUE)
            </div>
          </Html>
        </group>
      )}

      {/* Stage Highlight Overlay */}
      <Html position={[0, 5, 0]} center>
        <div className="bg-surface-elevated/90 border border-accent text-accent px-3 py-1 rounded text-[11px] font-mono shadow font-bold">
          STAGE 0{activeStage + 1} RETROFIT FOCUS
        </div>
      </Html>
    </group>
  );
}

export default function RetrofittingView() {
  const [selectedWhy, setSelectedWhy] = useState(0);
  const [selectedApp, setSelectedApp] = useState(0);
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(0);
  const [isAutomated, setIsAutomated] = useState(true);
  const [displayMode, setDisplayMode] = useState<'video' | '3d'>('video');

  const whyRetrofitCards = [
    {
      title: 'Increase Productivity',
      icon: '⚡',
      summary: 'Higher machine throughput & reduced cycle times.',
      detail:
        'Replacing manual hand lever operations with pneumatic cylinders speeds loading cycles by up to 350%, driving immediate plant output gains without purchasing entirely new machine chassis.',
    },
    {
      title: 'Improve Safety',
      icon: '🛡️',
      summary: 'Operator pinch-point and ergonomic hazard elimination.',
      detail:
        'Pneumatic automation and light-curtain interlocking protect machine operators from dangerous pinch zones, reducing workplace injury claims and meeting ISO 13849 safety standards.',
    },
    {
      title: 'Reduce Maintenance Costs',
      icon: '🔧',
      summary: 'Modern digital controls replace worn mechanical links.',
      detail:
        'Replacing old worn mechanical linkages with self-lubricating pneumatic components lowers breakdown frequency and routine oiling requirements.',
    },
    {
      title: 'Extend Machine Life',
      icon: '⏳',
      summary: 'Extend heavy industrial frame utility by 10-15 years.',
      detail:
        'Heavy cast-iron machine frames last over 50 years. Retrofitting modern digital controls and actuators gives legacy structural frames brand-new productivity.',
    },
  ];

  const retrofitApps = [
    {
      title: 'CNC MACHINES',
      subtitle: 'Controller Upgradation',
      desc: 'Replacing legacy Fanuc/Siemens 1980s CRT controls with modern touchscreen CNC controllers with Ethernet & CAD/CAM integration.',
    },
    {
      title: 'PRODUCTION MACHINES',
      subtitle: 'Automation Integration',
      desc: 'Integrating PLC logic controllers, pneumatic clamps, and automatic part pushers on manual stamping presses.',
    },
    {
      title: 'MATERIAL HANDLING',
      subtitle: 'Sensor Integration',
      desc: 'Adding photo-electric sensors, encoder feedback, and VFD speed drives to legacy belt and roller conveyors.',
    },
    {
      title: 'INDUSTRIAL EQUIPMENT',
      subtitle: 'Energy Optimization',
      desc: 'Retrofitting IE4 high-efficiency motors and regenerative braking drives onto heavy industrial hydraulic pumps.',
    },
  ];

  const workflowStages = [
    { num: '01', title: 'EXISTING MACHINE STUDY', desc: 'Audit physical machine, measure cycle times, and inspect mechanical wear.' },
    { num: '02', title: 'PROBLEM IDENTIFICATION', desc: 'Identify bottlenecks (e.g. manual loading fatigue & 45 sec load time).' },
    { num: '03', title: 'CONCEPT DESIGN', desc: 'Formulate pneumatic double-acting cylinder mechanism concept with solenoid valve.' },
    { num: '04', title: 'CAD DEVELOPMENT', desc: 'Design adapter brackets, sensor mounts, and pneumatic layout in 3D CAD.' },
    { num: '05', title: 'COMPONENT MANUFACTURING', desc: 'Machining mounting plates, laser cutting brackets, and assembling pneumatic manifold.' },
    { num: '06', title: 'INSTALLATION', desc: 'Mount cylinder, wire proximity sensors to PLC, and route pneumatic air lines.' },
    { num: '07', title: 'TESTING', desc: 'Perform dry runs, calibrate piston stroke velocity, and verify safety interlocks.' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold">
            TEXTBOOK CHAPTER 03 • PROJECT 02
          </div>
          <span className="text-xs font-mono text-text-secondary">Mechanical Industrial Book</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          02 — RETROFITTING PROJECTS
        </h1>
        <p className="text-base sm:text-lg text-accent font-semibold italic">
          "Upgrading Existing Machines and Systems with Modern Technology"
        </p>
        <div className="bg-surface-elevated/80 p-4 rounded-xl border border-border text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl space-y-2">
          <p><strong className="text-text-primary font-bold">Textbook Definition:</strong> Retrofitting refers to upgrading existing machines, products, or systems with modern technology to improve performance and efficiency.</p>
          <p className="text-xs text-text-secondary border-t border-border/50 pt-2">
            <strong className="text-text-primary">Book Context:</strong> Many industries operate old machinery that is still <em>mechanically sound</em> but lacks modern functionality. Rather than replacing entire machines, retrofitting offers a cost-effective path to upgrade only the control, automation, or energy systems — preserving the robust mechanical frame investment.
          </p>
        </div>
      </div>

      {/* WHY RETROFITTING? */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            BUSINESS & TECHNICAL VALUE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Why Retrofitting?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whyRetrofitCards.map((card, idx) => {
            const isSelected = selectedWhy === idx;
            return (
              <div
                key={card.title}
                onClick={() => setSelectedWhy(idx)}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface-elevated border-accent shadow-xl ring-2 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <span className="text-3xl mb-2 block">{card.icon}</span>
                <h3 className="text-sm font-bold text-text-primary mb-1">{card.title}</h3>
                <p className="text-xs text-text-secondary mb-3">{card.summary}</p>
                <div className="text-[11px] text-accent font-mono">
                  {isSelected ? '▶ Viewing Detail' : 'Click to inspect'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-surface-elevated p-5 rounded-xl border border-accent/40 shadow-lg text-xs sm:text-sm text-text-primary leading-relaxed">
          <strong className="text-accent font-bold">{whyRetrofitCards[selectedWhy].title}: </strong>
          {whyRetrofitCards[selectedWhy].detail}
        </div>
      </section>

      {/* RETROFITTING APPLICATIONS */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            INDUSTRIAL USE CASES
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Retrofitting Applications
          </h2>
          <p className="text-xs text-text-secondary">Select a sector card to view the industrial application detail.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {retrofitApps.map((app, idx) => {
            const isActive = selectedApp === idx;
            return (
              <div
                key={app.title}
                onClick={() => setSelectedApp(idx)}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-xl ring-1 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-bold border border-accent/20">
                    {app.subtitle}
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary">SECTOR 0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">{app.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{app.desc}</p>
                <span className={`text-[10px] font-mono font-semibold block ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}>
                  {isActive ? '▼ ACTIVE' : 'Click to expand →'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expanded Application Detail */}
        <div className="bg-surface-elevated p-5 rounded-xl border border-accent/40 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-base font-extrabold text-text-primary">{retrofitApps[selectedApp].title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-bold border border-accent/20">
                  {retrofitApps[selectedApp].subtitle}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{retrofitApps[selectedApp].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* RETROFITTING WORKFLOW */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            7-STAGE METHODOLOGY
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Retrofitting Workflow
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {workflowStages.map((st, idx) => {
            const isActive = activeWorkflowStage === idx;
            return (
              <button
                key={st.num}
                onClick={() => setActiveWorkflowStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-surface-elevated border-accent shadow-lg ring-2 ring-accent'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <span className="text-xs font-mono font-bold text-accent block">{st.num}</span>
                <span className="text-[11px] font-bold text-text-primary block mt-1 leading-snug">
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
              <span className="text-xs font-mono text-accent font-bold">STAGE {workflowStages[activeWorkflowStage].num} DETAILS</span>
              <h3 className="text-lg font-bold text-text-primary">{workflowStages[activeWorkflowStage].title}</h3>
            </div>
            <p className="text-xs text-text-secondary max-w-md font-mono">{workflowStages[activeWorkflowStage].desc}</p>
          </div>

          {/* Stage 01 – Existing Machine Study */}
          {activeWorkflowStage === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Machine Audit', icon: '📋', detail: 'Document machine age, mechanical condition, wear points, and current cycle performance metrics.' },
                { label: 'Cycle Time Study', icon: '⏱️', detail: 'Time each manual operation phase; identify the longest bottleneck in the production cycle.' },
                { label: 'Feasibility Check', icon: '✅', detail: 'Confirm structural frame is still sound and economically worth upgrading vs full replacement.' },
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

          {/* Stage 02 – Problem Identification */}
          {activeWorkflowStage === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { problem: 'Manual Loading Fatigue', severity: 'HIGH', desc: 'Operator loading 1 part every 45 sec causes ergonomic injuries over 8-hr shifts.' },
                { problem: 'Low Throughput', severity: 'HIGH', desc: 'Manual cycle limits output to ~640 parts/shift vs automated potential of 3,200 parts/shift.' },
                { problem: 'Safety Risk', severity: 'CRITICAL', desc: 'Hands-in-die situation during manual loading creates pinch-point injury exposure.' },
                { problem: 'Inconsistent Quality', severity: 'MEDIUM', desc: 'Manual part positioning introduces misalignment causing reject rates above 4%.' },
              ].map((item) => (
                <div key={item.problem} className="p-3 bg-surface-elevated rounded-xl border border-border font-mono text-xs flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-text-primary">{item.problem}</div>
                    <div className="text-text-secondary mt-0.5">{item.desc}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    item.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  }`}>{item.severity}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stage 03 – Concept Design */}
          {activeWorkflowStage === 2 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Pneumatic Concept Layout</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
                {[
                  { comp: 'Double-Acting Cylinder', spec: '80mm bore × 150mm stroke' },
                  { comp: 'Solenoid Valve', spec: '5/2-way, 24V DC' },
                  { comp: 'Proximity Sensors', spec: 'Inductive, NPN, 2mm sensing' },
                  { comp: 'PLC Controller', spec: 'Siemens S7-1200, 8 DI/DO' },
                ].map((c) => (
                  <div key={c.comp} className="p-3 bg-background rounded-lg border border-border">
                    <div className="font-bold text-text-primary text-[11px] mb-1">{c.comp}</div>
                    <div className="text-text-secondary text-[10px]">{c.spec}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 04 – CAD Development */}
          {activeWorkflowStage === 3 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">CAD Design Deliverables</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { file: 'Cylinder Mounting Bracket', type: '3D Part .SLDPRT', icon: '🔩' },
                  { file: 'Sensor Mount Plate', type: '3D Assembly .SLDASM', icon: '📐' },
                  { file: 'Pneumatic Layout', type: 'P&ID Schematic', icon: '📊' },
                  { file: 'PLC I/O Wiring', type: 'Electrical Schematic', icon: '⚡' },
                  { file: 'Manufacturing Drawing', type: '2D DRW (ISO standard)', icon: '📄' },
                  { file: 'BOM List', type: 'Excel / ERP Entry', icon: '📋' },
                ].map((f) => (
                  <div key={f.file} className="p-3 bg-background rounded-lg border border-border">
                    <span className="text-base block mb-1">{f.icon}</span>
                    <div className="font-bold text-text-primary text-[11px]">{f.file}</div>
                    <div className="text-text-secondary text-[10px]">{f.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 05 – Component Manufacturing */}
          {activeWorkflowStage === 4 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Manufacturing Operations</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { op: 'CNC Milling', detail: 'Mounting bracket machining (Mild Steel MS plate, 12mm thick)' },
                  { op: 'Laser Cutting', detail: 'Sensor bracket profiles cut from 4mm SS304 sheet' },
                  { op: 'Pneumatic Assembly', detail: 'Cylinder, valve manifold, and air line connection assembly' },
                ].map((item) => (
                  <div key={item.op} className="p-3 bg-background rounded-lg border border-border font-mono text-xs">
                    <div className="font-bold text-accent mb-1">{item.op}</div>
                    <div className="text-text-secondary">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 06 – Installation */}
          {activeWorkflowStage === 5 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Installation Checklist</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { task: 'Mount pneumatic cylinder to machine frame', done: true },
                  { task: 'Route air lines from compressor to solenoid valve block', done: true },
                  { task: 'Wire proximity sensors to PLC digital inputs', done: true },
                  { task: 'Wire solenoid valve coil to PLC digital output', done: true },
                  { task: 'Upload PLC ladder logic program', done: true },
                  { task: 'Install safety light curtain at load zone', done: true },
                ].map((item) => (
                  <div key={item.task} className="p-3 bg-background rounded-lg border border-border font-mono text-xs flex items-center gap-2">
                    <span className={item.done ? 'text-emerald-400' : 'text-text-secondary'}>✅</span>
                    <span className="text-text-primary">{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 07 – Testing */}
          {activeWorkflowStage === 6 && (
            <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-3">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Commissioning Test Results</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { test: 'Piston stroke speed', result: '8 sec/cycle', target: '≤10 sec', pass: true },
                  { test: 'Cycle repeatability (100 runs)', result: '100% consistent', target: '≥99%', pass: true },
                  { test: 'Safety interlock (light curtain)', result: 'Stops in 12 ms', target: '≤50 ms', pass: true },
                  { test: 'Air pressure operating range', result: '5.2 bar', target: '5-6 bar', pass: true },
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
              <p className="text-[11px] text-text-secondary font-mono">All commissioning tests passed. System released for production operation.</p>
            </div>
          )}
        </div>
      </section>

      {/* BOOK INDUSTRIAL EXAMPLE SUMMARY */}
      <section className="bg-surface-elevated p-5 rounded-2xl border border-accent/30 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">BOOK — INDUSTRIAL EXAMPLE</span>
          <span className="h-px flex-1 bg-accent/20" />
        </div>
        <h2 className="text-lg font-extrabold text-text-primary">
          Manual Loading System → Semi-Automatic Pneumatic Loading System
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          The textbook uses this industrial conversion as the key retrofitting case study: an existing manual part-loading station was converted to a semi-automatic pneumatic loading system, replacing the manual lever and operator with a double-acting pneumatic cylinder controlled by a PLC.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '📉', title: 'Reduced Labor', desc: 'Single operator supervises multiple automated cells instead of manual loading one-by-one.', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
            { icon: '📈', title: 'Increased Productivity', desc: 'Cycle time drops from 45 sec (manual) to 8 sec (automated) — 460% output increase.', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/30' },
            { icon: '🛡️', title: 'Improved Safety', desc: 'Hands-in-die risk eliminated. Safety light curtains and proximity sensors protect operator zone.', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
          ].map((b) => (
            <div key={b.title} className={`p-4 rounded-xl border ${b.bg} space-y-1`}>
              <div className={`flex items-center gap-2 font-bold text-sm ${b.color}`}>
                <span>{b.icon}</span>{b.title}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RETROFITTING PRACTICAL PROJECT */}
      <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4">
          <div>
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
              BOOK CASE STUDY EXAMPLE
            </span>
            <h2 className="text-2xl font-extrabold text-text-primary">
              MANUAL LOADING → SEMI-AUTOMATIC PNEUMATIC SYSTEM
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Interactive 3D Machine Retrofit Transformation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Retrofit Demonstration Video (Default) vs Interactive 3D */}
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
                <span>Retrofit Video</span>
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

            {displayMode === '3d' && (
              <button
                onClick={() => setIsAutomated(!isAutomated)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition shadow-lg ${
                  isAutomated
                    ? 'bg-accent text-background shadow-accent/20'
                    : 'bg-red-500 text-white shadow-red-500/20'
                }`}
              >
                {isAutomated ? '⚡ MODE: RETROFITTED PNEUMATIC' : '✋ MODE: LEGACY MANUAL'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 rounded-xl overflow-hidden border border-border shadow-2xl">
            {displayMode === 'video' ? (
              <PneumaticRetrofitVideoPlayer onSwitchTo3d={() => setDisplayMode('3d')} />
            ) : (
              <div className="h-[480px]">
                <MechanicalViewer>
                  <RetrofitMachine3D isAutomated={isAutomated} activeStage={activeWorkflowStage} />
                </MechanicalViewer>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Textbook Verified Benefits
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                <div className="text-xs font-bold text-accent">📉 Reduced Labor</div>
                <p className="text-xs text-text-secondary">
                  Eliminates dedicated manual loader operator; single machinist supervises 3 automated retrofitted cells simultaneously.
                </p>
              </div>

              <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                <div className="text-xs font-bold text-accent">📈 Increased Productivity</div>
                <p className="text-xs text-text-secondary">
                  Cycle time drops from 45 seconds per part down to 8 seconds per automated stroke, boosting daily output by 460%.
                </p>
              </div>

              <div className="p-3.5 bg-surface-elevated rounded-xl border border-border space-y-1">
                <div className="text-xs font-bold text-accent">🛡️ Improved Safety</div>
                <p className="text-xs text-text-secondary">
                  Proximity sensors and dual palm buttons ensure hand isolation before double-acting cylinder extension.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
