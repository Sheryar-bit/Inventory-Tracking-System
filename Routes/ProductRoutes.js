const express = require('express');
const { createProduct, getProductbyID, getAllProduct, UpdateProduct, deleteProduct } = require('../controllers/ProductController')
const app = express();

const ProductRouter = express.Router()

//Routes
ProductRouter.post('/product', createProduct);
ProductRouter.get('/product/:id', getProductbyID);
ProductRouter.get('/products', getAllProduct);
ProductRouter.post('/product/:id', UpdateProduct);
ProductRouter.delete('/product/:id', deleteProduct);


module.exports={ ProductRouter }
