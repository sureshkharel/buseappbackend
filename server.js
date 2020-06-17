require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = express.Router();
const PORT = process.env.PORT || 4000;
const connectionString = process.env.CS;
//load the mongodb schema
let Product =require('./productSchema');
//for cross origin police
app.use(cors());
//to parse the json file
app.use(bodyParser.json());

//connecting the monogdb collection
mongoose.connect(connectionString, {useUnifiedTopology: true, 
    useNewUrlParser: true});

const connection = mongoose.connection;
connection.once('open', function(){ 
    console.log("connection established");
})

productRoutes.route('/').get(function(req, res){
    Product.find(function(err, product){
        if(err) {
            console.log(err);
        }
        else{
            res.json(product);
        }
    });
});

//search the product with respect to id
productRoutes.route('/:id').get(function(req, res){
    let id = req.params.id
    Product.findById(id, function(err, product){
        res.json(product);
    });
});

//add the new product
productRoutes.route('/add').post(function(req, res){
    let product = new Product(req.body);
    product.save()
    .then(product => {
        res.status(200).json('product added successfully');
    })
    .catch(err => {
        res.status(400).send('adding product failed');
    });    
});

//update the existing product
productRoutes.route('/update/:id').post(function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(!product)
        res.status(400).send('data is not found');
    else
        product.productName = req.body.productName;
        product.productDescription = req.body.productDescription;
        product.productPrice = req.body.productPrice;
    
    product.save()
    .then(product => {
        res.json('product updated successfully');
    })
    .catch(err => {
        res.status(400).send('update product failed');
    });

    });
});
app.use('/', function (req, res) {
    res.status(200).send("Hello this is API");
  });
// api hit point
app.use('/api/products', productRoutes);
app.listen(PORT, function(){
    console.log("server is running on Port: " + PORT);
});