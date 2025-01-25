const cloudinary = require('cloudinary').v2;
const express = require(`express`);
const crypto = require(`crypto`)
const CLD_SECRET = process.env.CDL_SECRET_API
const CLD_API_KEY = process.env.CDL_API_KEY
const CLD_CLOUD_NAME= process.env.CDL_CLOUD_NAME
const router = express.Router();

// Configura tu cuenta de Cloudinary
cloudinary.config({
  cloud_name: 'dzktjoix0',
  api_key: '361975931316424',
  api_secret: CLD_SECRET,
});

router.post('/generate-signature', (req, res) => {
  const { folder, upload_preset } = req.body;

  // Parámetros requeridos para la firma
  const paramsToSign = {
    folder,
    upload_preset,
    timestamp: Math.floor(Date.now() / 1000), // Timestamp actual
  };

  // Generar firma
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    CLD_SECRET// Tu API Secret
  );

  console.log(CLD_CLOUD_NAME)
  console.log(CLD_API_KEY)
   console.log(CLD_SECRET)

  res.json({
    signature,
    timestamp: paramsToSign.timestamp,
    cloud_name: CLD_CLOUD_NAME,
    api_key: CLD_API_KEY,
  });
});


router.post('/generate-signature-edit', (req, res) => {
  const { upload_preset, public_id } = req.body;

  // Parámetros requeridos para la firma
  const paramsToSign = {
    upload_preset,
    public_id,
    timestamp: Math.floor(Date.now() / 1000), // Timestamp actual
  };

  // Generar firma
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    CLD_SECRET// Tu API Secret
  );

  console.log(CLD_CLOUD_NAME)
  console.log(CLD_API_KEY)
   console.log(CLD_SECRET)

  res.json({
    signature,
    timestamp: paramsToSign.timestamp,
    cloud_name: CLD_CLOUD_NAME,
    api_key: CLD_API_KEY,
  });
});

router.post("/generate-signature-delete", (req, res) => {
  const { public_id } = req.body;

  const timestamp = Math.floor(Date.now() / 1000);

  // Genera la firma para la solicitud de eliminación
  const stringToSign = `public_id=${public_id}&timestamp=${timestamp}${cloudinary.config().api_secret}`;
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  res.json({
    signature,
    timestamp,
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key,
  });
});

module.exports = router;