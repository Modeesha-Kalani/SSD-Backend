const mongoose = require('mongoose');

const schema = mongoose.Schema;

const messageSchema = new schema({
    title : {
        type : String,
        required: true
    },
    message : {
        type : String,
        required: true
    }

})

const message = mongoose.model("Message",messageSchema);

module.exports = message;