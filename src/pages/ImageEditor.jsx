// ImageEditor.js
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import getCroppedImg from '../utils/cropImage';
import { motion } from 'framer-motion';
import { 
  FiCrop, FiRotateCw, FiSun, FiType, FiDroplet, FiImage, FiDownload,
  FiSliders, FiBox, FiXCircle, FiMove, FiArrowUp, FiArrowRight,
  FiPlus, FiLayout, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

const ImageEditor = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  
  // Editing states
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [borderRadius, setBorderRadius] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [texts, setTexts] = useState([]);
  const [activeTextIndex, setActiveTextIndex] = useState(-1);
  const [watermark, setWatermark] = useState(null);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkSize, setWatermarkSize] = useState(100);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 50, y: 50 });
  const [framePadding, setFramePadding] = useState(20);
  const [frameBorder, setFrameBorder] = useState({ width: 2, color: '#cccccc' });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [openPanel, setOpenPanel] = useState('');

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSelectFile = (e) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setCroppedImage(null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(cropped);
      setOpenPanel('transform');
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleExport = async () => {
    if (!croppedImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = await createImage(croppedImage);

    // Calculate dimensions with transformations
    const padding = framePadding + frameBorder.width;
    const width = img.width * scale + padding * 2;
    const height = img.height * scale + padding * 2;
    
    canvas.width = width;
    canvas.height = height;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw background image if exists
    if (backgroundImage) {
      const bgImg = await createImage(backgroundImage);
      ctx.drawImage(bgImg, 0, 0, width, height);
    }

    // Draw frame border
    ctx.strokeStyle = frameBorder.color;
    ctx.lineWidth = frameBorder.width;
    ctx.strokeRect(0, 0, width, height);

    // Apply transformations
    ctx.translate(width/2, height/2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Clip rounded corners
    ctx.beginPath();
    ctx.roundRect(
      -img.width/2 - framePadding,
      -img.height/2 - framePadding,
      img.width + framePadding*2,
      img.height + framePadding*2,
      borderRadius
    );
    ctx.clip();

    // Draw main image
    ctx.drawImage(img, -img.width/2 - framePadding, -img.height/2 - framePadding);

    // Draw watermark
    if (watermark) {
      const watermarkImg = await createImage(watermark);
      ctx.globalAlpha = watermarkOpacity;
      const x = (img.width * (watermarkPosition.x/100)) - (watermarkSize/2);
      const y = (img.height * (watermarkPosition.y/100)) - (watermarkSize/2);
      ctx.drawImage(
        watermarkImg,
        x,
        y,
        watermarkSize,
        watermarkSize
      );
      ctx.globalAlpha = 1;
    }

    // Draw texts
    texts.forEach(textObj => {
      ctx.fillStyle = textObj.color;
      ctx.font = `${textObj.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(
        textObj.content,
        (img.width * (textObj.x/100)) - img.width/2,
        (img.height * (textObj.y/100)) - img.height/2
      );
    });

    // Export image
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-image.png';
    a.click();
  };

  const createImage = (url) => new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
  });

  const addNewText = () => {
    const newText = {
      content: 'New Text',
      x: 50,
      y: 50,
      size: 24,
      color: '#000000',
      id: Date.now()
    };
    setTexts([...texts, newText]);
    setActiveTextIndex(texts.length);
  };

  const updateTextPosition = (index, axis, value) => {
    const updatedTexts = [...texts];
    updatedTexts[index][axis] = value;
    setTexts(updatedTexts);
  };

  const ControlPanel = ({ title, icon, children, panelName }) => (
    <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <button
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-t-2xl transition-colors"
        onClick={() => setOpenPanel(openPanel === panelName ? '' : panelName)}
      >
        <div className="flex items-center gap-3 text-gray-700">
          <span className="p-2 bg-gray-100 rounded-lg">{icon}</span>
          <span className="font-medium">{title}</span>
        </div>
        <span className="text-gray-400">
          {openPanel === panelName ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>
      {openPanel === panelName && (
        <div className="p-4 border-t border-gray-100 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8"
    >
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Section */}
        <div className="lg:col-span-1 space-y-6">
          <ControlPanel
            title="Image Upload"
            icon={<FiImage className="w-5 h-5" />}
            panelName="upload"
          >
            <label className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-center cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
              <input type="file" onChange={onSelectFile} className="hidden" />
              Choose Image
            </label>
          </ControlPanel>

          {imageSrc && !croppedImage && (
            <ControlPanel
              title="Crop Settings"
              icon={<FiCrop className="w-5 h-5" />}
              panelName="crop"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Zoom ({zoom}x)</label>
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e, v) => setZoom(v)}
                  />
                </div>
                <button
                  onClick={showCroppedImage}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Apply Crop
                </button>
              </div>
            </ControlPanel>
          )}

          {croppedImage && (
            <>
              <ControlPanel
                title="Transform"
                icon={<FiSliders className="w-5 h-5" />}
                panelName="transform"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">Rotation ({rotation}°)</label>
                    <Slider
                      value={rotation}
                      min={0}
                      max={360}
                      onChange={(e, v) => setRotation(v)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">Scale ({scale}x)</label>
                    <Slider
                      value={scale}
                      min={0.1}
                      max={3}
                      step={0.1}
                      onChange={(e, v) => setScale(v)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">Roundness ({borderRadius}px)</label>
                    <Slider
                      value={borderRadius}
                      min={0}
                      max={100}
                      onChange={(e, v) => setBorderRadius(v)}
                    />
                  </div>
                </div>
              </ControlPanel>

              <ControlPanel
                title="Background"
                icon={<FiLayout className="w-5 h-5" />}
                panelName="background"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">Background Color</label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={e => setBackgroundColor(e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">Background Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) setBackgroundImage(URL.createObjectURL(file));
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </ControlPanel>

              <ControlPanel
                title="Text"
                icon={<FiType className="w-5 h-5" />}
                panelName="text"
              >
                <div className="space-y-6">
                  <button
                    onClick={addNewText}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiPlus /> Add Text Layer
                  </button>
                  
                  {texts.map((text, index) => (
                    <div key={text.id} className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                      <input
                        type="text"
                        value={text.content}
                        onChange={e => {
                          const updated = [...texts];
                          updated[index].content = e.target.value;
                          setTexts(updated);
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <div>
                        <label className="block text-sm text-gray-600 mb-2 font-medium">Size ({text.size}px)</label>
                        <Slider
                          value={text.size}
                          min={12}
                          max={72}
                          onChange={(e, v) => {
                            const updated = [...texts];
                            updated[index].size = v;
                            setTexts(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2 font-medium">Color</label>
                        <input
                          type="color"
                          value={text.color}
                          onChange={e => {
                            const updated = [...texts];
                            updated[index].color = e.target.value;
                            setTexts(updated);
                          }}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2 font-medium">X Position</label>
                          <Slider
                            value={text.x}
                            min={0}
                            max={100}
                            onChange={(e, v) => updateTextPosition(index, 'x', v)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2 font-medium">Y Position</label>
                          <Slider
                            value={text.y}
                            min={0}
                            max={100}
                            onChange={(e, v) => updateTextPosition(index, 'y', v)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ControlPanel>

              <ControlPanel
                title="Watermark"
                icon={<FiDroplet className="w-5 h-5" />}
                panelName="watermark"
              >
                <div className="space-y-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) setWatermark(URL.createObjectURL(file));
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {watermark && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2 font-medium">Opacity</label>
                        <Slider
                          value={watermarkOpacity}
                          min={0}
                          max={1}
                          step={0.1}
                          onChange={(e, v) => setWatermarkOpacity(v)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2 font-medium">Size ({watermarkSize}px)</label>
                        <Slider
                          value={watermarkSize}
                          min={50}
                          max={300}
                          onChange={(e, v) => setWatermarkSize(v)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2 font-medium">X Position</label>
                          <Slider
                            value={watermarkPosition.x}
                            min={0}
                            max={100}
                            onChange={(e, v) => setWatermarkPosition(p => ({ ...p, x: v }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2 font-medium">Y Position</label>
                          <Slider
                            value={watermarkPosition.y}
                            min={0}
                            max={100}
                            onChange={(e, v) => setWatermarkPosition(p => ({ ...p, y: v }))}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setWatermark(null)}
                        className="text-red-500 text-sm flex items-center gap-2 hover:text-red-600 transition-colors"
                      >
                        <FiXCircle /> Remove Watermark
                      </button>
                    </>
                  )}
                </div>
              </ControlPanel>

              <button
                onClick={handleExport}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg font-medium"
              >
                <FiDownload className="w-5 h-5" /> Export Image
              </button>
            </>
          )}
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-3">
          <div className="bg-white backdrop-blur-lg bg-opacity-90 p-6 rounded-2xl shadow-lg border border-gray-100">
            {!croppedImage ? (
              imageSrc ? (
                <div className="relative w-full h-[600px] bg-gray-50 rounded-xl overflow-hidden shadow-inner">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    classes={{ containerClassName: 'rounded-xl' }}
                  />
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="text-center text-gray-500">
                    <FiImage className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Upload an image to get started</p>
                  </div>
                </div>
              )
            ) : (
              <div 
                className="relative mx-auto bg-white shadow-2xl transition-all duration-300"
                style={{
                  padding: framePadding + frameBorder.width,
                  background: backgroundColor,
                  border: `${frameBorder.width}px solid ${frameBorder.color}`,
                  borderRadius: borderRadius * 2
                }}
              >
                {backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
                )}
                <div
                  className="relative overflow-hidden transition-all duration-300"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                    borderRadius
                  }}
                >
                  <img
                    src={croppedImage}
                    alt="Cropped"
                    className="w-full h-full object-contain"
                  />
                  {texts.map((text, index) => (
                    <div
                      key={text.id}
                      className="absolute cursor-move transition-all duration-200"
                      style={{
                        left: `${text.x}%`,
                        top: `${text.y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: text.color,
                        fontSize: `${text.size}px`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      {text.content}
                    </div>
                  ))}
                  {watermark && (
                    <img
                      src={watermark}
                      alt="Watermark"
                      className="absolute transition-all duration-200"
                      style={{ 
                        width: `${watermarkSize}px`,
                        opacity: watermarkOpacity,
                        left: `${watermarkPosition.x}%`,
                        top: `${watermarkPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageEditor;