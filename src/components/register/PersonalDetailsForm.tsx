import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRANCH_OPTIONS } from '@/types/admin';
import { toast } from 'sonner';
import { X, Plus, UserRound, Users } from 'lucide-react';
import { Event } from '@/data/events';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TeamMember } from '@/data/registrations';

export interface PersonalFormData {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
  registration_type: 'solo' | 'team';
  team_members?: TeamMember[];
}

interface PersonalDetailsFormProps {
  formData: PersonalFormData;
  event?: Event;
  onDataChange: (name: string, value: string) => void;
  onTeamMemberChange?: (index: number, field: string, value: string) => void;
  onAddTeamMember?: () => void;
  onRemoveTeamMember?: (index: number) => void;
  onNext: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  event,
  onDataChange,
  onTeamMemberChange,
  onAddTeamMember,
  onRemoveTeamMember,
  onNext
}) => {
  const isTeamEvent = event && event.team_size && event.team_size > 1;
  const allowSoloRegistration = event?.registration_type === 'solo' || event?.registration_type === 'both';
  const allowTeamRegistration = event?.registration_type === 'team' || event?.registration_type === 'both';
  const requiredTeamSize = 4; // Set to exactly 4 team members as required
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };

  const handleSelectChange = (name: string, value: string) => {
    onDataChange(name, value);
  };
  
  const handleRegistrationTypeChange = (value: string) => {
    onDataChange('registration_type', value);
  };
  
  const handleNext = () => {
    // Basic validation
    if (!formData.name || !formData.usn || !formData.phone || !formData.email || !formData.branch) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Team member validation if team registration is selected
    if (isTeamEvent && formData.registration_type === 'team' && formData.team_members) {
      // Check if we have exactly the required number of team members (4)
      if (formData.team_members.length !== requiredTeamSize) {
        toast.error(`Please add exactly ${requiredTeamSize} team members`);
        return;
      }
      
      // Check if all team member details are filled
      for (const member of formData.team_members) {
        if (!member.name || !member.usn || !member.branch) {
          toast.error('Please fill all team member details (name, USN, and branch)');
          return;
        }
      }
    }
    
    onNext();
  };

  return (
    <form className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Team Leader / Primary Participant</h3>
      
      {/* Registration Type Selection (Solo or Team) */}
      {isTeamEvent && allowSoloRegistration && allowTeamRegistration && (
        <div className="mb-6">
          <Label className="mb-2 block">Registration Type</Label>
          <RadioGroup 
            value={formData.registration_type} 
            onValueChange={handleRegistrationTypeChange}
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
      )}
      
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
      
      {/* Team Members Section - Show only if team registration is selected */}
      {isTeamEvent && 
       formData.registration_type === 'team' && 
       onTeamMemberChange && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Team Members</h3>
            <p className="text-sm text-gray-400">
              Required: {requiredTeamSize} members
            </p>
          </div>
          
          {formData.team_members && formData.team_members.map((member, index) => (
            <div key={index} className="glass p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Team Member #{index + 1}</h4>
                {formData.team_members && formData.team_members.length > requiredTeamSize && onRemoveTeamMember && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveTeamMember(index)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`member-${index}-name`}>Full Name</Label>
                  <Input 
                    id={`member-${index}-name`}
                    value={member.name}
                    onChange={(e) => onTeamMemberChange(index, 'name', e.target.value)}
                    className="bg-techfest-muted text-white border-techfest-muted"
                    placeholder="Enter name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`member-${index}-usn`}>USN</Label>
                  <Input 
                    id={`member-${index}-usn`}
                    value={member.usn}
                    onChange={(e) => onTeamMemberChange(index, 'usn', e.target.value)}
                    className="bg-techfest-muted text-white border-techfest-muted"
                    placeholder="Enter USN"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor={`member-${index}-branch`}>Branch</Label>
                  <Select 
                    value={member.branch} 
                    onValueChange={(value) => onTeamMemberChange(index, 'branch', value)}
                  >
                    <SelectTrigger className="bg-techfest-muted text-white border-techfest-muted">
                      <SelectValue placeholder="Select branch" />
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
              </div>
            </div>
          ))}
          
          {formData.team_members && formData.team_members.length < requiredTeamSize && onAddTeamMember && (
            <Button
              type="button"
              variant="outline"
              onClick={onAddTeamMember}
              className="w-full mb-4 border-dashed border-gray-600 hover:border-gray-400 hover:bg-gray-800"
            >
              <Plus size={16} className="mr-2" />
              Add Team Member ({formData.team_members.length}/{requiredTeamSize})
            </Button>
          )}
        </div>
      )}
      
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
