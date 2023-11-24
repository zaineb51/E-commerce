const route = require("express").Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");

route.post("/add", upload.array("gallery"), productController.add);
route.get("/getall", productController.getAll);
route.get("/get/:id", productController.getById);
route.put("/update/:id",
upload.array("gallery"),
 productController.update);
route.delete("/delete/:id", productController.delete);
route.get("/getby/",productController.getByName);


module.exports = route;