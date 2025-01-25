const Cliente = require("../models/cliente");

const addClient = async (req, res) => {
  const { body } = req;
  try {
    console.log("Entre al addClient")
    const isAccount = await Cliente.findOne({ RUT: body.RUT });
    if (isAccount) {
      res.status(403).send({status: 403, text: "Esa cuenta existe"});
    } else {
      const client = await Cliente.create({
          nombre: body.nombre,
          RUT: body.RUT,
          correo: body.correo ? body.correo : "",
          direccion: body.direccion ?  body.direccion : "",
          contacto: body.contacto ? body.contacto : "",
          visita: body.visita ? body.visita : "",
          Observaciones: body.observacion? body.observacion : "",
      });
      res.status(201).send({status: 201, client});
    }
  } catch (e) {
    httpError(res, e);
  }
};


const editClient = async (req, res) => {
  let { body } = req;
  console.log(body);
  const cliente = await Cliente.findOneAndUpdate(
    { _id: body._id },
    {
          nombre: body.nombre,
          RUT: body.RUT,
          correo: body.correo ? body.correo : "",
          direccion: body.direccion ?  body.direccion : "",
          contacto: body.contacto ? body.contacto : "",
          visita: body.visita ? body.visita : "",
          Observaciones: body.observacion? body.observacion : "",
    }
  );
  body.Observaciones = body.observacion
  console.log(cliente)
  if (cliente) { 
    res.status(200).send({status: 200, cliente: body});
  } else {
    res.status(404).send({status: 404, text: "No se encontró el cliente"});
  }
};


const deleteCliente = async (req, res) => {
  console.log("Llegue al delete client");
  
  const { body } = req;
  const del = await Cliente.findOneAndRemove({ _id: body._id });
  res.status(200).send(del);
};

function filterByRegex(inputString, pattern) {
    try {
        const regex = new RegExp(pattern, 'i'); // Crea la expresión regular con el patrón proporcionado
        return inputString
            .split('') // Divide el string en caracteres individuales
            .filter(char => regex.test(char)) // Filtra los caracteres que coinciden con el regex
            .join(''); // Junta los caracteres filtrados de vuelta en un string
    } catch (error) {
        console.error('Error en la expresión regular:', error);
        return ''; // Retorna un string vacío si hay un error en el patrón
    }
}

const getClients = async (req, res) => {
    const { body } = req;
    let clientes;
    let total;
    text = filterByRegex(body.text, '[a-zA-Z0-9]');
    const skip = body.page ? (body.page - 1) * 10 : 0;
const fields = Object.keys(Cliente.schema.paths).filter(
    (key) => !['_id', '__v'].includes(key) // Excluir campos no relevantes
);
const regex = new RegExp(text, 'i'); // 'i' para búsqueda insensible a mayúsculas
const orConditions = fields.map((field) => ({ [field]: regex }));
if (body.text) {
  clientes = await Cliente.find({ $or: orConditions }).limit(10).skip(skip); 
  total = await Cliente.countDocuments({ $or: orConditions })
} else {
  clientes = await Cliente.find({}).limit(10).skip(skip);
  total = await Cliente.countDocuments({})
}
  if (!clientes) {
    res.status(404).send("porfavor cree algunos clientes!");
  } else {
    res.status(200).send({clientes, total});
  }
};


const getClient = async (req, res) => {
  const { body } = req;
  try {
    const cliente = await Cliente.findOne({ _id: body.id });
    if (cliente){
      res.status(200).send({cliente, status: 200});
    } else {
      res.status(404).send({status: 404, text: "Cliente no existente"})
    }
  } catch (e) {
    httpError(res, e);
  }
}

module.exports = {addClient, getClients, getClient, editClient, deleteCliente};