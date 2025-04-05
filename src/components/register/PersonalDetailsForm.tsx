
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Event } from '@/data/events';
import ParticipantDetailsForm from './ParticipantDetailsForm';
import GameSelectionSection from './GameSelectionSection';
import TeamMembersSection from './TeamMembersSection';

export interface PersonalFormData {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
  team_members?: Array<{
    name: string;
    usn: string;
    branch?: string;
  }>;
  game_selection?: string;
}

interface PersonalDetailsFormProps {
  formData: PersonalFormData;
  event?: Event;
  onDataChange: (name: string, value: string) => void;
  onTeamMemberChange?: (index: number, field: string, value: string) => void;
  onAddTeamMember?: () => void;
  onRemoveTeamMember?: (index: number) => void;
  onGameSelection?: (game: string) => void;
  isGamingEvent?: boolean;
  onNext: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  event,
  onDataChange,
  onTeamMemberChange,
  onAddTeamMember,
  onRemoveTeamMember,
  onGameSelection,
  isGamingEvent,
  onNext
}) => {
  // Only show team members section if team_size is greater than 1
  const isTeamEvent = event && event.team_size > 1;
  
  const handleNext = () => {
    // Basic validation
    if (!formData.name || !formData.usn || !formData.phone || !formData.email || !formData.branch) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Team member validation
    if (isTeamEvent && formData.team_members) {
      if (formData.team_members.length < (event!.team_size - 1)) {
        toast.error(`Please add ${event!.team_size - 1} team members`);
        return;
      }
      
      for (const member of formData.team_members) {
        if (!member.name || !member.usn) {
          toast.error('Please fill all team member details');
          return;
        }
      }
    }
    
    // Gaming event validation
    if (isGamingEvent && !formData.game_selection) {
      toast.error('Please select a game');
      return;
    }
    
    onNext();
  };

  return (
    <form className="space-y-4">
      {/* Participant Details Component */}
      <ParticipantDetailsForm
        name={formData.name}
        usn={formData.usn}
        phone={formData.phone}
        email={formData.email}
        branch={formData.branch}
        onDataChange={onDataChange}
      />
      
      {/* Game Selection Component - Only show for gaming events */}
      {isGamingEvent && onGameSelection && (
        <GameSelectionSection
          selectedGame={formData.game_selection}
          onGameSelection={onGameSelection}
        />
      )}
      
      {/* Team Members Component - Only show if team_size > 1 */}
      {isTeamEvent && event && formData.team_members && onTeamMemberChange && onAddTeamMember && onRemoveTeamMember && (
        <TeamMembersSection
          event={event}
          teamMembers={formData.team_members}
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
