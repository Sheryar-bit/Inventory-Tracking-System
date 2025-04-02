const express = require('express');
const { ProductRouter } = require('./Routes/ProductRoutes');
const { StockMovementRouter } = require('./Routes/StockMovmRoutes');
const { storeRouter } = require('./Routes/StoreRoutes');
require('dotenv').config()


const app = express();

//MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//chk server
app.get('/', function(req, res) {
    res.send('Working!')
});

//API
app.use('/api', ProductRouter)
app.use('/api', StockMovementRouter)
app.use('/api', storeRouter)


//server Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`);
});