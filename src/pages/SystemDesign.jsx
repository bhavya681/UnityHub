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
  Handle,
  Position,
  getRectOfNodes,
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
        return { borderRadius: '8px' };
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center transition-all shadow-lg hover:shadow-xl ${
        data.shape === 'line' ? 'p-0' : 'p-4 w-36 h-24'
      }`}
      style={{
        ...getShapeStyle(),
        border:
          data.shape !== 'line'
            ? `2px solid ${selected ? data.color : '#e2e8f0'}`
            : 'none',
        backgroundColor:
          data.shape !== 'line' ? `${data.color}15` : data.color,
        color: data.color,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Render connection handles differently for triangle nodes */}
      {data.shape !== 'line' && (
        <>
          {data.shape === 'triangle' ? (
            <>
              <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#555', width: 10, height: 10 }}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: '#555', width: 10, height: 10 }}
              />
            </>
          ) : (
            <>
              <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555', width: 10, height: 10 }}
              />
              <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555', width: 10, height: 10 }}
              />
            </>
          )}
        </>
      )}
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
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#3B82F6' : data?.color || '#64748b',
          filter: selected ? 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.5))' : 'none',
        }}
        markerEnd="url(#arrow)"
      />
      {data?.label && (
        <foreignObject
          width="120"
          height="40"
          x={(sourceX + targetX) / 2 - 60}
          y={(sourceY + targetY) / 2 - 20}
        >
          <div className="text-center bg-white/90 backdrop-blur-sm px-3 py-1 text-xs rounded-full border shadow-sm">
            {data.label}
          </div>
        </foreignObject>
      )}
    </>
  );
};

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const shapeOptions = [
  { type: 'rectangle', label: 'Rectangle', symbol: '▭', description: 'Basic component' },
  { type: 'circle', label: 'Circle', symbol: '●', description: 'Service/Process' },
  { type: 'triangle', label: 'Triangle', symbol: '▲', description: 'Entry point/Constraint' },
  { type: 'diamond', label: 'Diamond', symbol: '◆', description: 'Decision' },
  { type: 'line', label: 'Line', symbol: '─', description: 'Separator' },
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

  // On connecting nodes, create an edge with a proper arrow marker and color
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
    setNodes((nds) => nds.filter((n) => n.id !== selectedElement.id));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          e.id !== selectedElement.id &&
          e.source !== selectedElement.id &&
          e.target !== selectedElement.id
      )
    );
    setSelectedElement(null);
  }, [selectedElement]);

  const updateElementProperty = (property, value) => {
    if (selectedElement?.type === 'edge') {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === selectedElement.id
            ? {
                ...edge,
                data: { ...edge.data, [property]: value },
                style: { ...edge.style, stroke: property === 'color' ? value : edge.style.stroke },
                markerEnd: { ...edge.markerEnd, color: property === 'color' ? value : edge.markerEnd.color }
              }
            : edge
        )
      );
    } else {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedElement?.id
            ? { ...node, data: { ...node.data, [property]: value } }
            : node
        )
      );
    }
  };

  // Export the full diagram (all nodes) by computing their bounding rectangle and adding padding.
  const handleDownload = async () => {
    const flowElement = document.querySelector('.react-flow');
    if (!flowElement) return;

    // Get the bounding box of all nodes.
    const nodesBounds = getRectOfNodes(nodes);
    const padding = 20;
    const exportWidth = nodesBounds.width + padding * 2;
    const exportHeight = nodesBounds.height + padding * 2;

    // Apply a transform to include nodes that are outside the visible viewport.
    const dataUrl = await toPng(flowElement, {
      backgroundColor: '#ffffff',
      width: exportWidth,
      height: exportHeight,
      style: {
        width: `${exportWidth}px`,
        height: `${exportHeight}px`,
        transform: `translate(-${nodesBounds.x - padding}px, -${nodesBounds.y - padding}px)`,
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
      className="flex flex-col md:flex-row h-screen bg-slate-50"
    >
      {/* Sidebar Controls */}
      <div className="w-full md:w-72 bg-white border-b md:border-r border-slate-200 p-6 flex flex-col shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">System Designer</h2>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
          >
            Export Design
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-slate-600">Components</h3>
          {shapeOptions.map((shape) => (
            <button
              key={shape.type}
              onClick={() => addNode(shape.type)}
              className="w-full p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              <span className="text-2xl text-slate-600">{shape.symbol}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-slate-700">{shape.label}</div>
                <div className="text-xs text-slate-500">{shape.description}</div>
              </div>
            </button>
          ))}
        </div>

        {selectedElement && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              {selectedElement.type === 'edge' ? 'Connection' : 'Node'} Properties
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">Label</label>
                <input
                  type="text"
                  value={elementProperties.label}
                  onChange={(e) => {
                    setElementProperties({ ...elementProperties, label: e.target.value });
                    updateElementProperty('label', e.target.value);
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter label..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  {selectedElement.type === 'edge' ? 'Line' : 'Node'} Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#64748b'].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const property = selectedElement.type === 'edge' ? 'lineColor' : 'color';
                        setElementProperties({ ...elementProperties, [property]: color });
                        updateElementProperty('color', color);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        (selectedElement.type === 'edge'
                          ? elementProperties.lineColor
                          : elementProperties.color) === color
                          ? 'border-slate-900 scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleDelete}
                className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Delete Element
              </button>
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
              className="bg-white shadow-xl rounded-xl border p-2"
              style={{ right: 16, bottom: 16 }}
            />
            <MiniMap
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                right: 16,
                top: 16,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
              nodeColor={(n) => n.data.color}
              nodeStrokeWidth={3}
            />
            <Background color="#cbd5e1" gap={25} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </motion.div>
  );
};

export default SystemDesign;
