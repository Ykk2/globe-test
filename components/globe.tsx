import React, { useEffect, useRef } from 'react';
import createGlobe from './utils/threejs';
import createMainScene from './utils/main';

const GlobeScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      createMainScene(canvasRef.current);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default GlobeScene;
