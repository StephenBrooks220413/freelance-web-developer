const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    description: String,
    email: String,
    datePosted:{
        type: Date,
        default: new Date()
    },
    url: String,
    image: String
})

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course