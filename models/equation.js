// Mongoose model for creating an equation
//
// Create a schema for the Equation model. The schema will have the following properties:
// title: String
// expression: String
// author: User

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const EquationSchema = new Schema({
    title: String,
    expression: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// export model
module.exports = mongoose.model('Equation', EquationSchema);


