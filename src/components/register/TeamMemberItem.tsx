
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRANCH_OPTIONS } from '@/types/admin';
import { X } from 'lucide-react';
import { TeamMember } from '@/data/registrations';

interface TeamMemberItemProps {
  member: TeamMember;
  index: number;
  canRemove: boolean;
  onMemberChange: (index: number, field: string, value: string) => void;
  onRemoveMember?: (index: number) => void;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({
  member,
  index,
  canRemove,
  onMemberChange,
  onRemoveMember
}) => {
  return (
    <div className="glass p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Team Member #{index + 1}</h4>
        {canRemove && onRemoveMember && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemoveMember(index)}
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
            onChange={(e) => onMemberChange(index, 'name', e.target.value)}
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
            onChange={(e) => onMemberChange(index, 'usn', e.target.value)}
            className="bg-techfest-muted text-white border-techfest-muted"
            placeholder="Enter USN"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor={`member-${index}-branch`}>Branch</Label>
          <Select 
            value={member.branch} 
            onValueChange={(value) => onMemberChange(index, 'branch', value)}
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
  );
};

export default TeamMemberItem;
