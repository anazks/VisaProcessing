var express = require('express');
var router = express.Router();
let jurneyModel= require('../model/JurneyModel')
let userMode = require("../model/userModel")
let bookinModel = require('../model/bookingModel');
const bookingModel = require('../model/bookingModel');
let nodemailer = require('nodemailer');
const Razorpay = require('../Razorpay/Razorpay');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/Register', function(req, res, next) {
  res.render('user/Register');
});
router.get('/Login', function(req, res, next) {
  if(req.session.nouser){
    let alert = req.session.nouser;
    res.render('user/Login',{alert});
  }else{
    res.render('user/Login');
  }
});
router.post('/Login', async(req,res)=>{
  try {
    let {email} = req.body;
    let {password} = req.body;
    let userData = await userMode.find({email:email,password:password})
    console.log(userData)
    if(userData.length>0){

        req.session.user = userData[0];
      res.redirect('/home')
    }else{
      req.session.nouser ="incorrect Username or Password"

      res.redirect('/Login')
    }
} catch (error) {
  console.log(error)
}
})
router.post('/Register',async(req,res)=>{
  try {
    let user = await userMode.create(req.body);
    console.log("data insterted")
    res.redirect('/Login')
  } catch (error) {
    console.log(error)
  }
})
router.get('/Home',async function(req, res, next) {
      try {
          let jurneys = await jurneyModel.find();
          if(req.session.payemnt)
           {
             console.log(req.session.payemnt)
             let paymentAlert = req.session.payemnt;
            }
          console.log(jurneys)
            if(req.session.user){
              let user = req.session.user;
              console.log(user,"seesiondata")
              if(req.session.alert){
                let SeatAlert = req.session.alert;
                console.log(paymentAlert,"payment")
                res.render('user/Home',{jurneys,user,SeatAlert,paymentAlert});
              }else{
                res.render('user/Home',{jurneys,user});
              }
              
            }
         
      } catch (error) {
        console.log(error)
      }
 
});
router.get('/checkSeats/:id',async function(req, res, next) {
  try {
    let id = req.params.id
      let jurneys = await jurneyModel.find({_id:id});
      console.log(jurneys)
      res.render('user/bookNow',{jurneys});
  } catch (error) {
    console.log(error)
  }

});
router.post('/book_Now', async(req,res)=>{
      try {
        console.log(req.body)
            let userId = req.session.user._id;
            let userName= req.session.user.userName;
           req.body.userId =userId;
           req.body.userName=userName;
          console.log(req.body,"for db")
            var availableSeat =parseInt(req.body.availableSeat);
            var ticket = req.body.tickets
            var newSeat = availableSeat - ticket;
            if(newSeat<0){
              req.session.alert ="Set visa available"
                res.redirect('/home')
            }
            console.log(newSeat,"new seat")
            let {Doc1} = req.files;
            let {Doc2} = req.files;
            let {Doc3} = req.files;
            let bookings = await bookinModel.create(req.body)
            console.log(bookings._id,"booking id")
            let bookingID =bookings._id;
            let  jurneyId= req.body.jurneyId;
            var {rate} = req.body;
              amount = ticket * rate;
              Doc1.mv('./public/docs/doc1/' + bookings._id + ".pdf").then((err) => {
                if (!err) {
                  Doc2.mv('./public/docs/doc2/' + bookings._id + ".pdf").then((err) => {
                    if (!err) {
                      Doc3.mv('./public/docs/doc3/' + bookings._id + ".pdf").then((err) => {
                        if (!err) {
                          res.render('user/paynent',{amount,bookingID,newSeat,jurneyId})
                        }
                        res.redirect('/Home')
                    })
                    }
                })
                }
            })
           
      } catch (error) {
          console.log(error)
      }   
})
router.post('/confirmBooking',async(req,res)=>{
      try {
            var {amount}= req.body;
            var {id} = req.body;
            var {newseat} = req.body;
            var {jurneyId} = req.body;
            console.log(newseat,"definded")
            let paymentDOne = await bookinModel.findByIdAndUpdate({_id:id},{$set :{status:"Application Submited",payment:amount}})
            let newSeatUpadtion = await jurneyModel.findByIdAndUpdate({_id:jurneyId},{$set :{availableSeat:newseat}})
            req.session.payemnt = "Payment success..!!"
            res.redirect('/Home')
      } catch (error) {
          console.log(error)
      }
})
router.get('/myBookings',  async(req,res)=>{
        try {
              console.log(req.session.user._id)
              var bookings = await bookingModel.find({userId:req.session.user._id});
              console.log(bookings,"bookingss...")
              let user = req.session.user;
              res.render('user/myBookings',{bookings,user})
        } catch (error) {
                console.log(error)
        }
 
})
router.get('/profile',(req,res)=>{
  let data = req.session.user;
  let user = req.session.user;
  res.render('user/profile',{data,user})
})
router.get('/map',(req,res)=>{
  let user = req.session.user;
  res.render('user/map',{user})
})

router.post('/sentMail',(req,res)=>{
  let user = req.session.user;

  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'ecommercetest246@gmail.com',
      pass:'iftgqrcgrduigxuk'
    },
    tls:{
      rejectUnauthorized:false,
    },
  })
  let mailOption  = {
    from:"anonimous",
    to:"anazksunil2@gmail.com",
    subject:req.body.feedabcak,
  };
  transporter.sendMail(mailOption,function(err,info){
    if(err){
      console.log(err)
    }else{
      console.log("emailsent Succecfully")
      res.redirect('/')
    }
  })

})
router.get('/createOrder/:amont',(req,res)=>{
  var amount = req.params.amont;
  let userId = req.session.user.id;
  var options = {
    amount: amount*100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  Razorpay.orders.create(options, function(err, order) {
    console.log(order);
    var user = req.session.user;
    res.render('user/chechOut',{user,order})
  });
})
router.post('/varify',async(req,res)=>{
  var usermail =  req.session.user.Email_id;
  var crypto = require('crypto')
  var userId =req.session.user.id;
  let data = req.body;
  var order_id = data['response[razorpay_order_id]']
  var payment_id = data[ 'response[razorpay_payment_id]']
  const razorpay_signature = data[ 'response[razorpay_signature]']
  const key_secret = "DkNW0S4KbIGO9x25IPRyyDcu";
  let hmac = crypto.createHmac('sha256', key_secret); 
  await hmac.update(order_id + "|" + payment_id);
  const generated_signature = hmac.digest('hex');
  var paidAmnt = req.body.amount/100;
  console.log(data)
  console.log(paidAmnt)
  if(razorpay_signature===generated_signature){
      try {
              let updateStatus =await bookingModel.findOneAndUpdate( {Charge:paidAmnt},{$set :{payment:"payed"}})
                  console.log('updated')
                  res.json(data=true)
              } catch (error) {
                console.log(error)
              }     
        }
})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login')
})
module.exports = router;
