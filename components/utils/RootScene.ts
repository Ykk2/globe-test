import * as THREE from 'three';
import MilkyWay from '../../assets/milky_way.jpg';

const createRootScene = (): THREE.Scene => {
  // Set up the scene
  const scene: THREE.Scene = new THREE.Scene();

  // Set up the Milky Way texture and its position
  const milkyWayTexture: THREE.Texture = new THREE.TextureLoader().load(MilkyWay.src);
  milkyWayTexture.wrapS = THREE.RepeatWrapping;
  milkyWayTexture.wrapT = THREE.RepeatWrapping;
  milkyWayTexture.repeat.set(1, 1);
  scene.background = milkyWayTexture;

  return scene;
};

export default createRootScene;
