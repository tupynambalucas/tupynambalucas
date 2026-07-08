import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';

// 1. Mudança aqui: Adicionado o "type" para satisfazer o ESLint
import type * as THREE from 'three';

const SceneCamera = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.updateMatrixWorld();
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={10}
      // 2. Se você quer que ela olhe "para baixo", ela precisa estar elevada no eixo Y.
      // Modifiquei a posição de [0, 0, 10] para [0, 5, 10] como exemplo.
      position={[0, 0, 15]}
      near={0.1}
      far={1000}
      // 3. Isso garante que a lente da câmera aponte exatamente para a origem da cena
      // onUpdate={(self) => self.lookAt(0, 0, 0)}
    />
  );
};

export default SceneCamera;
