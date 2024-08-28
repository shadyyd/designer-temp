// src/components/Controls.js

// eslint-disable-next-line react/prop-types
const Controls = ({ addText, addImage }) => {
  return (
    <div className="controls">
      <button onClick={() => addText("Sample Text")}>Add Text</button>
      <button onClick={() => addImage("https://example.com/image.jpg")}>
        Add Image
      </button>
    </div>
  );
};

export default Controls;
