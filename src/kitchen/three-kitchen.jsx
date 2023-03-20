import React, { Component } from "react";
import { useEffect, useState, useRef } from "react";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

const ThreeScene = (props) => {
  const mountRef = useRef(null);
  const [kitchenLength, setKitchenLength] = useState(6);
  const [cabinets, setCabinets] = useState([]);

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
 
  useEffect(() => {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(-5, 4, 5);
    camera.lookAt( 0, 0, 0 );
    camera.up.set( 0, 0, 0 );
    camera.updateProjectionMatrix();
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth , window.innerHeight);
    renderer.setClearColor('white');
    mountRef.current.appendChild( renderer.domElement );

    const planeGeometry = new THREE.PlaneGeometry(kitchenLength, 5);
    const planeMaterial = new THREE.MeshNormalMaterial({
      // color: "green",
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
    const geometry = new THREE.BoxGeometry( 5, 3, 2 );
    const material = new THREE.MeshBasicMaterial( { color: "blue" } );
    const cube = new THREE.Mesh( geometry, material );

    // scene.add( cube );
    // camera.position.z = 5;

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
  }, [kitchenLength]);

  return (
    <div>
      <div className="edit-container">
        
        <input id="length" type="range" min="6" max="20" defaultValue="6" onInput={getValue}/> 
      </div>
      <div className="three-js" ref={mountRef}></div>
    </div>
  );
}


export default ThreeScene;