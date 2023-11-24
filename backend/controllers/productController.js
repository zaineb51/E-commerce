const product = require("../models/product");
const provider = require("../models/provider");
const subcategory = require("../models/subcategory");
module.exports = {
  add: async (req, res) => {
    try {
      req.body["gallery"] =
        req.files?.length <= 0
          ? []
          : req.files?.map((file) => {
              return {
                name: file.filename,
                description: "",
              };
            });
      const newproduct = new product(req.body);
      const data = await newproduct.save(req.body, (err,item)=>{
        if (err) {
          res.status(400).json({
            message: "error",
            success: false,
            error: err,
          });
        }else{
          res.status(200).json({
            message: "access",
            success: true,
            data: item,
          });
        }
      });
      await subcategory.findByIdAndUpdate(
        { _id: req.body.subcategory },
        { $push: { product: newproduct } }
      );
      // await provider.findByIdAndUpdate(
      //   { _id: req.body.provider },
      //   { $push: { product: newproduct } }
      // );
      
    } catch (error) {
      res.status(400).json({
        message: "error",
        success: false,
        error: error,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await product.find().populate("subcategory")
      // .populate(["gallery", "orders"]);
      res.status(200).json({
        message: "all products ",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to list all products",
        success: true,
        error: error,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const data = await product.findById(req.params.id);
      res.status(200).json({
        message: "got product",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to get product",
        success: false,
        error: error,
      });
    }
  },
  update: async (req, res) => {
    try {
      const prod = await product.findOne({ _id: req.params.id });
      const files1 =
        req.files?.length <= 0
          ? []
          : req.files?.map((file) => {
              return {
                name: file.filename,
                description: "",
              };
            });
      req.body["gallery"] = [...prod.gallery, ...files1];
      const data = await product.updateOne({ _id: req.params.id }, req.body);
      res.status(200).json({
        message: "updated product ",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(400).json({
        message: "failed to update product ",
        success: false,
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const data = await product.deleteOne({ _id: req.params.id });
      if (data.deletedCount > 0) {
        res.status(200).json({
          message: "deleted product successfully",
          status: true,
        });
        subcategory.updateOne(
          { _id: data.subcategory },
          {
            $pullAll: {
              product: [{ _id: req.params.id }],
            },
          }
        );
        provider.updateOne(
          { _id: data.provider },
          {
            $pullAll: {
              product: [{ _id: req.params.id }],
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
    let { description } = req.query;
    try {
      data = await product.find({
        name: { $regex: name ? name : /.*/, $options: "i" },
        description: {
          $regex: description ? description : /.*/,
          $options: "i",
        },
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
