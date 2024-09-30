import Inicio from './Inicio/Inicio'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Categorias from './Categorias/Categorias';
import Articulacion from './Articulacion/Articulacion';
import Navbar from './Navbar/Navbar';
import Login from './Login/Login';
import Registro from '../SignUp/Registro';
import Audicion from './Audicion/Audicion';


function App() {

  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/articulacion" element={<Articulacion />} />
      <Route path="/audicion" element={<Audicion />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  </Router>       
  )
}

export default App
