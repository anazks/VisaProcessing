const mongoose = require('mongoose');


const boatModel = new mongoose.Schema({
    Boatname: {
        type: String,
        required: [true, "Must Provide name"],
    }, 
    BoatNumber: {
        type: String,
        required: [true, "Must Provide email"],
    }
})

module.exports = mongoose.model('boatModel', boatModel);