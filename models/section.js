// Create a schema for the Section model. The schema will have the following properties:
// title: String
// index: Number
// body: String
// chapter: Chapter
// equations: [Equation]
// author: User

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Chapter = require('./chapter');
const Equation = require('./equation');

// create schema
const SectionSchema = new Schema({
    title: String,
    body: String,
    index: Number,
    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
    },
    equations: [{
        type: Schema.Types.ObjectId,
        ref: 'Equation'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// export model
module.exports = mongoose.model('Section', SectionSchema);
