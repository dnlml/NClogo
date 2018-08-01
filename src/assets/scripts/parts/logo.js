/* eslint-env browser */
const THREE = require('three');
const GLTFLoader = require('three-gltf-loader');
const lerp = require('../helpers/lerp');
require('./../helpers/dracoloader');

class Logo {
  constructor() {
    this.sx = 0;
    this.sy = 0;
    this.dx = 0;
    this.dy = 0;
    this.wW = window.innerWidth;
    this.wH = window.innerHeight;
    this.init();
  }

  init() {
    this.createScene();
    this.createLights();
    this.createShader();
    this.loadLogo();
  }

  createScene() {
    this.container = document.getElementById('logo');
    this.camera = new THREE.PerspectiveCamera(95, this.wW / this.wH, 0.1, 1000);
    this.camera.position.set(0, 0.25, 3);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x777777, 1, 4);
  }

  createLights() {
    this.ambientlight = new THREE.HemisphereLight(0xffffff, 0xffffff, 10);
    this.ambientlight.position.set(0, 0, 0);
    this.scene.add(this.ambientlight);

    this.spotlight = new THREE.PointLight(0xffffff);
    this.spotlight.angle = Math.PI / 4;
    this.spotlight.intensity = 10;
    this.spotlight.penumbra = 1;
    this.spotlight.castShadow = false;
    this.spotlight.position.set(0, -1, 0);
    this.scene.add(this.spotlight);
  }

  createShader() {
    this.uniforms = {
      u_resolution: { type: 'v2', value: new THREE.Vector2(this.wW, this.wH) },
      u_time: { type: 'f', value: 1.0 },
      u_mouse: { type: 'v2', value: new THREE.Vector2(this.dx, this.dy) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
    });

    const geo = new THREE.PlaneGeometry(this.wW, this.wH);
    const plane = new THREE.Mesh(geo, material);
    plane.position.z = -1.0;
    this.scene.add(plane);
  }

  loadLogo() {
    const loader = new GLTFLoader();
    THREE.DRACOLoader.setDecoderPath('../3d');
    THREE.DRACOLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(new THREE.DRACOLoader());

    loader.load(
      '../../assets/3d/NC.gltf',
      (gltf) => {
        this.imported = gltf;
        this.scene.add(this.imported.scene);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.wW, this.wH);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.render();
      },
    );
  }

  onWindowResize() {
    this.wW = window.innerWidth;
    this.wH = window.innerHeight;
    this.renderer.setSize(this.wW, this.wH);
    this.camera.aspect = this.wW / this.wH;
    this.uniforms.u_resolution = {
      type: 'v2',
      value: new THREE.Vector2(this.wW, this.wH),
    };
    this.camera.updateProjectionMatrix();
  }

  onMouseMove(e) {
    this.sx = e.pageX;
    this.sy = e.pageY;
  }

  render() {
    this.uniforms.u_time.value += 0.05;
    this.dx = lerp(this.dx, this.sx, 0.1) || 0;
    this.dy = lerp(this.dy, this.sy, 0.1) || 0;
    this.uniforms.u_mouse.value.x = this.dx / 1000;
    this.uniforms.u_mouse.value.y = this.dy / 5000;
    this.camera.position.x = -this.dx / 10000;
    this.camera.position.y = this.dy / 5000;
    this.imported.scene.rotation.x = (this.dy - (this.wH / 2)) / 10000;
    this.imported.scene.rotation.y = (this.dx - (this.wW / 2)) / 100000;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

module.exports = Logo;
