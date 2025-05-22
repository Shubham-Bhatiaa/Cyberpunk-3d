import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import gsap from "gsap";

// Postprocessing imports
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

// Locomotive Scroll import (assumes installed via npm/yarn)
import LocomotiveScroll from 'locomotive-scroll';

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
});

//scene
const scene = new THREE.Scene();

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
    alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Add HDRI environment
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/gym_entrance_1k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
  }
);

let model;

//camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

//gltf model loader
const loader = new GLTFLoader();
loader.load(
    '/DamagedHelmet.gltf',
    function (gltf) {
        model = gltf.scene;
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('An error occurred:', error);
    }
);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;        //enable damping to smooth the camera movement
controls.enabled = false

// Postprocessing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0002; // Adjust for desired effect
composer.addPass(rgbShiftPass);

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    // Update Locomotive Scroll on resize
    scroll.update();
});

window.addEventListener('mousemove', (e) => {
    if(model){
          const rotationX = (e.clientX / window.innerWidth - 0.5) * (Math.PI *0.225 );
          const rotationY = (e.clientY / window.innerHeight - 0.5) * (Math.PI *0.225 );
          gsap.to(model.rotation, {
              y: rotationX,
              x: rotationY,
              duration: 0.5,
              ease: "power2.out"
            });
    }
});

window.addEventListener("resize", ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    // Update Locomotive Scroll on resize
    scroll.update();
})

// Optionally, update Locomotive Scroll on each animation frame for best smoothness
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    composer.render();
    scroll.update();
}
animate();
