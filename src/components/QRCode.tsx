
import React from 'react';
import { QrCode } from 'lucide-react';

interface QRCodeProps {
  value: string;
  size?: number;
}

// This is a simplified QR Code component
// In a real app you would use a library like qrcode.react
const QRCode: React.FC<QRCodeProps> = ({ value, size = 150 }) => {
  // For demo purposes, we're just showing a placeholder QR image
  return (
    <div className="flex items-center justify-center w-full h-full bg-white">
      <QrCode size={size * 0.7} className="text-black" />
    </div>
  );
};

export default QRCode;
