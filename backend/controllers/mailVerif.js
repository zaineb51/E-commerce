const {join} = require("path");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const URL = process.env.URL;
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "sssss",
      pass: "sssss",
    },
  });

  module.exports = {
    mail_verif: (item) => {
        transport.sendMail({
            from: "admin@test.com",
            to: item.email,
            subject: `hello ${item.__t} ${item.name}`,
            html: `<a href="${URL}/verify/${item.verf_code}"> verify </a>`,
          });
    },
    forget: (name,email,token) => {
      transport.sendMail({
        from: "admin@test.com",
        to: email,
        subject: `hello ${name}`,
        html: `<a href="http://localhost:5173/reset/${token}"> verify </a>`,
      });
    },
    verify: async (req, res) => {
      try {
        const user = await User.findOne({ verf_code: req.params.code });
        user.verified = true;
        user.verf_code = undefined;
        user.save();
         res.sendFile(join(__dirname, "../views/success.html"));
      } catch (error) {
      console.log(error);
        res.sendFile(join(__dirname, "../views/fail.html"));
      }
    },
  }
