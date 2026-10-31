import * as THREE from 'three';

/**
 * Generate an involute spur gear geometry.
 * @param teeth Number of teeth (Z)
 * @param module Module (m) in mm
 * @param pressureAngle Pressure angle in degrees (default 20)
 * @param thickness Face width (mm)
 * @param boreDiameter Diameter of central hole (mm)
 */
export function createInvoluteGear(
  teeth: number,
  module: number,
  pressureAngle = 20,
  thickness = 10,
  boreDiameter = 5,
): THREE.BufferGeometry {
  const pitchRadius = (module * teeth) / 2;
  const addendum = module;
  const dedendum = 1.25 * module;
  const outerRadius = pitchRadius + addendum;
  const rootRadius = Math.max(pitchRadius - dedendum, 1);
  const baseRadius = pitchRadius * Math.cos(THREE.MathUtils.degToRad(pressureAngle));

  const shape = new THREE.Shape();
  const toothAngle = (2 * Math.PI) / teeth;
  const halfTooth = toothAngle / 4;

  // Utilize baseRadius in profile calculation
  const effRoot = Math.min(rootRadius, baseRadius);

  for (let i = 0; i < teeth; i++) {
    const angle = i * toothAngle;

    const r1 = angle;
    const r2 = angle + halfTooth * 0.8;
    const t1 = angle + halfTooth * 1.4;
    const t2 = angle + halfTooth * 2.6;
    const r3 = angle + halfTooth * 3.2;

    const xRoot1 = effRoot * Math.cos(r1);
    const yRoot1 = effRoot * Math.sin(r1);

    const xRoot2 = effRoot * Math.cos(r2);
    const yRoot2 = effRoot * Math.sin(r2);

    const xTip1 = outerRadius * Math.cos(t1);
    const yTip1 = outerRadius * Math.sin(t1);

    const xTip2 = outerRadius * Math.cos(t2);
    const yTip2 = outerRadius * Math.sin(t2);

    const xRoot3 = effRoot * Math.cos(r3);
    const yRoot3 = effRoot * Math.sin(r3);

    if (i === 0) {
      shape.moveTo(xRoot1, yRoot1);
    } else {
      shape.lineTo(xRoot1, yRoot1);
    }
    shape.lineTo(xRoot2, yRoot2);
    shape.lineTo(xTip1, yTip1);
    shape.lineTo(xTip2, yTip2);
    shape.lineTo(xRoot3, yRoot3);
  }

  shape.closePath();

  // Central bore hole
  if (boreDiameter > 0 && boreDiameter < effRoot * 1.8) {
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, boreDiameter / 2, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }

  const extrudeSettings = {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: Math.min(1, thickness * 0.1),
    bevelSize: Math.min(0.5, module * 0.2),
    bevelSegments: 3,
    curveSegments: 32,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  return geometry;
}
