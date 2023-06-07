const express= require("express");
const bcrypt = require("bcrypt");
const {UserModel, validUser,createToken, validLogin} = require("../models/userModel");
const {auth, authAdmin} = require ("../auth/authUser");
const router = express.Router();

router.get("/usersList",authAdmin, async(req,res)=> {
    let perPage = Math.min(req.query.perPage,20) || 10;
    let page = req.query.page || 1;

    try{
        let data = await UserModel
        .find({})
        .limit(perPage)
        .skip((page-1)*perPage)
        
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err})
    }
})

router.post("/signUp", async(req,res) => {
    let validateBody = validUser(req.body);
    if (validateBody.error){
        return res.status(400).json(validateBody.error.details);
    }
    try{
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password,10);
        await user.save();
        user.password = "***";
        res.status(201).json({msg:"success. the user was added",user});
    }
    catch (err){
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already exists!", code: 11000 })
    
          }
           
        console.log(err);
        res.status(500).json({msg:"err",err});
    }
})

router.post("/login", async(req,res) => {
    console.log("start");
    let validLoginData = validLogin(req.body);
    if (validLoginData.error){
        return res.status(400).json(validLoginData.error.details);
    }

    try{
        let user = await UserModel.findOne({email:req.body.email});
        if (!user){
            res.status(401).json({msg:"email doesnt exist in the system"});
        }
        console.log(user);
        let correctPassword = await bcrypt.compare(req.body.password,user.password);
        if (!correctPassword){
            res.status(401).json({msg:"password incorrect."});
        }
        console.log ("id: ", user.id);
        console.log ("role:" , user.role);
        let token = createToken(user._id, user.role);
        res.json({ token });
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err});
    }
})

router.delete("/delete/:delId", auth, async(req,res) => {
    try{
        let delId = req.params.delId;
        console.log(req.body);
        console.log(req.tokenData);
        let data;
        if (req.tokenData.role === "admin") {
            data = await UserModel.deleteOne({ _id: delId });
          }
          else if (delId === req.tokenData._id) {
            data = await UserModel.deleteOne({ _id: delId });
          }
          else{
            return res.status(400).json({msg:"access denied."});
          }
          if (data.deletedCount>0){
            res.json(data);
          }
          else{
            res.json({msg:"no user found with this id."})
          }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err});
    }
})

router.get("/myInfo" ,auth, async(req,res) => {
   let user = await UserModel.findOne({_id:req.tokenData._id},{password:0});
   res.json(user);
})

router.put("/edit/:idEdit",auth, async(req,res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let idEdit = req.params.idEdit;
      let data;
      if (req.tokenData.role === "admin") {
        data = await UserModel.updateOne({ _id: idEdit }, req.body)
      }
      else if (idEdit === req.tokenData._id) {
        data = await UserModel.updateOne({ _id: idEdit }, req.body)
      }
      if (!data) {
        return res.status(400).json({ err: "Access denied" })
      }

      let user = await UserModel.findOne({ _id: idEdit });
      user.password = await bcrypt.hash(user.password, 10);
      await user.save()
      res.status(200).json({ msg: data })
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ err })
    }
})

module.exports = router;