
import { useState } from 'react';
import { Event } from '@/data/events';
import { TeamMember } from '@/data/registrations';

export function useTeamMembers(event: Event | undefined) {
  // Initialize based on event configuration
  const getInitialTeamMembers = () => {
    if (!event) return [];
    
    // For team-only events, pre-populate 4 empty team members
    if (event.registration_type === 'team') {
      return Array(4).fill(0).map(() => ({ name: '', usn: '', branch: '' }));
    }
    
    // For both types, return empty array and let user choose
    return [];
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getInitialTeamMembers());
  
  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setTeamMembers(prev => {
      const updatedTeamMembers = [...prev];
      updatedTeamMembers[index] = {
        ...updatedTeamMembers[index],
        [field]: value
      };
      return updatedTeamMembers;
    });
  };
  
  const addTeamMember = () => {
    // Only add if we haven't reached 4 members yet
    setTeamMembers(prev => {
      const currentCount = prev.length || 0;
      if (currentCount >= 4) {
        return prev; // Don't add more than 4 members
      }
      
      return [...prev, { name: '', usn: '', branch: '' }];
    });
  };
  
  const removeTeamMember = (index: number) => {
    // Only allow removal if we have more than required team members
    setTeamMembers(prev => {
      const currentCount = prev.length || 0;
      // For team events, we need to maintain at least 4 members
      if (currentCount <= 4) {
        return prev;
      }
      
      const updatedTeamMembers = [...prev];
      updatedTeamMembers.splice(index, 1);
      return updatedTeamMembers;
    });
  };

  const ensureTeamSize = (registrationType: 'solo' | 'team') => {
    if (registrationType === 'team') {
      // Ensure we have exactly 4 team members for team registrations
      const requiredTeamMembers = Array(4).fill(0).map(() => ({ name: '', usn: '', branch: '' }));
      
      // If we already have some team members, preserve their data
      if (teamMembers && teamMembers.length > 0) {
        teamMembers.forEach((member, index) => {
          if (index < 4) {
            requiredTeamMembers[index] = { 
              name: member.name || '', 
              usn: member.usn || '', 
              branch: member.branch || '' 
            };
          }
        });
      }
      
      setTeamMembers(requiredTeamMembers);
    } else {
      // Clear team members for solo registration
      setTeamMembers([]);
    }
  };

  return {
    teamMembers,
    handleTeamMemberChange,
    addTeamMember,
    removeTeamMember,
    ensureTeamSize
  };
}
