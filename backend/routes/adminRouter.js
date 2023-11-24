const route = require("express").Router();
const adminController = require("../controllers/adminController");

route.post("/add",adminController.add);
route.get("/getall", adminController.getAll);
route.get("/get/:id", adminController.getById);
route.put("/update/:id", adminController.update);
route.delete("/delete/:id",adminController.delete);


module.exports = route;