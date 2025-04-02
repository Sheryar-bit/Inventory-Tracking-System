const express = require('express');
const { addstore, viewstores, getsinglestore } = require('../controllers/StoreController')
const app = express();


const storeRouter = express.Router()

storeRouter.post('/store', addstore);
storeRouter.get('/stores', viewstores);
storeRouter.get('/stores/:id', getsinglestore);



module.exports={
    storeRouter
}