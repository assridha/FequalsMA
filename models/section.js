// Create a schema for the Section model. The schema will have the following properties:
// title: String
// index: Number
// body: String
// chapter: Chapter

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Chapter = require('./chapter');

// create schema
const SectionSchema = new Schema({
    title: String,
    body: String,
    index: Number,
    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
    }
});

// export model
module.exports = mongoose.model('Section', SectionSchema);
