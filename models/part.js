// Create a schema for the Part model. The schema will have the following properties:
// title: String
// index: Number
// summary: String
// body: String
// subject: Subject
// image: String

// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subject = require('./subject');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

// create schema
const PartSchema = new Schema({
    title: String,
    summary: String,
    body: String,
    index: Number,
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    image: String
});

PartSchema.plugin(deepPopulate);

// export model
module.exports = mongoose.model('Part', PartSchema);
