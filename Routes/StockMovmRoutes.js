const express = require('express');
const { RecordStockMovement, GetProductInventory } = require('../controllers/StockMovmController');
const authenticate = require('../middleware/Auth'); 

const router = express.Router(); 

router.post('/stock', authenticate, RecordStockMovement);
router.get('/products/:productId/inventory', GetProductInventory);

module.exports = router; 