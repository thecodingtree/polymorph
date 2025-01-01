import { useRef } from 'react';
import { format } from 'date-fns';
import { cn } from '@/libs/utils';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { IconCalendarClock } from '@/components/common/icons';

import { TimePickerInput } from './TimePickerInput';

const getAMorPM = (date: Date | undefined) => {
  if (!date) return '';
  return date.getHours() < 12 ? 'AM' : 'PM';
};

export default function DateTimePicker({
  date,
  onChange,
  placeholder = 'Pick a date',
}: {
  date: Date | undefined;
  onChange: (day: Date | undefined) => void;
  placeholder?: string;
}) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const ampmRef = useRef<HTMLButtonElement>(null);

  const handleAMorPM = (date: Date | undefined, value: string) => {
    if (!date) return new Date();
    const hours = date.getHours();
    if (value === 'AM' && hours >= 12) {
      date.setHours(hours - 12);
    } else if (value === 'PM' && hours < 12) {
      date.setHours(hours + 12);
    }

    onChange(date);

    return date;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full pl-3 text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          {date ? format(date, 'PPp') : <span>{placeholder}</span>}
          <IconCalendarClock className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          disabled={(date) => date < new Date()}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="grid gap-1 text-center">
              <TimePickerInput
                picker="12hours"
                date={date}
                setDate={onChange}
                ref={hourRef}
                onRightFocus={() => minuteRef.current?.focus()}
              />
            </div>
            <div>:</div>
            <div className="grid gap-1 text-center">
              <TimePickerInput
                picker="minutes"
                date={date}
                setDate={onChange}
                ref={minuteRef}
                onLeftFocus={() => hourRef.current?.focus()}
              />
            </div>
            <div>
              <Select
                value={getAMorPM(date)}
                onValueChange={(value) => handleAMorPM(date, value)}
              >
                <SelectTrigger className="w-[72px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
