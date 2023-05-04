const Razorpay = require('razorpay'); 
const razorpayInstance = new Razorpay({
        // Replace with your key_id
    key_id: "rzp_test_W8RGjInsDaKQiY",
         // Replace with your key_secret
    key_secret: "DkNW0S4KbIGO9x25IPRyyDcu"
});
module.exports=razorpayInstance;