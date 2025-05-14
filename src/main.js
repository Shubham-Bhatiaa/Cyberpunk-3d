import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

//gltf model loader
const loader = new GLTFLoader();
loader.load(
    '/DamagedHelmet.gltf',
    function (gltf) {
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error('An error occurred:', error);
    }
);

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // to get great performance on high pixel ratio displays without sacrificing resources
renderer.setSize(window.innerWidth, window.innerHeight);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;        //enable damping to smooth the camera movement

//render
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
