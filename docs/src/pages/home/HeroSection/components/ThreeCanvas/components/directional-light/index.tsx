import React, { useMemo } from 'react';
import * as THREE from 'three/webgpu';

interface SceneDirectionalLightProps {
  /** The position of the light source in the scene. */
  position: [number, number, number];
  /** The position the light should point towards (e.g., the position of the Avokado). */
  targetPosition: [number, number, number];
  /** The intensity of the light. Defaults to 10. */
  intensity?: number;
}

/**
 * SceneDirectionalLight
 *
 * A specialized component for managing a directional light and its target.
 * Following SOLID principles, this component encapsulates the logic for
 * orienting the light towards a specific point in the scene.
 */
const SceneDirectionalLight = ({
  position,
  targetPosition,
  intensity = 10,
}: SceneDirectionalLightProps) => {
  // Create a stable target object that the light will point towards.
  // We use useMemo to ensure the object is only created once or when the target position changes.
  const target = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(...targetPosition);
    return obj;
  }, [targetPosition]);

  return (
    <>
      {/* The target must be added to the scene for the directional light to reference it correctly */}
      <primitive object={target} />
      <directionalLight
        position={position}
        intensity={intensity}
        castShadow
        target={target}
        shadow-bias={-0.0001}
      />
    </>
  );
};

export default SceneDirectionalLight;
