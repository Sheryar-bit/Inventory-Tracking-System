const express = require('express');
const {} = require('./StockMovmRoutes');
const { RecordStockMovement, GetProductInventory } = require('../controllers/StockMovmController');

const app = express()
const StockMovementRouter = express.Router()

StockMovementRouter.post('/stock',RecordStockMovement );
StockMovementRouter.get('/products/:productId/inventory', GetProductInventory);

module.exports={
    StockMovementRouter
}