const mongoose = require('mongoose');


const routeModel = new mongoose.Schema({
    from: {
        type: String,
        required: [true, "Must Provide name"],
    }, 
    to: {
        type: String,
        required: [true, "Must Provide email"],
    }
})

module.exports = mongoose.model('routeModel', routeModel);  