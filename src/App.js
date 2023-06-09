import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, Button } from "reactstrap";
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';
import { SketchPicker } from 'react-color';
import anime from "animejs/lib/anime.es.js";

import testImage from './assets/hero1.png'

export const transitionTypes = [
  {
    // 0
    name: "fade",
    animation: {
      opacity: [0.1, 1],
      // direction: 'alternate',
    },
  },
  {
    // 1
    name: "fadeUp",
    animation: {
      opacity: [0.1, 1],
      scale: [0.5, 1],
      translateY: [+500, 0],
    },
  },
  {
    // 2
    name: "slide",
    animation: {
      translateX: [-500, 0],
    },
  },
  {
    // 3
    name: "slideUp",
    animation: {
      translateY: [+500, 0],
    },
  },
  {
    // 4
    name: "rotate",
    animation: {
      scale: [0.5, 1],
      rotate: ["+=1turn"], //
    },
  },
  {
    // 5
    name: "rotateX",
    animation: {
      scale: [0.2, 1],
      rotateX: "+=2turn", //
    },
  },
  {
    // 6
    name: "rotateY",
    animation: {
      scale: [0.2, 1],
      rotateY: "+=2turn", //
    },
  },
  {
    // 7
    name: "zoom",
    animation: {
      scale: [0.1, 1],
      opacity: [0.7, 1],
    },
  },
  {
    // 8
    name: "flash",
    animation: {
      opacity: [0.2, 0.7, 0.3, 1],
    },
  },
  {
    // 9
    name: "plus",
    animation: {
      scale: [0.9, 1.3, 1],
    },
  },
  {
    // 10
    name: "bounce",
    animation: {
      translateY: [-350, 0],
      easing: "spring(1, 80, 10, 0)",
    },
  },
  {
    // 11
    name: "rubber",
    animation: {
      scaleX: [1, 1.2, 0.95, 1],
      scaleY: [1, 0.8, 1.1, 1],
    },
  },
  {
    // 12
    name: "tada",
    animation: {
      scale: [1, 0.9, 1, 1, 1],
      rotate: [
        "+=0turn",
        "+=0.05turn",
        "-=0.1turn",
        "+=0.07turn",
        "-=0.02turn",
      ], //
      // skew: ['0','-20','0'],
    },
  },
  {
    // 13
    name: "skew",
    animation: {
      skewY: ["-40", "+40", 0],
    },
  },
];

