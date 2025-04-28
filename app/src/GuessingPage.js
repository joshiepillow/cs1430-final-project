import React from 'react';
import { Button, Autocomplete, TextField, useTheme, colors } from '@mui/material';

const GuessingPage = (props) => {
    const theme = useTheme()

    return <>
        <p>This is a(n)</p>
        {<Autocomplete options={props.categories} 
            sx={{ width: 300 }}
            value={props.guess}
            onChange={(_, value, __) => props.setGuess(value)}
            renderInput={(params) => <TextField {...params} label="Guess" variant="filled" sx={{ backgroundColor: colors.grey[100] }}/>} 
        />}
        {props.canvas}
        <Button onClick={() => props.setDrawing("result")}>Submit Guess</Button>
    </>;
}

export default GuessingPage;