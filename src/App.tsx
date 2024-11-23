import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Image, Modal, Upload } from "antd";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import "./App.css";
import getCroppedImg from "./components/cropper";

const App = () => {
  const [form] = Form.useForm();
  const [currentImage, setCurrentImage] = useState<string | null>(null); // Image being cropped
  const [croppedImages, setCroppedImages] = useState<Blob[]>([]); // Cropped images
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [modalSize, setModalSize] = useState<{ width: number; height: number }>(
    {
      width: 900,
      height: 500,
    }
  );

  // Handle image upload and open crop modal
  const handleUpload = (file: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentImage(reader.result as string);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!currentImage || !croppedAreaPixels) return;
    const croppedImgBlob = await getCroppedImg(currentImage, croppedAreaPixels);
    setCroppedImages((prev) => [...prev, croppedImgBlob]);
    setIsModalOpen(false);
    setCurrentImage(null); // Clear current image
  }, [currentImage, croppedAreaPixels]);

  const onFinish = async (values: any) => {
    if (croppedImages.length === 0) {
      alert("Zəhmət olmasa şəkilləri kəsin.");
      return;
    }

    const formData = new FormData();
    croppedImages.forEach((image, index) => {
      formData.append(`file${index}`, image, `cropped-image-${index}.jpg`);
    });

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    try {
      const response = await fetch("https://your-backend-api.com/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Uploaded Successfully:", result);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const handleAspectRatioChange = (ratio: number) => {
    setAspectRatio(ratio);

    if (ratio === 16 / 9) {
      setModalSize({ width: 900, height: 500 }); // 16:9 modal size
    } else if (ratio === 9 / 16) {
      setModalSize({ width: 500, height: 900 }); // 9:16 modal size
    }
  };

  return (
    <div className="App">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Upload
          maxCount={1000}
          customRequest={({ file, onSuccess }) => {
            handleUpload(file);
            onSuccess?.({}, file);
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Şəkil yüklə</Button>
        </Upload>

        {/* Cropping modal */}
        <Modal
          width={modalSize.width}
          height={modalSize.height}
          centered
          className="crop-modal"
          title={<h2 style={{ margin: 0 }}>Şəkil Kəsmə</h2>}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          {currentImage && (
            <>
              <div className="crop-container">
                <Cropper
                  image={currentImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: "20px",
                }}
              >
                <div
                  onClick={() => handleAspectRatioChange(16 / 9)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    border: "1px solid red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    cursor: "pointer",
                  }}
                >
                  16/9
                </div>
                <div
                  onClick={() => handleAspectRatioChange(9 / 16)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    border: "1px solid red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    cursor: "pointer",
                  }}
                >
                  9/16
                </div>
              </div>
            </>
          )}

          <div className="action-buttons">
            <Button
              type="default"
              onClick={() => setIsModalOpen(false)}
              style={{
                marginRight: "10px",
                backgroundColor: "#f5f5f5",
                borderColor: "#d9d9d9",
                color: "#000",
              }}
            >
              İmtina et
            </Button>
            <Button
              type="primary"
              onClick={showCroppedImage}
              style={{
                backgroundColor: "#4caf50",
                borderColor: "#4caf50",
              }}
            >
              Kəs
            </Button>
          </div>
        </Modal>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Göndər
          </Button>
        </Form.Item>
      </Form>

      {/* Display cropped images */}
      <div
        className="cropped-images"
        style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
      >
        <h3>Kəsilmiş Şəkillər:</h3>
        {croppedImages.map((croppedImage, index) => (
          <Image
            width={200}
            height={200}
            key={index}
            src={URL.createObjectURL(croppedImage)}
            alt={`Cropped ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
