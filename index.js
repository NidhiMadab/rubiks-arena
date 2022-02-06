const cubeScrambler = require("cube-scrambler")();
function scramble() {
    return cubeScrambler.scramble()
}

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io');
const e = require('express')

const app = express()
const server = http.createServer(app)
const io = socketio(server, ({cors: {origin: '*'}}))

let connectedUsers = []
let connectedUserCount = 0
let connectedUserReady = {
    // example Data
    // "boqB-ymFw5j7oZwEAAAB" : true, 
    // "BzcNyJDYGoIZhS4fAAAD" : false
}

let userAssociations = [
    // {"socketID": "AWDWAJ1EJ1", time: 0.23, name: "Alex" },
]




let readyCount = 0

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Run when a client connects
io.on('connection', (socket) => {
    io.emit('readyUpdater', readyCount)

    // When it hits index.html page, this only runs if `const socket = io()` is in main.js
    let socketID = socket.id //eventually we want to change this to username
    console.log(`New WebSocket Connection... ${socketID}`)
    connectedUsers.push(socketID)
    socket.emit('whoAmI', socketID); //let client know who they are


    // Welcome current user
    // Send this message to the client that connected
    if (connectedUserCount >= 2) {
        console.log("More than 2 users connected... Need to bring back to home page")

        // var destination = 'index.html';
        // socket.broadcast.to(`${socketID}`).emit('redirect', destination)

    }

    connectedUserCount++;
    socket.emit('message', `Welcome to Rubiks Cube 1v1s! User count: ${connectedUserCount}`)


    // Broadcast when a user connects
    // Broadcast = emit to every but the user that connected
    socket.broadcast.emit('message', `Another user connected, User count: ${connectedUserCount}`);

    io.emit('currentUsers', connectedUsers)
    // socket.broadcast.emit('userCountUpdate', ("join"))


    // Runs when client disconnects
    socket.on('disconnect', () => {
        connectedUsers.splice()

        var index = connectedUsers.indexOf(socketID);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
        }

        connectedUserCount--;

        console.log(`checking if user was ready: ${connectedUserReady[socketID]}`)
        if (connectedUserReady[socketID] === true) {
            readyCount--;
            io.emit('readyUpdater', readyCount)
        } // Only drop readyCount if they were actually ready

        console.log(`A user ${socketID} has disconnected, User count: ${connectedUserCount}`)
        io.emit('message', `A user ${socketID} has disconnected, User count: ${connectedUserCount}`);
        io.emit('currentUsers', connectedUsers)

        checkIfGameReady("Check")

    })


    function checkIfGameReady(newStatus) {
        if (newStatus === "Ready" || newStatus === "Check") {
            if (newStatus === "Ready") {
                readyCount++;
                io.emit('readyUpdater', readyCount)
                connectedUserReady[socketID] = true;
                console.log(`${socketID} is Ready`)
            }


            // Check Game is playable
            if (readyCount === connectedUserCount) {
                console.log(`Waiting for ${connectedUserCount - readyCount} players...`)
                console.log(`Session has begun with: ${connectedUserCount} players`)
                let generatedScramble = scramble()

                console.log("Sending scramble: " + generatedScramble)
                io.emit('scrambleReciever', `${generatedScramble}`)
                io.emit('message', "Playing")

                // Not enough ready players
            } else {
                console.log(`Waiting for ${connectedUserCount - readyCount} players...`)
                io.emit('message, "Waiting')
            }

        }
    }

    // Listen for userStatusUpdates
    socket.on('userStatus', (newStatus) => {
        // console.log(`${socketID} updated their status to: ${newStatus}`)

        // console.log(newStatus)
        checkIfGameReady(newStatus)


        if (newStatus === "Playing") {
            readyCount--;
            io.emit('readyUpdater', readyCount)
            connectedUserReady[socketID] = false
            console.log(`${socketID} is Playing`)
        }

        if (newStatus === "Stopped") {
            console.log(`${socketID} stopped Playing`)


        }


        console.log("................")
    })

    
    socket.on('userTime', (userTime) => {
        console.log(`${socketID} completed in ${userTime}s`)
      // {"socketID": "AWDWAJ1EJ1", time: 0.23, name: "Alex" },
      userAssociations.push( { "socketID": socketID, time: userTime, name:"N/A"} )
        
        // console.log(`readyCount = ${readyCount}; connectedUserCount = ${connectedUserCount} and userAssociations.length = ${userAssociations.length}`)
        if(userAssociations.length === 2) {
            console.log("---------------- GAME RESULTS ----------------")
            console.log(userAssociations)
            console.log("---------------------------------------------")

            // find lowest time
            let min = parseFloat(userAssociations[0].time);
            let minName = userAssociations[0].socketID //socketID for now, we can chnage to name later
            for(let i = 1; i < userAssociations.length; i++){
                if(userAssociations[i].time < min){
                    min = parseFloat(userAssociations[i].time);
                    minName = userAssociations[i].socketID
                }
            }
            console.log(`${minName} has won the battle with a time of ${min}`)

            // Sending results to all clients
            io.emit('gameResults', [minName, min, socketID])
            // io.emit('gameResults', `${minName} has won the battle with a time of ${min}`)

            console.log("Resetting game...")
            userAssociations = []
        }
        
    })

})




const PORT = 8000 || process.env.PORT;
server.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })