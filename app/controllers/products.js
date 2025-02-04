const { Producto } = require("../models/product");


const addProduct = async (req, res) => { 
    const { body } = req;
      const product = await Producto.create({
        name: body.nombre,
        note: body.nota,
        photo_pid: body.pid,
        cliente_id: body.cid
  });
      res.status(201).send({status: 201, product});
}


const editProduct = async (req, res) => {
  let { body } = req;
  console.log(body);
  const producto = await Producto.findOneAndUpdate(
    { _id: body._id },
    {
        name: body.nombre,
        note: body.nota,
    }
  );
  console.log("producto:", producto)
  if (producto) { 
    res.status(200).send({status: 200, producto: body});
  } else {
    res.status(404).send({status: 404, text: "No se encontró el producto"});
  }
};

const getProducts = async (req, res) => {
    const { body } = req;
    console.log(body)
  productos = await Producto.find({cliente_id: body.cid});
  if (!productos) {
    res.status(404).send({status: 404, text: "Este cliente no tiene productos!"} );
  } else {
    res.status(200).send({status:200, productos});
  }
};


const getProduct = async (req, res) => {
  const { body } = req;
  try {
    const producto = await Producto.findOne({ _id: body.id });
    if (producto){
      res.status(200).send({producto, status: 200});
    } else {
      res.status(404).send({status: 404, text: "Cliente no existente"})
    }
  } catch (e) {
    httpError(res, e);
  }
}
const deleteProduct = async (req, res) => {
  const { body } = req;
  const del = await Producto.findOneAndRemove({ _id: body._id });
  res.status(200).send(del);
};

module.exports = {
  addProduct,
  editProduct,
  getProducts,
  getProduct, 
  deleteProduct
}
