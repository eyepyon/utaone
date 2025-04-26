'use client'

import React from 'react';
import axios from 'axios';
import { WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight, Color, DirectionalLightHelper } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { OrbitControls } from 'three-orbitcontrols-ts';

export class ThreeScene extends React.Component {
  #canvas = null;
  #scene = null;
  #camera = null;
  #renderer = null;
  #frameId = null;

  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {}

  onCanvasLoaded = (canvas) => {
    this.#initScene(canvas);
    axios.get("/threedmodels/vrms/AliciaSolid.vrm", { responseType: 'arraybuffer' }).then((res) => {
      this.updateVrmArryaBuffer(res.data);
    });
    const cyberStagePartUrls = ["/threedmodels/stages/CyberStages/CyberStage_AB.glb","/threedmodels/stages/CyberStages/CyberStage_C_Screen.glb","/threedmodels/stages/CyberStages/CyberStage_D.glb"]
    for(const cyberStagePartUrl of cyberStagePartUrls) {
      axios.get(cyberStagePartUrl, { responseType: 'arraybuffer' }).then((res) => {
        this.updateGlbArryaBuffer(res.data);
      });
    }
  };

  #initScene(canvas) {
    if (!canvas) {
      return;
    }
    const renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.#canvas = canvas;
    const scene = new Scene();
    scene.background = new Color(0x212121);

    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, -2);
    scene.add(directionalLight);

    //DirectionalLightHelper: 光源に一と方向を可視化するデバッグのために入れるもの参考: https://qiita.com/kskwtnk/items/157b04ffef659dc5f7d9
    const directionalLightHelper = new DirectionalLightHelper(directionalLight, 2);
    scene.add(directionalLightHelper);

    this.#scene = scene;
    const camera = new PerspectiveCamera(50, width / height, 0.01);
    camera.position.set(0, 1.5, -2.5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.75 * 1.5, 0);
    controls.update();
    this.#camera = camera;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer = renderer;
    this.animate();
  }

  async updateVrmUrl(url) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    const gltf = await gltfLoader.loadAsync(url);
    const vrm = gltf.userData.vrm;
    if (this.#scene) {
      this.#scene.add(vrm.scene);
    }
    return vrm;
  }

  async updateVrmArryaBuffer(arrayBuffer) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    const gltf = await gltfLoader.parseAsync(arrayBuffer, '');
    const vrm = gltf.userData.vrm;
    if (this.#scene) {
      this.#scene.add(vrm.scene);
    }
    return vrm;
  }

  async updateGlbArryaBuffer(arrayBuffer) {
    const gltfLoader = new GLTFLoader();
    const gltf = await gltfLoader.parseAsync(arrayBuffer, '');
    console.log(gltf);
    if (this.#scene) {
      this.#scene.add(gltf.scene);
    }
    return gltf;
  }

  animate() {
    // 次のフレームを要求
    this.#frameId = window.requestAnimationFrame(this.animate);
    if (this.#renderer && this.#scene && this.#camera) {
      this.#renderer.render(this.#scene, this.#camera);
    }
  }

  render() {
    return (
      <div>
        <canvas style={{ width: '90vw', height: '40vw' }} ref={this.onCanvasLoaded} />
      </div>
    );
  }
}