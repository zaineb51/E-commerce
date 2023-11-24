const category = require("../models/category");

module.exports = {
  addCategory: async (req, res) => {
    const newCategory = new category(req.body);
    newCategory.save(req.body, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: "category already exist",
          success: false,
          data: err,
        });
      } else {
        res.status(200).json({
          message: "category added successfully",
          success: true,
          data: data,
        });
      }
    });
  },
  getAllCategory: async (req, res) => {
    try {
      const data = await category.find().populate('subcategory');
      res.status(200).json({
        message: "all categories",
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
      const data = await category.findById(req.params.id).populate('subcategory');
      res.status(200).json({
        message: "got category",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to get category",
        success: false,
        error: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await category.updateOne({ _id: req.params.id }, req.body);
      console.log(data);
      res.status(200).json({
        message: "updated category successfully",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to update category",
        success: false,
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const data = await category.deleteOne({ _id: req.params.id });
      if (data.deletedCount > 0) {
        res.status(200).json({
          message: "deleted category successfully",
          status: true,
        });
      } else {
        res.status(400).json({
          message: "category not found",
          status: false,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "failed to delete category",
        status: false,
        error: error,
      });
    }
  },
  getByName: async (req, res) => {
    let { name } = req.query;
    let { description } = req.query;
    try {
      data = await category.find(
        {
          name: { $regex: (name) ? name:/.*/, $options: "i" },
          description: { $regex: (description) ? description:/.*/, $options: "i" },
        },
        
      );
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
