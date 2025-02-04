const express = require(`express`);
const {
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct
} = require("../controllers/products");
const router = express.Router();

router.post("/", getProducts);
router.post("/add", addProduct);
router.post("/get", getProduct);
router.put("/edit", editProduct);
router.delete("/delete", deleteProduct);


module.exports = router;