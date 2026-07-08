import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';
import { Canvas, extend, type CanvasProps } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

interface NavigatorGPU {
  gpu: {
    getPreferredCanvasFormat(): GPUTextureFormat;
  };
}
import SceneCamera from './components/camera';
import SceneDirectionalLight from './components/directional-light';
import Avokado from './components/avokado';
import EXR_FILE from '@tupynambalucas-studio/assets/three/exr/farm_field.exr';

// Extend R3F to recognize the WebGPU version of THREE.js components.
// This is necessary because R3F's default is WebGL.
extend(THREE as unknown as Record<string, new (...args: unknown[]) => unknown>);

/**
 * A simple Card component that demonstrates the use of WebGPU Node Materials.
 */

/**
 * The main ThreeCanvasScene component sets up the rendering environment and the 3D scene.
 * It performs a crucial check for stable WebGPU support and provides a fallback to WebGL if necessary,
 * ensuring the application runs on a wider range of hardware.
 */
function ThreeCanvasScene() {
  const exrPath = EXR_FILE;

  // State to manage the renderer mode: 'pending' (while checking), 'webgpu', or 'webgl'.
  const [rendererMode, setRendererMode] = useState<'pending' | 'webgpu' | 'webgl'>('pending');
  const hasTested = useRef(false);

  useEffect(() => {
    // Ensure the WebGPU test runs only once.
    if (hasTested.current) return;
    hasTested.current = true;

    /**
     * Asynchronously tests for stable WebGPU support.
     * Some drivers (especially on mobile) report WebGPU availability but fail on initial device creation.
     * This "dry run" attempts a minimal WebGPU initialization to confirm stability.
     */
    async function testGPU() {
      // If `navigator.gpu` doesn't exist, fallback directly to WebGL.
      if (!('gpu' in navigator)) {
        setRendererMode('webgl');
        return;
      }

      try {
        // 1. Request a WebGPU adapter from the browser.
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) throw new Error('WebGPU adapter unavailable');

        // 2. Request a device from the adapter.
        const device = await adapter.requestDevice();

        // Asynchronously listen for device loss. This is a robust way to catch
        // driver crashes that can occur shortly after initialization.
        const gpuStatus = { isLost: false };
        void device.lost.then(() => {
          gpuStatus.isLost = true;
        });

        // 3. Create a temporary, offscreen canvas to perform a render test.
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.opacity = '0';
        document.body.appendChild(canvas);

        const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext | null;
        if (context !== null) {
          context.configure({
            device,
            format: (navigator as unknown as NavigatorGPU).gpu.getPreferredCanvasFormat(),
            alphaMode: 'premultiplied',
          });

          // 4. Create and submit a minimal command to the GPU queue.
          // This forces the driver to allocate hardware resources.
          const encoder = device.createCommandEncoder();
          const pass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view: context.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: 'clear',
                storeOp: 'store',
              },
            ],
          });
          pass.end();
          device.queue.submit([encoder.finish()]);
        }

        // 5. Wait a short period to see if the device is lost.
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Cleanup the temporary canvas.
        canvas.remove();

        // 6. Check if the device was lost during our test.
        if (gpuStatus.isLost) {
          throw new Error('WebGPU Device Lost (Vulkan Driver Failure)');
        }

        // If everything succeeded, destroy the test device and set mode to 'webgpu'.
        device.destroy();
        console.info('✅ Stable WebGPU. Hardware buffer supported!');
        setRendererMode('webgpu');
      } catch (error) {
        // If any part of the test fails, log the issue and fallback to WebGL.
        console.warn('⚠️ Unstable WebGPU on device. Activating fallback to WebGL2...', error);
        setRendererMode('webgl');
      }
    }

    void testGPU();
  }, []);

  // While the renderer mode is being determined, render nothing.
  if (rendererMode === 'pending') {
    return null;
  }

  // This function configures the renderer for the R3F Canvas.
  // It's asynchronous to support the WebGPURenderer's async `init()` method.
  const glConfig: CanvasProps['gl'] = async ({ canvas }) => {
    const renderer = new THREE.WebGPURenderer({
      canvas: canvas as unknown as HTMLCanvasElement,
      antialias: true,
      alpha: true,
      // Force WebGL renderer if our test decided it was necessary.
      // The WebGPURenderer itself handles the translation of TSL materials.
      forceWebGL: rendererMode === 'webgl',
    });

    // Configure standard rendering properties for high-quality output.
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 0.7;
    renderer.setPixelRatio(window.devicePixelRatio);

    // Asynchronously initialize the renderer. This is required for WebGPU.
    await renderer.init();
    return renderer as unknown as THREE.Renderer;
  };

  return (
    // The main R3F Canvas. It hands off renderer creation to our `glConfig`.
    <Canvas gl={glConfig} shadows>
      {/* The camera component provides our scene's perspective and controls. */}
      <SceneCamera />
      {/* The Environment provides realistic Image-Based Lighting (IBL). */}
      <Environment
        files={exrPath}
        background={false}
        backgroundIntensity={0.8}
        environmentIntensity={0.3}
      />
      <Avokado scale={[1, 1, 1]} rotation={[0.5, 0, 0]} position={[-0.1, -0.2, 5]} />

      {/* Basic scene lighting to complement the environment. */}
      <ambientLight intensity={0.1} />
      <SceneDirectionalLight position={[0, 0, 5]} targetPosition={[0, 0, 0]} intensity={5} />
      {/* The main interactive element of our scene. */}
    </Canvas>
  );
}

export default ThreeCanvasScene;
