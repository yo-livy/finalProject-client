import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Dashboard from './components/Dashboard.js';
import UserContext from './UserContext.js';
import Invest from './components/Invest.js';
import Nav from './components/Nav/Nav.js';
import axios from 'axios';
import Logout from './components/Logout';

function App() {
  const [user, setUser] = useState(null);

  console.log('LocalStorage=>', localStorage)
  
  useEffect(() => {
    if(localStorage.getItem('user')){
      setUser(JSON.parse(localStorage.getItem('user')));
      console.log('USER => ', user)
    }
  },[]);


  useEffect(() => {
    async function verifyTokenAndFetchUserData() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3030/verify', {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          console.log("Response:", response.data);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Token is invalid or expired, so remove it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            console.error("Error fetching user data", error);
        }
      }
    }
    
    verifyTokenAndFetchUserData();
  }, []);


  return (
    <UserContext.Provider value = {{user, setUser}}>
      <Nav/>
      <Routes>
        <Route path="/login" element={user ? <Navigate replace to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate replace to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate replace to="/login" />} />
        <Route path="/invest" element={user ? <Invest /> : <Navigate replace to="/login" />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </UserContext.Provider>  
  );
}

export default App;
