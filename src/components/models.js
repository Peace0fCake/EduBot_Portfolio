import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { scene } from './scene.js'

const loader = new GLTFLoader()

export function loadModels() {
  // Example: loader.load('/assets/models/scene.glb', (gltf) => {
  //   scene.add(gltf.scene)
  // })
}
