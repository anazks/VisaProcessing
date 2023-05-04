const mongoose = require('mongoose');


const employeeModel = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Must Provide name"],
    }, 
    email: {
        type: String,
        required: [true, "Must Provide email"],
    },
    mobile: {
        type: String,
        required: [true, "Must Provide email"],
    },
    password: {
        type: String,
        required: [true, "Must Provide email"],
    },
    status: {
        type: String,
        required: [true, "Must Provide email"],
        default:"pending"
    }
})

module.exports = mongoose.model('employeeModel', employeeModel);  