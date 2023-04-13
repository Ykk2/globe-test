import React, { useRef, useEffect } from 'react';
import ThreeScene from '../utils/threejs'


const GlobeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeURL = '/globe/scene.gltf'


  useEffect(() => {
    if (canvasRef.current) {
      const threeScene = new ThreeScene(canvasRef.current);
      threeScene.loadModel(globeURL);
      threeScene.addLights();
      threeScene.modifyMaterials();
      threeScene.render();
    }
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

export default GlobeScene
