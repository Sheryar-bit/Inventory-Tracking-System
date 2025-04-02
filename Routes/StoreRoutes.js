const express = require('express');
const { addstore, viewstores, getsinglestore, getStoreStock } = require('../controllers/StoreController')
const app = express();


const storeRouter = express.Router()

storeRouter.post('/store', addstore);
storeRouter.get('/stores', viewstores);
storeRouter.get('/stores/:storeId', getsinglestore);
storeRouter.get('/stores/:storeId/stock', getStoreStock);



module.exports={
    storeRouter
}