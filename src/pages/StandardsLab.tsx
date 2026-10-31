import { useState } from 'react';
import Navbar from '../components/Navigation/Navbar';

const THREADS = [
  { size: 'M3 x 0.5', pitch: 0.5, tapDrill: 2.5, clearanceFine: 3.2, clearanceMedium: 3.4 },
  { size: 'M4 x 0.7', pitch: 0.7, tapDrill: 3.3, clearanceFine: 4.3, clearanceMedium: 4.5 },
  { size: 'M5 x 0.8', pitch: 0.8, tapDrill: 4.2, clearanceFine: 5.3, clearanceMedium: 5.5 },
  { size: 'M6 x 1.0', pitch: 1.0, tapDrill: 5.0, clearanceFine: 6.4, clearanceMedium: 6.6 },
  { size: 'M8 x 1.25', pitch: 1.25, tapDrill: 6.8, clearanceFine: 8.4, clearanceMedium: 9.0 },
  { size: 'M10 x 1.5', pitch: 1.5, tapDrill: 8.5, clearanceFine: 10.5, clearanceMedium: 11.0 },
  { size: 'M12 x 1.75', pitch: 1.75, tapDrill: 10.2, clearanceFine: 13.0, clearanceMedium: 13.5 },
  { size: 'M16 x 2.0', pitch: 2.0, tapDrill: 14.0, clearanceFine: 17.0, clearanceMedium: 17.5 },
];

export default function StandardsLab() {
  const [nominalDia, setNominalDia] = useState(25);
  const [fitType, setFitType] = useState('H7/g6 (Locational Clearance)');

  const fits: Record<string, { holeMin: number; holeMax: number; shaftMin: number; shaftMax: number; category: string }> = {
    'H7/g6 (Locational Clearance)': { holeMin: 0, holeMax: 0.021, shaftMin: -0.02, shaftMax: -0.007, category: 'Clearance Fit' },
    'H7/h6 (Sliding Fit)': { holeMin: 0, holeMax: 0.021, shaftMin: -0.013, shaftMax: 0, category: 'Clearance Fit' },
    'H7/k6 (Transition Fit)': { holeMin: 0, holeMax: 0.021, shaftMin: 0.002, shaftMax: 0.015, category: 'Transition Fit' },
    'H7/p6 (Interference Press Fit)': { holeMin: 0, holeMax: 0.021, shaftMin: 0.022, shaftMax: 0.035, category: 'Interference Fit' },
  };

  const selectedFit = fits[fitType] || fits['H7/g6 (Locational Clearance)'];

  const holeMinDim = nominalDia + selectedFit.holeMin;
  const holeMaxDim = nominalDia + selectedFit.holeMax;
  const shaftMinDim = nominalDia + selectedFit.shaftMin;
  const shaftMaxDim = nominalDia + selectedFit.shaftMax;

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8 flex-1">
        {/* ISO Fits Calculator */}
        <section className="bg-surface p-6 rounded-xl border border-border space-y-4 shadow">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
              ISO 286 Fits & Limits Calculator
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded bg-accent/10 text-accent border border-accent/20">
              {selectedFit.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Nominal Diameter (mm)</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={nominalDia}
                  onChange={(e) => setNominalDia(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm text-text-primary focus:border-accent outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Fit Designation</label>
                <select
                  value={fitType}
                  onChange={(e) => setFitType(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm text-text-primary focus:border-accent outline-none"
                >
                  {Object.keys(fits).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-surface-elevated/60 p-4 rounded-xl border border-border space-y-3 font-mono text-sm">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-secondary">Hole Tolerance Limits</span>
                <span className="text-accent font-bold">⌀{holeMinDim.toFixed(3)} / ⌀{holeMaxDim.toFixed(3)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-secondary">Shaft Tolerance Limits</span>
                <span className="text-accent-bright font-bold">⌀{shaftMinDim.toFixed(3)} / ⌀{shaftMaxDim.toFixed(3)} mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-secondary">Max Clearance / Interference</span>
                <span className="text-text-primary font-bold">
                  {((holeMaxDim - shaftMinDim) * 1000).toFixed(1)} µm
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Min Clearance / Interference</span>
                <span className="text-text-primary font-bold">
                  {((holeMinDim - shaftMaxDim) * 1000).toFixed(1)} µm
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Metric Fastener Reference Table */}
        <section className="bg-surface p-6 rounded-xl border border-border space-y-4 shadow">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-bright"></span>
            ISO Metric Thread Fastener Reference
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated text-xs font-bold text-text-secondary uppercase border-b border-border">
                <tr>
                  <th className="py-3 px-4">Thread Designation</th>
                  <th className="py-3 px-4">Pitch (mm)</th>
                  <th className="py-3 px-4">Tap Drill Dia. (mm)</th>
                  <th className="py-3 px-4">Clearance Hole (Fine)</th>
                  <th className="py-3 px-4">Clearance Hole (Medium)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {THREADS.map((t, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/30 transition">
                    <td className="py-2.5 px-4 font-bold text-text-primary">{t.size}</td>
                    <td className="py-2.5 px-4 text-text-secondary">{t.pitch} mm</td>
                    <td className="py-2.5 px-4 text-accent font-bold">⌀{t.tapDrill.toFixed(2)} mm</td>
                    <td className="py-2.5 px-4 text-text-primary">⌀{t.clearanceFine.toFixed(1)} mm</td>
                    <td className="py-2.5 px-4 text-text-primary">⌀{t.clearanceMedium.toFixed(1)} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
