const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const validator = require("validator");
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
    email: req.body.email,
    verified: false
  };
  let errors = {};
  if (!validator.isEmail(req.body.email)) {
    errors["email"] = "invalid email";
  }
  if (!validator.isLength(req.body.password, { min: 8 })) {
    errors["password"] = "password should be atleast 8 characters";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(402).json({ signin: errors });
  }
  jwt.sign(userdata, "secret", { expiresIn: 60 * 60 * 24 }, function(
    err,
    token
  ) {
    if (err) {
      return res.status(500).json({ server: "something went wrong" });
    }
    return res.json({ token });
  });
});
router.post("/signup/email", (req, res) => {
  const userdata = {
    email: req.body.email,
    authType: "manual",
    verified: false,
    detailsUpdated: false
  };
  let errors = {};
  if (!validator.isEmail(req.body.email)) {
    errors["email"] = "invalid email";
  }
  if (!validator.isLength(req.body.password, { min: 8 })) {
    errors["password"] = "password should be atleast 8 characters";
  }
  if (req.body.password !== req.body.confirmPassword) {
    errors["confirm"] = "passwords didn't match";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(402).json({ signup: errors });
  }
  jwt.sign(userdata, "secret", { expiresIn: 60 * 60 * 24 }, function(
    err,
    token
  ) {
    if (err) {
      return res.status(500).json({ server: "something went wrong" });
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

router.post("/verification", (req, res) => {
  const vercode = "123456";
  if (req.body.code === vercode) {
    const userdata = {
      email: req.body.email,
      authType: "manual",
      verified: true,
      detailsUpdated: false
    };
    jwt.sign(userdata, "secret", { expiresIn: 2500000 }, function(err, token) {
      if (err) {
        return res
          .status(500)
          .json({ server: { error: "something went wrong" } });
      }
      return res.json({ token });
    });
  } else {
    return res.status(401).json({ verify: { code: "incorret code" } });
  }
});

router.post("/details", (req, res) => {
  const usernames = ["sathya", "sathyareddy", "sathya9897"];
  const { username, pincode } = req.body;
  let errors = {};
  if (usernames.includes(username)) {
    errors["username"] = `${username} is taken`;
  }
  if (pincode.length !== 6) {
    errors["pincode"] = "please enter a valid pincode";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(402).json({ personalDetails: errors });
  }
  fs.writeFileSync("personal.txt", JSON.stringify(req.body), err => {
    if (err) console.log(err);
    console.log("file created");
  });
  const userdata = {
    email: req.body.email,
    authType: "manual",
    verified: true,
    detailsUpdated: true
  };
  res.json({ personalDetails: req.body });
  jwt.sign(userdata, "secret", { expiresIn: 2500000 }, function(err, token) {
    if (err) {
      return res
        .status(500)
        .json({ server: { error: "something went wrong" } });
    }
    return res.json({ token });
  });
});

module.exports = router;
