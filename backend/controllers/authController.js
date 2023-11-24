const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { join } = require("path");
const { forget } = require("./mailVerif");
const crypto = require('crypto');
const URL = process.env.URL;
let refreshtokens = [];
const generate_token = (user) => {
  token = jwt.sign(
    { id: user._id },
    process.env.SECRET,
    { expiresIn: "1m" }
  );
  return token;
}
const generate_refToken = (user) => {
  token = jwt.sign(
    { id: user._id },
    process.env.SECRETR,
    { expiresIn: "1h" }
  );
  return token;
}
module.exports = {
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const cmp = await bcrypt.compare(req.body.password, user.password);
        if (cmp) {
          token = generate_token(user);
          let refreshtoken = generate_refToken(user);
          refreshtokens.push(refreshtoken);
          const u = await User.findOne({ email: req.body.email }).select("-password");
          res.status(200).json({
            message: "auth successful",
            success: true,
            token: token,
            refresh_token: refreshtoken,
            data: u,
          });
        } else {
          res.status(404).json({
            message: "Wrong username or password.",
            success: false,
          });
        }
      } else {
        res.status(404).json({
          message: "Wrong username or password.",
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server error Occurred");
    }
  },
  logout: async (req, res) => {
    try {
      let refreshtoken = req.body.refresh_token;
      refreshtokens = refreshtokens.filter((token) => token != refreshtoken);
      console.log("after logout :", refreshtokens);
      res.send("logged out");
    } catch (error) {
      res.send("error logging out");
      console.log(error);
    }
  },
  forget: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "1m",
        });
        var rand = await crypto.randomBytes(64).toString('hex');
        user.resetPasswordToken = rand;
        user.save();
        
        forget(user.name, user.email, rand);
        res.status(200).json({
          message: "reset password",
          success: "true",
          token: token,
        });
      } else {
        res.status(400).json({
          message: "reset password failed",
          success: "false",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "reset password error",
        success: "false",
      });
      console.log(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const token = req.params.token;
      if (token) {
        /*const verified = jwt.verify(token, process.env.SECRET, async (err) => {
          if (err) {
            res.status(400).json({
              message: "error token",
            });
          }*/
          const user = await User.findOne({ resetPasswordToken: token });
          user.password = bcrypt.hashSync(req.body.password, 10);
          user.resetPasswordToken = undefined;
          user.save();
          res.status(200).json({
            message: "password changed",
          });
        //});
      }
    } catch (error) {
      res.status(400).json({
        message: "error",
        success: false,
      });
      console.log(error);
    }
  },
  refreshtokens: async (req,res) => {
    const refresh_token = req.body.refresh_token;
    if(!refreshtokens.includes(refresh_token)) {
      res.status(400).json({
        message:"refresh token invalid",
      })
    }
    jwt.verify(refresh_token, process.env.SECRETR, (err, decoded) => {
      refreshtokens = refreshtokens.filter((token) => refresh_token != token);
      const new_ref_token = generate_refToken();
      const access_token = generate_token();

      refreshtokens.push(new_ref_token);
      res.status(200).json({
        message: "generated new token",
        success: true
      })
    })
  },


  fetchUser: async (req, res) => {
    try {
      const newUser = await User.findOne({});
      res.status(200).json({
        message: "user fetched",
        success : true,
        user: newUser
      })
    } catch (error) {
      res.status(400).json({
        message: "failed to get user",
        success: false,
      })
    }
  }

};


