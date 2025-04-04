
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRANCH_OPTIONS } from '@/types/admin';

interface ParticipantDetailsInputsProps {
  name: string;
  usn: string;
  branch: string;
  phone: string;
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const ParticipantDetailsInputs: React.FC<ParticipantDetailsInputsProps> = ({
  name,
  usn,
  branch,
  phone,
  email,
  onChange,
  onSelectChange
}) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          name="name"
          value={name}
          onChange={onChange}
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
          value={usn}
          onChange={onChange}
          className="bg-techfest-muted text-white border-techfest-muted"
          placeholder="Enter your USN"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="branch">Branch</Label>
        <Select 
          value={branch} 
          onValueChange={(value) => onSelectChange('branch', value)}
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
          value={phone}
          onChange={onChange}
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
          value={email}
          onChange={onChange}
          className="bg-techfest-muted text-white border-techfest-muted"
          placeholder="Enter your email"
          required
        />
      </div>
    </>
  );
};

export default ParticipantDetailsInputs;
