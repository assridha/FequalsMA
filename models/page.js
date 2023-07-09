// create a model for pages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pageSchema = new Schema({
    title: String,
    summary: String,
    category: String,
    content: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    published: Boolean
});

module.exports = mongoose.model('Page', pageSchema);