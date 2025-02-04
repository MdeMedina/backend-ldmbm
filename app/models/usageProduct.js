const mongoose = require("mongoose");

const UProduct = mongoose.model("UProduct", {
  name: String,
  note: String,
  price: String,
});

module.exports = { UProduct };