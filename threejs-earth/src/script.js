import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// ===========================================================
// Loading
const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('/textures/earthmap4k.jpg')
const earthBump = textureLoader.load('/textures/earthbump4k.jpg')
const cloudTexture = textureLoader.load('/textures/earthclouds4k.png')
const starTexture = textureLoader.load('/textures/fourpointstar.png')


// ===========================================================
// Debug
const gui = new dat.GUI()


// ===========================================================
// Canvas
const canvas = document.querySelector('canvas.webgl')


// ===========================================================
// Scene
const scene = new THREE.Scene()


// ===========================================================
// Objects
const earthGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64)
const cloudGeometry = new THREE.SphereBufferGeometry(0.51, 64, 64)

const starsGeometry = new THREE.BufferGeometry
const starCount = 2000
const positionArray = new Float32Array(starCount * 3) //xyz per star
for (var i = 0; i < starCount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))


// ===========================================================
// Materials
const earthMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.2,
    map: earthTexture,
    bumpMap: earthBump,
    bumpScale: 1
})

const cloudMaterial = new THREE.MeshPhongMaterial({
    specular: 0x222222,
    shininess: 25, //light reflected off
    opacity: 0.8,
    transparent: true,
    map: cloudTexture,
});

const starsMaterial = new THREE.PointsMaterial({
    size: 0.015,
    map: starTexture,
    transparent: true
})


// ===========================================================
// Mesh
const earth = new THREE.Mesh(earthGeometry,earthMaterial)
const cloud = new THREE.Mesh(cloudGeometry,cloudMaterial)
const stars = new THREE.Points(starsGeometry,starsMaterial)
scene.add(earth)
scene.add(cloud)
scene.add(stars)


// ===========================================================
// Lights
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
hemisphereLight.position.set(2, 1, 0)
hemisphereLight.intensity = 0.8;
scene.add(hemisphereLight)


const directionalLight = new THREE.DirectionalLight(0xd7cc99, 2)
directionalLight.position.set(4.2, 1.5, 1.6)
directionalLight.intensity = 2.9
scene.add(directionalLight)


// ===========================================================
// GUI

var light = gui.addFolder('Light 1')
light.add(hemisphereLight.position, 'x').min(-6).max(6)
light.add(hemisphereLight.position, 'y').min(-6).max(6)
light.add(hemisphereLight.position, 'z').min(-6).max(6)
light.add(hemisphereLight, 'intensity').min(0).max(10)
var lightcolor = {color: 0xff0000}
light.addColor(lightcolor, 'color')
    .onChange(() => {hemisphereLight.color.set(lightcolor.color)})


var light3 = gui.addFolder('Light 3')
light3.add(directionalLight.position, 'x').min(-6).max(6)
light3.add(directionalLight.position, 'y').min(-6).max(6)
light3.add(directionalLight.position, 'z').min(-6).max(6)
light3.add(directionalLight, 'intensity').min(0).max(10)
var light3color = {color: 0x00ff00}
light3.addColor(light3color, 'color')
    .onChange(() => {directionalLight.color.set(light3color.color)})

// ===========================================================
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// ===========================================================
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)


// ===========================================================
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// ===========================================================
/**
 * Animate
 */

window.addEventListener('scroll', updateSphere);

function updateSphere(e) {
    earth.rotation.y = window.scrollY * 0.004
    cloud.rotation.y = window.scrollY * 0.006
    stars.rotation.y = window.scrollY * 0.0001
}

const tick = () =>
{
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()