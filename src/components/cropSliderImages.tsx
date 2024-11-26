import { Image } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import useImageCropper from "../hooks/useCrop";

export default function CropSliderImages({
  value,
  onChange,
}: {
  value?: any;
  onChange?: (val: any) => void;
}) {
  const { handleImageChange, CropModal } = useImageCropper();
  const [image, setImage] = useState<any>(value || null);

  useEffect(() => {
    if (image && onChange) {
      onChange(image as File);
    }
  }, [image, onChange]);

  return (
    <>
      <Dragger
        accept="image/*"
        multiple={true}
        showUploadList={false}
        customRequest={({ file }) => {
          handleImageChange(file as File);
        }}
        style={{ padding: 20, border: "1px dashed #d9d9d9", borderRadius: 4 }}
      >
        <p>Buraya şəkil sürüşdür və ya seç</p>
      </Dragger>

      <CropModal
        onDone={(croppedImage) => {
          setImage(croppedImage);
        }}
      />
      {image && (
        <Image
          src={URL.createObjectURL(new Blob([image]))}
          alt="Cropped"
          style={{ marginTop: "20px", width: 200, height: 200 }}
        />
      )}
    </>
  );
}
