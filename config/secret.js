// כל המשתנים שצריכים להיות סודיים יהיו בקובץ הזה
require("dotenv").config();

exports.config = {
  tokenSecret:process.env.TOKEN_SECRET,
  userDb:process.env.USER_DB,
  passDb:process.env.PASS_DB
}

