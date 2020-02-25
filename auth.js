const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secrets = require("./secrets");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: secrets.email,
    pass: secrets.pass
  }
});

router.post("/logout", (req, res) => {
  res.json({});
});
router.post("/signin/email", (req, res) => {
  const userdata = {
    id: 5421578,
    email: req.body.email
  };
  jwt.sign(userdata, "secret", { expiresIn: 2500000 }, function(err, token) {
    if (err) {
      return res.status(500).json({ error: "something went wrong" });
    }
    return res.json({ token });
  });
});
router.post("/signup/email", (req, res) => {
  const userdata = {
    email: req.body.email,
    authType: "manual",
    detailsForm: true
  };
  jwt.sign(userdata, "secret", { expiresIn: 2500000 }, function(err, token) {
    if (err) {
      return res.status(500).json({ error: "something went wrong" });
    }
    return res.json({ token });
  });
});

router.post("/signup/google", (req, res) => {
  const userdata = {
    email: "sathya@gmail.com",
    detailsForm: true
  };
  jwt.sign(userdata, "secret", { expiresIn: 2500000 }, function(err, token) {
    if (err) {
      return res.status(500).json({ error: "something went wrong" });
    }
    return res.json({ token });
  });
  return res.status(401).json({ error: "Error authenticating" });
});

router.post("/verify", (req, res) => {
  const vercode = 123456;
  if (req.body.code === vercode) {
    return res.json({ verified: true });
  } else {
    return res.status(401).json({ error: "incorret code" });
  }
});

router.post("/details", (req, res) => {
  if (req.body.keys().length >= 9) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: "all fields are mandatory" });
  }
});

module.exports = router;
