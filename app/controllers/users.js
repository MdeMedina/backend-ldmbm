const { httpError } = require("../helpers/handleError");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validateJwt = require("../middleware/validateJwt");
const signToken = require("../middleware/signToken");
const { checkearTime } = require("../middleware/checkTime");
const moment = require("moment-timezone");
const MongoClient = require("mongodb").MongoClient;

const authUser = (req, res) => {
  res.send(req.user);
};

const horaActual = async () => {
  let horaActual = new Date();
  horaActual = await moment(horaActual).tz("America/Caracas").format();
  horaActual = horaActual.split("-");
  horaActual = `${horaActual[0]}-${horaActual[1]}-${horaActual[2]}`;
  return horaActual;
};

const getHour = async (req, res) => {
  let hora = await horaActual();
  res.status(200).send({ horaActual: hora });
};

const actNumber = async (req, res) => {
  const { body } = req;
  const act = await User.findOneAndUpdate(
    { email: body.email },
    {
      cantidadM: body.cantidadM,
    }
  );

  const users = await User.find();
  res.status(200).send(users);
};

const getInactive = async (req, res) => {
  const { body } = req;
  const user = await User.findOne({ email: body.email });
  if (user)
    res.status(200).send({ hour: user.Inactive });
  else res.status(404).send({ message: "User not found" });
};

const actInactive = async (req, res) => {
  let { body } = req;
  let hora = await horaActual();
  const act = await User.findOneAndUpdate(
    { email: body.email },
    { Inactive: hora }
  );
  res.status(200).send(`Tiempo de inactividad actualizado con éxito ${act}`);
};

const actNotificaciones = async (req, res) => {
  const { body } = req;
  const act = await User.findOneAndUpdate(
    {
      email: body.email,
    },
    { notificaciones: body.notificaciones }
  );
  res.status(200).send(act);
};

const loginUser = async (req, res) => {
  const { body } = req;
  try {
    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user) {
      res
        .status(403)
        .send({ errormessage: "ususario y/o contraseña inválida" });
    } else {
      const isMatch = await bcrypt.compare(body.password, user.password);
      if (isMatch) {
          const signed = signToken(user._id);
          res.status(200).json({
            message:
              "El usuario a ingresado correctamente, sera redirigido a la pagina de inicio",
            key: signed,
            name: user.username,
            vendedor: user.vendedor,
            email: user.email,
            cantidadM: user.cantidadM,
            messageId: user.messageId,
          });
      } else {
        res
          .status(403)
          .send({ errormessage: "Usuario y/o Contraseña inválida" });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({ ok: true, users, count: users.length });
};

const registerUser = async (req, res) => {
  const { body } = req;
  try {
    const isUser = await User.findOne({ email: body.email.toLowerCase() });
    const users = await User.find({});
    if (isUser) {
      return res.status(403).send("usuario ya existe");
    }
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(body.password, salt);
    const user = await User.create({
      email: body.email.toLowerCase(),
      password: hashed,
      salt,
      username: body.username,
      cantidadM: 10,
      messageId: users.length + 1,
      notificaciones: [],
      vendedor: body.vendedor,
    });
    const signed = signToken(user._id);
    res.status(201).send(users);
  } catch (e) {
    httpError(res, e);
  }
};

const actUser = async (req, res) => {
  const { body } = req;
  console.log(body);
  const act = await User.findOneAndUpdate(
    { _id: body._id },
    {
      email: body.email,
      username: body.username,
      vendedor: body.vendedor,
    }
  );
  const users = await User.find();
  res.status(200).send(users);
};

const actPass = async (req, res) => {
  const { body } = req;
  const user = await User.findOne({ email: body.email });
  const isMatch = await bcrypt.compare(body.ActualPassword, user.password);
  if (isMatch) {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(body.password, salt);
    const act = await User.findOneAndUpdate(
      { email: body.email },
      {
        password: hashed,
      }
    );
    res.status(200).send("Contraseña actualizada con éxito");
  } else {
    res.status(403).send({ errormessage: "contraseña inválida" });
  }
};

const deleteUsers = async (req, res) => {
  const { body } = req;
  const del = await User.findOneAndDelete({ _id: body._id });
  const users = await User.find();
  res.status(200).send(users);
};

module.exports = {
  registerUser,
  loginUser,
  authUser,
  getUsers,
  actUser,
  deleteUsers,
  actNumber,
  actNotificaciones,
  actInactive,
  getInactive,
  actPass,
  getHour,
};