function App() {
  const imageRef = useRef(null);
  const layerRef = useRef(null);
  const [image] = useImage(testImage);
  const [targetColor, setTargetColor] = useState('#fff');
  const [targetColorRGB, setTargetColorRGB] = useState([]);
  const [newColor, setNewColor] = useState('#fff');
  const [newColorRGB, setNewColorRGB] = useState([]);
  const [oldImgData, setOldImgData] = useState([]);
  const [transitionType, setTransitionType] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [annoyingAnimation, setAnnoyingAnimation] = useState(false);

  useEffect(() => {    
    function getRelativePointerPosition(node) {
      var transform = node.getAbsoluteTransform().copy();
      // to detect relative position we need to invert transform
      transform.invert();

      // get pointer (say mouse or touch) position
      var pos = node.getStage().getPointerPosition();

      // now we can find relative point
      return transform.point(pos);
    }

    imageRef.current.on('mouseup', function () {
      const imageCanvas = imageRef.current.getCanvas();
      const context = imageRef.current.getContext();
      const pos = getRelativePointerPosition(this);
      const imgData = context.getImageData(pos.x,pos.y,1,1).data;
      setTargetColorRGB(imgData);    
      let red = imgData[0].toString(16);
      red = red.length > 1 ? red : '0' + red ;
      let green = imgData[1].toString(16);
      green = green.length > 1 ? green : '0' + green ;
      let blue = imgData[2].toString(16);
      blue = blue.length > 1 ? blue : '0' + blue ;
      setTargetColor(`#${red}${green}${blue}`);

    });
   
  }, []);

  // console.log('targetColor=>', targetColor);
  // console.log('targetColorRGB=>', targetColorRGB);
  // console.log('newColor=>', newColor);
  // console.log('newColorRGB=>', newColorRGB);
  // console.log('oldImgData=>', oldImgData);

  const handleChangeComplete = (color) => {    
    setNewColorRGB(color.rgb);
    setNewColor(color.hex);
  };

  const handleClickReplace = (e) => {
    const imageCanvas = imageRef.current.getCanvas();
    const context = imageRef.current.getContext();
    const imgData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    // console.log('imgData=>', imgData);
    // setOldImgData(imgData.data);
    let oldImage = [];
    if (newColor && targetColorRGB) {
      for (let i = 0; i < imgData.data.length; i += 4) {
        oldImage = imgData.data[0]
        if( imgData.data[i] === targetColorRGB[0] &&
        imgData.data[i + 1] === targetColorRGB[1] &&
        imgData.data[i + 2]  === targetColorRGB[2]) {
          imgData.data[i] = newColorRGB.r;
          imgData.data[i + 1] = newColorRGB.g;
          imgData.data[i + 2] = newColorRGB.b;
          imgData.data[i + 3] = 255;
        }
      }
      context.putImageData(imgData, 0, 0);
    }
  }
  const handleClickUndo = (e) => {
    const imageCanvas = imageRef.current.getCanvas();
    const context = imageRef.current.getContext();
    const imgData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = oldImgData[i];
      imgData.data[i + 1] = oldImgData[i + 1];
      imgData.data[i + 2] = oldImgData[i + 2];
      imgData.data[i + 3] = 255;
    }
    context.putImageData(imgData, 0, 0);

  }
  const applyPanoramaAnnoying = () => {
    const canvasEl = document.getElementById("text");
      console.log('annoyingAnimation=>', transitionType)
    if (canvasEl) {
      // if (annoyingAnimation) {
      //   annoyingAnimation.restart();
      //   return;
      // }
      const annoyingAnimation1 = transitionType
        ? anime({
            targets: canvasEl,
            easing: "easeInOutSine",
            duration: transitionDuration,
            ...transitionTypes[transitionType].animation,
          })
        : anime({
            targets: canvasEl,
            duration: 1000,
            easing: "easeInOutSine",
            ...transitionTypes[0].animation,
          });
      annoyingAnimation1.restart();
      setAnnoyingAnimation(annoyingAnimation1);
      setTransitionType(Math.floor(Math.random() * 12))
    }
  };
  const handleAnimation = (e) => {
    applyPanoramaAnnoying()
  }
  return (
    <React.Fragment>
      <Col sm={12} className="container">
        <Row  className="container d-flex" style={{ display: 'flex',justifyContent: 'center', marginTop: '50px'}}>
          <Col sm={10} style={{border: '2px solid #f3ac25', borderRadius: 5, cursor:'pointer'}}>
            <Stage width={500} height={300}>
              <Layer ref={layerRef}>
                <Image ref={imageRef} image={image} />
              </Layer>
            </Stage>
          </Col>
          <Col sm={2} className="d-flex" style={{ display: 'flex'}}>
            <Row style={{ display: 'flex', flexDirection: 'column'}}>
              <div style={{border: '1px solid', margin: '20px 50px 20px 60px', width: 100, height: 100, backgroundColor: targetColor }} />
              <p style={{marginLeft: 70}} >Target Color</p>
              <Button style={{ margin: '20px 50px 20px 65px', width: 100}} onClick={handleClickReplace}>Replace</Button>
            {/* <Button className="w-100" onClick={handleClickUndo}>Undo</Button> */}
            </Row>
            <Row style={{ display: 'flex', flexDirection: 'column'}}>
              <SketchPicker 
                color={ newColor }
                onChangeComplete={ handleChangeComplete }
              />
              <p style={{marginLeft: 60}} >New Color</p>          
            </Row>
          </Col>
        </Row>
        <Row  className="container d-flex" style={{position:'relative', display: 'flex', flexDirection: "column", alignItems:"center", justifyContent: 'center', marginTop: '50px'}}>
        <video id="myVideo" width="320" height="240" controls crossOrigin="true">
          <source src="sample-mp4-file.mp4" type="video/mp4" />
        </video>
        <div id="text" style={{position:'absolute', top:'30%', left: '47%', color: 'yellow', fontSize: 30}} >
          Test Text
        </div>
        <Button style={{ margin: '20px 50px 20px 65px', width: 100}} onClick={handleAnimation}>Text animation</Button>
        </Row>
      </Col>
    </React.Fragment>
  );
}

export default App;
