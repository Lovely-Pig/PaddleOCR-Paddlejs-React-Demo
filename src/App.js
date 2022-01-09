import React from "react";
import * as ocr from "@paddlejs-models/ocrdet";
import { Upload, Button, Image } from "antd";
import { UploadOutlined, RightCircleTwoTone } from "@ant-design/icons";
import "./App.css";

function drawBox(points, imgElement, canvasOutput) {
  canvasOutput.width = imgElement.width;
  canvasOutput.height = imgElement.height;
  const ratio = imgElement.naturalHeight / imgElement.height;

  const ctx = canvasOutput.getContext("2d");
  ctx.drawImage(imgElement, 0, 0, canvasOutput.width, canvasOutput.height);
  points.forEach((point) => {
    // 开始一个新的绘制路径
    ctx.beginPath();
    // 设置线条颜色为红色
    ctx.strokeStyle = "red";
    // 设置路径起点坐标
    ctx.moveTo(point[0][0] / ratio, point[0][1] / ratio);
    ctx.lineTo(point[1][0] / ratio, point[1][1] / ratio);
    ctx.lineTo(point[2][0] / ratio, point[2][1] / ratio);
    ctx.lineTo(point[3][0] / ratio, point[3][1] / ratio);
    ctx.closePath();
    ctx.stroke();
  });
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: "",
      imgStyle: {
        height: "600px",
      },
    };
  }

  async componentDidMount() {
    console.log("loading...");
    // 模型初始化
    await ocr.load();
    console.log("loading OK");
  }

  detect = async () => {
    const imgElement = document.getElementById("image").firstChild;
    const canvasOutput = document.getElementById("canvas");
    // console.log("imgElement:", imgElement);
    // console.log("canvasOutput:", canvasOutput);
    const res = await ocr.detect(imgElement);
    console.log("res:", res);
    drawBox(res, imgElement, canvasOutput);
  };

  handleChange = async (info) => {
    const img = URL.createObjectURL(info.file);
    this.setState({ imgUrl: img });
    this.setState({ imgStyle: { height: "auto" } });

    setTimeout(() => {
      this.detect();
    }, 600);
  };

  handleBeforeUpload = async () => {
    console.log("beforeUpload");

    return false;
  };

  render() {
    const props = {
      action: "abc",
      onChange: this.handleChange,
      beforeUpload: this.handleBeforeUpload,
      multiple: false,
      showUploadList: false,
      imgUrl: this.state.imgUrl,
      imgStyle: this.state.imgStyle,
    };
    return (
      <>
        <div className="Page-title">PaddleOCR Paddle.js React Demo</div>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>上传图片</Button>
        </Upload>
        <div className="Image-show">
          <Image
            className="Image-raw"
            id="image"
            style={props.imgStyle}
            src={props.imgUrl}
            fallback="/logo512.png"
          />
          <RightCircleTwoTone />
          <canvas
            className="Image-ocr"
            id="canvas"
            style={props.imgStyle}
          ></canvas>
        </div>
      </>
    );
  }
}

export default App;
