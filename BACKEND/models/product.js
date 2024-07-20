const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    description:{
        type: String,
        required: true

    },
    richDescription:{
        type: String,
        default: ''

    },
    image :{
        type: String,
        default: ''

    },

    images:[{
        type: String,
    
    }],

    brand :{
        type: String,
        default: ''

    },

    price:{
        type: Number,
        default: 0

    },
    cateory:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock:{
        type: Number,
        required: true,
        min: 0,
        max: 255

    },

    rating:{
        type: Number,
        default: 0

    },
    numReviews:{
        type: Number,
        default: 0

    },

    isFeatured:{
        type: Number,
        default: false

    }, 
    dateCreated:{
        type: Date,
        default: Date.now

    },



});

productSchema.virtual('id').get(function (){
    return this._id.toHexString();
});
productSchema.set('toJSON', {
    virtuals: true,
});




// the model is exported for other files to find them 
exports.Product = mongoose.model('Product', productSchema);