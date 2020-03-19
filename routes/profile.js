const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/profile-details", (req, res) => {
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
                if (user.username.length > 0) {
                  return res.json({ personalDetails });
                }
                jwt.sign(tokendata, "secret", { expiresIn: 2500000 }, function(
                  err,
                  token
                ) {
                  if (err) {
                    return res
                      .status(500)
                      .json({ server: { error: "something went wrong" } });
                  }
                  setTimeout(() => {
                    return res.json({ token: token, personalDetails });
                  }, 2000);
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

router.get("/profile-details", (req, res) => {
  const accounts = {
    youtube: [
      {
        name: "MKBHD",
        id: 1,
        subscribers: 5214782,
        views: 75412452,
        videos: 842
      },
      {
        name: "Dave2D",
        id: 2,
        subscribers: 521782,
        views: 7541245,
        videos: 872
      }
    ],
    twitter: [
      {
        name: "MKBHD",
        id: 3,
        followers: 7512451,
        following: 315,
        tweets: 1421
      }
    ]
  };
  jwt.verify(req.headers.authorization, "secret", function(err, decoded) {
    if (err) {
      return res
        .status(400)
        .json({ verify: { server: "internal server error" } });
    } else {
      User.findOne({ email: decoded.email })
        .then(user => {
          if (!user) {
            return res
              .status(400)
              .json({ details: { server: "internal server error" } });
          } else {
            console.log(user);
            const { password, date, _id, __v, ...other } = user._doc;
            setTimeout(() => {
              return res.json({
                accounts: accounts,
                personalDetails: { ...other }
              });
            }, 2000);
          }
        })
        .catch(err => {
          console.log("error", err);
          return res
            .status(400)
            .json({ details: { server: "internal server error" } });
        });
    }
  });
});

router.get("/connect/youtube", (req, res) => {
  return res.redirect("/profile");
});
router.get("/connect/twitter", (req, res) => {
  return res.redirect("/profile");
});

router.post("/switch-account", (req, res) => {
  return res.json(req.body);
});

router.get("/switch-account", (req, res) => {
  setTimeout(() => {
    return res.json({ platform: "youtube", id: 1 });
  }, 500);
});

module.exports = router;
