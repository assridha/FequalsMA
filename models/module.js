// Schema for module.
const mongoose = require('mongoose')

// define module schema
const moduleSchema = new mongoose.Schema({
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
  body: {
    type: Object,
    required: false,
    default: {}
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: false,
    default: null
  },
  metaData: {
    type: Object,
    required: false,
    default: {}
  }
})

// middleware to filter modules that are published when querying
moduleSchema.pre(/^find/, function (next) {
  this.find({ 'metaData.published': true })
  next()
})

// create module model
const Module = mongoose.model('Module', moduleSchema)

// export module model
module.exports = Module
