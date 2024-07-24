import { format, getTime } from 'date-fns';

export const serializeDateToEpoch = (date) => {
    if (!date || !(date instanceof Date)) {
      throw new Error('Invalid date object provided');
    }
  
    const epochTimeInMs = getTime(date);
    return epochTimeInMs;
  };

export const deserializeEpochTime = (epochTimeInMs) => {
    if (!epochTimeInMs || typeof epochTimeInMs !== 'number') {
      return 'Invalid epoch time';
    }
  
    const date = new Date(epochTimeInMs);
    return format(date, 'MM-dd-yyyy');
  };

  export const deserializeEpochTimeCalendar = (epochTimeInMs) => {
    if (!epochTimeInMs || typeof epochTimeInMs !== 'number') {
      return 'Invalid epoch time';
    }
  
    const date = new Date(epochTimeInMs);
    return format(date, 'yyyy-MM-dd');
  };