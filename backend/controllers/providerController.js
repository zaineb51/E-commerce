const provider = require("../models/provider");
const { randomBytes } = require("crypto");
const bcrypt = require("bcrypt");
const { mail_verif } = require("./mailVerif");
const URL = process.env.URL;



module.exports = {
  add: async (req, res) => {
    try {
      const hashedPwd = await bcrypt.hashSync(req.body.password, 10);
      const data = new provider({
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
            message: "created provider",
            success: true,
            data: data,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to create provider",
        success: false,
        error: error,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await provider.find().populate("product");
      res.status(200).json({
        message: "all providers ",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to list all providers",
        success: true,
        error: error,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const data = await provider.findById(req.params.id);
      res.status(200).json({
        message: "got provider",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to get provider",
        success: false,
        error: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await provider.updateOne({ _id: req.params.id }, req.body);
      console.log(data);
      res.status(200).json({
        message: "updated provider successfully",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to update provider",
        success: false,
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const data = await provider.deleteOne({ _id: req.params.id });
      if (data.deletedCount > 0) {
        res.status(200).json({
          message: "deleted provider successfully",
          status: true,
        });
      } else {
        res.status(400).json({
          message: "provider not found",
          status: false,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "failed to delete provider",
        status: false,
        error: error,
      });
    }
  },
  getByName: async (req, res) => {
    let { name } = req.query;
    let { company_name } = req.query;
    try {
      data = await provider.find({
        name: { $regex: name ? name : /.*/, $options: "i" },
        description: {
          $regex: company_name ? company_name : /.*/,
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
      res.status(404).json({
        message: "error",
        status: false,
        data: error,
      });
    }
  },
  accept: async (req,res) => {
  	try{
  	 await provider.findOneAndUpdate({_id:req.body.id},{accepted: true});
  	 res.status(200).json({
  	 	message: "accepted",
  	 	status: "success",
  	 });
  	} catch(error) {
  		res.status(400).json({
  		message: "failed to accept",
  	 	status: "failed",
  		});
  	}
  },
};
