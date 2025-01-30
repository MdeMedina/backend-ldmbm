const { google } = require("googleapis");
const { Readable } = require("stream");
const mime = require("mime-types");


const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials.json",
  scopes: SCOPES,
});
const drive = google.drive({ version: "v3", auth });

async function uploadFile(fileBase64, fileName, folderId = null) {
  console.log("Entre en uF");
  
  // Decodificar el archivo base64
  const buffer = Buffer.from(fileBase64, 'base64');
  
  // Obtener el tipo MIME del archivo
  const mimeType = mime.lookup(fileName) || "application/octet-stream";
  const stream = Readable.from(buffer);

  try {
    // Buscar si el archivo ya existe
    const existingFiles = await drive.files.list({
      q: `name='${fileName}' and '${folderId || "root"}' in parents and trashed=false`,
      fields: "files(id)"
    });
console.log("archivo, existente",existingFiles.data.files);

    if (existingFiles.data.files.length > 0) {
      const fileId = existingFiles.data.files[0].id;
      console.log(`Archivo existente encontrado: ${fileId}, reemplazando...`);
      
      // Reemplazar el archivo existente
      await drive.files.update({
        fileId,
        media: { mimeType, body: stream },
      });
      console.log("Archivo reemplazado exitosamente.");
    } else {
      console.log("No se encontró el archivo, subiendo uno nuevo...");
      
      // Subir un nuevo archivo
      await drive.files.create({
        requestBody: {
          name: fileName,
          parents: folderId ? [folderId] : [],
        },
        media: { mimeType, body: stream },
      });
      console.log("Archivo subido exitosamente.");
    }
  } catch (error) {
    console.error("Error al subir el archivo:", error);
  }
  
}

module.exports = { uploadFile };