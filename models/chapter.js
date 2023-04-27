// Create a schema for the Chapter model. The schema will have the following properties:
// title: String
// index: Number
// summary: String
// body: String
// references: [Reference]
// part: Part
// exercises: [Exercise]
// published: Boolean

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Part = require('./part');
const Reference = require('./reference');
const Exercise = require('./exercise');
const User = require('./user');

// create schema
const ChapterSchema = new Schema({
    title: String,
    body: String,
    index: Number,
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    },
    references: [{  // references is an array of references
        type: Schema.Types.ObjectId,
        ref: 'Reference'
    }],
    exercises: [{  // exercises is an array of exercises
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }],
    published: Boolean
});

// export model
module.exports = mongoose.model('Chapter', ChapterSchema);
