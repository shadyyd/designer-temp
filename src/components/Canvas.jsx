// import React, { useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";

// const Canvas = () => {
//   const canvasRef = useRef(null);
//   const [selectedObject, setSelectedObject] = useState(null);
//   const [layers, setLayers] = useState([]);
//   const [textProps, setTextProps] = useState({
//     fontSize: 24,
//     fill: "#000000",
//   });

//   useEffect(() => {
//     // Initialize the Fabric.js canvas
//     const canvas = new fabric.Canvas(canvasRef.current, {
//       height: 500,
//       width: 700,
//       backgroundColor: "#f3f3f3",
//     });

//     // Enable object selection and update layers
//     const updateLayers = () => {
//       const objects = canvas
//         .getObjects()
//         .filter((obj) => obj !== canvas.backgroundImage);
//       setLayers(
//         objects.map((obj, index) => ({
//           id: index,
//           type: obj.type,
//           object: obj,
//           visible: obj.visible,
//           locked: obj.lockMovementX && obj.lockMovementY,
//         }))
//       );
//     };

//     canvas.on("object:added", updateLayers);
//     canvas.on("object:removed", updateLayers);
//     canvas.on("selection:created", (event) => setSelectedObject(event.target));
//     canvas.on("selection:updated", (event) => setSelectedObject(event.target));
//     canvas.on("selection:cleared", () => setSelectedObject(null));

//     // Function to handle base product image upload
//     const handleProductUpload = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (f) => {
//           const data = f.target.result;
//           fabric.Image.fromURL(data, (img) => {
//             img.set({
//               selectable: false,
//               evented: false,
//               scaleX: canvas.width / img.width,
//               scaleY: canvas.height / img.height,
//             });
//             canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
//           });
//         };
//         reader.readAsDataURL(file);
//       }
//     };

//     // Function to handle image upload
//     const handleImageUpload = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (f) => {
//           const data = f.target.result;
//           fabric.Image.fromURL(data, (img) => {
//             img.scaleToWidth(200);
//             img.scaleToHeight(200);
//             canvas.add(img);
//             canvas.setActiveObject(img);
//             canvas.renderAll();
//           });
//         };
//         reader.readAsDataURL(file);
//       }
//     };

//     // Function to add text to the canvas
//     const addText = () => {
//       const text = new fabric.Textbox("Enter text here", {
//         left: 100,
//         top: 100,
//         ...textProps,
//         editable: true,
//       });
//       canvas.add(text);
//       canvas.setActiveObject(text);
//       canvas.renderAll();
//     };

//     // Attach event listeners
//     document
//       .getElementById("productUpload")
//       .addEventListener("change", handleProductUpload);
//     document
//       .getElementById("imageUpload")
//       .addEventListener("change", handleImageUpload);
//     document.getElementById("addTextBtn").addEventListener("click", addText);

//     // Cleanup on component unmount
//     return () => {
//       canvas.dispose();
//     };
//   }, [textProps]);

//   // Function to update text properties
//   const updateTextProps = (prop, value) => {
//     if (selectedObject && selectedObject.type === "textbox") {
//       selectedObject.set(prop, value);
//       selectedObject.setCoords();
//       selectedObject.canvas.renderAll();
//       setTextProps((prevProps) => ({ ...prevProps, [prop]: value }));
//     }
//   };

//   // Function to update the scale of the selected object
//   const updateScale = (scale) => {
//     if (
//       selectedObject &&
//       (selectedObject.type === "image" || selectedObject.type === "textbox")
//     ) {
//       selectedObject.scale(scale).setCoords();
//       selectedObject.canvas.renderAll();
//     }
//   };

//   // Layer control functions
//   const bringToFront = (layer) => {
//     layer.object.bringToFront();
//     layer.object.canvas.renderAll();
//     updateLayers();
//   };

//   const sendToBack = (layer) => {
//     layer.object.sendToBack();
//     layer.object.canvas.renderAll();
//     updateLayers();
//   };

//   const toggleVisibility = (layer) => {
//     layer.object.set("visible", !layer.object.visible);
//     layer.object.canvas.renderAll();
//     updateLayers();
//   };

//   const toggleLock = (layer) => {
//     layer.object.set({
//       lockMovementX: !layer.object.lockMovementX,
//       lockMovementY: !layer.object.lockMovementY,
//     });
//     layer.object.canvas.renderAll();
//     updateLayers();
//   };

//   const deleteLayer = (layer) => {
//     layer.object.canvas.remove(layer.object);
//     updateLayers();
//   };

//   return (
//     <div>
//       <h1>Product Designer</h1>
//       <div>
//         <input type="file" id="productUpload" accept="image/*" />
//         <input type="file" id="imageUpload" accept="image/*" />
//         <button id="addTextBtn">Add Text</button>
//         {selectedObject && selectedObject.type === "textbox" && (
//           <div style={{ marginTop: "10px" }}>
//             <label>
//               Font Size:
//               <input
//                 type="number"
//                 value={textProps.fontSize}
//                 onChange={(e) =>
//                   updateTextProps("fontSize", parseInt(e.target.value))
//                 }
//               />
//             </label>
//             <label>
//               Color:
//               <input
//                 type="color"
//                 value={textProps.fill}
//                 onChange={(e) => updateTextProps("fill", e.target.value)}
//               />
//             </label>
//           </div>
//         )}
//         {selectedObject && (
//           <div style={{ marginTop: "10px" }}>
//             <label>
//               Scale:
//               <input
//                 type="range"
//                 min="0.1"
//                 max="2"
//                 step="0.1"
//                 defaultValue="1"
//                 onChange={(e) => updateScale(parseFloat(e.target.value))}
//               />
//             </label>
//           </div>
//         )}
//         <div style={{ marginTop: "20px" }}>
//           <h3>Layers:</h3>
//           <ul>
//             {layers.map((layer, index) => (
//               <li key={index}>
//                 {layer.type} -
//                 <button onClick={() => bringToFront(layer)}>
//                   Bring to Front
//                 </button>
//                 <button onClick={() => sendToBack(layer)}>Send to Back</button>
//                 <button onClick={() => toggleVisibility(layer)}>
//                   {layer.visible ? "Hide" : "Show"}
//                 </button>
//                 <button onClick={() => toggleLock(layer)}>
//                   {layer.locked ? "Unlock" : "Lock"}
//                 </button>
//                 <button onClick={() => deleteLayer(layer)}>Delete</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <canvas ref={canvasRef} />
//     </div>
//   );
// };

// export default Canvas;
