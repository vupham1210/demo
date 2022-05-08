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

function App() {
  return (
    <Router>
      <div className="App">
          <Header />
      </div>
      <div className="container">
        <Routes>
          <Route path="/dang-ky/" element={ <Register/> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
