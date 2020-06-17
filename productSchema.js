const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//product schema for monogDB
let Product =new Schema({
    productName:{
        type: String
    },
    productDescription:{
        type: String
    },
    productPrice:{
        type: Number
    }
});

module.exports = mongoose.model('Product', Product);