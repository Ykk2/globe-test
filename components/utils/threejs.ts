import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Globe from '../../assets/earth.jpg';
import MilkyWay from '../../assets/milky_way.jpg';
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


const loadGlobeGLB = (scene: THREE.Scene): void => {
  const loader: GLTFLoader = new GLTFLoader();
  loader.load(
    RealGlobe,
    (gltf: GLTF) => {
      console.log('GLB file loaded successfully:', gltf);
      scene.add(gltf.scene);
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center); // center the model
      gltf.scene.scale.multiplyScalar(10 / box.getSize(new THREE.Vector3()).length()); // normalize the model size

    },
    undefined,
    (error: ErrorEvent) => {
      console.error('An error occurred while loading the GLB file:', error);
    }
  );
};


const createGlobe = (canvas: HTMLCanvasElement): void => {
  // Set up the scene, camera, and renderer
  const scene: THREE.Scene = new THREE.Scene();
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 1000);
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas , antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio)


  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);


  // Set up the Milky Way texture and its position
  const milkyWayTexture: THREE.Texture = new THREE.TextureLoader().load(MilkyWay.src);
  milkyWayTexture.wrapS = THREE.RepeatWrapping;
  milkyWayTexture.wrapT = THREE.RepeatWrapping;
  milkyWayTexture.repeat.set(1, 1);
  scene.background = milkyWayTexture;

  //White background for debugging
  // scene.background = new THREE.Color(0xffffff);

  // Load and display the GLB file
  loadGlobeGLB(scene);

  // Create a mesh for the glow effect
  const glowGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(2.94, 50, 50);
  const glowMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x0000A5), type: 'c' },
      alpha: { value: 0.27, type: 'f' },
    } as UniformsType,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide, // Change this line
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const glowMesh: THREE.Mesh = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glowMesh);


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
