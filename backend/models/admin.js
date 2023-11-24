const mongoose = require("mongoose");
const user = require("./user");
const adminSchema = new mongoose.Schema({
  
});
user.discriminator("admin",adminSchema);
module.exports = mongoose.model("admin");
