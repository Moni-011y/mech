import React from 'react';
import GdtSymbolSvg from './GdtSymbolSvg';
import type { GdtSymbolName } from './GdtSymbolSvg';

interface CadFeatureControlFrameProps {
  symbolName: GdtSymbolName | string;
  tolerance: string;
  modifier?: 'MMC' | 'LMC' | 'RFS' | string;
  primaryDatum?: string;
  secondaryDatum?: string;
  tertiaryDatum?: string;
  diameterZone?: boolean;
  withLeader?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  highlightedCompartment?: 'symbol' | 'tolerance' | 'modifier' | 'datumA' | 'datumB' | 'datumC' | null;
}

export const CadFeatureControlFrame: React.FC<CadFeatureControlFrameProps> = ({
  symbolName,
  tolerance,
  modifier,
  primaryDatum,
  secondaryDatum,
  tertiaryDatum,
  diameterZone,
  withLeader = false,
  size = 'md',
  className = '',
  highlightedCompartment = null,
}) => {
  const isCylindrical =
    diameterZone !== undefined
      ? diameterZone
      : tolerance.includes('⌀') || tolerance.includes('Ø') || symbolName.includes('position');

  const cleanTol = tolerance.replace(/⌀|Ø/g, '').trim();

  // Size scalers
  const sizeClasses = {
    sm: {
      height: 'h-7',
      cellPadding: 'px-2 py-0.5',
      text: 'text-[11px]',
      symSize: 14,
      modSize: 'w-3.5 h-3.5 text-[9px]',
    },
    md: {
      height: 'h-9',
      cellPadding: 'px-3 py-1',
      text: 'text-xs',
      symSize: 18,
      modSize: 'w-4 h-4 text-[10px]',
    },
    lg: {
      height: 'h-11',
      cellPadding: 'px-4 py-1.5',
      text: 'text-sm',
      symSize: 22,
      modSize: 'w-5 h-5 text-xs',
    },
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono select-none ${className}`}>
      {withLeader && (
        <div className="flex items-center text-sky-400/80 mr-0.5 shrink-0">
          {/* Dimension leader line with 45° elbow and arrow */}
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="overflow-visible">
            {/* Arrowhead */}
            <polygon points="0,12 8,9 8,15" fill="#38bdf8" />
            {/* Leader horizontal and elbow line */}
            <polyline points="7,12 18,12 28,12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="27" cy="12" r="1.5" fill="#38bdf8" />
          </svg>
        </div>
      )}

      {/* Main Feature Control Frame (FCF) Box */}
      <div
        className={`inline-flex items-stretch border-2 border-slate-300 dark:border-sky-400 bg-slate-900/90 shadow-md backdrop-blur rounded-[2px] overflow-hidden ${sizeClasses.height}`}
        style={{
          boxShadow: '0 0 12px rgba(56, 189, 248, 0.15)',
        }}
      >
        {/* Compartment 1: Geometric Characteristic Symbol */}
        <div
          title="Geometric Characteristic Symbol"
          className={`flex items-center justify-center border-r-2 border-slate-300 dark:border-sky-400/80 bg-slate-950/70 transition-colors ${sizeClasses.cellPadding} ${
            highlightedCompartment === 'symbol' ? 'bg-sky-500/30 ring-2 ring-sky-400' : ''
          }`}
        >
          <GdtSymbolSvg
            name={symbolName}
            size={sizeClasses.symSize}
            color="#38bdf8"
            strokeWidth={2.2}
          />
        </div>

        {/* Compartment 2: Tolerance Value & Modifiers */}
        <div
          title="Tolerance Value & Zone"
          className={`flex items-center justify-center gap-1 border-r-2 border-slate-300 dark:border-sky-400/80 px-2.5 font-bold tracking-tight text-white transition-colors ${
            highlightedCompartment === 'tolerance' ? 'bg-sky-500/30 ring-2 ring-sky-400' : ''
          }`}
        >
          {isCylindrical && (
            <span className="text-sky-300 font-bold" title="Cylindrical (Diameter) Zone">
              ⌀
            </span>
          )}
          <span className={sizeClasses.text}>{cleanTol}</span>

          {modifier && modifier !== 'RFS' && (
            <span
              title={`Material Condition: ${modifier === 'MMC' ? 'Maximum Material Condition (MMC)' : 'Least Material Condition (LMC)'}`}
              className={`inline-flex items-center justify-center rounded-full border border-sky-400 bg-sky-500/20 font-black text-sky-200 ml-0.5 ${sizeClasses.modSize}`}
            >
              {modifier === 'MMC' ? 'M' : modifier === 'LMC' ? 'L' : modifier[0]}
            </span>
          )}
        </div>

        {/* Compartment 3: Primary Datum Reference */}
        {primaryDatum && (
          <div
            title="Primary Datum Reference"
            className={`flex items-center justify-center font-bold text-amber-300 ${primaryDatum && (secondaryDatum || tertiaryDatum) ? 'border-r-2 border-slate-300 dark:border-sky-400/80' : ''} ${sizeClasses.cellPadding} ${
              highlightedCompartment === 'datumA' ? 'bg-amber-500/30 ring-2 ring-amber-400' : ''
            }`}
          >
            <span className={sizeClasses.text}>{primaryDatum}</span>
          </div>
        )}

        {/* Compartment 4: Secondary Datum Reference */}
        {secondaryDatum && (
          <div
            title="Secondary Datum Reference"
            className={`flex items-center justify-center font-bold text-amber-300 ${tertiaryDatum ? 'border-r-2 border-slate-300 dark:border-sky-400/80' : ''} ${sizeClasses.cellPadding} ${
              highlightedCompartment === 'datumB' ? 'bg-amber-500/30 ring-2 ring-amber-400' : ''
            }`}
          >
            <span className={sizeClasses.text}>{secondaryDatum}</span>
          </div>
        )}

        {/* Compartment 5: Tertiary Datum Reference */}
        {tertiaryDatum && (
          <div
            title="Tertiary Datum Reference"
            className={`flex items-center justify-center font-bold text-amber-300 ${sizeClasses.cellPadding} ${
              highlightedCompartment === 'datumC' ? 'bg-amber-500/30 ring-2 ring-amber-400' : ''
            }`}
          >
            <span className={sizeClasses.text}>{tertiaryDatum}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadFeatureControlFrame;
