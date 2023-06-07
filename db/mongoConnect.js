const mongoose = require('mongoose');
const {config} = require("../config/secret");
require("dotenv").config();
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.mlosogm.mongodb.net/node_project`);
  console.log("mongo connect black24 atlas")
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
