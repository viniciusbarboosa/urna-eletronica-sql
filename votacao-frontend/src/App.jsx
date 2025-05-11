import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import VotacaoPanel from './components/VotacaoPanel';
import Resultados from './components/Resultados';

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={usuario ? <Navigate to="/admin" /> : <Login setUsuario={setUsuario} />} />
          <Route path="/admin" element={usuario ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/votacao" element={<VotacaoPanel />} />
          <Route path="/resultados" element={<Resultados />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;