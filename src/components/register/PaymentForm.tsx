
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import QRCode from '@/components/QRCode';
import { Event } from '@/data/events';

interface PaymentFormProps {
  event: Event;
  utr: string;
  registrationType: 'solo' | 'team';
  onDataChange: (name: string, value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  event,
  utr,
  registrationType,
  onDataChange,
  onBack,
  onSubmit,
  isSubmitting
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };

  const isTeamEvent = event.team_size && event.team_size > 1;
  const isTeamRegistration = isTeamEvent && registrationType === 'team';
  const eventFees = event.fees || 0;
  
  // If it's a team registration and has team_registration_fees set, use that instead
  const feesToPay = isTeamRegistration && event.team_registration_fees !== undefined 
    ? event.team_registration_fees 
    : eventFees;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {feesToPay > 0 ? (
        <>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-400 mb-4">
              Please pay ₹{feesToPay} to complete your registration. 
              {isTeamRegistration && 
                " This is a team registration fee (one payment covers the entire team)."}
              <br />Scan the QR code below:
            </p>
            
            <div className="bg-white p-3 rounded-lg mx-auto w-48 h-48 mb-4">
              <QRCode 
                value={`upi://pay?pa=example@upi&pn=TechFest&am=${feesToPay}`} 
                imageUrl={
                  // Use a team-specific QR code if available for team registration
                  isTeamRegistration && event.team_qr_code_url 
                    ? event.team_qr_code_url 
                    : event.qr_code_url
                }
              />
            </div>
            
            <div className="text-center text-xs text-gray-500 mb-6">
              <p>UPI ID: example@upi</p>
              <p>Account Name: Tech Fest 2K25</p>
            </div>
            
            <div>
              <Label htmlFor="utr">UTR Number / Transaction ID</Label>
              <Input 
                id="utr"
                name="utr"
                value={utr}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                placeholder="Enter UTR number after payment"
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mb-4">
          <p className="text-techfest-neon-blue font-medium">This is a free event. No payment required.</p>
        </div>
      )}
      
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="w-1/2 border-gray-500 text-gray-400 hover:bg-gray-800"
        >
          Back
        </Button>
        
        <Button 
          type="submit" 
          className="w-1/2 bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90"
          disabled={isSubmitting || (feesToPay > 0 && !utr)}
        >
          {isSubmitting ? 'Submitting...' : 'Complete Registration'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
