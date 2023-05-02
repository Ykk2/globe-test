import * as THREE from "three"
import createSkySphere from "./skysphere";
import createGlobe from "./threejs";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';




const createMainScene = (canvas: HTMLCanvasElement): void => {



    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 1000);

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio)

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);


    const skySphere = createSkySphere()

    createGlobe().then((globeGroup => {

        skySphere.name = "skySphere";
        globeGroup.name = 'globeGroup';

        scene.add(skySphere)
        scene.add(globeGroup)
    }))


    // Set up orbit controls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.1;
    // controls.rotateSpeed = 0.5;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.5;
    // controls.enablePan = true

    // Position the camera and controls so that the globe is in view
    camera.position.z = 10;
    // controls.update();

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
        // controls.update();

        const globeGroup = scene.getObjectByName("globeGroup") as THREE.Group;
        const skySphere = scene.getObjectByName("skySphere") as THREE.Mesh;

        if (globeGroup) {
            // Rotate the globe
            globeGroup.rotation.y += 0.0005;
          }

          if (skySphere) {
            // Rotate the skysphere
            skySphere.rotation.y += 0.00005;
          }

        renderer.render(scene, camera);
    };
    animate();

}


export default createMainScene
