
import React, { useState, useEffect } from 'react';
import QRCodeLib from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  imageUrl?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150, imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!imageUrl);
  
  useEffect(() => {
    if (imageUrl) {
      // Preload image to check if it loads correctly
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        setIsLoading(false);
        setImageError(true);
        console.error('Failed to load QR code image:', imageUrl);
      };
      img.src = imageUrl;
    } else {
      setIsLoading(false);
    }
  }, [imageUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white p-2 rounded-lg">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center w-full h-full bg-white p-2 rounded-lg">
      {imageUrl && !imageError ? (
        <img 
          src={imageUrl} 
          alt="Payment QR Code" 
          className="max-w-full max-h-full object-contain"
          style={{ maxWidth: size, maxHeight: size }}
          onError={() => setImageError(true)}
        />
      ) : (
        <QRCodeLib 
          value={value}
          size={size}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
    </div>
  );
};

export default QRCode;
