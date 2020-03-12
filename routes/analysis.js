const router = require("express").Router();
const Data = require("../data");

router.get("/youtube-general", (req, res) => {
  setTimeout(() => {
    res.json(Data.ytgen);
  }, 500);
});
router.get("/youtube-user", (req, res) => {
  setTimeout(() => {
    res.json(Data.ytuser);
  }, 500);
});
router.get("/twitter-general", (req, res) => {
  setTimeout(() => {
    res.json(Data.twgen);
  }, 500);
});
router.get("/twitter-user", (req, res) => {
  setTimeout(() => {
    res.json(Data.twuser);
  }, 500);
});
router.get("/twitter-search", (req, res) => {
  setTimeout(() => {
    res.json(Data.twsearch);
  }, 500);
});
router.get("/leads", (req, res) => {
  setTimeout(() => {
    res.json(Data.leads);
  }, 500);
});
router.get("/trending", (req, res) => {
  setTimeout(() => {
    res.json(Data.trending);
  }, 1500);
});

module.exports = router;
