import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PhotoLightboxProps {
  images: { url: string; title: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          <h3 className="text-lg font-medium">{currentImage.title}</h3>
          <p className="text-sm text-gray-300">{currentIndex + 1} / {images.length}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full p-2 z-10">
        <button
          onClick={handleZoomOut}
          className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-white text-sm min-w-[4rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
          disabled={zoom >= 3}
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={resetZoom}
          className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          draggable={false}
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 bg-black/50 rounded-lg p-2 max-w-xs overflow-x-auto z-10">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                resetZoom();
              }}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-white' : 'border-transparent hover:border-gray-400'
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-4 left-4 text-white text-xs bg-black/50 rounded-lg p-3 z-10">
        <div className="space-y-1">
          <div>ESC: Close</div>
          <div>← →: Navigate</div>
          <div>+ -: Zoom</div>
          <div>0: Reset zoom</div>
        </div>
      </div>
    </div>
  );
};

export default PhotoLightbox; 