'use client';
import { useState, useEffect } from 'react';

const LoadingTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        <span>Loading: {elapsedTime.toFixed(1)}s</span>
      </div>
      {elapsedTime > 5 && (
        <div className="text-xs text-gray-400 mt-1">
          This is taking longer than usual...
        </div>
      )}
    </div>
  );
};

export default LoadingTimer;
