// create a schema for the Exercise model. The schema will have the following properties:
// problem: String
// type: String
// options: [String]
// answerExplaination: String
// answerIndex: [Number]
// answerNumber: Number
// author: User

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const ExerciseSchema = new Schema({
    problem: String,
    type: String,
    figure: String,
    options: [String],
    answerExplaination: String,
    answerIndex: [Number],
    answerNumber: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// export model
module.exports = mongoose.model('Exercise', ExerciseSchema);