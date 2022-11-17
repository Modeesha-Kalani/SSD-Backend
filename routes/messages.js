const router = require("express").Router();
let Message = require("../models/message");
const Joi = require('joi');
const crypto = require ("crypto");
const algorithm = "aes-256-cbc"; 

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

    // generate 16 bytes of random data
    const initVector1 = crypto.randomBytes(16);
    const initVector2 = crypto.randomBytes(16);

    // protected data
    const encrptedMessage = message;
    const encryptedTitle = title

    // secret key generate 32 bytes of random data
    const Securitykey1 = crypto.randomBytes(32);
    const Securitykey2 = crypto.randomBytes(32);

    // the cipher function
    const cipher1 = crypto.createCipheriv(algorithm, Securitykey1, initVector1);
    const cipher2 = crypto.createCipheriv(algorithm, Securitykey2, initVector2);


    // encrypt the message and the title
    // input encoding
    // output encoding
    let encryptMsg = cipher1.update(encrptedMessage, "utf-8", "hex");
    let encryptTitle = cipher2.update(encryptedTitle, "utf-8", "hex");

    encryptMsg += cipher1.final("hex");
    encryptTitle += cipher2.final("hex");

    console.log(encryptMsg + " encryptMsg");
    console.log(encryptTitle + " encryptTitle")

    //Add data to model
    const newMesaage = new Message({

        title:encryptTitle,
        message:encryptMsg
  
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

        title: Joi.string().max(500).required(),
        message: Joi.string().max(500).required(),
       
    });

    return schema.validate({title,message});
}

module.exports = router;
