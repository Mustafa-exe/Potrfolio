import { useEffect, useRef } from "react";

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const THREE = window.THREE;
    if (!THREE) {
      console.warn("Three.js not loaded yet from CDN.");
      return;
    }

    const R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    R.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    R.setSize(window.innerWidth, window.innerHeight);

    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    cam.position.z = 45;

    // ── Particles (reduced for performance) ──
    const N = 1000;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 130;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 130;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    sc.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: 0xa8d4f5,
          size: 0.15,
          transparent: true,
          opacity: 0.3,
          sizeAttenuation: true,
        })
      )
    );

    // ── Constellation Lines (reduced) ──
    const lv = [];
    for (let i = 0; i < 120; i++) {
      const a = Math.floor(Math.random() * N);
      const b = Math.floor(Math.random() * N);
      lv.push(
        pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2],
        pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]
      );
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lv), 3));
    sc.add(
      new THREE.LineSegments(
        lg,
        new THREE.LineBasicMaterial({ color: 0x4a80b0, transparent: true, opacity: 0.05 })
      )
    );

    // ── 3D Wireframe Objects (reduced to 3) ──
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa8d4f5,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });

    const torus = new THREE.Mesh(new THREE.TorusGeometry(8, 2.2, 12, 28), wireMat);
    torus.position.set(35, -10, -15);
    sc.add(torus);

    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(6, 0), wireMat);
    ico.position.set(-30, 15, -20);
    sc.add(ico);

    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(5, 0), wireMat);
    octa.position.set(-20, -25, -10);
    sc.add(octa);

    let mx = 0, my = 0, sy = 0, t = 0;

    const onMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      my = -(e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    const onScroll = () => { sy = window.pageYOffset; };
    const onResize = () => {
      R.setSize(window.innerWidth, window.innerHeight);
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let active = true;
    const ch = sc.children;

    const tick = () => {
      if (!active) return;
      requestAnimationFrame(tick);
      t += 0.002;

      const ry = t * 0.03 + mx * 0.2;
      const rx = t * 0.012 + my * 0.2;
      ch.forEach((c) => {
        c.rotation.y = ry;
        c.rotation.x = rx;
      });

      torus.rotation.x = t * 0.3;
      torus.rotation.z = t * 0.15;
      ico.rotation.y = t * 0.25;
      octa.rotation.x = t * 0.35;

      torus.position.y = -10 + Math.sin(t * 0.6) * 2;
      ico.position.y = 15 + Math.cos(t * 0.5) * 2;
      octa.position.y = -25 + Math.sin(t * 0.5) * 2;

      cam.position.y = -sy * 0.008;
      R.render(sc, cam);
    };

    tick();

    return () => {
      active = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      lg.dispose();
      wireMat.dispose();
      R.dispose();
    };
  }, []);

  return <canvas id="bgc" ref={canvasRef} />;
}
