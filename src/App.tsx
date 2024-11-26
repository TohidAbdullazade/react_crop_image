import { Button, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import CropSingleFile from "./components/cropSingleFile";
import CropSliderImages from "./components/cropSliderImages";
import axios from "axios";

const App = () => {
  const [form] = useForm();

  const handleFinish = (value: any) => {
    const formData = new FormData();

    formData.append("mobileCoverImage", value.mobileCoverImage);
    formData.append("mobileSliderImage", value.mobileSliderImage);

    axios.post("/api", formData).then((res) => {
      console.log(res);
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Image Cropper in React</h1>
      {/* Form */}
      <Form form={form} onFinish={handleFinish}>
        <Form.Item valuePropName="value" name="mobileCoverImage">
          <CropSingleFile />
        </Form.Item>
        <Form.Item valuePropName="value" name="mobileSliderImage">
          <CropSliderImages />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
