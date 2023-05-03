import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import RealGlobe from '../../assets/Earth_1_12756.glb'


interface UniformsType {
  [uniform: string]: {value: any; type: string}
}

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 glowColor;
  uniform float alpha;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float intensity = pow(1.0 - dot(vNormal, viewDirection), 0.1);
    gl_FragColor = vec4(glowColor, alpha) * intensity;
  }
`;


const createGlobe = async (): Promise<THREE.Group> => {
  const globeGroup = new THREE.Group();

  const loadGlobeGLB = (onLoad: (globe: THREE.Object3D) => void): void => {
    const loader: GLTFLoader = new GLTFLoader();
    loader.load(
      RealGlobe,
      (gltf: GLTF) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center); // center the model
        gltf.scene.scale.multiplyScalar(10 / box.getSize(new THREE.Vector3()).length()); // normalize the model size
        onLoad(gltf.scene);
      },
      undefined,
      (error: ErrorEvent) => {
        console.error('An error occurred while loading the GLB file:', error);
      }
    );
  };

  const glowGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(2.94, 50, 50);
  const glowMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x0000A5), type: 'c' },
      alpha: { value: 0.27, type: 'f' },
    } as UniformsType,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const glowMesh: THREE.Mesh = new THREE.Mesh(glowGeometry, glowMaterial);
  globeGroup.add(glowMesh);

  const globeLoaded = new Promise<THREE.Object3D>((resolve) => {
    loadGlobeGLB((globe) => {
      globeGroup.add(globe);
      resolve(globe);
    });
  });

  return globeLoaded.then(() => globeGroup);
};

export default createGlobe;
