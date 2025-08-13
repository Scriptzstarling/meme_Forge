import React from "react";

const TextControls = ({ text, onChange, placeholder = "" }) => {
  const update = (patch) => onChange({ ...text, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col">
        <label className="text-[10px] font-medium text-gray-600">Text</label>
        <input
          type="text"
          value={text.content}
          onChange={(e) => update({ content: e.target.value })}
          placeholder={placeholder}
          className="w-40 px-2 py-1 text-sm border border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Size</label>
        <input
          type="range"
          min="12"
          max="120"
          value={text.fontSize}
          onChange={(e) => update({ fontSize: parseInt(e.target.value, 10) })}
          className="w-28"
        />
        <span className="text-[10px]">{text.fontSize}px</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Weight</label>
        <input
          type="range"
          min="100"
          max="900"
          step="100"
          value={text.fontWeight}
          onChange={(e) => update({ fontWeight: parseInt(e.target.value, 10) })}
          className="w-28"
        />
        <span className="text-[10px]">{text.fontWeight}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Color</label>
        <input
          type="color"
          value={text.color}
          onChange={(e) => update({ color: e.target.value })}
          className="w-7 h-7 border rounded"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[10px] font-medium text-gray-600">Outline</label>
        <input
          type="color"
          value={text.stroke}
          onChange={(e) => update({ stroke: e.target.value })}
          className="w-7 h-7 border rounded"
        />
        <input
          type="range"
          min="0"
          max="10"
          value={text.strokeWidth}
          onChange={(e) => update({ strokeWidth: parseInt(e.target.value, 10) })}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default TextControls;
