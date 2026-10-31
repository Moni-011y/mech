import Navbar from '../components/Navigation/Navbar';
import MechanicalViewer from '../components/MechanicalViewer/MechanicalViewer';
import GearMesh from '../components/Gear/GearMesh';
import { useGearStore } from '../store/gearStore';
import {
  calculatePitchDiameter,
  calculateOutsideDiameter,
  calculateDedendum,
  calculateRootDiameter,
  calculateCircularPitch,
  calculateToothThickness,
  calculateGearRatio,
  calculateDrivenSpeed,
} from '../utils/engineering/gearCalculations';

export default function GearLab() {
  const {
    teeth,
    module,
    pressureAngle,
    bore,
    faceWidth,
    setTeeth,
    setModule,
    setPressureAngle,
    setBore,
    setFaceWidth,
  } = useGearStore();

  // Derived engineering metrics
  const pitchDiameter = calculatePitchDiameter(module, teeth);
  const outsideDiameter = calculateOutsideDiameter(pitchDiameter, module);
  const dedendum = calculateDedendum(module);
  const rootDiameter = calculateRootDiameter(pitchDiameter, dedendum);
  const circularPitch = calculateCircularPitch(module);
  const toothThickness = calculateToothThickness(circularPitch);

  const driverTeeth = 20;
  const driverRPM = 1500;
  const gearRatio = calculateGearRatio(driverTeeth, teeth);
  const drivenRPM = calculateDrivenSpeed(driverRPM, driverTeeth, teeth);

  const controlSlider = (
    label: string,
    value: number,
    setter: (v: number) => void,
    min: number,
    max: number,
    step = 1,
    unit = 'mm'
  ) => (
    <div className="space-y-1.5 bg-surface-elevated/50 p-3 rounded-lg border border-border/50">
      <div className="flex justify-between items-center text-xs font-semibold text-text-primary">
        <span>{label}</span>
        <span className="font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setter(Number(e.target.value))}
        className="w-full accent-accent bg-surface cursor-pointer"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary overflow-hidden">
      <Navbar />

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls & Metrics */}
        <aside className="w-80 sm:w-96 bg-surface border-r border-border p-4 overflow-y-auto flex flex-col gap-6 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Geometric Parameters
            </h2>
            <div className="space-y-3">
              {controlSlider('Teeth Count (Z)', teeth, setTeeth, 10, 120, 1, '')}
              {controlSlider('Module (m)', module, setModule, 0.5, 10, 0.1, 'mm')}
              {controlSlider('Pressure Angle (α)', pressureAngle, setPressureAngle, 10, 30, 1, '°')}
              {controlSlider('Central Bore (d_b)', bore, setBore, 5, 30, 1, 'mm')}
              {controlSlider('Face Width (b)', faceWidth, setFaceWidth, 5, 50, 1, 'mm')}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-bright"></span>
              Computed Metrics
            </h2>
            <div className="bg-surface-elevated/40 rounded-lg p-3 border border-border space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Pitch Diameter (d)</span>
                <span className="text-text-primary font-bold">{pitchDiameter.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Outside Diameter (d_a)</span>
                <span className="text-text-primary font-bold">{outsideDiameter.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Root Diameter (d_f)</span>
                <span className="text-text-primary font-bold">{rootDiameter.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Circular Pitch (p)</span>
                <span className="text-text-primary font-bold">{circularPitch.toFixed(3)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Tooth Thickness (s)</span>
                <span className="text-text-primary font-bold">{toothThickness.toFixed(3)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-text-secondary">Gear Ratio (20T driver)</span>
                <span className="text-accent font-bold">{gearRatio.toFixed(3)} : 1</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Driven Speed (1500 RPM)</span>
                <span className="text-accent font-bold">{drivenRPM.toFixed(1)} RPM</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right 3D Viewport */}
        <main className="flex-1 p-4 bg-background overflow-hidden relative">
          <MechanicalViewer>
            <GearMesh />
          </MechanicalViewer>
        </main>
      </div>
    </div>
  );
}
