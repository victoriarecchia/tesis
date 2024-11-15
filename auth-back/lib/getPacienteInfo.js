
// OBTENER INFORMACION DEL PACIENTE. No solicita la contraseña
function getPacienteInfo(user) {
  return {
    nombre: user.username,
    apellido: user.email,
    id: user.id || user._id,
    dni: user.dni,
  };
}

module.exports = getPacienteInfo;
