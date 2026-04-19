/* ============================================
   Unified scene controller — the octahedron is both
   hero ornament AND the interactive projects page.
   ============================================ */

window.initScene3D = function (canvas, opts = {}) {
  const THREE = window.THREE;
  if (!THREE) { console.warn('THREE not loaded'); return; }

  const PROJECTS = opts.projects || [];

  // ---- Renderer / scene ----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Lighting ----
  scene.add(new THREE.AmbientLight(0x2a0e5e, 0.5));
  const key = new THREE.PointLight(0x7c3aed, 60, 20);
  key.position.set(3, 3, 3); scene.add(key);
  const fill = new THREE.PointLight(0xec4899, 25, 20);
  fill.position.set(-3, -2, 2); scene.add(fill);
  const rim = new THREE.PointLight(0xa78bfa, 40, 20);
  rim.position.set(-2, 3, -3); scene.add(rim);

  // ---- Subdivided octahedron approximating a sphere (geodesic-style) ----
  // 8 base faces, each subdivided into smaller triangles for the geodesic look.
  const RADIUS = 1.7;
  const SUBDIV = 3;

  // Base 8-face octahedron — used for big-face centroids / normals.
  const baseGeo = new THREE.OctahedronGeometry(RADIUS, 0);
  const basePos = baseGeo.attributes.position;

  const faceGroup = new THREE.Group();
  const faceMeshes = [];   // one Group per big octahedron face
  const subMeshes  = [];   // flat list of every sub-triangle mesh (raycast target)

  const spherify = (v, r) => v.clone().normalize().multiplyScalar(r);

  // Tessellated sphere — SAME buffer that feeds the wireframe, so sub-mesh
  // fills register exactly under the wires.
  const tileGeo = new THREE.OctahedronGeometry(RADIUS, SUBDIV);
  const tp = tileGeo.attributes.position;
  for (let vi = 0; vi < tp.count; vi++) {
    const v = new THREE.Vector3().fromBufferAttribute(tp, vi).normalize().multiplyScalar(RADIUS);
    tp.setXYZ(vi, v.x, v.y, v.z);
  }
  // Build big-face holders first so sub-triangles can attach by direction.
  const baseNormals = [];
  for (let i = 0; i < 8; i++) {
    const a = new THREE.Vector3().fromBufferAttribute(basePos, i * 3 + 0);
    const b = new THREE.Vector3().fromBufferAttribute(basePos, i * 3 + 1);
    const c = new THREE.Vector3().fromBufferAttribute(basePos, i * 3 + 2);
    const centroid = new THREE.Vector3().addVectors(a, b).add(c).multiplyScalar(1/3);
    const normal = centroid.clone().normalize();
    baseNormals.push(normal);

    const faceHolder = new THREE.Group();
    faceHolder.userData = {
      faceIndex: i,
      centroid: spherify(centroid, RADIUS * 0.98),
      normal: normal.clone(),
      a: a.clone(), b: b.clone(), c: c.clone(),
      project: PROJECTS[i] || null,
      subs: [],
    };
    faceGroup.add(faceHolder);
    faceMeshes.push(faceHolder);
  }

  // Assign every tessellated triangle to the big face whose normal best matches
  // its centroid direction. PolyhedronGeometry does NOT emit tris in per-face
  // sequential order, so the direction test is the only reliable mapping.
  const triCount = (tp.count / 3) | 0;
  for (let tri = 0; tri < triCount; tri++) {
    const base = tri * 3;
    const p1 = new THREE.Vector3().fromBufferAttribute(tp, base + 0);
    const p2 = new THREE.Vector3().fromBufferAttribute(tp, base + 1);
    const p3 = new THREE.Vector3().fromBufferAttribute(tp, base + 2);
    const triDir = p1.clone().add(p2).add(p3).normalize();
    let bestI = 0, bestDot = -Infinity;
    for (let i = 0; i < 8; i++) {
      const d = triDir.dot(baseNormals[i]);
      if (d > bestDot) { bestDot = d; bestI = i; }
    }
    const faceHolder = faceMeshes[bestI];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(
      [p1.x,p1.y,p1.z, p2.x,p2.y,p2.z, p3.x,p3.y,p3.z], 3
    ));
    g.computeVertexNormals();
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x14091f,
      metalness: 0.3,
      roughness: 0.4,
      emissive: 0x2a0e5e,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const m = new THREE.Mesh(g, mat);
    m.userData = {
      faceIndex: bestI,
      parentFace: faceHolder,
      project: PROJECTS[bestI] || null,
    };
    faceHolder.add(m);
    faceHolder.userData.subs.push(m);
    subMeshes.push(m);
  }
  scene.add(faceGroup);

  // Wireframe overlay — slightly inflated copy of the exact same tessellation.
  const wireGeo = tileGeo.clone();
  const wp = wireGeo.attributes.position;
  for (let vi = 0; vi < wp.count; vi++) {
    const v = new THREE.Vector3().fromBufferAttribute(wp, vi).normalize().multiplyScalar(RADIUS * 1.005);
    wp.setXYZ(vi, v.x, v.y, v.z);
  }
  wireGeo.computeVertexNormals();
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(wireGeo),
    new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.65 })
  );
  faceGroup.add(wire);

  // Vertex dots at every wireframe intersection — gives the "geodesic" feel.
  const dotPositions = [];
  const seen = new Set();
  for (let i = 0; i < wp.count; i++) {
    const x = wp.getX(i), y = wp.getY(i), z = wp.getZ(i);
    const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    dotPositions.push(x, y, z);
  }
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
  const dotsMat = new THREE.PointsMaterial({
    color: 0xc9b8fb, size: 0.06, sizeAttenuation: true,
    transparent: true, opacity: 0.95,
  });
  const dots = new THREE.Points(dotsGeo, dotsMat);
  faceGroup.add(dots);

  // Dummy placeholder so legacy refs don't crash
  const core = new THREE.Object3D();
  faceGroup.add(core);

  // ---- Background nebula ----
  const bgMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime;
      float noise(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec2 uv = vUv - 0.5;
        float d = length(uv);
        float n = noise(uv * 8.0 + uTime * 0.05) * 0.3;
        vec3 c1 = vec3(0.16, 0.05, 0.36);
        vec3 c2 = vec3(0.04, 0.02, 0.07);
        float glow = smoothstep(0.7, 0.0, d) * 0.8 + n * 0.1;
        gl_FragColor = vec4(mix(c2, c1, glow), 1.0);
      }`,
    depthWrite: false,
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), bgMat);
  bg.position.z = -5;
  scene.add(bg);

  // ---- Pointer + raycasting ----
  const mouse = { x: 0, y: 0, nx: 0, ny: 0, tx: 0, ty: 0 };
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  let hoveredFace = null;   // parent Group
  let hoveredSub = null;    // specific sub-triangle mesh under cursor
  let selectedFace = null;
  let sceneMode = 'hero';   // 'hero' | 'work' | 'past'
  let scrollProg = 0;       // overall 0..1 across hero+work
  let aboutProg = 0;        // 0..1 zoom-into-face transition to about

  window.addEventListener('pointermove', (e) => {
    mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  canvas.addEventListener('dblclick', (e) => {
    if (sceneMode !== 'work') return;
    ndc.set(mouse.nx, mouse.ny);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(subMeshes, false);
    if (hits.length && hits[0].object.userData.project) {
      const sub = hits[0].object;
      if (opts.onFaceClick) opts.onFaceClick(sub.userData.project, sub.userData.faceIndex);
    }
  });

  // ---- Drag to spin ----
  let dragging = false;
  let lastDrag = { x: 0, y: 0 };
  let dragVel = { x: 0, y: 0 };
  let manualRot = { x: 0, y: 0 };

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastDrag.x = e.clientX; lastDrag.y = e.clientY;
  });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointermove', (e) => {
    if (dragging) {
      dragVel.x = (e.clientY - lastDrag.y) * 0.005;
      dragVel.y = (e.clientX - lastDrag.x) * 0.005;
      lastDrag.x = e.clientX; lastDrag.y = e.clientY;
    }
  });

  // ---- Public API ----
  const api = {
    setScrollProg(p) { scrollProg = Math.max(0, Math.min(1, p)); },
    setMode(m) { sceneMode = m; },
    setAboutProg(p) { aboutProg = Math.max(0, Math.min(1, p)); },
    getFaceScreenPos(i) {
      // Returns {x,y,visible} of face centroid in screen space
      if (!faceMeshes[i]) return null;
      const fm = faceMeshes[i];
      const world = fm.userData.centroid.clone()
        .applyQuaternion(faceGroup.quaternion)
        .add(faceGroup.position);
      const v = world.clone().project(camera);
      const dotToCam = fm.userData.normal.clone()
        .applyQuaternion(faceGroup.quaternion).z;
      return {
        x: (v.x * 0.5 + 0.5) * window.innerWidth,
        y: (-v.y * 0.5 + 0.5) * window.innerHeight,
        visible: dotToCam > 0.1,
        facing: dotToCam, // 0..1
      };
    },
    getFaceScreenBasis(i) {
      // For a geodesic-sphere face, build a stable in-plane basis around the
      // spherified centroid and project to screen so labels sit on the surface.
      if (!faceMeshes[i]) return null;
      const fm = faceMeshes[i];
      const a = fm.userData.a, b = fm.userData.b;
      const centroid = fm.userData.centroid;
      const localNormal = fm.userData.normal;

      // u: tangent across the face (along the a→b edge, projected to plane)
      const edge = b.clone().sub(a).normalize();
      const u = edge.clone().sub(localNormal.clone().multiplyScalar(edge.dot(localNormal))).normalize();
      const v = new THREE.Vector3().crossVectors(localNormal, u).normalize();

      const SCALE = 0.55;
      const project = (p) => {
        const w = p.clone().applyQuaternion(faceGroup.quaternion).add(faceGroup.position);
        const proj = w.project(camera);
        return {
          x: (proj.x * 0.5 + 0.5) * window.innerWidth,
          y: (-proj.y * 0.5 + 0.5) * window.innerHeight,
        };
      };

      const O = project(centroid);
      const U = project(centroid.clone().add(u.clone().multiplyScalar(SCALE)));
      const V = project(centroid.clone().add(v.clone().multiplyScalar(SCALE)));

      const worldNormal = localNormal.clone().applyQuaternion(faceGroup.quaternion);
      const camDir = new THREE.Vector3().subVectors(
        camera.position,
        centroid.clone().applyQuaternion(faceGroup.quaternion).add(faceGroup.position)
      ).normalize();
      const facing = worldNormal.dot(camDir);

      return {
        ox: O.x, oy: O.y,
        ux: U.x - O.x, uy: U.y - O.y,
        vx: V.x - O.x, vy: V.y - O.y,
        facing,
        visible: facing > 0.05,
      };
    },
    getHoveredFace() { return hoveredFace; },
    getFaceMeshes() { return faceMeshes; },
    setHoveredFace(i) {
      hoveredFace = (i == null) ? null : faceMeshes[i];
    },
    // Anchor at a point within big face `i`, given barycentric coords (ba, bb, bc).
    // Used for sub-facet quick-link labels (About, Docs, Contact).
    getSubFacetBasis(i, ba, bb, bc) {
      if (!faceMeshes[i]) return null;
      const fm = faceMeshes[i];
      const a = fm.userData.a, b = fm.userData.b, c = fm.userData.c;
      const normal = fm.userData.normal;
      // Barycentric-interpolated point, then spherified onto the sphere surface
      const raw = a.clone().multiplyScalar(ba)
        .add(b.clone().multiplyScalar(bb))
        .add(c.clone().multiplyScalar(bc));
      const anchor = raw.normalize().multiplyScalar(1.7 * 0.98);

      const edge = b.clone().sub(a).normalize();
      const u = edge.clone().sub(normal.clone().multiplyScalar(edge.dot(normal))).normalize();
      const v = new THREE.Vector3().crossVectors(normal, u).normalize();

      const SCALE = 0.18;
      const project = (p) => {
        const w = p.clone().applyQuaternion(faceGroup.quaternion).add(faceGroup.position);
        const proj = w.project(camera);
        return {
          x: (proj.x * 0.5 + 0.5) * window.innerWidth,
          y: (-proj.y * 0.5 + 0.5) * window.innerHeight,
        };
      };
      const O = project(anchor);
      const U = project(anchor.clone().add(u.clone().multiplyScalar(SCALE)));
      const V = project(anchor.clone().add(v.clone().multiplyScalar(SCALE)));
      const worldNormal = normal.clone().applyQuaternion(faceGroup.quaternion);
      const camDir = new THREE.Vector3().subVectors(
        camera.position,
        anchor.clone().applyQuaternion(faceGroup.quaternion).add(faceGroup.position)
      ).normalize();
      const facing = worldNormal.dot(camDir);
      return {
        ox: O.x, oy: O.y,
        ux: U.x - O.x, uy: U.y - O.y,
        vx: V.x - O.x, vy: V.y - O.y,
        facing,
        visible: facing > 0.1,
      };
    },
  };

  // ---- Animation loop ----
  let t = 0;
  // Snapshot of sphere rotation when the about-zoom begins, so the zoom
  // smoothly lerps from the user's current view rather than snapping.
  let zoomAnchorRX = null;
  let zoomAnchorRY = null;

  // Target Euler (XYZ order) that aims the About sub-facet corner at the
  // camera. Face 2 vertex a is the same anchor the About quick-link uses
  // (see QUICK_LINKS in app.js). Computed once from geometry so it stays
  // correct across tessellation changes.
  const aboutAnchor = faceMeshes[2] ? faceMeshes[2].userData.a.clone() : new THREE.Vector3(0, 0, 1);
  const zoomTgtY = Math.atan2(-aboutAnchor.x, aboutAnchor.z);
  const rotatedZ = -aboutAnchor.x * Math.sin(zoomTgtY) + aboutAnchor.z * Math.cos(zoomTgtY);
  const zoomTgtX = Math.atan2(aboutAnchor.y, rotatedZ);

  function animate() {
    t += 0.016;
    bgMat.uniforms.uTime.value = t;

    // Smooth pointer
    mouse.tx += (mouse.nx - mouse.tx) * 0.08;
    mouse.ty += (mouse.ny - mouse.ty) * 0.08;

    // Drag inertia
    if (dragging) {
      manualRot.x += dragVel.x;
      manualRot.y += dragVel.y;
      dragVel.x *= 0.9; dragVel.y *= 0.9;
    } else {
      manualRot.x += dragVel.x; manualRot.y += dragVel.y;
      dragVel.x *= 0.94; dragVel.y *= 0.94;
    }

    // Scroll-driven transforms
    const heroProg = Math.min(1, scrollProg * 2); // 0..1 across first half
    const workProg = Math.max(0, scrollProg * 2 - 1); // 0..1 across second half

    // About-zoom: ease camera deep into a specific face so the sphere
    // "swallows" the viewport, transitioning into the About section.
    const zoomT = aboutProg;
    const eased = zoomT * zoomT * (3 - 2 * zoomT); // smoothstep

    // Camera pulls in on entering work, then dives into the target face
    const targetZ = 5 - workProg * 1.2 - eased * 5.4;
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    // Group scale: small pull in hero/work, major blow-up on zoom
    const targetScale = 1 + workProg * 0.15 + eased * 1.4;
    faceGroup.scale.setScalar(
      faceGroup.scale.x + (targetScale - faceGroup.scale.x) * 0.08
    );

    // Rotation: in hero, auto-tumble + parallax; in work, steady spin + drag;
    // during aboutProg, blend to a fixed orientation that points a target face
    // straight at the camera so we zoom cleanly INTO that face.
    let targetRX, targetRY;
    if (zoomT <= 0.01) {
      zoomAnchorRX = null;
      zoomAnchorRY = null;
    }
    if (zoomT > 0.01) {
      // Snapshot the sphere's rotation the first frame zoom begins, then
      // smoothly blend from there to the locked target. Any user drag before
      // the zoom starts is preserved as the zoom's starting pose.
      if (zoomAnchorRX === null) {
        zoomAnchorRX = faceGroup.rotation.x;
        zoomAnchorRY = faceGroup.rotation.y;
      }
      // Shortest-path angle delta so we don't spin the long way around.
      const wrapDelta = (a) => {
        let d = a % (Math.PI * 2);
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        return d;
      };
      const dx = wrapDelta(zoomTgtX - zoomAnchorRX);
      const dy = wrapDelta(zoomTgtY - zoomAnchorRY);
      targetRX = zoomAnchorRX + dx * eased;
      targetRY = zoomAnchorRY + dy * eased;
    } else if (sceneMode === 'work') {
      targetRX = manualRot.x + t * 0.06 + Math.sin(t * 0.2) * 0.12;
      targetRY = manualRot.y + t * 0.12;
    } else {
      targetRX = manualRot.x + mouse.ty * 0.25 + t * 0.05;
      targetRY = manualRot.y + mouse.tx * 0.5 + t * 0.12;
    }

    const rotLerp = zoomT > 0.01 ? 0.08 + eased * 0.1 : 0.06;
    faceGroup.rotation.x += (targetRX - faceGroup.rotation.x) * rotLerp;
    faceGroup.rotation.y += (targetRY - faceGroup.rotation.y) * rotLerp;

    // Subtle float / parallax (disabled during zoom)
    const parallaxX = mouse.tx * 0.25 * (1 - workProg) * (1 - eased);
    const parallaxY = mouse.ty * 0.18 * (1 - workProg) * (1 - eased);
    faceGroup.position.x += (parallaxX - faceGroup.position.x) * 0.06;
    faceGroup.position.y += (parallaxY - faceGroup.position.y) * 0.06;

    // During zoom, offset the sphere so the TARGET facet (upper-left area of
    // the front face) moves to screen center, then the camera pushes in.
    const offsetX = -eased * 0.35;
    const offsetY = eased * 0.55;
    if (zoomT > 0.01) {
      faceGroup.position.x += (offsetX - faceGroup.position.x) * 0.08;
      faceGroup.position.y += (offsetY - faceGroup.position.y) * 0.08;
    }

    // Core spin
    core.rotation.x = -t * 0.4;
    core.rotation.y = t * 0.6;

    // Raycast hover — only in work mode (for highlight)
    if (sceneMode === 'work') {
      ndc.set(mouse.tx, mouse.ty);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(subMeshes, false);
      const newSub = hits[0] ? hits[0].object : null;
      const newFace = newSub ? newSub.userData.parentFace : null;
      if (newSub !== hoveredSub) {
        hoveredSub = newSub;
        hoveredFace = newFace;
        document.body.classList.toggle('face-hovered', !!hoveredSub);
      }
    } else {
      hoveredSub = null;
      hoveredFace = null;
    }

    // Sub-triangle hover tint — emissive bumps only on the hovered sub-diamond
    subMeshes.forEach((m) => {
      const target = (m === hoveredSub) ? 1.4 : 0.3;
      m.material.emissiveIntensity += (target - m.material.emissiveIntensity) * 0.15;
    });

    // Light orbit
    key.position.x = Math.cos(t * 0.5) * 3;
    key.position.z = Math.sin(t * 0.5) * 3;
    fill.position.x = Math.cos(t * 0.3 + 2) * 3;
    fill.position.y = Math.sin(t * 0.3 + 2) * 2.5;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  return api;
};
