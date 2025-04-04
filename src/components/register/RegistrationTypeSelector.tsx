
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRound, Users } from 'lucide-react';

interface RegistrationTypeSelectorProps {
  value: 'solo' | 'team';
  onChange: (value: string) => void;
  requiredTeamSize: number;
}

const RegistrationTypeSelector: React.FC<RegistrationTypeSelectorProps> = ({
  value,
  onChange,
  requiredTeamSize
}) => {
  return (
    <div className="mb-6">
      <Label className="mb-2 block">Registration Type</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2 glass p-3 rounded-lg flex-1">
          <RadioGroupItem value="solo" id="solo" />
          <Label htmlFor="solo" className="flex items-center cursor-pointer">
            <UserRound size={16} className="mr-2 text-techfest-neon-blue" />
            <span>Solo Registration</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 glass p-3 rounded-lg flex-1">
          <RadioGroupItem value="team" id="team" />
          <Label htmlFor="team" className="flex items-center cursor-pointer">
            <Users size={16} className="mr-2 text-techfest-neon-purple" />
            <span>Team Registration ({requiredTeamSize} members)</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RegistrationTypeSelector;
