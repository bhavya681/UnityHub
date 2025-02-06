import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType,
  getRectOfNodes,
  getTransformForBounds,
} from 'react-flow-renderer';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { toPng } from 'html-to-image';

const CustomNode = ({ data, selected }) => {
    const getShapeStyle = () => {
      switch (data.shape) {
        case 'circle':
          return { borderRadius: '50%' };
        case 'triangle':
          return { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
        case 'diamond':
          return { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
        case 'line':
          return { 
            width: '160px',
            height: '4px',
            backgroundColor: data.color,
            border: 'none',
            borderRadius: 0,
          };
        default:
          return { borderRadius: '6px' };
      }
    };
  
    return (
      <div
        className={`flex items-center justify-center transition-all ${
          data.shape === 'line' ? 'p-0' : 'p-4 w-32 h-20'
        }`}
        style={{
          ...getShapeStyle(),
          border: data.shape !== 'line' ? `2px solid ${selected ? data.color : '#cbd5e1'}` : 'none',
          backgroundColor: data.shape !== 'line' ? `${data.color}20` : data.color,
          color: data.color,
        }}
      >
        {data.shape !== 'line' && (
          <span className="text-center text-sm font-medium break-words">
            {data.label}
          </span>
        )}
      </div>
    );
  };
  
  const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data, selected }) => {
    const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  
    return (
      <>
        <path
          id={id}
          className="react-flow__edge-path"
          d={edgePath}
          style={{ 
            strokeWidth: 2,
            stroke: selected ? '#3B82F6' : (data?.color || '#64748b'),
            fill: 'none',
          }}
          markerEnd="url(#arrow)"
        />
        <foreignObject
          width="100"
          height="40"
          x={(sourceX + targetX) / 2 - 50}
          y={(sourceY + targetY) / 2 - 20}
        >
          <div className="text-center bg-white px-2 py-1 text-xs rounded border shadow-sm">
            {data?.label}
          </div>
        </foreignObject>
      </>
    );
  };
const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const shapeOptions = [
  { type: 'rectangle', label: 'Rectangle', symbol: '▭' },
  { type: 'circle', label: 'Circle', symbol: '●' },
  { type: 'triangle', label: 'Triangle', symbol: '▲' },
  { type: 'diamond', label: 'Diamond', symbol: '◆' },
  { type: 'line', label: 'Line', symbol: '─' },
];

const SystemDesign = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementProperties, setElementProperties] = useState({ 
    label: '', 
    color: '#3B82F6',
    lineColor: '#64748b'
  });
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: uuidv4(),
        type: 'custom',
        markerEnd: { type: MarkerType.ArrowClosed, color: elementProperties.lineColor },
        style: { strokeWidth: 2, stroke: elementProperties.lineColor },
        data: { label: '', color: elementProperties.lineColor }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, elementProperties.lineColor]
  );

  const addNode = (shapeType) => {
    const position = reactFlowInstance?.project({ x: 200, y: 200 }) || { x: 200, y: 200 };
    const newNode = {
      id: uuidv4(),
      type: 'custom',
      position,
      data: {
        label: 'New Node',
        shape: shapeType,
        color: elementProperties.color,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDelete = useCallback(() => {
    if (!selectedElement) return;

    setNodes(nodes => nodes.filter(n => n.id !== selectedElement.id));
    setEdges(edges => edges.filter(e => 
      e.id !== selectedElement.id && 
      e.source !== selectedElement.id && 
      e.target !== selectedElement.id
    ));
    setSelectedElement(null);
  }, [selectedElement, setNodes, setEdges]);

  const updateElementProperty = (property, value) => {
    if (selectedElement?.type === 'edge') {
      setEdges(eds => eds.map(edge => {
        if (edge.id === selectedElement.id) {
          return {
            ...edge,
            data: { ...edge.data, [property]: value },
            style: { ...edge.style, stroke: property === 'color' ? value : edge.style.stroke },
            markerEnd: { ...edge.markerEnd, color: property === 'color' ? value : edge.markerEnd.color }
          };
        }
        return edge;
      }));
    } else {
      setNodes(nds => nds.map(node => {
        if (node.id === selectedElement?.id) {
          return { ...node, data: { ...node.data, [property]: value } };
        }
        return node;
      }));
    }
  };

  const handleDownload = async () => {
    const flowElement = document.querySelector('.react-flow');
    if (!flowElement) return;

    const nodesBounds = getRectOfNodes(nodes);
    const transform = getTransformForBounds(
      nodesBounds,
      flowElement.clientWidth,
      flowElement.clientHeight,
      0.5,
      2
    );

    const dataUrl = await toPng(flowElement, {
      backgroundColor: '#ffffff',
      width: flowElement.clientWidth,
      height: flowElement.clientHeight,
      style: {
        width: flowElement.clientWidth,
        height: flowElement.clientHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    });

    const link = document.createElement('a');
    link.download = 'system-design.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row h-screen bg-gray-50"
    >
      {/* Controls Sidebar */}
      <div className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">System Designer</h2>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mb-4">
          {shapeOptions.map((shape) => (
            <button
              key={shape.type}
              onClick={() => addNode(shape.type)}
              className="p-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <span className="text-gray-600">{shape.symbol}</span>
              {shape.label}
            </button>
          ))}
        </div>

        {selectedElement && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-3 text-gray-700">
              {selectedElement.type === 'edge' ? 'Connection' : 'Node'} Properties
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Label</label>
                <input
                  type="text"
                  value={elementProperties.label}
                  onChange={(e) => {
                    setElementProperties({ ...elementProperties, label: e.target.value });
                    updateElementProperty('label', e.target.value);
                  }}
                  className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {selectedElement.type === 'edge' ? 'Line' : 'Node'} Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#64748b'].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const property = selectedElement.type === 'edge' ? 'lineColor' : 'color';
                        setElementProperties({ ...elementProperties, [property]: color });
                        updateElementProperty('color', color);
                      }}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        (selectedElement.type === 'edge' 
                          ? elementProperties.lineColor 
                          : elementProperties.color) === color 
                          ? 'border-gray-900' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Design Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(e, node) => {
              setSelectedElement(node);
              setElementProperties({
                label: node.data.label,
                color: node.data.color || '#3B82F6',
                lineColor: elementProperties.lineColor
              });
            }}
            onEdgeClick={(e, edge) => {
              setSelectedElement(edge);
              setElementProperties({
                label: edge.data?.label || '',
                lineColor: edge.style?.stroke || '#64748b',
                color: elementProperties.color
              });
            }}
            onPaneClick={() => setSelectedElement(null)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            onInit={setReactFlowInstance}
            deleteKeyCode={null}
          >
            <Controls 
              className="bg-white shadow-lg rounded-md border p-1"
              style={{ right: 10, bottom: 10 }}
            />
            <MiniMap
              style={{ backgroundColor: 'rgba(255,255,255,0.8)', right: 10, top: 10 }}
              nodeColor={(n) => n.data.color}
              nodeStrokeWidth={2}
            />
            <Background color="#cbd5e1" gap={25} />
          </ReactFlow>
        </ReactFlowProvider>

        {selectedElement && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-lg border flex gap-2">
            <button
              className="px-3 py-1 text-sm hover:bg-red-50 text-red-600 rounded-md transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};


export default SystemDesign;