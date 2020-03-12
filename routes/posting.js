const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const upload = multer();

router.post("/posting/youtube", upload.any(), (req, res) => {
  fs.writeFile(
    "./videos/" + req.files[0].originalname,
    req.files[0].buffer,
    (err, resp) => {
      if (err) {
        return res
          .status(400)
          .json({ posting: { youtube: "internal error occured" } });
      }
      return res.status(200).json({ success: true });
    }
  );
});

router.post("/posting/twitter", (req, res) => {
  if (req.body.tweet.length > 0) {
    return res.json({ success: true });
  } else {
    return res
      .status(400)
      .json({ posting: { twitter: "internal server error" } });
  }
});

module.exports = router;
