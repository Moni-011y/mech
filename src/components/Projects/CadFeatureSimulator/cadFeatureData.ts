export interface CadFeatureStep {
  stepNumber: number;
  title: string;
  cadAction: string;
  description: string;
}

export interface CadFeatureData {
  id: string;
  name: string;
  icon: string;
  color: string;
  bannerLabel: string;
  shortExplanation: string;
  geometrySteps: CadFeatureStep[];
  typicalApplications: { title: string; desc: string }[];
  keyParameters: { label: string; value: string; unit?: string }[];
  realWorldComponent: {
    title: string;
    description: string;
    material: string;
    cadSoftware: string;
  };
}

export const CAD_FEATURES_DATA: Record<string, CadFeatureData> = {
  EXTRUDE: {
    id: 'EXTRUDE',
    name: 'EXTRUDE',
    icon: '🟦',
    color: 'text-teal-400',
    bannerLabel: '2D PROFILE → EXTRUSION → 3D SOLID',
    shortExplanation:
      'Creates a 3D solid by extending a closed 2D sketch profile along a specified linear vector and depth distance perpendicular to the sketch plane.',
    geometrySteps: [
      {
        stepNumber: 1,
        title: '2D Closed Sketch',
        cadAction: 'Sketch Plane Definition',
        description:
          'Construct a fully constrained closed 2D profile (machined bracket boundary with internal circular pocket) on the primary datum plane.',
      },
      {
        stepNumber: 2,
        title: 'Extrusion Vector',
        cadAction: 'Normal Direction & Vector',
        description:
          'Define the extrusion direction vector normal to the sketch plane and specify the target depth distance (blind, symmetric, or up-to-surface).',
      },
      {
        stepNumber: 3,
        title: 'Linear Extension',
        cadAction: 'Solid Material Generation',
        description:
          'Progressively project the boundary contours and internal voids along the extrusion vector, forming lateral solid faces.',
      },
      {
        stepNumber: 4,
        title: 'Machined 3D Solid',
        cadAction: 'Finished CAD Part',
        description:
          'Cap the end faces with specified draft angles and corner chamfers to yield the completed structural mounting block.',
      },
    ],
    typicalApplications: [
      { title: 'Mounting Bosses & Brackets', desc: 'Precision equipment supports and chassis anchor points' },
      { title: 'Machine Base Plates', desc: 'CNC bed fixtures, mounting pads, and foundation plates' },
      { title: 'Pockets, Slots & Cutouts', desc: 'Negative extrusions for bearing pockets and clearance recesses' },
      { title: 'Structural Ribs & Housings', desc: 'Reinforcing stiffener walls on cast and machined housings' },
    ],
    keyParameters: [
      { label: 'End Condition', value: 'Blind Depth / Up to Surface' },
      { label: 'Extrude Depth (d)', value: '45.0 mm' },
      { label: 'Draft Angle', value: '0.0° (Neutral Machined)' },
      { label: 'Profile Tolerance', value: '±0.05 mm' },
      { label: 'Sketch Plane', value: 'XY Top Datum Plane' },
    ],
    realWorldComponent: {
      title: 'Automotive Engine Mounting Bracket',
      description:
        'A structural 6061-T6 aluminum bracket produced by extruding an optimized perimeter sketch with through-bolt clearance holes and weight-reducing pocket cutouts.',
      material: 'AL 6061-T6 / Structural Steel',
      cadSoftware: 'SOLIDWORKS / Autodesk Inventor / PTC Creo',
    },
  },

  REVOLVE: {
    id: 'REVOLVE',
    name: 'REVOLVE',
    icon: '🔄',
    color: 'text-sky-400',
    bannerLabel: '2D PROFILE → 360° ROTATION → REVOLVED SOLID',
    shortExplanation:
      'Creates rotational geometry by sweeping a closed 2D half-cross-section profile around a central linear centerline axis of revolution.',
    geometrySteps: [
      {
        stepNumber: 1,
        title: 'Half-Profile Sketch',
        cadAction: 'Axis & Cross-Section',
        description:
          'Draw the 2D radial half-profile of the turned component and define the central collinear centerline of revolution (℄).',
      },
      {
        stepNumber: 2,
        title: 'Rotational Sweep',
        cadAction: 'Angular Path Sweep',
        description:
          'Sweep the half-profile angularly through 0° to 360° around the center axis, creating rotational circular geometry.',
      },
      {
        stepNumber: 3,
        title: 'Stepped Cylinders',
        cadAction: 'Shoulder & Undercut Formation',
        description:
          'The varying profile radii generate distinct stepped shaft diameters, bearing journals, and shoulder transition faces.',
      },
      {
        stepNumber: 4,
        title: 'Turned Shaft Solid',
        cadAction: 'Finished Turned Component',
        description:
          'Complete 360° closed solid component ready for CNC lathe turning operations and bearing press-fits.',
      },
    ],
    typicalApplications: [
      { title: 'Shafts, Spindles & Axles', desc: 'High-speed drive shafts, machine tool spindles, and stepped axles' },
      { title: 'Pulleys, Sheaves & Bushings', desc: 'Belt drive pulleys, grooved sheaves, and plain journal bearings' },
      { title: 'Turned Flanges & Couplings', desc: 'Pipe flanges, shaft rigid couplings, and hydraulic gland fittings' },
      { title: 'Pressure Vessel Shells', desc: 'Torispherical vessel heads, cylindrical tanks, and hemispherical domes' },
    ],
    keyParameters: [
      { label: 'Revolution Angle (θ)', value: '360° (Full Revolve)' },
      { label: 'Axis of Revolution', value: 'Centerline (Z-Axis)' },
      { label: 'Maximum Diameter (OD)', value: 'Ø56.0 mm' },
      { label: 'Bearing Journal (Ø)', value: 'Ø24.0 mm h6' },
      { label: 'Total Length (L)', value: '164.0 mm' },
    ],
    realWorldComponent: {
      title: 'Automotive Transmission Input Shaft',
      description:
        'A multi-stepped alloy steel input shaft with precision ground bearing journals, gear seating shoulders, and oil seal grooves generated from a single revolve sketch.',
      material: 'Case-Hardened 20MnCr5 Alloy Steel',
      cadSoftware: 'SOLIDWORKS / CATIA V5 / Siemens NX',
    },
  },

  SWEEP: {
    id: 'SWEEP',
    name: 'SWEEP',
    icon: '🌀',
    color: 'text-amber-400',
    bannerLabel: 'PROFILE + PATH → SWEEP → CURVED SOLID',
    shortExplanation:
      'Creates complex continuous tubular or structural geometry by driving a 2D cross-sectional sketch profile along a 3D curved trajectory path.',
    geometrySteps: [
      {
        stepNumber: 1,
        title: '3D Trajectory Path',
        cadAction: 'Curve / Spline Definition',
        description:
          'Establish a continuous 3D centerline path consisting of tangentially blended circular arcs or smooth Catmull-Rom splines.',
      },
      {
        stepNumber: 2,
        title: 'Perpendicular Profile',
        cadAction: 'Normal Plane Sketch',
        description:
          'Create the 2D cross-section sketch (concentric circles for hollow tube) positioned normal to the path at the starting node.',
      },
      {
        stepNumber: 3,
        title: 'Path Traversal',
        cadAction: 'Frenet Frame Progression',
        description:
          'Sweep the profile along the trajectory while maintaining path-normal orientation, generating continuous curved wall geometry.',
      },
      {
        stepNumber: 4,
        title: 'Seamless Curved Pipe',
        cadAction: 'Finished Swept Conduit',
        description:
          'Seamless rigid conduit with constant cross-section and smooth bend radii to minimize hydraulic fluid flow resistance.',
      },
    ],
    typicalApplications: [
      { title: 'Hydraulic & Fuel Hard-Lines', desc: 'High-pressure curved fluid transport lines in aerospace and automotive' },
      { title: 'Exhaust & Intake Manifolds', desc: 'Custom routed automotive headers and smooth intake runners' },
      { title: 'Structural Curved Tubing', desc: 'Roll cages, bicycle frames, and ergonomic handrails' },
      { title: 'Electrical Wiring Conduits', desc: 'Complex cable routing passages through vehicle firewalls and frames' },
    ],
    keyParameters: [
      { label: 'Outer Diameter (OD)', value: 'Ø28.0 mm' },
      { label: 'Wall Thickness (t)', value: '2.5 mm' },
      { label: 'Minimum Bend Radius', value: 'R45.0 mm' },
      { label: 'Path Alignment', value: 'Keep Normal to Trajectory' },
      { label: 'Total Developed Length', value: '185.0 mm' },
    ],
    realWorldComponent: {
      title: 'Aerospace High-Pressure Hydraulic Line',
      description:
        'A 321 stainless steel seamless hydraulic tube routed around engine bay obstacles with CNC-bent radii, maintaining constant cross-sectional flow area throughout the 3D sweep.',
      material: 'Seamless Stainless Steel 321 / Titanium Gr.2',
      cadSoftware: 'Siemens NX Routing / SOLIDWORKS Routing',
    },
  },

  LOFT: {
    id: 'LOFT',
    name: 'LOFT',
    icon: '⚡',
    color: 'text-violet-400',
    bannerLabel: 'MULTIPLE PROFILES → SMOOTH TRANSITION → LOFTED SOLID',
    shortExplanation:
      'Creates smooth, organically blended transition geometry across multiple non-identical 2D sketch cross-sections positioned along an axis.',
    geometrySteps: [
      {
        stepNumber: 1,
        title: 'Multiple Cross-Sections',
        cadAction: 'Planar Offset Profiles',
        description:
          'Position distinct 2D sketches at offset elevations: Circular base, oval transition waist, and rounded rectangular exit port.',
      },
      {
        stepNumber: 2,
        title: 'Guide Curve Rails',
        cadAction: 'Boundary Spline Constraints',
        description:
          'Construct vertical guide curves passing through corresponding profile vertices to control the curvature tangency and shape blend.',
      },
      {
        stepNumber: 3,
        title: 'Surface Skinning',
        cadAction: 'Parametric Surface Generation',
        description:
          'Interpolate a smooth continuous B-spline surface between all cross-sections, honoring the boundary guide curve tangencies.',
      },
      {
        stepNumber: 4,
        title: 'Solid Aerodynamic Duct',
        cadAction: 'Solidified Component',
        description:
          'Convert the lofted skinned envelope into a rigid structural component with uniform wall thickness and aerodynamic efficiency.',
      },
    ],
    typicalApplications: [
      { title: 'Turbine Nozzles & Intake Ducts', desc: 'Transition ducts converting circular fan air to rectangular turbine ports' },
      { title: 'Aerodynamic Wing & Blade Profiles', desc: 'Aircraft wings and wind turbine blades with tapering chord profiles' },
      { title: 'Ergonomic Grips & Consumer Products', desc: 'Hand tool handles, blow-molded bottles, and automotive body styling' },
      { title: 'Exhaust Diffusers & Transition Chutes', desc: 'Industrial HVAC adapters and hopper discharge transitions' },
    ],
    keyParameters: [
      { label: 'Section Count', value: '3 Profiles (Circle → Oval → Rect)' },
      { label: 'Base Profile', value: 'Ø44.0 mm Circle (Z = -30)' },
      { label: 'Mid Profile', value: '64 × 28 mm Ellipse (Z = 0)' },
      { label: 'Top Profile', value: '44 × 44 mm Rounded Rect (Z = +30)' },
      { label: 'Tangency Condition', value: 'Curvature Continuous (G2)' },
    ],
    realWorldComponent: {
      title: 'Gas Turbine Transition Nozzle Duct',
      description:
        'A high-temperature Inconel duct designed to transition hot combustion exhaust gas smoothly from a circular combustion chamber into an annular turbine stator sector.',
      material: 'Inconel 718 / 316L Stainless Steel',
      cadSoftware: 'CATIA Generative Shape Design / Autodesk Alias',
    },
  },

  PATTERN: {
    id: 'PATTERN',
    name: 'PATTERN',
    icon: '🔷',
    color: 'text-pink-400',
    bannerLabel: 'SEED FEATURE → REPEATED INSTANCES → COMPLETE PATTERN',
    shortExplanation:
      'Efficiently replicates an existing seed feature (hole, boss, slot, or tooth) across circular pitch circles or multi-directional linear matrices.',
    geometrySteps: [
      {
        stepNumber: 1,
        title: 'Seed Feature Creation',
        cadAction: 'Primary Feature Definition',
        description:
          'Model one primary "seed" feature — a counterbored bolt hole with precise counterbore depth and through-hole clearance.',
      },
      {
        stepNumber: 2,
        title: 'Pattern Guide & Axis',
        cadAction: 'PCD & Parameter Setup',
        description:
          'Define the Pitch Circle Diameter (PCD) reference ring or linear spacing vectors with equal angular or pitch distribution.',
      },
      {
        stepNumber: 3,
        title: 'Instance Replication',
        cadAction: 'Parametric Array Duplication',
        description:
          'Animate copies appearing at equal angular increments (60° for 6 instances) around the central datum axis.',
      },
      {
        stepNumber: 4,
        title: 'Complete Bolt Circle Flange',
        cadAction: 'Finished Pattern Array',
        description:
          'Final metallic industrial flange featuring a balanced, vibration-resistant bolt circle conforming to ANSI/ISO pipe standards.',
      },
    ],
    typicalApplications: [
      { title: 'Bolt Hole Circles (PCD)', desc: 'Flange connections, brake rotor mountings, and wheel rim bolt circles' },
      { title: 'Gear Teeth Arrays', desc: 'Spur, helical, and bevel gear teeth replicated evenly around the pitch cylinder' },
      { title: 'Cooling Fin Arrays', desc: 'Linear patterned aluminum heat sink fins on power electronics and cylinders' },
      { title: 'Perforated Speaker Grilles', desc: 'Matrix linear patterns with thousands of uniform sound perforations' },
    ],
    keyParameters: [
      { label: 'Pattern Mode', value: 'Circular (PCD) / Linear Array' },
      { label: 'Instance Count (N)', value: '6 Instances (Equal Spacing)' },
      { label: 'Pitch Circle Diameter', value: 'Ø70.0 mm PCD' },
      { label: 'Angular Spacing (Δθ)', value: '60.0°' },
      { label: 'Seed Hole Size', value: 'Ø8.5 Through / Ø14.0 C\'Bore' },
    ],
    realWorldComponent: {
      title: 'Automotive Wheel Hub Flange',
      description:
        'A forged steel wheel hub bearing flange featuring a 5-lug circular bolt pattern on Ø114.3 mm PCD, accurately indexed for high-load wheel fastener distribution.',
      material: 'Forged AISI 1045 Carbon Steel',
      cadSoftware: 'SOLIDWORKS / Autodesk Inventor / Siemens NX',
    },
  },
};
