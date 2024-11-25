import { useState } from "react";
import useImageCropper from "./components/hooks/useCrop";

const App = () => {
  const { handleImageChange, CropModal } = useImageCropper();
  const [img, setIma] = useState<any>("");
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Image Cropper in React</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          if (event?.target && event.target.files) {
            handleImageChange(event.target.files[0], "cover");
          }
        }}
      />
      <CropModal
        onDone={(croppedImage) => {
          // setCount(count + 1);
          console.log(croppedImage);
          console.log(count, " ci sekili harasa set ele");
          setIma(croppedImage);
        }}
      />

      {img && (
        <img
          src={img}
          alt="Cropped"
          style={{ marginTop: "20px", width: 200, height: 200 }}
        />
      )}
    </div>
  );
};

export default App;
