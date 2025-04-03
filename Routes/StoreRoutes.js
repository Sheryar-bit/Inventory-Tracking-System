const express = require('express');
const { addstore, viewstores, getsinglestore, getStoreStock } = require('../controllers/StoreController')
const app = express();


const router = express.Router()

router.post('/store', addstore);
router.get('/stores', viewstores);
router.get('/stores/:storeId', getsinglestore);
router.get('/stores/:storeId/stock', getStoreStock);



module.exports=router