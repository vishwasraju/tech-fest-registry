
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRANCH_OPTIONS } from '@/types/admin';
import { X, Plus } from 'lucide-react';
import { Event } from '@/data/events';

interface TeamMember {
  name: string;
  usn: string;
  branch?: string;
}

interface TeamMembersSectionProps {
  event: Event;
  teamMembers: TeamMember[];
  onTeamMemberChange: (index: number, field: string, value: string) => void;
  onAddTeamMember: () => void;
  onRemoveTeamMember: (index: number) => void;
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  event,
  teamMembers,
  onTeamMemberChange,
  onAddTeamMember,
  onRemoveTeamMember
}) => {
  // If team_size is 0 or 1, consider it as individual event (no team members)
  if (event.team_size <= 1) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Team Members</h3>
        <p className="text-sm text-gray-400">
          Required: {event.team_size - 1} members
        </p>
      </div>
      
      {teamMembers.map((member, index) => (
        <div key={index} className="glass p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Team Member #{index + 1}</h4>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveTeamMember(index)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
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
                value={member.branch || ''} 
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
                  <SelectItem value="DIPLOMA" className="hover:bg-gray-800">DIPLOMA</SelectItem>
                  <SelectItem value="POLYTECHNIC" className="hover:bg-gray-800">POLYTECHNIC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
      
      {teamMembers.length < (event.team_size - 1) && (
        <Button
          type="button"
          variant="outline"
          onClick={onAddTeamMember}
          className="w-full mb-4 border-dashed border-gray-600 hover:border-gray-400 hover:bg-gray-800"
        >
          <Plus size={16} className="mr-2" />
          Add Team Member ({teamMembers.length}/{event.team_size - 1})
        </Button>
      )}
    </div>
  );
};

export default TeamMembersSection;
