const express = require('express');
const { createProduct, getAllProduct, UpdateProduct, deleteProduct, getProductInventory } = require('../controllers/ProductController')
const app = express();

const ProductRouter = express.Router()

//Routes
ProductRouter.post('/product', createProduct);
ProductRouter.get('/products/:productId/inventory', getProductInventory);
ProductRouter.get('/products', getAllProduct);
ProductRouter.patch('/products/:productId', UpdateProduct);
ProductRouter.delete('/product/:productId', deleteProduct);


module.exports={ ProductRouter }
