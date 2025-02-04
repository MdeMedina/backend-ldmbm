const express = require("express");
const {uploadFile} = require("../controllers/upload");
const router = express.Router();
const emailer = require("../../config/emailer");

router.post("/", async (req, res) => {
  const {body} = req;
  const {name, pdf, correos, nota, Corr, nCliente} = body;
  console.log({name, correos, nota, Corr, nCliente});

  try {
    // Esperar a que todas las promesas de envío de correo se resuelvan
    let mails = await Promise.all(correos.map(async (correo) => {
      const status = await emailer.sendMail(name, pdf, correo, nota, Corr, nCliente);
      return {status, correo};
    }));

    // Una vez que todos los correos se enviaron, se envía la respuesta
    res.status(200).json({mails});
  } catch (error) {
    console.error("Error al enviar los correos:", error);
    res.status(500).json({error: "Hubo un error al enviar los correos"});
  }
});
router.post("/sendMail", async (req, res) => {
  const { body } = req;
  const { mailOptions } = body;
  console.log(mailOptions)
  const filename = mailOptions.filename;
  const email = mailOptions.email;
  const nota = mailOptions.nota;
  const corr = mailOptions.corr;
  const nCliente = mailOptions.nCliente;
  console.log("nCliente route", nCliente)

  let send = await emailer.sendMail(filename, undefined, email, nota, corr, nCliente);

  console.log(send);
  res.send(send);
});

module.exports = router;
