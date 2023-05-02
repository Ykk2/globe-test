import * as THREE from 'three';
import MilkyWay from '../../assets/milky_way.jpg';


const createSkySphere = ():THREE.Mesh => {

    const skySphere: THREE.SphereGeometry = new THREE.SphereGeometry(20, 1000, 1000)
    const skyTexture: THREE.Texture = new THREE.TextureLoader().load(MilkyWay.src)

    const skyMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide,
    })

    const skyMesh: THREE.Mesh = new THREE.Mesh(skySphere, skyMaterial)

    return skyMesh
}


export default createSkySphere
