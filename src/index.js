import React from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { default as SpriteText } from 'three-spritetext'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { throttle } from 'lodash'
import './index.css'

class App extends React.Component {
  camera = null
  scene = null
  renderer = null
  controls = null
  mixers = []
  // 物体选中处理器
  pickHandlers = []
  hoverHandlers = []

  createRenderer () {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha:true
    })
  
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor( 0x000000, 0 );
    renderer.shadowMap.enabled = true
    renderer.setPixelRatio(window.devicePixelRatio)
    console.log(renderer)
    document.body.appendChild(renderer.domElement)

    this.renderer = renderer
  }

  createCamera () {
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 1000)

    camera.position.set(100, 40, 100)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, false)

    this.camera = camera
    this.scene.add(camera)

    const helper = new THREE.CameraHelper( camera );
    // this.scene.add( helper );
  }

  createScene () {
    const texture = new THREE.TextureLoader().load('/textures/env/day_01.jpg')
    this.scene = new THREE.Scene()

    this.scene.background = texture
    // AxesHelper: x red, y green, z blue
    const axes = new THREE.AxesHelper(100)
    axes.position.set(0, 0, 0)
    this.scene.add(axes)
  }

  createControls () {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = .1;
    // controls.autoRotate = true
    // controls.enabled = false

    controls.screenSpacePanning = false;

    controls.minDistance = 60;
    controls.maxDistance = 200;

    controls.maxPolarAngle = Math.PI / 2.01;

    controls.update()
    this.controls = controls
  }

  addLights () {
    const ambienLight = new THREE.AmbientLight(0xffffff, 1)
    this.scene.add(ambienLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff, 1, 500, Math.PI * 0.4);
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(50, 50, 100);
    spotLight.castShadow = true;
    // this.scene.add(spotLight);
    // spotLightHelper
    const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // this.scene.add( spotLightHelper );
  
    // 半球光
    // const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, .5);
    // hemiLight.position.set(0, 500, 0);
    // this.scene.add(hemiLight)

    // 上方、前后、左右平行光设置
    const dirLight = new THREE.DirectionalLight(0xffffff, .5);
    const dirLight1 = new THREE.DirectionalLight(0xffffff, .4);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, .4);
    const dirLight3 = new THREE.DirectionalLight(0xffffff, .3);
    const dirLight4 = new THREE.DirectionalLight(0xffffff, .3);
    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 100 );

    dirLight.position.set(0, 100, 0); // 上方
    dirLight1.position.set(500, 0, 0); // 右边
    dirLight2.position.set(-500, 0, 0); // 左边
    dirLight3.position.set(0, 0, 500); // 前边
    dirLight4.position.set(0, 0, -500); // 后边
    this.scene.add(dirLight);
    this.scene.add(dirLight1);
    this.scene.add(dirLight2);
    this.scene.add(dirLight3);
    this.scene.add(dirLight4);
    // this.scene.add( dirLightHelper );

    // const spotLight2 = new THREE.SpotLight(0xffffff, 1, 500, Math.PI / 4);
    // spotLight2.shadow.mapSize.set(2048, 2048);
    // spotLight2.position.set(50, 50, -50);
    // spotLight2.castShadow = true;
    // this.scene.add(spotLight2);
    // spotLightHelper
    // const spotLightHelper2 = new THREE.SpotLightHelper( spotLight2 );
    // this.scene.add( spotLightHelper2 );
  }

  addPlane () {
    var textureGrass = new THREE.TextureLoader().load("/textures/ground/grasslight-big.jpg");
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(10, 10);

    var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
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
      function onProcess (xhr) {
        console.log('worker:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      function onError (err) {
        console.log('error', err)
      }
    )
  }

  addRobot () {
    const loader = new GLTFLoader()

    loader.load(
      '/model/RobotExpressive.glb',
      (model) => {
        console.log('addRobot', model)
        const robotScene = model.scene

        robotScene.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })
        robotScene.position.set(10, 0, 20)
        robotScene.scale.set(2, 2, 2)
        robotScene.rotateY(Math.PI/4)
        this.scene.add(robotScene)
      },
      xhr => {
        console.log('robot:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' , xhr);
      },
      err => {
        console.log('addRobot-err', err)
      }
    )
  }

  addTextaure () {
    const loader = new GLTFLoader()

    loader.load(
      '/model/textaure.glb',
      (model) => {
        console.log('addRobot', model)
        const group = model.scene

        group.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })
        group.position.set(10, 0, 20)
        group.scale.set(2, 2, 2)
        group.rotateY(Math.PI/4)
        this.scene.add(group)
      },
      xhr => {
        console.log('addTextaure:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' , xhr);
      },
      err => {
        console.log('addTextaure-err', err)
      }
    )
  }

  addOBJModel () {
    const loader = new OBJLoader()

    loader.load(
      '/model/122.obj',
      (model) => {
        console.log('addOBJModel', model)
        const group = model

        group.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })
        group.position.set(-40, 10, 30)
        group.scale.set(2, 2, 2)
        group.rotateY(Math.PI/4)
        this.scene.add(group)
      },
      xhr => {
        console.log('addOBJModel:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' , xhr);
      },
      err => {
        console.log('addOBJModel-err', err)
      }
    )
  }

  addSprite (pos) {
    // const material = new THREE.SpriteMaterial({ color: 0x000000, opacity: .6 })
    // const sprite = new THREE.Sprite(material)

    // sprite.scale.set(10,10,1)
    // this.scene.add(sprite)
    const text = new SpriteText('螺丝', 1)

    text.backgroundColor = 'rgba(0,0,0,.6)'
    text.padding = 2
    text.borderWidth = .5
    text.borderColor = 'yellow'
    text.borderRadius = 1
    text.fontSize = 80
    // text.position.copy(pos)
    text.position.set(13, 14, 30)
    text.scale.set(5,3,1)
    this.scene.add(text)
  }

  addDevice () {
    const loader = new GLTFLoader()

    loader.load(
      '/model/device.glb',
      (model) => {
        console.log('addDevice', model)
        const robotScene = model.scene

        robotScene.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })
        robotScene.name = 'DEVICE'
        robotScene.position.set(10, 0, 20)
        robotScene.scale.set(2, 2, 2)
        robotScene.rotateY(Math.PI/4)
        this.scene.add(robotScene)
      },
      xhr => {
        console.log('addDevice:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' , xhr);
      },
      err => {
        console.log('addDevice-err', err)
      }
    )
  }

  addDeviceAnim () {
    const loader = new GLTFLoader()

    loader.load(
      '/model/anim.glb',
      (model) => {
        console.log('addDevice', model)
        const robotScene = model.scene

        robotScene.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })
        robotScene.name = 'DEVICE'
        robotScene.position.set(10, 5, 25)
        robotScene.scale.set(1, 1, 1)
        robotScene.rotateY(Math.PI/4)
        this.scene.add(robotScene)
        this.deviceGroup = model
      },
      xhr => {
        console.log('addDevice:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' , xhr);
      },
      err => {
        console.log('addDevice-err', err)
      }
    )
  }

  addHuaLun () {
    const loader = new GLTFLoader()

    loader.load(
      '/model/hualun.glb',
      (model) => {
        console.log('addHuaLun', model)
        const robotScene = model.scene

        robotScene.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
          }
        })
        robotScene.name = 'hualun'
        robotScene.position.set(30, 5, -5)
        robotScene.scale.set(.1, .1, .1)
        robotScene.rotateY(Math.PI/4)
        this.scene.add(robotScene)
        this.hualunGroup = model
      },
      xhr => {
        console.log('addHuaLun:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' , xhr);
      },
      err => {
        console.log('addHuaLun-err', err)
      }
    )
  }

  _selectDevice (e, scene) {
    e.preventDefault()
    // console.log('x', e.clientX, 'y', e.clientY)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, this.camera)

    return raycaster.intersectObjects(scene.children)
  }
  _changeMaterail (obj) {
    const mat = new THREE.MeshLambertMaterial({
      color: 0x333333,
      transparent: obj.material.transparent ? false : true,
      opacity: 1
    })

    obj.material = mat
    // if (obj.name === 'Layer0') {
    //   obj.translateY(20)
    // } else if (obj.name === 'Layer0001') {
    //   obj.translateY(-20)
    // }
  }
  _addEvent () {
    this.renderer.domElement.addEventListener('click', (e) => {
      const deviceScene = this.scene.children.find(item => item.name === 'DEVICE')
      const hualunScene = this.scene.children.find(item => item.name === 'hualun')
      const selectDevice = this._selectDevice(e, deviceScene)
      const selectHualun = this._selectDevice(e, hualunScene)
      const selectNodes = this._selectDevice(e, this.scene)

      this.pickHandlers.forEach(handler => {
        if (typeof handler === 'function') {
          handler(selectNodes)
        }
      })

      if (selectDevice && selectDevice.length > 0) {
        // 选中了 device 场景
        // deviceScene.traverse(item => {
        //   if (item.isMesh) {
        //     this._changeMaterail(item)
        //   }
        // })
        
        const clips = this.deviceGroup.animations
        const animMixer = new THREE.AnimationMixer(this.deviceGroup.scene)

        // clips.forEach(clip => {
        //   animMixer.clipAction(clip).setDuration(1).setLoop(THREE.LoopPingPong, 2).play()
        // })
        const action = animMixer.clipAction(clips[0])

        action.clampWhenFinished = true
        action.setDuration(1).setLoop(THREE.LoopRepeat, 1).play()
        this.mixers.push(animMixer)
        const obj = this.scene.getObjectByName('Layer0')
        this.addSprite(obj.position)
        this._changeMaterail(obj)

        var opa1 = new TWEEN.Tween(obj.material)
        var opa2 = new TWEEN.Tween(obj.material)

        opa1.to({
          opacity: 0.6
        }, 800)
        .easing(TWEEN.Easing.Linear.None)
        .delay(100)
        // .onUpdate(function (object) {
        //   console.log('1', object.opacity)
        // })
        opa2.to({
          opacity: 1
        }, 800)
        .easing(TWEEN.Easing.Linear.None)
        // .onUpdate(function (object) {
        //   console.log('2', object.opacity)
        // })

        opa1.chain(opa2)
        opa2.chain(opa1)

        opa1.start()
      }
      if (selectHualun && selectHualun.length > 0) {
        const clips = this.hualunGroup.animations
        const mixer = new THREE.AnimationMixer(this.hualunGroup.scene)

        this.mixers.push(mixer)
        clips.forEach(clip => {
          const action = mixer.clipAction(clip)
          action.clampWhenFinished = true
          action.setDuration(2).setLoop(THREE.LoopOnce).play()
        })
      }
    }, false)

    this.renderer.domElement.addEventListener('pointermove', throttle(e => {
      // console.log('move', e)
      const selectNodes = this._selectDevice(e, this.scene)
      this.hoverHandlers.forEach(handler => {
        if (typeof handler === 'function') {
          handler(selectNodes)
        }
      })
    }, 50), false)
  }

  addWindFan () {
    const loader = new GLTFLoader()

    loader.load(
      // '/model/windfan.glb',
      '/model/windfan2.gltf',
      (model) => {
        console.log('addWindFan', model)
        const rootScene = model.scene
        const wireframeNodes = []

        rootScene.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true
            node.receiveShadow = true
            node.material.depthWrite = true

            if (node.material.name === 'jinshu') {
              node.userData.canHover = true
            }
            if (node.name === '轮毂' || node.name === '后壳上半部分' || node.name === '后壳下半部分') {
              node.userData.canPicker = true
            }
          }

          if (/wireframe$/.test(node.name)) {
            const lineMaterial = new THREE.LineBasicMaterial( {
              color: 0xffcb2b,
              linewidth: 1,
              opacity: 0.5,
              transparent: true,
              linecap: 'round', //ignored by WebGLRenderer
              linejoin:  'round' //ignored by WebGLRenderer
            })

            wireframeNodes.push(node)
            node.material = node.material.clone() // 克隆材质
            node.material.visible = false; // 隐藏轮廓模型对象，该轮廓模型主要用于生成轮廓线
            // node.scale.set(0.99, 0.99, 0.99)
            const wireframe = new THREE.WireframeGeometry( node.geometry );

            const line = new THREE.LineSegments( wireframe, lineMaterial );
            line.position.copy(node.position)
            line.rotation.copy(node.rotation)
            line.scale.copy(node.scale)
            line.material.visible = false
            line.name = `${node.name}-line`
            line.userData.canPicker = true

            rootScene.add( line );
          }
        })

        // 删除 wireframe 节点
        wireframeNodes.forEach(node => node.removeFromParent())

        // 基础场景
        rootScene.name = 'windfan'
        rootScene.position.set(0, 50, 0)
        rootScene.scale.set(.05, .05, .05)
        rootScene.rotateY(Math.PI)
        this.scene.add(rootScene)
        // this.hualunGroup = model

        // 设置动画
        const clips = model.animations
        const wireframeClip = clips.find(item => item.name === '轮毂Action')
        const mixer = new THREE.AnimationMixer(rootScene)

        if (wireframeClip) {
          // 辅助 轮毂 的旋转动画到 轮廓线物体上
          const cloneClip = wireframeClip.clone()
          cloneClip.name = cloneClip.name.replace('轮毂', '轮毂wireframe-line')
          cloneClip.tracks.forEach(track => {
            track.name = track.name.replace('轮毂', '轮毂wireframe-line')
          })
          clips.push(cloneClip)
        }

        this.mixers.push(mixer)
        clips.forEach(clip => {
          const action = mixer.clipAction(clip)
          action.setDuration(3).play()
        })

        // 复制基础场景和动画
        const copyScene = (xOffset = 0, zOffset = 0) => {
          const copy = rootScene.clone()
          const mixer = new THREE.AnimationMixer(copy)

          // copy.name = ''
          copy.position.x = xOffset
          copy.position.z = zOffset

          clips.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.setDuration(3).play()
          })

          // 复制 wireframe 材质
          copy.traverse(node => {
            if (node.isLineSegments) {
              node.material = node.material.clone()
            }
          })

          this.scene.add(copy)
          this.mixers.push(mixer)
        }

        const xOffset = 100
        const zOffset = 100
        // 复制场景
        for (let i = 1; i < 5; i++) {
          for(let j = 0; j < 5; j++) {
            j > 0 && copyScene(0, -zOffset*j)
            copyScene(xOffset*i, -zOffset*j)
            copyScene(-xOffset*i, -zOffset*j)
          }
        }

        // 添加选中事件
        this.pickHandlers.push((selectNodes) => {
          if (selectNodes.length < 1 || selectNodes[0].object.parent.name !== 'windfan') return // 最先选择的不是发电机相关的物体
          let select = selectNodes[0].object
          let line = null

          // 因为轮廓线是根据物体重构网格生成的，有可能超出源物体的边界
          // 因此选择物体时有可能首先选中的就是轮廓线
          if (select.isLineSegments) {
            // 选中的是轮廓线
            line = select
            const selectName = line.name.replace('wireframe-line', '')
            select = (selectNodes.find(node => node.object.name === selectName) || {}).object
          } else {
            line = select.parent ? select.parent.getObjectByName(`${select.name}wireframe-line`) : null
          }

          if (!select || !select.userData.canPicker) return
          select.material = select.material.clone()
          select.material.transparent = true
          select.material.opacity = .4

          if (line) {
            line.material.visible = true
          }

          console.log(select, line)
        })

        this.hoverHandlers.push(selectNodes => {
          const hoverObject = (selectNodes.find(item => item.object.userData.canHover) || {}).object

          if (hoverObject) {
          }
        })
      },
      xhr => {
        // console.log('addWindFan:', ( xhr.loaded / xhr.total * 100 ) + '% loaded' , xhr);
      },
      err => {
        console.log('addWindFan-err', err)
      }
    )
  }

  createLabel () {
    const map = new THREE.TextureLoader().load( '/textures/label.png' );
    const material = new THREE.SpriteMaterial( { map: map, color: 0x000000 } );

    const sprite = new THREE.Sprite( material );
    sprite.scale.set(20, 20, 1)
    sprite.position.set(0, 60, 0)
    this.scene.add( sprite );
  }

  init () {
    this.createRenderer()
    this.createScene()
    this.createCamera()
  
    this.createControls()
  
    this.addLights()
    this.addPlane()
    // this.addWorkerModel()
    // this.addCube()
    this.addRobot()
    // this.addTextaure()
    // this.addOBJModel()
    // this.addDevice()
    this.addDeviceAnim()
    this.addHuaLun()
    this.addWindFan()
    this.createLabel()

    this._addEvent()

    const clock = new THREE.Clock()
  
    const animate = () => {
      const delta = clock.getDelta()
      requestAnimationFrame(animate)
  
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      TWEEN.update()

      this.mixers.forEach(mixer => {
        mixer.update(delta)
      })
    }
  
    animate()
  }

  componentDidMount() {
    this.init()
    window.reactIns = this
    window.THREE = THREE
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
