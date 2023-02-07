import React, { useEffect, useState } from 'react';
import { 
  TextField, 
  Box, 
  Button, 
  Table, 
  Paper,
  TableCell, 
  TableContainer, 
  TableBody,
  TableRow,
  TableHead
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import axios from 'axios';
import moment from 'moment';
import { baseURL } from '../../config';

export default function TimeSlots() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [events, setEvents] = useState([]);

  const getEvents = async() => {
    axios.get(`${baseURL}/getEvents`, { params: { startDate: start, endDate: end }})
    .then(res => {
      setEvents(res.data);
    })
  }

  const handleStartChange = async(newValue) => {
    const _date = new Date(newValue);  
    const newDate = new Date(_date.getTime() + Math.abs(_date.getTimezoneOffset() * 60000))
    const withoutTimeZone = moment(newDate).format("MM/DD/YYYY")
    setStart(withoutTimeZone);
  };

  const handleEndChange = async(newValue) => {
    const _date = new Date(newValue);  
    const newDate = new Date(_date.getTime() + Math.abs(_date.getTimezoneOffset() * 60000))
    const withoutTimeZone = moment(newDate).format("MM/DD/YYYY")
    setEnd(withoutTimeZone);
  };

  useEffect(() => {
    if (end < start){
      setEnd(start);
    }
  }, [start])

  return (
    <>
      <h1>View Events</h1>
      <Box sx={{width:'600', mt: 20, display:'flex'}}>
        <Box sx={{ml:55}}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            value={start}
            maxDate={end}
            onChange={handleStartChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="End Date"
            inputFormat="MM/DD/YYYY"
            minDate={start}
            value={end}
            onChange={handleEndChange}
            sx={{pl: 20}}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Button variant="contained" disabled={!(end&&start)} onClick={getEvents}>View Event</Button>
      </Box>
        <TableContainer sx={{ml: 20}} component={Paper}>
        <Table sx={{ minWidth: 650, maxWidth: 700 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">End Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={event.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{event.id}</TableCell>
                <TableCell align="right">{new Date(event.date).toDateString()}</TableCell>
                <TableCell align="right">{event.time} PST</TableCell>
                <TableCell align="right">{event.endTime} PST</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}