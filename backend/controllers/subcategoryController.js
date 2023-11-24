const subcategory = require("../models/subcategory");
const Category = require("../models/category");


module.exports = {
  add: async (req, res) => {
   req.body.image=req.file.filename
    const category = await Category.findById({ _id: req.body.category });
    const newsubcategory = new subcategory(req.body);
    newsubcategory.save(req.body, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: "Error",
          success: false,
          error: err.message,
        });
     
      } else {
        res.status(200).json({
          message: "subcategory added successfully",
          success: true,
          data: data,
        });
        category.subcategory.push(newsubcategory);
        category.save();
      }
    });
 
  },
  getAll: async (req, res) => {
    try {
      const data = await subcategory
        .find()
        // .populate("produits")
        .populate("category");
      res.status(200).json({
        message: "all subcategories",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(400).json({
        message: " failed to get all",
        success: false,
        error: error,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const data = await subcategory.findById(req.params.id);
      res.status(200).json({
        message: "got subcategory",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to get subcategory",
        success: false,
        error: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await subcategory.updateOne(
        { _id: req.params.id },
        req.body
      );
      console.log(data);
      res.status(200).json({
        message: "updated subcategory successfully",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to update subcategory",
        success: false,
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const data = await subcategory.deleteOne({ _id: req.params.id });
      if (data.deletedCount > 0) {
        res.status(200).json({
          message: "deleted subcategory successfully",
          status: true,
        });
        Category.updateOne(
          { _id: data.category },
          {
            $pullAll: {
              subcategory: [{ _id: req.params.id }],
            },
          }
        );
      } else {
        res.status(400).json({
          message: "subcategory not found",
          status: false,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "failed to delete subcategory",
        status: false,
        error: error,
      });
    }
  },
  getByName: async (req, res) => {
    let { name } = req.query;
    try {
      data = await subcategory.find({
        name: { $regex: name ? name : /.*/, $options: "i" },
      });
      res.status(200).json({
        message: "query",
        status: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(200).json({
        message: "error",
        status: false,
        data: error,
      });
    }
  },
};
