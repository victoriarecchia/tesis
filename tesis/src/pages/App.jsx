import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "../../auth/AuthProvider"
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react"
import Inicio from "./Inicio";
import Login from "./Login";
import Registro from "./Registro";
import Articulacion from "./Articulacion";
import Categorias from "./Categorias";
import Historial from "./Historial";
import RegistroPaciente from "./RegistroPaciente";
import Navbar from "./Navbar";
import JuegoFonemas from "./Fonemas";
import Memoria from "./Memoria";
import Pacientes from "./Pacientes";
import EditarPaciente from "./EditarPaciente";
import Voz from "./Voz";
import ProtectedRoute from "./ProtectedRoutes";
import HistorialPaciente from "./HistorialPaciente";

function App() {
    const [menuActivo, setmenuActivo] = useState(false)

    return (
        <header>
            
            <GiHamburgerMenu onClick={() => setmenuActivo(!menuActivo)} />

            <AuthProvider>
                <Router>
                    < Navbar menu={menuActivo} setMenu={setmenuActivo}/>
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Registro/>} />
                        <Route path="/fonemas" element={<JuegoFonemas/>} />
                        <Route path="/articulacion" element={<Articulacion/>} />
                        <Route path="/memoria" element={<Memoria/>} />
                        <Route path="/signpaciente" element={<RegistroPaciente/>} />
                        <Route path="/pacientes" element={<Pacientes/>} />
                        <Route path="/editarpaciente/:id" element={<EditarPaciente/>} />
                        <Route path="/historial" element={<Historial />} />
                        <Route path="/historial/:dni" element={<HistorialPaciente />} />
                        <Route path="/voz" element={<Voz/>} />
                    
                        <Route
                            path="/categorias"
                            element={
                                <ProtectedRoute>
                                    <Categorias />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </header>
    )
}

export default App
