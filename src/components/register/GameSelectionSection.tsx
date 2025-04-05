
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
        <div className={`flex items-center p-3 rounded-md transition-colors ${selectedGame === 'PUBG' ? 'bg-techfest-muted/60' : 'hover:bg-gray-800/30'}`}>
          <RadioGroupItem value="PUBG" id="pubg" className="mr-3" />
          <Label htmlFor="pubg" className="flex-1 cursor-pointer">
            <div className="font-medium">PUBG</div>
            <div className="text-xs text-gray-400">PlayerUnknown's Battlegrounds</div>
          </Label>
        </div>
        
        <div className={`flex items-center p-3 rounded-md transition-colors ${selectedGame === 'FREE_FIRE' ? 'bg-techfest-muted/60' : 'hover:bg-gray-800/30'}`}>
          <RadioGroupItem value="FREE_FIRE" id="free-fire" className="mr-3" />
          <Label htmlFor="free-fire" className="flex-1 cursor-pointer">
            <div className="font-medium">Free Fire</div>
            <div className="text-xs text-gray-400">Garena Free Fire</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GameSelectionSection;
