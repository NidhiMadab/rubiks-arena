import { useEffect, useState } from 'react';
import Stopwatch from './stopwatch/Stopwatch';
import './Online.css';
import ReactDOM from 'react-dom';

import { Link } from "react-router-dom";

import Confetti from 'react-confetti';

function Online(props) {
  const [scramble, setScramble] = useState("(click the stopwatch to begin)");

  useEffect(() => {
  }, [scramble]);

  const handleSocket = () => {
    props.socket.emit("userStatus", "Ready")
    props.socket.on("scrambleReciever", data => {
        props.socket.emit("userStatus", "Playing")
        data = data.replace(/,/g, ' ');
        setScramble(data)
    }) 
    // props.socket.on("gameResults", data => { todo: if this is working in Stopwatch.js, take this out. otherwise, leave it in.
    //     console.log(data)
    //     if (data[2] === props.socket.id) {
    //         ReactDOM.render(<Confetti width={window.width} height={window.height} recycle={false} tweenDuration={10000}></Confetti>)
    //         alert('You won!! Congratulations.')
    //     } else {
    //         alert('You lost against someone who had a time of ' + data[0])
    //     }
    // })

  }
  return (
    <div class='wrapper'>
        <div className='no-footer'>
            <div className='header'>
                <div className='arrow'>
                    <button>
                        <Link to='/'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="2.5%" fill="#444" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                            </svg>
                        </Link>
                    </button>
                </div>
                <div className='title-div'>
                    <h1 className='title'>Multiplayer</h1>
                </div>
            </div>
            <div className='stopwatch' onClick={handleSocket}>
                <Stopwatch socket={props.socket}/>
            </div>
        </div>
        <div className='footer'>
            <div className='scramble'>
                <p>{scramble}<br /></p>
            </div>
        </div>
    </div>
  )
}   

export default Online;

