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

router.post("/signup/google", (req, res) => {
  const userdata = {
    email: "sathya@gmail.com",
    detailsForm: true
  };
  jwt.sign(userdata, "secret", { expiresIn: 2500000 }, function(err, token) {
    if (err) {
      return res
        .status(500)
        .json({ googleSignup: { server: "something went wrong" } });
    }
    return res.json({ token });
  });
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

router.post("/details", (req, res) => {
  const usernames = ["sathya", "sathyareddy", "sathya9897"];
  const { username, pincode } = req.body;
  let errors = {};
  if (usernames.includes(username)) {
    errors["username"] = `${username} is taken`;
  }
  if (Object.keys(errors).length > 0) {
    return res.status(402).json({ personalDetails: errors });
  }
  jwt.verify(req.headers.authorization, "secret", function(err, decoded) {
    if (err) {
      return res
        .status(400)
        .json({ verify: { server: "internal server error" } });
    } else {
      User.findOneAndUpdate({ email: decoded.email }, { $set: { ...req.body } })
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
                let tokendata = {
                  email: user.email
                };
                const personalDetails = {
                  ...req.body
                };
                jwt.sign(tokendata, "secret", { expiresIn: 2500000 }, function(
                  err,
                  token
                ) {
                  if (err) {
                    return res
                      .status(500)
                      .json({ server: { error: "something went wrong" } });
                  }
                  return res.json({ token: token, personalDetails });
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
});

module.exports = router;
