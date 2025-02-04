const { google } = require("googleapis");

async function authenticate() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./credentials.json", // Asegúrate de tener este archivo
      scopes: [
        "https://www.googleapis.com/auth/drive", // Permiso para leer, modificar y escribir archivos
        "https://www.googleapis.com/auth/drive.readonly"
      ],
    });

    console.log("Autenticación exitosa");
    return await auth.getClient();
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
}

module.exports = { authenticate };