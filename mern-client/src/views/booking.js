import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';
import TimeSlots from './timeSlots/timeSlots';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Event from './event/event'

export default function Booking() {
  const [value, setValue] = useState('');
  const [time, setTime] = useState('')

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <TimeSlots 
            value={value}
            setValue={setValue}
            time={time}
            setTime={setTime}
          />
          <Event/>
        </Stack>
      </LocalizationProvider>
    </> 
  );
}