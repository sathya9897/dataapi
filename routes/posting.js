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
        return res.status(400).json({});
      }
      return res.status(200).json({});
    }
  );
});

module.exports = router;
