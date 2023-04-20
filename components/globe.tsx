import React, { useEffect, useRef } from 'react';
import createGlobe from './utils/threejs';

const GlobeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      createGlobe(canvasRef.current);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default GlobeCanvas;
