import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import createRootScene from './utils/RootScene';
import createIntroScene from './utils/IntroScene';
import createGlobeScene from './utils/GlobeScene';

const RootScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const handleButtonClick = (rootScene: THREE.Scene, introScene: THREE.Scene, globeScene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    // Remove intro scene
    rootScene.remove(introScene);

    // Add globe scene
    rootScene.add(globeScene);

    // Move camera to globe
    camera.position.set(0, 0, 15);

    // Render globe scene
    renderer.render(rootScene, camera);
  };


  useEffect(() => {
    if (canvasRef.current) {
      const rootScene = createRootScene();
      const camera = new THREE.PerspectiveCamera(60, canvasRef.current.width / canvasRef.current.height, 1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.position.z = 100; // Set the camera position

       // Create intro scene
       const introScene = createIntroScene();
       rootScene.add(introScene);

       // Create globe scene
       const globeScene = createGlobeScene(camera, renderer);

       canvasRef.current.addEventListener('click', () => handleButtonClick(rootScene, introScene, globeScene, camera, renderer));

      const animate = (): void => {
        requestAnimationFrame(animate);
        renderer.render(rootScene, camera);
      };
      animate();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default RootScene;
