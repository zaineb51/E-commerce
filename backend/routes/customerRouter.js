const route = require("express").Router();
const customerController = require("../controllers/customerController");
const upload = require("../middleware/upload");

route.post("/add", upload.single("picture"), customerController.add);
route.get("/getall", customerController.getAll);
route.get("/get/:id", customerController.getById);
route.put("/update/:id", customerController.update);
route.delete("/delete/:id", customerController.delete);
route.get("/getby/", customerController.getByName);

module.exports = route;
