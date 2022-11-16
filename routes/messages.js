const router = require("express").Router();
let Message = require("../models/message");


// Create message
router.route("/add").post((req, res) => {
  const title = req.body.title;
  const message = req.body.message;

  const newMesaage = new Message({

      title,
      message

  })

  newMesaage.save().then(() => {
      res.json("Message Added")
  }).catch((err) => {
      console.log(err);
  })

})

module.exports = router;
