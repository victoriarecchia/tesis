import React, { useContext, createContext, useState, useEffect } from "react";
import requestNewAccessToken from "./requestNewAccessToken";
import { API_URL } from "./authConstants";

// AuthContext para manejar la autenticación en la aplicación
const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => { },
    setAccessTokenAndRefreshToken: (_accessToken, _refreshToken) => { },
    getRefreshToken: () => { },
    saveUser: (_userData) => { },
    getUser: () => ({}),
    signout: () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Nuevo estado para manejar errores

    function getAccessToken() {
        return accessToken;
    }

    function saveUser(userData) {
        setAccessTokenAndRefreshToken(userData.body.accessToken, userData.body.refreshToken);
        setUser(userData.body.user);
        setIsAuthenticated(true);
    }

    function setAccessTokenAndRefreshToken(accessToken, refreshToken) {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem("token", JSON.stringify({ accessToken, refreshToken })); // Guardar accessToken también
    }

    function getRefreshToken() {
        if (refreshToken) {
            return refreshToken;
        }
        const token = localStorage.getItem("token");
        if (token) {
            const { refreshToken } = JSON.parse(token);
            setRefreshToken(refreshToken);
            return refreshToken;
        }
        return null;
    }

    async function getNewAccessToken(refreshToken) {
        try {
            const token = await requestNewAccessToken(refreshToken);
            if (token) {
                setAccessToken(token);
                localStorage.setItem("token", JSON.stringify({ accessToken: token, refreshToken })); // Actualizar storage
                return token;
            }
        } catch (error) {
            console.error("Error obteniendo nuevo access token:", error);
            // setError("No se pudo renovar la sesión. Por favor, inicia sesión de nuevo."); // Manejo de errores
            signout();
        }
        return null;
    }

    function getUser() {
        return user;
    }

    // function signout() {
    //     localStorage.removeItem("token");
    //     setAccessToken("");
    //     setRefreshToken("");
    //     setUser(null);
    //     setIsAuthenticated(false);
    // }
    // import { useHistory } from "react-router-dom";  // Si estás usando react-router-dom

    // En tu función `signout`
    async function signout() {
        try {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                const response = await fetch(`${API_URL}/signout`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("No se pudo cerrar sesión en el servidor");
                }
            }

            // Limpiar el estado y el localStorage
            localStorage.removeItem("token");
            setAccessToken("");
            setRefreshToken("");
            setUser(null);
            setIsAuthenticated(false);

            history.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            // setError("Error al cerrar sesión. Inténtalo de nuevo.");
        }
    }



    async function checkAuth() {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const { accessToken, refreshToken } = JSON.parse(token);
                if (accessToken) {
                    const userInfo = await retrieveUserInfo(accessToken);
                    if (userInfo) {
                        setUser(userInfo);
                        setIsAuthenticated(true);
                    } else {
                        const newToken = await getNewAccessToken(refreshToken);
                        if (newToken) {
                            const userInfo = await retrieveUserInfo(newToken);
                            if (userInfo) {
                                setUser(userInfo);
                                setIsAuthenticated(true);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error al comprobar la autenticación:", error);
            setError("Error al verificar la autenticación. Por favor, vuelve a cargar la página.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                getAccessToken,
                setAccessTokenAndRefreshToken,
                getRefreshToken,
                saveUser,
                getUser,
                signout,
                error, // Proporcionar el estado de error
            }}
        >
            {isLoading ? <div>Loading...</div> : children}
            {error && <div className="error-message">{error}</div>} {/* Mostrar errores si los hay */}
        </AuthContext.Provider>
    );
}

async function retrieveUserInfo(accessToken) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener información del usuario");
        }

        const json = await response.json();
        return json.body;
    } catch (error) {
        console.error("Error en retrieveUserInfo:", error);
        return null;
    }
}

export const useAuth = () => useContext(AuthContext);
