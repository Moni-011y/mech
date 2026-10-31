import React from 'react';

export type GdtSymbolName =
  | 'straightness'
  | 'flatness'
  | 'circularity'
  | 'cylindricity'
  | 'profile-line'
  | 'profile-surface'
  | 'parallelism'
  | 'perpendicularity'
  | 'angularity'
  | 'position'
  | 'concentricity'
  | 'symmetry'
  | 'circular-runout'
  | 'total-runout';

interface GdtSymbolSvgProps {
  name: GdtSymbolName | string;
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

/**
 * Standard ASME Y14.5 / ISO 1101 Vector GD&T Symbols
 * Precision vector paths designed with authentic CAD proportions.
 */
export const GdtSymbolSvg: React.FC<GdtSymbolSvgProps> = ({
  name,
  size = 28,
  className = '',
  color = 'currentColor',
  strokeWidth = 2,
}) => {
  const norm = name.toLowerCase().trim();

  // 1. STRAIGHTNESS: Horizontal line ─
  if (norm === 'straightness' || norm === 'straight') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        <line x1="4" y1="16" x2="28" y2="16" />
      </svg>
    );
  }

  // 2. FLATNESS: Parallelogram ▱
  if (norm === 'flatness' || norm === 'flat') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      >
        <polygon points="10,8 28,8 22,24 4,24" />
      </svg>
    );
  }

  // 3. CIRCULARITY / ROUNDNESS: Circle ○
  if (norm === 'circularity' || norm === 'roundness' || norm === 'circular') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      >
        <circle cx="16" cy="16" r="10" />
      </svg>
    );
  }

  // 4. CYLINDRICITY: Circle bounded by two tangent angled lines ⌭
  if (norm === 'cylindricity' || norm === 'cylindric') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        {/* Central circle */}
        <circle cx="16" cy="16" r="8" />
        {/* Left tangent inclined line */}
        <line x1="11" y1="5" x2="5" y2="27" />
        {/* Right tangent inclined line */}
        <line x1="27" y1="5" x2="21" y2="27" />
      </svg>
    );
  }

  // 5. PROFILE OF A LINE: Open curved arc ⌒
  if (norm === 'profile-line' || norm === 'profile_of_a_line' || norm === 'profile-of-a-line') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        <path d="M 5,23 A 11,11 0 0,1 27,23" />
      </svg>
    );
  }

  // 6. PROFILE OF A SURFACE: Semicircle with closed baseline ⌓
  if (norm === 'profile-surface' || norm === 'profile_of_a_surface' || norm === 'profile-of-a-surface') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 5,23 A 11,11 0 0,1 27,23 Z" />
      </svg>
    );
  }

  // 7. PARALLELISM: Two slanted parallel lines ∥
  if (norm === 'parallelism' || norm === 'parallel') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        <line x1="13" y1="6" x2="7" y2="26" />
        <line x1="25" y1="6" x2="19" y2="26" />
      </svg>
    );
  }

  // 8. PERPENDICULARITY: Inverted T ⊥
  if (norm === 'perpendicularity' || norm === 'perpendicular') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        {/* Horizontal baseline */}
        <line x1="5" y1="24" x2="27" y2="24" />
        {/* Vertical perpendicular stem */}
        <line x1="16" y1="24" x2="16" y2="7" />
      </svg>
    );
  }

  // 9. ANGULARITY: Acute angle ∠
  if (norm === 'angularity' || norm === 'angular') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="26,10 7,24 27,24" />
      </svg>
    );
  }

  // 10. POSITION / TRUE POSITION: Circle with crosshairs extending through ⌖
  if (norm === 'position' || norm === 'true-position' || norm === 'true_position') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        <circle cx="16" cy="16" r="9" />
        <line x1="3" y1="16" x2="29" y2="16" />
        <line x1="16" y1="3" x2="16" y2="29" />
      </svg>
    );
  }

  // 11. CONCENTRICITY: Two concentric circles ◎
  if (norm === 'concentricity' || norm === 'concentric') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      >
        <circle cx="16" cy="16" r="11" />
        <circle cx="16" cy="16" r="5.5" />
      </svg>
    );
  }

  // 12. SYMMETRY: Three horizontal lines with center emphasis ⌯
  if (norm === 'symmetry' || norm === 'symmetric') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        {/* Center long line */}
        <line x1="4" y1="16" x2="28" y2="16" />
        {/* Top short line */}
        <line x1="9" y1="10" x2="23" y2="10" />
        {/* Bottom short line */}
        <line x1="9" y1="22" x2="23" y2="22" />
      </svg>
    );
  }

  // 13. CIRCULAR RUNOUT: Single 45° arrow pointing up-right ↗
  if (norm === 'circular-runout' || norm === 'circular_runout' || norm === 'runout') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Arrow shaft */}
        <line x1="8" y1="24" x2="23" y2="9" />
        {/* Arrowhead */}
        <polyline points="14,9 23,9 23,18" />
      </svg>
    );
  }

  // 14. TOTAL RUNOUT: Two parallel 45° arrows joined at baseline ⇗
  if (norm === 'total-runout' || norm === 'total_runout') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Baseline connecting the two arrows */}
        <line x1="6" y1="25" x2="14" y2="25" />
        {/* Left arrow */}
        <line x1="7" y1="25" x2="18" y2="14" />
        <polyline points="12,14 18,14 18,20" />
        {/* Right arrow */}
        <line x1="13" y1="25" x2="24" y2="14" />
        <polyline points="18,14 24,14 24,20" />
      </svg>
    );
  }

  // Fallback circle
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    >
      <circle cx="16" cy="16" r="10" />
    </svg>
  );
};

export default GdtSymbolSvg;
