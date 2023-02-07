import React from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

export default function Timezone({ timeDiff, handleTimeDiff }) {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">Time zone</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={timeDiff}
        label="Time Zone"
        onChange={handleTimeDiff}
        > 
          <MenuItem value={0}>PST</MenuItem>
          <MenuItem value={12}>PKT</MenuItem>
          <MenuItem value={8}>GMT</MenuItem>
          <MenuItem value={1}>MST</MenuItem>
      </Select>
    </FormControl>
  );
}