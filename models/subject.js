// Create a schema for the Subject model. The schema will have the following properties:
// title: String
// index: Number
// summary: String
// published: Boolean
// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

// create schema
const SubjectSchema = new Schema({
    title: String,
    summary: String,
    body: String,
    index: Number,
    image: String,
    published: Boolean
});

SubjectSchema.plugin(deepPopulate);

// export model
module.exports = mongoose.model('Subject', SubjectSchema);
