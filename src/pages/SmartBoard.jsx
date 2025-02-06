// import { useState, useRef, useEffect } from "react";
// import { ReactSketchCanvas } from "react-sketch-canvas";
// import html2canvas from "html2canvas";
// import { saveAs } from "file-saver";
// import { motion } from "framer-motion";

// const SmartBoard = () => {
//   const [background, setBackground] = useState("white");
//   const [lineColor, setLineColor] = useState("#000000");
//   const [lineWidth, setLineWidth] = useState(3);
//   const [tool, setTool] = useState("pencil");
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (canvasRef.current) {
//       console.log("Canvas ref initialized.");
//     }
//   }, []);

//   const toggleBackground = () => {
//     const newBackground = background === "white" ? "black" : "white";
//     const newLineColor = background === "white" ? "#FFFFFF" : "#000000";
//     setBackground(newBackground);
//     setLineColor(newLineColor);
//   };

//   const downloadNotes = async () => {
//     if (canvasRef.current) {
//       try {
//         const canvasData = await canvasRef.current.exportImage("png");
//         const response = await fetch(canvasData);
//         const blob = await response.blob();
//         saveAs(blob, "smartboard_notes.png");
//       } catch (error) {
//         console.error("Error capturing canvas for download:", error);
//       }
//     }
//   };

//   const clearCanvas = () => {
//     if (canvasRef.current) {
//       canvasRef.current.clearCanvas();
//     }
//   };

//   const undo = () => {
//     if (canvasRef.current) {
//       canvasRef.current.undo();
//     }
//   };

//   const selectTool = (selectedTool) => {
//     setTool(selectedTool);
//     if (canvasRef.current) {
//       if (selectedTool === "pencil") {
//         setLineColor("#000000");
//       } else if (selectedTool === "eraser") {
//         setLineColor(background);
//       }
//     }
//   };

//   const handleMouseDown = () => {
//     if (tool === "eraser" && canvasRef.current) {
//       canvasRef.current.eraseMode(true);
//     }
//   };

//   const handleMouseUp = () => {
//     if (tool === "eraser" && canvasRef.current) {
//       canvasRef.current.eraseMode(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
//     >
//       <motion.div 
//         initial={{ y: -20 }}
//         animate={{ y: 0 }}
//         className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-8 space-y-6"
//       >
//         <div className="flex flex-wrap justify-center gap-4 mb-8">
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex flex-wrap items-center justify-center gap-4"
//           >
//             <button
//               onClick={toggleBackground}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               Switch Theme
//             </button>
//             <button
//               onClick={() => selectTool("pencil")}
//               className={`px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
//                 tool === "pencil"
//                   ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
//                   : "bg-white text-green-700 border-2 border-green-500"
//               }`}
//             >
//               ✏️ Draw
//             </button>
//             <button
//               onClick={() => selectTool("eraser")}
//               className={`px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
//                 tool === "eraser"
//                   ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
//                   : "bg-white text-red-700 border-2 border-red-500"
//               }`}
//             >
//               🧹 Erase
//             </button>
//             <button
//               onClick={undo}
//               className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               ↩️ Undo
//             </button>
//             <button
//               onClick={downloadNotes}
//               className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               💾 Save
//             </button>
//             <button
//               onClick={clearCanvas}
//               className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               🗑️ Clear
//             </button>
//           </motion.div>

//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex items-center gap-4"
//           >
//             <select
//               onChange={(e) => setLineColor(e.target.value)}
//               value={lineColor}
//               className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//             >
//               <option value="#000000">⚫ Black</option>
//               <option value="#FFFFFF">⚪ White</option>
//               <option value="#FF0000">🔴 Red</option>
//               <option value="#00FF00">🟢 Green</option>
//               <option value="#0000FF">🔵 Blue</option>
//             </select>
//             <input
//               type="range"
//               min="1"
//               max="20"
//               onChange={(e) => setLineWidth(parseInt(e.target.value))}
//               value={lineWidth}
//               className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//             />
//           </motion.div>
//         </div>

//         <motion.div 
//           initial={{ scale: 0.95 }}
//           animate={{ scale: 1 }}
//           className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200"
//           onMouseDown={handleMouseDown}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//         >
//           <ReactSketchCanvas
//             ref={canvasRef}
//             style={{
//               width: "100%",
//               height: "100%",
//               cursor: tool === "pencil" ? "crosshair" : "cell",
//             }}
//             strokeColor={lineColor}
//             strokeWidth={lineWidth}
//             canvasColor={background}
//             eraserWidth={lineWidth * 2}
//           />
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default SmartBoard;

import { useState, useRef, useEffect, useCallback } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";

const SmartBoard = () => {
  const [background, setBackground] = useState("#ffffff");
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState("pencil");
  const canvasRef = useRef(null);

  // Effect to log canvas reference (useful for debugging)
  useEffect(() => {
    if (canvasRef.current) {
      console.log("Canvas initialized.");
    }
  }, []);

  /** Toggle Canvas Theme */
  const toggleBackground = useCallback(() => {
    setBackground((prev) => (prev === "#ffffff" ? "#000000" : "#ffffff"));
    setLineColor((prev) => (prev === "#000000" ? "#ffffff" : "#000000"));
  }, []);

  /** Download Board as Image */
  const downloadNotes = useCallback(async () => {
    if (canvasRef.current) {
      try {
        const canvasData = await canvasRef.current.exportImage("png");
        const response = await fetch(canvasData);
        const blob = await response.blob();
        saveAs(blob, "smartboard_notes.png");
      } catch (error) {
        console.error("Error exporting image:", error);
      }
    }
  }, []);

  /** Clear Canvas */
  const clearCanvas = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  }, []);

  /** Undo Last Stroke */
  const undo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  }, []);

  /** Select Tool */
  const selectTool = useCallback(
    (selectedTool) => {
      setTool(selectedTool);
      setLineColor(selectedTool === "eraser" ? background : "#000000");
    },
    [background]
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }} 
      className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-6 sm:p-10"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="w-full max-w-7xl bg-white rounded-3xl shadow-lg p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Drawing Board
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleBackground}
            className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-all duration-200 flex items-center gap-2"
          >
            🌓 <span className="text-gray-700">Toggle Theme</span>
          </motion.button>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4">
          {/* Tools */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectTool("pencil")}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 ${
              tool === "pencil" ? "bg-blue-100 border-2 border-blue-500 text-blue-600" : "bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700"
            }`}
          >
            ✏️ Draw
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectTool("eraser")}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 ${
              tool === "eraser" ? "bg-red-100 border-2 border-red-500 text-red-600" : "bg-white border-2 border-gray-200 hover:border-red-300 text-gray-700"
            }`}
          >
            🧹 Erase
          </motion.button>

          {/* Edit Controls */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 text-gray-700 flex items-center gap-2"
          >
            🔄 Undo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCanvas}
            className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 text-gray-700 flex items-center gap-2"
          >
      <MdDelete size={18}/> Clear
          </motion.button>

          {/* Customization */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-3 bg-gray-50 rounded-xl p-2">
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="w-8 h-8 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-sm text-gray-600 font-medium">Stroke Width</span>
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Canvas */}
        <motion.div 
          className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <ReactSketchCanvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              cursor: tool === "pencil" ? "crosshair" : "cell",
            }}
            strokeColor={lineColor}
            strokeWidth={lineWidth}
            canvasColor={background}
            eraserWidth={lineWidth * 2}
          />
        </motion.div>

        {/* Save Button */}
        <motion.div 
          className="flex justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={downloadNotes}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
          >
            💾 Export Board
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SmartBoard;
