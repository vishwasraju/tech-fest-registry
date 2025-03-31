
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRANCH_OPTIONS } from '@/types/admin';
import { toast } from 'sonner';

export interface PersonalFormData {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
}

interface PersonalDetailsFormProps {
  formData: PersonalFormData;
  onDataChange: (name: string, value: string) => void;
  onNext: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  onDataChange,
  onNext
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };

  const handleSelectChange = (name: string, value: string) => {
    onDataChange(name, value);
  };
  
  const handleNext = () => {
    if (formData.name && formData.usn && formData.phone && formData.email && formData.branch) {
      onNext();
    } else {
      toast.error('Please fill all required fields');
    }
  };

  return (
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
        onClick={handleNext} 
        className="w-full bg-techfest-accent hover:bg-techfest-accent/80"
      >
        Next Step
      </Button>
    </form>
  );
};

export default PersonalDetailsForm;
