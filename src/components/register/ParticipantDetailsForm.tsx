
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRANCH_OPTIONS } from '@/types/admin';

interface ParticipantDetailsFormProps {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
  onDataChange: (name: string, value: string) => void;
}

const ParticipantDetailsForm: React.FC<ParticipantDetailsFormProps> = ({
  name,
  usn,
  phone,
  email,
  branch,
  onDataChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };

  const handleSelectChange = (name: string, value: string) => {
    onDataChange(name, value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Team Leader / Primary Participant</h3>
      
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          name="name"
          value={name}
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
          value={usn}
          onChange={handleChange}
          className="bg-techfest-muted text-white border-techfest-muted"
          placeholder="Enter your USN"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="branch">Branch</Label>
        <Select 
          value={branch} 
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
            <SelectItem value="DIPLOMA" className="hover:bg-gray-800">DIPLOMA</SelectItem>
            <SelectItem value="POLYTECHNIC" className="hover:bg-gray-800">POLYTECHNIC</SelectItem>
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
          value={email}
          onChange={handleChange}
          className="bg-techfest-muted text-white border-techfest-muted"
          placeholder="Enter your email"
          required
        />
      </div>
    </div>
  );
};

export default ParticipantDetailsForm;
