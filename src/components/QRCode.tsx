
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
          className="max-w-full max-h-full object-contain"
          style={{ maxWidth: size, maxHeight: size }}
          onError={(e) => {
            console.error("Error loading QR image:", e);
            // Fallback to text-based QR
            (e.target as HTMLImageElement).style.display = 'none';
            // Show error message or fallback
            const parent = (e.target as HTMLElement).parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.textContent = "QR image failed to load";
              fallback.className = "text-red-500 text-sm";
              parent.appendChild(fallback);
            }
          }}
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
