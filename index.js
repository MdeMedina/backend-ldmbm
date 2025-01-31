require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const { dbConnect } = require("./config/mongo");
const { bodyParser } = require("body-parser");
const { addClient } = require('./sseManager');
const path = require('path');
const fs = require('fs');
const cors = require("cors");
const PORT = process.env.PORT;

const winston = require('winston');
dbConnect();

const app = express();
let server = http.createServer(app);



app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: 'https://cotizacion.losdelmar.cl', // Reemplaza con el origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/clients", require("./app/routes/clients"));
app.use(express.static("app"));

app.use("/woo", require("./app/routes/woocommerce"));
app.use(express.static("app"));

app.use("/products", require("./app/routes/productos"));
app.use(express.static("app"));

app.use("/uproducts", require("./app/routes/usageProducts"));
app.use(express.static("app"));

app.use("/users", require("./app/routes/users"));
app.use(express.static("app"));

app.use("/photos", require("./app/routes/photos"));
app.use(express.static("app"));

app.use("/upload", require("./app/routes/upload"));
app.use(express.static("app"));


app.use("/cotizacion", require("./app/routes/budget"));
app.use(express.static("app"));

+


server.listen(PORT, '0.0.0.0', () => {
  console.log("listening in port " + PORT);
});
