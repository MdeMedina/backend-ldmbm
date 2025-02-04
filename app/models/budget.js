const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  cliente_id: { type: String, required: true },
  nom_cliente: {type: String, required: true},
  productos: { type: Array, required: true },
  corr: { type: Number, required: true },
  vendedor_id: { type: String, required: true },
  nom_vendedor: { type: String, required: true },
  observaciones: { type: String},
  total: { type: Number , required: true},
  fecha: { type: String , required: true},
  formaPago: { type: Number },
  iva: { type: Number, required: true },
  totalIva: { type: Number, required: true },
  filename: {type: String}
});

schema.index({  nom_cliente: 'text',
  corr: 'text',
  nom_vendedor: 'text',
  fecha: 'text',
});

const Cotizacion = mongoose.model("Cotizacion", schema);

module.exports = Cotizacion;