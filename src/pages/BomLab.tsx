import { useState, useMemo } from 'react';
import Navbar from '../components/Navigation/Navbar';

interface PartItem {
  id: string;
  name: string;
  material: string;
  quantity: number;
  volumeCm3: number;
  process: string;
}

const MATERIALS: Record<string, { density: number; costPerKg: number }> = {
  'Aluminum 6061-T6': { density: 2.7, costPerKg: 4.5 },
  'Steel AISI 1045': { density: 7.85, costPerKg: 1.8 },
  'Stainless Steel 304': { density: 8.0, costPerKg: 5.2 },
  'Brass C36000': { density: 8.5, costPerKg: 7.0 },
  'Titanium Gr5': { density: 4.43, costPerKg: 35.0 },
};

const PROCESSES: Record<string, number> = {
  'CNC Milling': 45.0,
  'CNC Turning': 35.0,
  'Laser Cutting': 25.0,
  '3D Printing (SLS)': 60.0,
};

export default function BomLab() {
  const [parts, setParts] = useState<PartItem[]>([
    { id: '1', name: 'Drive Shaft', material: 'Steel AISI 1045', quantity: 2, volumeCm3: 150, process: 'CNC Turning' },
    { id: '2', name: 'Spur Gear Z=40', material: 'Stainless Steel 304', quantity: 4, volumeCm3: 85, process: 'CNC Milling' },
    { id: '3', name: 'Housing Bracket', material: 'Aluminum 6061-T6', quantity: 1, volumeCm3: 320, process: 'CNC Milling' },
  ]);

  const [newName, setNewName] = useState('');
  const [newMat, setNewMat] = useState('Aluminum 6061-T6');
  const [newQty, setNewQty] = useState(1);
  const [newVol, setNewVol] = useState(100);
  const [newProcess, setNewProcess] = useState('CNC Milling');

  const addPart = () => {
    if (!newName.trim()) return;
    const item: PartItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      material: newMat,
      quantity: newQty,
      volumeCm3: newVol,
      process: newProcess,
    };
    setParts([...parts, item]);
    setNewName('');
  };

  const removePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const summary = useMemo(() => {
    let totalMassKg = 0;
    let totalMaterialCost = 0;
    let totalMfgCost = 0;

    parts.forEach((p) => {
      const mat = MATERIALS[p.material] || MATERIALS['Steel AISI 1045'];
      const massPerUnitKg = (p.volumeCm3 * mat.density) / 1000;
      const matCost = massPerUnitKg * mat.costPerKg * p.quantity;
      const mfgRate = PROCESSES[p.process] || 40;
      const mfgCost = (massPerUnitKg * 2.5 + mfgRate * 0.2) * p.quantity;

      totalMassKg += massPerUnitKg * p.quantity;
      totalMaterialCost += matCost;
      totalMfgCost += mfgCost;
    });

    return {
      totalMassKg,
      totalMaterialCost,
      totalMfgCost,
      totalEstCost: totalMaterialCost + totalMfgCost,
    };
  }, [parts]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-surface rounded-xl border border-border">
            <span className="text-xs font-semibold text-text-secondary uppercase">Total Components</span>
            <div className="text-2xl font-bold text-text-primary mt-1">
              {parts.reduce((acc, p) => acc + p.quantity, 0)} pcs
            </div>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border">
            <span className="text-xs font-semibold text-text-secondary uppercase">Total Assembly Weight</span>
            <div className="text-2xl font-bold text-accent mt-1">
              {summary.totalMassKg.toFixed(2)} kg
            </div>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border">
            <span className="text-xs font-semibold text-text-secondary uppercase">Raw Material Cost</span>
            <div className="text-2xl font-bold text-text-primary mt-1">
              ${summary.totalMaterialCost.toFixed(2)}
            </div>
          </div>
          <div className="p-4 bg-surface-elevated rounded-xl border border-accent/40 shadow-lg shadow-accent/10">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Est. Production Cost</span>
            <div className="text-3xl font-extrabold text-accent-bright mt-1">
              ${summary.totalEstCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Add Component Form */}
        <div className="bg-surface p-4 rounded-xl border border-border space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Add Part to Bill of Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Part Name</label>
              <input
                type="text"
                placeholder="e.g. Pinion Shaft"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Material</label>
              <select
                value={newMat}
                onChange={(e) => setNewMat(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:border-accent outline-none"
              >
                {Object.keys(MATERIALS).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Volume (cm³)</label>
              <input
                type="number"
                value={newVol}
                onChange={(e) => setNewVol(Number(e.target.value))}
                className="w-full bg-surface-elevated border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Manufacturing Process</label>
              <select
                value={newProcess}
                onChange={(e) => setNewProcess(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:border-accent outline-none"
              >
                {Object.keys(PROCESSES).map((proc) => (
                  <option key={proc} value={proc}>{proc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={newQty}
                onChange={(e) => setNewQty(Number(e.target.value))}
                className="w-full bg-surface-elevated border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:border-accent outline-none"
              />
            </div>
            <button
              onClick={addPart}
              className="w-full bg-accent hover:bg-accent-bright font-bold text-background py-2 rounded text-sm transition shadow"
            >
              + Add Part
            </button>
          </div>
        </div>

        {/* Part List Table */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-elevated text-xs font-bold text-text-secondary uppercase border-b border-border">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Unit Vol.</th>
                <th className="py-3 px-4">Unit Weight</th>
                <th className="py-3 px-4">Mfg Process</th>
                <th className="py-3 px-4">Est. Unit Cost</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {parts.map((p) => {
                const mat = MATERIALS[p.material] || MATERIALS['Steel AISI 1045'];
                const weight = (p.volumeCm3 * mat.density) / 1000;
                const matCost = weight * mat.costPerKg;
                const mfgRate = PROCESSES[p.process] || 40;
                const unitCost = matCost + (weight * 2.5 + mfgRate * 0.2);

                return (
                  <tr key={p.id} className="hover:bg-surface-elevated/30 transition">
                    <td className="py-3 px-4 font-semibold text-text-primary">{p.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{p.material}</td>
                    <td className="py-3 px-4 font-mono">{p.quantity}</td>
                    <td className="py-3 px-4 font-mono">{p.volumeCm3} cm³</td>
                    <td className="py-3 px-4 font-mono text-accent">{weight.toFixed(3)} kg</td>
                    <td className="py-3 px-4 text-text-secondary">{p.process}</td>
                    <td className="py-3 px-4 font-mono font-bold text-accent">${unitCost.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => removePart(p.id)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
