const mongoose =  require('mongoose');

const schema = mongoose.Schema;

//Schema
const  userSchema = new schema ({
    type: {
        type: String,
        required: true
    },

    emp_id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    nic: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }
});

//Model
const user = mongoose.model('users', userSchema);

//Export module
module.exports = user;