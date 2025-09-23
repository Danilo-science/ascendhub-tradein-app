import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
  loading?: 'lazy' | 'eager';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className = '',
  onError,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  srcSet,
  loading = 'lazy'
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  // Generar srcSet automáticamente si no se proporciona
  const generateSrcSet = (baseSrc: string): string => {
    if (srcSet) return srcSet;
    
    // Si la imagen viene de Cloudinary o similar, generar diferentes tamaños
    if (baseSrc.includes('cloudinary') || baseSrc.includes('res.cloudinary')) {
      const baseUrl = baseSrc.split('/upload/')[0] + '/upload/';
      const imagePath = baseSrc.split('/upload/')[1];
      
      return [
        `${baseUrl}w_320,q_auto,f_auto/${imagePath} 320w`,
        `${baseUrl}w_640,q_auto,f_auto/${imagePath} 640w`,
        `${baseUrl}w_768,q_auto,f_auto/${imagePath} 768w`,
        `${baseUrl}w_1024,q_auto,f_auto/${imagePath} 1024w`,
        `${baseUrl}w_1280,q_auto,f_auto/${imagePath} 1280w`
      ].join(', ');
    }
    
    return '';
  };

  return (
    <img
      src={imgSrc}
      srcSet={generateSrcSet(imgSrc)}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
};