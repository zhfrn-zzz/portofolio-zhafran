// components/LoadingSkeleton.js
import React from 'react';

const LoadingSkeleton = ({ type }) => {
  const baseClass = "animate-pulse bg-white/5 rounded-lg";
  
  switch(type) {
    case 'card':
      return <div className={`${baseClass} h-64`} />;
    case 'tab':
      return <div className={`${baseClass} h-96`} />;
    default:
      return <div className={`${baseClass} h-20`} />;
  }
};

export default LoadingSkeleton;