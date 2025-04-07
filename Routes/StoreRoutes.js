const express = require('express');
const { addstore, viewstores, getsinglestore, getStoreStock, updatestore, deletestore } = require('../controllers/StoreController')
const app = express();


const router = express.Router()

router.post('/store', addstore);
router.get('/stores', viewstores);
router.get('/stores/:storeId', getsinglestore);
router.get('/stores/:storeId/stock', getStoreStock);
router.patch('/stores/:storeId', updatestore);
router.delete('/store/:storeId', deletestore)



module.exports=router