const mongoose = require('mongoose'); 
const subcategory = require('./subcategory');

var gallerySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
})

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    gallery: [gallerySchema],
    price: {
        type: String,
        required: true
    },
    reference: {
        type: String,
    },
    quantity: {
        type: String,
      
    },
    subcategory : {
        type: mongoose.Types.ObjectId,
        ref: "subcategory",
    },
    // provider : {
    //     type: mongoose.Types.ObjectId,
    //     ref: "provider"
    // },
    // orders : [{
    //     type: mongoose.Types.ObjectId,
    //     ref: "order"
    // }]
});

//Export the model
module.exports = mongoose.model('produits', productSchema);
