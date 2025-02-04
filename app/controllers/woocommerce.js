const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: "https://losdelmar.cl", // Cambia esto por la URL de tu tienda
  consumerKey: "ck_caafa1d768f388d1bca49da3931406783f3d2e82", // Reemplaza con tu Consumer Key
  consumerSecret: "cs_b993a28bae1136b55ee344ab9a780d3f4aa8c857", // Reemplaza con tu Consumer Secret
  version: "wc/v3", // Asegúrate de usar la versión correcta de la API
});

const fetchProducts = async () => {
  try {
    const response = await api.get("products", {
      per_page: 20, // Número de productos a traer por página
    });
    console.log("Productos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al traer productos:", error.response.data);
    throw error;
  }
};

const fetchFilteredProducts = async (req, res) => {
  const {body} = req
  try {
    const response = await api.get("products", {
      per_page: 10,
      orderby: "price",
      order: "asc", // Orden ascendente
      search: body.data, // Buscar productos que contengan "camiseta"
    });
    console.log("Productos filtrados:", response.data);
    res.status(200).json(response.data)
  } catch (error) {
     res.send(401)
  }
};


module.exports = {
  fetchProducts,
  fetchFilteredProducts
}


