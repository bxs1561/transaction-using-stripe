const express = require("express");
const stripe = require("stripe")(process.env.SECRET_KEY);
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");


const app = express();

const port = process.env.PORT || 9000;

app.engine("handlebars",expressHandlebars({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

//body middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static folders to put the images
app.use(express.static(`${__dirname}/public`))

//charges route

app.post("/charge",(req,res)=>{
    // console.log(req.body)
    const amount= 5000;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source:req.body.stripeToken
    }).then((customer)=>{
        stripe.charges.create({
            customer: customer.id,
            amount: amount,
            currency: 'usd',
            description: 'Comfortable clothes',

        })
    }).then(charge=>res.render("success"))
})
//index route
app.get("/",(req,res)=>{
    res.render("index",{
        publishKey:process.env.PUBLISH_KEY
    })
});


app.listen(port,()=>console.log(`listening to: ${port}`));
