
import React, { useState, useEffect } from 'react';
import QRCodeLib from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  imageUrl?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150, imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Reset error state when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setImageError(false);
      setIsImageLoading(true);
    }
  }, [imageUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading QR image:", e);
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-white p-2 rounded-lg">
      {imageUrl && !imageError ? (
        <div className="flex flex-col items-center relative">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800"></div>
            </div>
          )}
          <img 
            src={imageUrl} 
            alt="Payment QR Code" 
            className="max-w-full max-h-full object-contain"
            style={{ maxWidth: size, maxHeight: size }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {/* Invisible preload of the QR code as fallback */}
          <QRCodeLib 
            value={value}
            size={size}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center relative">
          <QRCodeLib 
            value={value}
            size={size}
            style={{ maxWidth: "100%", height: "auto" }}
          />
          {imageError && (
            <div className="absolute bottom-1 text-red-500 text-sm bg-white px-2 py-1 rounded">
              QR image failed to load
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCode;
