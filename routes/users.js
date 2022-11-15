const router = require('express').Router();
const { Router } = require('express');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Joi = require('joi');
let user = require("../models/user.js");


/**
 * 
 * Routes for CRUD
 * 
**/

//ADD
router.route("/").post((req, res)=>{

    //Get data
    const type = req.body.type;
    const emp_id = req.body.emp_id;
    const name = req.body.name;
    const nic = req.body.nic;
    const phone = req.body.phone;
    const email = req.body.email;


    //Validate
    const {error} = validate(emp_id, type, name, nic, phone, email);
    if(error){
        return res.status(400).send({error: error.details[0].message})
    }
    else{

    //Generate password
    const password = generator.generate({
        length: 10,
        numbers: true
    });

    //Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password, salt);

    //Add data to model
    const newuser = new user({
        emp_id,
        type,
        name,
        nic,
        phone,
        email,
        password:hashed_password
    });

    //Save to database
    newuser.save().then(()=>{
        //Send password to email
        sendPassword(email, password);
        res.status(200).send({status: "User added"});
    }).catch((err)=>{
        res.status(400).send({error: err.message});
        console.log(`Error: ${err}`);
    })
    }
});


//View All
router.route("/").get((req, res)=>{

    //Get all user data from databse
    user.find().then((data)=>{

        //Send data as json
        res.json(data);

    }).catch((err)=>{
        console.log(`Error: ${err}`);
    })
});


//View specific user
router.route("/:id").get(async (req, res)=>{
    let empId = req.params.id;
    console.log(empId);
    //Get user data from databse
    const emp = await user.findOne({emp_id: empId}).then((data)=>{
        res.status(200).send({status: "User fetched", data});
    }).catch((err)=>{
        console.log(`Error: ${err}`);
        res.status(500).send({status: "Error with get user", error: err.message});
    })
});


//Update user
router.route("/:id").put(async (req, res)=>{
    let empId = req.params.id;

    //Get data
    const {type, name, nic, phone, email,password} = req.body;

    
    //Validate
    const {error} = validate(empId, type, name, nic, phone, email);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    else{

    //Update user data
    const updateuser = {
        type,
        name,
        nic,
        phone,
        email,
        password
    }

    //Find by emp_id and update
    const update = await user.findOneAndUpdate({emp_id: empId}, updateuser).then(()=>{
        res.status(200).send({status: "User updated"});
    }
    ).catch((err)=>{
        console.log(`Error: ${err}`);
        res.status(500).send({status: "Error with updating data", error: err.message});
    })
    }
});


//Delete
router.route("/:id").delete(async (req, res) => {

    //Get ID
    let id = req.params.id;

    //Find by emp_id and delete
    await user.findOneAndDelete({emp_id: id}).then(()=>{
        res.status(200).send({status: "User deleted"});
    }
    ).catch((err)=>{
        console.log(`Error: ${err}`);
        res.status(500).send({status: "Error with deleting user", error: err.message});
    })
});


//Send password to email using nodemailer
function sendPassword(email, password) {
    //Create transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'codebusters.sliit@gmail.com',
            pass: 'pyddnaqmcghsocyz'
            // user: 'ssdsecapp123@gmail.com',
            // pass: 'ssdsec@123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    //Create mail options
    let mailOptions = {
        from: 'codebusters.sliit@gmail.com',
        to: email,
        subject: 'Password',
        text: 'Use this password for login',
        html: `<h3>Your password is</h3></br><h1>${password}</h1>`
    };

    //Send mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//Validate
function validate(emp_id, type, name, nic, phone, email){
    const schema = Joi.object({
        emp_id: Joi.string().min(6).required(),
        type: Joi.string().max(10).required(),
        name: Joi.string().min(3).required(),
        nic: Joi.string().min(10).required(),
        phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number is invalid.`}).required(),
        email: Joi.string().required().email(),
    });

    return schema.validate({emp_id, type, name, nic, phone, email});
}

module.exports = router;