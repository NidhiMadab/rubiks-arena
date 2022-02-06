import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './homepage/HomePage';
import Offline from './offline/Offline';
import Online from './online/Online';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';

const ENDPOINT = "localhost:8000";
const socket = io(ENDPOINT)

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/solo' element={<Offline />}></Route>
            <Route path='/multiplayer' element={<Online socket={socket}/>}></Route>
        </Routes> 
    </BrowserRouter>    
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
