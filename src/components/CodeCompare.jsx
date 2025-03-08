import React, { useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // Dark theme
import { FiCopy, FiTrash2 } from "react-icons/fi";
import * as Diff from "diff";

const CodeCompare = ({ language = "javascript" }) => {
  const [position, setPosition] = useState(50);
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [differences, setDifferences] = useState([]);
  const [diffType, setDiffType] = useState("words"); // "words" or "lines"
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    hljs.highlightAll(); // Apply syntax highlighting
  }, [beforeText, afterText]);

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newPos = ((e.clientX - rect.left) / rect.width) * 100;
      setPosition(Math.max(10, Math.min(90, newPos)));
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const clearText = () => {
    setBeforeText("");
    setAfterText("");
    setDifferences([]);
  };

  useEffect(() => {
    const diffResult =
      diffType === "words" ? Diff.diffWords(beforeText, afterText) : Diff.diffLines(beforeText, afterText);
    setDifferences(diffResult);
  }, [beforeText, afterText, diffType]);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-lg md:text-xl text-white font-semibold">🔍 Code Compare Tool</h2>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <select
            className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none"
            onChange={(e) => setDiffType(e.target.value)}
            value={diffType}
          >
            <option value="words">Word Level Comparison</option>
            <option value="lines">Line Level Comparison</option>
          </select>
          <button
            className="bg-red-600 px-3 py-2 text-white rounded-md flex items-center gap-2 hover:bg-red-500"
            onClick={clearText}
          >
            <FiTrash2 /> Clear All
          </button>
        </div>
      </div>

      {/* Text Areas & Draggable Divider */}
      <div ref={containerRef} className="relative flex flex-col md:flex-row w-full h-[60vh]">
        {/* Before Text Area */}
        <div className="relative overflow-hidden" style={{ width: `${position}%` }}>
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              onClick={() => copyToClipboard(beforeText)}
            >
              <FiCopy size={18} />
            </button>
          </div>
          <textarea
            className="h-full w-full bg-gray-900 text-white p-4 outline-none resize-none overflow-auto text-sm md:text-base"
            placeholder="Paste or type original text..."
            value={beforeText}
            onChange={(e) => setBeforeText(e.target.value)}
          />
        </div>

        {/* Draggable Divider */}
        <div
          className="absolute top-0 bottom-0 w-2 bg-blue-500 cursor-ew-resize hover:bg-blue-400 transition-all"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-md border border-white">
            <span className="text-white font-bold">↔</span>
          </div>
        </div>

        {/* After Text Area */}
        <div className="relative overflow-hidden flex-1">
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              onClick={() => copyToClipboard(afterText)}
            >
              <FiCopy size={18} />
            </button>
          </div>
          <textarea
            className="h-full w-full bg-gray-900 text-white p-4 outline-none resize-none overflow-auto text-sm md:text-base"
            placeholder="Paste or type modified text..."
            value={afterText}
            onChange={(e) => setAfterText(e.target.value)}
          />
        </div>
      </div>

      {/* Difference Section */}
      {beforeText && afterText && (
        <div className="mt-6 p-4 bg-gray-800 rounded-md text-white">
          <h3 className="text-lg font-semibold mb-2">🔍 Differences Found:</h3>
          <div className="overflow-auto max-h-40 p-2 bg-gray-900 rounded-md text-sm md:text-base leading-relaxed">
            {differences.map((part, index) => (
              <span
                key={index}
                className={`px-1 rounded ${
                  part.added ? "bg-green-500 text-black" : part.removed ? "bg-red-500 text-black" : "text-white"
                }`}
              >
                {part.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeCompare;
