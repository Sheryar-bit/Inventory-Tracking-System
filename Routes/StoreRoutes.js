const express = require('express');
const { addstore, viewstores, getsinglestore, getStoreStock, updatestore, deletestore } = require('../controllers/StoreController')
const authenticate = require('../middleware/Auth'); 
const app = express();


const router = express.Router()

router.post('/store', addstore);
router.get('/stores', viewstores);
router.get('/stores/:storeId', getsinglestore);
router.get('/stores/:storeId/stock', getStoreStock);
router.patch('/stores/:storeId', authenticate ,updatestore);
router.delete('/store/:storeId', authenticate,deletestore)



module.exports=router