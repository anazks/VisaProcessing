const mongoose = require('mongoose');
const { heightOfString } = require('pdfkit');


const bookingModel = new mongoose.Schema({
    tickets: {
        type: String,
        required: [true, "Must Provide ticket"],
    }, 
    availableSeat: {
        type: String,
        required: [true, "Must Provide availableSeat"],
    },
    jurneyId: {
        type: String,
        required: [true, "Must Provide jurneyId"],
    },
    userId: {
        type: String,
        required: [true, "Must Provide userId"],
    },
    userName: {
        type: String,
        required: [true, "Must Provide userName"],
    },
    usermail: {
        type: String,
        required: [true, "Must Provide usermail"],
    },
    status: {
        type: String,
        required: [true, "Must Provide status"],
        default:"pending"
    },
    payment: {
        type: String,
        required: [true, "Must Provide payment"],
        default:"notpayed"
    },
    employee: {
        type: String,
        required: [true, "Must Provide payment"],
    },
    lati: {
        type: Number,
        required: [true, "Must Provide lati"],
        default:0
    },
    longti: {
        type: Number,
        required: [true, "Must Provide longti"],
        default:0
    },
    Charge:{
        type: String,
        required: [true, "Must Provide longti"],
       
    }
    
    

})

module.exports = mongoose.model('bookingModel', bookingModel);  