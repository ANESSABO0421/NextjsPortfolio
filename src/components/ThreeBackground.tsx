"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle geometry
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a large 3D spherical shell to frame content
      const r = 15 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      // Gradient colors from cosmic blue/cyan to subtle white/indigo stars
      const colorRand = Math.random();
      if (colorRand > 0.6) {
        colors[i] = 0.5; // R
        colors[i + 1] = 0.65; // G
        colors[i + 2] = 0.9; // B
      } else if (colorRand > 0.3) {
        colors[i] = 0.3; // R
        colors[i + 1] = 0.52; // G
        colors[i + 2] = 0.75; // B
      } else {
        colors[i] = 0.8; // R
        colors[i + 1] = 0.8; // G
        colors[i + 2] = 0.85; // B
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Material with round texture blending
    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // Animation Loop
    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Slow orbital drift
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0003;

      // Mouse interactive tilt + Scroll responsive height shift
      const targetX = mouseX * 4;
      const targetY = mouseY * 4 - (scrollY * 0.005); // drifts as you scroll down!

      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none w-screen h-screen overflow-hidden bg-bg"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
