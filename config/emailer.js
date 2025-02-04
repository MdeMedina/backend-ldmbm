const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const { authenticate } = require("./auth"); // Asegúrate de tener autenticación configurada

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

async function getFileByFilename(filename) {
  try {
    console.log("Buscando archivo:", filename);
    const auth = await authenticate();
    const driveClient = google.drive({ version: "v3", auth });

    // Buscar archivo por nombre
    const response = await driveClient.files.list({
      q: `name='${filename}'`,
      fields: "files(id, name)"
    });

    if (!response.data.files.length) {
      throw new Error("Archivo no encontrado");
    }

    const fileId = response.data.files[0].id;
    console.log("Archivo encontrado, ID:", fileId);

    // Obtener contenido del archivo
    const fileResponse = await driveClient.files.get({
      fileId,
      alt: "media"
    }, { responseType: "arraybuffer" });

    console.log("Archivo obtenido correctamente");

    // Convertir el contenido a base64
    return Buffer.from(fileResponse.data);
  } catch (error) {
    console.error("Error obteniendo el archivo:", error);
    return null;
  }
}

const sendMail = async (filename, pdfBase64, correo, nota, corr, nCliente) => {
  console.log("corr", corr);
  console.log("nCliente", nCliente);

  let str;
  if (!nota) {
    str = "Envio de pdf adjunto desde Los del mar BUDGET APP";
  } else {
    str = nota;
  }

  // Si no se recibe el PDF, obtenerlo desde el sistema (en base64)
  if (!pdfBase64) pdfBase64 = await getFileByFilename(filename); // Asumimos que getFileByFilename también devuelve el PDF en base64

  const transporter = createTrans(); // Crear el transportador de correo


  const mailOptions = {
    from: "cotizacion@losdelmar.cl", // Dirección de correo del remitente
    to: correo, // Dirección de correo del destinatario
    subject: `Pedido n°${corr} ${nCliente}`, // Asunto del correo
    text: str, // Cuerpo del correo (texto)
    attachments: [
      {
        filename: filename, // Nombre del archivo adjunto
        content: pdfBase64, // PDF en base64
        encoding: 'base64', // Especificar que el contenido está en base64
      },
    ],
  };

  // Envía el correo electrónico
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("info: ", info.response);
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};


exports.sendMail = (filename, pdf, correo, nota, corr, nCliente) =>
  sendMail(filename, pdf, correo, nota, corr, nCliente);
