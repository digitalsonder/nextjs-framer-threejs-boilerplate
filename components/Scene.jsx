'use client'

import * as THREE from "three"
import { useEffect, useRef } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useScroll, useMotionValueEvent, useTransform } from "framer-motion"

export default function Scene() {
    const { scrollYProgress } = useScroll()
    // useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    //     console.log(latest)
    // })

    const transformX = useTransform(scrollYProgress, [0,1], [0,100])
    
    // Create a ref to store the moveCamera function
    const moveCameraRef = useRef(null)
    
    // Use motion value event to call moveCamera when scroll changes
    useMotionValueEvent(scrollYProgress, 'change', () => {
        if (moveCameraRef.current) {
            moveCameraRef.current()
        }
    })

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const canvas = document.querySelector('#canvas')
        const renderer = new THREE.WebGLRenderer({ canvas })
        camera.position.x = transformX.get()

        // Renderer setup
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        
        camera.position.setZ(30)

        const geometry = new THREE.TorusGeometry(10,3,16,100)
        const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 }) // wireframe: true to make it wireframed,
        const torus = new THREE.Mesh(geometry, material)
        // Set initial torus position to match transformX at page load

        const pointLight = new THREE.PointLight(0xffffff)
        pointLight.position.set(7,7,7)

        const lightHelper = new THREE.PointLightHelper(pointLight)
        scene.add(lightHelper)
        const gridHelper = new THREE.GridHelper(200,50)
        scene.add(gridHelper)

        const ambientLight = new THREE.AmbientLight(0xffffff)
        
        scene.add(ambientLight)
        scene.add(pointLight)
        scene.add(torus)

        // Scene controls
        const controls = new OrbitControls(camera, renderer.domElement)
    
        // Star populate function
        function addStar() {
            const geometry = new THREE.SphereGeometry(0.25, 24, 24)
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const star = new THREE.Mesh(geometry, material)

            const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
            star.position.set(x,y,z)
            scene.add(star)
        }

        // Add 100 stars
        Array(100).fill().forEach(addStar)

        // Load space texture
        const spaceTexture = new THREE.TextureLoader().load(
            '/space.jpg',
            () => console.log('Space texture loaded successfully'),
            undefined,
            (err) => console.error('Error loading space texture:', err)
        )
        scene.background = spaceTexture

        // Creating skellybone box mesh
        const skellyBoneTexture = new THREE.TextureLoader().load('/skellybone.jpg')
        const skellyBone = new THREE.Mesh(
            new THREE.BoxGeometry(3,3,3),
            new THREE.MeshBasicMaterial({ map: skellyBoneTexture })
        )
        scene.add(skellyBone)
        skellyBone.position.set(5,5,5)

        // Recursive animation function that updates the scene
        function animate() {
            requestAnimationFrame(animate)
            renderer.render(scene,camera)

            torus.rotation.x += 0.01
            torus.rotation.y += 0.005
            torus.rotation.z += 0.01

            controls.update()
        }

        animate()

        function moveCamera() {
            const cameraOffset = transformX.get()
            camera.position.x = cameraOffset
        }
        
        // Store the moveCamera function in the ref so it can be called from outside useEffect
        moveCameraRef.current = moveCamera

        // Cleanup when component unmounts
        return () => renderer.dispose()
    }, []) // Empty dependency array means this runs once on mount

    return (
        <canvas id="canvas"></canvas>
    )
}
