const Cotizacion = require("../models/budget");

const addCotizacion = async (req, res) => {
  const { body } = req;
  console.log(body)
  try {
      const cotizacion = await Cotizacion.create({
          cliente_id: body.cliente._id,
          nom_cliente: body.cliente.nombre,
          productos: body.productos,
          corr: body.Corr,
          vendedor_id: body.vendedor.email,
          nom_vendedor: body.vendedor.nombre,
          observaciones: body.observaciones,
          total: body.total,
          fecha: body.fecha,
          formaPago: body.formaPago,
          iva: body.iva,
          totalIva: body.totalIva,
          filename: body.filename
      });
      res.status(201).send({status: 201, cotizacion});
    
  } catch (e) {
   console.log(e)
  }
};



const deleteCotizacion = async (req, res) => {
  console.log("Llegue al delete client");
  const { body } = req;
  const del = await Cotizacion.findOneAndRemove({ _id: body._id });
  res.status(200).send(del);
};



const getCotizaciones = async (req, res) => {
    const { body } = req;
    console.log(body)
    const skip = (body.page - 1) * 10;
    const totalCotizaciones = await Cotizacion.countDocuments({  
  filename: { $regex: body.filename, $options: 'i' },
  nom_cliente: { $regex: body.cliente, $options: 'i' },
  nom_vendedor: { $regex: body.vendedor, $options: 'i' }, 
});

const cotizaciones = await Cotizacion.find({ 
  filename: { $regex: body.filename, $options: 'i' },
  nom_cliente: { $regex: body.cliente, $options: 'i' },
  nom_vendedor: { $regex: body.vendedor, $options: 'i' },
}).limit(10).sort({ corr: -1 }).skip(skip);  


  if (!cotizaciones) {
    res.status(404).send("porfavor cree algunas cotizaciones!");
  } else {
    res.status(200).send({cotizaciones, total: totalCotizaciones});
  }
};



const getUltimaCotizacion = async (req, res) => {
  try {
    // Ordenar por _id en orden descendente para obtener la última cotización creada
    const cotizacion = await Cotizacion.findOne()
      .sort({ _id: -1 }) // Más reciente primero
      .exec();

    if (cotizacion) {
      res.status(200).send({ cotizacion, status: 200 });
    } else {
      res.status(404).send({ status: 404, text: "No existen cotizaciones" });
    }
  } catch (e) {
    httpError(res, e);
  }
};


const getCotizacion = async (req, res) => {
  const { body } = req;
  try {
    const cotizacion = await Cotizacion.findOne({ _id: body._id });
    console.log(cotizacion);
    
    if (cotizacion){
      res.status(200).send({cotizacion, status: 200});
    } else {
      res.status(404).send({status: 404, text: "Cliente no existente"})
    }
  } catch (e) {
    httpError(res, e);
  }
}

module.exports = {addCotizacion, getCotizaciones, getCotizacion, deleteCotizacion, getUltimaCotizacion};