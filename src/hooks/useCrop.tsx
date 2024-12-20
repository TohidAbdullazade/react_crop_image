import { Radio } from "antd";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useEffect, useRef, useState } from "react";

const useImageCropper = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<any>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(9 / 16);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    // handleImageChange({ target: { files: null } } as any);
  };
  useEffect(() => {
    if (imageRef.current) {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }

      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: aspectRatio,
        viewMode: 1,
        autoCropArea: 0.8,
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
    };
  }, [imageSrc, aspectRatio]);

  const handleImageChange = (file: File) => {
    openModal();
    if (!file) return null;
    const reader = new FileReader();
    reader.onloadend = () => {
      const image = reader.result as string;
      setImageSrc(image);
    };

    reader.readAsDataURL(file);
  };

  // Islek
  // const handleCrop = () => {
  //   if (cropperRef.current) {
  //     const croppedDataUrl = cropperRef.current.getCroppedCanvas().toDataURL();
  //     setCroppedImage(croppedDataUrl);
  //   }
  // };

  const handleCrop = () => {
    if (cropperRef.current) {
      cropperRef.current.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          setCroppedImage(blob as File);
        }
      });
    }
  };

  const handleAspectRatioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === "16/9" ? 16 / 9 : 9 / 16;
    setAspectRatio(value);
  };
  const CropModal = ({ onDone }: { onDone: (image: any) => void }) => {
    useEffect(() => {
      onDone(croppedImage as File);
      // setIsModalOpen(false);
    }, [croppedImage]);
    return (
      isModalOpen &&
      imageSrc && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2>Crop Your Image</h2>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                ref={imageRef}
                src={imageSrc as string}
                alt="Preview"
                style={{ width: "100%", maxHeight: "400px" }}
              />
            </div>

            <div style={{ marginTop: "10px" }}>
              <Radio.Group buttonStyle="solid">
                <Radio value="16/9">16:9</Radio>
                <Radio value="9/16">9:16</Radio>
              </Radio.Group>
              <label style={{ marginLeft: "10px" }}>
                <input
                  type="radio"
                  name="aspectRatio"
                  value="9/16"
                  onChange={handleAspectRatioChange}
                />
                9:16
              </label>
            </div>

            <button
              onClick={() => {
                handleCrop();
                closeModal();
              }}
              style={{ marginRight: "10px" }}
            >
              Crop Image
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )
    );
  };

  return {
    handleImageChange,

    CropModal,
  };
};

export default useImageCropper;
