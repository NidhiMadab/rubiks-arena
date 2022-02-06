import { useEffect, useState } from 'react';
import Stopwatch from './stopwatch/Stopwatch';
import './Offline.css';

import { Link } from "react-router-dom";

function Offline() {
  const [scramble, setScramble] = useState();

  useEffect(() => {
    let fetchScramble = makeScramble().join(' ')
    setScramble(fetchScramble);
    console.log('hi')
  }, []);

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
                    <h1 className='title'>Single Player</h1>
                </div>
            </div>
            <div className='stopwatch'>
                <Stopwatch />
            </div>
        </div>
        <div className='footer'>
            <div className='scramble'>
                <p>{scramble}<br /><span>(click enter to rescramble)</span></p>
            </div>
        </div>
    </div>
  );
}   
function makeScramble() {
    var options = ["F", "F2", "F'", "R", "R2", "R'", "U", "U2", "U'", "B", "B2", "B'", "L", "L2", "L'", "D", "D2", "D'"]
    var numOptions = [0, 1, 2, 3, 4, 5] // 0 = F, 1 = R, 2 = U, 3 = B, 4 = L, 5 = D
    var scramble = []
    var scrambleMoves = []
    var bad = true
  
    while (bad) {
        scramble = []
        for (let i = 0; i < 20; i++) {
            scramble.push(numOptions[getRandomInt(6)])
        }
        // check if moves directly next to each other involve the same letter
        for (let i = 0; i < 20 - 1; i++) {
            if (scramble[i] === scramble[i + 1]) {
                bad = true
                break
            } else {
                bad = false
            }
        }
    }
    
    // switch numbers to letters
    var move
    for (var i = 0; i < 20; i++) {
      switch (scramble[i]) {
        case 0:
            move = options[getRandomInt(3)] // 0,1,2
            scrambleMoves.push(move)
            break
        case 1:
            move = options[getRandomIntBetween(3, 6)] // 3,4,5
            scrambleMoves.push(move)
            break
        case 2:
            move = options[getRandomIntBetween(6, 9)] // 6,7,8
            scrambleMoves.push(move)
            break
        case 3:
            move = options[getRandomIntBetween(9, 12)] // 9,10,11
            scrambleMoves.push(move)
            break
        case 4:
          move = options[getRandomIntBetween(12, 15)] // 12,13,14
          scrambleMoves.push(move)
          break
        case 5:
          move = options[getRandomIntBetween(15, 18)] // 15,16,17
          scrambleMoves.push(move)
          break
        default:
          break
      }
    }
    console.log(scrambleMoves)
    return scrambleMoves
  }
  
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) // returns up to max - 1
  }
  
  function getRandomIntBetween(min, max) { // return a number from min to max - 1. Ex. 3, 9 returns 3 - 8
    return Math.floor(Math.random() * (max - min) + min)
  }

export default Offline;