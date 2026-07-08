import * as THREE from 'three/webgpu';
import {
  color,
  mix,
  uv,
  float,
  positionLocal,
  bumpMap,
  mx_noise_float,
  Fn,
  smoothstep,
  normalView,
  positionViewDirection,
  dot,
  pow,
} from 'three/tsl';

/**
 * Avocado Peel Material
 * Uses Brand Colors: Olive Leaf as base, Canopy Dark for depth.
 * Emphasizes low-poly edges with Flat Shading and spaced-out noise.
 */
export const peelMaterial = new THREE.MeshStandardNodeMaterial({
  name: 'Peel',
  flatShading: true,
});

const peelNoiseFn = Fn(() => {
  // Spaced out noise: lower frequency and higher contrast
  const p = positionLocal.mul(15);
  const n = mx_noise_float(p);

  // High contrast smoothstep for "spots" instead of continuous noise
  return smoothstep(float(0.5), float(0.8), n);
});

const peelNoise = peelNoiseFn();

// Brand Colors
const oliveLeaf = color(0x467427); // Primary Brand Color
const canopyDark = color(0x02590f); // Shade Dark
const sproutGreen = color(0xc9f2ac); // Secondary Brand Color (Luminosity)

// Subtle Bump for texture, but flat shading handles the "low-poly" look
peelMaterial.normalNode = bumpMap(peelNoise, float(0.15));

// Color Mix: Solid Olive Leaf base with Canopy Dark spots
const peelBaseColor = mix(oliveLeaf, canopyDark, peelNoise);

// Friendly Fresnel for highlight, keeping it subtle for low-poly
const fresnel = dot(normalView, positionViewDirection).oneMinus().pow(3.0);
peelMaterial.colorNode = mix(peelBaseColor, sproutGreen, fresnel.mul(0.2));

peelMaterial.roughnessNode = mix(float(0.8), float(0.9), peelNoise);

/**
 * Avocado Pulp Material
 * Creamy Mint Whisper interior.
 */
const edgePulp = color(0x8ea637); // Olive Leaf
const centerPulp = color(0xf1f8e9); // Mint Whisper (Clear, Creamy)
const sproutGreenHighlight = color(0xc9f2ac); // Sprout Green
const pulpGradient = pow(uv().y, float(1.2));
const pulpBaseColor = mix(edgePulp, centerPulp, pulpGradient);

export const pulpMaterial = new THREE.MeshStandardNodeMaterial({
  name: 'Pulp',
  flatShading: true,
  colorNode: mix(pulpBaseColor, sproutGreenHighlight, float(0.1)),
  roughnessNode: float(0.3),
});

// Solid creamy transition

/**
 * Avocado Seed Material
 * Rich Coffee Soil.
 */
const coffeeSoil = color(0x400101); // Brand Base Dark
const lighterSoil = color(0x5c4b3f); // Warm Brown

const seedNoise = mx_noise_float(positionLocal.mul(10));

export const seedMaterial = new THREE.MeshStandardNodeMaterial({
  name: 'Seed',
  flatShading: true,
  colorNode: mix(coffeeSoil, lighterSoil, seedNoise.mul(0.2)),
  roughnessNode: float(0.6),
});

/**
 * Avocado Cabin Material
 */
export const cabinMaterial = new THREE.MeshStandardNodeMaterial({
  name: 'Cabin',
  flatShading: true,
  colorNode: color(0x8ea637), // Olive Leaf
  roughnessNode: float(0.5),
});
