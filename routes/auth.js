const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = require("../models/User");

router.post("/signup/email", (req, res) => {
  const { email, password, confirmPassword } = req.body;
  let errors = {};
  if (!validator.isEmail(email)) {
    errors["email"] = "invalid email";
  }
  if (!validator.isLength(password, { min: 8 })) {
    errors["password"] = "password should be atleast 8 characters";
  }
  if (password !== confirmPassword) {
    errors["confirm"] = "passwords didn't match";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ signup: errors });
  } else {
    User.findOne({ email })
      .then(user => {
        if (user) {
          return res
            .status(400)
            .json({ signup: { user: "user already exists" } });
        } else {
          const newUser = new User({
            email,
            password
          });
          //* create Salt and Hash
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save().then(user => {
                const userdata = {
                  email: user.email,
                  screen: "verify"
                };
                jwt.sign(userdata, "secret", { expiresIn: 60 * 2 }, function(
                  err,
                  token
                ) {
                  if (err) {
                    return res
                      .status(500)
                      .json({ signup: { server: "something went wrong" } });
                  }
                  return res.json({ token });
                });
              });
            });
          });
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ signup: { server: "something went wrong" } });
      });
  }
});

router.post("/signin/email", (req, res) => {
  const { email, password } = req.body;
  let errors = {};
  if (!validator.isEmail(email)) {
    errors["email"] = "invalid email";
  }
  if (!validator.isLength(password, { min: 8 })) {
    errors["password"] = "password should be atleast 8 characters";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ signin: errors });
  } else {
    User.findOne({ email }).then(user => {
      if (!user) {
        res.status(400).json({ signin: { user: "user does not exists" } });
      } else {
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            res
              .status(400)
              .json({ signin: { password: "incorrect password" } });
          } else {
            let userdata = {
              email: user.email
            };
            if (!user.verified) {
              userdata["screen"] = "verify";
            }
            if (user.verified && !user.username) {
              userdata["screen"] = "details";
            }
            jwt.sign(userdata, "secret", { expiresIn: 60 * 60 * 24 }, function(
              err,
              token
            ) {
              if (err) {
                return res
                  .status(500)
                  .json({ signin: { server: "something went wrong" } });
              }
              return res.json({ token });
            });
          }
        });
      }
    });
  }
});

router.post("/verification", (req, res) => {
  const vercode = "123456";
  if (req.body.code === vercode) {
    jwt.verify(req.headers.authorization, "secret", function(err, decoded) {
      if (err) {
        return res
          .status(400)
          .json({ verify: { server: "internal server error" } });
      } else {
        User.findOneAndUpdate(
          { email: decoded.email },
          { $set: { verified: true } }
        )
          .then(function(user) {
            if (!user) {
              return res
                .status(400)
                .json({ verify: { server: "internal server error" } });
            } else {
              User.findOne({ email: decoded.email }).then(function(user) {
                if (!user) {
                  return res
                    .status(400)
                    .json({ verify: { server: "internal server error" } });
                } else {
                  const userdata = {
                    email: user.email,
                    screen: "details"
                  };
                  jwt.sign(userdata, "secret", { expiresIn: 2500000 }, function(
                    err,
                    token
                  ) {
                    if (err) {
                      return res
                        .status(500)
                        .json({ server: { error: "something went wrong" } });
                    }
                    return res.json({ token });
                  });
                }
              });
            }
          })
          .catch(function(err) {
            console.log("error callback:", err);
            return res
              .status(400)
              .json({ verify: { server: "internal server error" } });
          });
      }
    });
  } else {
    return res.status(400).json({ verify: { code: "incorret code" } });
  }
});

router.get("/google", (req, res) => {
  return res.redirect("/authorizing");
});

router.get("/jwt-token", (req, res) => {
  setTimeout(() => {
    const tokendata = {
      email: "test31@gmail.com",
      screen: "details"
    };
    jwt.sign(tokendata, "secret", { expiresIn: 2500000 }, function(err, token) {
      if (err) {
        return res
          .status(500)
          .json({ server: { error: "something went wrong" } });
      }
      return res.json({ token });
    });
  }, 2000);
});

router.post("/forgot-password", (req, res) => {
  if (req.body.email.length === 0) {
    return res
      .status(400)
      .json({ forgot: { email: "incorrect email address" } });
  }
  setTimeout(() => {
    const tokendata = {
      email: req.body.email,
      screen: "update"
    };
    jwt.sign(tokendata, "secret", { expiresIn: 2500000 }, function(err, token) {
      if (err) {
        return res
          .status(500)
          .json({ server: { error: "something went wrong" } });
      }
      return res.json({ token });
    });
  }, 2000);
});

router.post("/update-password", (req, res) => {
  setTimeout(() => {
    if (req.body.code === "123456") {
      return res.json({ success: true });
    } else {
      return res.status(400).json({
        update: { code: "incorrect code", password: "password did not match" }
      });
    }
  }, 2000);
});

module.exports = router;
