import React, { useState, useRef, useEffect } from "react";

export default function DraggableText({ textObj, onCommit }) {
  const [pos, setPos] = useState({ x: textObj.x, y: textObj.y });
  const isDragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  // Keep in sync if textObj position changes from outside
  useEffect(() => {
    setPos({ x: textObj.x, y: textObj.y });
  }, [textObj.x, textObj.y]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    start.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    setPos({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.target.releasePointerCapture(e.pointerId);
    onCommit({ id: textObj.id, x: pos.x, y: pos.y });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        fontSize: `${textObj.fontSize}px`,
        fontWeight: textObj.fontWeight,
        color: textObj.color,
        // Proper stroke effect
        WebkitTextStroke: `${textObj.strokeWidth}px ${textObj.stroke}`,
        cursor: "move",
        pointerEvents: "auto",
        userSelect: "none",
        whiteSpace: "pre", // preserve spacing
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {textObj.content}
    </div>
  );
}
