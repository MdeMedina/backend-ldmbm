const mongoose = require("mongoose");

const Fecha = mongoose.model("Fecha", {
  fecha: { type: String, required: true },
  nombre: { type: String, required: true }, 
  estado: { type: String, required: true },
});

module.exports = Fecha;
