import React, { Component } from "react";
import { useEffect, useState, useRef } from "react";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

const ThreeScene = (props) => {
  const mountRef = useRef(null);
  const [kitchenLength, setKitchenLength] = useState(6);
  const [kitchenDepth, setKitchenDepth] = useState(6);
  const [cabinets, setCabinets] = useState([3,3]);

  function divideLength(length, minSectionLength, maxSectionLength) {
    const numSections = Math.ceil(length / maxSectionLength);
    const sectionLength = Math.max(Math.min(length / numSections, maxSectionLength), minSectionLength);
    const result = [];
  
    let remainingLength = length;
    for (let i = 0; i < numSections; i++) {
      const currentSectionLength = Math.min(sectionLength, remainingLength);
      result.push(currentSectionLength);
      remainingLength -= currentSectionLength;
    }
  
    return result;
  }

  function getValue(e) {
    // let currentValue = getSectionsLengths(e.target.value, 1, 2)
    let currentValue = divideLength(e.target.value, 1, 3)
    setKitchenLength(e.target.value)
    setCabinets(currentValue)
    console.log(kitchenLength , cabinets)
  }
  function getDepth(e) {
    // let currentValue = getSectionsLengths(e.target.value, 1, 2)
    let currentValue = divideLength(e.target.value, 1, 3)
    setKitchenDepth(e.target.value)
    // setCabinets(currentValue)
    // console.log(kitchenLength , cabinets)
  }
 
  useEffect(() => {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 5, 12);
    camera.lookAt( 0, 0, 0 );
    camera.up.set( 0, 0, 0 );
    camera.updateProjectionMatrix();
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth , window.innerHeight);
    renderer.setClearColor('white');
    mountRef.current.appendChild(renderer.domElement);
    
    const sunlight = new THREE.DirectionalLight(0x333333);
    sunlight.position.y = 20000;
    sunlight.intensity = 2.5;
    sunlight.castShadow = true;
    scene.add(sunlight);
    const ambientLight = new THREE.AmbientLight(0x333333);
    ambientLight.intensity = 1;
    scene.add(ambientLight); 
    
    const planeGeometry = new THREE.PlaneGeometry(kitchenLength, kitchenDepth);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = 0;
    plane.position.z = 0;
    plane.position.x = 0;
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane); 

    const wallGeometry = new THREE.PlaneGeometry(kitchenDepth, 9);
    const wallMaterial = new THREE.MeshNormalMaterial({
      // color: "white",
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const wallOne = new THREE.Mesh(wallGeometry, wallMaterial);
    wallOne.position.y = 4.5;
    wallOne.position.z = 0;
    wallOne.position.x = kitchenLength / 2;
    // wallOne.rotation.x = -0.5 * Math.PI;
    wallOne.receiveShadow = true;
    scene.add(wallOne); 

    const wallTwoGeometry = new THREE.PlaneGeometry(kitchenLength, 9);
    const wallTwoMaterial = new THREE.MeshNormalMaterial({
      // color: "white",
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const wallTwo = new THREE.Mesh(wallTwoGeometry, wallTwoMaterial);
    wallTwo.position.y = 4.5;
    wallTwo.position.z = -(kitchenDepth / 2);
    wallTwo.position.x = 0;
    wallOne.rotation.y = -0.5 * Math.PI;
    wallOne.receiveShadow = true;
    scene.add(wallTwo); 

    
    const counterGeometry = new THREE.BoxGeometry( kitchenLength, 1/12, 2.2 );
    const counterMaterial = new THREE.MeshNormalMaterial({
      // color: "blue",
      wireframe: true
    });
    const counterTopOne = new THREE.Mesh(counterGeometry, counterMaterial);
    counterTopOne.position.z = -(kitchenDepth / 2) + 1.1;
    counterTopOne.position.y = 3 + 1/24
    scene.add(counterTopOne)

    const lowerGeometry = new THREE.BoxGeometry( kitchenLength, 3, 2 );
    const lowerMaterial = new THREE.MeshStandardMaterial({
      color: "blue",
      wireframe: true
    });
    const lowerCabinet = new THREE.Mesh(lowerGeometry, lowerMaterial);
    lowerCabinet.position.z = -(kitchenDepth / 2) + 1.1;
    lowerCabinet.position.y = 1.5
    scene.add(lowerCabinet)


    const counterGeometryTwo = new THREE.BoxGeometry( 2.2, 1/12, kitchenDepth );
    const counterTopTwo = new THREE.Mesh(counterGeometryTwo, counterMaterial);
    counterTopTwo.position.y = 3 + 1/24;
    counterTopTwo.position.z = 0;
    counterTopTwo.position.x = (kitchenLength / 2) - 1.1;
    scene.add(counterTopTwo)

    const lowerGeometryTwo = new THREE.BoxGeometry( 2, 3, kitchenDepth );
    const lowerCabinetTwo = new THREE.Mesh(lowerGeometryTwo, lowerMaterial);
    lowerCabinetTwo.position.y = 1.5
    lowerCabinetTwo.position.z = 0;
    lowerCabinetTwo.position.x = (kitchenLength / 2) - 1;
    scene.add(lowerCabinetTwo)


    for (let i = 0; i < cabinets.length; i++){
      const upperCabinetGeometry = new THREE.BoxGeometry(cabinets[i], 3, 1)
      const upperCabinetMaterial = new THREE.MeshStandardMaterial({ color: "blue", wireframe: true});
      const upperCabinet = new THREE.Mesh(upperCabinetGeometry, upperCabinetMaterial);
      upperCabinet.position.z = -(kitchenDepth / 2) + .5;
      upperCabinet.position.y = 4.5 + (1.5)
      upperCabinet.position.x = (-kitchenLength/2 + cabinets[i]/2) + (i * cabinets[i])
      scene.add(upperCabinet)
    }

    const animate = function () {
      requestAnimationFrame(animate);

      renderer.render( scene, camera );
    }

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth , window.innerHeight );
    }

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => mountRef.current.removeChild( renderer.domElement);
  }, [kitchenLength, kitchenDepth]);

  return (
    <div>
      <div className="edit-container">
        length
        <input id="length" type="range" min="6" max="15" defaultValue="6" onInput={getValue} />
        width
        <input id="depth" type="range" min="6" max="15" defaultValue="6" onInput={getDepth}/> 

      </div>
      <div className="three-js" ref={mountRef}></div>
    </div>
  );
}


export default ThreeScene;