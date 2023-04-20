import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';


const createIntroScene = (): THREE.Scene => {
    const scene = new THREE.Scene();

    const loader = new FontLoader();

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font: Font) => {
        const introText = new THREE.Mesh(
            new TextGeometry('MUSART', {
                font: font,
                size: 4,
                height: 1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.2,
                bevelOffset: 0,
                bevelSegments: 5,
            }),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        introText.position.set(0, 10, -50);
        scene.add(introText);
    });

    const buttonGeometry = new THREE.BoxGeometry(10, 2, 1);
    const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
    buttonMesh.position.set(0, 0, -50);
    scene.add(buttonMesh);

    return scene;
};

export default createIntroScene;
