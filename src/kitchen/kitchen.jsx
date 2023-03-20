import { useState, useEffect } from 'react';
import ThreeScene from './three-kitchen';
import Edit from '../edit-tab/edit';
import './kitchen.css';


function Kitchen() {


  return (
    <div className="kitchen-container">
      <ThreeScene ></ThreeScene>
    </div>
  );
}

export default Kitchen;
