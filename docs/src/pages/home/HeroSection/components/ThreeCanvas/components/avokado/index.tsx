import * as THREE from 'three/webgpu';
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import type { ThreeElements } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { cabinMaterial, peelMaterial, pulpMaterial, seedMaterial } from './avokado.material';
import MODEL_FILE from '@tupynambalucas-studio/assets/three/models/avokado.glb';

type GLTFResult = GLTF & {
  nodes: {
    SK_Avokado_Cabin: THREE.Mesh;
    SK_Avokado_Peel: THREE.Mesh;
    SK_Avokado_Pulp: THREE.Mesh;
    SK_Avokado_Seed: THREE.Mesh;
  };
  materials: {};
};

export function Avokado(props: ThreeElements['group']) {
  const modelPath = MODEL_FILE;
  const group = useRef<THREE.Group>(null);
  const { nodes, animations } = useGLTF(modelPath) as unknown as GLTFResult;
  useAnimations(animations, group);

  // Store the initial rotation from props, or default to [0,0,0]
  const initialRotation = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    if (props.rotation) {
      if (Array.isArray(props.rotation)) {
        initialRotation.current.set(props.rotation[0], props.rotation[1], props.rotation[2]);
      } else if (props.rotation instanceof THREE.Euler) {
        initialRotation.current.copy(props.rotation);
      }
    }
  }, [props.rotation]);

  // Keep track of the normalized global mouse coordinates (-1 to 1)
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates based on window size
      globalMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_state, delta) => {
    if (group.current === null) return;

    // Calculate the target rotation based on the initial rotation + global mouse offset.
    // We map Y movement to X rotation (tilt) and X movement to Y rotation (pan).
    // Amplified the effect slightly (from 0.5 to 0.8) to make it more pronounced and "cool"
    const targetX = initialRotation.current.x - globalMouse.current.y * 0.1;
    const targetY = initialRotation.current.y + globalMouse.current.x * 0.1;

    // Smoothly interpolate the current rotation towards the target rotation.
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <Float
        speed={2} // Animation speed, defaults to 1
        rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        <group name="Scene">
          <group name="Avokado" position={[0, 0, -0.002]}>
            <mesh
              name="SK_Avokado_Cabin"
              castShadow
              receiveShadow
              geometry={nodes.SK_Avokado_Cabin.geometry}
              material={cabinMaterial}
            />
            <mesh
              name="SK_Avokado_Peel"
              castShadow
              receiveShadow
              geometry={nodes.SK_Avokado_Peel.geometry}
              material={peelMaterial}
            />
            <mesh
              name="SK_Avokado_Pulp"
              castShadow
              receiveShadow
              geometry={nodes.SK_Avokado_Pulp.geometry}
              material={pulpMaterial}
            />
            <mesh
              name="SK_Avokado_Seed"
              castShadow
              receiveShadow
              geometry={nodes.SK_Avokado_Seed.geometry}
              material={seedMaterial}
            />
          </group>
        </group>
      </Float>
    </group>
  );
}

export default Avokado;
