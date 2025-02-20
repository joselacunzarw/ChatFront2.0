import React, { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface DraggablePanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function DraggablePanel({ title, onClose, children }: DraggablePanelProps) {
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={panelRef}
      className={`fixed bg-white rounded-lg shadow-lg border border-gray-200 w-96 ${
        isDragging ? 'cursor-grabbing select-none' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div 
        className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-primary to-primary-dark rounded-t-lg cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-white">
          <GripHorizontal size={16} />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-4 max-h-[calc(100vh-200px)] overflow-auto">
        {children}
      </div>
    </div>
  );
}