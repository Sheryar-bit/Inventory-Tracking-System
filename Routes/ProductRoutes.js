const express = require('express');
const { createProduct, getAllProduct, UpdateProduct, deleteProduct, getProductInventory } = require('../controllers/ProductController')
const authenticate = require('../middleware/Auth')
const app = express();

const router = express.Router()

//Routes
router.post('/products', createProduct);
router.get('/products/:productId/inventory', getProductInventory);
router.get('/products', getAllProduct);
router.patch('/products/:productId', authenticate, UpdateProduct);
router.delete('/product/:productId', authenticate,deleteProduct);


module.exports=router 
