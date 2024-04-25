
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler =require('./helpers/error-handler');


// getting the product file in the app,js file 
const Product = require('./models/product');
//ends here


//connecting with the .env file
require('dotenv/config');
const api = process.env.API_URL;
const productsRouter = require('./routers/products');
const authJwt = require('./helpers/jwt');
//ends here

//
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`,productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//

app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt); 
app.use(errorHandler);

//end of middleware

//Database connection

mongoose.connect( ,{
    userNewParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'


}).then(()=>{
    console.log('Database connection is ready');
}).catch((err)=>{
    console.log(err);
})

app.listen(7000, () => {
    console.log("The server is running on http://localhost:7000");
    console.log(api); 
});

