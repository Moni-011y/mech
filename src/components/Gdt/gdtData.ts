import type { GdtSymbolName } from './GdtSymbolSvg';

export type GdtCategory = 'FORM' | 'PROFILE' | 'ORIENTATION' | 'LOCATION' | 'RUNOUT';

export interface GdtSymbolCardData {
  id: string;
  svgName: GdtSymbolName;
  unicodeChar: string;
  name: string;
  category: GdtCategory;
  categoryLabel: string;
  categoryNumber: number;
  symbolNumber: number;
  whatItControls: string;
  simpleExplanation: string;
  typicalApplication: string[];
  exampleTolerance: string;
  datumRequired: boolean;
  datumRequirementText: string;
  featureControlFrame: {
    symbol: string;
    tolerance: string;
    modifier?: 'MMC' | 'LMC' | 'RFS';
    primaryDatum?: string;
    secondaryDatum?: string;
    tertiaryDatum?: string;
    description: string;
  };
  deepDive: {
    toleranceZone: string;
    inspectionMethod: string;
    cadCalloutGuide: string;
    keyTakeaway: string;
    asmeStandard: string;
  };
}

export const GDT_CATEGORIES_METADATA: Record<
  GdtCategory,
  {
    name: string;
    code: GdtCategory;
    color: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accentGlow: string;
    description: string;
    requiresDatumSummary: string;
  }
> = {
  FORM: {
    name: 'Form Controls',
    code: 'FORM',
    color: '#14b8a6', // Teal
    border: 'border-teal-500/30 hover:border-teal-400',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-300',
    accentGlow: 'rgba(20, 184, 166, 0.25)',
    description: 'Controls the shape of an individual feature without requiring a datum reference.',
    requiresDatumSummary: 'No Datum Allowed (Self-referencing feature form)',
  },
  PROFILE: {
    name: 'Profile Controls',
    code: 'PROFILE',
    color: '#6366f1', // Indigo
    border: 'border-indigo-500/30 hover:border-indigo-400',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-300',
    accentGlow: 'rgba(99, 102, 241, 0.25)',
    description: 'Controls 2D contours and 3D complex surfaces within an offset uniform tolerance boundary.',
    requiresDatumSummary: 'Datum Optional (Can reference datums for orientation/location)',
  },
  ORIENTATION: {
    name: 'Orientation Controls',
    code: 'ORIENTATION',
    color: '#f59e0b', // Amber
    border: 'border-amber-500/30 hover:border-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300',
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    description: 'Controls the angular relationship between features relative to one or more datum reference planes or axes.',
    requiresDatumSummary: 'Datum Reference Strictly Required',
  },
  LOCATION: {
    name: 'Location Controls',
    code: 'LOCATION',
    color: '#ec4899', // Pink / Rose
    border: 'border-pink-500/30 hover:border-pink-400',
    badgeBg: 'bg-pink-500/10',
    badgeText: 'text-pink-300',
    accentGlow: 'rgba(236, 72, 153, 0.25)',
    description: 'Controls the exact position, concentricity, or symmetry of features relative to a datum reference frame.',
    requiresDatumSummary: 'Datum Reference Strictly Required (A, B, C)',
  },
  RUNOUT: {
    name: 'Runout Controls',
    code: 'RUNOUT',
    color: '#f97316', // Orange
    border: 'border-orange-500/30 hover:border-orange-400',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-300',
    accentGlow: 'rgba(249, 115, 22, 0.25)',
    description: 'Controls the composite variation of surface elements during 360° rotation about a datum axis.',
    requiresDatumSummary: 'Datum Axis Strictly Required (A or A-B coaxial)',
  },
};

