import React, { useState } from 'react';
import { TextField, Box, Chip, Button, Snackbar } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import axios from 'axios'
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import Timezone from './components/timezone';
import { baseURL } from '../../config';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function TimeSlots({time, setTime, value, setValue}) {
  const [slots, setSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeDiff, setTimeDiff] = useState(0)
  const [duration, setDuration] = useState(30)

  const getSlots = async(newValue, timeDiferrence, timeDuration) => {
    setLoading(true)

    let convertedTime = moment(time, "HH:mm")
    let momentTime = moment(convertedTime)
    convertedTime.subtract(timeDiferrence, 'hours')

    let tempDate = new Date(newValue) 
    if (convertedTime.format('D') < momentTime.format('D')){
      tempDate.setDate(tempDate.getDate()-1);
    }
    if (convertedTime.format('D') > momentTime.format('D')){
      tempDate.setDate(tempDate.getDate()+1);
    }

    axios.get(`${baseURL}/allSlots`, { params: { date: tempDate, timeDiff: timeDiferrence, timeDuration: timeDuration }})
    .then(res => {
      let convertedSlots = []
      res.data.map(slot => {
        let tempTime = moment(slot, "HH:mm");
        tempTime.add(timeDiferrence, 'hours')
        convertedSlots.push(tempTime.format("HH:mm"))
      })
      convertedSlots.sort()
      setSlots(convertedSlots)
      setLoading(false)
    })
  }

  const handleChange = (newValue) => {
    getSlots(newValue, timeDiff, duration)
    setSlots([])
    setTime('')
    const _date = new Date(newValue);  
    const newDate = new Date(_date.getTime() + Math.abs(_date.getTimezoneOffset() * 60000))
    const withoutTimeZone = moment(newDate).format("MM/DD/YYYY")
    setValue(withoutTimeZone);
  };

  const handleChip = (event) => {
    setTime(event.target.outerText)
  }

  const bookEvent = () => {
    setSlots([])
    let convertedTime = moment(time, "HH:mm")
    let momentTime = moment(convertedTime)
    convertedTime.subtract(timeDiff, 'hours')
    let endTime = moment(convertedTime)
    endTime.add(duration, 'minutes')

    let tempDate = new Date(value) 
    if (convertedTime.format('D') < momentTime.format('D')){
      tempDate.setDate(tempDate.getDate()-1);
    }
    if (convertedTime.format('D') > momentTime.format('D')){
      tempDate.setDate(tempDate.getDate()+1);
    }

    axios.post(`${baseURL}/newEvent`, {
      date: tempDate,
      time: convertedTime.format("HH:mm"),
      endTime: endTime.format("HH:mm")
    })
    .then(res => {
      setTime('')
      getSlots(value, timeDiff, duration)
      setOpen(true);
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleDuration = (event) => {
    setDuration(event.target.value)
    if (value){
      setSlots([])
      setTimeout(()=>{getSlots(value, timeDiff, event.target.value)}, 2000);
    }
  }

  const handleTimeDiff = (event) => {
    setTimeDiff(event.target.value)
    if (value){
      setSlots([])
      getSlots(value, event.target.value, duration)
    }
  }

  return (
    <>
      <Box sx={{width:'600', mt: 10, ml: 10, display:'flex'}}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/DD/YYYY"
          minDate={new Date()}
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <Timezone timeDiff={timeDiff} handleTimeDiff={handleTimeDiff}/>
        <TextField
          id="outlined-required"
          defaultValue={duration}
          onChange={handleDuration}
        />
        <Box sx={{ml:5, width: '300px'}}>
          {loading && <CircularProgress />}
          {slots.map((slot)=>{
            return (<Chip sx={{width:'90px', mb:2, mr: 1}} onClick={handleChip} label={slot}/>)
          })}
          <Box  sx={{width:'240px', ml: 3}}>
            <Button variant="contained" onClick={bookEvent} disabled={!time}>Book at {time}</Button>
          </Box>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Event Booked
        </Alert>
      </Snackbar>
    </>
  );
}