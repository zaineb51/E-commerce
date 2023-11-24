const customer = require("../models/customer");
const { randomBytes } = require("crypto");
const bcrypt = require("bcrypt");
const { mail_verif } = require("./mailVerif");
const URL = process.env.URL;


module.exports = {
  add: async (req, res) => {
    try {
      req.body.picture = req.file.path;
      const hashedPwd = await bcrypt.hashSync(req.body.password, 10);
      const data = new customer({
        ...req.body,
        password: hashedPwd,
        verf_code: randomBytes(6).toString("hex"),
      });
      await data.save(req.body, (err, item) => {
        if (err) {
          res.status(400).json({
            message: "Error",
            success: false,
            data: err,
          });
        } else {
          mail_verif(item)
          res.status(200).json({
            message: "created customer",
            success: true,
            data: data,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to create customer",
        success: false,
        error: error,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await customer.find().populate("orders");
      res.status(200).json({
        message: "all customers ",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to list all customers",
        success: true,
        error: error,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const data = await customer.findById(req.params.id).populate("orders");
      res.status(200).json({
        message: "got customer",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to get customer",
        success: false,
        error: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await customer.updateOne({ _id: req.params.id }, req.body);
      console.log(data);
      res.status(200).json({
        message: "updated customer successfully",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to update customer",
        success: false,
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const data = await customer.deleteOne({ _id: req.params.id });
      if (data.deletedCount > 0) {
        res.status(200).json({
          message: "deleted customer successfully",
          status: true,
        });
      } else {
        res.status(400).json({
          message: "customer not found",
          status: false,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "failed to delete customer",
        status: false,
        error: error,
      });
    }
  },
  getByName: async (req, res) => {
    let { name } = req.query;
    try {
      data = await customer.find({
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
