const route = require("express").Router();
const subcategoryController=require("../controllers/subcategoryController");
const upload = require("../middleware/upload");

route.post("/add", upload.single('image'),subcategoryController.add);
route.get("/getall",subcategoryController.getAll);
route.get("/get/:id",subcategoryController.getById);
route.put("/update/:id",subcategoryController.update);
route.delete("/delete/:id",subcategoryController.delete);
route.get("/getby/",subcategoryController.getByName);

module.exports = route;