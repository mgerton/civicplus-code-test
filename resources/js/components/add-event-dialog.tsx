import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddEventDialogProps {
  onSave: (title: string, description: string, startDate: string, endDate: string) => boolean;
}

interface CalendarEventForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const AddEventDialog = ({ onSave }: AddEventDialogProps) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formValues, setFormValues] = useState<CalendarEventForm>({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
  });

  const getInputHandler = (name: string) => {
      return (event: Event) => {
          setFormValues({ ...formValues, [name]: event.target?.value });
      };
  };

  const handleAddEvent = async () => {
      const { title, description, startDate, endDate } = formValues;
      const saveResult = await onSave(title, description, startDate, endDate);

      if (saveResult) {
          setDialogVisible(false);
      }
  };

  return <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
      <DialogTrigger asChild>
          <Button>+ Add New Event</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Add new event details here and save when completed.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                      Title
                  </Label>
                  <Input id="title" className="col-span-3" onChange={getInputHandler('title')} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                      Description
                  </Label>
                  <Input id="description" className="col-span-3" onChange={getInputHandler('description')} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                      Start Date
                  </Label>
                  <Input id="startDate" type="datetime-local" className="col-span-3" onChange={getInputHandler('startDate')} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                      End Date
                  </Label>
                  <Input id="endDate" type="datetime-local" className="col-span-3" onChange={getInputHandler('endDate')} />
              </div>
          </div>
          <DialogFooter>
              <Button onClick={handleAddEvent}>Save</Button>
          </DialogFooter>
      </DialogContent>
  </Dialog>;
};
