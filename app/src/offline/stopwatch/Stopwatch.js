import { useEffect, useState } from 'react';
import { useKeyDown, useKeyUp } from 'react-keyboard-input-hook';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    useEffect(() => {
      let interval;
      if (running) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 10);
        }, 10);
      } else if (!running) {
        clearInterval(interval);
      }
      console.log(interval);
      return () => clearInterval(interval);
    }, [running]);

    let minutes, seconds;
    if("" + String(Math.floor((time / 60000) % 60)).slice(-2) !== "0") {
        minutes = "" + String(Math.floor((time / 60000) % 60)).slice(-2) + ":";
    } else {
        minutes = "";
    }

    if (parseInt(minutes.slice(0, 1)) > 0 && parseInt("" + String(Math.floor((time / 1000) % 60)).slice(-2)) < 10) {
      seconds = "0" + String(Math.floor((time / 1000) % 60)).slice(-2) + ".";
    } else {
      seconds = "" + String(Math.floor((time / 1000) % 60)).slice(-2) + ".";
    }

    let timerStarted = false;
    const [started, setStarted] = useState(false)
    
    const handleKeyDown = ({ keyName}) => {  
      console.log(timerStarted + ' timerStarted')
      if (started === true) {
        setRunning(false);
        setStarted(false)
        console.log(seconds);
      } 
      else if (keyName === 'Enter') {
        window.location.reload(false);
      }
    }

    const handleKeyRelease = ({ keyName }) => {
        if (started === true && keyName === 'Space') {
          setRunning(false)
          setStarted(false)
        }
        else if (started === false && keyName === 'Space') {
          setTime(0);
          setStarted(true);
          setRunning(true);
        }
    }
    let { keyName } = useKeyUp();
    useKeyUp(handleKeyRelease);
    keyName = useKeyDown();
    useKeyDown(handleKeyDown);

    return (
      <div className="stopwatch">
        <div className="numbers">
          <span>{timerStarted}</span>
          <span>{minutes}</span>
          <span>{seconds}</span>
          <span>{("" + ((time / 10) % 100))}</span>
        </div> 
      </div>
    );
};

export default Stopwatch;