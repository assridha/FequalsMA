// Create a schema for the Reference model. The schema will have the following properties:
// title: String
// index: Number
// authors: [String]
// url: String
// mediatype: String
// tags: [String]
// metastring: String
// author: User

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const ReferenceSchema = new Schema({
    title: String,
    authors: [String],
    url: String,
    mediatype: String,
    tags: [String],
    metastring: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// export model
module.exports = mongoose.model('Reference', ReferenceSchema);




