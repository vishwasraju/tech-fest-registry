
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TeamMember } from '@/data/registrations';
import TeamMemberItem from './TeamMemberItem';

interface TeamMembersSectionProps {
  teamMembers: TeamMember[];
  requiredTeamSize: number;
  onTeamMemberChange: (index: number, field: string, value: string) => void;
  onAddTeamMember?: () => void;
  onRemoveTeamMember?: (index: number) => void;
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  teamMembers,
  requiredTeamSize,
  onTeamMemberChange,
  onAddTeamMember,
  onRemoveTeamMember
}) => {
  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Team Members</h3>
        <p className="text-sm text-gray-400">
          Required: {requiredTeamSize} members
        </p>
      </div>
      
      {teamMembers.map((member, index) => (
        <TeamMemberItem
          key={index}
          member={member}
          index={index}
          canRemove={teamMembers.length > requiredTeamSize}
          onMemberChange={onTeamMemberChange}
          onRemoveMember={onRemoveTeamMember}
        />
      ))}
      
      {teamMembers.length < requiredTeamSize && onAddTeamMember && (
        <Button
          type="button"
          variant="outline"
          onClick={onAddTeamMember}
          className="w-full mb-4 border-dashed border-gray-600 hover:border-gray-400 hover:bg-gray-800"
        >
          <Plus size={16} className="mr-2" />
          Add Team Member ({teamMembers.length}/{requiredTeamSize})
        </Button>
      )}
    </div>
  );
};

export default TeamMembersSection;
