import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


class ThreeScene {
    private readonly canvas: HTMLCanvasElement;
    private readonly renderer: THREE.WebGLRenderer;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly scene: THREE.Scene;
    private readonly ambientLight: THREE.AmbientLight;
    private readonly directionalLight: THREE.DirectionalLight;

    private controls: OrbitControls;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        this.scene = new THREE.Scene();

        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(0, 1, 0);
        this.scene.add(this.directionalLight);

        this.controls = new OrbitControls(this.camera, this.canvas);
    }

    loadModel(url: string): void {
        const loader = new GLTFLoader();
        loader.load(
            url,
            (gltf: GLTF) => {
                const textureLoader = new THREE.TextureLoader();

                // Create an array of image URLs from the glTF JSON
                const imageUrls: string[] = gltf.parser.json.images.map((image: { uri: string }) => {
                    return url.substring(0, url.lastIndexOf('/') + 1) + image.uri;
                });

                const texturePromises = imageUrls.map((url) => textureLoader.loadAsync(url));
                Promise.all(texturePromises).then((textures) => {
                    textures.forEach((texture) => texture.flipY = false);

                    gltf.scene.traverse((child) => {
                        if (child instanceof THREE.Mesh && child.material.map !== null) {
                            const textureName = child.material.map.name;
                            const foundTexture = gltf.parser.json.textures.find((texture: { source: number; sampler?: number }) => {
                                const image = gltf.parser.json.images[texture.source];
                                return image && image.uri === textureName;
                            });


                            if (foundTexture) {
                                const textureSource = gltf.parser.json.images[foundTexture.source].uri;
                                const texture = textures.find((tex) => tex.image.src.includes(textureSource));

                                if (texture) {
                                    console.log(child.material);
                                    child.material.map = texture;
                                    (child.material as THREE.MeshStandardMaterial).needsUpdate = true;
                                }
                            }
                        }
                    });

                    this.scene.add(gltf.scene);
                });
            },
            undefined,
            (error: ErrorEvent) => {
                console.error(error);
            }
        );
    }

    addLights(): void {
        this.ambientLight.intensity = 1;
        this.directionalLight.intensity = 1;
        this.directionalLight.position.set(0, 1, 0);
    }

    modifyMaterials(): void {
        // Traverse through the scene and modify materials
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    specular: 0x050505,
                    shininess: 100,
                });
            }
        });
    }

    render(): void {
        requestAnimationFrame(() => this.render());
        this.controls.update()
        this.renderer.render(this.scene, this.camera);
    }
}

export default ThreeScene;
