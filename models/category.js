// Schema for module. Module has following properties:
// title: String
// index: Number
// parent: Category

// import ES modules
const mongoose = require('mongoose')

// define module schema
const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  index: {
    type: Number,
    required: true,
    min: 0
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
    default: null
  },
  moduleSettings: {
    type: Array,
    required: false,
    default: []
  },
  metaData: {
    type: Object,
    required: false,
    default: {}
  },
})

// create category model
const Category = mongoose.model('Category', categorySchema)

// export category model
module.exports = Category
