const  express = require('express');
const  ProductRouter  = require('./Routes/ProductRoutes');
const  StockMovementRouter  = require('./Routes/StockMovmRoutes');
const  storeRouter  = require('./Routes/StoreRoutes');
const  authRouter = require('./Routes/AuthRouter')
const  authenticate = require('./middleware/Auth');
const { globalLimiter, authLimiter } = require('./middleware/RateLimiter')
require('dotenv').config()


const app = express();

//MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//chk server
app.get('/', function(req, res) {
    res.send('Working!')
});

//ROUTES
app.use('/api', authLimiter, authRouter);
app.use('/api', ProductRouter)
app.use('/api', StockMovementRouter)
app.use('/api', authenticate, storeRouter)

//Global Rate Limetr for all the routes
app.use(globalLimiter);



//server Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`);
});