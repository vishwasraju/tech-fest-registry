
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EVENTS_DATA } from '@/data/events';
import QRCode from '@/components/QRCode';
import { toast } from 'sonner';
import { BRANCH_OPTIONS } from '@/types/admin';

const RegisterForm = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = EVENTS_DATA.find(e => e.id === eventId);
  
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    phone: '',
    email: '',
    branch: '',
    utr: ''
  });
  
  const [step, setStep] = useState(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would normally be a backend API call
    console.log('Registration data:', { ...formData, eventId });
    
    toast.success('Registration successful!', {
      description: 'Thank you for registering for this event!',
    });
    
    setTimeout(() => {
      navigate('/registration-success');
    }, 1500);
  };
  
  const nextStep = () => {
    if (formData.name && formData.usn && formData.phone && formData.email && formData.branch) {
      setStep(2);
    } else {
      toast.error('Please fill all required fields');
    }
  };
  
  if (!event) {
    return <div className="text-center py-10">Event not found</div>;
  }
  
  return (
    <div className="max-w-md mx-auto glass px-6 py-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register for <span className="text-techfest-neon-blue">{event.name}</span>
      </h2>
      
      {step === 1 ? (
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="usn">USN</Label>
            <Input 
              id="usn"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              placeholder="Enter your USN"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Select 
              value={formData.branch} 
              onValueChange={(value) => handleSelectChange('branch', value)}
            >
              <SelectTrigger className="bg-techfest-muted text-white border-techfest-muted">
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                {BRANCH_OPTIONS.filter(branch => branch !== 'ALL').map((branch) => (
                  <SelectItem key={branch} value={branch} className="hover:bg-gray-800">
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <Button 
            type="button" 
            onClick={nextStep} 
            className="w-full bg-techfest-accent hover:bg-techfest-accent/80"
          >
            Next Step
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {event.fees > 0 ? (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400 mb-4">
                  Please pay ₹{event.fees} to complete your registration. Scan the QR code below:
                </p>
                
                <div className="bg-white p-3 rounded-lg mx-auto w-48 h-48 mb-4">
                  <QRCode 
                    value={`upi://pay?pa=example@upi&pn=TechFest&am=${event.fees}`} 
                    imageUrl={event.qr_code_url}
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
                    value={formData.utr}
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
              onClick={() => setStep(1)}
              className="w-1/2 border-gray-500 text-gray-400 hover:bg-gray-800"
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              className="w-1/2 bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90"
              disabled={event.fees > 0 && !formData.utr}
            >
              Complete Registration
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
