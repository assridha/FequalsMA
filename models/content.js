// Create a schema for the content model. The schema will have the following properties:
// title: String
// index: Number
// summary: String
// level: Number
// child: Content
// parent: Content
// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

// create schema
const contentSchema = new Schema({
    title: String,
    summary: String,
    index: Number,
    level: Number,
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Content'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Content'
    },
    path: String

});

contentSchema.plugin(deepPopulate);

// export model
module.exports = mongoose.model('Content', contentSchema);
