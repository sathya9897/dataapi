const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secrets = require("./secrets");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: secrets.email,
    pass: secrets.pass
  }
});
function CreateToken(payload) {
  jwt.sign(payload, "secret", { expiresIn: 2500000 }, function(err, token) {
    if (err) {
      return err;
    }
    setTimeout(() => {
      return token;
    }, 500);
  });
}

const userData = {
  id: 25463571,
  email: "sathyarox7@gmail.com"
};

router.get("/logout", (req, res) => {
  res.json({});
});
router.post("/signin/email", (req, res) => {
  console.log(req);
  return CreateToken(userData);
});
router.post("/signup/email", (req, res) => {
  console.log(req.body);
  let mailOptions = {
    from: "sathyarox7@gmail.com",
    to: "ksathyareddy7@gmail.com",
    subject: "Verify Your Email",
    text: "The OTP to verify your account is 451245"
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "something went wrong" });
    } else {
      console.log("EMAIL WAS SENT");
      return res.json({ token: CreateToken(userData) });
    }
  });
});

module.exports = router;
