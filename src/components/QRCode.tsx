
import React, { useState } from 'react';
import QRCodeLib from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  imageUrl?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150, imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  
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
