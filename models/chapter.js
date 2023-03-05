// Create a schema for the Chapter model. The schema will have the following properties:
// title: String
// index: Number
// summary: String
// part: Part

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Part = require('./part');

// create schema
const ChapterSchema = new Schema({
    title: String,
    body: String,
    index: Number,
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    }
});

// export model
module.exports = mongoose.model('Chapter', ChapterSchema);
