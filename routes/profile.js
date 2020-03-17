const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/details", (req, res) => {
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
            return res.json({
              accounts: accounts,
              personalDetails: { ...other }
            });
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

router.post("/switch-account", (req, res) => {
  return res.json(req.body);
});

router.get("/switch-account", (req, res) => {
  setTimeout(() => {
    return res.json({ platform: "youtube", id: 1 });
  }, 500);
});

module.exports = router;
