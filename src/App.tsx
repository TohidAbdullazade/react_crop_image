import { useState } from "react";
import useImageCropper from "./components/hooks/useCrop";
import { Image, Upload } from "antd";

const { Dragger } = Upload;

const App = () => {
  const { handleImageChange, CropModal } = useImageCropper();
  const [image, setImage] = useState<string | null>(null);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Image Cropper in React</h1>

      <Dragger
        accept="image/*"
        multiple={false}
        showUploadList={false}
        customRequest={({ file }) => {
          handleImageChange(file, "cover");
        }}
        style={{ padding: 20, border: "1px dashed #d9d9d9", borderRadius: 4 }}
      >
        <p>Drag and drop an image here, or click to select one</p>
      </Dragger>

      <CropModal
        onDone={(croppedImage) => {
          setImage(croppedImage);
        }}
      />

      {image && (
        <Image
          src={image}
          alt="Cropped"
          style={{ marginTop: "20px", width: 200, height: 200 }}
        />
      )}
    </div>
  );
};

export default App;
