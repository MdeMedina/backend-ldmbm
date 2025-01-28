const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const createTrans = () => {
  const transport = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    auth: {
      user: "cotizacion@losdelmar.cl",
      pass: "Ldm.2025",
    },
  });
  return transport;
};

function getFileByFilename(filename) {
  console.log(filename);
const filePath = path.join("/tmp", "uploads", filename);
  console.log("filepath:", filePath)
  try {
    const file = fs.readFileSync(filePath);
    return file;
  } catch (error) {
    return error;
  }
}

const sendMail = async (filename, correo, nota, corr, nCliente) => {
  console.log("corr", corr)
  console.log("nCliente", nCliente)
  let str;
  if (!nota) {
    str = "Envio de pdf adjunto desde Los del mar BUDGET APP";
  } else {
    str = nota;
  }
  const transporter = createTrans();
  let pdfContent = getFileByFilename(filename);
  console.log("contenido: ", pdfContent)
  const mailOptions = {
    from: "cotizacion@losdelmar.cl", // Reemplaza con tu dirección de correo electrónico
    to: correo, // Reemplaza con la dirección de correo del destinatario
    subject: `Pedido n°${corr} ${nCliente}`,
    text: str,
    attachments: [
      {
        filename: filename, // Nombre del archivo adjunto que se mostrará en el correo
        content: pdfContent, // Contenido del PDF que se enviará
      },
    ],
  };
  // Envía el correo electrónico
  let prueba = transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error", error)
      return def;
    } else {
      console.log("info: ", info.response)
      return def;
    }
  });

  console.log("aqui, en la prueba", prueba)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
};

exports.sendMail = (filename, correo, nota, corr, nCliente) =>
  sendMail(filename, correo, nota, corr, nCliente);
