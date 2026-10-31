import { useState, useMemo } from 'react';
import Navbar from '../components/Navigation/Navbar';
import MechanicalViewer from '../components/MechanicalViewer/MechanicalViewer';
import Gdt3dSymbolCanvas from '../components/Gdt/Gdt3dSymbolCanvas';
import GdtSymbolSvg from '../components/Gdt/GdtSymbolSvg';
import CadFeatureControlFrame from '../components/Gdt/CadFeatureControlFrame';

export default function GdtLab() {
  const [characteristic, setCharacteristic] = useState('Position');
  const [toleranceVal, setToleranceVal] = useState(0.05);
  const [modifier, setModifier] = useState('MMC');
  const [datumA, setDatumA] = useState('A');
  const [datumB, setDatumB] = useState('B');
  const [datumC, setDatumC] = useState('C');
  const [featureSize, setFeatureSize] = useState(10.02);
  const [mmcSize] = useState(10.00);
  const [lmcSize] = useState(10.15);

  // Calculate Bonus Tolerance & Virtual Condition
  const bonusTolerance = useMemo(() => {
    if (modifier === 'MMC') {
      return Math.max(0, featureSize - mmcSize);
    } else if (modifier === 'LMC') {
      return Math.max(0, lmcSize - featureSize);
    }
    return 0;
  }, [modifier, featureSize, mmcSize, lmcSize]);

  const totalAllowedTolerance = toleranceVal + bonusTolerance;
  const virtualCondition = mmcSize - toleranceVal;

  const symbols: Record<string, string> = {
    Position: '⌖',
    Flatness: '⏛',
    Perpendicularity: '⟂',
    Parallelism: '⫽',
    Cylindricity: '⌭',
    Concentricity: '◎',
  };

  const datumsList = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary overflow-hidden">
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 sm:w-96 bg-surface border-r border-border p-4 overflow-y-auto flex flex-col gap-6 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Geometric Control Select
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.keys(symbols).map((key) => (
                <button
                  key={key}
                  onClick={() => setCharacteristic(key)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2.5 transition ${
                    characteristic === key
                      ? 'bg-accent text-background border-accent shadow-md shadow-accent/20'
                      : 'bg-surface-elevated border-border text-text-primary hover:border-accent/40'
                  }`}
                >
                  <GdtSymbolSvg
                    name={key.toLowerCase()}
                    size={18}
                    color={characteristic === key ? '#060a12' : '#38bdf8'}
                    strokeWidth={2.4}
                  />
                  <span>{key}</span>
                </button>
              ))}
            </div>

            {/* 3D Animated Symbol Preview */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-2 flex items-center justify-between">
                <span>3D Animated Symbol</span>
                <span className="text-[10px] text-sky-400 font-mono">3D WebGL</span>
              </label>
              <Gdt3dSymbolCanvas
                symbolId={characteristic.toLowerCase()}
                materialPreset="titanium"
                autoRotate={true}
                showToleranceZone={true}
                className="w-full h-44 rounded-xl border border-border"
              />
            </div>

            {/* Feature Control Frame (FCF) Preview */}
            <div className="bg-surface-elevated p-4 rounded-xl border border-border shadow-inner my-4">
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                Live Feature Control Frame (FCF)
              </label>
              <div className="pt-1 flex justify-start">
                <CadFeatureControlFrame
                  symbolName={characteristic.toLowerCase()}
                  tolerance={`⌀${toleranceVal.toFixed(2)}`}
                  modifier={modifier}
                  primaryDatum={datumA}
                  secondaryDatum={datumB}
                  tertiaryDatum={datumC}
                  size="md"
                />
              </div>
            </div>

            {/* Datum Reference Frame Selectors */}
            <div className="grid grid-cols-3 gap-2 my-2">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Primary Datum</label>
                <select
                  value={datumA}
                  onChange={(e) => setDatumA(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-xs"
                >
                  {datumsList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Secondary Datum</label>
                <select
                  value={datumB}
                  onChange={(e) => setDatumB(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-xs"
                >
                  {datumsList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Tertiary Datum</label>
                <select
                  value={datumC}
                  onChange={(e) => setDatumC(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-xs"
                >
                  {datumsList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-3 mt-4">
              <div className="bg-surface-elevated/50 p-3 rounded-lg border border-border/50 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Specified Geometric Tolerance</span>
                  <span className="text-accent font-mono">⌀{toleranceVal.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={toleranceVal}
                  onChange={(e) => setToleranceVal(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              <div className="bg-surface-elevated/50 p-3 rounded-lg border border-border/50">
                <label className="block text-xs font-semibold mb-1">Material Condition Modifier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['MMC', 'LMC', 'RFS'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setModifier(m)}
                      className={`py-1 rounded text-xs font-bold border transition ${
                        modifier === m
                          ? 'bg-accent text-background border-accent'
                          : 'bg-surface border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface-elevated/50 p-3 rounded-lg border border-border/50 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Produced Feature Size</span>
                  <span className="text-accent font-mono">{featureSize.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min={mmcSize}
                  max={lmcSize}
                  step={0.01}
                  value={featureSize}
                  onChange={(e) => setFeatureSize(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </div>

          {/* Tolerance Calculations */}
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-bright"></span>
              Tolerance Boundary Analysis
            </h2>
            <div className="bg-surface-elevated/40 rounded-lg p-3 border border-border space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">MMC Size Limit (Hole)</span>
                <span className="text-text-primary font-bold">{mmcSize.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">LMC Size Limit (Hole)</span>
                <span className="text-text-primary font-bold">{lmcSize.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Bonus Tolerance ({modifier})</span>
                <span className="text-accent font-bold">+{bonusTolerance.toFixed(3)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Total Permissible Tolerance</span>
                <span className="text-accent-bright font-bold">⌀{totalAllowedTolerance.toFixed(3)} mm</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Virtual Condition (VC)</span>
                <span className="text-text-primary font-bold">{virtualCondition.toFixed(2)} mm</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 3D Tolerance Zone Preview */}
        <main className="flex-1 p-4 bg-background overflow-hidden relative">
          <MechanicalViewer>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[20, 10, 20]} />
              <meshStandardMaterial color="#20262E" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Cylinder Hole Representing Feature */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[featureSize / 2, featureSize / 2, 10.2, 32]} />
              <meshStandardMaterial color="#16B8A6" transparent opacity={0.6} />
            </mesh>
            {/* Cylindrical Tolerance Zone Wireframe */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[totalAllowedTolerance / 2 + 1, totalAllowedTolerance / 2 + 1, 10.4, 32]} />
              <meshStandardMaterial color="#2DD4BF" wireframe />
            </mesh>
          </MechanicalViewer>
        </main>
      </div>
    </div>
  );
}
