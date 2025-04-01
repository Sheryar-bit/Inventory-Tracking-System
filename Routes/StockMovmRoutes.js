const express = require('express');
const {} = require('./StockMovmRoutes');
const { RecordStockMovement, GetProductInventory } = require('../controllers/StockMovmController');

const app = express()
const StockMovementRouter = express.Router()

StockMovementRouter.post('/stock',RecordStockMovement );
StockMovementRouter.get('/inventory/:id', GetProductInventory);

module.exports={
    StockMovementRouter
}