  const Mongoose = require("mongoose");
  const bcrypt = require("bcrypt");
  const { generateAccessToken, generateRefreshToken } = require("../auth/sign");
  const getUserInfo = require("../lib/getUserInfo");
  const Token = require("./token");

  //crear schema con email nom
  const UserSchema = new Mongoose.Schema({
    id: { type: Object },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    nombre: { type: String },
    apellido: { type: String },
  });

  UserSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew) {
      const document = this;

      // Encriptamos la clave
      bcrypt.hash(document.password, 10, (err, hash) => {
        if (err) {
          next(err);
        } else {
          document.password = hash;
          next();
        }
      });
    } else {
      next();
    }
  });

  // Metodo para ver si existe el username ingresado
  UserSchema.methods.usernameExists = async function (username) {
    const result = await Mongoose.model("User").find({ username: username });
    return result.length > 0;
  };


  // Metodo para ver si la contraseña es correcta.
  UserSchema.methods.isCorrectPassword = async function (password, hash) {
    const same = await bcrypt.compare(password, hash);
    return same;
  };

  // Metodo para generar un token de acceso.
  UserSchema.methods.createAccessToken = function () {
    return generateAccessToken(getUserInfo(this));
  };

  // Metodo para generarar el token de actualizacion, para crear un nuevo token de acceso.
  UserSchema.methods.createRefreshToken = async function(next) {
    const refreshToken = generateRefreshToken(getUserInfo(this));
    try {
      // Guarda el token en la BD 
      await new Token({ token: refreshToken }).save();
      return refreshToken;
    } catch (error) {
      console.error(error);
    }
  };

  module.exports = Mongoose.model("User", UserSchema);
