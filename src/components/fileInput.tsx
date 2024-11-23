import { useRef } from "react";

export default function FileInput({ onImageSelected }: any) {
  const inputRef = useRef<any>();

  const handleOnchange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        onImageSelected(reader.result);
      };
    }
  };

  const onChooseImage = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <input
        onChange={handleOnchange}
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
      />
      <button onClick={onChooseImage}>Choose Image </button>
    </div>
  );
}
