/**
 * Engineering gear calculation utilities
 * All functions return values in millimeters unless otherwise noted.
 */
export function calculatePitchDiameter(module: number, teeth: number): number {
  return module * teeth;
}

export function calculateOutsideDiameter(pitchDiameter: number, module: number): number {
  return pitchDiameter + 2 * module;
}

export function calculateDedendum(module: number): number {
  // Approximation used in many textbooks: 1.25 * m
  return 1.25 * module;
}

export function calculateRootDiameter(pitchDiameter: number, dedendum: number): number {
  return pitchDiameter - 2 * dedendum;
}

export function calculateCircularPitch(module: number): number {
  return Math.PI * module;
}

export function calculateToothThickness(circularPitch: number): number {
  return circularPitch / 2;
}

export function calculateGearRatio(driverTeeth: number, drivenTeeth: number): number {
  return driverTeeth / drivenTeeth;
}

export function calculateDrivenSpeed(driverRPM: number, driverTeeth: number, drivenTeeth: number): number {
  // N1 * Z1 = N2 * Z2 => N2 = N1 * Z1 / Z2
  return (driverRPM * driverTeeth) / drivenTeeth;
}
