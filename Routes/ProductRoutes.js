const express = require('express');
const { createProduct, getAllProduct, UpdateProduct, deleteProduct, getProductInventory } = require('../controllers/ProductController')
const app = express();

const router = express.Router()

//Routes
router.post('/products', createProduct);
router.get('/products/:productId/inventory', getProductInventory);
router.get('/products', getAllProduct);
router.patch('/products/:productId', UpdateProduct);
router.delete('/product/:productId', deleteProduct);


module.exports=router 
