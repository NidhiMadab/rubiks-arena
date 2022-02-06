const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const e = require('express')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


let connectedUserCount = 0
let readyCount = 0

// Set Static Folder
app.use(express.static(path.join(__dirname,'public')))


var people={};


// Run when a client connects
io.on('connection', (socket) => {


    console.log(socket.id)

    // When it hits index.html page, this only runs if `const socket = io()` is in main.js
    console.log(`New WebSocket Connection... ${socket}`)

    // Welcome current user
    // Send this message to the client that connected
    connectedUserCount++;

    if(connectedUserCount < 3){
      socket.emit('message', `Welcome to Rubriks Cube 1v1s! User count: ${connectedUserCount}`)

    }
    people[socket.id] =  socket.id;
    console.log(people)
    // Runs when client disconnects
    socket.on('disconnect', () => {
        connectedUserCount--;
        io.emit('message', `A user disconnected, User count: ${connectedUserCount}`);
        delete(people[socket.id])
        console.log(people)
    })



    socket.on('stopTime', (stopTime) => {
      othersStopTime = stopTime
      io.emit('stopTime', othersStopTime)
    });



    // Listen for userStatusUpdates
    socket.on('userStatus', (newStatus) => {
        console.log(`New User Status Recieved: ${newStatus}`)
        if(newStatus === "Ready"){
            readyCount++;

            // Game is playable
            if(readyCount === 2){
                console.log("Game is ready to be played!")
                io.emit('message', "Playing")

            // Not enough ready players
          } else if (readyCount < 2){
                console.log(`Waiting for ${connectedUserCount - readyCount} players...`)
                io.emit('message', "Waiting")
            }
            else{
              console.log(`Wait for game to be done`)
              io.emit('message', "In Progress")
            }
        }
        console.log("................")
    })




})




const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })
