
const CustomNode = ({ data, selected }) => {
    const getShapeStyle = () => {
      switch (data.shape) {
        case 'circle':
          return { borderRadius: '50%' };
        case 'triangle':
          return { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
        case 'diamond':
          return { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
        default:
          return { borderRadius: '6px' };
      }
    };
  
    return (
      <div
        className="w-32 h-20 flex items-center justify-center p-4 transition-all"
        style={{
          ...getShapeStyle(),
          backgroundColor: `${data.color}20`,
          border: `2px solid ${selected ? data.color : '#cbd5e1'}`,
          color: data.color,
        }}
      >
        <span className="text-center text-sm font-medium break-words">
          {data.label}
        </span>
      </div>
    );
  };
export default CustomNode;