import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
export default function Campus3D() {
  const host = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const root = host.current!
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // WebGL creation is an external capability check; expose its failure to the fallback UI.
      // eslint-disable-next-line react/set-state-in-effect
      setFailed(true)
      return
    }
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#e7eeed')
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(12, 12, 14)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.minDistance = 10
    controls.maxDistance = 32
    controls.maxPolarAngle = Math.PI / 2.2
    controls.target.set(0, 0, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    root.appendChild(renderer.domElement)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x778899, 3))
    const light = new THREE.DirectionalLight(0xffffff, 4)
    light.position.set(5, 12, 7)
    scene.add(light)
    const geometries: THREE.BufferGeometry[] = []
    const materials: THREE.Material[] = []
    function box(w: number, h: number, d: number, x: number, z: number, color: string) {
      const g = new THREE.BoxGeometry(w, h, d)
      const m = new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
      geometries.push(g)
      materials.push(m)
      const mesh = new THREE.Mesh(g, m)
      mesh.position.set(x, h / 2, z)
      scene.add(mesh)
      return mesh
    }
    box(15, 0.2, 12, 0, 0, '#c8ddc8')
    box(4, 2.5, 2.8, -3, -2, '#f8f5eb')
    box(3, 1.7, 2.5, 2, -2, '#e6c39a')
    box(3, 1.5, 2.5, -3, 2, '#ffffff')
    box(2.5, 2, 2, 3, 2, '#9baeba')
    box(3, 0.3, 3, 0, 1.6, '#91c696')
    box(1, 0.22, 12, 0, 0, '#f6f0e3')
    for (let i = 0; i < 4; i++) {
      box(0.5, 0.6, 0.04, -4.2 + i * 0.8, -0.58, '#52b8c3')
      box(0.5, 0.6, 0.04, -4.2 + i * 0.8, 3.26, '#52b8c3')
    }
    for (const [x, z] of [
      [-6, -4],
      [5, 4],
      [-6, 3],
      [5, -4],
      [-5, 4],
    ]) {
      box(0.14, 0.8, 0.14, x, z, '#946d4f')
      const geo = new THREE.SphereGeometry(0.6, 12, 12),
        mat = new THREE.MeshStandardMaterial({ color: '#40866a' })
      geometries.push(geo)
      materials.push(mat)
      const tree = new THREE.Mesh(geo, mat)
      tree.position.set(x, 1.25, z)
      scene.add(tree)
    }
    const resize = () => {
      const w = root.clientWidth,
        h = 450
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(root)
    let frame = 0
    function render() {
      frame = requestAnimationFrame(render)
      controls.update()
      renderer.render(scene, camera)
    }
    render()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      geometries.forEach((g) => g.dispose())
      materials.forEach((m) => m.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])
  return (
    <div>
      <div className="three-host" ref={host}>
        {failed && (
          <p>
            3D is unavailable in this browser. Use the campus map or facility list for the same
            information.
          </p>
        )}
      </div>
      <p className="demo-note">
        Illustrative 3D model · drag to orbit, scroll to zoom. Select a facility from the list for
        details.
      </p>
    </div>
  )
}
