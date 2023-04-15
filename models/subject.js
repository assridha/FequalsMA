// Create a schema for the Subject model. The schema will have the following properties:
// title: String
// index: Number
// summary: String
// import required modules
// author: User
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

SubjectSchema.plugin(deepPopulate);

// export model
module.exports = mongoose.model('Subject', SubjectSchema);
