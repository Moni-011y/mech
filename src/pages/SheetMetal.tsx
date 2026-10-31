import { Link } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';

export default function SheetMetal() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full p-6 my-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Module Under Active Development
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
          Sheet Metal Design & Fabrication Lab
        </h1>

        <p className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
          Interactive Bend Allowance, K-Factor calculations, Sheet Unfolding, Edge Flange design, and Punching Tool pattern visualizer coming in the next release.
        </p>

        <div className="p-6 bg-surface rounded-xl border border-border max-w-md mx-auto space-y-3 font-mono text-xs text-left">
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-text-secondary">Planned Feature</span>
            <span className="text-accent font-bold">K-Factor Calculator</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-text-secondary">Bend Radius Calculation</span>
            <span className="text-accent font-bold">BA = π(R + K×T) × (A/180)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">3D Unfolded Flat Pattern</span>
            <span className="text-accent-bright font-bold">WebGL Preview</span>
          </div>
        </div>

        <div className="pt-4">
          <Link
            to="/gear-lab"
            className="px-6 py-3 bg-accent text-background font-bold text-sm rounded-xl hover:bg-accent-bright transition shadow-lg shadow-accent/20 inline-flex items-center gap-2"
          >
            Explore 3D Gear Lab Instead →
          </Link>
        </div>
      </main>
    </div>
  );
}
