import React, { useRef } from "react"
import { Mesh, MeshTransmissionMaterial, useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { useControls } from "leva"

export default function Model() {
    const { nodes } = useGLTF("/medias/lens.glb")
    const { viewport } = useThree()
    const mesh = useRef(null)

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1},
        backside: { value: true},
    })

    useFrame(() => {
        mesh.current.rotation.y += 0.002
        mesh.current.rotation.z += 0.002
        mesh.current.rotation.x += 0.002
    })
    return (
        <group scale={viewport.width / 7}>
            <Text position={[0, 0, -1]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">hello world!</Text>
            <mesh ref={mesh} {...nodes.Sphere}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    )
}