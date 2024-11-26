import { Image } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import useImageCropper from "../hooks/useCrop";

export default function CropSingleFile({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
}) {
  const { handleImageChange, CropModal } = useImageCropper();
  const [image, setImage] = useState<string | null>(value || null);

  useEffect(() => {
    if (image && onChange) {
      onChange(image);
    }
  }, [image, onChange]);

  return (
    <>
      <Dragger
        accept="image/*"
        multiple={false}
        showUploadList={false}
        customRequest={({ file }) => {
          handleImageChange(file as any);
        }}
        style={{ padding: 20, border: "1px dashed #d9d9d9", borderRadius: 4 }}
      >
        <p>Buraya şəkil sürüşdür və ya seç</p>
      </Dragger>

      <CropModal
        onDone={(croppedImage) => {
          setImage(croppedImage);
          console.log(croppedImage);
        }}
      />
      {image && (
        <Image
          // Base64 string-i birbaşa `src` kimi istifadə edin
          src={URL.createObjectURL(new Blob([image]))}
          alt="Cropped"
          style={{ marginTop: "20px", width: 200, height: 200 }}
        />
      )}
    </>
  );
}
