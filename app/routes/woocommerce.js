const express = require("express");
const router = express.Router();
const { fetchFilteredProducts, fetchProducts} = require("../controllers/woocommerce");

router.get("/", async (req, res) => {
try {
  let productos = await fetchProducts()
  res.send(200).send(productos)

} catch (e) {
  res.send(401)
}
});

router.post("/filter", fetchFilteredProducts);

module.exports = router;
