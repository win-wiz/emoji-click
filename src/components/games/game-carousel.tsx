'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GameCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [
    '/path/to/image1.jpg',
    '/path/to/image2.jpg',
    '/path/to/image3.jpg',
  ]; // 示例图片路径

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="flex items-center">
      <button onClick={handlePrev} className="bg-none border-none cursor-pointer">
        <ChevronLeft className="w-6 h-6" />
      </button>
      {/* 切换元素 */}
      <div className="flex overflow-hidden w-full justify-center">
        {items.map((item, index) => (
          <div
            key={index}
            className={`transition-transform duration-300 w-[100px] h-[300px] text-center border-2 border-gray-300 bg-gray-200 flex items-center justify-center ${
              index === currentIndex ? 'scale-120' : 'scale-80'
            }`}
          >
            {`Item ${index + 1}`}
          </div>
        ))}
      </div>
      <button onClick={handleNext} className="bg-none border-none cursor-pointer">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}