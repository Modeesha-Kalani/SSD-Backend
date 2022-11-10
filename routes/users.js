const router = require('express').Router();
const { Router } = require('express');
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

    //Add data to model
    const newuser = new user({
        type,
        emp_id,
        name,
        nic,
        phone,
        email
    });

    //Save to database
    newuser.save().then(()=>{
        res.json("User Added");
    }).catch((err)=>{
        console.log(`Error: ${err}`);
    }) 

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
    const {type, emp_id, name, nic, phone, email} = req.body;

    //Update user data
    const updateuser = {
        type,
        emp_id,
        name,
        nic,
        phone,
        email
    }

    //Find by emp_id and update
    const update = await user.findOneAndUpdate({emp_id: empId}, updateuser).then(()=>{
        res.status(200).send({status: "User updated"});
    }
    ).catch((err)=>{
        console.log(`Error: ${err}`);
        res.status(500).send({status: "Error with updating data", error: err.message});
    })
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



module.exports = router;