const mongoose = require("mongoose");

const Producto = mongoose.model("Producto", {
  name: String,
  note: String,
  photo_pid: String,
  cliente_id: String
});

module.exports = { Producto };