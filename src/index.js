import React from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { initTrackballControls } from './utils/index'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './index.css'

class App extends React.Component {
  camera = null
  scene = null
  renderer = null
  controls = null

  createRenderer () {
    const renderer = new THREE.WebGLRenderer({antialias: true})
  
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor( 0xcccccc );
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)

    this.renderer = renderer
  }

  createCamera () {
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 1000)

    camera.position.set(40, 10, 40)

    function onResize () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, false)

    this.camera = camera
    this.scene.add(camera)

    const helper = new THREE.CameraHelper( camera );
    this.scene.add( helper );
  }

  createScene () {
    this.scene = new THREE.Scene()

    this.scene.background = new THREE.Color(0xcccccc)
    // AxesHelper: x red, y green, z blue
    const axes = new THREE.AxesHelper(100)
    axes.position.set(0, 0, 0)
    this.scene.add(axes)
  }

  createControls () {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    // controls.autoRotate = true
    // controls.enabled = false

    controls.screenSpacePanning = false;

    controls.minDistance = 5;
    controls.maxDistance = 300;

    controls.maxPolarAngle = Math.PI / 2.01;

    controls.update()
    this.controls = controls
  }

  addPlane () {
    var textureGrass = new THREE.TextureLoader().load("/textures/ground/grasslight-big.jpg");
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(10, 10);

    var planeGeometry = new THREE.PlaneGeometry(500, 500, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
      map: textureGrass
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    this.scene.add(plane);
  }

  addCube () {
    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    cube.position.set(-60, 3, 10);

    // add the cube to the scene
    this.scene.add(cube);
  }

  addLights () {
    const ambienLight = new THREE.AmbientLight(0xffffff, .8)
    this.scene.add(ambienLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(20, 0, 35);
    this.scene.add(dirLight);
    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 15 );
    this.scene.add( dirLightHelper );

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff, 1, 500, Math.PI / 4);
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(10, 10, 10);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
    // spotLightHelper
    const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    this.scene.add( spotLightHelper );
  }

  addWorkerModel () {
    const loader = new GLTFLoader()
    const scene = this.scene
  
    loader.load(
      '/model/worker.gltf',
      function onLoad (mesh) {
        console.log(mesh)
  
        const sceneGroup = mesh.scene

        sceneGroup.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })
        sceneGroup.scale.set(0.1, 0.1, 0.1)
        sceneGroup.position.set(0, 0, 10)
  
        // spotLight.target = new THREE.Object3D()
        scene.add(sceneGroup)
      },
      function onProcess (data) {
        console.log('process', data)
      },
      function onError (err) {
        console.log('error', err)
      }
    )
  }

  init () {
    this.createRenderer()
    this.createScene()
    this.createCamera()
  
    this.createControls()
  
    this.addLights()
    this.addPlane()
    this.addWorkerModel()
    this.addCube()
  
    // const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    // hemiLight.position.set(0, 500, 0);
    // scene.add(hemiLight)
  
    const animate = () => {
      requestAnimationFrame(animate)
  
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }
  
    animate()
  }

  componentDidMount() {
    this.init()
  }

  render () {
    console.log('app render')
    return (
      <div id="app">
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
