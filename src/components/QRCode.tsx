
import React, { useState } from 'react';
import QRCodeLib from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  imageUrl?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150, imageUrl }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading QR image:", e);
    setImageError(true);
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-white p-2 rounded-lg">
      {imageUrl && !imageError ? (
        <div className="flex flex-col items-center">
          <img 
            src={imageUrl} 
            alt="Payment QR Code" 
            className="max-w-full max-h-full object-contain"
            style={{ maxWidth: size, maxHeight: size }}
            onError={handleImageError}
          />
          {/* Invisible preload of the QR code as fallback */}
          <QRCodeLib 
            value={value}
            size={size}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default QRCode;
