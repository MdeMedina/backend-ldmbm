const express = require(`express`);
const {
addCotizacion,
getCotizaciones,
deleteCotizacion,
getCotizacion,
getUltimaCotizacion
} = require("../controllers/budget");
const router = express.Router();

router.post("/", getCotizaciones);
router.post("/add", addCotizacion);
router.post("/ultima", getUltimaCotizacion);
router.post("/get", getCotizacion);
router.delete("/delete", deleteCotizacion);


module.exports = router;
