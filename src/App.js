import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path = "/" element={<Login />} />
          <Route path = "/register" element={<Register />} />
          <Route path = "/home" element={<Home />} />
        </Routes>
        
      </Router>
    </div>
  );
}

export default App;
