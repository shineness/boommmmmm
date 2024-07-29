<template>
  <h1>Hello threejs</h1>
  <input
    type="range"
    min="-100"
    ref="myRange"
    max="100"
    value="0"
    class="slider"
    id="myRange"
    style="position: absolute; top: 10; width: 350px"
  />
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'

const { proxy } = getCurrentInstance()
//模型包围盒
var modelBox3 = new THREE.Box3()

var meshBox3 = new THREE.Box3()
import * as THREE from 'three'

import Stats from 'three/addons/libs/stats.module.js'

let stats
let camera, scene, raycaster, renderer
const group = new THREE.Group()

let theta = 0
let INTERSECTED

const pointer = new THREE.Vector2()
const radius = 25
const frustumSize = 50
onMounted(() => {
  init()
})

function init() {
  const aspect = window.innerWidth / window.innerHeight
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    100
  )

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)

  const geometry = new THREE.BoxGeometry()

  for (let i = 0; i < 2000; i++) {
    const object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    )

    object.position.x = Math.random() * 40 - 20
    object.position.y = Math.random() * 40 - 20
    object.position.z = Math.random() * 40 - 20

    object.rotation.x = Math.random() * 2 * Math.PI
    object.rotation.y = Math.random() * 2 * Math.PI
    object.rotation.z = Math.random() * 2 * Math.PI

    object.scale.x = Math.random() + 0.5
    object.scale.y = Math.random() + 0.5
    object.scale.z = Math.random() + 0.5
    group.add(object)
    scene.add(group)
  }
  modelBox3.expandByObject(group)
  //计算模型的中心点坐标，这个为爆炸中心
  var modelWorldPs = new THREE.Vector3()
    .addVectors(modelBox3.max, modelBox3.min)
    .multiplyScalar(0.5)

  group.traverse(function (value) {
    if (value.isMesh) {
      meshBox3.setFromObject(value)

      //获取每个mesh的中心点，爆炸方向为爆炸中心点指向mesh中心点
      var worldPs = new THREE.Vector3().addVectors(meshBox3.max, meshBox3.min).multiplyScalar(0.1)
      if (isNaN(worldPs.x)) return
      //计算爆炸方向
      value.worldDir = new THREE.Vector3().subVectors(worldPs, modelWorldPs).normalize()
      //保存初始坐标
      value.userData.oldPs = value.getWorldPosition(new THREE.Vector3())
    }
  })

  function applyScalar(scalar) {
    group.traverse(function (value) {
      if (!value.isMesh || !value.worldDir) return

      //爆炸公式
      value.position.copy(
        new THREE.Vector3()
          .copy(value.userData.oldPs)
          .add(new THREE.Vector3().copy(value.worldDir).multiplyScalar(scalar))
      )
    })
  }

  document.querySelector('#myRange').addEventListener('input', function (evt) {
    applyScalar(this.value * 5)
  })
  raycaster = new THREE.Raycaster()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animate)
  document.body.appendChild(renderer.domElement)

  stats = new Stats()
  document.body.appendChild(stats.dom)

  document.addEventListener('pointermove', onPointerMove)

  //

  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight

  camera.left = (-frustumSize * aspect) / 2
  camera.right = (frustumSize * aspect) / 2
  camera.top = frustumSize / 2
  camera.bottom = -frustumSize / 2

  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

//

function animate() {
  render()
  stats.update()
}

function render() {
  theta += 0.1

  camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta))
  camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta))
  camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta))
  camera.lookAt(scene.position)

  camera.updateMatrixWorld()

  // find intersections

  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(scene.children, false)

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

      INTERSECTED = intersects[0].object
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
      INTERSECTED.material.emissive.setHex(0xff0000)
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

    INTERSECTED = null
  }

  renderer.render(scene, camera)
}
</script>
