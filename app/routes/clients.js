const express = require(`express`);
const {
  addClient,
  getClients,
  getClient,
  editClient,
  deleteCliente
} = require("../controllers/clients");
const router = express.Router();

router.post("/", getClients);
router.post("/add", addClient);
router.post("/get", getClient);
router.put("/edit", editClient);
router.delete("/delete", deleteCliente);


module.exports = router;
