const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const path = require("path");
const Router = express.Router();
const asyncHandler = require('express-async-handler');
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + "--" + file.originalname);
  }
}); 


  const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')|| (file.mimetype).includes('pdf')|| (file.mimetype).includes('doc')|| (file.mimetype).includes('xls')){
        cb(null, true);
    } else{
        cb(null, false);
    }
};


let upload = multer({ 
  storage: storage,
   limits : {fileSize :  5000000
  },
  fileFilter:fileFilter


});



Router.post(
  '/',
  upload.single('file'),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const { path, mimetype } = req.file;

      // generate 16 bytes of random data
      const initVector = crypto.randomBytes(16);
      // protected data
      const enPath = path;
      // secret key generate 32 bytes of random data
      const Securitykey = crypto.randomBytes(32);
      // the cipher function
      const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
      // encrypt the message
      // input encoding
      // output encoding
      let encryptedData = cipher.update(enPath, "utf-8", "hex");
      encryptedData += cipher.final("hex");
      console.log("Encrypted message: " + encryptedData);

      const file = new File({
        title,
        description,
        file_path: encryptedData,
        file_mimetype: mimetype
      });
    

      const fileSaved = await file.save();
      if (fileSaved) {
        res.status(200).json({
          success: true,
          data: fileSaved
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

    } catch (error) {
      res.status(400).send('Error while uploading file. Try again later.');
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);
module.exports = Router;