import { Link } from "react-router-dom";
import React, { MouseEvent } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/authConstants";

export default function PortalLayout({ children }) {
  const auth = useAuth();

  async function handleSignOut(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getRefreshToken()}`,
        },
      });
      if (response.ok) {
        auth.signout();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <header>
        <nav className="navbar">

          <div>
            <ul>
            <li>
                <Link to="/signpaciente">Paciente</Link>
              </li>
              <li>
                <Link to="/categorias">Categorias</Link>
              </li>
              <li>
                <a href="#" onClick={handleSignOut}>
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
