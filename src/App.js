import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import {Vod} from './pages/Vod';
import { Profile } from './pages/Profile';
import {About} from './pages/About';
import {Legal} from './pages/Legal';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path = "/" element={<Login />} />
          <Route path = "/register" element={<Register />} />
          <Route path = "/home" element={<Home />} />
          <Route path = "/upload" element={<Upload />} />
          <Route path = "/vod/:vodID" element={<Vod />} />
          <Route path = "/profile/:userID" element={<Profile />} />
          <Route path= "/about" element={<About />} />
          <Route path= "/legal" element={<Legal />} />
        </Routes>
        
      </Router>
    </div>
  );
}

export default App;
