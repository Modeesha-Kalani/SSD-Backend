const router = require("express").Router();
let Message = require("../models/message");
const Joi = require('joi');
const bcrypt = require('bcryptjs');

// Create message
router.route("/add").post((req, res) => {
  const title = req.body.title;
  const message = req.body.message;

    //Validate
    const {error} = validate(title,message);
    if(error){
        return res.status(400).send({error: error.details[0].message})
    }
    else{

        const message = "message";
        const title = "title";
        //Hash message and title
        const salt = bcrypt.genSaltSync(10);
        const hashed_message = bcrypt.hashSync(message, salt);
        const hashed_title = bcrypt.hashSync(title, salt)

    //Add data to model
    const newMesaage = new Message({

        title: hashed_title,
        message: hashed_message
  
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
