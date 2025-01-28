const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cambiar la carpeta de almacenamiento a /tmp/uploads
const uploadDir = path.join("/tmp", "uploads");

// Asegurarse de que el directorio exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Ruta asegurada en /tmp/uploads
  },
  filename: function (req, file, cb) {
    // Reemplazar caracteres especiales en el nombre del archivo
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, sanitizedFilename);
  },
});

const upload = multer({ storage: storage });

// Función para obtener un archivo por nombre de archivo
function getFileByFilename(filename) {
  const filePath = path.join(uploadDir, filename);
  try {
    const file = fs.readFileSync(filePath);
    return file;
  } catch (error) {
    console.error("Error al leer el archivo:", error.message);
    return null;
  }
}

// Exportar funciones
exports.getFileByFilename = (filename) => {
  return getFileByFilename(filename);
};

exports.upload = upload.single("myFile");

exports.uploadFile = (req, res) => {
  // Verificar si el archivo fue recibido correctamente
  if (req.file) {
    console.log("Archivo recibido:", req.file);
    res.send({ data: req.file.filename });
  } else {
    console.error("No se recibió ningún archivo");
    res.status(400).send({ error: "No se pudo subir el archivo." });
  }
};
