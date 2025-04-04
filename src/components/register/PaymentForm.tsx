
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/events';
import { ArrowRight, InfoIcon } from 'lucide-react';

interface PaymentFormProps {
  event: Event;
  utr: string;
  registrationType: 'solo' | 'team';
  onDataChange: (name: string, value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const PaymentForm = ({
  event,
  utr,
  registrationType,
  onDataChange,
  onBack,
  onSubmit,
  isSubmitting
}: PaymentFormProps) => {
  const isFreeEvent = event.fees === 0;
  
  // Determine which fee to show
  const fee = registrationType === 'team' && event.team_registration_fees 
    ? event.team_registration_fees 
    : event.fees;
  
  // Determine which QR code to show
  const qrCodeUrl = registrationType === 'team' && event.team_qr_code_url 
    ? event.team_qr_code_url 
    : event.qr_code_url;
  
  // Determine which cash prize to show
  const cashPrize = registrationType === 'team'
    ? event.cash_prize
    : (event.solo_cash_prize || event.cash_prize);
    
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Payment Details</h3>
        <p className="text-gray-400 text-sm">
          {isFreeEvent 
            ? 'This is a free event. Click submit to complete your registration.' 
            : `Please pay ₹${fee} using the QR code below and enter your transaction reference (UTR) number.`
          }
        </p>
        {cashPrize > 0 && (
          <p className="text-techfest-neon-purple text-sm mt-2">
            Cash Prize: ₹{cashPrize} for {registrationType === 'team' ? 'Team Winners' : 'Solo Winners'}
          </p>
        )}
      </div>
      
      {!isFreeEvent && (
        <>
          {qrCodeUrl ? (
            <div className="flex flex-col items-center glass p-6 rounded-xl mb-6">
              <img 
                src={qrCodeUrl} 
                alt="Payment QR Code" 
                className="max-w-[250px] w-full mb-4" 
              />
              <div className="text-center">
                <p className="font-medium text-lg">Scan to Pay ₹{fee}</p>
                <p className="text-sm text-gray-400">
                  {registrationType === 'team' ? 'Team Registration' : 'Solo Registration'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center glass p-6 rounded-xl mb-6">
              <div className="bg-gray-800 p-8 rounded-lg mb-4">
                <InfoIcon className="mx-auto w-12 h-12 text-gray-400" />
              </div>
              <p className="text-center text-gray-400">
                QR code not available. Please contact the organizers for payment details.
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="utr">UTR / Transaction Reference</Label>
            <Input 
              id="utr"
              value={utr}
              onChange={(e) => onDataChange('utr', e.target.value)}
              className="bg-techfest-muted text-white border-techfest-muted"
              placeholder="Enter UTR number from payment"
              required={!isFreeEvent}
            />
            <p className="text-xs text-gray-400 mt-1">
              The UTR number is a unique transaction reference provided after completing the payment.
            </p>
          </div>
        </>
      )}
      
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        
        <Button 
          type="submit" 
          className="flex-1 bg-techfest-accent hover:bg-techfest-accent/80"
          disabled={isSubmitting || (!isFreeEvent && !utr)}
        >
          {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
