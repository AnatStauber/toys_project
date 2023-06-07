const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const toySchema = new mongoose.Schema({
  name:String,
  info:String,
  category:String,
  img_url : String,
  price:Number,
  date_created:{
    type : Date , default : Date.now()
},
user_id : String
})

exports.ToyModel = mongoose.model("toys",toySchema);


exports.createToken = (user_id) => {
    let token = jwt.sign({_id:user_id} , "tokenSECRET", {expiresIn:"90mins"})
    return token;
}

exports.validateToy = (_body) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(10000).required(),
        category: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(2).max(100000).allow(null,""),
        price: Joi.number().min(1).max(1000000).required()
    })
    return joiSchema.validate(_body);
}

