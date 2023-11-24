const admin = require("../models/admin");
const { randomBytes } = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { mail_verif } = require("./mailVerif");
const URL = process.env.URL;


module.exports = {
  add: async (req, res) => {
    try {
      const hashedPwd = await bcrypt.hashSync(req.body.password, 10);
      const data = new admin({
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
         mail_verif(item);
          res.status(200).json({
            message: "created admin",
            success: true,
            data: data,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to create admin",
        success: false,
        error: error,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await admin.find();
      res.status(200).json({
        message: "all admins ",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to list all admins",
        success: true,
        error: error,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const data = await admin.findById(req.params.id);
      res.status(200).json({
        message: "got admin",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to get admin",
        success: false,
        error: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await admin.updateOne({ _id: req.params.id }, req.body);
      console.log(data);
      res.status(200).json({
        message: "updated admin successfully",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to update admin",
        success: false,
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const data = await admin.deleteOne({ _id: req.params.id });
      if (data.deletedCount > 0) {
        res.status(200).json({
          message: "deleted admin successfully",
          status: true,
        });
      } else {
        res.status(400).json({
          message: "admin not found",
          status: false,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "failed to delete admin",
        status: false,
        error: error,
      });
    }
  },
};
