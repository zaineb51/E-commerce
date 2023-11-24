const mongoose = require("mongoose"); // Erase if already required
const options = { discriminatorKey: "itemtype" };

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false
    },
    verf_code: {
      type: String,
    },
    resetPasswordToken:{
      type: String
    }
  },
  { timestamps: true },
  options
);

//Export the model
module.exports = mongoose.model("User", userSchema);
