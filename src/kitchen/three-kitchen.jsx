import React, { Component } from "react";
import Marble from "./streaked-marble.png"
import Wenge from "./Wenge.jpeg"
import WengeVertical from "./WengeVertical.jpeg"
import { useEffect, useState, useRef } from "react";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

const ThreeScene = (props) => {
  const mountRef = useRef(null);
  const [kitchenLength, setKitchenLength] = useState(9);
  const [kitchenDepth, setKitchenDepth] = useState(9);
  const [cabinets, setCabinets] = useState([3, 3, 3]);
  const [cabinetMaterial, setCabinetMaterial] = useState(WengeVertical)
  const [tableMaterial, setTableMaterial] = useState(Marble)
  const [tableBottomMaterial,setTableBottomMaterial] = useState(Wenge)
  const [toggle, setToggle] = useState(true)
  const [wired, setWired] = useState(false)
  const[cam,setCam] = useState(-15)

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
    let currentValue = divideLength(e.target.value, 1, 3)
    setKitchenLength(e.target.value)
    setCabinets(currentValue)
    console.log(kitchenLength , cabinets)
  }
  function getDepth(e) {
    let currentValue = divideLength(e.target.value, 1, 3)
    setKitchenDepth(e.target.value)
  }

  function setWire() {
    if (toggle) {
      setToggle(false)
      setWired(true)
    }
    else if (!toggle) {
      setToggle(true)
      setWired(false)
    }
  }



  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth * 1.5 / window.innerHeight, 0.1, 5000);
    const loader = new THREE.TextureLoader();
    const marbleTexture = loader.load(tableMaterial);
    const verticalWoodTexture = loader.load(cabinetMaterial)
    const woodTexture = loader.load(tableBottomMaterial);
    // camera.position.set(-12, 5, 12);
    camera.position.set(cam, 5, 15);
    // camera.lookAt(0, 5.5, 0);
    // camera.lookAt(scene.position); 
    camera.up.set( 0, 5.5, 0 );
    camera.updateProjectionMatrix();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.update();

    renderer.setSize(window.innerWidth  , window.innerHeight/1.5);
    renderer.setClearColor("rgb(255, 250, 245)");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    
    const sunlight = new THREE.DirectionalLight(0x333333);
    sunlight.position.y = 20000;
    sunlight.intensity = 1.5;
    sunlight.castShadow = true;
    // scene.add(sunlight);
    const ambientLight = new THREE.AmbientLight(0x333333);
    ambientLight.intensity = 1.5;
    scene.add(ambientLight); 

      
    const planeGeometry = new THREE.BoxGeometry(kitchenLength * 1.75, kitchenDepth * 1.5, 1);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      wireframe: wired,
      // side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -.5;
    plane.position.z = 0;
    plane.position.x = 0;
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane); 

    const wallGeometry = new THREE.BoxGeometry(kitchenDepth, 10, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      wireframe: wired,
      // side: THREE.DoubleSide,
    });

    const wallOne = new THREE.Mesh(wallGeometry, wallMaterial);
    wallOne.position.y = 4;
    wallOne.position.z = 0;
    wallOne.position.x = kitchenLength / 2 + .5;
    wallOne.rotation.y = -0.5 * Math.PI;
    wallOne.receiveShadow = true;
    wallOne.castShadow = true;
    scene.add(wallOne); 

    const wallTwoGeometry = new THREE.BoxGeometry(kitchenLength * 1.75, 10, 1);
    const wallTwoMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      wireframe: wired,
      // side: THREE.DoubleSide,
    });

    const wallTwo = new THREE.Mesh(wallTwoGeometry, wallTwoMaterial);
    wallTwo.position.y = 4;
    wallTwo.position.z = -(kitchenDepth / 2) - .5;
    wallTwo.position.x = 0;
    wallTwo.receiveShadow = true;
    wallTwo.castShadow = true;
    scene.add(wallTwo); 

    const counterGeometry = new THREE.BoxGeometry( kitchenLength, 1.5/12, 2.2 );
    const counterMaterial = new THREE.MeshBasicMaterial({
      // side: THREE.FrontSide,
      map: marbleTexture,
      
      // flatShading:true,
      wireframe: wired
    });
   
    const counterTopOne = new THREE.Mesh(counterGeometry, counterMaterial);
    counterTopOne.position.z = -(kitchenDepth / 2) + 1.1;
    counterTopOne.position.y = 3 + 1.5 / 24
    counterTopOne.receiveShadow = true;
    counterTopOne.castShadow = true;
    // counterTopOne.flatShading = true;
    scene.add(counterTopOne)

    const lowerGeometry = new THREE.BoxGeometry( kitchenLength, 3, 2 );
    const lowerMaterial = new THREE.MeshStandardMaterial({
      map : woodTexture,
      wireframe: wired
    });
    const lowerCabinet = new THREE.Mesh(lowerGeometry, lowerMaterial);
    lowerCabinet.position.z = -(kitchenDepth / 2) + 1.1;
    lowerCabinet.position.y = 1.5
    lowerCabinet.receiveShadow = true;
    lowerCabinet.castShadow = true;
    scene.add(lowerCabinet)


    const counterGeometryTwo = new THREE.BoxGeometry( 2.2, 1.5/12, kitchenDepth );
    const counterTopTwo = new THREE.Mesh(counterGeometryTwo, counterMaterial);
    counterTopTwo.position.y = 3 + 1.5/24;
    counterTopTwo.position.z = 0;
    counterTopTwo.position.x = (kitchenLength / 2) - 1.1;
    // counterTopTwo.flatShading = true;
    counterTopTwo.receiveShadow = true;
    counterTopTwo.castShadow = true;
    scene.add(counterTopTwo)

    const lowerGeometryTwo = new THREE.BoxGeometry( 2, 3, kitchenDepth );
    const lowerCabinetTwo = new THREE.Mesh(lowerGeometryTwo, lowerMaterial);
    lowerCabinetTwo.position.y = 1.5
    lowerCabinetTwo.position.z = 0;
    lowerCabinetTwo.position.x = (kitchenLength / 2) - 1;
    lowerCabinetTwo.receiveShadow = true;
    lowerCabinetTwo.castShadow = true;
    scene.add(lowerCabinetTwo)

    const dinnerGeometry = new THREE.BoxGeometry( (kitchenLength - 2), 1.5/12, kitchenDepth /3  );
    const dinnerTable = new THREE.Mesh(dinnerGeometry, counterMaterial);
    // dinnerTable.position.x = kitchenLength / 2 - (kitchenLength/4);
    // dinnerTable.position.y = 3 + 1.5/24
    // dinnerTable.position.z = kitchenDepth / 2 - 2
    dinnerTable.position.x = kitchenLength/2 - (kitchenLength/2 + 1)
    dinnerTable.position.y = 3 + 1.5/24
    dinnerTable.position.z = kitchenDepth/2 - kitchenDepth/6 
    dinnerTable.flatShading = true;
    dinnerTable.receiveShadow = true;
    dinnerTable.castShadow = true;
    scene.add(dinnerTable)
    let bottomLength =  (kitchenLength - 2) - 1.5/12
    const dinnerBottomGeometry = new THREE.BoxGeometry(bottomLength, 3, kitchenDepth /3 - 1  );
    const dinnerBottom = new THREE.Mesh(dinnerBottomGeometry, lowerMaterial);
    dinnerBottom.position.x = kitchenLength/2 - (bottomLength/2 + 2)
    dinnerBottom.position.y = 1.5
    dinnerBottom.position.z = kitchenDepth / 2 - kitchenDepth / 6 - .5
    dinnerBottom.receiveShadow = true;
    dinnerBottom.castShadow = true;
    scene.add(dinnerBottom)

    const dinnerSideGeometry = new THREE.BoxGeometry( 1.5/12 , 3, kitchenDepth /3  );
    const dinnerSide = new THREE.Mesh(dinnerSideGeometry, counterMaterial);
    dinnerSide.position.x = -kitchenLength/2  + 1.5/24
    dinnerSide.position.y = 1.5
    dinnerSide.position.z = kitchenDepth/2 - kitchenDepth/6 
    dinnerSide.receiveShadow = true;
    dinnerSide.castShadow = true;
    scene.add(dinnerSide)

    for (let i = 0; i < cabinets.length; i++){
      const upperCabinetGeometry = new THREE.BoxGeometry(cabinets[i], 4, 1)
      const upperCabinetMaterial = new THREE.MeshStandardMaterial({
        map : woodTexture,
        wireframe: wired
      });
      const upperCabinet = new THREE.Mesh(upperCabinetGeometry, upperCabinetMaterial);
      upperCabinet.position.z = -(kitchenDepth / 2) + .5;
      upperCabinet.position.y = 4.5 + (2)
      upperCabinet.position.x = (-kitchenLength / 2 + cabinets[i] / 2) + (i * cabinets[i])
      upperCabinet.receiveShadow = false;
      upperCabinet.castShadow = true;
      scene.add(upperCabinet)

      const upperCabinetDoorGeometry = new THREE.BoxGeometry(cabinets[i] - .1, 4, 1 / 12)
      const upperCabinetDoorMaterial = new THREE.MeshStandardMaterial({
        map: verticalWoodTexture,
        rotation: 1.57,
        wireframe: wired
      });

      const upperCabinetDoor = new THREE.Mesh(upperCabinetDoorGeometry, upperCabinetDoorMaterial);
      upperCabinetDoor.position.z = -(kitchenDepth / 2) + 1;
      upperCabinetDoor.position.y = 4.5 + (2)
      upperCabinetDoor.position.x = (-kitchenLength / 2 + cabinets[i] / 2) + (i * cabinets[i])
      upperCabinetDoor.receiveShadow = true;
      upperCabinetDoor.castShadow = true;
      scene.add(upperCabinetDoor)

      const spotLight = new THREE.SpotLight(0xffffff );
      spotLight.position.set((-kitchenLength / 2 + cabinets[i] / 2) + (i * cabinets[i]), 15, -kitchenDepth/2 + 4);
      spotLight.target.position.set((-kitchenLength / 2 + cabinets[i] / 2) + (i * cabinets[i]),0,-kitchenDepth/2 + 4);
      spotLight.castShadow = true;
      spotLight.angle = .5;
      spotLight.penumbra = .1;
      spotLight.intensity = 1;
      scene.add(spotLight);
      scene.add(spotLight.target)
      spotLight.target.updateMatrixWorld();
      const spotLightHelper = new THREE.SpotLightHelper( spotLight );
      // scene.add(spotLightHelper);
      
      const spotLight2 = new THREE.SpotLight(0xffffff );
      spotLight2.position.set((-kitchenLength / 2 + cabinets[i] / 2) + (i * cabinets[i]), 15, kitchenDepth/2 + 6 );
      spotLight2.target.position.set((-kitchenLength / 2 + cabinets[i] / 2) + (i * cabinets[i]),0,  kitchenDepth/2 );
      spotLight2.castShadow = true;
      spotLight2.angle = .4;
      spotLight2.penumbra = .1;
      spotLight2.intensity = 1;
      scene.add(spotLight2);
      scene.add(spotLight2.target)
      spotLight2.target.updateMatrixWorld();
      const spotLightHelper2 = new THREE.SpotLightHelper( spotLight2 );
      // scene.add( spotLightHelper2 );
    }
    const fridgeVolumeGeometry = new THREE.BoxGeometry(40/ 12, 7, 3)
    const fridgeVolumeMaterial = new THREE.MeshStandardMaterial({
      color: "silver",
      wireframe: wired
    });
    const fridgeVolume = new THREE.Mesh(fridgeVolumeGeometry, fridgeVolumeMaterial);
    fridgeVolume.position.y = 3.5;
    fridgeVolume.position.z = -(kitchenDepth / 2) + 1.5;
    fridgeVolume.position.x = (-kitchenLength / 2 - (1.8))
    scene.add(fridgeVolume)

    const fridgeBottomDoorGeometry = new THREE.BoxGeometry(40/ 12, 2.5, 3/12)
   
    const fridgeBottomDoor = new THREE.Mesh(fridgeBottomDoorGeometry, fridgeVolumeMaterial);
    fridgeBottomDoor.position.y = 2.5/2 + 1/12;
    fridgeBottomDoor.position.z = -(kitchenDepth / 2) + 1.5 + 1.5 + 3/24 ;
    fridgeBottomDoor.position.x = (-kitchenLength / 2 - (1.8) )
    scene.add(fridgeBottomDoor)

    const fridgeLeftDoorGeometry = new THREE.BoxGeometry(19/ 12, 4.3, 3/12)
   
    const fridgeLeftDoor = new THREE.Mesh(fridgeLeftDoorGeometry, fridgeVolumeMaterial);
    fridgeLeftDoor.position.y = 4/2 + 2.5/2 + 1.6;
    fridgeLeftDoor.position.z = -(kitchenDepth / 2) + 3 + 3/24 ;
    fridgeLeftDoor.position.x = (-kitchenLength / 2 - (1.8) - 20 / 24);
    scene.add(fridgeLeftDoor)
    const fridgeRightDoor = new THREE.Mesh(fridgeLeftDoorGeometry, fridgeVolumeMaterial);
    fridgeRightDoor.position.y = 4/2 + 2.5/2 + 1.6;
    fridgeRightDoor.position.z = -(kitchenDepth / 2) + 3 + 3/24 ;
    fridgeRightDoor.position.x = (-kitchenLength / 2 - (1.8) + 20 / 24);
    scene.add(fridgeRightDoor)

    const animate = function () {
      requestAnimationFrame(animate);
      camera.lookAt(0, 5.5, 0);
      camera.position.set(cam, 5, 15);
      renderer.render( scene, camera );
    }
    let onWindowResize = function () {
      camera.aspect = window.innerWidth * 1.5 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth , window.innerHeight/ 1.5 );
    }
    const camAngleOne = document.getElementById("front-camera")

    function setCameraOne(e) {
      setCam(0)
    }
    const camAngleTwo = document.getElementById("iso-camera")

    function setCameraOne(e) {
      setCam(0)
    }
    function setCameraTwo(e) {
      setCam(-15)
    }
    camAngleOne.addEventListener("click", setCameraOne)
    camAngleTwo.addEventListener("click", setCameraTwo)
    window.addEventListener("resize", onWindowResize, false);
    animate();

    return () => mountRef.current.removeChild( renderer.domElement);
  }, [kitchenLength, kitchenDepth, wired, cam]);

  return (
    <div>
      <div className="edit-container">
        length
        <input id="length" type="range" min="9" max="15" defaultValue="6" onInput={getValue} />
        width
        <input id="depth" type="range" min="9" max="15" defaultValue="6" onInput={getDepth}/> 
        <button onClick={setWire}>WireFrame</button>
        <button id="front-camera">Front Elevation</button>
        <button id="iso-camera">Isometric View</button>
      </div>
      <div className="three-js" ref={mountRef}></div>
    </div>
  );
}


export default ThreeScene;