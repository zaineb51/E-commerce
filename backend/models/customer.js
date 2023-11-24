const mongoose = require("mongoose");
const user = require("./user");
const customerSchema = new mongoose.Schema({
  picture: {
    type: String,
  },
  cin: {
    type: String,
    required: true,
  },
  adresse: {
    type: String,
  },
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
  ],
});
user.discriminator("customer", customerSchema);
module.exports = mongoose.model("customer");
