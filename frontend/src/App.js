import React from 'react';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/app.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Register from './pages/Register';
import Login from './pages/Login';
import Account from './pages/dashboard/Account';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
          <Header />
      </div>
      <div className="container">
        <Routes>
          <Route path="/dang-ky/" element={ <Register/> } />
          <Route path="/dang-nhap/" element={ <Login/> } />
          <Route path="/tai-khoan/" element={ <Account/> } />
          <Route path="/tai-khoan/:slug" element={ <Dashboard /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
