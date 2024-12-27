// components/ImageWithFallback.js
import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  
  return (
    <img
      src={error ? '/placeholder.png' : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;