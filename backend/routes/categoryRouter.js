const route = require("express").Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/verif");

route.post("/add",categoryController.addCategory);
route.get("/getall",categoryController.getAllCategory);
route.get("/get/:id",categoryController.getById);
route.put("/update/:id",categoryController.update);
route.delete("/delete/:id",categoryController.delete);
route.get("/getby/",categoryController.getByName);

module.exports = route;