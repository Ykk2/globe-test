import * as THREE from 'three';

class Spaceship {
  id: string;
  mesh: THREE.Mesh;
  camera: THREE.PerspectiveCamera;
  movement: {
    forward: boolean;
    backward: boolean;
    rotateLeft: boolean;
    rotateRight: boolean;
    pitchUp: boolean;
    pitchDown: boolean;
  };
  currentSpeed: number;
  deceleration: number;
  rotationSpeed: number;
  acceleration: number;
  maxSpeed: number;

  constructor(id: string) {
    this.id = id;

    const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


    this.movement = {
      forward: false,
      backward: false,
      rotateLeft: false,
      rotateRight: false,
      pitchUp: false,
      pitchDown: false,
    };

    this.acceleration = 0.0001
    this.currentSpeed = 0;
    this.deceleration = 0.99;
    this.maxSpeed = 0.01
    this.rotationSpeed = 0.01;

    this.initEventListeners();
    this.initShipPosition();
    this.initCameraPosition()
  }

  initShipPosition() {
    this.mesh.position.set(0, 0, 10)
    this.mesh.rotation.y = Math.PI;
  }

  initCameraPosition() {
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(this.mesh.position);
    this.mesh.add(this.camera);
  }

  initEventListeners() {
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case "w":
            this.movement.forward = true
            break;
        case "s":
            this.movement.backward = true
            break;
        case "a":
            this.movement.rotateLeft = true
            break;
        case "d":
            this.movement.rotateRight = true
            break;
        case "o":
            this.movement.pitchUp = true
            break;
        case "l":
            this.movement.pitchDown = true
            break;
      }
    });

    window.addEventListener('keyup', (event) => {
      switch (event.key) {
        case "w":
            this.movement.forward = false
            break;
        case "s":
            this.movement.backward = false
            break;
        case "a":
            this.movement.rotateLeft = false
            break;
        case "d":
            this.movement.rotateRight = false
            break;
        case "o":
            this.movement.pitchUp = false
            break;
        case "l":
            this.movement.pitchDown = false
            break;
      }
    });
  }

  update() {
    if (this.movement.forward) {
      this.currentSpeed = Math.min(this.currentSpeed + this.acceleration, this.maxSpeed);
    } else if (this.movement.backward) {
      this.currentSpeed = Math.max(this.currentSpeed - this.acceleration, -this.maxSpeed);
    } else {
      this.currentSpeed *= this.deceleration;
    }
    this.mesh.translateZ(this.currentSpeed);

    if (this.movement.rotateLeft) {
      this.mesh.rotateY(this.rotationSpeed);
    }

    if (this.movement.rotateRight) {
      this.mesh.rotateY(-this.rotationSpeed);
    }

    if (this.movement.pitchUp) {
      this.mesh.rotateX(-this.rotationSpeed);
    }

    if (this.movement.pitchDown) {
      this.mesh.rotateX(this.rotationSpeed);
    }
  }
}

export default Spaceship;
