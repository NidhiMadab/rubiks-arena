const actionButton = document.getElementById('actionButton')
const gameStatus = document.getElementById('status')
const timer = document.getElementById('timerSeconds')

var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;


const socket = io()

// When a message is hit to client, do this
socket.on('message', (msg) => {
  console.log(msg)
  updateStatus(msg)
})

socket.on('stopTime', (msg) => {
  console.log(msg)
})



// Event listeners
actionButton.addEventListener('click', () => {
    // console.log("Button clicked")

    let status = actionButton.innerHTML

    if(status === "Ready?"){

        let newStatus = "Waiting..."
        actionButton.innerHTML = newStatus
        actionButton.classList.replace('btn-success', 'btn-warning')

        // Emit new status to server
        socket.emit('userStatus', "Ready")
    }

    if(status === "Start"){
        console.log("Scrambling")
        actionButton.innerHTML = "Stop"
        startTimer()

        // Emit new status to server
        socket.emit('userStatus', "Playing")
    }

    if (status === "Stop") {


        console.log("Stopped Playing")

        actionButton.innerHTML = "Waiting for Results"
        actionButton.classList.replace('btn-danger', 'btn-success')

        stopTimer()
        stoptime = timer.innerHTML
        //resetTimer()
        // Emit new status to server
        socket.emit('userStatus', "Stopped")
        socket.emit('stopTime',stoptime)


    }
    // if(status === "Play Again?"){
    //     actionButton.classList.replace('btn-primary', 'btn-success')
    //     actionButton.innerHTML = "Ready?"
    // }
})


// Updates status
function updateStatus(gameStatus) {

    if(gameStatus === "Playing"){
        console.log("Scrambling")
        actionButton.innerHTML = "Start"
    }
    if(gameStatus === "In Progress"){
        console.log("In Progress")
        actionButton.innerHTML = "Start"
    }

}



function startTimer() {
  if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}

function timerCycle() {
    if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = '0' + sec;
    }
    if (min < 10 || min == 0) {
      min = '0' + min;
    }
    if (hr < 10 || hr == 0) {
      hr = '0' + hr;
    }

    timer.innerHTML = hr + ':' + min + ':' + sec;

    setTimeout("timerCycle()", 1000);
  }
}

function resetTimer() {
    timer.innerHTML = '00:00:00';
}
