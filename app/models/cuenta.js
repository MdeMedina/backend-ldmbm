const mongoose = require("mongoose");

const Cuenta = mongoose.model("Cuenta", {
  value: { type: String, required: true },
  label: { type: String, required: true },
  color: { type: String, required: true },
  saldo: { type: Boolean, required: true },
});

module.exports = Cuenta;
