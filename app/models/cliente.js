const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  RUT: { type: String},
  tipo: { type: String, required: true },
  correo: { type: String },
  direccion: { type: String},
  contacto: { type: String},
  visita: { type: String },
  Observaciones: { type: String },
  giro: { type: String },
    // otros campos...
});

schema.index({ nombre: 'text', RUT: 'text', direccion: 'text', visita: 'text' });

const Cliente = mongoose.model("Cliente", schema);

module.exports = Cliente;