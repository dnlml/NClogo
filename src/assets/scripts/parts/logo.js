'use strict';
var THREE = require('three');
var GLTFLoader = require('three-gltf-loader');
var lerp = require('../helpers/lerp');
require('./../helpers/dracoloader');

class Logo {
  constructor() {
    this.sx = 0;
    this.sy = 0;
    this.dx = 0;
    this.dy = 0;
    this.init();
  }

  init() {
    var loader = new GLTFLoader();
    THREE.DRACOLoader.setDecoderPath('../3d');
    THREE.DRACOLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(new THREE.DRACOLoader());

    this.container = document.querySelector('#logo');
    this.camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0.25, 3);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x777777, 1, 4);

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


    this.uniforms = {
      resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_time: {type: 'f', value: 1.0}
    };

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });

    var geo = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 1, 1);
    var plane = new THREE.Mesh(geo, material);
    plane.position.z = -2;
    this.scene.add(plane);

    loader.load(
      '../../assets/3d/NC.gltf',
      gltf => {
        this.imported = gltf;
        this.letters = this.imported.scene.children;
        this.scene.add(this.imported.scene);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.render();
      }
    );
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  onMouseMove(e) {
    this.sx = e.pageX;
    this.sy = e.pageY;
  }

  render() {
    this.uniforms.u_time.value += 0.005;
    this.dx = lerp(this.dx, this.sx, 0.1) || 0;
    this.dy = lerp(this.dy, this.sy, 0.1) || 0;
    this.camera.position.x = -this.dx / 10000;
    this.camera.position.y = this.dy / 5000;
    this.imported.scene.rotation.x = (this.dy - window.innerHeight / 2) / 10000;
    this.imported.scene.rotation.y = (this.dx - window.innerWidth / 2) / 100000;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
};

module.exports = Logo;
