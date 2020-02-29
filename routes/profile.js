const router = require("express").Router();
const fs = require("fs");

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
  fs.readFile("personal.txt", (err, data) => {
    if (err) {
      console.log(err);
    }
    personalDetails = JSON.parse(data);
    res.json({ accounts, personalDetails });
  });
});

module.exports = router;
