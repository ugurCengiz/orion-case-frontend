import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route, Routes }  from 'react-router-dom';
import SignIn from './SignIn';
import TelephoneDirectory from './telephoneDirectory';
import SignOut from './SignOut';

function App() {

  return (

    <Router>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/telephoneDirectory" element={<TelephoneDirectory />} />
      <Route path="/SignOut" element={<SignOut />} />
    </Routes>
</Router>
  );
}

export default App;
