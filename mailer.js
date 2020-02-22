const nodemailer = require("nodemailer");
const secrets = require("./secrets");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: secrets.email,
    pass: secrets.pass
  }
});

module.exports = transporter;
