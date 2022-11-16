const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const path = require("path");
const Router = express.Router();
const asyncHandler = require('express-async-handler');

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
      const file = new File({
        title,
        description,
        file_path: path,
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