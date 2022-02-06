import { useEffect, useState } from 'react';
import { useKeyDown, useKeyUp } from 'react-keyboard-input-hook';
import Confetti from 'react-confetti';
import ReactDOM from 'react-dom';


const Stopwatch = (props) => {
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
      if (started === true) {
        setRunning(false);
        setStarted(false)
        console.log(minutes)
        if (minutes !== "") {
            minutes = parseInt(minutes.slice(0, minutes.length)) * 60
        } else {
            minutes = 0
        }
        
        let solveTime = (minutes + parseInt(seconds.slice(0, seconds.length))) + (((time / 10) % 100)/100);
        props.socket.emit('userTime', solveTime)
        props.socket.emit('userStatus', 'Stopped')
        props.socket.on("gameResults", data => {
            console.log(data)
            console.log(props.socket.id)
            console.log(data[0])
            if (data[0] === props.socket.id) {
                // ReactDOM.render(<Confetti width={window.width} height={window.height} recycle={false} tweenDuration={10000}></Confetti>)
                alert('You won!! Congratulations.')
            } else {
                alert('You lost against someone who had a time of ' + data[1])
            }
        })
      } 
      else if (keyName === 'Enter') {
        window.location.reload(false);
      }
    }

    const handleKeyRelease = ({ keyName }) => {
        if (started === true && keyName === 'Space') {
          setRunning(false)
          setStarted(false)
        //   let solveTime = ((parseInt(minutes.slice(0, -1)) * 60) + parseInt(seconds.slice(0, -1))) + (((time / 10) % 100)/1000);
        //   console.log(solveTime);
        //   props.socket.emit('userTime', solveTime)
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