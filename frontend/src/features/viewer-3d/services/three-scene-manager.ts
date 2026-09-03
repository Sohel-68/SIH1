import * as THREE from "three";
import type {
  DigitalTwinNode,
  SectionCutMode,
  Measurement3DType,
  Measurement3DResult,
} from "../types/twin-types";

export class ThreeSceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  public perspCamera: THREE.PerspectiveCamera;
  public orthoCamera: THREE.OrthographicCamera;
  public renderer: THREE.WebGLRenderer | null = null;
  public container: HTMLElement;

  // Lights
  public sunLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public hemiLight: THREE.HemisphereLight;

  // Meshes & Groups
  public buildingGroup: THREE.Group;
  public floorGroups: Map<number, THREE.Group> = new Map();
  public unitMeshes: Map<string, THREE.Mesh> = new Map();
  public groundMesh: THREE.Mesh | null = null;
  public parcelOutline: THREE.LineSegments | null = null;

  // Clipping Planes
  public horizontalClipPlane: THREE.Plane;
  public verticalClipPlaneX: THREE.Plane;
  public verticalClipPlaneZ: THREE.Plane;

  // Raycasting
  public raycaster: THREE.Raycaster;
  public mouse: THREE.Vector2;

  // Orbit state
  public isDragging = false;
  public prevMouse = { x: 0, y: 0 };
  public spherical = new THREE.Spherical(95, Math.PI / 3.5, Math.PI / 4);
  public target = new THREE.Vector3(0, 27, 0);

  private animationFrameId: number | null = null;
  private onSelectCallback: ((nodeId: string | null) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Slate-900 Dark canvas

    // 2. Cameras
    const aspect = width / height;
    this.perspCamera = new THREE.PerspectiveCamera(45, aspect, 0.5, 2000);
    this.orthoCamera = new THREE.OrthographicCamera(
      -40 * aspect,
      40 * aspect,
      40,
      -40,
      0.5,
      2000
    );
    this.camera = this.perspCamera;
    this.updateCameraPosition();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.localClippingEnabled = true;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.4);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 250;
    this.sunLight.shadow.camera.left = -60;
    this.sunLight.shadow.camera.right = 60;
    this.sunLight.shadow.camera.top = 60;
    this.sunLight.shadow.camera.bottom = -60;
    this.sunLight.position.set(45, 75, 45);
    this.scene.add(this.sunLight);

    // 5. Clipping Planes
    this.horizontalClipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
    this.verticalClipPlaneX = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 100);
    this.verticalClipPlaneZ = new THREE.Plane(new THREE.Vector3(0, 0, -1), 100);

    // 6. Building Group
    this.buildingGroup = new THREE.Group();
    this.scene.add(this.buildingGroup);

    // 7. Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupGroundAndGrid();
    this.bindEvents();
    this.startLoop();
  }

  private setupGroundAndGrid() {
    // Cadastral Ground Plane (2D-to-3D baseline)
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1,
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // Cadastral Parcel Outline Boundary (P-401/A)
    const parcelGeo = new THREE.BufferGeometry();
    const parcelVertices = new Float32Array([
      -18, 0.05, -18,
       18, 0.05, -18,
       18, 0.05,  18,
      -18, 0.05,  18,
      -18, 0.05, -18,
    ]);
    parcelGeo.setAttribute("position", new THREE.BufferAttribute(parcelVertices, 3));
    const parcelMat = new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 });
    this.parcelOutline = new THREE.LineSegments(parcelGeo, parcelMat);
    this.scene.add(this.parcelOutline);

    // Procedural Grid
    const grid = new THREE.GridHelper(120, 30, 0x475569, 0x334155);
    grid.position.y = 0.01;
    this.scene.add(grid);
  }

  public populateDigitalTwin(nodes: DigitalTwinNode[]) {
    // Clear previous
    this.floorGroups.forEach((group) => this.buildingGroup.remove(group));
    this.floorGroups.clear();
    this.unitMeshes.clear();

    const floorHeight = 3.0;

    // 18 Floors
    for (let f = 1; f <= 18; f++) {
      const floorGroup = new THREE.Group();
      floorGroup.position.y = (f - 1) * floorHeight;
      this.floorGroups.set(f, floorGroup);
      this.buildingGroup.add(floorGroup);

      // Floor Slab (Concrete base)
      const slabGeo = new THREE.BoxGeometry(24, 0.25, 24);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.7,
        clippingPlanes: this.getActiveClippingPlanes(),
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.y = 0.125;
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      floorGroup.add(slabMesh);

      // Central Structural Elevator Core
      const coreGeo = new THREE.BoxGeometry(6, floorHeight - 0.25, 6);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8,
        clippingPlanes: this.getActiveClippingPlanes(),
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = (floorHeight - 0.25) / 2 + 0.25;
      coreMesh.castShadow = true;
      floorGroup.add(coreMesh);

      // 4 Quadrant Strata Units (NW, NE, SE, SW)
      const unitOffsets = [
        { uNum: `${f}01`, x: -6, z: -6, color: 0x3b82f6 },
        { uNum: `${f}02`, x:  6, z: -6, color: f === 5 ? 0x06b6d4 : 0x3b82f6 }, // Unit 502 highlighted in Cyan
        { uNum: `${f}03`, x:  6, z:  6, color: 0x3b82f6 },
        { uNum: `${f}04`, x: -6, z:  6, color: 0x3b82f6 },
      ];

      unitOffsets.forEach((u) => {
        const unitId = `node-twin-unit-${u.uNum}`;
        const unitGeo = new THREE.BoxGeometry(10, floorHeight - 0.35, 10);
        const unitMat = new THREE.MeshStandardMaterial({
          color: u.color,
          roughness: 0.3,
          metalness: 0.2,
          transparent: true,
          opacity: f === 5 ? 0.9 : 0.82,
          clippingPlanes: this.getActiveClippingPlanes(),
        });
        const unitMesh = new THREE.Mesh(unitGeo, unitMat);
        unitMesh.position.set(u.x, (floorHeight - 0.35) / 2 + 0.3, u.z);
        unitMesh.castShadow = true;
        unitMesh.receiveShadow = true;
        unitMesh.userData = { nodeId: unitId, floorNumber: f, unitNumber: u.uNum };

        floorGroup.add(unitMesh);
        this.unitMeshes.set(unitId, unitMesh);
      });
    }
  }

  public setExplodedViewOffset(offset: number) {
    const floorHeight = 3.0;
    this.floorGroups.forEach((group, f) => {
      // Offset each floor vertically proportional to floor index
      const baseElevation = (f - 1) * floorHeight;
      const explodedElevation = baseElevation + (f - 1) * offset * 3.5;
      group.position.y = explodedElevation;
    });
  }

  public applyFloorIsolation(
    isolatedFloor: number | null,
    hideAbove: number | null,
    hideBelow: number | null
  ) {
    this.floorGroups.forEach((group, f) => {
      let isVisible = true;
      if (isolatedFloor !== null && f !== isolatedFloor) {
        isVisible = false;
      }
      if (hideAbove !== null && f > hideAbove) {
        isVisible = false;
      }
      if (hideBelow !== null && f < hideBelow) {
        isVisible = false;
      }
      group.visible = isVisible;
    });
  }

  public applySectionCut(mode: SectionCutMode, position: number) {
    if (mode === "horizontal") {
      this.horizontalClipPlane.constant = position;
    } else if (mode === "vertical-x") {
      this.verticalClipPlaneX.constant = position;
    } else if (mode === "vertical-z") {
      this.verticalClipPlaneZ.constant = position;
    }

    const planes = this.getActiveClippingPlanes(mode);
    this.unitMeshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.Material) {
        mesh.material.clippingPlanes = planes;
      }
    });
  }

  private getActiveClippingPlanes(mode: SectionCutMode = "none"): THREE.Plane[] {
    if (mode === "horizontal") return [this.horizontalClipPlane];
    if (mode === "vertical-x") return [this.verticalClipPlaneX];
    if (mode === "vertical-z") return [this.verticalClipPlaneZ];
    return [];
  }

  public highlightNode(nodeId: string | null) {
    this.unitMeshes.forEach((mesh, id) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (id === nodeId) {
        mat.emissive = new THREE.Color(0x06b6d4);
        mat.emissiveIntensity = 0.6;
      } else {
        mat.emissive = new THREE.Color(0x000000);
        mat.emissiveIntensity = 0;
      }
    });
  }

  public setSunLighting(altitudeDeg: number, azimuthDeg: number, mode: string) {
    const altRad = (altitudeDeg * Math.PI) / 180;
    const azRad = (azimuthDeg * Math.PI) / 180;
    const distance = 80;

    const x = distance * Math.cos(altRad) * Math.sin(azRad);
    const y = distance * Math.sin(altRad);
    const z = distance * Math.cos(altRad) * Math.cos(azRad);

    this.sunLight.position.set(x, y, z);

    if (mode === "night") {
      this.scene.background = new THREE.Color(0x030712);
      this.ambientLight.intensity = 0.15;
      this.sunLight.intensity = 0.2;
    } else if (mode === "golden-hour") {
      this.scene.background = new THREE.Color(0x18101e);
      this.ambientLight.intensity = 0.5;
      this.sunLight.color.setHex(0xfbbf24);
      this.sunLight.intensity = 1.3;
    } else {
      this.scene.background = new THREE.Color(0x0f172a);
      this.ambientLight.intensity = 0.45;
      this.sunLight.color.setHex(0xfff8e7);
      this.sunLight.intensity = 1.2;
    }
  }

  public setCameraProjection(isOrtho: boolean) {
    this.camera = isOrtho ? this.orthoCamera : this.perspCamera;
    this.updateCameraPosition();
  }

  public setCameraBookmark(pos: [number, number, number], target: [number, number, number]) {
    this.target.set(target[0], target[1], target[2]);
    const offset = new THREE.Vector3(pos[0], pos[1], pos[2]).sub(this.target);
    this.spherical.setFromVector3(offset);
    this.updateCameraPosition();
  }

  public onSelect(cb: (nodeId: string | null) => void) {
    this.onSelectCallback = cb;
  }

  private updateCameraPosition() {
    this.spherical.radius = Math.max(10, Math.min(300, this.spherical.radius));
    this.spherical.phi = Math.max(0.01, Math.min(Math.PI / 2 - 0.01, this.spherical.phi));

    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  private bindEvents() {
    const el = this.renderer?.domElement;
    if (!el) return;

    el.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    el.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;

      this.spherical.theta -= dx * 0.007;
      this.spherical.phi -= dy * 0.007;

      this.updateCameraPosition();
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.spherical.radius += e.deltaY * 0.08;
      this.updateCameraPosition();
    });

    el.addEventListener("click", (e) => {
      const rect = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.buildingGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData?.nodeId && this.onSelectCallback) {
          this.onSelectCallback(hit.userData.nodeId);
        }
      }
    });

    window.addEventListener("resize", () => {
      if (!this.container || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      const aspect = w / h;

      this.perspCamera.aspect = aspect;
      this.perspCamera.updateProjectionMatrix();

      this.orthoCamera.left = -40 * aspect;
      this.orthoCamera.right = 40 * aspect;
      this.orthoCamera.top = 40;
      this.orthoCamera.bottom = -40;
      this.orthoCamera.updateProjectionMatrix();

      this.renderer.setSize(w, h);
    });
  }

  private startLoop() {
    const loop = () => {
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  public dispose() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}
