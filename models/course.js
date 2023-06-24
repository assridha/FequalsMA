// Mongoose model for creating a course

// Create a schema for the Course model. The schema will have the following properties:
// title: String
// description: String


// import required modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const CourseSchema = new Schema({
    title: String,
    description: String
});

// export model
module.exports = mongoose.model('Course', CourseSchema);

