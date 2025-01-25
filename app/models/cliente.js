const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    nombre: { type: String, required: true },
  RUT: { type: String, required: true },
  correo: { type: String },
  direccion: { type: String, required: true },
  contacto: { type: String, required: true },
  visita: { type: String },
  Observaciones: { type: String },
    // otros campos...
});

schema.index({ nombre: 'text', RUT: 'text', direccion: 'text', visita: 'text' });

const Cliente = mongoose.model("Cliente", schema);

module.exports = Cliente;