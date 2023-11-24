const route = require("express").Router();
const providerController = require("../controllers/providerController");

route.post("/add",providerController.add);
route.get("/getall", providerController.getAll);
route.get("/get/:id", providerController.getById);
route.put("/update/:id", providerController.update);
route.delete("/delete/:id", providerController.delete);
route.get("/getby/",providerController.getByName);

route.post("/accept/",providerController.accept);

module.exports = route;
