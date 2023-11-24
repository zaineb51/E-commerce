const order = require("../models/orders");
const customer = require("../models/customer");
const product = require("../models/product");
module.exports = {
  add: async (req, res) => {
    const neworder = new order(req.body);
    neworder.save(req.body, async (err, data) => {
      if (err) {
        return res.status(400).json({
          message: "Error",
          success: false,
          data: err,
        });
      } else {
        await customer.findByIdAndUpdate(
          { _id: req.body.customer },
          { $push: { orders: neworder } }
        );
        await product.findByIdAndUpdate(
          { _id: req.body.product },
          { $push: { orders: neworder } }
        );
        res.status(200).json({
          message: "order added successfully",
          success: true,
          data: data,
        });
      }
    });
  },
  getAll: async (req, res) => {
    try {
      const data = await order.find();
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
      const data = await order.findById(req.params.id);
      res.status(200).json({
        message: "got order",
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(404).json({
        message: "failed to get order",
        success: false,
        error: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await order.updateOne({ _id: req.params.id }, req.body);
      res.status(200).json({
        message: "updated order successfully",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "failed to update order",
        success: false,
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const data = await order.deleteOne({ _id: req.params.id });
      if (data.deletedCount > 0) {
        await customer.updateOne(
          { _id: data.customer },
          {
            $pullAll: {
              orders: [{ _id: req.params.id }],
            },
          }
        );
        await product.updateOne(
          { _id: data.product },
          {
            $pullAll: {
              orders: [{ _id: req.params.id }],
            },
          }
        );
        res.status(200).json({
          message: "deleted order successfully",
          status: true,
        });
      } else {
        res.status(400).json({
          message: "order not found",
          status: false,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "failed to delete order",
        status: false,
        error: error,
      });
    }
  },
};