export const GDT_SYMBOLS_DATA: GdtSymbolCardData[] = [
  // ── 1. FORM CONTROLS ──
  {
    id: 'straightness',
    svgName: 'straightness',
    unicodeChar: '─',
    name: 'Straightness',
    category: 'FORM',
    categoryLabel: 'Form Controls',
    categoryNumber: 1,
    symbolNumber: 1,
    whatItControls: 'Controls how straight a feature (shaft, edge, or derived axis) must be.',
    simpleExplanation:
      'Form control that controls how straight a feature must be without requiring a datum reference. When applied to a surface, each line element must lie between two parallel lines. When applied to an axis, the derived median line must lie inside a cylindrical zone.',
    typicalApplication: ['Shafts', 'Precision Edges', 'Linear Guides', 'Piston Pins', 'Axis Alignment'],
    exampleTolerance: 'Straightness tolerance = 0.02 mm',
    datumRequired: false,
    datumRequirementText: 'No Datum Required (Self-contained Form Control)',
    featureControlFrame: {
      symbol: '─',
      tolerance: '0.02',
      description: 'Each line element of the indicated surface must lie between two parallel straight lines spaced 0.02 mm apart.',
    },
    deepDive: {
      toleranceZone: 'Two parallel lines 0.02 mm apart (surface line elements) OR a cylinder Ø0.02 mm (derived median axis).',
      inspectionMethod: 'Straight edge with feeler gauges, dial test indicator along a precision granite surface plate, or laser scanning.',
      cadCalloutGuide: 'Placed directly on a surface line in a profile view, or attached below a diameter dimension for axis straightness (RFS/MMC).',
      keyTakeaway: 'Straightness controls individual 2D line elements; it does not control overall flatness or twist.',
      asmeStandard: 'ASME Y14.5-2018 Section 8.2 / ISO 1101',
    },
  },
  {
    id: 'flatness',
    svgName: 'flatness',
    unicodeChar: '▱',
    name: 'Flatness',
    category: 'FORM',
    categoryLabel: 'Form Controls',
    categoryNumber: 1,
    symbolNumber: 2,
    whatItControls: 'Controls how flat a planar surface must be across its entire extent.',
    simpleExplanation:
      'Controls how flat a surface must be. Flatness is independent of other datums or characteristics. The entire controlled surface must lie within a 3D tolerance zone formed by two theoretical parallel planes separated by the specified tolerance value.',
    typicalApplication: ['Machine Bed', 'Engine Block Sealing Face', 'Mounting Plate', 'Flange Gasket Interface', 'Granite Table'],
    exampleTolerance: 'Flatness = 0.02 mm',
    datumRequired: false,
    datumRequirementText: 'No Datum Required (Independent of any reference planes)',
    featureControlFrame: {
      symbol: '▱',
      tolerance: '0.02',
      description: 'The entire surface must lie between two parallel planes separated by 0.02 mm.',
    },
    deepDive: {
      toleranceZone: 'A 3D zone bounded by two parallel planes separated by exactly 0.02 mm.',
      inspectionMethod: 'Part leveled on 3 high points on a granite surface plate, dial indicator traversed in a grid pattern across the surface, or CMM least-squares plane fit.',
      cadCalloutGuide: 'Attached via leader line to the surface or placed on an extension line in any view showing the surface as a line.',
      keyTakeaway: 'Flatness controls only surface waviness/warpage; it does not control parallel alignment or height.',
      asmeStandard: 'ASME Y14.5-2018 Section 8.4 / ISO 1101',
    },
  },
  {
    id: 'circularity',
    svgName: 'circularity',
    unicodeChar: '○',
    name: 'Circularity / Roundness',
    category: 'FORM',
    categoryLabel: 'Form Controls',
    categoryNumber: 1,
    symbolNumber: 3,
    whatItControls: 'Controls how close an individual circular cross-section is to a true circle.',
    simpleExplanation:
      'Controls how close a circular cross-section is to a true circle. It controls the overall form of a circle and ensures that the cross-section is not excessively oval, lobed, square, or out of round. Each cross-section is evaluated individually perpendicular to the axis.',
    typicalApplication: ['Shafts', 'Bearings', 'Pistons', 'Hydraulic Spools', 'Bushing Bores'],
    exampleTolerance: 'Circularity = 0.01 mm',
    datumRequired: false,
    datumRequirementText: 'No Datum Required (Evaluates 2D cross-sections independently)',
    featureControlFrame: {
      symbol: '○',
      tolerance: '0.01',
      description: 'At each cross-section perpendicular to the axis, the periphery must lie between two concentric circles with a radial distance of 0.01 mm.',
    },
    deepDive: {
      toleranceZone: 'A 2D annular ring defined by two concentric circles spaced 0.01 mm apart in the plane of the cross-section.',
      inspectionMethod: 'Precision roundness testing machine (Talyrond), rotational air-bearing spindle with indicator probe, or V-block rotation (3-point method for multi-lobed shapes).',
      cadCalloutGuide: 'Attached with leader line pointing to the cylindrical surface in a view perpendicular to the axis.',
      keyTakeaway: 'A two-point micrometer measurement CANNOT detect 3-lobed or 5-lobed out-of-round conditions; circularity inspection requires radial evaluation.',
      asmeStandard: 'ASME Y14.5-2018 Section 8.3 / ISO 1101',
    },
  },
  {
    id: 'cylindricity',
    svgName: 'cylindricity',
    unicodeChar: '⌭',
    name: 'Cylindricity',
    category: 'FORM',
    categoryLabel: 'Form Controls',
    categoryNumber: 1,
    symbolNumber: 4,
    whatItControls: 'Controls the overall 3D form of a cylindrical feature (roundness, straightness, and taper simultaneously).',
    simpleExplanation:
      'Controls the overall form of a cylindrical feature. Cylindricity is a 3-dimensional tolerance that controls whether a cylindrical feature is sufficiently round and straight along its axis. It combines circularity, straightness, and taper into a single comprehensive envelope.',
    typicalApplication: ['Hydraulic Cylinders', 'Precision Shafts', 'High-Speed Bearings', 'Engine Cylinder Liners', 'Pistons'],
    exampleTolerance: 'Cylindricity = 0.015 mm',
    datumRequired: false,
    datumRequirementText: 'No Datum Required (Comprehensive full-envelope Form Control)',
    featureControlFrame: {
      symbol: '⌭',
      tolerance: '0.015',
      description: 'The entire cylindrical surface must lie between two coaxial cylinders with a difference in radii of 0.015 mm.',
    },
    deepDive: {
      toleranceZone: 'A 3D zone bounded by two coaxial cylinders spaced 0.015 mm apart radially.',
      inspectionMethod: 'CMM scanning the full cylindrical envelope, or roundness instrument with synchronized vertical traverse column.',
      cadCalloutGuide: 'Attached by leader pointing to the cylinder in the view where its length is visible.',
      keyTakeaway: 'Cylindricity is the most stringent cylindrical form control. It cannot reference a datum because it defines its own self-referencing axis.',
      asmeStandard: 'ASME Y14.5-2018 Section 8.5 / ISO 1101',
    },
  },

  // ── 2. PROFILE CONTROLS ──
  {
    id: 'profile-line',
    svgName: 'profile-line',
    unicodeChar: '⌒',
    name: 'Profile of a Line',
    category: 'PROFILE',
    categoryLabel: 'Profile Controls',
    categoryNumber: 2,
    symbolNumber: 5,
    whatItControls: 'Controls a two-dimensional cross-sectional profile along a designated cut line or contour.',
    simpleExplanation:
      'Controls a two-dimensional cross-sectional profile. It creates a tolerance zone around a line or curved profile. The profile of a line can be applied to a cross-section of a surface and controls the amount by which the actual profile can vary at any individual section.',
    typicalApplication: ['Cam Profiles', 'Curved Features', 'Complex Extrusion Dies', 'Aerodynamic Foils', 'Thread Contours'],
    exampleTolerance: 'Profile of a Line = 0.05 mm',
    datumRequired: false,
    datumRequirementText: 'Datum Reference Optional (Datums used when orientation/location must be fixed)',
    featureControlFrame: {
      symbol: '⌒',
      tolerance: '0.05',
      primaryDatum: 'A',
      description: 'At each 2D cross-section, the actual contour must lie between two uniform offset lines 0.05 mm apart relative to Datum A.',
    },
    deepDive: {
      toleranceZone: 'A 2D area bounded by two lines enveloping spheres/circles of diameter equal to the tolerance, centered on the true basic profile.',
      inspectionMethod: 'Optical comparator overlay against a 10x/20x CAD template, CMM single-line scanning, or laser profilometer.',
      cadCalloutGuide: 'Leader line to the profile in section view, accompanied by basic dimensions defining the nominal curve.',
      keyTakeaway: 'Applied when variations across different cross-sections are acceptable (e.g. taper across length) while maintaining exact cross-section shape.',
      asmeStandard: 'ASME Y14.5-2018 Section 11.2 / ISO 1101',
    },
  },
  {
    id: 'profile-surface',
    svgName: 'profile-surface',
    unicodeChar: '⌓',
    name: 'Profile of a Surface',
    category: 'PROFILE',
    categoryLabel: 'Profile Controls',
    categoryNumber: 2,
    symbolNumber: 6,
    whatItControls: 'Controls the entire three-dimensional surface (form, orientation, and location simultaneously).',
    simpleExplanation:
      'Controls the entire three-dimensional surface. It creates a 3D tolerance zone around the required theoretical surface shape. It can control size, form, orientation, and location of complex contoured parts in a single powerful specification.',
    typicalApplication: ['Turbine Blades', 'Plastic Moldings', 'Castings & Forgings', 'Automotive Body Panels', 'Aerospace Wings'],
    exampleTolerance: 'Profile of a Surface = 0.08 mm rel to A|B|C',
    datumRequired: true,
    datumRequirementText: 'Datum Reference Normally Required (When controlling full location & orientation)',
    featureControlFrame: {
      symbol: '⌓',
      tolerance: '0.08',
      primaryDatum: 'A',
      secondaryDatum: 'B',
      tertiaryDatum: 'C',
      description: 'The entire 3D surface must lie within two parallel offset surface boundaries 0.08 mm apart, centered on the true CAD model relative to Datums A, B, and C.',
    },
    deepDive: {
      toleranceZone: 'A 3D envelope bounded by two offset surfaces generated by rolling a sphere of diameter 0.08 mm across the true basic surface.',
      inspectionMethod: 'CMM surface point cloud scanning compared directly against the native 3D CAD model, or blue-light structured 3D optical scanner.',
      cadCalloutGuide: 'Attached with leader line to the surface or between specific segment symbols (e.g., [A<->B]). All defining dimensions must be basic.',
      keyTakeaway: 'The Swiss Army knife of GD&T — profile of a surface can simultaneously control size, form, orientation, and location of organic geometry.',
      asmeStandard: 'ASME Y14.5-2018 Section 11.2 / ISO 1101',
    },
  },

  // ── 3. ORIENTATION CONTROLS ──
  {
    id: 'parallelism',
    svgName: 'parallelism',
    unicodeChar: '∥',
    name: 'Parallelism',
    category: 'ORIENTATION',
    categoryLabel: 'Orientation Controls',
    categoryNumber: 3,
    symbolNumber: 7,
    whatItControls: 'Controls whether a surface, center line, or feature remains parallel to a datum feature.',
    simpleExplanation:
      'Controls whether a surface, line, or feature remains parallel to a datum feature. The controlled feature must remain within the specified tolerance zone which is parallel to the referenced datum. Parallelism controls orientation without controlling location or distance.',
    typicalApplication: ['Machine Guide Rails', 'Gearbox Cover Plates', 'Precision Slides', 'Keyway Walls', 'Parallel Bearing Seats'],
    exampleTolerance: 'Parallelism = 0.02 mm relative to Datum A',
    datumRequired: true,
    datumRequirementText: 'Datum Reference Strictly Required (Must reference datum plane or axis)',
    featureControlFrame: {
      symbol: '∥',
      tolerance: '0.02',
      primaryDatum: 'A',
      description: 'The surface must lie between two parallel planes 0.02 mm apart that are theoretically parallel to Datum plane A.',
    },
    deepDive: {
      toleranceZone: 'Two parallel planes 0.02 mm apart, exactly parallel to datum plane A (or a cylinder Ø0.02 mm for hole/pin axis).',
      inspectionMethod: 'Part supported on Datum A on a surface plate, dial indicator swept across the parallel surface.',
      cadCalloutGuide: 'Attached to the controlled surface in a view showing the surface as a line, referencing Datum A.',
      keyTakeaway: 'Parallelism tolerance must always be smaller than the dimensional size/distance tolerance between the features.',
      asmeStandard: 'ASME Y14.5-2018 Section 9.2 / ISO 1101',
    },
  },
  {
    id: 'perpendicularity',
    svgName: 'perpendicularity',
    unicodeChar: '⊥',
    name: 'Perpendicularity',
    category: 'ORIENTATION',
    categoryLabel: 'Orientation Controls',
    categoryNumber: 3,
    symbolNumber: 8,
    whatItControls: 'Maintains a 90° exact relationship between features (surfaces, axes, or center planes) relative to a datum.',
    simpleExplanation:
      'Maintains a 90° relationship between features. It can control the orientation of a surface or axis relative to a datum plane or axis. Ensures components assemble flush and perpendicular without binding or edge digging.',
    typicalApplication: ['Drilled Hole vs Mounting Face', 'Cylinder Head Face', 'Shaft Shoulder', 'Upright Columns', 'Bore-to-Face Squareness'],
    exampleTolerance: 'Perpendicularity = ⌀0.03 mm rel to Datum A',
    datumRequired: true,
    datumRequirementText: 'Datum Reference Strictly Required (Must reference datum plane or axis)',
    featureControlFrame: {
      symbol: '⊥',
      tolerance: '⌀0.03',
      modifier: 'MMC',
      primaryDatum: 'A',
      description: 'The axis of the hole must lie within a cylindrical zone of diameter 0.03 mm at 90° to Datum A at Maximum Material Condition.',
    },
    deepDive: {
      toleranceZone: 'Two parallel planes 90° to datum (surface) OR a cylindrical tolerance zone perpendicular to datum plane A (pin/hole axis).',
      inspectionMethod: 'Precision square with dial indicator on granite table, cylinder square, or CMM 3D angle verification.',
      cadCalloutGuide: 'Applied to a feature face or under a hole diameter callout with cylindrical zone symbol (⌀) and optional MMC modifier.',
      keyTakeaway: 'A perpendicular hole prevents fasteners from binding or galling against mounting counterbores.',
      asmeStandard: 'ASME Y14.5-2018 Section 9.3 / ISO 1101',
    },
  },
  {
    id: 'angularity',
    svgName: 'angularity',
    unicodeChar: '∠',
    name: 'Angularity',
    category: 'ORIENTATION',
    categoryLabel: 'Orientation Controls',
    categoryNumber: 3,
    symbolNumber: 9,
    whatItControls: 'Controls the orientation of a feature at a specified basic angle other than 90° relative to a datum.',
    simpleExplanation:
      'Controls the orientation of a feature at a specified angle other than 90°. The theoretical nominal angle is defined on the engineering drawing using basic dimensions (enclosed in a rectangular box). The tolerance zone is parallel to that theoretical basic angle.',
    typicalApplication: ['45° Chamfers & Bevels', 'V-Blocks', 'Angled Mounting Surfaces', 'Dovetail Slides', 'Bevel Gear Seats'],
    exampleTolerance: 'Angularity = 0.04 mm rel to Datum A at 30° basic',
    datumRequired: true,
    datumRequirementText: 'Datum Reference Strictly Required + Basic Angle Dimension',
    featureControlFrame: {
      symbol: '∠',
      tolerance: '0.04',
      primaryDatum: 'A',
      description: 'The angled surface must lie between two parallel planes 0.04 mm apart, oriented at the exact basic angle to Datum plane A.',
    },
    deepDive: {
      toleranceZone: 'Two parallel planes spaced 0.04 mm apart, inclined at the exact basic angle specified on the drawing relative to the datum.',
      inspectionMethod: 'Sine bar setup with slip gauges and dial indicator on a granite surface plate, or precision angle CMM alignment.',
      cadCalloutGuide: 'Leader to the angled surface, with the nominal angle dimension boxed as a basic dimension (e.g., [45°]).',
      keyTakeaway: 'Angularity can control any angle from 0° to 180°; parallelism and perpendicularity are special 0° and 90° cases of angularity.',
      asmeStandard: 'ASME Y14.5-2018 Section 9.4 / ISO 1101',
    },
  },

  // ── 4. LOCATION CONTROLS ──
  {
    id: 'position',
    svgName: 'position',
    unicodeChar: '⌖',
    name: 'Position / True Position',
    category: 'LOCATION',
    categoryLabel: 'Location Controls',
    categoryNumber: 4,
    symbolNumber: 10,
    whatItControls: 'Controls how far a feature (hole, pin, slot, tab) can vary from its theoretically exact or "true" position.',
    simpleExplanation:
      'Controls how far a feature can vary from its theoretically exact or "true" position. The true position represents the exact nominal location defined by basic dimensions. The tolerance zone is typically a cylinder (⌀) providing 57% more usable tolerance area than square ± coordinate tolerances.',
    typicalApplication: ['Hole Locations', 'Pin & Dowel Locations', 'Slot Locations', 'Bolt-Hole Patterns', 'Fastener Clearance Holes'],
    exampleTolerance: 'Position = ⌀0.20 mm [MMC] relative to datums A, B and C',
    datumRequired: true,
    datumRequirementText: 'Datum Reference Strictly Required (Typically Primary, Secondary, Tertiary: A, B, C)',
    featureControlFrame: {
      symbol: '⌖',
      tolerance: '⌀0.20',
      modifier: 'MMC',
      primaryDatum: 'A',
      secondaryDatum: 'B',
      tertiaryDatum: 'C',
      description: 'Hole center axis must lie within a cylindrical zone ⌀0.20 mm located at true position relative to Datums A, B, and C at Maximum Material Condition.',
    },
    deepDive: {
      toleranceZone: 'A cylindrical zone of diameter ⌀0.20 mm centered at the theoretically exact basic coordinates from datums A, B, and C.',
      inspectionMethod: 'Functional Go/No-Go plug gauge at MMC, CMM coordinate measurement with calculated true position formula: 2*sqrt(dx^2 + dy^2).',
      cadCalloutGuide: 'Attached below the diameter callout (e.g. 4X Ø10 ±0.05). All location dimensions to datums must be boxed basic dimensions.',
      keyTakeaway: 'When specified at MMC, any departure in hole size from smallest hole gives bonus tolerance, significantly decreasing manufacturing scrap!',
      asmeStandard: 'ASME Y14.5-2018 Section 10 / ISO 1101',
    },
  },
  {
    id: 'concentricity',
    svgName: 'concentricity',
    unicodeChar: '◎',
    name: 'Concentricity',
    category: 'LOCATION',
    categoryLabel: 'Location Controls',
    categoryNumber: 4,
    symbolNumber: 11,
    whatItControls: 'Controls the common center axis of two cylindrical features (evaluated using derived median points).',
    simpleExplanation:
      'Controls the common center axis of two cylindrical features. Concentricity uses the derived median points of the referenced cylindrical feature and requires them to remain within the specified tolerance zone. Note: Modern designs often prefer Position or Runout because concentricity is notoriously difficult to inspect.',
    typicalApplication: ['High-Speed Motor Rotors', 'Dynamically Balanced Shafts', 'Precision Spindles', 'Optical Lens Mounts'],
    exampleTolerance: 'Concentricity = ⌀0.02 mm relative to Datum A',
    datumRequired: true,
    datumRequirementText: 'Datum Axis Strictly Required',
    featureControlFrame: {
      symbol: '◎',
      tolerance: '⌀0.02',
      primaryDatum: 'A',
      description: 'All derived median points of diametrically opposed elements must lie within a cylindrical zone ⌀0.02 mm coaxial with Datum axis A.',
    },
    deepDive: {
      toleranceZone: 'A cylindrical zone ⌀0.02 mm whose axis is identical with the datum axis.',
      inspectionMethod: 'Point-by-point differential CMM measurement calculating midpoints between diametrically opposed pairs across multiple cross-sections.',
      cadCalloutGuide: 'Attached to the diameter of the controlled cylinder, referencing datum axis A.',
      keyTakeaway: 'Removed in ASME Y14.5-2018 in favor of Position and Runout; still widely found on legacy drawings and ISO 1101 standards.',
      asmeStandard: 'ASME Y14.5M-1994/2009 / ISO 1101 (Deprecated in ASME Y14.5-2018 in favor of Runout/Position)',
    },
  },
  {
    id: 'symmetry',
    svgName: 'symmetry',
    unicodeChar: '⌯',
    name: 'Symmetry',
    category: 'LOCATION',
    categoryLabel: 'Location Controls',
    categoryNumber: 4,
    symbolNumber: 12,
    whatItControls: 'Controls symmetry of opposite features about a datum center plane.',
    simpleExplanation:
      'Controls symmetry about a datum plane. It ensures equal spacing and centered mass distribution around a center plane. Symmetry is the non-circular counterpart of concentricity. Note: Modern practice often replaces symmetry with profile or position controls.',
    typicalApplication: ['Keyway Slots', 'Splines', 'Symmetrical Yokes', 'T-Slots', 'Centering Cleats'],
    exampleTolerance: 'Symmetry = 0.03 mm relative to Datum A',
    datumRequired: true,
    datumRequirementText: 'Datum Center Plane Strictly Required',
    featureControlFrame: {
      symbol: '⌯',
      tolerance: '0.03',
      primaryDatum: 'A',
      description: 'All median points of opposed feature elements must lie between two parallel planes 0.03 mm apart, symmetrically placed about datum plane A.',
    },
    deepDive: {
      toleranceZone: 'Two parallel planes 0.03 mm apart disposed symmetrically about the datum center plane.',
      inspectionMethod: 'CMM point-by-point opposed coordinate measurement mapping the derived median plane.',
      cadCalloutGuide: 'Applied to feature width dimension (e.g., slot width), referencing the datum center plane.',
      keyTakeaway: 'Deprecated in ASME Y14.5-2018 in favor of Position with boundary or Profile; still used in ISO 1101.',
      asmeStandard: 'ASME Y14.5M-1994/2009 / ISO 1101 (Deprecated in ASME Y14.5-2018 in favor of Position/Profile)',
    },
  },

  // ── 5. RUNOUT CONTROLS ──
  {
    id: 'circular-runout',
    svgName: 'circular-runout',
    unicodeChar: '↗',
    name: 'Circular Runout',
    category: 'RUNOUT',
    categoryLabel: 'Runout Controls',
    categoryNumber: 5,
    symbolNumber: 13,
    whatItControls: 'Controls the variation of a surface when the part is rotated 360° around a datum axis (checked one cross-section at a time).',
    simpleExplanation:
      'Controls the amount of variation of a referenced feature when the part is rotated 360° around a datum axis. It checks variation during one revolution at any single cross-section. Composite control controlling circularity and coaxiality at individual circular segments.',
    typicalApplication: ['Shafts', 'Rotating Pulleys', 'Bearings', 'Flywheels', 'Brake Rotors'],
    exampleTolerance: 'Circular Runout = 0.03 mm relative to Datum A',
    datumRequired: true,
    datumRequirementText: 'Datum Axis Strictly Required (Part rotates around datum axis)',
    featureControlFrame: {
      symbol: '↗',
      tolerance: '0.03',
      primaryDatum: 'A',
      description: 'During a 360° rotation around datum axis A, dial indicator movement must not exceed 0.03 mm (FIM) at any single circular measurement plane.',
    },
    deepDive: {
      toleranceZone: 'A 2D annular tolerance zone bounded by two concentric circles at each individual cross-section as the part rotates.',
      inspectionMethod: 'Mount part between centers or on V-blocks aligned to datum A; fix dial test indicator perpendicular to surface and record Full Indicator Movement (FIM) during full 360° rotation.',
      cadCalloutGuide: 'Leader pointing to the outer diameter or shoulder face, referencing datum axis A.',
      keyTakeaway: 'The dial indicator stays stationary during rotation; it is re-positioned for subsequent cross-sections.',
      asmeStandard: 'ASME Y14.5-2018 Section 12 / ISO 1101',
    },
  },
  {
    id: 'total-runout',
    svgName: 'total-runout',
    unicodeChar: '⇗',
    name: 'Total Runout',
    category: 'RUNOUT',
    categoryLabel: 'Runout Controls',
    categoryNumber: 5,
    symbolNumber: 14,
    whatItControls: 'Controls the entire rotating surface simultaneously over its full length while rotating 360° around the datum axis.',
    simpleExplanation:
      'Controls the entire rotating surface over its full length. Total runout controls the variation of an entire feature or surface with respect to a datum when the part is rotated 360° around the datum axis. It controls surface variation during rotation, axial variation, circularity, straightness, taper, and coaxiality simultaneously.',
    typicalApplication: ['High-Speed Spindles', 'Printing Press Rollers', 'Turbine Rotors', 'Precision Drive Shafts', 'Precision Gear Mandrels'],
    exampleTolerance: 'Total Runout = 0.015 mm relative to Datum A-B',
    datumRequired: true,
    datumRequirementText: 'Datum Axis Strictly Required (Compound datum like A-B commonly used)',
    featureControlFrame: {
      symbol: '⇗',
      tolerance: '0.015',
      primaryDatum: 'A-B',
      description: 'Across the entire cylindrical surface during 360° rotation while traversing the dial indicator along its full length, total indicator reading must not exceed 0.015 mm relative to datum axis A-B.',
    },
    deepDive: {
      toleranceZone: 'A 3D cylindrical zone bounded by two coaxial cylinders 0.015 mm apart over the entire feature length.',
      inspectionMethod: 'Part mounted on centers/chucks on datum axis A-B; indicator probe traverses along length while workpiece continuously rotates 360°.',
      cadCalloutGuide: 'Applied to cylindrical or end surfaces of rotating shafts where high-speed balance and dynamic runout are critical.',
      keyTakeaway: 'The ultimate rotational control: guarantees zero wobble, zero barrel/hourglass taper, zero eccentric runout, and zero surface waviness.',
      asmeStandard: 'ASME Y14.5-2018 Section 12.3 / ISO 1101',
    },
  },
];
