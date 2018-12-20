const express = require('express');
const app = express();
//Morgan invokes the "next" function, allowing to continue on.
const morgan = require("morgan");
const bodyParser = require("body-parser");
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const mongoose = require('mongoose');

mongoose.connect('mongodb://blakeg:!galbavy1!@node-rest-shop-shard-00-00-b95kj.mongodb.net:27017,node-rest-shop-shard-00-01-b95kj.mongodb.net:27017,node-rest-shop-shard-00-02-b95kj.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true')
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());




//PREVENTING CORS ERRORS
//Creating Headers for response
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//Error Handling
app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});

app.use((error,req,res,next) =>{
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
