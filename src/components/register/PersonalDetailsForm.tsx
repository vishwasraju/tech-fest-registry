
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Event } from '@/data/events';
import { TeamMember } from '@/data/registrations';
import RegistrationTypeSelector from './RegistrationTypeSelector';
import ParticipantDetailsInputs from './ParticipantDetailsInputs';
import TeamMembersSection from './TeamMembersSection';

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
        <RegistrationTypeSelector
          value={formData.registration_type}
          onChange={handleRegistrationTypeChange}
          requiredTeamSize={requiredTeamSize}
        />
      )}
      
      {/* Primary Participant Information */}
      <ParticipantDetailsInputs
        name={formData.name}
        usn={formData.usn}
        branch={formData.branch}
        phone={formData.phone}
        email={formData.email}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
      />
      
      {/* Team Members Section - Show only if team registration is selected */}
      {isTeamEvent && 
       formData.registration_type === 'team' && 
       onTeamMemberChange && 
       formData.team_members && (
         <TeamMembersSection
           teamMembers={formData.team_members}
           requiredTeamSize={requiredTeamSize}
           onTeamMemberChange={onTeamMemberChange}
           onAddTeamMember={onAddTeamMember}
           onRemoveTeamMember={onRemoveTeamMember}
         />
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
