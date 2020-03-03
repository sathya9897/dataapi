const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/details", (req, res) => {
  let personalDetails = null;
  const accounts = {
    youtube: [
      {
        name: "MKBHD",
        subscribers: 5214782,
        views: 75412452,
        videos: 842
      }
    ],
    twitter: [
      {
        name: "MKBHD",
        followers: 7512451,
        following: 315,
        tweets: 1421
      }
    ]
  };
  jwt.verify(req.headers.authorization, "secret", function(err, decode) {
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
            const { password, date, _id, ...other } = user;
            return res.json({ personalDetails: { ...other } });
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

module.exports = router;
