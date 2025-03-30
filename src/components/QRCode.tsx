
import React from 'react';
import QRCodeLib from 'react-qr-code';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150 }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-white p-2 rounded-lg">
      <QRCodeLib 
        value={value}
        size={size}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default QRCode;
