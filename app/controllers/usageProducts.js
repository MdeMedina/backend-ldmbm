const { UProduct } = require("../models/usageProduct");


const addProduct = async (req, res) => { 
    const { body } = req;
    console.log(body);
      const product = await UProduct.create({
        name: body.nombre,
        note: body.nota,
        price: body.precio,
  });
      res.status(201).send({status: 201, product});
}


const editProduct = async (req, res) => {
  let { body } = req;
  console.log(body);
  const producto = await UProduct.findOneAndUpdate(
    { _id: body._id },
    {
        name: body.nombre,
        note: body.nota,
        price: body.precio,
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
    let productos;
    let total;
    const skip = body.page ? (body.page - 1) * 10 : 0;
    if(body.data) {
      productos = await UProduct.find({ 
      name: { $regex: body.data, $options: 'i' } 
    }).limit(10).skip(skip);
      total = await UProduct.countDocuments({name: { $regex: body.data, $options: 'i' }});
    }
else {
  productos = await UProduct.find({ 
  name: { $regex: body.data, $options: 'i' } 
}).limit(10).skip(skip);;
      total = await UProduct.countDocuments({name: { $regex: body.data, $options: 'i' }});
}
  if (!productos) {
    res.status(404).send({status: 404, text: "Este cliente no tiene productos!"} );
  } else {
    res.status(200).send({status:200, productos, total});
  }
};


const getProduct = async (req, res) => {
  const { body } = req;
  try {
    const producto = await UProduct.findOne({ _id: body.id });
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
  const del = await UProduct.findOneAndRemove({ _id: body._id });
  res.status(200).send(del);
};

module.exports = {
  addProduct,
  editProduct,
  getProducts,
  getProduct, 
  deleteProduct
}
