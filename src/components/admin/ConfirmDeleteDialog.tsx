
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  eventId: string;
  eventName: string;
  onDelete: (id: string) => void;
}

const ConfirmDeleteDialog = ({ 
  eventId, 
  eventName,
  onDelete 
}: ConfirmDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const handleDelete = () => {
    onDelete(eventId);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0 border-red-800 hover:bg-red-900/20"
        >
          <Trash2 size={14} className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete "{eventName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-600 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
