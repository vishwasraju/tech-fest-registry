
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GamepadIcon } from 'lucide-react';

interface GameSelectionSectionProps {
  selectedGame?: string;
  onGameSelection: (game: string) => void;
}

const GameSelectionSection: React.FC<GameSelectionSectionProps> = ({
  selectedGame,
  onGameSelection
}) => {
  return (
    <div className="mt-6 p-4 glass rounded-lg">
      <div className="flex items-center mb-3">
        <GamepadIcon size={18} className="mr-2 text-techfest-neon-purple" />
        <h3 className="text-lg font-medium">Select Game</h3>
      </div>
      
      <RadioGroup
        value={selectedGame}
        onValueChange={onGameSelection}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="PUBG" id="pubg" />
          <Label htmlFor="pubg">PUBG</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="FREE_FIRE" id="free-fire" />
          <Label htmlFor="free-fire">Free Fire</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GameSelectionSection;
