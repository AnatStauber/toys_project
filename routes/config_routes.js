
const usersR = require("./users")
const toysR = require("./toys")

exports.routesInit = (app) => {
    app.use("/users",usersR);
    app.use("/toys", toysR);
}