import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Globe from '../assets/earth.jpg';
import MilkyWay from '../assets/milky_way.jpg';

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
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float intensity = pow(1.0 - dot(vNormal, viewDirection), 6.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensity;
  }
`;

const createGlobe = (canvas: HTMLCanvasElement): void => {
  // Set up the scene, camera, and renderer
  const scene: THREE.Scene = new THREE.Scene();
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(100, canvas.width / canvas.height, 1, 1000);
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas , antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio)

  // Set up the globe geometry and material
  const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(5, 50, 50);
  const texture: THREE.Texture = new THREE.TextureLoader().load(Globe.src);
  const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: texture });

  // Set up the Milky Way texture and its position
  const milkyWayTexture: THREE.Texture = new THREE.TextureLoader().load(MilkyWay.src);
  milkyWayTexture.wrapS = THREE.RepeatWrapping;
  milkyWayTexture.wrapT = THREE.RepeatWrapping;
  milkyWayTexture.repeat.set(1, 1);
  scene.background = milkyWayTexture;

  // Only for debugging, set background color to white
  // scene.background = new THREE.Color(0xffffff);

  // Create a mesh with the geometry and material and add it to the scene
  const globe: THREE.Mesh = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Create a mesh for the glow effect
  const glowGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(5.5, 50, 50);
  const glowMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      c: { value: 0.5, type: 'f' },
      p: { value: 50.0, type: 'f' },
      glowColor: { value: new THREE.Color(0xffa500), type: 'c' },
      viewVector: { value: camera.position.clone(), type: 'v3' },
    } as UniformsType,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const glowMesh: THREE.Mesh = new THREE.Mesh(glowGeometry, glowMaterial);
  globe.add(glowMesh);

  // Set up orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enablePan = false

  // Position the camera and controls so that the globe is in view
  camera.position.z = 10;
  controls.update();

  // Update canvas and camera on window resize
  const onWindowResize = (): void => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onWindowResize, false);

  // Animate the globe
  const animate = (): void => {
    requestAnimationFrame(animate);
    controls.update();

    renderer.render(scene, camera);
  };
  animate();
};

export default createGlobe;
