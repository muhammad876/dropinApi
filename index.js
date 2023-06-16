var express = require("express");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");
const uuid = require("uuid").v4;

const Image = require("./schema");
const DropIn = require("./dropin");

var multer = require("multer");
app.use(cors());
const stripe = require("stripe")(
  "sk_test_51NFVMtSBa1DPoKnkcMqBNlLduWL2yMAx8qLAZJ3sDJ09ETEjTWZSxdAuuWU21xrWnY0sOmrsOfKUSE2sdJIQc45x00OqhmAwsl"
);

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.listen(3001, () => {
  console.log("Server is runnig on the 3001");
});
mongoose.connect(
  "mongodb+srv://mrijaz4575:daniyal4575@ecommerce.d0ymki1.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);
app.use("/checkout", async (req, res) => {
  console.log(req.body);
  let error, status;
  try {
    const { product, token } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const key = uuid();
    const charge = await stripe.charges.create(
      {
        amount: product * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Purchased the ${product.name}",
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        key,
      }
    );
    console.log("Charge: ", { charge });
    status = "success";
  } catch (error) {
    console.log(error);
    status = "failure";
  }
  res.json({ error, status });
});
app.post("/add", async (req, res) => {
  const key = uuid();
  console.log(key);
  const { base64 } = req.body;
  const { code } = req.body;
  const { status } = req.body;
  const { name } = req.body;
  const { email } = req.body;
  console.log(code);
  try {
    const user = new Image({
      image: base64,
      code: code,
      status: status,
      name: name,
      id: key,
      delievery: "not yet",
      statuscolor: "btn btn-primary",
      dropcolor: "btn btn-primary",
      email: email,
    });
    user.save();
    res.send("Added");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/getbyId/:id", async (req, res) => {
  try {
    const user = await Image.find({ _id: req.params.id });
    res.json({ image: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getCustomerData/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await Image.find({ email: req.params.email });
    res.json({ image: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getImage", async (reg, res) => {
  try {
    Image.find().then((user) => {
      res.json({ image: user });
    });
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

app.post("/update", async (req, res) => {
  try {
    console.log("req.body", req.body);

    var _id = req.body.id;
    var data = {
      // name: req.body.name,
      // base64: req.body.base64,
      // code: req.body.code,
      // status: req.body.status,
      delievery: req.body.delievery,
      // statuscolor: req.body.statuscolor,
      dropcolor: req.body.dropcolor,
    };

    const updatedResult = await Image.findByIdAndUpdate(_id, data, {
      new: true,
    });
    res.json({ status: "Updated " });
  } catch (error) {
    console.log(error);
  }
});
app.post("/updateStatus", async (req, res) => {
  try {
    console.log("req.body", req.body);

    var _id = req.body.id;
    var data = {
      // name: req.body.name,
      // base64: req.body.base64,
      // code: req.body.code,
      status: req.body.status,
      // delievery: req.body.delievery,
      statuscolor: req.body.statuscolor,
      // dropcolor: req.body.dropcolor,
    };

    const updatedResult = await Image.findByIdAndUpdate(_id, data, {
      new: true,
    });
    res.json({ status: "Updated" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/dropout", async (req, res) => {
  try {
    console.log("req.body", req.body);

    var _id = req.body.id;
    var myquery = { id: req.body.id };
    const updatedResult = await DropIn.deleteOne(myquery);
    res.json({ status: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/dropin", async (req, res) => {
  const { id } = req.body;
  const { date } = req.body;
  const { time } = req.body;
  const { address } = req.body;
  const { email } = req.body;

  try {
    const user = new DropIn({
      id: id,
      date: date,
      time: time,
      address: address,
      email: email,
    });
    user.save();
    res.send("Added");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
