const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt'); 
const errorHandler = require('./helpers/error-handler'); 
require('dotenv').config();

// Import routes
const categoriesRoutes = require('./routers/categories'); 
const productsRoutes = require('./routers/products');
const userRouter = require('./routers/users'); 
const ordersRoutes = require('./routers/orders');

const app = express();
const api = process.env.API_URL;

// Middleware setup
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Middleware functions (ensure these are properly implemented)
app.use(authJwt); 
app.use(errorHandler); 

// Static file serving
app.use('/public/uploads', express.static(__dirname + '/public/uploads/'));

// Route setup
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, ordersRoutes);

// Database connection
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'ecommerce-database'
}).then(() => {
    console.log('Database connection is ready');
}).catch((err) => {
    console.log('Database connection error:', err);
});

// Start server
app.listen(6000, () => {
    // console.log("The server is running on http://localhost:7000");
    console.log(`API URL: ${api}`);
});

