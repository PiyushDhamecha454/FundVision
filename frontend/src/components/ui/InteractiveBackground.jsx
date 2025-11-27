import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function InteractiveBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    // === Scene, Camera, Renderer ===
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // === Particle Geometry ===
    const particlesCount = 1200
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    // === Glowing Material ===
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(0xffd700), // gold color instead of blue
      size: 0.1, // slightly larger for coin appearance
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending, // makes glow effect
      depthWrite: false,
      map: createGlowTexture(), // glowing circle texture
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // === Light ambient effect ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // === Mouse Interaction ===
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    // === Animate ===
    const clock = new THREE.Clock()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Rotate field and respond to mouse
      particles.rotation.y = elapsedTime * 0.05 + mouse.x * 0.2
      particles.rotation.x = mouse.y * 0.2

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // === Resize ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // === Cleanup ===
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", onMouseMove)
      mountRef.current.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  // === Function to create glowing particle texture ===
  const createGlowTexture = () => {
    const size = 128
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, "rgba(255,215,0,1)") // bright gold center
    gradient.addColorStop(0.3, "rgba(255,215,0,0.8)")
    gradient.addColorStop(0.6, "rgba(255,215,0,0.3)")
    gradient.addColorStop(1, "rgba(255,215,0,0)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}
