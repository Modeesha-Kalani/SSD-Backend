const router = require("express").Router();
let Message = require("../models/message");
const Joi = require('joi');

// Create message
router.route("/add").post((req, res) => {
  const title = req.body.title;
  const message = req.body.message;

//   newMesaage.save().then(() => {
//       res.json("Message Added")
//   }).catch((err) => {
//       console.log(err);
//   })

    //Validate
    const {error} = validate(title,message);
    if(error){
        return res.status(400).send({error: error.details[0].message})
    }
    else{

    //Generate password
    // const password = generator.generate({
    //     length: 10,
    //     numbers: true
    // });

    //Add data to model
    const newMesaage = new Message({

        title,
        message
  
    })

    //Save to database
    newMesaage.save().then(()=>{
        res.status(200).send({status: "Message added"});
    }).catch((err)=>{
        res.status(400).send({error: err.message});
        console.log(`Error: ${err}`);
    })
    }
});

//Validate
function validate(title,message){
    const schema = Joi.object({

        title: Joi.string().max(30).required(),
        message: Joi.string().max(120).required(),
       
    });

    return schema.validate({title,message});
}

module.exports = router;
