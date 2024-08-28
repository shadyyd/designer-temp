import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

const productImageUrl = "/T-SHIRT.png   ";

const Designer = () => {
  const canvasRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [layers, setLayers] = useState([]);
  const [textProps, setTextProps] = useState({
    fontSize: 24,
    fill: "#000000",
  });

  useEffect(() => {
    // Initialize the Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: 500,
      width: 700,
      backgroundColor: "#f3f3f3",
    });

    const loadBackgroundImage = (url) => {
      if (url) {
        fabric.Image.fromURL(
          url,
          (img) => {
            img.set({
              selectable: false, // Make the base product image non-selectable
              evented: false, // Disable events on the base product image
              scaleX: canvas.width / img.width, // Scale image to fit canvas width
              scaleY: canvas.height / img.height, // Scale image to fit canvas height
            });
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
              crossOrigin: "anonymous", // Handle cross-origin issues
            });
          },
          { crossOrigin: "anonymous" }
        ); // Handle cross-origin issues
      }
    };

    loadBackgroundImage(productImageUrl);

    // Enable object selection and update layers
    canvas.on("selection:created", (event) => {
      setSelectedObject(event.target);
    });

    canvas.on("selection:updated", (event) => {
      setSelectedObject(event.target);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    // Update layers when objects are added or removed
    const updateLayers = () => {
      setLayers(
        canvas.getObjects().map((obj, index) => ({
          id: index,
          type: obj.type,
          object: obj,
        }))
      );
    };

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);

    // Function to handle base product image upload
    const handleProductUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (f) => {
          const data = f.target.result;
          fabric.Image.fromURL(data, (img) => {
            img.set({
              selectable: false, // Make the base product image non-selectable
              evented: false, // Disable events on the base product image
              scaleX: canvas.width / img.width, // Scale image to fit canvas width
              scaleY: canvas.height / img.height, // Scale image to fit canvas height
            });
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          });
        };
        reader.readAsDataURL(file);
      }
    };

    // Function to handle image upload
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (f) => {
          const data = f.target.result;
          fabric.Image.fromURL(data, (img) => {
            img.scaleToWidth(200);
            img.scaleToHeight(200);
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
          });
        };
        reader.readAsDataURL(file);
      }
    };

    // Function to add text to the canvas
    const addText = () => {
      const text = new fabric.Textbox("Enter text here", {
        left: 100,
        top: 100,
        ...textProps,
        editable: true,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    };

    // Attach event listeners
    document
      .getElementById("productUpload")
      .addEventListener("change", handleProductUpload);
    document
      .getElementById("imageUpload")
      .addEventListener("change", handleImageUpload);
    document.getElementById("addTextBtn").addEventListener("click", addText);

    // Cleanup on component unmount
    return () => {
      canvas.dispose();
    };
  }, [textProps]);

  // Function to update text properties
  const updateTextProps = (prop, value) => {
    if (selectedObject && selectedObject.type === "textbox") {
      selectedObject.set(prop, value);
      selectedObject.setCoords();
      selectedObject.canvas.renderAll();
      setTextProps((prevProps) => ({ ...prevProps, [prop]: value }));
    }
  };

  // Function to update the scale of the selected object
  const updateScale = (scale) => {
    if (
      selectedObject &&
      (selectedObject.type === "image" || selectedObject.type === "textbox")
    ) {
      selectedObject.scale(scale).setCoords();
      selectedObject.canvas.renderAll();
    }
  };

  // Function to move the selected object to the front
  const bringToFront = () => {
    if (selectedObject) {
      selectedObject.bringToFront();
      selectedObject.canvas.renderAll();
    }
  };

  // Function to move the selected object to the back
  const sendToBack = () => {
    if (selectedObject) {
      selectedObject.sendToBack();
      selectedObject.canvas.renderAll();
    }
  };

  return (
    <div>
      <h1>Product Designer</h1>
      <div>
        <input type="file" id="productUpload" accept="image/*" />
        <input type="file" id="imageUpload" accept="image/*" />
        <button id="addTextBtn">Add Text</button>
        {selectedObject && selectedObject.type === "textbox" && (
          <div style={{ marginTop: "10px" }}>
            <label>
              Font Size:
              <input
                type="number"
                value={textProps.fontSize}
                onChange={(e) =>
                  updateTextProps("fontSize", parseInt(e.target.value))
                }
              />
            </label>
            <label>
              Color:
              <input
                type="color"
                value={textProps.fill}
                onChange={(e) => updateTextProps("fill", e.target.value)}
              />
            </label>
          </div>
        )}
        {selectedObject && (
          <div style={{ marginTop: "10px" }}>
            <label>
              Scale:
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                defaultValue="1"
                onChange={(e) => updateScale(parseFloat(e.target.value))}
              />
            </label>
            <button onClick={bringToFront}>Bring to Front</button>
            <button onClick={sendToBack}>Send to Back</button>
          </div>
        )}
        <div style={{ marginTop: "20px" }}>
          <h3>Layers:</h3>
          <ul>
            {layers.map((layer, index) => (
              <li key={index}>{layer.type}</li>
            ))}
          </ul>
        </div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Designer;
