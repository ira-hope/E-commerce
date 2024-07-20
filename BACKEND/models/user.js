const mongoose = require('mongoose');
const { use } = require('./product');

 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: false,
    },
    street: {
        type: String,
        required: true,
    },
    apartment: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    }
 });

 userSchema.virtual('id').get(function (){
    return this._id.toHexString();
});
userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
  