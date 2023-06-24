// create a schema for the Exercise model. The schema will have the following properties:
// problem: String
// type: String
// options: [String]
// answerExplaination: String
// answerIndex: [Number]
// answerNumber: Number

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const ExerciseSchema = new Schema({
    problem: String,
    question: String,
    type: String,
    figure: String,
    options: [String],
    answerExplaination: String,
    answerIndex: [Number],
    answerNumber: Number,
    index: Number
});

// export model
module.exports = mongoose.model('Exercise', ExerciseSchema);