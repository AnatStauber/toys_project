const express= require("express");
const {auth} = require("../auth/authUser");
const {ToyModel,validateToy} = require("../models/toysModel");
const { all } = require("axios");
const router = express.Router();


router.get("/" , async(req,res)=> {

  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  

  try{
    let data = await ToyModel
    .find({})
    .limit(perPage)
    .skip((page - 1)*perPage)
    .sort({[sort]:reverse})
    res.json(data);
  } 
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }

})

router.get("/search" , async(req,res)=> {

  let s = req.query.s;
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  
  try{
    
    let data = await ToyModel
    .find({$or:[{name:s},{info:s}]})
    .limit(perPage)
    .skip((page - 1)*perPage)
    .sort({_id:-1})
    res.json(data);
  } 
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.get("/category/:catName" , async(req,res)=> {

  let cat = req.params.catName;
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  
  try{
    
    let data = await ToyModel.
    find({category:cat})
    .limit(perPage)
    .skip((page - 1)*perPage)
    .sort({_id:-1})
    res.json(data);
  } 
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }

})

router.post("/", auth, async(req,res) => {

  let valdiateBody = validateToy(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }

  try{
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:idEdit", auth, async(req,res) => {
  let valdiateBody = validateToy(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    let idEdit = req.params.idEdit
    let data = await ToyModel.updateOne({_id:idEdit,user_id:req.tokenData._id},req.body)
    if (data.modifiedCount>0){
      res.json(data);
    } else{
      res.json({msg:"access denied."});
    }
    
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.delete("/:idDel",auth, async(req,res) => {
  try{
    let idDel = req.params.idDel
   
    let data = await ToyModel.deleteOne({_id:idDel,user_id:req.tokenData._id})
    if (data.deletedCount>0){
      res.json(data);
    } else{
      res.json({msg:"access denied."});
    }
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})


router.get("/prices" , async(req,res)=>{
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "price"
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  
 try {
    let minP = req.query.min;
    let maxP = req.query.max;
    if(minP&&maxP){
      let data = await ToyModel.find({$and:[{price:{$gte:minP}},{price:{$lte:maxP}}]})
      .limit(perPage)
      .skip((page - 1)*perPage)
      .sort({[sort]:reverse})
      res.json(data);
    }
    else if (minP) {
      let data = await ToyModel.find({price:{$gte:minP}})
      .limit(perPage)
      .skip((page - 1)*perPage)
      .sort({[sort]:reverse})
      res.json(data);
    } else if (maxP){
      let data = await ToyModel.find({price:{$lte:maxP}})
      .limit(perPage)
      .skip((page - 1)*perPage)
      .sort({[sort]:reverse})
      res.json(data);
    } else{
      let data = await ToyModel.find({})
      .limit(perPage)
      .skip((page - 1)*perPage)
      .sort({[sort]:reverse})
      res.json(data);
    }
    }  catch(err){
      console.log(err);
      res.status(500).json({msg:"there is an error, try again later",err})
    }
  })

  router.get("/single/:id" , async(req,res)=> {

    let id = req.params.id;
  
    try{
      let data = await ToyModel.
      find({_id:id})
      res.json(data);
    } 
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })

module.exports = router;