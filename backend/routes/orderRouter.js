const route = require("express").Router();
const orderController = require("../controllers/orderController");

route.post("/add",orderController.add);
route.get("/getall",orderController.getAll);
route.get("/get/:id",orderController.getById);
route.put("/update/:id",orderController.update);
route.delete("/delete/:id",orderController.delete);

module.exports = route;