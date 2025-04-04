
import React from 'react';
import QRCodeLib from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
  imageUrl?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150, imageUrl }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-white p-2 rounded-lg">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Payment QR Code" 
          className="max-w-full max-h-full"
          style={{ maxWidth: size, maxHeight: size }}
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
