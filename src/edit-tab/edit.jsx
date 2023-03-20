import { useState, useEffect } from 'react';
import './edit.css';

function Edit(props) {
  const [kitchenLength, setKitchenLength] = useState(props.length);
  const [cabinets, setCabinets] = useState([]);

  function getSectionsLengths(length, minWidth, maxWidth) {
    // Calculate the maximum number of sections that can be obtained with the maximum width.
    const maxNumSections = Math.floor(length / minWidth);
    // Check each possible number of sections, starting from the maximum.
    for (let numSections = maxNumSections; numSections > 0; numSections--) {
      const sectionWidth = length / numSections;
      // If the section width is within the allowed range, calculate the length of each section.
      if (minWidth <= sectionWidth && sectionWidth <= maxWidth) {
        const sectionLength = +(length / numSections).toFixed(2); // Convert to decimal number with 2 decimal places.
        const sectionsLengths = new Array(numSections).fill(sectionLength);
        return sectionsLengths;
      }
    }
    // If no valid number of sections was found, return an empty array.
    return [];
  }


  function getValue(e) {
    let currentValue = getSectionsLengths(e.target.value, 2, 2.5)
    setKitchenLength(e.target.value)
    setCabinets(currentValue)
    props.setLength(kitchenLength)
    // console.log(kitchenLength, cabinets)
  }
  return (
    <div className="edit-container">
      <input id="length" type="range" min="5" max="10" onInput={getValue}/> 
    </div>
  );
}

export default Edit;