import React from 'react';
import { Button } from '@mui/material';

const GuessingPage = (props) => {
    return <>
        <p>You guessed {props.guess}. Computer guessed {props.modelGuess}.</p>
        {props.canvas}
        <Button onClick={props.restart}>Restart</Button>
    </>;
}

export default GuessingPage;